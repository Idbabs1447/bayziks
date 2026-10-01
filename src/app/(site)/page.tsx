import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { brand, foundations, resources } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import { BrandVisual } from "@/components/guide-visual";
import { FoundationIcon } from "@/components/foundation-icon";
import { GuideFeature } from "@/components/guide-feature";
import { ResourceCard } from "@/components/resource-card";
import { LearningOptions } from "@/components/learning-options";
import { FAQ } from "@/components/faq";
import { FinalCTA } from "@/components/final-cta";
import { Button, Container, Eyebrow, Section } from "@/components/ui";

export const metadata = pageMetadata("Digital careers, starting with the basics", "Bayzicks helps beginners understand digital careers, remote work, freelancing, digital marketing and tech. Get the free Digital Careers Field Guide.", "/");

export default function HomePage() {
  return <main id="main-content">
    <section className="hero" aria-labelledby="hero-title"><Container className="hero-grid"><div className="hero-copy"><Eyebrow>{brand.hero.eyebrow}</Eyebrow><h1 id="hero-title" className="hero-title"><span>Digital careers</span><span>don’t have to be</span><span><em>confusing.</em></span></h1><p className="hero-description">{brand.hero.description}</p><div className="hero-actions"><Button href="#free-guide">Get the free career guide<ArrowRight size={17} aria-hidden="true" /></Button><Link className="arrow-link" href="/start-here#career-paths">Explore career paths<ArrowUpRight size={16} aria-hidden="true" /></Link></div><p className="hero-note"><BookOpen size={13} strokeWidth={1.5} aria-hidden="true" />Beginner-friendly. Free to get started.</p></div><div className="hero-visual"><BrandVisual /></div></Container></section>
    <div className="topic-strip"><Container className="topic-strip-inner"><span className="topic-strip-label">A WORLD OF POSSIBILITIES. ONE CLEAR START.</span><div className="topic-strip-topics" aria-label="The five Bayzicks foundations"><span>Roles</span><span>Skills</span><span>Tools</span><span>Learning paths</span><span>Opportunities</span></div></Container></div>
    <Section id="start-here" labelledBy="foundations-title"><div className="problem-grid"><div><Eyebrow>LET’S START WITH THE BASICS</Eyebrow><h2 className="section-heading" id="foundations-title">There’s a lot out there.<br />Let’s make sense of it.</h2></div><div className="problem-copy"><p>Unfamiliar job titles. Advice full of jargon. Skills you’ve never heard of. It can be hard to tell what a digital career actually involves, let alone where to start.</p><p><strong>Bayzicks breaks it down into five useful foundations</strong> so you can understand your options and choose what to explore next.</p></div></div><div className="foundation-grid">{foundations.map((item) => <Link className="foundation-item" href={`/start-here#${item.id}`} key={item.id}><span className={`foundation-icon color-${item.color}`}><FoundationIcon name={item.icon} size={23} /></span><h3>{item.title}<ArrowRight size={14} aria-hidden="true" /></h3><p>{item.description}</p></Link>)}</div></Section>
    <GuideFeature />
    <Section labelledBy="resources-title"><div className="section-header"><div><Eyebrow>THE RESOURCE LIBRARY</Eyebrow><h2 id="resources-title" className="section-heading">Useful resources.<br />A good place to begin.</h2></div><Link href="/resources" className="arrow-link">Explore the library<ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className="resource-grid home-resource-grid">{resources.map((resource) => <ResourceCard key={resource.slug} resource={resource} />)}</div></Section>
    <LearningOptions />
    <Section labelledBy="about-title"><div className="about-grid"><div className="about-quote"><span aria-hidden="true">✳</span><p>The digital world,<br /><em>made simple.</em></p><small>THAT’S THE IDEA BEHIND BAYZICKS.</small></div><div className="about-copy"><Eyebrow>WHY BAYZICKS</Eyebrow><h2 id="about-title" className="section-heading">Good guidance starts<br />with the basics.</h2><p>{brand.purpose}</p><p>The goal is practical: explain what digital work looks like, make unfamiliar terms clearer and help you take an informed first step.</p><Link className="arrow-link" href="/about">A little more about Bayzicks<ArrowUpRight size={16} aria-hidden="true" /></Link></div></div></Section>
    <Section className="faq-section" labelledBy="faq-title"><div className="faq-grid"><div className="faq-intro"><Eyebrow>A FEW USEFUL ANSWERS</Eyebrow><h2 className="section-heading" id="faq-title">Before you<br />get started.</h2><p>Have a question that’s not covered here?</p><Link className="arrow-link" href="/contact">Get in touch<ArrowUpRight size={16} aria-hidden="true" /></Link></div><FAQ /></div></Section>
    <FinalCTA href="#free-guide" />
  </main>;
}
