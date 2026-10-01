"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Info, LoaderCircle } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { collaborationCategories, contactTopics } from "@/lib/content";
import { isValidEmail, type FormResponse } from "@/lib/validation";
import { Button } from "./ui";

function InquiryForm({ kind, deliveryReady }: { kind: "contact" | "collaborate"; deliveryReady: boolean }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const submissionId = useRef("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<FormResponse | null>(null);
  const collaboration = kind === "collaborate";
  const categories = collaboration ? collaborationCategories : contactTopics;

  function focusField(field: string) {
    const element = formRef.current?.elements.namedItem(field);
    if (element instanceof HTMLElement) element.focus();
  }
  function fieldAttributes(name: string) {
    return { "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined };
  }
  function fieldError(name: string) {
    return errors[name] ? <p className="field-error" id={`${id}-${name}-error`}>{errors[name]}</p> : null;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = Object.fromEntries(data.entries()) as Record<string, string>;
    const nextErrors: Record<string, string> = {};
    if (!fields.name || fields.name.trim().length < 2 || fields.name.trim().length > 80) nextErrors.name = "Enter your name (2–80 characters).";
    if (!isValidEmail(fields.email)) nextErrors.email = "Enter a valid email address.";
    if (!categories.some((category) => category === fields.category)) nextErrors.category = "Choose the option that best describes your enquiry.";
    if (!fields.message || fields.message.trim().length < 20 || fields.message.trim().length > 5000) nextErrors.message = "Please write a message between 20 and 5,000 characters.";
    setErrors(nextErrors);
    setResponse(null);
    if (Object.keys(nextErrors).length) { focusField(Object.keys(nextErrors)[0]); return; }
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    setLoading(true);
    try {
      const result = await fetch(`/api/${kind}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, submissionId: submissionId.current }), signal: AbortSignal.timeout(20000) });
      const body: FormResponse = await result.json();
      if (!body || typeof body.message !== "string") throw new Error("Unexpected response");
      if (!result.ok) {
        if (body.errors) { setErrors(body.errors); focusField(Object.keys(body.errors)[0]); }
        setResponse({ status: "error", message: body.message });
      } else if (body.status === "sent" || body.status === "preview") {
        setResponse(body);
        if (body.status === "sent") { form.reset(); submissionId.current = ""; }
      } else throw new Error("Unexpected status");
    } catch { setResponse({ status: "error", message: "We couldn’t send your message. Check your connection and try again in a moment." }); }
    finally { setLoading(false); }
  }

  const errorResponse = response?.status === "error";
  const previewResponse = response?.status === "preview";
  return <form ref={formRef} className="inquiry-form" onSubmit={submit} noValidate aria-busy={loading} onChange={(event) => { const target: EventTarget = event.target; if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return; const name = target.name; setErrors((current) => { const next = { ...current }; delete next[name]; return next; }); setResponse(null); submissionId.current = ""; }}>
    <h2>{collaboration ? "Tell us about your idea." : "Send a message."}</h2>
    {!deliveryReady && <p className="delivery-note"><Info size={14} aria-hidden="true" /><span>Preview mode. This form validates your enquiry, but messages aren’t sent or saved until email delivery is connected.</span></p>}
    {Object.keys(errors).length > 0 && <p className="error-summary" role="alert">Please check the highlighted fields before sending.</p>}
    <fieldset disabled={loading} className="m-0 border-0 p-0">
      <div className="form-grid"><div className="form-field"><label htmlFor={`${id}-name`} className="field-label">Your name</label><input id={`${id}-name`} name="name" autoComplete="name" className="field-input" maxLength={80} required {...fieldAttributes("name")} />{fieldError("name")}</div><div className="form-field"><label htmlFor={`${id}-email`} className="field-label">Email address</label><input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} className="field-input" maxLength={254} required {...fieldAttributes("email")} />{fieldError("email")}</div></div>
      {collaboration && <div className="form-field"><label htmlFor={`${id}-organization`} className="field-label">Brand or organisation <span className="field-optional">(optional)</span></label><input id={`${id}-organization`} name="organization" autoComplete="organization" className="field-input" maxLength={120} {...fieldAttributes("organization")} />{fieldError("organization")}</div>}
      <div className="form-field"><label htmlFor={`${id}-category`} className="field-label">{collaboration ? "What kind of collaboration?" : "What’s your message about?"}</label><select id={`${id}-category`} name="category" className="field-select" defaultValue="" required {...fieldAttributes("category")}><option value="" disabled>Choose an option</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>{fieldError("category")}</div>
      <div className="form-field"><label htmlFor={`${id}-message`} className="field-label">Your message</label><textarea id={`${id}-message`} name="message" className="field-textarea" rows={6} minLength={20} maxLength={5000} placeholder={collaboration ? "Share the idea, who it’s for and how you see us working together." : "Tell us a little about what you’d like help with."} required {...fieldAttributes("message")} />{fieldError("message")}</div>
      <div className="honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>Leave this field empty<input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></label></div>
    </fieldset>
    <p className="privacy-line">These details are used to respond to your enquiry, not to subscribe you to a newsletter. Read our <Link href="/privacy">Privacy Policy</Link>.</p>
    <Button type="submit" disabled={loading}>{loading ? <><LoaderCircle size={16} aria-hidden="true" className="spinner" />Sending…</> : <>{collaboration ? "Send collaboration enquiry" : "Send message"}<ArrowRight size={17} aria-hidden="true" /></>}</Button>
    {response && <div className={`form-status ${errorResponse ? "form-status--error" : previewResponse ? "form-status--preview" : ""}`} role={errorResponse ? "alert" : "status"}>{errorResponse ? <CircleAlert size={16} aria-hidden="true" /> : previewResponse ? <Info size={16} aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}<p>{response.message}</p></div>}
  </form>;
}

export function ContactForm({ deliveryReady = false }: { deliveryReady?: boolean }) { return <InquiryForm kind="contact" deliveryReady={deliveryReady} />; }
export function CollaborationForm({ deliveryReady = false }: { deliveryReady?: boolean }) { return <InquiryForm kind="collaborate" deliveryReady={deliveryReady} />; }
