import { ArrowRight } from "lucide-react";
import { Button, Container } from "./ui";

export function FinalCTA({ href = "/resources/digital-careers-field-guide" }: { href?: string }) {
  return <section className="final-cta" aria-labelledby="final-cta-title"><Container><span className="final-star" aria-hidden="true">✳</span><h2 id="final-cta-title">Start with the free guide.</h2><p>Get to know your options before deciding your next move.</p><Button href={href}>Get the free career guide<ArrowRight size={17} aria-hidden="true" /></Button></Container></section>;
}
