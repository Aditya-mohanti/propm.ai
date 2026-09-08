const FEATURES = [
  { code: "CTX", name: "Shared product context",  body: "Upload once. Every agent reads the same strategy docs, roadmap and past specs."                         },
  { code: "→→",  name: "Agents that hand off",    body: "Research feeds the PRD; the PRD feeds GTM. No copy-pasting between tabs."                              },
  { code: "v3",  name: "Versioned output",        body: "Every canvas keeps history, so you can see what the agent changed and why."                             },
  { code: "SYS", name: "Your instructions stick", body: "Tone, template and non-negotiables live with the agent, not in a daily re-prompt."                      },
  { code: "SRC", name: "Sources on every claim",  body: "Research and analysis cite where a number came from, with a confidence level."                          },
  { code: "EXP", name: "Export anywhere",         body: "Docs, sheets, prototypes and dashboards leave as files your team already uses."                         },
];

export default function WorkspaceFeatures() {
  return (
    <div className="section">
      <h2 className="h2" style={{ margin: "0 0 24px" }}>
        What you get in the workspace
      </h2>
      <div className="grid-3">
        {FEATURES.map(f => (
          <div key={f.code} style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "var(--card)" }}>
            <div style={{
              padding: "16px clamp(14px, 2.4vw, 20px)", borderBottom: "1px solid var(--border)",
              background: "var(--brand-50)", display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 6,
                background: "var(--brand-tint-bg)", border: "1px solid var(--brand-tint-border)",
                color: "var(--brand-800)", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-mono)", fontSize: 12, flexShrink: 0,
              }}>{f.code}</span>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>{f.name}</span>
            </div>
            <p style={{ padding: "16px 20px 20px", fontSize: 13, lineHeight: "20px", color: "var(--fg2)", margin: 0 }}>{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
