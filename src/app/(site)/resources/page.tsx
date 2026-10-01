import { BookOpen } from "lucide-react";
import { pageMetadata } from "@/lib/site";
import { ResourceLibrary } from "@/components/resource-library";
import { FinalCTA } from "@/components/final-cta";
import { Container, Eyebrow } from "@/components/ui";

export const metadata = pageMetadata("Free resources for your digital career", "Explore beginner-friendly digital-career guides, freelancing resources, remote-work checklists and practical templates from Bayzicks.", "/resources");

export default function ResourcesPage() {
  return <main id="main-content"><Container><div className="page-intro"><Eyebrow>THE BAYZICKS RESOURCE LIBRARY</Eyebrow><h1>A useful place<br />to get started.</h1><p>Practical guides and starting points for understanding digital work. Begin with the career guide, or browse what’s taking shape next.</p></div><section className="page-section" aria-label="Resource library"><ResourceLibrary /><p className="library-note"><BookOpen size={18} strokeWidth={1.5} aria-hidden="true" /><span>This is a growing library. Resources marked “Coming soon” are planned and aren’t available to download. The guide request form will clearly show whether email delivery is connected.</span></p></section></Container><FinalCTA /></main>;
}
