"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [speakers, setSpeakers] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/speakers').then(data => {
      setSpeakers(data.filter((s: any) => s.is_active !== false).sort((a: any, b: any) => a.display_order - b.display_order));
    }).catch(console.error);
  }, []);

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
              Speakers
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              World-renowned experts in agriculture and tech.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {speakers.map((speaker, i) => (
          <div key={speaker._id || i} className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center text-center group hover:border-primary/50 transition-colors shadow-sm">
            <div className="w-full aspect-square rounded-2xl bg-muted shadow-lg mb-6 overflow-hidden relative flex-shrink-0">
              {speaker.image_url ? (
                <img src={speaker.image_url} alt={speaker.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent mix-blend-overlay" />
              )}
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{speaker.name}</h3>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">{speaker.university || speaker.category}</p>
            {speaker.country && <p className="text-muted-foreground text-xs font-medium mb-3">{speaker.country}</p>}
            <p className="text-muted-foreground text-sm font-light line-clamp-4">{speaker.bio}</p>
          </div>
        ))}
      </div>
      {speakers.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No speakers currently available.
        </div>
      )}
    
        </div>
      </section>

      <Footer />
    </main>
  );
}
