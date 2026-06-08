"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";
import { 
  Globe, Crosshair, Cpu, CloudSun, Droplets, Dna, Leaf, Stethoscope, 
  Activity, Beaker, Apple, Package, TabletSmartphone, Bot, Building2, 
  Truck, QrCode, Briefcase, Rocket, Landmark, ArrowRight, Lightbulb
} from "lucide-react";
import Link from "next/link";

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/topics').then(data => {
      setSessions(data.filter((t: any) => t.is_active !== false).sort((a: any, b: any) => a.display_order - b.display_order));
    }).catch(console.error);
  }, []);

  // Map icon names to Lucide components if needed, or fallback
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Globe, Crosshair, Cpu, CloudSun, Droplets, Dna, Leaf, Stethoscope, 
      Activity, Beaker, Apple, Package, TabletSmartphone, Bot, Building2, 
      Truck, QrCode, Briefcase, Rocket, Landmark, Lightbulb
    };
    return iconMap[iconName] || Lightbulb;
  };

  if (sessions.length === 0) return null;

  return (
    <section className="py-12 bg-background relative border-t border-border">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">Key Themes</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Conference <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sessions</span>
          </h3>
          <p className="text-muted-foreground text-lg font-light">
            Explore {sessions.length}+ critical tracks addressing the most pressing challenges and transformative opportunities in global agriculture and food systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sessions.slice(0, 8).map((session, idx) => {
            const IconComponent = getIcon(session.icon_name || "Lightbulb");
            // Use real image if available, otherwise use a high-quality placeholder related to the topic
            const imageUrl = session.image_url || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop&auto=format&q=80`;
            
            return (
              <motion.div
                key={session._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 4) * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm group flex flex-col"
              >
                {/* Image Section */}
                <div className="h-40 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={imageUrl} 
                    alt={session.title || session.name || "Session Topic"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-background/90 backdrop-blur text-primary flex items-center justify-center shadow-md">
                    <IconComponent size={20} strokeWidth={2} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors text-lg mb-2">
                    {session.title || session.name}
                  </h4>
                  {session.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {session.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/schedule/topics"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground font-medium transition-all group"
          >
            View All Topics
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
