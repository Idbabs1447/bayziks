import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { navigation } from "@/lib/content";
import { Button, Container, Wordmark } from "./ui";
import { MobileNavigation } from "./mobile-navigation";

export function Header({ minimal = false }: { minimal?: boolean }) {
  return <header className={`site-header ${minimal ? "site-header--minimal" : ""}`}><Container className="header-inner">
    <Wordmark tagline={!minimal} />
    {minimal ? <Link className="back-link" href="/"><ArrowLeft size={17} aria-hidden="true" /><span>Back to Bayzicks</span></Link> : <>
      <nav aria-label="Main navigation" className="desktop-navigation">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
      <Button href="/resources/digital-careers-field-guide" className="header-cta">Get the free guide<ArrowUpRight size={17} aria-hidden="true" /></Button>
      <MobileNavigation />
    </>}
  </Container></header>;
}
