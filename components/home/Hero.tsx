"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download, Users, Globe2, Building2, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import { fetchApi } from "@/lib/api";

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState({
    title: "Ascendix Summit: Food, Agri-Tech & Animal Science",
    subtitle: "Led by the future of sustainable food systems and agri-innovation.",
    dateText: "April 13-15, 2027",
    locationText: "Amsterdam, Netherlands",
    bgImage: "/hero.png"
  });

  useEffect(() => {
    setMounted(true);
    
    // Fetch dynamic content
    const loadContent = async () => {
      try {
        const res = await fetchApi('/sitecontent/hero');
        if (res?.data) {
          setContent(prev => ({ ...prev, ...res.data }));
        }
      } catch (error) {
        console.error("Failed to load hero content:", error);
      }
    };
    loadContent();

    const targetDate = new Date("2026-11-18T00:00:00").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-midnight pt-20">
      {/* Background Image & Overlay Gradient */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={content.bgImage || "/hero.png"} 
          alt={content.title || "Ascendix Summit"}
          fill
          priority
          className="object-cover object-center opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-midnight/60 via-midnight/40 to-summit/30 z-10" />
      </div>

      <div className="container mx-auto px-6 relative z-20 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-ascendix/30 bg-ascendix/10 backdrop-blur-md"
          >
            <span className="text-ascendix text-sm font-semibold tracking-wider uppercase">
            ASFAA-2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white mb-6 leading-tight"
          >
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto font-light"
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-white/90 font-medium"
          >
            <div className="flex items-center gap-2">
              <CalendarDays className="text-ascendix" size={20} />
              <span>{content.dateText}</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <MapPin className="text-ascendix" size={20} />
              <span>{content.locationText}</span>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center gap-4 md:gap-8 mb-12"
          >
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(44,200,229,0.15)]">
                  <span className="text-2xl md:text-3xl font-heading font-bold text-white">
                    {mounted ? String(item.value).padStart(2, '0') : "00"}
                  </span>
                </div>
                <span className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-summit to-ascendix text-white font-medium hover:shadow-[0_0_20px_rgba(44,200,229,0.4)] transition-all flex items-center gap-2 group"
            >
              Register Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sponsors/plans"
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Building2 size={18} />
              Become a Sponser
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
