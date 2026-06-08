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
              Classes & Workshops
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Interactive learning sessions and technical deep-dives.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-sm">
            <div className="w-full md:w-48 h-32 bg-muted rounded-xl flex-shrink-0"></div>
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">Workshop</span>
                <span className="text-muted-foreground text-sm font-medium">Room A - 10:00 AM</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Masterclass: IoT Implementation in Greenhouses</h3>
              <p className="text-muted-foreground font-light mb-4 text-sm">A hands-on session demonstrating how to wire, program, and deploy soil moisture sensors connected to a central dashboard.</p>
              <button className="text-primary font-medium hover:underline text-sm">Register for Class &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    
        </div>
      </section>

      <Footer />
    </main>
  );
}
