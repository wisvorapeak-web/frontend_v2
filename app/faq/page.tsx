"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What are the dates for ASFAA-2026?",
      a: "ASFAA-2026 will take place from April 13th to April 15th, 2027 in Amsterdam, Netherlands."
    },
    {
      q: "Who should attend the summit?",
      a: "The summit is designed for industry leaders, innovators, policymakers, agricultural professionals, tech entrepreneurs, and investors in the food, agri-tech, and animal science sectors."
    },
    {
      q: "How can I book an exhibition booth?",
      a: "You can book an exhibition booth by navigating to the 'Book a Booth' page from the main menu, selecting your preferred tier, and submitting an inquiry. Our team will contact you within 24 hours."
    },
    {
      q: "Is there a virtual attendance option?",
      a: "Yes, we offer a Digital Pass for attendees who cannot travel. It includes access to livestreamed keynotes, digital networking, and on-demand session recordings."
    },
    {
      q: "What is the dress code?",
      a: "The dress code for ASFAA-2026 is Business Formal or Smart Casual. National dress is also welcome and appropriate."
    },
    {
      q: "How do I download the event app?",
      a: "The official ASFAA-2026 mobile app will be available on the Apple App Store and Google Play Store one month prior to the event."
    }
  ];

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
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-ascendix to-ice">Questions</span>
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Find answers to the most common questions about attending, exhibiting, and sponsoring at ASFAA-2026.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <h3 className={`text-lg font-heading font-bold transition-colors ${openIndex === idx ? 'text-primary' : 'text-foreground'}`}>
                    {faq.q}
                  </h3>
                  <ChevronDown 
                    className={`text-muted-foreground transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} 
                    size={20} 
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="p-6 pt-0 text-muted-foreground font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
