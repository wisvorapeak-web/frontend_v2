"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { fetchApi } from "@/lib/api";
import Image from "next/image";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetchApi('/testimonials');
        if (res && res.length > 0) {
          setTestimonials(res.filter((t: any) => t.isActive));
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      }
    };
    loadTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-midnight to-slate-dark relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-ascendix tracking-widest uppercase mb-3">Testimonials</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            What Our Attendees Say
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t: any, index: number) => (
            <motion.div 
              key={t._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 relative hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/10" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-ascendix text-ascendix" />
                ))}
              </div>

              <p className="text-white/80 font-light leading-relaxed mb-8 relative z-10">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4">
                {t.avatar ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden relative">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-summit/30 flex items-center justify-center border border-ascendix/30 text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest mt-1">{t.role}, {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
