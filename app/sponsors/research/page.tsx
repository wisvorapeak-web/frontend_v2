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
              Research Papers
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Academic and industry publications.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-colors shadow-sm group">
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1 block">Whitepaper</span>
              <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">The Economic Impact of AI in Farming - 2026 Report</h3>
              <p className="text-muted-foreground text-sm font-light mt-1">Published by Global AgriTech Institute</p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium shrink-0">
              Download PDF
            </button>
          </div>
        ))}
      </div>
    
        </div>
      </section>

      <Footer />
    </main>
  );
}
