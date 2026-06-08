"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { MapPin, Navigation, Clock, CalendarDays } from "lucide-react";
import Image from "next/image";

export default function VenueLocation() {
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/venues').then(data => {
      if (data && data.length > 0) {
        const activeVenue = data.find((v: any) => v.is_active !== false) || data[0];
        setVenue(activeVenue || {});
      } else {
        setVenue({}); // Fallback to empty object to show defaults
      }
    }).catch((err) => {
      console.error(err);
      setVenue({});
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return null; // Only hide during the initial fetch

  // Default fallback map URL if not provided in DB
  const mapUrl = venue.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.6967778460807!2d103.9879672!3d1.3585608999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da3c936a9124bf%3A0x74a0170f1cc50445!2sCrowne%20Plaza%20Changi%20Airport%20by%20IHG!5e0!3m2!1sen!2sin!4v1779295382266!5m2!1sen!2sin";

  return (
    <section className="py-12 bg-background relative border-t border-border">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">Event Location</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Venue & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Travel</span>
          </h3>
          <p className="text-muted-foreground text-lg font-light">
            Join us in the vibrant city of {venue.city || 'Singapore'}, a premier global innovation hub where industry meets innovation.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-0 bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {/* Map Image / Visual Placeholder */}
          <div className="w-full lg:w-1/2 min-h-[400px] relative bg-slate-dark overflow-hidden">
             <iframe 
                src={mapUrl} 
                className="absolute inset-0 w-full h-full" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
             <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent z-10 pointer-events-none" />
             <div className="absolute bottom-8 left-8 right-8 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl pointer-events-none">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-ascendix" size={24} />
                  <h4 className="text-xl font-heading font-bold text-white">{venue.city || 'Singapore'}</h4>
                </div>
                <p className="text-white/70 font-light text-sm">{venue.name || 'Crowne Plaza Changi Airport by IHG'}</p>
             </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h4 className="text-2xl font-heading font-bold text-foreground mb-8">Plan Your Visit</h4>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-foreground mb-1">Event Dates</h5>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">
                    November 18–20, 2026<br/>
                    Doors open daily at 8:00 AM for registration and networking.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Navigation size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-foreground mb-1">Getting There</h5>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">
                    {venue.address || 'Centrally located and highly accessible via public transit, MRT lines, and major highways. Just minutes from the international airport.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-foreground mb-1">Accommodation</h5>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">Partner hotels offer exclusive discounted rates for ASFAA attendees. Shuttle services are available throughout the event.</p>
                </div>
              </div>
            </div>

            <button className="mt-10 px-8 py-3 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all self-start">
              View Travel Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
