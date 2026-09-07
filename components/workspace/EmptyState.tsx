"use client";

import type { ReactNode } from "react";
import Link from "next/link";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "ghost";
}

interface Props {
  /** Line art sits above the copy. Keep it to a 44px box. */
  icon: ReactNode;
  title: string;
  /** One or two sentences: what is missing, and why it is worth filling. */
  body: string;
  actions?: EmptyStateAction[];
  /** Optional third tier — a hint, a shortcut, or what unblocks this screen. */
  footnote?: ReactNode;
  /** Compact variant for empty states nested inside a panel. */
  size?: "default" | "compact";
}

export default function EmptyState({
  icon,
  title,
  body,
  actions = [],
  footnote,
  size = "default",
}: Props) {
  const compact = size === "compact";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 4,
        padding: compact ? "36px 24px" : "72px 32px",
        border: "1px dashed var(--input)",
        borderRadius: "var(--radius-xl)",
        background: "var(--muted)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-lg)",
          background: "var(--brand-tint-bg)",
          border: "1px solid var(--brand-tint-border)",
          color: "var(--brand-700)",
          marginBottom: 12,
        }}
      >
        {icon}
      </span>

      <h3
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontSize: compact ? 17 : 20,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--fg1)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "6px 0 0",
          maxWidth: 44 * 8,
          fontSize: 13,
          lineHeight: 1.65,
          color: "var(--fg2)",
          textWrap: "pretty",
        }}
      >
        {body}
      </p>

      {actions.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginTop: 18,
          }}
        >
          {actions.map((a) => {
            const cls = a.variant === "ghost" ? "btn-ghost" : "btn-primary";
            const style = { height: 36, padding: "0 16px" } as const;
            return a.href ? (
              <Link key={a.label} href={a.href} className={cls} style={style}>
                {a.label}
              </Link>
            ) : (
              <button
                key={a.label}
                type="button"
                onClick={a.onClick}
                className={cls}
                style={style}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      )}

      {footnote && (
        <div
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
            width: "100%",
            maxWidth: 420,
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--fg3)",
          }}
        >
          {footnote}
        </div>
      )}
    </div>
  );
}
