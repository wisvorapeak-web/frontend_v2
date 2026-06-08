"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function EventLeaders() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/teammembers').then(data => {
      setLeaders(data.filter((t: any) => t.category === 'Leader' && t.is_active !== false).sort((a: any, b: any) => a.display_order - b.display_order));
    }).catch(console.error);
  }, []);

  if (leaders.length === 0) return null;

  return (
    <section className="py-12 bg-background relative border-t border-border">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">Visionaries</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Leaders</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leaders.slice(0, 8).map((leader, i) => (
            <motion.div key={leader._id || i} className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center text-center group hover:border-primary/50 transition-colors shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-full aspect-square rounded-2xl bg-muted shadow-lg mb-6 overflow-hidden relative flex-shrink-0">
                {leader.image_url ? (
                  <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                )}
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{leader.name}</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">{leader.role || leader.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
