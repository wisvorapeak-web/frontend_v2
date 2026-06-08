"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const res = await fetchApi('/faqs');
        if (res && res.length > 0) {
          // Filter out inactive and sort by order
          const activeFaqs = res.filter((f: any) => f.isActive).sort((a: any, b: any) => a.order - b.order);
          setFaqs(activeFaqs);
        }
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      }
    };
    loadFaqs();
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="py-24 bg-midnight relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-ascendix tracking-widest uppercase mb-3">FAQ</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Frequently Asked Questions
          </h3>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq: any, index: number) => {
            const isOpen = openIndex === index;

            return (
              <motion.div 
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-dark/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-medium text-white pr-8">{faq.question}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-ascendix/20' : ''}`}>
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-ascendix' : 'text-white/50'}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-white/70 font-light leading-relaxed border-t border-white/5 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
