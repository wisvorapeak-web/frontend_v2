import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-midnight border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-6">
              <Image src="/logo.png" alt="Ascendix Logo" width={150} height={40} className="object-contain brightness-0 invert" style={{ width: 'auto', height: '40px' }} />
            </Link>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
              The premier global ecosystem for enterprise innovation, B2B networking, and industry transformation.
            </p>
            <div className="flex items-center gap-4 text-white/50">
              <Link href="#" className="hover:text-ascendix transition-colors text-sm font-medium">LinkedIn</Link>
              <Link href="#" className="hover:text-ascendix transition-colors text-sm font-medium">X</Link>
              <Link href="#" className="hover:text-ascendix transition-colors text-sm font-medium">Instagram</Link>
              <Link href="#" className="hover:text-ascendix transition-colors text-sm font-medium">Facebook</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Summit', href: '/about' },
                { name: 'Concurrent Shows', href: '/#highlights' },
                { name: 'Conference Schedule', href: '/schedule' },
                { name: 'Sponsorship', href: '/sponsors' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 text-sm hover:text-ascendix transition-colors font-light">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Support & Legal</h4>
            <ul className="space-y-4">
              {[
                { name: 'FAQ', href: '/faq' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms & Conditions', href: '/terms-conditions' },
                { name: 'Refund Policy', href: '/refund-policy' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/60 text-sm hover:text-ascendix transition-colors font-light">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-ascendix flex-shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm font-light">Crowne Plaza Changi Airport, <br />Singapore</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-ascendix flex-shrink-0" />
                <span className="text-white/60 text-sm font-light">+971 4 332 1000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-ascendix flex-shrink-0" />
                <span className="text-white/60 text-sm font-light">info@ascendixsummits.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm font-light text-center md:text-left">
            &copy; {new Date().getFullYear()} ASCENDIX SUMMITS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/40 text-sm font-light">
              Designed by <a href="https://anandverse.space" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors font-medium">AnandVerse Web Services</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
