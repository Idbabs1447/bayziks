import assert from "node:assert/strict";

const base = (process.env.SMOKE_TEST_URL || "http://localhost:3000").replace(/\/$/, "");
const previewTests = process.env.SMOKE_TEST_PREVIEW === "1";
let assertions = 0;
function check(value, message) { assert.ok(value, message); assertions += 1; console.log(`✓ ${message}`); }
const paths = ["/", "/start-here", "/resources", "/resources/digital-careers-field-guide", "/about", "/contact", "/collaborate", "/privacy", "/terms"];
const pages = new Map();
for (const path of paths) {
  const response = await fetch(`${base}${path}`);
  check(response.status === 200, `${path} returns 200`);
  const html = await response.text();
  pages.set(path, html);
  check(html.includes('id="main-content"') && /<h1\b/.test(html), `${path} has a main landmark and page heading`);
  check(html.includes('rel="canonical"') && html.includes('name="description"'), `${path} has canonical and description metadata`);
}
for (const [path, html] of pages) {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const url = new URL(href, `${base}${path}`);
    const destination = pages.get(url.pathname);
    check(Boolean(destination), `${path} link resolves: ${href}`);
    if (url.hash && destination) check(destination.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${href} has a matching anchor`);
  }
}
for (const asset of ["/robots.txt", "/sitemap.xml", "/images/digital-careers-guide.svg", "/icon.svg", "/opengraph-image"]) {
  const response = await fetch(`${base}${asset}`);
  check(response.status === 200, `${asset} is available`);
  if (asset === "/opengraph-image") check(response.headers.get("content-type")?.includes("image/png"), "Social image is a real PNG");
}
const notFound = await fetch(`${base}/this-page-does-not-exist`);
check(notFound.status === 404, "Unknown pages return a real 404");
let requestCounter = 1;
async function post(path, data, headers = {}) {
  const response = await fetch(`${base}${path}`, { method: "POST", headers: { "Content-Type": "application/json", Origin: base, "X-Forwarded-For": `198.51.100.${requestCounter++}`, ...headers }, body: JSON.stringify(data) });
  return { response, body: await response.json() };
}
const signup = { email: "preview@example.com", resourceId: "digital-careers-field-guide", source: "homepage", consent: true, website: "" };
let result = await post("/api/subscribe", { ...signup, email: "invalid" });
check(result.response.status === 422 && result.body.status === "error", "Invalid newsletter email is rejected");
result = await post("/api/subscribe", { ...signup, resourceId: "arbitrary-tag" });
check(result.response.status === 422, "Unknown lead magnets cannot create arbitrary tags");
result = await post("/api/subscribe", { ...signup, consent: false });
check(result.response.status === 422, "Signup requires consent");
result = await post("/api/subscribe", { ...signup, website: "spam" });
check(result.response.status === 400, "Honeypot rejects spam");
result = await post("/api/subscribe", signup, { Origin: "https://untrusted.example", "Sec-Fetch-Site": "cross-site" });
check(result.response.status === 403, "Cross-origin form submissions are rejected");
result = await post("/api/subscribe", signup, { "Content-Type": "text/plain" });
check(result.response.status === 415, "Non-JSON submissions are rejected");
result = await post("/api/subscribe", { ...signup, website: "x".repeat(20000) });
check(result.response.status === 413, "Oversized request bodies are rejected");
const inquiry = { name: "Preview Visitor", email: "preview@example.com", category: "General question", message: "This is a preview enquiry for validation testing only.", website: "" };
result = await post("/api/contact", { ...inquiry, name: "", email: "bad", message: "short" });
check(result.response.status === 422 && result.body.errors?.name && result.body.errors?.email && result.body.errors?.message, "Contact validation returns accessible field errors");
result = await post("/api/collaborate", { ...inquiry, category: "Unsupported category" });
check(result.response.status === 422 && result.body.errors?.category, "Collaboration categories are allowlisted");
if (previewTests) {
  check(pages.get("/").includes("Preview mode") && pages.get("/contact").includes("Preview mode"), "Preview checks run only when the public build shows preview notices");
  result = await post("/api/subscribe", signup);
  check(result.response.status === 200 && result.body.status === "preview" && result.body.message.includes("no guide email was sent"), "Newsletter mock explicitly says no subscription/email occurred");
  result = await post("/api/contact", inquiry);
  check(result.response.status === 200 && result.body.status === "preview" && result.body.message.includes("hasn’t been sent or saved"), "Contact mock never reports a real submission");
  result = await post("/api/collaborate", { ...inquiry, category: "Co-created resource", organization: "Preview only" });
  check(result.response.status === 200 && result.body.status === "preview", "Collaboration mock is explicitly labelled preview");
}
for (let attempt = 0; attempt < 9; attempt++) result = await post("/api/subscribe", { ...signup, email: "invalid" }, { "X-Forwarded-For": "203.0.113.240" });
check(result.response.status === 429 && result.response.headers.has("retry-after"), "Repeated requests are rate-limited with Retry-After");
console.log(`\nPassed ${assertions} smoke assertions.`);
