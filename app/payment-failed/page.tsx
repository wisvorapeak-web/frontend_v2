"use client";

import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen bg-midnight font-sans">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <XCircle className="w-24 h-24 text-red-500 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Payment Failed</h1>
        <p className="text-muted-foreground max-w-md mb-8 text-lg">
          We couldn't process your payment. This could be due to a declined card, insufficient funds, or the transaction being cancelled.
        </p>
        <div className="flex gap-4">
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-card border border-border text-foreground hover:bg-muted rounded-lg font-bold transition-all">
            Return to Home
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
