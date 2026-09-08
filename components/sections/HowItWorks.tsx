const STEPS = [
  { n: "01", title: "Pick a base",            body: "PRD, GTM, Market Research, SQL, Design — or an empty agent."              },
  { n: "02", title: "Give it your context",   body: "Strategy docs, roadmaps, past PRDs. It stops guessing at your product."   },
  { n: "03", title: "Write its instructions", body: "How it should think, what it must never skip, which sources it may use."   },
  { n: "04", title: "Put it on a canvas",     body: "Doc, sheet, prototype or dashboard — output you can ship, not a transcript." },
];

export default function HowItWorks() {
  return (
    <div id="how" className="split split-wide" style={{ background: "var(--card)", borderRadius: 12 }}>
      {/* Left: agent creator panel */}
      <div className="split-pane-first" style={{ padding: "var(--sec-y) var(--sec-x)" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>New agent</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginLeft: "auto" }}>draft</span>
          </div>
          <div className="agent-panel">
            {/* Sidebar */}
            <div className="agent-panel-aside" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 2, background: "var(--muted)" }}>
              <span style={{ fontSize: 12, color: "var(--fg2)", padding: "0 8px 8px" }}>Base</span>
              <span style={{ height: 32, display: "flex", alignItems: "center", padding: "0 8px", borderRadius: 4, background: "var(--card)", border: "1px solid var(--brand-tint-strong)", color: "var(--brand-900)", fontSize: 13, fontWeight: 500 }}>PRD Writer</span>
              {["GTM Planner", "Market Research", "SQL Analyst", "Design"].map(n => (
                <span key={n} style={{ height: 32, display: "flex", alignItems: "center", padding: "0 8px", borderRadius: 4, fontSize: 13, color: "var(--fg2)" }}>{n}</span>
              ))}
              <span style={{ height: 32, display: "flex", alignItems: "center", padding: "0 8px", marginTop: 6, borderTop: "1px solid var(--border)", fontSize: 13, color: "var(--brand-800)", fontWeight: 500 }}>+ From scratch</span>
            </div>

            {/* Form */}
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, color: "var(--fg2)" }}>Name</label>
                <span style={{ height: 32, display: "flex", alignItems: "center", padding: "0 10px", border: "1px solid var(--input)", borderRadius: 6, fontSize: 13 }}>Rita — writes our PRDs</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 12, color: "var(--fg2)" }}>Instructions</label>
                <span style={{ padding: "8px 10px", border: "1px solid var(--input)", borderRadius: 6, fontSize: 13, lineHeight: "20px" }}>Always open with the customer problem. Use our template. Flag anything you had to assume.</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, color: "var(--fg2)" }}>Context</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, background: "rgba(220,38,38,.05)", border: "1px solid rgba(220,38,38,.1)", color: "var(--red-800)", fontSize: 12, fontWeight: 500 }}>PDF strategy-2026</span>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, background: "rgba(22,163,74,.05)", border: "1px solid rgba(22,163,74,.1)", color: "var(--green-800)", fontSize: 12, fontWeight: 500 }}>XLS roadmap</span>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--fg2)", fontSize: 12 }}>+ add</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, color: "var(--fg2)" }}>Canvas</label>
                <div style={{ display: "flex", gap: 4, padding: 2, borderRadius: 6, background: "var(--muted)", border: "1px solid var(--border)" }}>
                  {["Doc", "Sheet", "Prototype", "Dashboard"].map((c, i) => (
                    <span key={c} style={{
                      flex: 1, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 4, fontSize: 13,
                      ...(i === 0 ? { background: "var(--card)", boxShadow: "var(--shadow-sm)", fontWeight: 500 } : { color: "var(--fg2)" }),
                    }}>{c}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                <span className="btn-primary" style={{ height: 32, padding: "0 14px" }}>Add to my team</span>
                <span className="btn-ghost" style={{ height: 32, padding: "0 14px" }}>Test run</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginTop: 12 }}>the actual create panel — not a marketing render</div>
      </div>

      {/* Right: steps */}
      <div className="split-pane-last" style={{ padding: "var(--sec-y) var(--sec-x)" }}>
        <h2 className="h2" style={{ maxWidth: "22ch" }}>
          Create and customize your own agents.
        </h2>
        <p className="body-lg" style={{ color: "var(--fg2)", marginTop: 12, maxWidth: "44ch", textWrap: "pretty" as const }}>
          Start from a template or from nothing. Four steps, and it stays yours — instructions, context, canvas.
        </p>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{
              display: "grid", gridTemplateColumns: "32px 1fr", gap: 16,
              padding: "18px 0", borderTop: "1px solid var(--border)",
              ...(i === STEPS.length - 1 ? { borderBottom: "1px solid var(--border)" } : {}),
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--brand-800)", paddingTop: 4 }}>{s.n}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{s.title}</div>
                <div style={{ fontSize: 13, lineHeight: "20px", color: "var(--fg2)", marginTop: 4 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
        <a href="#playground" className="btn-ghost" style={{ marginTop: 28 }}>
          Open the playground →
        </a>
      </div>
    </div>
  );
}
