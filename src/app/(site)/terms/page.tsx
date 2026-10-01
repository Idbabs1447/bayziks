import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { Container, Eyebrow } from "@/components/ui";

export const metadata = pageMetadata("Terms of Use", "Starter terms for using Bayzicks educational resources, submitting enquiries and understanding the limits of career information.", "/terms");

// LEGAL REVIEW REQUIRED: replace the draft with reviewed terms identifying the
// legal business, contact details, applicable jurisdiction, permitted resource
// licence, age requirements and mandatory consumer protections. Add separate
// reviewed terms before offering paid services, coaching or consultations.
export default function TermsPage() {
  return <main id="main-content"><Container className="legal-page"><Eyebrow>USING BAYZICKS</Eyebrow><h1>Terms of Use</h1><p className="legal-date">Starter terms · legal and business review required before launch</p><aside className="legal-notice">These are starter terms, not a final legal agreement. The legal business identity, contact details, governing law and resource licence must be reviewed and completed before public launch.</aside><div className="legal-prose">
    <h2>1. Educational information</h2><p>Bayzicks provides general educational information about digital careers, skills, tools and ways of working. The material helps you explore options; it is not personalised employment, financial, legal or other regulated advice.</p><p>Resources and examples do not guarantee a job, income, qualification, client, career outcome or suitability for a particular role. You are responsible for checking requirements and deciding whether a path is appropriate for you.</p>
    <h2>2. Using the website</h2><p>Use the website lawfully and do not attempt to disrupt it, bypass its protections, send spam or submit another person’s information without permission. Do not include passwords, confidential documents or sensitive personal information in enquiry forms.</p>
    <h2>3. Free resources and email signup</h2><p>A guide request asks for consent to receive the requested resource and occasional Bayzicks emails. You can unsubscribe using the link in live marketing emails. Email delivery depends on the configured service and a valid email address, and may require confirmation first.</p><p>When the form is in preview mode, no real subscription or email delivery occurs. The form clearly states this before and after submission. A preview response is not confirmation that Bayzicks has received your details.</p>
    <h2>4. Content and permitted use</h2><p>Unless a resource states otherwise, Bayzicks resources are intended for personal learning. Do not sell, redistribute or present them as your own work without permission. Third-party names and tools mentioned remain the property of their respective owners, and a mention does not imply a partnership or endorsement.</p><p>The final resource licence, copyright ownership and any permitted sharing terms should be confirmed before publication.</p>
    <h2>5. Service availability</h2><p>Items marked “Coming soon” or “More details coming soon” are not an offer of an available service. No booking, payment or purchase is created through the current website. If paid services are introduced, separate terms, pricing, cancellation and refund information should be published before purchase.</p>
    <h2>6. Collaboration enquiries</h2><p>Submitting a collaboration proposal does not create a partnership, sponsorship, affiliation or obligation to proceed. Any agreed work would require a separate agreement. Bayzicks does not claim previous brand relationships through the examples on this website.</p>
    <h2>7. External services and links</h2><p>Third-party platforms, providers and websites operate under their own terms. Their products, pricing, features and availability can change. Check information at its source before making a decision.</p>
    <h2>8. Accuracy and limitations</h2><p>Career information and tools change over time. Bayzicks aims to provide useful explanations, but the final terms should define appropriate limitations and responsibilities in line with applicable law. Nothing in these starter terms is intended to remove mandatory legal rights.</p>
    <h2>9. Contact and updates</h2><p>For a question about these terms, use the <Link href="/contact">contact page</Link>. The final terms must include the legal operator’s details, applicable law and a reviewed publication date.</p>
  </div></Container></main>;
}
