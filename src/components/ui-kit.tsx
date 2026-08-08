"use client";

import {
  AlignLeft,
  ArrowUpRight,
  Heart,
  HandHeart,
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
}: {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "size-8 text-[10px]",
    md: "size-10 text-xs",
    lg: "size-12 text-sm",
    xl: "size-16 text-lg",
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold tracking-[0.04em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]",
        sizes[size],
      )}
      style={{
        background: `linear-gradient(145deg, ${color} 0%, color-mix(in srgb, ${color} 72%, #111827) 100%)`,
      }}
    >
      <span className="relative z-10">{getInitials(name)}</span>
      <span className="absolute -right-2 -top-2 size-7 rounded-full bg-white/10" />
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
    manager: "bg-violet-50 text-violet-700 ring-violet-600/10",
    "direct-report": "bg-orange-50 text-orange-700 ring-orange-600/10",
    peer: "bg-teal-50 text-teal-700 ring-teal-600/10",
    mentor: "bg-rose-50 text-rose-700 ring-rose-600/10",
    friend: "bg-blue-50 text-blue-700 ring-blue-600/10",
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
    className: "bg-blue-50 text-blue-700 ring-blue-600/10",
  },
  Growth: {
    icon: TrendingUp,
    className: "bg-violet-50 text-violet-700 ring-violet-600/10",
  },
  Support: {
    icon: HandHeart,
    className: "bg-orange-50 text-orange-700 ring-orange-600/10",
  },
  Alignment: {
    icon: AlignLeft,
    className: "bg-teal-50 text-teal-700 ring-teal-600/10",
  },
  Personal: {
    icon: Heart,
    className: "bg-rose-50 text-rose-700 ring-rose-600/10",
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
      <Icon className="size-3" strokeWidth={2} />
      {t.category[category]}
    </span>
  );
}

export function TinyArrow() {
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition group-hover:bg-stone-900 group-hover:text-white">
      <ArrowUpRight className="size-3.5" />
    </span>
  );
}
