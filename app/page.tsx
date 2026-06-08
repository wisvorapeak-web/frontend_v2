import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Sessions from "@/components/home/Sessions";
import OurSpeakers from "@/components/home/OurSpeakers";
import EventLeaders from "@/components/home/EventLeaders";
import RegistrationPricing from "@/components/home/RegistrationPricing";
import VenueLocation from "@/components/home/VenueLocation";
import Testimonials from "@/components/home/Testimonials";
import Faqs from "@/components/home/Faqs";
import CtaSection from "@/components/home/CtaSection";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Sessions />
      <OurSpeakers />
      <EventLeaders />
      <Testimonials />
      <RegistrationPricing />
      <VenueLocation />
      <Faqs />
      <CtaSection />
      <Footer />
    </main>
  );
}
