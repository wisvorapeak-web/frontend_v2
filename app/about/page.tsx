"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { CheckCircle2, Target, Globe, Lightbulb, ChevronRight } from "lucide-react";
import Image from "next/image";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function AboutPage() {
  const [content, setContent] = useState({
    title: "About The Summit",
    content: "Loading content..."
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetchApi('/sitecontent/about');
        if (res?.data) {
          setContent(prev => ({ ...prev, ...res.data }));
        }
      } catch (error) {
        console.error("Failed to load about content:", error);
      }
    };
    loadContent();
  }, []);

  const values = [
    { icon: Target, title: "Our Mission", desc: "To accelerate global business growth through strategic networking and innovation discovery." },
    { icon: Globe, title: "Global Reach", desc: "Connecting enterprise leaders across 30+ countries to foster international partnerships." },
    { icon: Lightbulb, title: "Innovation", desc: "Showcasing the latest technologies and sustainable solutions shaping the future." }
  ];

  const reasons = [
    "Access to exclusive VIP networking lounges",
    "Direct engagement with 500+ global brands",
    "Over 120+ keynote sessions and panel discussions",
    "B2B matchmaking and scheduled meetings"
  ];

  return (
    <main className="flex flex-col min-h-screen bg-midnight text-white overflow-x-hidden">
      <Navbar />
      
      {/* Page Header (Hero) */}
      <section className="pt-40 pb-24 relative">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/80 to-midnight" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-ascendix/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ascendix/30 bg-ascendix/10 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-ascendix animate-pulse" />
              <span className="text-ascendix text-xs font-bold tracking-widest uppercase">
                Welcome to ASFAA-2026
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 leading-tight">
              {content.title.split(' ').slice(0, -1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-ascendix to-ice">{content.title.split(' ').slice(-1)}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
              The premier destination for industry pioneers, innovators, and decision-makers to curate an ecosystem that accelerates global growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Content Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-ascendix/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="prose prose-lg prose-invert max-w-none">
              {content.content.split('\n').map((paragraph, idx) => {
                if (!paragraph.trim()) return null;
                // Make the first paragraph slightly larger to act as a lead
                if (idx === 0) {
                  return <p key={idx} className="text-xl md:text-2xl font-light text-white/90 leading-relaxed mb-8">{paragraph}</p>;
                }
                return <p key={idx} className="text-white/70 font-light leading-relaxed mb-6">{paragraph}</p>;
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-ascendix tracking-widest uppercase mb-3">Our DNA</h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold">Driving The Future</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="bg-slate-dark/50 p-8 rounded-2xl border border-white/5 hover:border-ascendix/30 hover:bg-slate-dark transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-ascendix/10 flex items-center justify-center text-ascendix mb-6 group-hover:scale-110 transition-transform">
                  <val.icon size={32} />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-4">{val.title}</h3>
                <p className="text-white/60 font-light leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Attend Section */}
      <section className="py-24 bg-gradient-to-t from-slate-dark to-midnight relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-dark border border-white/10 relative group">
                <Image src="/hero.png" alt="Summit Overview" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-tr from-midnight/80 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                    <div className="text-4xl font-heading font-bold text-white mb-1">500+</div>
                    <div className="text-ascendix font-medium uppercase tracking-wider text-sm">Global Delegates Expected</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-sm font-semibold text-ascendix tracking-widest uppercase mb-3">
                Experience The Difference
              </h2>
              <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8">
                Why Attend ASFAA-2026?
              </h3>
              
              <p className="text-white/70 text-lg mb-10 leading-relaxed font-light">
                Whether you are looking to source new products, establish strategic partnerships, or gain insights into future trends, ASFAA-2026 provides a comprehensive platform for enterprise transformation.
              </p>
              
              <ul className="space-y-6 mb-12">
                {reasons.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-ascendix/20 flex flex-shrink-0 items-center justify-center mt-1 border border-ascendix/30">
                      <CheckCircle2 className="text-ascendix" size={16} />
                    </div>
                    <span className="text-white/90 text-lg font-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-summit to-ascendix hover:opacity-90 rounded-full text-white font-bold tracking-wider uppercase text-sm transition-all hover:shadow-[0_0_20px_rgba(44,200,229,0.3)] group">
                Register Today
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
