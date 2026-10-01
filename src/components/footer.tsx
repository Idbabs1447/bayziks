import Link from "next/link";
import { ArrowUpRight, Camera as Instagram } from "lucide-react";
import { brand } from "@/lib/content";
import { getInstagramUrl } from "@/lib/site";
import { Container, Wordmark } from "./ui";

export function Footer({ minimal = false }: { minimal?: boolean }) {
  const instagramUrl = getInstagramUrl();
  const year = new Date().getFullYear();
  if (minimal) return <footer className="minimal-footer"><Container><p>© {year} Bayzicks</p><nav aria-label="Legal navigation"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></nav></Container></footer>;
  return <footer className="site-footer"><Container>
    <div className="footer-main">
      <div className="footer-brand"><Wordmark light /><p>{brand.description}</p><span className="footer-tagline">A little clarity goes a long way.</span></div>
      <div className="footer-links"><h2>EXPLORE</h2><Link href="/start-here">Start Here</Link><Link href="/resources">Resources</Link><Link href="/#work-with-me">Work With Me</Link><Link href="/about">About Bayzicks</Link></div>
      <div className="footer-links"><h2>LET’S CONNECT</h2><Link href="/contact">Contact<ArrowUpRight size={14} aria-hidden="true" /></Link><Link href="/collaborate">Collaborate<ArrowUpRight size={14} aria-hidden="true" /></Link>{instagramUrl ? <a href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram<Instagram size={15} aria-hidden="true" /></a> : <span className="footer-placeholder"><Instagram size={15} aria-hidden="true" />Instagram <small>Link coming soon</small></span>}</div>
      <div className="footer-resource"><span className="footer-resource-label">A GOOD PLACE TO BEGIN</span><Link href="/resources/digital-careers-field-guide">Your digital career,<br />a little clearer.<ArrowUpRight size={24} aria-hidden="true" /></Link><span>The free Digital Careers Field Guide</span></div>
    </div>
    <div className="footer-bottom"><p>© {year} Bayzicks. All rights reserved.</p><nav aria-label="Legal navigation"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms</Link></nav><span>Start with the basics.</span></div>
  </Container></footer>;
}
