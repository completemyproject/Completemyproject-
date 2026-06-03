import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            In these terms and conditions, Completemyproject.co.uk is referred to as <strong>CMP</strong>. Multi-trade company / Tradesman is referred to as <strong>Service Provider</strong>.
          </p>

          <div className="space-y-10 text-foreground/80 text-base leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Nature of Service</h2>
              <p className="mb-3">
                Complete My Project (CMP) operates strictly as an introduction and vetting platform. We provide Customers with access to a panel of third-party multi-trade companies ("Service Providers") who have successfully passed our internal vetting criteria at the time of their application.
              </p>
              <p>
                CMP is an introducer only. We do not provide construction, maintenance, or trade services. No contract for works exists between CMP and the Customer; any agreement for services is strictly between the Customer and the Service Provider.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">2. The Vetting Process & Limitations</h2>
              <p className="mb-3">
                CMP employs a Six-Point Verification Check on the directors and credentials of each Service Provider. This process is designed to reduce risk, not eliminate it.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Best Endeavours:</strong> We carry out these checks to the best of our ability using third-party data (such as the DBS and Companies House).</li>
                <li><strong>Liability Waiver:</strong> CMP shall not be held liable in any form for information that is missed, or for fraudulent documentation provided by a Service Provider that appears valid during our checks.</li>
                <li><strong>Snapshot in Time:</strong> Vetting is a "snapshot" of a company's status. CMP cannot guarantee the continued accuracy of a Service Provider's credentials between our scheduled review periods.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">3. Annual Renewal Policy</h2>
              <p className="mb-3">
                CMP conducts vetting checks when a Service Provider first joins the platform and performs a renewal check every 12 months thereafter.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Interim Period:</strong> CMP cannot be held liable for any changes in the status, insurance validity, or criminal record of a Service Provider or its directors that occur during the 12-month interval between checks.</li>
                <li><strong>Ongoing Due Diligence:</strong> The Customer is encouraged to verify that the Service Provider's insurance is still in force at the specific time of hiring for their project.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Independent Contractors & Workmanship</h2>
              <p className="mb-3">
                All Service Providers on our panel are independent businesses. CMP shall not be liable for any loss, damage, expense, or injury arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Poor, incomplete, or negligent workmanship.</li>
                <li>Professional misconduct, "scams," or theft by the Service Provider.</li>
                <li>Property damage or personal injury occurring during the project.</li>
                <li>Delays or failure to complete the contracted works.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Payments and Financial Disputes</h2>
              <p className="mb-3">
                All payments are made directly between the Customer and the Service Provider. CMP is not involved in the negotiation of quotes, the collection of deposits, or the processing of final payments.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>CMP is not liable for any financial losses, including but not limited to, the loss of deposits, overcharging, or the financial insolvency of a Service Provider.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">6. No Guarantee of Performance</h2>
              <p className="mb-3">
                While our vetting (including DBS and reference checks) is intended to provide peace of mind, it does not constitute a guarantee of future performance. The Customer is responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reviewing the Service Provider's specific project proposal.</li>
                <li>Ensuring a written contract is in place directly with the Service Provider.</li>
                <li>Performing any additional due diligence they deem necessary.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Dispute Resolution</h2>
              <p>
                Any disputes regarding the quality of work, pricing, or conduct must be resolved directly with the Service Provider. CMP is under no legal obligation to intervene in disputes, provide mediation, or offer compensation. CMP may, at its sole discretion, investigate complaints and remove a Service Provider from the panel if they are found to have breached our standards.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">8. Statistics and Data</h2>
              <p>
                All statistics and data presented on this website are obtained from publicly available sources. We make no representations or warranties, express or implied, as to the accuracy, completeness, or reliability of this information, and accept no liability for any reliance placed upon it.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">9. Referral Fees</h2>
              <p className="mb-3">
                Referral fees are only payable once completemyproject.co.uk has received payment from the introducer's customer. Fees may vary depending on the size of the job.
              </p>
              <p>
                Before any payment is made by completemyproject.co.uk to an introducer, an invoice is required. Payment will be made within 3 days of receiving a valid invoice.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
