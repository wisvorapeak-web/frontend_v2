"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [chairs, setChairs] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/organizers?category=Chairs').then(data => {
      setChairs(data.filter((t: any) => t.is_active !== false));
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
              Our Chairs
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              The esteemed chairs guiding the scientific program and vision of our summit.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chairs.map((chair, i) => (
          <div key={chair._id || i} className="flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-full aspect-square bg-muted relative overflow-hidden flex-shrink-0">
              {chair.image_url ? (
                <img src={chair.image_url} alt={chair.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-800">
                  <span className="text-6xl font-bold opacity-30">{chair.name?.charAt(0) || '?'}</span>
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-1">{chair.name}</h3>
              <p className="text-primary text-sm font-medium mb-3">{chair.role}</p>
              {(chair.affiliation || chair.location) && (
                <p className="text-muted-foreground text-sm font-light leading-relaxed mb-6">
                  {chair.affiliation}{chair.location ? `, ${chair.location}` : ''}
                </p>
              )}
              <div className="mt-auto">
                {chair.linkedin_url && (
                  <a href={chair.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-medium border border-primary/50 text-primary px-4 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">LinkedIn Profile</a>
                )}
              </div>
            </div>
          </div>
        ))}
        {chairs.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            No chairs currently available.
          </div>
        )}
      </div>
    
        </div>
      </section>

      <Footer />
    </main>
  );
}
