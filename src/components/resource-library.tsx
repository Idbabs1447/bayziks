"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { resourceCategories, resources, type ResourceCategory } from "@/lib/content";
import { ResourceCard } from "./resource-card";
import { Button } from "./ui";

export function ResourceLibrary() {
  const [category, setCategory] = useState<ResourceCategory | "All resources">("All resources");
  const [query, setQuery] = useState("");
  const filtered = resources.filter((resource) => (category === "All resources" || resource.category === category) && `${resource.title} ${resource.description} ${resource.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <div className="library-toolbar"><div className="library-filters" role="group" aria-label="Filter resources by category">{(["All resources", ...resourceCategories] as const).map((item) => <button className="filter-button" type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="search-field"><label htmlFor="resource-search" className="sr-only">Search resources</label><Search size={15} aria-hidden="true" /><input id="resource-search" type="search" className="field-input" placeholder="Find a resource…" value={query} onChange={(event) => setQuery(event.target.value)} /></div></div>
    <p className="resource-count" role="status">{filtered.length} {filtered.length === 1 ? "resource" : "resources"}{category !== "All resources" ? ` in ${category}` : " to explore"}. Planned resources are clearly marked.</p>
    {filtered.length ? <div className="resource-grid">{filtered.map((resource) => <ResourceCard key={resource.slug} resource={resource} />)}</div> : <div className="library-empty"><h2>Nothing here just yet.</h2><p>{query ? "Try another search, or take a look at all the resources." : "This part of the library is still taking shape. The career guide is a useful place to begin."}</p><Button variant="outline" onClick={() => { setCategory("All resources"); setQuery(""); }}>View all resources</Button></div>}
  </>;
}
