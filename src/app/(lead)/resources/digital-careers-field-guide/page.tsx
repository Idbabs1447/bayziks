import { Check } from "lucide-react";
import { faqItems, foundations } from "@/lib/content";
import { newsletterConfiguration, pageMetadata } from "@/lib/site";
import { GuideVisual } from "@/components/guide-visual";
import { EmailSignupForm } from "@/components/email-signup-form";
import { FAQ } from "@/components/faq";
import { Container, Eyebrow } from "@/components/ui";

export const metadata = pageMetadata("The free Digital Careers Field Guide", "New to digital careers? Get a beginner-friendly guide to career options, skills, tools, learning paths and opportunities from Bayzicks.", "/resources/digital-careers-field-guide");

export default function FieldGuidePage() {
  return <main id="main-content" className="lead-page"><Container><section className="lead-hero" aria-labelledby="guide-page-title"><div className="lead-copy"><Eyebrow>A FREE GUIDE FOR COMPLETE BEGINNERS</Eyebrow><h1 id="guide-page-title">The Digital Careers<br /><em>Field Guide</em></h1><p className="lead-description">Make sense of digital work before you decide where to start. This beginner-friendly guide brings together career options, useful skills, everyday tools and practical learning paths.</p><ul className="lead-benefits"><li><Check size={16} strokeWidth={1.8} aria-hidden="true" />Understand what different digital roles involve.</li><li><Check size={16} strokeWidth={1.8} aria-hidden="true" />See which skills and tools are worth exploring first.</li><li><Check size={16} strokeWidth={1.8} aria-hidden="true" />Choose a manageable next step for yourself.</li></ul><EmailSignupForm source="instagram-guide" deliveryReady={newsletterConfiguration().ready} /></div><div className="lead-visual"><GuideVisual priority /></div></section></Container>
    <section className="lead-contents" aria-labelledby="inside-guide-title"><Container><h2 id="inside-guide-title">Five foundations. A clearer picture.</h2><div className="lead-contents-grid">{foundations.map((item, index) => <div className="lead-content-item" key={item.id}><span aria-hidden="true">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></div>)}</div></Container></section>
    <Container><section className="lead-faq" aria-labelledby="guide-faq-title"><h2 id="guide-faq-title">A few things to know.</h2><FAQ items={faqItems.filter((_, index) => [1, 2, 3].includes(index))} name="guide-faq" /></section></Container>
  </main>;
}
