import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { POST as subscribe } from "../src/app/api/subscribe/route";
import { handleInquiry } from "../src/lib/server/inquiries";
import type { FormResponse } from "../src/lib/validation";

type MockReply = { status: number; body?: unknown };
type RecordedCall = { url: string; method: string; body: Record<string, unknown> | null; headers: Headers };

async function main() {
  const keys = ["MAILCHIMP_API_KEY", "MAILCHIMP_SERVER_PREFIX", "MAILCHIMP_AUDIENCE_ID", "MAILCHIMP_MODE", "MAILCHIMP_DELIVERY_READY", "MAILCHIMP_DOUBLE_OPT_IN", "FORMS_MODE", "RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"];
  const originalEnvironment = new Map(keys.map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  let calls: RecordedCall[] = [];
  let count = 0;
  let requestNumber = 0;
  function check(value: unknown, message: string) { assert.ok(value, message); count += 1; console.log(`✓ ${message}`); }
  function provider(replies: MockReply[]) {
    calls = [];
    globalThis.fetch = async (input, init) => {
      calls.push({ url: input instanceof Request ? input.url : String(input), method: init?.method || "GET", body: typeof init?.body === "string" ? JSON.parse(init.body) as Record<string, unknown> : null, headers: new Headers(init?.headers) });
      const next = replies.shift();
      if (!next) throw new Error("Unexpected mocked provider call; real network access is disabled.");
      return new Response(next.status === 204 ? null : JSON.stringify(next.body || {}), { status: next.status, headers: { "Content-Type": "application/json" } });
    };
  }
  function request(path: string, data: Record<string, unknown>) { return new Request(`http://localhost:3000${path}`, { method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000", "X-Forwarded-For": `192.0.2.${++requestNumber}` }, body: JSON.stringify(data) }); }
  async function newsletter(data: Record<string, unknown>) { const response = await subscribe(request("/api/subscribe", data)); return { response, body: await response.json() as FormResponse }; }
  async function inquiry(kind: "contact" | "collaborate", data: Record<string, unknown>) { const response = await handleInquiry(request(`/api/${kind}`, data), kind); return { response, body: await response.json() as FormResponse }; }
  const signup = { email: " LEARNER@EXAMPLE.COM ", consent: true, resourceId: "digital-careers-field-guide", source: "instagram-guide", website: "" };
  const contact = { name: "Provider Test", email: "test@example.com", category: "General question", message: "A safe test message containing <script> as literal text, not HTML.", website: "", submissionId: "a0000000-0000-4000-8000-000000000001" };
  try {
    // These are non-secret test fixtures. Every outgoing fetch is intercepted.
    Object.assign(process.env, { MAILCHIMP_API_KEY: "test-only-not-a-real-key-us1", MAILCHIMP_SERVER_PREFIX: "us1", MAILCHIMP_AUDIENCE_ID: "testAudience001", MAILCHIMP_MODE: "live", MAILCHIMP_DELIVERY_READY: "true", MAILCHIMP_DOUBLE_OPT_IN: "true", FORMS_MODE: "live", RESEND_API_KEY: "test-only-not-a-real-key", CONTACT_FROM_EMAIL: "Bayzicks <sender@example.com>", CONTACT_TO_EMAIL: "owner@example.com" });

    provider([{ status: 404 }, { status: 200, body: { status: "pending" } }, { status: 204 }]);
    let result = await newsletter(signup);
    check(result.response.status === 200 && result.body.status === "pending", "New Mailchimp contacts use a real pending/confirmation state");
    check(calls.length === 3 && calls[1].method === "PUT" && calls[2].method === "POST", "Mailchimp performs lookup, upsert and resource tagging");
    const hash = createHash("md5").update("learner@example.com").digest("hex");
    check(calls[1].url.endsWith(`/members/${hash}`) && calls[1].body?.email_address === "learner@example.com", "Email is trimmed, normalized and hashed correctly");
    check(calls[1].body?.status_if_new === "pending" && !Object.prototype.hasOwnProperty.call(calls[1].body, "status"), "Upsert does not overwrite an existing subscription status");
    const tags = calls[2].body?.tags as { name: string; status: string }[];
    check(tags.some((tag) => tag.name === "digital-careers-field-guide" && tag.status === "active") && tags.some((tag) => tag.name === "source-instagram-guide"), "Resource and signup-source tags are applied");
    check(calls[0].headers.get("authorization")?.startsWith("Basic "), "Mailchimp credentials are sent only in the server authorization header");

    provider([{ status: 200, body: { status: "subscribed", tags: [{ name: "digital-careers-field-guide" }] } }, { status: 200, body: { status: "subscribed" } }, { status: 204 }]);
    result = await newsletter(signup);
    check(result.body.status === "existing" && !result.body.message.includes("on the way"), "An existing resource tag does not falsely promise another delivery");

    provider([{ status: 200, body: { status: "subscribed", tags: [] } }, { status: 200, body: { status: "subscribed" } }, { status: 204 }]);
    result = await newsletter(signup);
    check(result.body.status === "subscribed", "Existing subscribed contacts can request a different/new resource tag");

    provider([{ status: 200, body: { status: "unsubscribed", tags: [] } }]);
    result = await newsletter(signup);
    check(result.response.status === 409 && calls.length === 1, "Opted-out contacts are never silently resubscribed");

    provider([{ status: 500, body: { detail: "PRIVATE_UPSTREAM_RESPONSE" } }]);
    result = await newsletter(signup);
    check(result.response.status === 502 && !JSON.stringify(result.body).includes("PRIVATE_UPSTREAM") && !JSON.stringify(result.body).includes("test-only"), "Mailchimp failures are safe and cannot expose provider responses/credentials");

    provider([{ status: 404 }, { status: 200, body: { status: "pending" } }, { status: 500 }]);
    result = await newsletter(signup);
    check(result.response.status === 502 && result.body.status === "error", "A resource-tagging failure is not presented as success");

    process.env.MAILCHIMP_DELIVERY_READY = "false";
    provider([]);
    result = await newsletter(signup);
    check(result.response.status === 503 && calls.length === 0, "Live mode without a ready delivery journey fails honestly");
    process.env.MAILCHIMP_DELIVERY_READY = "true";
    process.env.MAILCHIMP_SERVER_PREFIX = "localhost:9999";
    provider([]);
    result = await newsletter(signup);
    check(result.response.status === 503 && calls.length === 0, "Invalid Mailchimp hosts cannot become arbitrary outgoing requests");
    process.env.MAILCHIMP_SERVER_PREFIX = "us1";
    process.env.MAILCHIMP_DOUBLE_OPT_IN = "false";
    provider([{ status: 404 }, { status: 200, body: { status: "subscribed" } }, { status: 204 }]);
    result = await newsletter(signup);
    check(result.body.status === "subscribed" && calls[1].body?.status_if_new === "subscribed", "Explicit single opt-in works when deliberately configured");
    process.env.MAILCHIMP_MODE = "preview";
    provider([]);
    result = await newsletter(signup);
    check(result.body.status === "preview" && calls.length === 0, "Preview mode never calls Mailchimp even when credentials exist");

    provider([{ status: 200, body: { id: "test-message-only" } }]);
    result = await inquiry("contact", contact);
    check(result.body.status === "sent" && calls.length === 1 && calls[0].url === "https://api.resend.com/emails", "Contact success requires the real provider code path to accept the request");
    check(calls[0].body?.reply_to === "test@example.com" && !Object.prototype.hasOwnProperty.call(calls[0].body, "html") && String(calls[0].body?.text).includes("<script>"), "Enquiries use safe plain-text content and the visitor reply-to address");
    check(calls[0].headers.get("idempotency-key") === `bayzicks-contact-${contact.submissionId}`, "Enquiry retries use provider idempotency keys");

    provider([{ status: 200, body: { id: "test-collaboration-only" } }]);
    result = await inquiry("collaborate", { ...contact, category: "Co-created resource", organization: "Test organisation" });
    check(result.body.status === "sent" && String(calls[0].body?.text).includes("Test organisation"), "Collaboration enquiries include the optional organisation");

    provider([{ status: 401, body: { detail: "PRIVATE_UPSTREAM_RESPONSE" } }]);
    result = await inquiry("contact", contact);
    check(result.response.status === 502 && result.body.status === "error" && !JSON.stringify(result.body).includes("PRIVATE_UPSTREAM"), "Rejected enquiries never look successfully delivered");
    process.env.FORMS_MODE = "preview";
    provider([]);
    result = await inquiry("contact", contact);
    check(result.body.status === "preview" && calls.length === 0, "Enquiry preview never contacts Resend or saves a submission");
    process.env.FORMS_MODE = "live";
    delete process.env.RESEND_API_KEY;
    provider([]);
    result = await inquiry("contact", contact);
    check(result.response.status === 503 && calls.length === 0, "Missing live enquiry configuration produces an honest unavailable state");
    console.log(`\nPassed ${count} isolated provider checks. No real network calls, subscriptions or emails occurred.`);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of originalEnvironment) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
