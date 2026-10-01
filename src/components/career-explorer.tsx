"use client";

import { CalendarDays, ChartNoAxesCombined, Code2, Megaphone, MessagesSquare, PenTool } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { careerPaths } from "@/lib/content";

const icons = { CalendarDays, ChartNoAxesCombined, Code2, Megaphone, MessagesSquare, PenTool };

export function CareerExplorer() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const career = careerPaths[selected];
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % careerPaths.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + careerPaths.length) % careerPaths.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = careerPaths.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }
  return <div className="career-explorer" id="career-paths"><div className="career-tabs" role="tablist" aria-label="Explore digital career paths">{careerPaths.map((path, index) => { const Icon = icons[path.icon]; return <button ref={(element) => { tabs.current[index] = element; }} type="button" className="career-tab" key={path.id} role="tab" id={`career-tab-${path.id}`} aria-selected={selected === index} aria-controls="career-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => keyboard(event, index)}><Icon size={22} strokeWidth={1.4} aria-hidden="true" />{path.title}</button>; })}</div>
    <div id="career-panel" className="career-panel" role="tabpanel" aria-labelledby={`career-tab-${career.id}`} tabIndex={0}><h2>{career.title}</h2><p className="career-summary">{career.summary}</p><div className="career-details"><div><h3>What the work can involve</h3><p>{career.work}</p><h3>Skills to start building</h3><ul className="skill-tags">{career.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul><h3>Tools you may come across</h3><p>{career.tools}</p></div><div><div className="career-first-step"><span>A SMALL FIRST PROJECT</span><p>{career.firstStep}</p></div></div></div></div>
  </div>;
}
