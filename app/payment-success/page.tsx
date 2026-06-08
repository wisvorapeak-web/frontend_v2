"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { CheckCircle2, Printer } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { fetchApi } from "@/lib/api";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const regId = searchParams.get('id');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoDownloaded, setAutoDownloaded] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (regId) {
      fetchApi(`/registrations/${regId}`)
        .then(res => {
          setData(res);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [regId]);

  useEffect(() => {
    if (data && !autoDownloaded) {
      // Auto-trigger print dialog after 1.5 seconds
      const timer = setTimeout(() => {
        window.print();
        setAutoDownloaded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [data, autoDownloaded]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <main className="min-h-screen bg-midnight flex items-center justify-center text-white">Loading...</main>;
  }

  if (!data) {
    return <main className="min-h-screen bg-midnight flex flex-col items-center justify-center text-white">
      <p>Receipt not found.</p>
      <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-primary rounded-md">Go Home</button>
    </main>;
  }

  return (
    <main className="flex flex-col min-h-screen bg-midnight font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />
      
      <div className="no-print"><Navbar /></div>
      
      <div className="flex-1 flex flex-col items-center py-20 px-4">
        <div className="no-print text-center mb-10">
          <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-lg mb-4">
            Thank you for your payment. A receipt has been sent to your email.
          </p>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all">
            <Printer className="w-5 h-5" />
            Print / Download PDF Receipt
          </button>
        </div>

        {/* Printable Area */}
        <div id="printable-receipt" ref={printRef} className="w-full max-w-2xl bg-white text-black p-10 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">RECEIPT</h2>
              <p className="text-gray-500 mt-1">Order #{data._id?.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-primary">Wiswora</p>
              <p className="text-gray-500 text-sm mt-1">support@wiswora.com</p>
              <p className="text-gray-500 text-sm">{new Date(data.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
            <p className="font-bold text-lg text-gray-800">{data.name}</p>
            <p className="text-gray-600">{data.email}</p>
            {data.organization && <p className="text-gray-600">{data.organization}</p>}
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-bold text-gray-400 uppercase tracking-wider">Description</th>
                <th className="text-right py-3 text-sm font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 text-gray-800 font-medium">{data.package_name}</td>
                <td className="py-4 text-right text-gray-800 font-medium">Included</td>
              </tr>
              {data.accommodation_name && (
                <tr className="border-b border-gray-100">
                  <td className="py-4 text-gray-800">Accommodation: {data.accommodation_name}</td>
                  <td className="py-4 text-right text-gray-800">Included</td>
                </tr>
              )}
              {data.accompanying_guests > 0 && (
                <tr className="border-b border-gray-100">
                  <td className="py-4 text-gray-800">{data.accompanying_guests}x Accompanying Guest</td>
                  <td className="py-4 text-right text-gray-800">Included</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-end pt-4">
            <div className="w-1/2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-gray-800 font-medium">{data.payment_method}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">Status</span>
                <span className="text-emerald-500 font-bold">{data.payment_status}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                <span className="text-lg font-bold text-gray-800">Total Paid</span>
                <span className="text-2xl font-black text-gray-900">{data.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="no-print"><Footer /></div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-midnight flex items-center justify-center text-white">Loading...</main>}>
      <SuccessContent />
    </Suspense>
  );
}
