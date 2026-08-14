import { AlertCircle, Check, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export function SaveStatus({
  isSaving,
  savedLabel,
  savingLabel,
  errorLabel,
  className,
}: {
  isSaving: boolean;
  savedLabel: string;
  savingLabel: string;
  errorLabel?: string;
  className?: string;
}) {
  return (
    <span
      role={errorLabel ? "alert" : "status"}
      aria-live="polite"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-[10px] text-muted-subtle",
        className,
      )}
    >
      {errorLabel ? (
        <AlertCircle className="size-3 text-danger" />
      ) : isSaving ? (
        <LoaderCircle className="size-3 animate-spin text-muted" />
      ) : (
        <Check className="size-3 text-success" />
      )}
      {errorLabel ?? (isSaving ? savingLabel : savedLabel)}
    </span>
  );
}
