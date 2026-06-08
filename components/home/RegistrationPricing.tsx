"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegistrationPricing() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const data = await fetchApi('/pricings');
        const registrationPlans = data
          .filter((p: any) => p.is_active && p.category === 'Registration');
          
        // Prioritize "Early Bird" plans, otherwise just take the first 4
        let displayPlans = registrationPlans.filter((p: any) => p.name.includes('Early Bird'));
        
        if (displayPlans.length === 0) {
          displayPlans = registrationPlans.slice(0, 4);
        } else if (displayPlans.length > 4) {
          displayPlans = displayPlans.slice(0, 4);
        }
        
        if (displayPlans.length === 0) {
          displayPlans = data.filter((p: any) => p.is_active).slice(0, 4);
        }
          
        setPlans(displayPlans);
      } catch (error) {
        console.error("Failed to load pricing", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPricing();
  }, []);

  return (
    <section className="py-16 bg-[#040D1C] relative overflow-hidden border-t border-white/5">
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(44,200,229,0.2)]">
              Ticketing
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 leading-tight">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#7ADAF4] to-secondary">Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Join the brightest minds in the industry. Secure your pass to unlock unparalleled networking, insights, and opportunities.
            </p>
          </motion.div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin shadow-[0_0_15px_rgba(44,200,229,0.5)]"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-center">
            {plans.map((plan, i) => {
              // Highlight the second and third items (or popular items) slightly differently if needed
              // With 4 items, let's highlight the two middle ones slightly, or just the ones marked popular.
              const isProminent = plan.is_popular || i === 1 || i === 2; 

              return (
                <motion.div 
                  key={plan._id || i} 
                  className={`relative group rounded-3xl backdrop-blur-sm transition-all duration-500 flex flex-col ${
                    isProminent 
                      ? 'bg-card/80 border-2 border-primary/50 shadow-[0_0_40px_rgba(44,200,229,0.15)] lg:-mt-4 lg:mb-4' 
                      : 'bg-card/40 border border-white/10 hover:border-white/20 hover:bg-card/60 mt-0'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                  whileHover={{ y: -8 }}
                >
                  {/* Top Badge Removed */}

                  {/* Card Inner Glow (Center Card) */}
                  {isProminent && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  )}
                  
                  <div className="p-10 flex flex-col h-full relative z-10">
                    <div className="mb-8">
                      <h3 className="text-2xl font-heading font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm min-h-[40px] leading-relaxed">
                        {plan.description || "The perfect pass to experience the conference."}
                      </p>
                    </div>

                    <div className="mb-8 pb-8 border-b border-white/10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-heading font-black text-white tracking-tight">
                          {plan.currency}{plan.amount}
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow mb-10">
                      <p className="text-xs font-bold text-white uppercase tracking-wider mb-4 opacity-80">Includes:</p>
                      <ul className="space-y-4">
                        {plan.features?.map((f: string, j: number) => (
                          <li key={j} className="flex items-start gap-3 text-muted-foreground text-sm font-medium">
                            <CheckCircle2 className={`w-5 h-5 shrink-0 ${isProminent ? 'text-primary' : 'text-white/30'}`} />
                            <span className="text-white/80">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a 
                      href={`/register/${plan._id}`} 
                      className={`relative flex items-center justify-center w-full py-4 rounded-xl font-bold transition-all mt-auto overflow-hidden group/btn ${
                        isProminent 
                          ? 'bg-primary text-[#040D1C] shadow-[0_0_20px_rgba(44,200,229,0.3)] hover:shadow-[0_0_30px_rgba(44,200,229,0.5)]' 
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {/* Button Hover Glow */}
                      {isProminent && (
                        <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                      )}
                      <span className="relative flex items-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* Call to action below cards */}
        {!loading && (
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-muted-foreground text-sm">
              Need a custom package for a large team? <a href="/contact" className="text-primary hover:underline font-semibold transition-all hover:text-primary/80">Contact our sales team</a>
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
