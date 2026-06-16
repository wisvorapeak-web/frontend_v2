"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { fetchApi } from "@/lib/api";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";
import Script from "next/script";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function CustomPaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'PayPal'>('Razorpay');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const linkData = await fetchApi(`/custom-payment-links/${id}`);
        setPaymentLink(linkData);
        if (linkData.currency === 'USD') {
          setPaymentMethod('PayPal');
        } else {
          setPaymentMethod('Razorpay');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-midnight flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  if (!paymentLink || !paymentLink.is_active) {
    return (
      <main className="min-h-screen bg-midnight flex items-center justify-center text-white text-xl">
        Payment link is invalid or has expired.
      </main>
    );
  }

  const currencySymbol = paymentLink.currency === 'INR' ? '₹' : '$';
  const paypalCurrency = paymentLink.currency === 'INR' ? 'INR' : 'USD';

  const handleRazorpayPayment = async (registrationId: string) => {
    try {
      const orderData = await fetchApi('/payments/razorpay/create-order', {
        method: 'POST',
        body: JSON.stringify({ registration_id: registrationId, amount: paymentLink.amount, currency: paymentLink.currency })
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key_id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Wiswora Event",
        description: `Payment for ${paymentLink.title}`,
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
        organization: formData.organization || 'N/A',
        package_name: `Custom Payment: ${paymentLink.title}`,
        total_amount: paymentLink.amount,
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

  const createPayPalOrder = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill out your details first.');
      throw new Error('Form incomplete');
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      organization: formData.organization || 'N/A',
      package_name: `Custom Payment: ${paymentLink.title}`,
      total_amount: paymentLink.amount,
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
      body: JSON.stringify({ registration_id: registration._id, amount: paymentLink.amount, currency: paypalCurrency })
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

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: paypalCurrency }}>
      <main className="flex flex-col min-h-screen bg-midnight font-sans">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Navbar />
        
        <div className="pt-28 pb-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-10 text-center">
              Complete your <span className="text-primary">Payment</span>
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              
              <div className="space-y-8">
                <div className="bg-card border border-border p-8 rounded-3xl">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Payer Details</h2>
                  <form id="checkout-form" onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none" placeholder="john@example.com" />
                    </div>
                  </form>
                </div>

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
                    {paymentLink.currency === 'USD' && (
                      <div 
                        onClick={() => setPaymentMethod('PayPal')}
                        className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${paymentMethod === 'PayPal' ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}
                      >
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'PayPal' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-medium text-foreground">PayPal</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 p-8 rounded-3xl sticky top-24">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Payment Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex flex-col pb-4 border-b border-white/10">
                      <p className="font-bold text-white text-xl mb-1">{paymentLink.title}</p>
                      {paymentLink.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{paymentLink.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-8">
                    <span className="text-lg text-foreground">Total Due</span>
                    <span className="text-4xl font-black text-white">{currencySymbol}{paymentLink.amount}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Secure checkout processing
                  </div>

                  {paymentMethod === 'Razorpay' ? (
                    <button 
                      type="submit" 
                      form="checkout-form"
                      disabled={submitting || !formData.name || !formData.email}
                      className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ${currencySymbol}${paymentLink.amount}`}
                    </button>
                  ) : (
                    <div className="mt-4 relative z-0">
                      <div className="absolute inset-0 z-10" style={{ display: (formData.name && formData.email) ? 'none' : 'block' }} onClick={() => alert('Please fill out the form details first.')}></div>
                      <div className={(formData.name && formData.email) ? '' : 'opacity-50'}>
                        <PayPalButtons 
                          style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                          createOrder={createPayPalOrder}
                          onApprove={onPayPalApprove}
                          onError={() => {}}
                        />
                      </div>
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
