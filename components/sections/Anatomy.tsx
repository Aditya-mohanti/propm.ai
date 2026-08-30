"use client";

import { useState } from "react";

const STAGES = [
  {
    n: "01", label: "Brief",
    head: "Start with half a sentence.",
    body: "The agent doesn't need a full spec to start — it needs a direction. One sentence about the problem you're solving is enough to open a run.",
    chips: ["half-formed is fine", "no template required"],
  },
  {
    n: "02", label: "Context load",
    head: "Your docs, not a re-prompt.",
    body: "Attached context — strategy decks, roadmaps, past PRDs — is read once and held for the run. You stop re-explaining and the agent stops guessing.",
    chips: ["Notion", "PDF", "XLS", "past specs"],
  },
  {
    n: "03", label: "Draft",
    head: "Onto a canvas, not into a chat.",
    body: "The output lands in a structured canvas: a doc with sections, a sheet with formulas, a dashboard with the query behind it. Not a wall of chat text.",
    chips: ["Doc", "Sheet", "Prototype", "Dashboard"],
  },
  {
    n: "04", label: "Check",
    head: "Assumptions flagged, numbers sourced.",
    body: "The agent annotates what it assumed and cites where each number came from, with a confidence level. Nothing is quietly made up.",
    chips: ["source citations", "assumption flags", "confidence levels"],
  },
  {
    n: "05", label: "Review",
    head: "Every run is a version.",
    body: "The canvas keeps a history of every run. You can see what changed, roll back to v1, or branch from any version — the same as a doc with track changes.",
    chips: ["version history", "rollback", "diff view"],
  },
  {
    n: "06", label: "Ship",
    head: "Leaves as a file your team uses.",
    body: "Docs export as Notion pages or Markdown. Sheets leave as XLSX. Prototypes export as HTML. Dashboards leave as a saved query set. No special viewer required.",
    chips: ["Notion", "XLSX", "HTML", "query export"],
  },
];

export default function Anatomy() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  return (
    <div id="anatomy" style={{ background: "var(--card)", borderRadius: 12, padding: 40 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginBottom: 8 }}>anatomy of a run · 6 stages</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>
            Everything between your idea and something you can ship.
          </h2>
          <p style={{ fontSize: 16, lineHeight: "26px", color: "var(--fg2)", marginTop: 10, maxWidth: "62ch", textWrap: "pretty" as const }}>
            One credit runs all six stages. Pick a stage to see what the agent actually does there.
          </p>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", flexShrink: 0 }}>click a stage</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        {/* Stage list */}
        <div style={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
          {STAGES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => setActive(i)}
                style={{
                  display: "grid", gridTemplateColumns: "32px 1fr auto", gap: 12,
                  alignItems: "center", padding: "10px 12px", borderRadius: 6,
                  border: "none", textAlign: "left", cursor: "pointer",
                  background: isActive ? "var(--card)" : "transparent",
                  boxShadow: isActive ? "var(--shadow-sm)" : "none",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  color: isActive ? "var(--brand-800)" : "var(--fg3)",
                }}>{s.n}</span>
                <span style={{
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--fg1)" : "var(--fg2)",
                }}>{s.label}</span>
                <span style={{ fontSize: 13, color: "var(--brand-800)" }}>{isActive ? "→" : ""}</span>
              </button>
            );
          })}
        </div>

        {/* Stage detail */}
        <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--brand-800)" }}>stage {stage.n}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginLeft: "auto" }}>1 credit covers all six</span>
          </div>
          <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>{stage.head}</span>
            <p style={{ fontSize: 16, lineHeight: "26px", color: "var(--fg2)", maxWidth: "60ch", textWrap: "pretty" as const, margin: 0 }}>{stage.body}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--border)" }}>
              {stage.chips.map(c => (
                <span key={c} style={{
                  display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px",
                  borderRadius: 6, background: "var(--brand-tint-bg)", border: "1px solid var(--brand-tint-border)",
                  color: "var(--brand-800)", fontSize: 12, fontWeight: 500,
                }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
