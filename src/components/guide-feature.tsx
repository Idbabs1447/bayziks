import type { SignupSource } from "@/lib/content";
import { newsletterConfiguration } from "@/lib/site";
import { GuideVisual } from "./guide-visual";
import { EmailSignupForm } from "./email-signup-form";
import { Container, Eyebrow } from "./ui";

export function GuideFeature({ source = "homepage" }: { source?: SignupSource }) {
  return <section id="free-guide" className="guide-feature" aria-labelledby="free-guide-title"><Container className="guide-feature-grid">
    <div className="guide-feature-visual"><GuideVisual /></div>
    <div><Eyebrow>YOUR FREE STARTING POINT</Eyebrow><h2 id="free-guide-title">The Digital Careers<br /><em>Field Guide</em></h2><p className="guide-feature-description">Get a beginner-friendly overview of digital career options, the skills and tools behind them, and practical ways to start learning. A useful guide to come back to as you explore.</p><EmailSignupForm source={source} deliveryReady={newsletterConfiguration().ready} dark /></div>
  </Container></section>;
}
