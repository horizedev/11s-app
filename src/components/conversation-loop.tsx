"use client";

import { Brain, MessageSquareText, NotebookPen, RotateCcw } from "lucide-react";

import { useLocale } from "@/lib/i18n";

// Icons mirror the step list on the left side of the "how it works" section.
const NODES = [
  {
    en: "Capture",
    zh: "記下",
    cx: 86,
    cy: 78,
    labelAbove: true,
    tint: "var(--accent-soft)",
    iconColor: "var(--accent)",
    Icon: NotebookPen,
  },
  {
    en: "Prepare",
    zh: "準備",
    cx: 234,
    cy: 78,
    labelAbove: true,
    tint: "var(--secondary-soft)",
    iconColor: "var(--secondary)",
    Icon: Brain,
  },
  {
    en: "Meet",
    zh: "對話",
    cx: 234,
    cy: 190,
    labelAbove: false,
    tint: "var(--success-soft)",
    iconColor: "var(--success)",
    Icon: MessageSquareText,
  },
  {
    en: "Continue",
    zh: "延續",
    cx: 86,
    cy: 190,
    labelAbove: false,
    tint: "color-mix(in srgb, #4f78a0 18%, var(--surface))",
    iconColor: "#4f78a0",
    Icon: RotateCcw,
  },
] as const;

const EDGES = [
  "M120 78 H192",
  "M234 112 V148",
  "M200 190 H128",
  "M86 156 V120",
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
                ? "記下、準備、對話、延續——然後再開始。"
                : "Capture, prepare, meet, continue—then start again."}
            </p>
          </div>
          <span className="hidden rounded-full border border-border bg-surface/80 px-3 py-1 text-[10px] font-medium text-muted sm:inline-flex">
            {t.common.brand}
          </span>
        </div>

        {/* Arrows use currentColor and inline styles: Safari ignores var() in
            SVG presentation attributes and does not inherit custom properties
            into <marker> content, which previously left the arrowheads broken. */}
        <svg
          viewBox="0 0 320 258"
          className="relative mx-auto h-auto w-full max-w-md text-muted-subtle"
          role="img"
        >
          <defs>
            <marker
              id="loop-arrow"
              markerUnits="userSpaceOnUse"
              markerWidth="7"
              markerHeight="7"
              refX="7"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" />
            </marker>
          </defs>

          {EDGES.map((d) => (
            <path
              key={d}
              d={d}
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="5 6"
              strokeLinecap="round"
              markerEnd="url(#loop-arrow)"
              fill="none"
              className="text-border-strong"
            />
          ))}

          {NODES.map((node) => {
            const labelY = node.labelAbove ? node.cy - 48 : node.cy + 52;
            return (
              <g key={node.en}>
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="34"
                  style={{
                    fill: node.tint,
                    stroke: "var(--surface-raised)",
                    strokeWidth: 4,
                  }}
                />
                {/* Lucide icons are 24x24 with stroke="currentColor". */}
                <g
                  transform={`translate(${node.cx - 9}, ${node.cy - 9}) scale(0.75)`}
                  style={{ color: node.iconColor }}
                >
                  <node.Icon
                    width={24}
                    height={24}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </g>
                <text
                  x={node.cx}
                  y={labelY}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  style={{ fill: "var(--foreground)" }}
                >
                  {isZh ? node.zh : node.en}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
