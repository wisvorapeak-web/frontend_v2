"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/sponsors').then(setSponsors).catch(console.error);
  }, []);

  const titleSponsors = sponsors.filter(s => s.tier?.toLowerCase().includes('title') || s.tier?.toLowerCase() === 'platinum');
  const goldSponsors = sponsors.filter(s => s.tier?.toLowerCase().includes('gold'));
  const silverSponsors = sponsors.filter(s => s.tier?.toLowerCase().includes('silver') || s.tier?.toLowerCase().includes('bronze'));

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
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-ascendix to-ice">Global Partners</span>
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              ASFAA-2026 is made possible by the vision and support of our industry-leading sponsors and partners.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Title Sponsors */}
          {titleSponsors.length > 0 && (
            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Title Sponsors</h2>
                <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                {titleSponsors.map((sponsor, idx) => (
                  <motion.div
                    key={sponsor._id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-card border-2 border-primary/50 shadow-lg shadow-primary/10 rounded-2xl p-12 flex flex-col items-center justify-center w-full max-w-2xl h-64 hover:border-primary transition-colors overflow-hidden relative"
                  >
                    {sponsor.logoUrl ? (
                      <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain mb-4" />
                    ) : (
                      <Building2 size={64} className="text-primary mb-6" />
                    )}
                    <h3 className="text-3xl font-heading font-bold text-foreground text-center">{sponsor.name}</h3>
                    <span className="text-primary font-medium tracking-widest uppercase mt-4 text-sm">{sponsor.tier}</span>
                    {sponsor.websiteUrl && <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" />}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Gold Sponsors */}
          {goldSponsors.length > 0 && (
            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Gold Sponsors</h2>
                <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {goldSponsors.map((sponsor, idx) => (
                  <motion.div
                    key={sponsor._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card border border-border shadow-sm rounded-2xl p-8 flex flex-col items-center justify-center h-48 hover:border-accent transition-colors group relative overflow-hidden"
                  >
                    {sponsor.logoUrl ? (
                      <img src={sponsor.logoUrl} alt={sponsor.name} className="w-auto h-24 object-contain mb-4" />
                    ) : (
                      <Building2 size={40} className="text-muted-foreground group-hover:text-accent transition-colors mb-4" />
                    )}
                    <h3 className="text-xl font-heading font-bold text-foreground text-center">{sponsor.name}</h3>
                    {sponsor.websiteUrl && <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" />}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Silver Sponsors */}
          {silverSponsors.length > 0 && (
            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Silver Sponsors</h2>
                <div className="w-20 h-1 bg-muted-foreground mx-auto rounded-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {silverSponsors.map((sponsor, idx) => (
                  <motion.div
                    key={sponsor._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card border border-border shadow-sm rounded-xl p-6 flex flex-col items-center justify-center h-36 hover:border-foreground/30 transition-colors relative overflow-hidden"
                  >
                    {sponsor.logoUrl ? (
                      <img src={sponsor.logoUrl} alt={sponsor.name} className="w-auto h-16 object-contain mb-3" />
                    ) : (
                      <Building2 size={32} className="text-muted-foreground mb-3" />
                    )}
                    <h3 className="text-lg font-heading font-bold text-foreground text-center">{sponsor.name}</h3>
                    {sponsor.websiteUrl && <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" />}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {sponsors.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No sponsors currently available.
            </div>
          )}

          {/* CTA */}
          <div className="mt-20 text-center bg-midnight rounded-3xl p-12 relative overflow-hidden border border-border">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-0" />
            <div className="relative z-10">
              <h2 className="text-3xl font-heading font-bold text-white mb-4">Want to become a sponsor?</h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto font-light">
                Position your brand at the forefront of the global agriculture and food systems industry. Download our sponsorship brochure to view available packages.
              </p>
              <Link
                href="/sponsorship"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-summit to-ascendix text-white font-medium hover:shadow-[0_0_20px_rgba(44,200,229,0.4)] transition-all group"
              >
                View Sponsorship Packages
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
