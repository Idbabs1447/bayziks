import { ArrowUpRight, BookOpen, Compass, MessageCircle, UsersRound } from "lucide-react";
import Link from "next/link";
import { Eyebrow, Section } from "./ui";

export function LearningOptions() {
  const options = [
    { title: "Free resources", description: "Guides and practical starting points you can explore at your own pace.", icon: BookOpen, available: true },
    { title: "Community", description: "Learning alongside other beginners, with room for questions and shared discoveries.", icon: UsersRound, available: false },
    { title: "Coaching", description: "Focused support for developing skills and putting a learning plan together.", icon: Compass, available: false },
    { title: "1:1 consultation", description: "A conversation about your interests, a career path or a specific next step.", icon: MessageCircle, available: false },
  ];
  return <Section id="work-with-me" className="work-section" labelledBy="work-title"><div className="work-intro"><div><Eyebrow>WAYS TO LEARN WITH BAYZICKS</Eyebrow><h2 className="section-heading" id="work-title">Find your way to learn.</h2></div><p>Start with the free resources. Other ways to learn will be shared here as they become available.</p></div><div className="ways-grid">{options.map(({ title, description, icon: Icon, available }) => <article className="way-item" key={title}><Icon size={25} strokeWidth={1.4} aria-hidden="true" /><h3>{title}</h3><p>{description}</p>{available ? <Link href="/resources" className="arrow-link">Explore resources<ArrowUpRight size={15} aria-hidden="true" /></Link> : <span className="status-label">More details coming soon</span>}</article>)}</div></Section>;
}
