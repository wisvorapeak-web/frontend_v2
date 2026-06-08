"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function BrochuresPage() {
  const [brochures, setBrochures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrochures = async () => {
      try {
        const data = await fetchApi('/brochures');
        setBrochures(data || []);
      } catch (error) {
        console.error("Error fetching brochures:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrochures();
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
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
              Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-ascendix to-ice">Brochures</span>
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Explore our collection of brochures to learn more about the event, sponsorship plans, and other essential details.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse">
              Loading brochures...
            </div>
          ) : brochures.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Brochures Available</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brochures.map((brochure, index) => (
                <motion.div
                  key={brochure._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/30 transition-colors group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-2 min-h-[56px]">{brochure.title}</h3>
                  <a
                    href={brochure.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-auto py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <Download size={18} />
                    Download PDF
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
