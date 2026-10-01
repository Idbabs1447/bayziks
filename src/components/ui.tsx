import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Container({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <div className={`container ${className}`} id={id}>{children}</div>;
}

export function Section({ children, className = "", id, labelledBy }: { children: ReactNode; className?: string; id?: string; labelledBy?: string }) {
  return <section id={id} aria-labelledby={labelledBy} className={`section ${className}`}><Container>{children}</Container></section>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "accent" | "outline" | "light";
};

export function Button({ children, href, variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `button button--${variant} ${className}`;
  if (href) return <Link href={href} className={classes} aria-label={props["aria-label"]}>{children}</Link>;
  return <button type="button" className={classes} {...props}>{children}</button>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}><span aria-hidden="true" />{children}</p>;
}

export function Wordmark({ light = false, tagline = false }: { light?: boolean; tagline?: boolean }) {
  return <Link href="/" className={`wordmark ${light ? "wordmark--light" : ""}`} aria-label="Bayzicks home"><span>bayzicks<span className="wordmark-star" aria-hidden="true">✳</span></span>{tagline && <small>THE DIGITAL WORLD, MADE SIMPLE.</small>}</Link>;
}
