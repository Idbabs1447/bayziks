import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";
import type { FormResponse } from "@/lib/validation";

export class RequestError extends Error {
  constructor(public statusCode: number, message: string, public errors?: Record<string, string>, public retryAfter?: number) { super(message); }
}

export function apiResponse(body: FormResponse, status = 200, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
}

export function safeErrorResponse(error: unknown, fallback: string) {
  if (error instanceof RequestError) return apiResponse({ status: "error", message: error.message, ...(error.errors ? { errors: error.errors } : {}) }, error.statusCode, error.retryAfter ? { "Retry-After": String(error.retryAfter) } : {});
  // Never log credentials, provider responses, email addresses or message contents.
  console.error("Bayzicks form request failed; provider or network unavailable.");
  return apiResponse({ status: "error", message: fallback }, 502);
}

type RateEntry = { count: number; resetAt: number };
const globalStore = globalThis as unknown as { bayzicksRateStore?: Map<string, RateEntry>; bayzicksRateSalt?: string };
const rates = globalStore.bayzicksRateStore ||= new Map<string, RateEntry>();
const salt = globalStore.bayzicksRateSalt ||= randomUUID();

export function guardRequest(request: Request, scope: string, limit = 8) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new RequestError(415, "Please submit this form through the Bayzicks website.");
  const origin = request.headers.get("origin");
  if (origin) {
    let host: string;
    try { host = new URL(origin).host; } catch { throw new RequestError(403, "This request isn’t allowed. Please use the form on our website."); }
    const allowedHosts = [new URL(request.url).host, new URL(getSiteUrl()).host, request.headers.get("host"), request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()].filter(Boolean);
    if (!allowedHosts.includes(host)) throw new RequestError(403, "This request isn’t allowed. Please use the form on our website.");
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") throw new RequestError(403, "Please use the form on the Bayzicks website.");
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16384) throw new RequestError(413, "That submission is too long. Please shorten your message.");
  // In-memory protection is intentionally bounded. Use a trusted proxy/WAF or shared
  // rate limiter for horizontally scaled deployments; see README.
  const ip = (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "local").split(",")[0].trim();
  const key = `${scope}:${createHash("sha256").update(`${salt}:${ip}`).digest("hex")}`;
  const now = Date.now();
  if (rates.size >= 10000) {
    for (const [entryKey, value] of rates) if (value.resetAt <= now) rates.delete(entryKey);
    if (rates.size >= 10000) { const first = rates.keys().next().value; if (first) rates.delete(first); }
  }
  const entry = rates.get(key);
  if (entry && entry.resetAt > now) {
    if (entry.count >= limit) throw new RequestError(429, "You’ve made a few requests recently. Please wait a little before trying again.", undefined, Math.ceil((entry.resetAt - now) / 1000));
    entry.count += 1;
  } else rates.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  if (!request.body) throw new RequestError(400, "Please complete the form before submitting.");
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) { await reader.cancel(); throw new RequestError(413, "That submission is too long. Please shorten your message."); }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally { reader.releaseLock(); }
  let data: unknown;
  try { data = JSON.parse(text); } catch { throw new RequestError(400, "We couldn’t read that submission. Please try the form again."); }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new RequestError(400, "Please complete the form before submitting.");
  const object = data as Record<string, unknown>;
  if (object.website !== undefined && (typeof object.website !== "string" || object.website.trim())) throw new RequestError(400, "This submission couldn’t be accepted. Please try again.");
  return object;
}
