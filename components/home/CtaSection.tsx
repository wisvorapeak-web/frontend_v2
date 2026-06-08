"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-12 relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-midnight z-0" />
      <div className="absolute inset-0 bg-[url('/hero.png')] opacity-10 mix-blend-overlay bg-cover bg-center z-0" />
      
      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-6"
        >
          Ready to Shape the Future of Food & Agriculture?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-xl mb-10 font-light"
        >
          Join thousands of industry leaders, policymakers, and innovators at ASFAA-2026. Secure your spot today to guarantee your participation.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link href="/register" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:shadow-[0_0_20px_rgba(44,200,229,0.4)] transition-all flex items-center gap-2 group">
            Register Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/contact" className="px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/10 font-bold transition-all">
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
