"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Check, ArrowRight } from "lucide-react";

export default function Page() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const data = await fetchApi('/pricings');
        const activePlans = data.filter((p: any) => p.is_active && p.category === 'Sponsorship');
        setPlans(activePlans);
      } catch (error) {
        console.error("Failed to load sponsorship pricing", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPricing();
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-midnight font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-midnight to-midnight -z-10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              Partner <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Plans</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Sponsorship tiers and opportunities. Choose the package that best fits your goals.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Pricing Cards Section */}
      <section className="py-8 relative min-h-[500px]">
        <div className="container mx-auto px-6">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No sponsorship plans available at the moment.
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, i) => (
                <motion.div 
                  key={plan._id || i} 
                  className={`bg-card rounded-3xl flex flex-col relative transition-transform duration-300 hover:-translate-y-2 ${
                    plan.is_popular 
                      ? 'border-2 border-primary shadow-[0_0_40px_rgba(44,200,229,0.15)] scale-105 z-10' 
                      : 'border border-border shadow-lg mt-4 lg:mt-0'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <div className="p-8 border-b border-white/5">
                    <h3 className="text-3xl font-heading font-bold text-foreground mb-2">{plan.name} Partner</h3>
                    <p className="text-muted-foreground text-sm min-h-[40px]">{plan.description || "Select this package for your sponsorship."}</p>
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-5xl font-heading font-bold text-white">{plan.currency || '$'}{plan.amount}</span>
                    </div>
                  </div>

                  <div className="p-8 flex-grow flex flex-col bg-black/20 rounded-b-3xl">
                    <p className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">What's included</p>
                    <ul className="space-y-4 mb-8 flex-grow">
                      {plan.features?.map((f: string, j: number) => (
                        <li key={j} className="flex items-start gap-3 text-muted-foreground text-sm">
                          <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Check className="w-3 h-3 font-bold" />
                          </div>
                          <span className="text-foreground/90">{f}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <a href={`/sponsors/plans/${plan._id}`} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group mt-auto ${
                      plan.is_popular 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20' 
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}>
                      Select Package
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
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
