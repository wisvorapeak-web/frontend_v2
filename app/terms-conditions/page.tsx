import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function TermsConditionsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/90 to-summit/40 z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-ascendix to-ice">Conditions</span>
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Last updated: May 20, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-12 prose prose-invert max-w-none text-foreground/80 font-light">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">2. Registration and Participation</h2>
            <p className="mb-6">
              Registration for ASFAA-2026 is subject to availability and payment of the applicable fees. We reserve the right to refuse registration to any individual or entity at our sole discretion. Attendees must comply with the event's code of conduct and safety guidelines.
            </p>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">3. Intellectual Property Rights</h2>
            <p className="mb-6">
              All content published and made available on our site is the property of ASCENDIX SUMMITS and the site's creators. This includes, but is not limited to images, text, logos, documents, downloadable files and anything that contributes to the composition of our site.
            </p>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">4. Limitation of Liability</h2>
            <p className="mb-6">
              ASCENDIX SUMMITS and our directors, officers, agents, employees, subsidiaries, and affiliates will not be liable for any actions, claims, losses, damages, liabilities and expenses including legal fees from your use of the site or attendance at our events.
            </p>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">5. Governing Law</h2>
            <p className="mb-6">
              These terms and conditions are governed by the laws of the Netherlands. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts of the Netherlands.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
