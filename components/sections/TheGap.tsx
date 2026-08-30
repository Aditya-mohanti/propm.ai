export default function TheGap() {
  return (
    <div style={{ background: "var(--card)", borderRadius: 12, padding: 40 }}>
      <div style={{ maxWidth: "64ch" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginBottom: 8 }}>the gap</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>
          The idea was never the hard part.
        </h2>
        <p style={{ fontSize: 16, lineHeight: "26px", color: "var(--fg2)", marginTop: 10, textWrap: "pretty" as const }}>
          Between &ldquo;I know what we should build&rdquo; and a spec your team will act on sits a week of assembly work. That week is where most good ideas quietly die.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 28 }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ height: 3, background: "var(--stone-300)" }} />
          <div style={{ padding: 20 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>before</span>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>The idea</div>
            <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--fg2)", marginTop: 6 }}>Clear in your head after one customer call. Ten minutes of thinking.</p>
          </div>
        </div>

        <div style={{ border: "1px solid rgba(180,83,9,.25)", borderRadius: 8, overflow: "hidden", background: "var(--amber-50)" }}>
          <div style={{ height: 3, background: "var(--amber-600)" }} />
          <div style={{ padding: 20 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--amber-700)" }}>the gap</span>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>The assembly week</div>
            <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--amber-800)", marginTop: 6 }}>Chasing numbers, reformatting docs, re-explaining context to a chat window, mocking a screen so people understand.</p>
          </div>
        </div>

        <div style={{ border: "1px solid var(--brand-tint-strong)", borderRadius: 8, overflow: "hidden", background: "var(--brand-50)" }}>
          <div style={{ height: 3, background: "var(--brand-800)" }} />
          <div style={{ padding: 20 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--brand-800)" }}>after</span>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>Something to act on</div>
            <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--brand-900)", marginTop: 6 }}>A sourced PRD, the sizing sheet, a clickable flow and the dashboard to watch it. One run.</p>
          </div>
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 16, marginTop: 16,
        padding: "20px 24px", borderRadius: 8, background: "var(--muted)", border: "1px solid var(--border)",
      }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em", marginRight: "auto" }}>
          PmPro.ai takes the week, not the thinking.
        </span>
        <a href="#waitlist" className="btn-primary" style={{ flexShrink: 0 }}>Get early access</a>
      </div>
    </div>
  );
}
