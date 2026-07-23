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
              <p className="mb-3">
                Complete My Project ("we," "us," or "our") is committed to protecting the privacy and security of your personal data. This policy informs you of how we handle your personal data when you visit our website, apply to be a Service Provider, or submit a project as a Customer.
              </p>
              <p>
                Our registered business address is 4 Railway Street, Huddersfield, HD1 1JP.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Data We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>For Customers:</strong> Name, contact details (email/phone), project address, and project requirements.</li>
                <li><strong>For Service Providers (Builders):</strong> Director names, business address, contact details, insurance documents, and DBS verification status.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and cookies for website functionality.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">3. How We Use Your Data</h2>
              <p className="mb-3">We process data under the following legal bases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contractual Necessity:</strong> To introduce Customers to Service Providers.</li>
                <li><strong>Legitimate Interests:</strong> To vet Service Providers and ensure the safety of our platform.</li>
                <li><strong>Consent:</strong> For marketing communications (where you have explicitly opted in).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Special Category & Criminal Offence Data (DBS Checks)</h2>
              <p className="mb-3">For Service Providers, we process criminal-offence data via Basic DBS checks. This is distinct from special-category data, and any Article 10 criminal-offence data is processed under Schedule 1, paragraph 1 of the Data Protection Act 2018, linked to Article 6(1)(f) legitimate interests for safe vetting.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Lawful Processing:</strong> In addition to our Legitimate Interests, we process this data under Schedule 1, paragraph 1 of the Data Protection Act 2018, linked to Article 6(1)(f), for safe vetting and platform security. Before publication of this notice, we maintain an appropriate policy document and complete a DPIA for this processing.</li>
                <li><strong>Collection:</strong> We do not collect or store physical or digital copies of full criminal records or DBS certificates. We only view the certificate to record the verification result (e.g., "Verified"), the certificate number, and the issue date.</li>
                <li><strong>Payment:</strong> Payments for DBS checks are made directly to our third-party processing partner. We do not handle or store your financial or credit card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Data Sharing</h2>
              <p className="mb-3">We share your information only as necessary to provide our service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Customer to Builder:</strong> We share the Customer's contact details and project address with the assigned Service Provider to allow them to provide a quote.</li>
                <li><strong>Builder to Customer:</strong> We share the Service Provider's business name, limited vetting status (for example, “Verified” or “Not yet verified”), and contact details with the Customer. We do not share DBS certificate numbers, verification dates, criminal-record details, or offence details. This disclosure is limited to the outcome of the vetting check and is supported by our Article 6(1)(f) lawful basis and, where applicable, our Article 10/Schedule 1 processing basis.</li>
                <li><strong>Legal Obligations:</strong> We may share data with law enforcement or regulatory bodies if required by law.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Data Retention</h2>
              <p className="mb-3">We only store data for as long as necessary to fulfill the purposes we collected it for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Customer Data:</strong> Held for 3 years after the last interaction to assist with any future dispute or inquiry.</li>
                <li><strong>Service Provider Data:</strong> Held for the duration of your membership on the platform. If you leave the platform, your data is permanently deleted after 12 months, except where required for tax or legal records.</li>
                <li><strong>DBS Records:</strong> Physical or digital certificate copies are not kept. The verification status, certificate number, and issue date are retained for the duration of your platform membership plus 12 months after membership ends, then deleted from our primary systems, backups, logs, and vendor records in line with our retention schedule. We retain this period for dispute handling, audit, and compliance, and we do not treat certificate copies as being deleted without also covering these related records.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
              <p className="mb-3">Under UK GDPR, you have the following rights over your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> You can request a copy of the data we hold about you (Subject Access Request).</li>
                <li><strong>Rectification:</strong> You can ask us to correct inaccurate information.</li>
                <li><strong>Erasure:</strong> You can ask us to delete your data (the "Right to be Forgotten").</li>
                <li><strong>Object:</strong> You can object to our processing of your data for marketing.</li>
                <li><strong>Withdraw Consent:</strong> Where processing is based on consent, you can withdraw it at any time by using the unsubscribe link in our marketing emails or by contacting our Data Protection Team at info@completemyproject.co.uk. Doing so stops future consent-based processing, but it does not undo prior processing that was lawful at the time.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">8. Cookies</h2>
              <p>
                Our website uses cookies to improve user experience. Non-essential cookies will only be deployed with your explicit agreement via our website cookie banner. You can manage your preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">9. Complaints & Contact Us</h2>
              <p className="mb-3">
                If you have any questions about this policy or wish to exercise your rights, please contact our Data Protection Team at:
              </p>
              <p><strong>Email:</strong> info@completemyproject.co.uk</p>
              <p><strong>Address:</strong> 4 Railway Street, Huddersfield, HD1 1JP.</p>
              <p className="mt-3">
                Individuals may also complain to the Information Commissioner’s Office (ICO) by post at Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF, or via their website: <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">https://ico.org.uk/make-a-complaint/</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
