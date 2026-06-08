"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [dates, setDates] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/eventdates').then(data => {
      setDates(data.filter((d: any) => d.is_active !== false).sort((a: any, b: any) => a.display_order - b.display_order));
    }).catch(console.error);
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

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
              Key Dates
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Important timelines and schedules for the event.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
      <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {dates.map((item, i) => (
          <div key={item._id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary">
              <span className="w-3 h-3 bg-primary rounded-full"></span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold text-primary font-heading">{formatDate(item.date)}</div>
              </div>
              <div className="text-foreground font-bold text-lg mb-2">{item.event || item.title}</div>
              <div className="text-muted-foreground font-light">{item.description}</div>
            </div>
          </div>
        ))}
        {dates.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No dates currently available.
          </div>
        )}
      </div>
    
        </div>
      </section>

      <Footer />
    </main>
  );
}
