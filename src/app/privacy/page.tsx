import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — 11s / 隱私權政策",
  description:
    "How 11s collects, uses, and protects your information. 11s 如何蒐集、使用與保護你的資訊。",
};

export default function PrivacyPage() {
  return <LegalPage doc="privacy" />;
}
