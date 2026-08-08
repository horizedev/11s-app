import type { Metadata } from "next";

import { OneOnOneApp } from "@/components/one-on-one-app";

export const metadata: Metadata = {
  title: "Workspace — Between / 工作區",
  description: "Prepare for your next conversation. 為下一次對話做好準備。",
}

export default function WorkspacePage() {
  return <OneOnOneApp />;
}
