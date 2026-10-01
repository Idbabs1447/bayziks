import { Minus, Plus } from "lucide-react";
import { faqItems } from "@/lib/content";

export function FAQ({ items = faqItems, name = "bayzicks-faq", firstOpen = false }: { items?: { question: string; answer: string }[]; name?: string; firstOpen?: boolean }) {
  return <div className="faq-list">{items.map((item, index) => <details className="faq-item" name={name} key={item.question} open={firstOpen && index === 0}>
    <summary>{item.question}<Plus className="faq-plus" strokeWidth={1.4} aria-hidden="true" /><Minus className="faq-minus" strokeWidth={1.4} aria-hidden="true" /></summary>
    <div className="faq-answer"><p>{item.answer}</p></div>
  </details>)}</div>;
}
