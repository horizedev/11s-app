import type { Metadata } from "next";

import { FaqPage } from "@/components/faq-page";

export const metadata: Metadata = {
  title: "FAQ — 11s / 常見問題",
  description:
    "Answers to common questions about 11s plans, privacy, and AI preparation. 關於 11s 方案、隱私與 AI 準備的常見問題。",
};

export default function FaqRoute() {
  return <FaqPage />;
}
