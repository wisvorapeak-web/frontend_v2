"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/90 to-summit/40 z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6">
              More Info
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Additional resources for partners.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
      <div className="bg-card border border-border rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-3xl font-bold">?</div>
        <h3 className="text-2xl font-heading font-bold text-foreground mb-4">Need Custom Sponsorship?</h3>
        <p className="text-muted-foreground font-light mb-8">
          Don't see a package that perfectly fits your brand's goals? Our partnership team can craft a bespoke experience tailored to your specific audience targeting and branding needs.
        </p>
        <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:shadow-[0_0_20px_rgba(44,200,229,0.4)] transition-all">
          Contact Our Partnership Team
        </button>
      </div>
    
        </div>
      </section>

      <Footer />
    </main>
  );
}
