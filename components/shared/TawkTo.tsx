"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * TawkTo - Integrates the Tawk.to live chat widget.
 * Hides automatically on /admin routes.
 */
export default function TawkTo() {
  const pathname = usePathname();

  // Handle visibility based on route changes
  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
      if ((window as any).Tawk_API && typeof (window as any).Tawk_API.hideWidget === 'function') {
        try { (window as any).Tawk_API.hideWidget(); } catch (e) {}
      }
    } else {
      if ((window as any).Tawk_API && typeof (window as any).Tawk_API.showWidget === 'function') {
        try { (window as any).Tawk_API.showWidget(); } catch (e) {}
      }
    }
  }, [pathname]);

  // Initial load
  useEffect(() => {
    const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "1i";

    if (!propertyId) {
      return;
    }

    if (document.getElementById('tawk-script')) return;

    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    // Ensure it hides immediately if loading directly on admin
    (window as any).Tawk_API.onLoad = function() {
      if (window.location.pathname.startsWith('/admin')) {
        (window as any).Tawk_API.hideWidget();
      }
    };

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);

  }, []);

  return null;
}
