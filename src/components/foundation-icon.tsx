import { BriefcaseBusiness, GraduationCap, LaptopMinimal, Lightbulb, UserRound } from "lucide-react";

const icons = { roles: UserRound, skills: Lightbulb, tools: LaptopMinimal, paths: GraduationCap, opportunities: BriefcaseBusiness };
export function FoundationIcon({ name, size = 24, className = "" }: { name: keyof typeof icons; size?: number; className?: string }) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.55} aria-hidden="true" className={className} />;
}
