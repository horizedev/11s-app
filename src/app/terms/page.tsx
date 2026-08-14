import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — 11s / 服務條款",
  description: "The terms that govern your use of 11s. 使用 11s 的服務條款。",
};

export default function TermsPage() {
  return <LegalPage doc="terms" />;
}
