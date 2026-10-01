import { createHash } from "node:crypto";
import { leadMagnets, signupSources, type LeadMagnetId } from "@/lib/content";
import { newsletterConfiguration } from "@/lib/site";
import { isValidEmail } from "@/lib/validation";
import { apiResponse, guardRequest, readJson, RequestError, safeErrorResponse } from "@/lib/server/request";

export const runtime = "nodejs";

type Member = { status?: string; tags?: { name: string }[] };

export async function POST(request: Request) {
  try {
    guardRequest(request, "subscribe");
    const data = await readJson(request);
    if (!isValidEmail(data.email)) throw new RequestError(422, "Please enter a valid email address.");
    if (data.consent !== true) throw new RequestError(422, "Please agree to receive the guide and occasional Bayzicks emails.");
    if (typeof data.resourceId !== "string" || !Object.prototype.hasOwnProperty.call(leadMagnets, data.resourceId)) throw new RequestError(422, "Please choose a resource from the Bayzicks website.");
    if (typeof data.source !== "string" || !signupSources.some((source) => source === data.source)) throw new RequestError(422, "Please request the guide through the Bayzicks website.");
    const configuration = newsletterConfiguration();
    if (configuration.mode === "preview") return apiResponse({ status: "preview", message: "Preview only. Your email was validated, but it hasn’t been added to Mailchimp and no guide email was sent. Email delivery still needs to be connected." });
    if (!configuration.ready) throw new RequestError(503, "Guide delivery isn’t ready yet. Your email hasn’t been subscribed. Please try again later.");

    const apiKey = process.env.MAILCHIMP_API_KEY!.trim();
    const prefix = process.env.MAILCHIMP_SERVER_PREFIX!.trim();
    const audience = process.env.MAILCHIMP_AUDIENCE_ID!.trim();
    if (!/^us\d+$/.test(prefix) || !/^[a-zA-Z0-9]+$/.test(audience)) throw new RequestError(503, "Guide delivery is temporarily unavailable. Please try again later.");
    const email = data.email.trim().toLowerCase();
    const hash = createHash("md5").update(email).digest("hex");
    const url = `https://${prefix}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audience)}/members/${hash}`;
    const headers = { Authorization: `Basic ${Buffer.from(`bayzicks:${apiKey}`).toString("base64")}`, "Content-Type": "application/json" };
    const signal = AbortSignal.timeout(18000);
    const resource = leadMagnets[data.resourceId as LeadMagnetId];

    // Check status and tags first: never silently resubscribe an opted-out contact,
    // and do not claim that an already-active tag will trigger a new delivery email.
    const currentResponse = await fetch(`${url}?fields=status,tags`, { headers, signal, cache: "no-store" });
    let current: Member | null = null;
    if (currentResponse.ok) current = await currentResponse.json() as Member;
    else if (currentResponse.status !== 404) throw new Error("Mailchimp member lookup failed");
    if (current?.status && !["subscribed", "pending"].includes(current.status)) throw new RequestError(409, "This address previously opted out or can’t be subscribed here. Please use another email address, or contact Bayzicks for help.");
    const alreadyRequested = current?.tags?.some((tag) => tag.name === resource.tag) === true;
    const doubleOptIn = process.env.MAILCHIMP_DOUBLE_OPT_IN !== "false";
    const memberResponse = await fetch(url, { method: "PUT", headers, signal, cache: "no-store", body: JSON.stringify({ email_address: email, status_if_new: doubleOptIn ? "pending" : "subscribed" }) });
    if (!memberResponse.ok) {
      if (memberResponse.status === 400) throw new RequestError(422, "Mailchimp couldn’t accept this email address. Check it for typos, or try another address.");
      throw new Error("Mailchimp member update failed");
    }
    const member = await memberResponse.json() as Member;
    const tagResponse = await fetch(`${url}/tags`, { method: "POST", headers, signal, cache: "no-store", body: JSON.stringify({ tags: [resource.tag, "bayzicks-website", `source-${data.source}`, "bayzicks-email-consent-v1"].map((name) => ({ name, status: "active" })) }) });
    if (!tagResponse.ok) throw new Error("Mailchimp resource tagging failed");
    if (member.status === "pending") return apiResponse({ status: "pending", message: "Check your inbox to confirm your email address. Once you’ve confirmed, your guide will follow. Have a look in spam or promotions if you don’t see it." });
    if (alreadyRequested) return apiResponse({ status: "existing", message: "You’re already signed up for this guide. Look for the download link in your previous Bayzicks emails. If it’s missing, get in touch and we’ll help." });
    if (member.status !== "subscribed") throw new RequestError(422, "We couldn’t confirm your subscription. Please contact Bayzicks for help.");
    return apiResponse({ status: "subscribed", message: "Check your inbox. Your guide is on the way. If you don’t see it, have a look in your spam or promotions folder." });
  } catch (error) {
    return safeErrorResponse(error, "We couldn’t finish your guide request. Please try again in a moment.");
  }
}
