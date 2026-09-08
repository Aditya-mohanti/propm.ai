export default function WaysToStart() {
  return (
    <div className="section">
      <div style={{ maxWidth: "60ch", marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginBottom: 8 }}>three ways to start</div>
        <h2 className="h2">
          Pick the depth that fits how you work.
        </h2>
      </div>

      <div className="grid-3">
        {/* 01 */}
        <div style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>01 · solo</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Use a template agent</span>
          <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--fg2)", flex: 1, margin: 0 }}>Take PRD Writer or Market Research as-is, drop in your context, run. The fastest way to see whether the output is good enough for your bar.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--fg2)", fontSize: 12 }}>5 templates</span>
            <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--fg2)", fontSize: 12 }}>3 free credits</span>
          </div>
          <a href="#templates" style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>Browse templates →</a>
        </div>

        {/* 02 — recommended */}
        <div style={{ border: "1px solid var(--brand-tint-strong)", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 12, background: "var(--brand-50)", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--brand-800)", marginRight: "auto" }}>02 · most people</span>
            <span style={{ display: "inline-flex", alignItems: "center", height: 20, padding: "0 6px", borderRadius: 6, background: "var(--card)", border: "1px solid var(--brand-tint-strong)", color: "var(--brand-800)", fontSize: 12, fontWeight: 500 }}>Recommended</span>
          </div>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--brand-900)" }}>Customize your own</span>
          <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--brand-900)", flex: 1, margin: 0 }}>Start from a template, then rewrite its instructions in your house voice and attach your Notion, roadmap and past specs. It stops sounding generic on the second run.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, background: "var(--card)", border: "1px solid var(--brand-tint-strong)", color: "var(--brand-800)", fontSize: 12, fontWeight: 500 }}>Your instructions</span>
            <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, background: "var(--card)", border: "1px solid var(--brand-tint-strong)", color: "var(--brand-800)", fontSize: 12, fontWeight: 500 }}>Shared context</span>
          </div>
          <a href="#how" style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>See the create panel →</a>
        </div>

        {/* 03 */}
        <div style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>03 · from nothing</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" }}>Build a specialist</span>
          <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--fg2)", flex: 1, margin: 0 }}>An empty agent, your rules, any canvas. For the job nobody wrote a template for — pricing memos, incident reviews, board updates.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--fg2)", fontSize: 12 }}>Blank agent</span>
            <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--fg2)", fontSize: 12 }}>Any canvas</span>
          </div>
          <a href="#playground" style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>Try it in the playground →</a>
        </div>
      </div>
    </div>
  );
}
