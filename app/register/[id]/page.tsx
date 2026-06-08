"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { fetchApi } from "@/lib/api";
import { Loader2, ShieldCheck, CheckCircle2, CreditCard } from "lucide-react";
import Script from "next/script";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();

  const [basePackage, setBasePackage] = useState<any>(null);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [guestPackage, setGuestPackage] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'PayPal'>('Razorpay');

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
  });
  const [selectedAccId, setSelectedAccId] = useState<string>("");
  const [guestCount, setGuestCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pkg = await fetchApi(`/pricings/${id}`);
        setBasePackage(pkg);

        const allPackages = await fetchApi('/pricings');
        const accs = allPackages.filter((p: any) => p.is_active && p.category === 'Accommodation');
        setAccommodations(accs);

        const guestPkg = allPackages.find((p: any) => p.is_active && p.name.includes('Accompanying Guest'));
        if (guestPkg) setGuestPackage(guestPkg);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const selectedAcc = accommodations.find(a => a._id === selectedAccId);
  const basePrice = basePackage?.amount || 0;
  const accPrice = selectedAcc?.amount || 0;
  const guestPrice = guestPackage ? (guestPackage.amount * guestCount) : 0;
  const totalPrice = basePrice + accPrice + guestPrice;
  
  const displayCurrency = basePackage?.currency || 'USD';
  let paypalCurrency = displayCurrency;
  if (displayCurrency === '$') paypalCurrency = 'USD';
  else if (displayCurrency === '€') paypalCurrency = 'EUR';
  else if (displayCurrency === '₹') paypalCurrency = 'INR';
  else if (displayCurrency === '£') paypalCurrency = 'GBP';
  else if (paypalCurrency.length !== 3) paypalCurrency = 'USD';

  // RAZORPAY INTEGRATION
  const handleRazorpayPayment = async (registrationId: string) => {
    try {
      const orderData = await fetchApi('/payments/razorpay/create-order', {
        method: 'POST',
        body: JSON.stringify({ registration_id: registrationId, amount: totalPrice, currency: paypalCurrency })
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key_id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Wiswora Event",
        description: `Registration for ${basePackage.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const res = await fetchApi('/payments/razorpay/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            router.push('/payment-success?id=' + res.registration_id);
          } catch (error) {
            await fetchApi('/payments/failed', { method: 'POST', body: JSON.stringify({ gateway_order_id: orderData.id, error_details: 'Verification failed on server' }) });
            router.push('/payment-failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: { color: "#2CC8E5" },
        modal: {
          ondismiss: async function() {
            await fetchApi('/payments/failed', { method: 'POST', body: JSON.stringify({ gateway_order_id: orderData.id, error_details: 'User closed the checkout popup' }) });
            router.push('/payment-failed');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async function (response: any) {
        await fetchApi('/payments/failed', {
          method: 'POST',
          body: JSON.stringify({
            gateway_order_id: response.error.metadata.order_id,
            error_details: response.error
          })
        });
        router.push('/payment-failed');
      });
      rzp.open();
    } catch (error) {
      alert("Failed to initialize Razorpay payment.");
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod !== 'Razorpay') return;
    
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        package_name: basePackage.name,
        accommodation_name: selectedAcc ? selectedAcc.name : null,
        accompanying_guests: guestCount,
        total_amount: totalPrice,
        status: 'Pending',
        payment_status: 'Pending',
        payment_method: 'Razorpay'
      };

      const registration = await fetchApi('/registrations', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      await handleRazorpayPayment(registration._id);
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
      setSubmitting(false);
    }
  };

  // PAYPAL INTEGRATION
  const createPayPalOrder = async () => {
    // Basic validation
    if (!formData.name || !formData.email) {
      alert('Please fill out the form details first.');
      throw new Error('Form incomplete');
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      organization: formData.organization,
      package_name: basePackage.name,
      accommodation_name: selectedAcc ? selectedAcc.name : null,
      accompanying_guests: guestCount,
      total_amount: totalPrice,
      status: 'Pending',
      payment_status: 'Pending',
      payment_method: 'PayPal'
    };

    const registration = await fetchApi('/registrations', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const orderData = await fetchApi('/payments/paypal/create-order', {
      method: 'POST',
      body: JSON.stringify({ registration_id: registration._id, amount: totalPrice, currency: paypalCurrency })
    });
    
    return orderData.id;
  };

  const onPayPalApprove = async (data: any, actions: any) => {
    try {
      const res = await fetchApi('/payments/paypal/capture', {
        method: 'POST',
        body: JSON.stringify({ orderID: data.orderID })
      });
      router.push('/payment-success?id=' + res.registration_id);
    } catch (error) {
      await fetchApi('/payments/failed', { method: 'POST', body: JSON.stringify({ gateway_order_id: data.orderID, error_details: 'Capture failed on server' }) });
      router.push('/payment-failed');
    }
  };

  const onPayPalCancel = async (data: any) => {
    await fetchApi('/payments/failed', { method: 'POST', body: JSON.stringify({ gateway_order_id: data.orderID, error_details: 'User cancelled PayPal checkout' }) });
    router.push('/payment-failed');
  };

  const onPayPalError = async (err: any) => {
    console.error("PayPal Error:", err);
    router.push('/payment-failed');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-midnight flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  if (!basePackage) {
    return (
      <main className="min-h-screen bg-midnight flex items-center justify-center text-white">
        Package not found.
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-midnight flex flex-col items-center justify-center text-center px-4">
        <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Registration Successful!</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Thank you for registering. We have successfully processed your payment.
        </p>
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold">
          Return to Home
        </button>
      </main>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: paypalCurrency }}>
      <main className="flex flex-col min-h-screen bg-midnight font-sans">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Navbar />
        
        <div className="pt-20 pb-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-10 text-center">
              Complete your <span className="text-primary">Registration</span>
            </h1>

            <div className="grid lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-7 space-y-8">
                
                <div className="bg-card border border-border p-8 rounded-3xl">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Attendee Details</h2>
                  <form id="checkout-form" onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none" placeholder="John Doe" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none" placeholder="john@example.com" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-foreground mb-1">Organization / University</label>
                        <input type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none" placeholder="MIT" />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="bg-card border border-border p-8 rounded-3xl">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Optional Add-ons</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Accommodation Package</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                          onClick={() => setSelectedAccId("")}
                          className={`cursor-pointer border p-5 rounded-xl flex flex-col justify-between transition-all ${!selectedAccId ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-background hover:border-primary/50'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-foreground">No Accommodation</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${!selectedAccId ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                              {!selectedAccId && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                            </div>
                          </div>
                          <span className="text-muted-foreground">$0</span>
                        </div>
                        {accommodations.map(acc => (
                          <div 
                            key={acc._id}
                            onClick={() => setSelectedAccId(acc._id)}
                            className={`cursor-pointer border p-5 rounded-xl flex flex-col justify-between transition-all ${selectedAccId === acc._id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-background hover:border-primary/50'}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-foreground pr-2 leading-tight">{acc.name}</span>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${selectedAccId === acc._id ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                {selectedAccId === acc._id && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                              </div>
                            </div>
                            <span className="font-bold text-foreground">+{acc.currency}{acc.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {guestPackage && (
                      <div className="pt-4 border-t border-border">
                        <label className="block text-sm font-medium text-foreground mb-2">Accompanying Guests</label>
                        <p className="text-muted-foreground text-sm mb-4">{guestPackage.description} (+{guestPackage.currency}{guestPackage.amount} per guest)</p>
                        <div className="flex items-center gap-4">
                          <button type="button" onClick={() => setGuestCount(Math.max(0, guestCount - 1))} className="w-10 h-10 rounded-lg bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 font-bold">-</button>
                          <span className="text-xl font-bold text-white w-4 text-center">{guestCount}</span>
                          <button type="button" onClick={() => setGuestCount(guestCount + 1)} className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 font-bold">+</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-card border border-border p-8 rounded-3xl">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Payment Method</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setPaymentMethod('Razorpay')}
                      className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${paymentMethod === 'Razorpay' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}
                    >
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'Razorpay' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-medium text-foreground">Razorpay</span>
                    </div>
                    <div 
                      onClick={() => setPaymentMethod('PayPal')}
                      className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${paymentMethod === 'PayPal' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}
                    >
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'PayPal' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-medium text-foreground">PayPal</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="lg:col-span-5">
                <div className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 p-8 rounded-3xl sticky top-24">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-start pb-4 border-b border-white/10">
                      <div>
                        <p className="font-bold text-white">{basePackage.name}</p>
                        <p className="text-xs text-muted-foreground">{basePackage.category}</p>
                      </div>
                      <span className="font-medium text-white">{displayCurrency}{basePrice}</span>
                    </div>

                    {selectedAcc && (
                      <div className="flex justify-between items-start pb-4 border-b border-white/10">
                        <div>
                          <p className="font-medium text-foreground">{selectedAcc.name}</p>
                          <p className="text-xs text-muted-foreground">Accommodation</p>
                        </div>
                        <span className="font-medium text-white">+{displayCurrency}{accPrice}</span>
                      </div>
                    )}

                    {guestCount > 0 && (
                      <div className="flex justify-between items-start pb-4 border-b border-white/10">
                        <div>
                          <p className="font-medium text-foreground">{guestCount}x Accompanying Guest</p>
                          <p className="text-xs text-muted-foreground">Optional Add-on</p>
                        </div>
                        <span className="font-medium text-white">+{displayCurrency}{guestPrice}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-8">
                    <span className="text-lg text-foreground">Total Due</span>
                    <span className="text-4xl font-black text-white">{displayCurrency}{totalPrice}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Secure checkout processing
                  </div>

                  {paymentMethod === 'Razorpay' ? (
                    <button 
                      type="submit" 
                      form="checkout-form"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ${displayCurrency}${totalPrice}`}
                    </button>
                  ) : (
                    <div className="mt-4">
                      <PayPalButtons 
                        style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                        createOrder={createPayPalOrder}
                        onApprove={onPayPalApprove}
                        onCancel={onPayPalCancel}
                        onError={onPayPalError}
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </PayPalScriptProvider>
  );
}
