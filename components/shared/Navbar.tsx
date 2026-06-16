"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, Download, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { fetchApi } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Brochure Modal State
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [brochureForm, setBrochureForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: ""
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { 
      name: "About", 
      href: "#",
      dropdown: [
        { name: "About", href: "/about" },
        { name: "Chairs", href: "/about/chairs" },  
        { name: "Our Team", href: "/about/team" },
        { name: "Our Leaders", href: "/about/leaders" },
        { name: "Dates", href: "/about/dates" },
        { name: "Venue", href: "/about/venue" },
      ]
    },
    { 
      name: "Event", 
      href: "#",
      dropdown: [
        { name: "Speakers", href: "/schedule/speakers" },
        { name: "Schedule", href: "/schedule" },
        { name: "Topics", href: "/schedule/topics" },
        { name: "Classes", href: "/schedule/classes" },
      ]
    },
    { 
      name: "Sponsors", 
      href: "#",
      dropdown: [
        { name: "Sponsors", href: "/sponsors" },
        { name: "Partner Plans", href: "/sponsors/plans" },

        { name: "Research Papers", href: "/sponsors/research" },
        { name: "More Info", href: "/sponsors/more" },
      ]
    },
    { name: "Brochures", href: "/brochures" },
    { name: "Contact", href: "/contact" }
  ];

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchApi('/inboxs', {
        method: 'POST',
        body: JSON.stringify({
          ...brochureForm,
          subject: 'Brochure Download',
          sender: brochureForm.name // for legacy compatibility
        })
      });

      // Reset form and close modal
      setBrochureForm({ name: "", email: "", phone: "", country: "" });
      setShowBrochureModal(false);
      setIsMobileMenuOpen(false);

      // Open PDF in new tab
      window.open('/ascendix_brochure.pdf', '_blank');

      // Navigate to /admin/inbox as requested
      router.push('/admin/inbox');

    } catch (err) {
      console.error(err);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-midnight/90 backdrop-blur-md border-b border-white/10 py-4 shadow-lg"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center z-50">
            <Image src="/logo.png" alt="Ascendix Logo" width={150} height={40} className="object-contain brightness-0 invert" style={{ width: 'auto', height: '40px' }} priority />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className="text-sm font-medium text-white/80 hover:text-white hover:text-ascendix transition-colors flex items-center gap-1 py-4"
                >
                  {link.name}
                  {link.dropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                </Link>
                
                {link.dropdown && (
                  <div className="absolute top-full left-0 w-48 py-2 bg-midnight/95 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 shadow-xl">
                    {link.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-white/70 hover:text-ascendix hover:bg-white/5 transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setShowBrochureModal(true)}
              className="px-6 py-2.5 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-sm font-medium backdrop-blur-sm flex items-center gap-2"
            >
              <Download size={16} />
              Get Brochure
            </button>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-summit to-ascendix text-white hover:shadow-[0_0_15px_rgba(44,200,229,0.5)] transition-all text-sm font-medium"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 overflow-y-auto bg-midnight flex flex-col items-center justify-start pt-28 pb-12 gap-8 z-40"
            >
              {navLinks.map((link) => (
                <div key={link.name} className="w-full text-center">
                  <Link
                    href={link.href}
                    className="text-2xl font-heading font-medium text-white/80 hover:text-ascendix transition-colors inline-flex items-center gap-2"
                    onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown size={20} />}
                  </Link>
                  
                  {link.dropdown && (
                    <div className="mt-4 flex flex-col gap-3">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="text-lg text-white/50 hover:text-ascendix transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-4 mt-8 w-full px-12">
                <button
                  onClick={() => setShowBrochureModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all font-medium"
                >
                  <Download size={20} />
                  Get Brochure         
                </button>
                <Link
                  href="/register"
                  className="w-full text-center px-6 py-4 rounded-full bg-gradient-to-r from-summit to-ascendix text-white transition-all font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Brochure Lead Capture Modal */}
      <AnimatePresence>
        {showBrochureModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowBrochureModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-midnight border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <button 
                  onClick={() => setShowBrochureModal(false)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                  <X size={20} />
                </button>
                
                <h3 className="text-2xl font-bold text-white mb-2">Download Brochure</h3>
                <p className="text-white/60 text-sm mb-6">
                  Please provide your details below to access the full ASFAA-2026 event brochure.
                </p>

                <form onSubmit={handleBrochureSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={brochureForm.name}
                      onChange={e => setBrochureForm({...brochureForm, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ascendix transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={brochureForm.email}
                      onChange={e => setBrochureForm({...brochureForm, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ascendix transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={brochureForm.phone}
                        onChange={e => setBrochureForm({...brochureForm, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ascendix transition-colors"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">Country</label>
                      <input 
                        type="text" 
                        required 
                        value={brochureForm.country}
                        onChange={e => setBrochureForm({...brochureForm, country: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ascendix transition-colors"
                        placeholder="United States"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-summit to-ascendix text-white font-bold py-3.5 rounded-xl mt-4 hover:shadow-[0_0_20px_rgba(44,200,229,0.3)] transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={20} className="animate-spin" /> : (
                      <>
                        <Download size={20} />
                        Get PDF Brochure
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
