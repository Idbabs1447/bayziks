"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/lib/content";
import { Wordmark } from "./ui";

export function MobileNavigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return <div className="mobile-navigation">
    <button ref={trigger} type="button" className="icon-button menu-trigger" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-menu" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><Menu size={24} aria-hidden="true" /></button>
    <dialog ref={dialog} id="mobile-menu" className="mobile-dialog" aria-label="Main navigation" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === dialog.current) closeMenu(); }}>
      <div className="mobile-dialog-inner">
        <div className="mobile-dialog-heading"><Wordmark /><button type="button" className="icon-button" aria-label="Close navigation" onClick={closeMenu}><X size={25} aria-hidden="true" /></button></div>
        <nav aria-label="Mobile main navigation">{navigation.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={closeMenu}>{item.label}<ArrowRight size={18} aria-hidden="true" /></Link>)}</nav>
        <Link href="/resources/digital-careers-field-guide" className="button button--primary" onClick={closeMenu}>Get the free guide<ArrowRight size={18} aria-hidden="true" /></Link>
        <p className="mobile-menu-note">The digital world, made simple.</p>
      </div>
    </dialog>
  </div>;
}
