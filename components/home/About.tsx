"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/api";

export default function About() {
  const [content, setContent] = useState({
    title: "About The Summit",
    content: `Greetings from ASFAA-2026!

Ascendix Summit: Food, AgriTech & Animal Science (ASFAA-2026) is a premier global platform uniting leaders, innovators, researchers, policymakers, and investors across the food, agriculture, and animal science ecosystems.

Scheduled for November 18–20, 2026 in Singapore, the summit will spotlight cutting-edge advancements shaping the future of sustainable food systems and agri-innovation.`
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetchApi("/sitecontent/about");

        if (res?.data) {
          setContent((prev) => ({
            ...prev,
            ...res.data,
          }));
        }
      } catch (error) {
        console.error("Failed to load about content:", error);
      }
    };

    loadContent();
  }, []);

  const benefits = [
    "Unparalleled networking opportunities with global leaders",
    "Discover cutting-edge innovations and technologies",
    "Gain actionable insights from industry visionaries",
    "Source new products and build strategic partnerships",
  ];

  return (
    <section className="py-12 bg-midnight relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-summit/10 to-transparent z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-dark border border-white/10 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-midnight/80 to-transparent z-10" />

                <Image
                  src="/about.jpeg"
                  alt="About Ascendix Summit"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-sm font-semibold text-ascendix tracking-widest uppercase mb-3">
              {content.title}
            </h2>

            <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 leading-tight">
              Ascendix Summit: Food, AgriTech &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ice to-ascendix">
                Animal Science
              </span>
            </h3>

            <div className="flex flex-wrap gap-4 mb-6">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/90 border border-white/20">
                ASFAA-2026
              </span>

              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/90 border border-white/20">
                November 18-20, 2026
              </span>

              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/90 border border-white/20">
                Singapore
              </span>
            </div>

            <div className="space-y-4 text-white/70 text-base leading-relaxed font-light mb-8 max-h-96 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {content.content
                ?.split("\n")
                .filter((paragraph) => paragraph.trim())
                .map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
            </div>

            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-ascendix mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-white/80">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-ascendix font-medium hover:text-white transition-colors group"
            >
              Discover Our Vision
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}