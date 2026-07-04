import Link from "next/link";
import type { ReactNode } from "react";

import { LogoutButton } from "@/components/logout-button";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="space-y-1">
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.24em]">
              11s
            </Link>
            <p className="text-sm text-muted-foreground">
              Relationship-first prep and follow-through for recurring 1:1s.
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
        {children}
      </main>
    </div>
  );
}
