const STATUS_ITEMS = [
  { badge: "Live",  badgeBg: "rgba(22,163,74,.05)", badgeBorder: "rgba(22,163,74,.1)", badgeColor: "var(--green-800)", text: "PRD, Research and GTM agents on the Doc and Sheet canvases", dim: false },
  { badge: "Live",  badgeBg: "rgba(22,163,74,.05)", badgeBorder: "rgba(22,163,74,.1)", badgeColor: "var(--green-800)", text: "Build-from-scratch agents with custom instructions and context",  dim: false },
  { badge: "Beta",  badgeBg: "rgba(180,83,9,.05)", badgeBorder: "rgba(180,83,9,.1)", badgeColor: "var(--amber-700)", text: "Dashboard canvas — read-only Postgres and Snowflake connections",  dim: false },
  { badge: "Beta",  badgeBg: "rgba(180,83,9,.05)", badgeBorder: "rgba(180,83,9,.1)", badgeColor: "var(--amber-700)", text: "Prototype canvas — single-screen flows, HTML export",              dim: false },
  { badge: "Q4",    badgeBg: "transparent",         badgeBorder: "var(--border)",      badgeColor: "var(--fg2)",       text: "Multi-agent handoffs, team workspaces, Jira and Linear sync",    dim: true  },
  { badge: "Later", badgeBg: "transparent",         badgeBorder: "var(--border)",      badgeColor: "var(--fg2)",       text: "Shared agent library, SSO, audit log",                           dim: true  },
];

export default function WhatWorksToday() {
  return (
    <div id="today" style={{ background: "var(--card)", borderRadius: 12, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* Status list */}
      <div style={{ padding: 40, borderRight: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginBottom: 8 }}>no logos, no testimonials — we don&apos;t have them yet</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>What works today</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
          {STATUS_ITEMS.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8,
              opacity: item.dim ? 0.75 : 1,
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6,
                background: item.badgeBg, border: `1px solid ${item.badgeBorder}`,
                color: item.badgeColor, fontSize: 12, fontWeight: 500, flexShrink: 0,
              }}>{item.badge}</span>
              <span style={{ fontSize: 13 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Founder note */}
      <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 16, background: "var(--muted)", borderRadius: "0 12px 12px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            width: 40, height: 40, borderRadius: 9999,
            background: "var(--brand-100)", color: "var(--brand-800)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 600,
          }}>AV</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>A note from the person building this</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>founder · ex-PM · shipping in public</div>
          </div>
        </div>
        <p style={{ fontSize: 16, lineHeight: "26px", textWrap: "pretty" as const, margin: 0 }}>
          I spent eight years writing PRDs at 11pm because the research was in one tab, the numbers in another, and the spec in a third. PmPro.ai is the workspace I kept describing to engineers who were too busy to build it.
        </p>
        <p style={{ fontSize: 16, lineHeight: "26px", color: "var(--fg2)", textWrap: "pretty" as const, margin: 0 }}>
          It is early. There are no customer logos on this page because there are no customers to name yet — only a build log and a waitlist. If that&apos;s too early for you, that&apos;s fair. If you&apos;d rather shape it while it&apos;s still shapeable, join and tell me what&apos;s wrong with it.
        </p>
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", gap: 16, fontSize: 13 }}>
          <a href="#changelog">Read the build log</a>
          <a href="#waitlist">Join the waitlist →</a>
        </div>
      </div>
    </div>
  );
}
