"use client";

import { LockKeyhole } from "lucide-react";

import { Hint } from "@/components/hint";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Lock marker for sensitive user-input areas: everything written here is
 * encrypted at rest (AES-256-GCM) and only visible to the owner's account.
 */
export function SecureBadge({ className }: { className?: string }) {
  const { t } = useLocale();
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center", className)}
    >
      <span className="grid size-5 place-items-center rounded-full bg-success-soft text-success">
        <LockKeyhole className="size-3" strokeWidth={2.2} />
      </span>
      <span className="sr-only">{t.common.sensitiveField}</span>
      <Hint
        label={t.common.moreInfo}
        className="[&_button]:size-5 [&_button]:text-muted-subtle"
      >
        {t.common.sensitiveHint}
      </Hint>
    </span>
  );
}
