"use client";

import { useLocale } from "@/lib/i18n";

const NODES = [
  {
    emoji: "📝",
    en: "Capture",
    zh: "記下",
    cx: 90,
    cy: 48,
    tint: "var(--accent-soft)",
  },
  {
    emoji: "✨",
    en: "Prepare",
    zh: "準備",
    cx: 230,
    cy: 48,
    tint: "var(--secondary-soft)",
  },
  {
    emoji: "💬",
    en: "Meet",
    zh: "對話",
    cx: 230,
    cy: 168,
    tint: "var(--success-soft)",
  },
  {
    emoji: "🔁",
    en: "Remember",
    zh: "記得",
    cx: 90,
    cy: 168,
    tint: "color-mix(in srgb, #4f78a0 18%, var(--surface))",
  },
] as const;

export function ConversationLoop({ className }: { className?: string }) {
  const { locale, t } = useLocale();
  const isZh = locale === "zh-TW";

  return (
    <figure
      className={className}
      aria-label={
        isZh ? "對話循環示意" : "Conversation loop illustration"
      }
    >
      <div className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-[#fffaf7] via-white to-[#f3f0fa] p-5 shadow-[0_18px_50px_rgb(var(--shadow-color)/0.08)] dark:from-accent-soft/50 dark:via-surface-raised dark:to-secondary-soft/50 sm:p-7">
        <div className="pointer-events-none absolute -left-10 -top-12 size-40 rounded-full bg-[#efe4dd]/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-8 size-44 rounded-full bg-[#e4dff0]/80 blur-3xl" />

        <div className="relative mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
              {isZh ? "對話循環" : "Conversation loop"}
            </p>
            <p className="mt-1.5 text-sm font-semibold tracking-[-0.02em] text-foreground sm:text-base">
              {isZh
                ? "記下 → 準備 → 對話 → 記得，再開始下一輪。"
                : "Capture, prepare, meet, remember—then start again."}
            </p>
          </div>
          <span className="hidden rounded-full border border-border bg-surface/80 px-3 py-1 text-[10px] font-medium text-muted sm:inline-flex">
            {t.common.brand}
          </span>
        </div>

        <svg
          viewBox="0 0 320 220"
          className="relative mx-auto h-auto w-full max-w-md"
          role="img"
        >
          <defs>
            <marker
              id="loop-arrow"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--muted-subtle)" />
            </marker>
          </defs>

          <path
            d="M120 48 H200"
            stroke="var(--border-strong)"
            strokeWidth="2"
            strokeDasharray="5 6"
            markerEnd="url(#loop-arrow)"
            fill="none"
          />
          <path
            d="M230 78 V138"
            stroke="var(--border-strong)"
            strokeWidth="2"
            strokeDasharray="5 6"
            markerEnd="url(#loop-arrow)"
            fill="none"
          />
          <path
            d="M200 168 H120"
            stroke="var(--border-strong)"
            strokeWidth="2"
            strokeDasharray="5 6"
            markerEnd="url(#loop-arrow)"
            fill="none"
          />
          <path
            d="M90 138 V78"
            stroke="var(--border-strong)"
            strokeWidth="2"
            strokeDasharray="5 6"
            markerEnd="url(#loop-arrow)"
            fill="none"
          />

          {NODES.map((node) => (
            <g key={node.en}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r="34"
                fill={node.tint}
                stroke="var(--surface-raised)"
                strokeWidth="4"
              />
              <text
                x={node.cx}
                y={node.cy + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="22"
              >
                {node.emoji}
              </text>
              <text
                x={node.cx}
                y={node.cy + 52}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize="11"
                fontWeight="600"
              >
                {isZh ? node.zh : node.en}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </figure>
  );
}
