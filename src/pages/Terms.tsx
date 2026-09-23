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
                Referral fees are only payable once <a href="https://completemyproject.co.uk" target="_blank" rel="noopener noreferrer" className="text-oak-600 font-semibold underline hover:text-oak-700">completemyproject.co.uk</a> has received payment from the introducer's customer. Fees may vary depending on the size of the job.
              </p>
              <p className="mb-3">
                Before any payment is made by <a href="https://completemyproject.co.uk" target="_blank" rel="noopener noreferrer" className="text-oak-600 font-semibold underline hover:text-oak-700">completemyproject.co.uk</a> to an introducer, an invoice is required. Payment will be made within 3 days of receiving a valid invoice.
              </p>
              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">Refer a Friend Referral Scheme</h3>
              <p className="mb-3">
                If a referral results in a project with a value of less than £25,000, the referral fee payable will be £150. For any project with a value of £25,000 or more, the introducer will receive a referral fee of £250. For projects with a total value of less than £8,000, <a href="https://completemyproject.co.uk" target="_blank" rel="noopener noreferrer" className="text-oak-600 font-semibold underline hover:text-oak-700">Completemyproject.co.uk</a> may agree a reduced referral fee with the introducer at its discretion.
              </p>
              <p className="mb-3">
                Referral fees are payable only once <a href="https://completemyproject.co.uk" target="_blank" rel="noopener noreferrer" className="text-oak-600 font-semibold underline hover:text-oak-700">Completemyproject.co.uk</a> has received full payment for the project. Payment of the referral fee is also subject to the introducer providing a valid invoice.
              </p>
              <p>
                Subject to the value of the project, CMP may require an Introducer Agreement to be completed and signed by any individual referring a friend before any referral payment is made.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">10. Social Media Advertising and Promotional Content Disclaimer</h2>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">10.1 For Illustrative Purposes Only</h3>
              <p className="mb-3">
                All marketing materials, promotional videos, case studies, project imagery, and advertisements published by the Company (<a href="https://completemyproject.co.uk" target="_blank" rel="noopener noreferrer" className="text-oak-600 font-semibold underline hover:text-oak-700">completemyproject.co.uk</a>) on social media platforms (including but not limited to Meta, Facebook, Instagram, TikTok, LinkedIn, and YouTube) are provided strictly for general illustrative and informational purposes.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">10.2 No Contractual Reliance or Warranties</h3>
              <p className="mb-3">
                Social media advertisements do not constitute a formal legal offer, a guarantee of project outcomes, a fixed pricing quote, or a binding contractual term. Because every multi-trade project varies significantly based on structural specs, location, and materials, the Customer acknowledges that they cannot legally rely on social media content as a representation of their specific project. The Company gives no warranties, express or implied, regarding the exact replication of any project shown online.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">10.3 Exclusion of Liability for Third-Party Content &amp; Interpretation</h3>
              <p>
                The Company completely excludes any liability for financial loss, distress, or damages arising from a Customer's interpretation or misinterpretation of social media advertising copy or graphics. Furthermore, where project imagery or testimonials feature independent multi-trade contractors onboarded to our network, those materials represent the past work of that specific contractor only, and the Company is not liable for any discrepancies between advertised media and real-world project execution.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">11. No Guarantee of Immediate Work or Job Availability</h2>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">11.1 Platform Nature &amp; Job Availability</h3>
              <p className="mb-3">
                The Tradesperson acknowledges and agrees that the Company (<a href="https://completemyproject.co.uk" target="_blank" rel="noopener noreferrer" className="text-oak-600 font-semibold underline hover:text-oak-700">completemyproject.co.uk</a>) operates as a project matching network and does not guarantee the immediate provision, allocation, or continuous supply of work, leads, or projects upon registration. Promotional materials, flyers, or advertisements placed at trade/wholesale counters indicating active or available projects represent general market demand at the time of publication and do not constitute a binding guarantee, legal offer, or reservation of specific jobs for any individual applicant.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">11.2 Independent Application &amp; Background Check Costs</h3>
              <p>
                Registration, compliance screening, and third-party verification fees—including but not limited to Basic DBS background checks (£21.50 or any updated statutory fee) paid directly to government authorities or screening bodies—are non-refundable administrative requirements for platform eligibility. The Tradesperson confirms that all such vetting costs are undertaken voluntarily at their own business risk and expense. The Company shall accept zero legal or financial liability, nor shall it be required to reimburse any vetting, background check, or setup costs, in the event that projects are allocated to other verified contractors, jobs become unavailable, or the Tradesperson does not secure work through the platform immediately or at any point thereafter.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">12. Limitation of DBS Vetting &amp; Subcontractor Labour Disclaimer</h2>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">12.1 Scope of Platform Background Checks</h3>
              <p className="mb-3">
                Where the Company (<a href="https://completemyproject.co.uk" target="_blank" rel="noopener noreferrer" className="text-oak-600 font-semibold underline hover:text-oak-700">completemyproject.co.uk</a>) indicates that a multi-trade firm has passed background or Basic DBS screening, such checks are strictly limited to the named directors at the point of platform onboarding. The Company does not conduct DBS checks, background screening, or ongoing identity verification on general employees, site operatives, trade specialists, or secondary subcontractors hired by the multi-trade firm.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">12.2 Independent Contractor Responsibility for Labour</h3>
              <p className="mb-3">
                The Customer explicitly acknowledges that any formal contract for construction, renovation, or trade services is formed directly between the Customer and the assigned Multi-Trade Company. The Multi-Trade Companies responsibility is to act as an independent primary contractor and retains total responsibility for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Managing, supervising, and vetting its own workforce, site labor, and sub-tier contractors.</li>
                <li>Ensuring appropriate site safety, conduct, and compliance with all relevant UK employment and trade standards.</li>
              </ul>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">12.3 Exclusion of Platform Liability for Site Personnel</h3>
              <p>
                <a href="https://completemyproject.co.uk" target="_blank" rel="noopener noreferrer" className="text-oak-600 font-semibold underline hover:text-oak-700">Completemyproject.co.uk</a> accepts zero liability, financial accountability, or duty of care in relation to the personal conduct, criminal history, or screening status of individual site operatives, sub-contracted tradespeople, or employees brought onto the Customer's premises by the Multi-Trade Company.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">13. Initial Scoping &amp; Site Visits</h2>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">13.1 Purpose of Site Visits</h3>
              <p className="mb-3">
                Where CMP conducts an in-person site visit or telephone scoping assessment, this service is provided strictly to gather basic project specifications, photos, and customer preferences to match you with an appropriate Service Provider.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">13.2 No Technical/Structural Surveys</h3>
              <p className="mb-3">
                CMP's scoping assessments do not constitute an architectural, structural, or quantity survey. CMP assumes no liability for hidden defects, structural issues, or unobserved property conditions that are not identified during an initial scoping visit.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">13.3 Property Access &amp; Safety</h3>
              <p className="mb-3">
                During any site visit, the Customer agrees to provide safe access to the relevant areas of the property. CMP representatives reserve the right to decline entering any area deemed unsafe or hazardous.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">13.4 Final Quotations</h3>
              <p>
                The project scope produced by CMP is for guidance only. The Multi-Trade Company remains solely responsible for conducting its own technical survey and issuing the official, binding contract and quote to the Customer.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">14. Partnership Opportunity Document &amp; Any Introducers</h2>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">14.1 Introduction</h3>
              <p className="mb-3">
                Complete My Project may enter into arrangements with individuals, businesses, multi-trade companies, contractors, consultants, or other third parties (&ldquo;Introducers&rdquo;) who introduce prospective clients or business opportunities to Complete My Project.
              </p>
              <p>
                These terms apply equally to introductions of individual clients and multi-trade companies or other commercial organisations.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">14.2 Introduction Commission</h3>
              <p className="mb-3">
                Subject to the terms below, Complete My Project will pay the Introducer a commission equal to 10% of the net amount actually received by Complete My Project from a client or business introduced by the Introducer.
              </p>
              <p className="mb-3">
                For the avoidance of doubt, the commission is calculated on the amount actually received by Complete My Project and not on the value of any quotation, estimate, contract, invoice, or proposed project.
              </p>
              <p className="mb-3">
                For example, if Complete My Project receives £10,000 from an introduced client or business, the Introducer's commission will be £1,000, being 10% of the amount actually received.
              </p>
              <p className="mb-3">
                Each Partnership or Introducer must enter into and sign a separate Introducer Agreement with Complete My Project prior to any referral fee becoming payable.
              </p>
              <p>
                The standard referral fee is 10%; however, Complete My Project may, at its discretion, agree a higher or lower percentage with an individual Partnership or Introducer. The agreed percentage and any other applicable terms will be clearly set out in the relevant signed Introducer Agreement. This ensures that the terms of each partnership are agreed in advance and remain clear and transparent to all parties. Introducers come under the definition of letting agents, businesses, individuals, architects, valuers, and commercial letting agents.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">15. Trade Deals and Third-Party Providers</h2>
              <p className="mb-3">
                Any trade deals, offers, discounts, services or quotations displayed, promoted or advertised on the CMP website may be provided by independent third-party multi-trade companies or other external service providers.
              </p>
              <p className="mb-3">
                CMP acts as a marketing and promotional platform in relation to such trade deals. CMP does not itself provide, carry out or supervise the underlying trade services unless expressly stated otherwise.
              </p>
              <p>
                The companies, offers, prices, availability, terms and scope of trade deals displayed on the CMP website may change from time to time. CMP reserves the right to amend, withdraw or replace any trade deal or third-party offer without notice.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">Responsibility for Trade Services</h3>
              <p className="mb-3">
                Where a customer chooses to contact, instruct or enter into an agreement with a third-party multi-trade company or other trade provider following an offer or introduction made through CMP, the resulting contract for the supply of goods or services is between the customer and that third-party provider.
              </p>
              <p className="mb-3">The third-party provider is solely responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>assessing the customer's requirements;</li>
                <li>providing quotations and confirming prices;</li>
                <li>agreeing the scope of works;</li>
                <li>supplying and carrying out the relevant works or services;</li>
                <li>ensuring that the works or services are carried out to the required standard;</li>
                <li>providing any guarantees or warranties offered;</li>
                <li>dealing with complaints, cancellations, refunds or remedial works relating to its services; and</li>
                <li>complying with all applicable laws, regulations, licences, insurance requirements and professional obligations applicable to its services.</li>
              </ul>
              <p className="mb-3">
                CMP is not a party to the contract between the customer and the third-party provider and does not control or supervise the third-party provider's performance.
              </p>
              <p>
                CMP therefore accepts no responsibility for the performance, workmanship, quality, timing, availability, pricing or suitability of services supplied by an independent third-party provider, except to the extent that liability cannot lawfully be excluded or limited.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">CMP's Role</h3>
              <p className="mb-3">
                CMP's role in relation to third-party trade deals is limited to marketing, advertising and/or facilitating an introduction between the customer and the relevant third-party provider.
              </p>
              <p className="mb-3">
                The appearance of a trade deal, company, service, offer, quotation or provider on the CMP website should not be interpreted as a guarantee, warranty, certification or endorsement by CMP of the provider or of the quality, suitability or outcome of the services offered.
              </p>
              <p className="mb-3">
                Customers are responsible for satisfying themselves as to the identity, suitability, qualifications, insurance, pricing, terms and capabilities of any third-party provider before entering into a contract with that provider.
              </p>
              <p>
                Where a customer proceeds with a third-party provider, any subsequent dispute concerning the provision of the trade services should ordinarily be raised directly with that provider in accordance with the contract between the customer and the provider.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">Accuracy of Third-Party Information</h3>
              <p className="mb-3">
                CMP may display information supplied by third-party providers, including descriptions of services, prices, discounts, availability, photographs, qualifications, credentials and other promotional information.
              </p>
              <p className="mb-3">
                While CMP may take reasonable steps to present information accurately, CMP does not guarantee that information supplied by third parties will remain current, complete or accurate at all times. Customers should confirm the current price, scope, availability and terms directly with the relevant provider before entering into any agreement.
              </p>
              <p>
                CMP is not responsible for changes made by a third-party provider to its services, prices, offers, availability or terms after information has been submitted to or published by CMP, subject to any liability which cannot lawfully be excluded or limited.
              </p>

              <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">No Guarantee of Outcome</h3>
              <p className="mb-3">
                CMP does not guarantee that an introduction or marketing activity will result in a quotation, appointment, contract, completed work or particular outcome.
              </p>
              <p className="mb-3">
                Similarly, CMP does not guarantee the availability of any particular trade deal or third-party provider. Trade deals may be changed, suspended or withdrawn by the relevant provider at any time.
              </p>
              <p>
                Nothing in these Terms is intended to exclude or limit any legal rights or remedies that a customer may have under applicable law.
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
