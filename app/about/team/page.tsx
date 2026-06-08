"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Link as LinkIcon, MapPin, Building2 } from "lucide-react";

export default function Page() {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrganizers = async () => {
      try {
        const res = await fetchApi('/organizers');
        if (res && res.length > 0) {
          const activeOrganizers = res
            .filter((o: any) => o.is_active !== false)
            .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
          setOrganizers(activeOrganizers);
        }
      } catch (error) {
        console.error("Failed to load organizers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrganizers();
  }, []);

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
              Our Team
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Meet the dedicated organizers and scientific committee behind ASFAA-2026.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {loading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse">
              Loading team...
            </div>
          ) : organizers.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No team members currently available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {organizers.map((member, i) => (
                <div key={member._id || i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-all">
                  <div className="aspect-square w-full bg-muted relative overflow-hidden flex-shrink-0">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                    )}
                  </div>
                  <div className="p-6 relative z-20 bg-card border-t border-border mt-[-20px] rounded-t-2xl">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-1">{member.name}</h3>
                    {member.role && <p className="text-primary text-sm font-semibold mb-3">{member.role}</p>}
                    
                    <div className="space-y-2 mt-4">
                      {member.affiliation && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{member.affiliation}</span>
                        </div>
                      )}
                      {member.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{member.location}</span>
                        </div>
                      )}
                    </div>

                    {member.linkedin_url && (
                      <div className="mt-6">
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                          <LinkIcon className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
