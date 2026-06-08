"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactPage() {
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
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-ascendix to-ice">Touch</span>
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Have questions about ASFAA-2026? Our team is here to assist you with registration, sponsorship, and exhibition inquiries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/3 space-y-8"
            >
              <div>
                <h2 className="text-3xl font-heading font-bold text-foreground mb-6">Contact Information</h2>
                <p className="text-muted-foreground font-light mb-8">
                  Reach out directly using the details below or fill out our contact form.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground mb-1">Venue</h4>
                    <p className="text-muted-foreground font-light">
                      Crowne Plaza Changi Airport by IHG<br />
                      75 Airport Blvd.<br />
                      Singapore 819664
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground mb-1">Phone</h4>
                    <p className="text-muted-foreground font-light">+971 4 332 1000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-foreground mb-1">Email</h4>
                    <p className="text-muted-foreground font-light">info@ascendixsummits.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-2/3"
            >
              <div className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-12">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-8">Send us a message</h3>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">First Name</label>
                      <input type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Last Name</label>
                      <input type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <input type="email" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="john@company.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Phone Number</label>
                      <input type="tel" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Subject</label>
                    <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none">
                      <option>General Inquiry</option>
                      <option>Sponsorship Opportunities</option>
                      <option>Exhibitor Booking</option>
                      <option>Speaker Application</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Message</label>
                    <textarea rows={5} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:border-primary transition-colors resize-none" placeholder="How can we help you?"></textarea>
                  </div>

                  <button type="button" className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(44,200,229,0.2)]">
                    Send Message
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
