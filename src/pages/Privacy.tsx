import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Privacy Policy & GDPR Compliance
          </h1>
          <p className="text-sm text-muted-foreground mb-10">Last Updated: 20th April 2026</p>

          <div className="space-y-10 text-foreground/80 text-base leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Introduction</h2>
              <p>
                Complete My Project ("we," "us," or "our") is committed to protecting the privacy and security of your personal data. This policy informs you of how we handle your personal data when you visit our website, apply to be a Service Provider, or submit a project as a Customer.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Data We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>For Customers:</strong> Name, contact details (email/phone), project address, and project requirements.</li>
                <li><strong>For Service Providers (Builders):</strong> Director names, business address, contact details, insurance documents, and DBS status.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and cookies for website functionality.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">3. How We Use Your Data</h2>
              <p className="mb-3">We process data under the following legal bases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contractual Necessity:</strong> To introduce Customers to Service Providers.</li>
                <li><strong>Legitimate Interests:</strong> To vet Service Providers and ensure the safety of our platform.</li>
                <li><strong>Consent:</strong> For marketing communications (where you have opted in).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Special Category Data (DBS Checks)</h2>
              <p className="mb-3">For Service Providers, we process "criminal offence data" (DBS checks).</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Collection:</strong> We do not store full criminal records. We only record the result of the check (e.g., "Cleared" or "Verified") and the certificate number/date.</li>
                <li><strong>Payment:</strong> Payments for DBS checks are made directly to our third-party processor [e.g., APCS/uCheck]. We do not store your credit card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Data Sharing</h2>
              <p className="mb-3">We share your information only as necessary to provide our service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Customer to Builder:</strong> We share the Customer's contact details and project address with the assigned Service Provider so they can provide a quote.</li>
                <li><strong>Builder to Customer:</strong> We share the Service Provider's name, vetting status, and contact details with the Customer.</li>
                <li><strong>Legal Obligations:</strong> We may share data with law enforcement or regulatory bodies if required by law.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Customer Data:</strong> Held for [e.g., 3 years] after the last interaction to assist with any future dispute or inquiry.</li>
                <li><strong>Service Provider Data:</strong> Held for the duration of your membership. If you leave the platform, your data is deleted after [e.g., 12 months], except where required for legal records.</li>
                <li><strong>DBS Records:</strong> We do not keep copies of DBS certificates. We only store the verification status.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
              <p className="mb-3">Under UK GDPR, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> You can request a copy of the data we hold about you.</li>
                <li><strong>Rectification:</strong> You can ask us to correct inaccurate information.</li>
                <li><strong>Erasure:</strong> You can ask us to delete your data (the "Right to be Forgotten").</li>
                <li><strong>Object:</strong> You can object to our processing of your data for marketing.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">8. Cookies</h2>
              <p>
                Our website uses cookies to improve user experience. You can manage your cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">9. Contact Us</h2>
              <p className="mb-3">
                If you have any questions about this policy or our data practices, please contact our Data Protection Officer at:
              </p>
              <p><strong>Email:</strong> info@completemyproject.co.uk</p>
              <p><strong>Address:</strong> 4 Railway Street, Huddersfield, HD1 1JP.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
