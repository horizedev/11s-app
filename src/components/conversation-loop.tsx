"use client";

import { useLocale } from "@/lib/i18n";

const NODES = [
  { cx: 105, cy: 62, tint: "var(--accent-soft)" },
  { cx: 255, cy: 62, tint: "var(--secondary-soft)" },
  { cx: 255, cy: 238, tint: "var(--success-soft)" },
  { cx: 105, cy: 238, tint: "color-mix(in srgb, #4f78a0 18%, var(--surface))" },
] as const;

// Edges run from rim to rim (r=52) so arrowheads never overlap the circles.
// Arrow styling uses currentColor + inline styles because Safari ignores
// var() in SVG presentation attributes and does not inherit custom
// properties into <marker> content.
const EDGES = [
  "M157 62 H203",
  "M255 114 V186",
  "M203 238 H157",
  "M105 186 V114",
] as const;

export function ConversationLoop({ className }: { className?: string }) {
  const { locale, t } = useLocale();
  const isZh = locale === "zh-TW";

  return (
    <figure
      className={className}
      aria-label={isZh ? "對話循環示意" : "Conversation loop illustration"}
    >
      <div className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-[#fffaf7] via-white to-[#f3f0fa] p-5 shadow-[0_18px_50px_rgb(var(--shadow-color)/0.08)] dark:from-accent-soft/50 dark:via-surface-raised dark:to-secondary-soft/50 sm:p-7">
        <div className="pointer-events-none absolute -left-10 -top-12 size-40 rounded-full bg-[#efe4dd]/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-8 size-44 rounded-full bg-[#e4dff0]/80 blur-3xl" />

        <p className="relative mb-5 text-center text-sm font-semibold tracking-[-0.02em] text-foreground sm:text-base">
          {isZh
            ? "記下、準備、對話、記得——然後再開始。"
            : "Capture, prepare, meet, remember—then start again."}
        </p>

        <svg
          viewBox="0 0 360 300"
          className="relative mx-auto h-auto w-full max-w-md text-muted-subtle"
          role="img"
        >
          <defs>
            <marker
              id="loop-arrow"
              markerWidth="7"
              markerHeight="7"
              refX="4"
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

          {NODES.map((node, index) => {
            const step = t.landing.steps[index];
            return (
              <g key={node.cx}>
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="52"
                  style={{
                    fill: node.tint,
                    stroke: "var(--surface-raised)",
                    strokeWidth: 4,
                  }}
                />
                <text
                  x={node.cx}
                  y={node.cy - 12}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  style={{ fill: "var(--foreground)" }}
                >
                  {index + 1}. {step.step}
                </text>
                <text
                  x={node.cx}
                  y={node.cy + 10}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  style={{ fill: "var(--foreground)" }}
                >
                  {step.title}
                </text>
                <text
                  x={node.cx}
                  y={node.cy + 30}
                  textAnchor="middle"
                  fontSize="10"
                  style={{ fill: "var(--muted)" }}
                >
                  {step.hint}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
