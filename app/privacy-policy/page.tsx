import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/90 to-summit/40 z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-ascendix to-ice">Policy</span>
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
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="mb-6">
              ASCENDIX SUMMITS ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">2. The data we collect about you</h2>
            <p className="mb-6">
              Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, title.</li>
              <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Financial Data</strong> includes bank account and payment card details (processed securely via our payment gateways).</li>
              <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
            </ul>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">3. How we use your personal data</h2>
            <p className="mb-6">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">4. Data security</h2>
            <p className="mb-6">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">5. Contact details</h2>
            <p className="mb-6">
              If you have any questions about this privacy policy or our privacy practices, please contact us in the following ways:<br/>
              Email address: privacy@ascendixsummits.com<br/>
              Postal address: Amsterdam, Netherlands
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
