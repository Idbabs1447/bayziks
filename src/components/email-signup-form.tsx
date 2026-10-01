"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Info, LoaderCircle } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import type { LeadMagnetId, SignupSource } from "@/lib/content";
import { isValidEmail, type FormResponse } from "@/lib/validation";
import { Button } from "./ui";

export function EmailSignupForm({ resourceId = "digital-careers-field-guide", source = "homepage", deliveryReady = false, dark = false }: { resourceId?: LeadMagnetId; source?: SignupSource; deliveryReady?: boolean; dark?: boolean }) {
  const id = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<FormResponse | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setResponse(null);
    if (!isValidEmail(email)) { setError("Enter a valid email address, such as you@example.com."); emailRef.current?.focus(); return; }
    setError("");
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const result = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), resourceId, source, consent: true, website: data.get("website") || "" }), signal: AbortSignal.timeout(25000) });
      const body: FormResponse = await result.json();
      if (!body || typeof body.message !== "string") throw new Error("Unexpected response");
      if (!result.ok) setResponse({ status: "error", message: body.message });
      else if (["preview", "subscribed", "pending", "existing"].includes(body.status)) setResponse(body);
      else throw new Error("Unexpected status");
    } catch {
      setResponse({ status: "error", message: "We couldn’t complete your request. Check your connection and try again in a moment." });
    } finally { setLoading(false); }
  }

  const isError = response?.status === "error";
  const isPreview = response?.status === "preview";
  return <form className="email-signup" onSubmit={submit} noValidate aria-busy={loading}>
    {!deliveryReady && <p className="delivery-note"><Info size={13} aria-hidden="true" />Preview mode: email delivery is not connected yet.</p>}
    <label className="field-label" htmlFor={`${id}-email`}>Your email address</label>
    <div className="signup-row"><input ref={emailRef} id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" maxLength={254} required className="field-input" value={email} disabled={loading} onChange={(event) => { setEmail(event.target.value); setError(""); setResponse(null); }} aria-invalid={Boolean(error)} aria-describedby={`${id}-consent${error ? ` ${id}-error` : ""}`} /><Button type="submit" variant={dark ? "accent" : "primary"} disabled={loading}>{loading ? <><LoaderCircle size={16} className="spinner" aria-hidden="true" />Sending…</> : <>Send me the free guide<ArrowRight size={16} aria-hidden="true" /></>}</Button></div>
    {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
    <div className="honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>Leave this field empty<input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <p className="signup-consent" id={`${id}-consent`}>By requesting the guide, you agree to receive it plus occasional Bayzicks emails about digital careers, tools and opportunities. Unsubscribe anytime. <Link href="/privacy">Privacy Policy</Link>.</p>
    {response && <div className={`form-status ${isError ? "form-status--error" : isPreview ? "form-status--preview" : ""}`} role={isError ? "alert" : "status"}>{isError ? <CircleAlert size={16} aria-hidden="true" /> : isPreview ? <Info size={16} aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}<p>{response.message}</p></div>}
  </form>;
}
