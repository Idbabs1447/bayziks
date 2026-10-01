import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function LeadLayout({ children }: { children: ReactNode }) {
  return <><Header minimal />{children}<Footer minimal /></>;
}
