import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, FileDown, FileText, ListChecks } from "lucide-react";
import type { Resource } from "@/lib/content";

export function ResourceCard({ resource }: { resource: Resource }) {
  const available = resource.status !== "planned";
  const contents = <>
    <div className={`resource-image resource-image--${resource.theme}`}><span className="resource-status">{available ? "FREE RESOURCE" : "COMING SOON"}</span>{available && resource.cover ? <Image className="resource-cover" src={resource.cover.src} alt={resource.cover.alt} width={resource.cover.width} height={resource.cover.height} sizes="150px" /> : <div className="planned-resource-art" aria-hidden="true">{available ? <FileText size={53} strokeWidth={1} /> : resource.category === "Freelancing" ? <BriefcaseBusiness size={53} strokeWidth={1} /> : <ListChecks size={53} strokeWidth={1} />}</div>}</div>
    <div className="resource-content"><span className="resource-category">{resource.category.toUpperCase()}</span><div className="resource-title-row"><h3>{resource.title}</h3>{available && <ArrowUpRight size={19} strokeWidth={1.3} aria-hidden="true" />}</div><p>{resource.description}</p><span className="resource-format">{available && <FileDown size={12} aria-hidden="true" />}{resource.format}</span></div>
  </>;
  return <article className="resource-card">{available ? <Link className="resource-card-link" href={`/resources/${resource.slug}`}>{contents}</Link> : contents}</article>;
}
