"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/teammembers').then(data => {
      setLeaders(data.filter((t: any) => t.category === 'Leader' && t.is_active !== false).sort((a: any, b: any) => a.display_order - b.display_order));
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
              Our Leaders
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              The visionaries leading the summit ecosystem.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
      <div className="space-y-12">
        {leaders.map((leader, i) => (
          <div key={leader._id || i} className="flex flex-col md:flex-row gap-8 bg-card border border-border rounded-3xl overflow-hidden p-6 md:p-8">
            <div className="w-full md:w-1/3 aspect-square bg-muted rounded-2xl overflow-hidden flex-shrink-0">
              {leader.image_url && <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />}
            </div>
            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <h3 className="text-3xl font-heading font-bold text-foreground mb-2">{leader.name}</h3>
              <p className="text-primary text-lg font-medium mb-6">{leader.role}</p>
              <p className="text-muted-foreground font-light leading-relaxed mb-6">
                {leader.bio}
              </p>
              {leader.linkedin_url && (
                <a href={leader.linkedin_url} target="_blank" rel="noopener noreferrer" className="self-start text-sm font-medium border border-primary text-primary px-6 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">LinkedIn Profile</a>
              )}
            </div>
          </div>
        ))}
        {leaders.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No leaders currently available.
          </div>
        )}
      </div>
    
        </div>
      </section>

      <Footer />
    </main>
  );
}
