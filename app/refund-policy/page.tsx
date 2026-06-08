import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function RefundPolicyPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/90 to-summit/40 z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6">
              Refund <span className="text-transparent bg-clip-text bg-gradient-to-r from-ascendix to-ice">Policy</span>
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
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">1. General Refund Rules</h2>
            <p className="mb-6">
              Thank you for registering for ASFAA-2026. We understand that plans can change, and we strive to provide a fair and transparent refund policy. All refund requests must be submitted in writing to <strong>billing@ascendixsummits.com</strong>.
            </p>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">2. Attendee Ticket Refunds</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>60+ Days Before Event:</strong> 100% refund (minus a $50 administrative fee).</li>
              <li><strong>30-59 Days Before Event:</strong> 50% refund.</li>
              <li><strong>Less than 30 Days Before Event:</strong> No refunds will be issued. However, tickets can be transferred to another colleague within the same organization.</li>
            </ul>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">3. Exhibitor & Sponsor Refunds</h2>
            <p className="mb-6">
              Due to the extensive logistical preparation required for exhibition spaces and sponsor branding, the following strict timeline applies to exhibition and sponsorship packages:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>90+ Days Before Event:</strong> 75% refund of total package value.</li>
              <li><strong>60-89 Days Before Event:</strong> 25% refund of total package value.</li>
              <li><strong>Less than 60 Days Before Event:</strong> No refunds will be issued under any circumstances.</li>
            </ul>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">4. Event Cancellation or Postponement</h2>
            <p className="mb-6">
              In the unlikely event that ASFAA-2026 is cancelled entirely by ASCENDIX SUMMITS, all attendees and exhibitors will receive a full 100% refund. If the event is postponed, registrations will automatically be transferred to the new dates. If you cannot attend the new dates, a full refund will be provided upon request within 30 days of the postponement announcement.
            </p>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">5. Processing Time</h2>
            <p className="mb-6">
              Approved refunds will be processed within 14-21 business days. Refunds will be issued using the original method of payment used during registration.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
