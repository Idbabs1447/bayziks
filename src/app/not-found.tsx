import { ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button, Container, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return <><Header /><main id="main-content"><Container className="not-found"><Eyebrow>404 · A SMALL DETOUR</Eyebrow><h1>Let’s find your way back.</h1><p>That page isn’t here. You can return to Bayzicks or find a useful starting point in the resource library.</p><Button href="/resources">Explore the resources<ArrowRight size={17} aria-hidden="true" /></Button></Container></main><Footer /></>;
}
