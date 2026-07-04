"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/venue-galleries').then(data => {
      if (Array.isArray(data)) {
        setGalleryImages(data.map((g: any) => g.imageUrl));
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-20">
          <div className="animate-pulse text-muted-foreground">Loading venue details...</div>
        </div>
        <Footer />
      </main>
    );
  }

  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77979.80009413049!2d4.9039604!3d52.354665649999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c63fb5949a7755%3A0x6600fd4cb7c0af8d!2sAmsterdam%2C%20Netherlands!5e0!3m2!1sen!2sin!4v1783156908555!5m2!1sen!2sin";
  const venueName = "Amsterdam, Netherlands";
  const venueCity = "Amsterdam";
  const venueAddress = "Amsterdam, Netherlands";

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
              Venue
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Discover the world-class {venueName}, {venueCity}.
            </p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-12 relative flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2">
          <div className="aspect-video bg-muted rounded-2xl border border-border flex items-center justify-center overflow-hidden">
             <iframe 
                src={mapUrl}
                className="w-full h-full grayscale-[20%] contrast-[1.2] opacity-90 mix-blend-luminosity" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-card border border-border p-6 rounded-xl">
              <h4 className="font-bold text-foreground font-heading mb-2">Halls A-C</h4>
              <p className="text-sm text-muted-foreground">Main Exhibitions</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl">
              <h4 className="font-bold text-foreground font-heading mb-2">Grand Pavilion</h4>
              <p className="text-sm text-muted-foreground">Keynote Sessions</p>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <h3 className="text-3xl font-heading font-bold text-foreground mb-6">A Premier Global Destination</h3>
          <p className="text-muted-foreground font-light leading-relaxed mb-6">
            Situated in {venueCity}, the {venueName} offers state-of-the-art facilities, immense exhibition spaces, and unparalleled luxury. It is the perfect epicenter for international networking and showcases.
            {venueAddress && <><br /><br /><strong>Address:</strong> {venueAddress}</>}
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> <span className="text-foreground/80">300,000+ sq ft of exhibition space</span></li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> <span className="text-foreground/80">50+ private meeting rooms</span></li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> <span className="text-foreground/80">Direct transit access</span></li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /> <span className="text-foreground/80">World-class catering and VIP lounges</span></li>
          </ul>
        </div>
      </div>
    
        </div>
      </section>

      {/* Venue Gallery Section */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-20 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Venue Gallery</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">Take a visual tour of our world-class facilities and exhibition spaces.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((img: string, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  key={idx} 
                  className="aspect-[4/3] bg-muted rounded-2xl overflow-hidden border border-border shadow-sm group"
                >
                  <img 
                    src={img} 
                    alt={`Venue Gallery ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
