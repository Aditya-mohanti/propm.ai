const TOOLS = [
  { n: "01", name: "Doc tool",     sub: "PRDs and specs",          time: "~2h / spec"        },
  { n: "02", name: "Spreadsheet",  sub: "Sizing and GTM plans",    time: "~3h / model"       },
  { n: "03", name: "BI / SQL",     sub: "Pulling the numbers",     time: "+1 analyst ask"    },
  { n: "04", name: "Research doc", sub: "Competitor teardowns",    time: "~half a day"       },
  { n: "05", name: "Prototyper",   sub: "Showing, not telling",    time: "or a favour owed"  },
  { n: "06", name: "A chat window",sub: "Re-explaining context",   time: "every session"     },
];

export default function SixTools() {
  return (
    <div className="section">
      <div className="section-head" style={{ alignItems: "baseline", marginBottom: 20 }}>
        <h3 className="h3">Six tools, one decision</h3>
        <span className="section-head-aside" style={{ fontSize: 13, color: "var(--fg2)" }}>What shipping one feature costs you today</span>
      </div>

      <div className="grid-6">
        {TOOLS.map((t) => (
          <div key={t.n} style={{
            border: "1px solid var(--border)", borderRadius: 8, padding: 18,
            display: "flex", flexDirection: "column", gap: 12, background: "var(--muted)",
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 6, background: "var(--card)",
              border: "1px solid var(--brand-200)", color: "var(--brand-800)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontSize: 12,
            }}>{t.n}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
              <div style={{ fontSize: 12, lineHeight: "16px", color: "var(--fg2)", marginTop: 4 }}>{t.sub}</div>
            </div>
            <span style={{ height: 1, background: "var(--border)", display: "block" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>{t.time}</span>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 16, marginTop: 16,
        padding: "20px clamp(16px, 3vw, 24px)", borderRadius: 8,
        background: "var(--brand-50)", border: "1px solid var(--brand-tint-border)",
      }}>
        <span style={{ fontSize: 20, color: "var(--brand-800)" }}>→</span>
        <span className="h3" style={{ color: "var(--brand-900)" }}>
          One workspace. Agents that already know your product.
        </span>
      </div>
    </div>
  );
}
