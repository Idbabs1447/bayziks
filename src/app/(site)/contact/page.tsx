import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { inquiryConfiguration, pageMetadata } from "@/lib/site";
import { ContactForm } from "@/components/inquiry-form";
import { Container, Eyebrow } from "@/components/ui";

export const metadata = pageMetadata("Contact Bayzicks", "Have a question about Bayzicks, a free resource or getting started with digital careers? Send an enquiry using the contact form.", "/contact");

export default function ContactPage() {
  return <main id="main-content"><Container className="inquiry-layout"><div className="inquiry-intro"><Eyebrow>LET’S TALK</Eyebrow><h1>A question?<br />You’re welcome here.</h1><p>Whether it’s about a resource, something on the site or digital work in general, use the form to get in touch.</p><div className="inquiry-notes"><div className="inquiry-note"><h2>Asking about the guide?</h2><p>Include the name of the resource and what you need help with. Please don’t share passwords or sensitive personal information.</p></div><div className="inquiry-note"><h2>Have a collaboration in mind?</h2><p>There’s a separate form for brand and business enquiries.</p><Link href="/collaborate" className="arrow-link">Visit the collaboration page<ArrowUpRight size={15} aria-hidden="true" /></Link></div><div className="inquiry-note"><h2>Looking for a starting point?</h2><Link href="/start-here" className="arrow-link">Explore the career paths<ArrowUpRight size={15} aria-hidden="true" /></Link></div></div></div><ContactForm deliveryReady={inquiryConfiguration().ready} /></Container></main>;
}
