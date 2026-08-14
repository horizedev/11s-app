"use client";

import {
  AlignLeft,
  ArrowUpRight,
  Heart,
  HandHeart,
  MessageCircle,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

import { useLocale } from "@/lib/i18n";
import type { PrepCategory, Relationship } from "@/lib/types";
import { cn, getInitials, relationshipLabel } from "@/lib/utils";

export function Avatar({
  name,
  color,
  size = "md",
  emoji,
}: {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
  emoji?: string | null;
}) {
  const sizes = {
    sm: "size-8 text-[13px]",
    md: "size-10 text-[17px]",
    lg: "size-12 text-[22px]",
    xl: "size-16 text-[30px]",
  };
  const initialSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-lg",
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold tracking-[0.04em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]",
        sizes[size],
      )}
      style={{
        background: emoji
          ? `linear-gradient(145deg, color-mix(in srgb, ${color} 28%, #fff) 0%, color-mix(in srgb, ${color} 55%, #f5f5f4) 100%)`
          : `linear-gradient(145deg, ${color} 0%, color-mix(in srgb, ${color} 72%, #111827) 100%)`,
      }}
    >
      {emoji ? (
        <span className="relative z-10 leading-none">{emoji}</span>
      ) : (
        <>
          <span className={cn("relative z-10", initialSizes[size])}>
            {getInitials(name)}
          </span>
          <span className="absolute -right-2 -top-2 size-7 rounded-full bg-white/10" />
        </>
      )}
    </span>
  );
}

export function RelationshipPill({
  relationship,
  compact = false,
}: {
  relationship: Relationship;
  compact?: boolean;
}) {
  const { t } = useLocale();
  const styles: Record<Relationship, string> = {
    manager:
      "bg-violet-50 text-violet-700 ring-violet-600/10 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20",
    "direct-report":
      "bg-orange-50 text-orange-700 ring-orange-600/10 dark:bg-orange-400/10 dark:text-orange-300 dark:ring-orange-400/20",
    peer: "bg-teal-50 text-teal-700 ring-teal-600/10 dark:bg-teal-400/10 dark:text-teal-300 dark:ring-teal-400/20",
    mentor:
      "bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
    friend:
      "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium ring-1 ring-inset",
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        styles[relationship],
      )}
    >
      {relationshipLabel(relationship, t, compact)}
    </span>
  );
}

const categoryMeta: Record<
  PrepCategory,
  { icon: typeof RotateCcw; className: string }
> = {
  "Follow up": {
    icon: RotateCcw,
    className:
      "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20",
  },
  Growth: {
    icon: TrendingUp,
    className:
      "bg-violet-50 text-violet-700 ring-violet-600/10 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20",
  },
  Support: {
    icon: HandHeart,
    className:
      "bg-orange-50 text-orange-700 ring-orange-600/10 dark:bg-orange-400/10 dark:text-orange-300 dark:ring-orange-400/20",
  },
  Alignment: {
    icon: AlignLeft,
    className:
      "bg-teal-50 text-teal-700 ring-teal-600/10 dark:bg-teal-400/10 dark:text-teal-300 dark:ring-teal-400/20",
  },
  Personal: {
    icon: Heart,
    className:
      "bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
  },
  "Small talk": {
    icon: MessageCircle,
    className:
      "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
  },
};

export function CategoryPill({ category }: { category: PrepCategory }) {
  const { t } = useLocale();
  const meta = categoryMeta[category];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        meta.className,
      )}
    >
      <Icon aria-hidden="true" className="size-3" strokeWidth={2} />
      {t.category[category]}
    </span>
  );
}

export function TinyArrow() {
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full bg-surface-muted text-muted transition-[background-color,color] group-hover:bg-foreground group-hover:text-background">
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </span>
  );
}
