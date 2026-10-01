import { randomUUID } from "node:crypto";
import { collaborationCategories, contactTopics } from "@/lib/content";
import { inquiryConfiguration } from "@/lib/site";
import { cleanString, isValidEmail } from "@/lib/validation";
import { apiResponse, guardRequest, readJson, RequestError, safeErrorResponse } from "./request";

export async function handleInquiry(request: Request, kind: "contact" | "collaborate") {
  try {
    guardRequest(request, kind, 5);
    const data = await readJson(request);
    const name = cleanString(data.name, 80);
    const email = cleanString(data.email, 254).toLowerCase();
    const message = cleanString(data.message, 5000);
    const category = cleanString(data.category, 100);
    const organization = cleanString(data.organization, 120);
    const categories = kind === "contact" ? contactTopics : collaborationCategories;
    const errors: Record<string, string> = {};
    if (name.length < 2 || name.length > 80 || /[\r\n]/.test(name)) errors.name = "Enter your name (2–80 characters).";
    if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
    if (message.length < 20 || message.length > 5000) errors.message = "Please write a message between 20 and 5,000 characters.";
    if (!categories.some((item) => item === category)) errors.category = "Choose the option that best describes your enquiry.";
    if (organization.length > 120 || /[\r\n]/.test(organization)) errors.organization = "Keep the organisation name under 120 characters.";
    if (Object.keys(errors).length) throw new RequestError(422, "Please check the highlighted fields.", errors);
    const configuration = inquiryConfiguration();
    if (configuration.mode === "preview") return apiResponse({ status: "preview", message: "Preview only. Your message passed validation, but it hasn’t been sent or saved. Email delivery must be connected before Bayzicks can receive enquiries." });
    if (!configuration.ready) throw new RequestError(503, "Message delivery isn’t connected yet. Your message hasn’t been sent or saved. Please try again later.");
    const suppliedId = typeof data.submissionId === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(data.submissionId) ? data.submissionId : randomUUID();
    const text = [`New Bayzicks ${kind === "collaborate" ? "collaboration" : "contact"} enquiry`, "", `Name: ${name}`, `Email: ${email}`, `Category: ${category}`, ...(kind === "collaborate" && organization ? [`Organisation: ${organization}`] : []), "", message].join("\n");
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `bayzicks-${kind}-${suppliedId}` }, body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [process.env.CONTACT_TO_EMAIL], reply_to: email, subject: `${kind === "collaborate" ? "Collaboration enquiry" : "Website enquiry"}: ${category}`, text }), signal: AbortSignal.timeout(15000), cache: "no-store" });
    if (!response.ok) throw new Error("Email provider rejected the enquiry");
    return apiResponse({ status: "sent", message: "Your message has been sent. Thank you for getting in touch with Bayzicks." });
  } catch (error) {
    return safeErrorResponse(error, "Your message couldn’t be sent. Please try again in a moment.");
  }
}
