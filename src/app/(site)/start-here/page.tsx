import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/site";
import { CareerExplorer } from "@/components/career-explorer";
import { Button, Container, Eyebrow } from "@/components/ui";

export const metadata = pageMetadata("Start here: explore digital career paths", "Compare beginner-friendly digital career paths, understand the work behind each role, and try a small first project with Bayzicks.", "/start-here");

const basics = [
  { id: "roles", title: "Understand the role", description: "A job title is only a starting point. Read the responsibilities and look at examples of the work. The same title can mean different things in different organisations." },
  { id: "skills", title: "Choose useful skills", description: "Start with one role and a few relevant skills. Communication, organisation and problem-solving are useful across many digital careers. A small project helps you practise in context." },
  { id: "tools", title: "Get to know the tools", description: "Tools support the work. You don’t need to learn every platform at once. Try a free version where available, learn the basics and notice which tasks it helps you complete." },
  { id: "learning-paths", title: "Make a learning path", description: "Begin with an introductory lesson, then use it in a simple project. Keep a record of what you make and what you learn. Build on that experience rather than collecting courses without practising." },
  { id: "opportunities", title: "Know the types of work", description: "Remote describes where you work. Freelancing describes how you work. Look at company career pages, reputable job boards and professional networks. Read requirements carefully, and never pay someone just to be considered for a job." },
];

export default function StartHerePage() {
  return <main id="main-content"><Container><div className="page-intro"><Eyebrow>YOUR FIRST LOOK AT DIGITAL WORK</Eyebrow><h1>Find a career path<br />worth exploring.</h1><p>Choose a path below to see what the work can involve, which skills matter and a small project you can try. These are starting points, not a promise of a particular job or income.</p></div><CareerExplorer /><section className="page-section" aria-labelledby="basics-title"><div className="basics-intro"><h2 id="basics-title">Build a little understanding first.</h2><p>Whichever role catches your interest, these five foundations will help you ask better questions and plan your learning.</p></div><ol className="basics-list">{basics.map((item, index) => <li id={item.id} key={item.id}><span aria-hidden="true">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol><div className="start-guide"><div><h2>Keep the bigger picture handy.</h2><p>The free field guide brings your career options and first steps together.</p></div><Button href="/resources/digital-careers-field-guide">Get the free guide<ArrowRight size={17} aria-hidden="true" /></Button></div></section></Container></main>;
}
