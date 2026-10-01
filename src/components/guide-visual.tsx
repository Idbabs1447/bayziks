import Image from "next/image";
import { ArrowDownToLine, Sparkle } from "lucide-react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { guideCover } from "@/lib/content";

export function GuideVisual({ priority = false }: { priority?: boolean }) {
  return <div className="guide-scene">
    <span className="scene-eyebrow"><Sparkle size={12} aria-hidden="true" />A CLEARER WAY TO GET STARTED</span>
    <span className="scene-orbit" aria-hidden="true" /><span className="scene-orbit scene-orbit--second" aria-hidden="true" />
    <div className="guide-book"><Image src={guideCover.src} alt={guideCover.alt} width={guideCover.width} height={guideCover.height} priority={priority} sizes="(max-width: 760px) 55vw, 310px" /></div>
    <div className="guide-badge" aria-hidden="true"><ArrowDownToLine size={20} strokeWidth={1.4} />YOUR FREE<br />STARTING POINT</div>
    <div className="guide-sticker" aria-hidden="true"><p>Your next step,<br /><em>a little clearer.</em></p><span>START WITH THE BAYZICKS.</span></div>
    <span className="scene-caption">The Digital Careers Field Guide{guideCover.preview ? " · cover preview" : ""}</span>
  </div>;
}

// Use the supplied original, unchanged, when it is available. Never recreate it.
// The attachment was not supplied as a file in this workspace; see README.
export function BrandVisual() {
  const path = process.env.BAYZICKS_IMAGE_PATH || "/images/bayzicks-digital-world.png";
  const safePath = path.startsWith("/images/") && !path.includes("..") && /\.(png|jpe?g|webp)$/i.test(path);
  const available = safePath && existsSync(join(process.cwd(), "public", path.slice(1)));
  if (!available) return <GuideVisual priority />;
  return <figure className="brand-image-wrap"><Image src={path} alt="The Bayzicks digital-world graphic: unfamiliar digital-career terms become five clear foundations: roles, skills, tools, learning paths and job opportunities." width={946} height={630} priority sizes="(max-width: 760px) calc(100vw - 40px), 570px" /><figcaption>From a world of unfamiliar terms to a clearer starting point.</figcaption></figure>;
}
