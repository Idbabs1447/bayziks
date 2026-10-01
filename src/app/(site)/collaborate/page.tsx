import { ArrowUpRight } from "lucide-react";
import { inquiryConfiguration, pageMetadata } from "@/lib/site";
import { CollaborationForm } from "@/components/inquiry-form";
import { Container, Eyebrow } from "@/components/ui";

export const metadata = pageMetadata("Collaborate with Bayzicks", "Introduce a relevant brand partnership, product review, co-created resource or newsletter feature to Bayzicks using the collaboration enquiry form.", "/collaborate");

export default function CollaboratePage() {
  return <main id="main-content"><Container className="inquiry-layout"><div className="inquiry-intro"><Eyebrow>BRAND & BUSINESS ENQUIRIES</Eyebrow><h1>A useful idea<br />to work on together.</h1><p>Have something that could help beginners understand digital work? Introduce your idea and tell us how it would be useful to the Bayzicks audience.</p><ul className="collaboration-list"><li><ArrowUpRight size={16} aria-hidden="true" />Sponsored or affiliate partnerships</li><li><ArrowUpRight size={16} aria-hidden="true" />Product reviews</li><li><ArrowUpRight size={16} aria-hidden="true" />Co-created resources</li><li><ArrowUpRight size={16} aria-hidden="true" />Newsletter or community features</li></ul><div className="inquiry-notes"><div className="inquiry-note"><h2>Relevance comes first.</h2><p>Useful, beginner-friendly ideas are the starting point. Enquiries are considered individually, and sending a proposal doesn’t confirm a partnership.</p></div><div className="inquiry-note"><h2>What to include</h2><p>A short introduction, the idea, who it helps and any relevant scope or timing. Please don’t send confidential material in an initial enquiry.</p></div></div></div><CollaborationForm deliveryReady={inquiryConfiguration().ready} /></Container></main>;
}
