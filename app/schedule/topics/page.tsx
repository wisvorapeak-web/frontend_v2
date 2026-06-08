"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const res = await fetchApi('/topics');
        if (res && res.length > 0) {
          // Sort by display order and only show active
          const activeTopics = res
            .filter((t: any) => t.is_active !== false)
            .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
          setTopics(activeTopics);
        }
      } catch (error) {
        console.error("Failed to load topics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
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
              Topics
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Explore the key themes and discussions.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {loading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse">
              Loading topics...
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No topics available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {topics.map((topic: any, i: number) => {
                const imageUrl = topic.image_url || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop&auto=format&q=80`;
                
                return (
                  <div key={topic._id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm group flex flex-col">
                    {/* Image Section */}
                    <div className="h-48 w-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                      <img 
                        src={imageUrl} 
                        alt={topic.title || "Topic"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-background/90 backdrop-blur text-primary flex items-center justify-center font-bold shadow-md">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {topic.title}
                      </h3>
                      {topic.description && (
                        <p className="text-muted-foreground font-light text-sm">
                          {topic.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
    
        </div>
      </section>

      <Footer />
    </main>
  );
}
