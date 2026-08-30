"use client";

import { useRef } from "react";

const TEMPLATES = [
  {
    tag: "Doc canvas", tagBg: "rgba(2,132,199,.06)", tagBorder: "rgba(2,132,199,.12)", tagColor: "var(--sky-800)",
    name: "PRD Writer",
    body: "Turns a rough problem into a structured PRD — problems, solution space, success criteria.",
    meta: "4 prompts to set up",
    preview: "doc",
  },
  {
    tag: "Sheet canvas", tagBg: "rgba(22,163,74,.05)", tagBorder: "rgba(22,163,74,.1)", tagColor: "var(--green-800)",
    name: "GTM Planner",
    body: "Launch plan, channel mix and a week-by-week checklist you can hand to marketing.",
    meta: "3 prompts to set up",
    preview: "sheet",
  },
  {
    tag: "Doc canvas", tagBg: "rgba(2,132,199,.06)", tagBorder: "rgba(2,132,199,.12)", tagColor: "var(--sky-800)",
    name: "Market Research",
    body: "Competitor teardowns with sources, and a confidence level on every claim.",
    meta: "cites its sources",
    preview: "research",
  },
  {
    tag: "Dashboard canvas", tagBg: "rgba(180,83,9,.05)", tagBorder: "rgba(180,83,9,.1)", tagColor: "var(--amber-700)",
    name: "SQL Analyst",
    body: "Asks in English, writes the query, returns the chart — and the caveats.",
    meta: "read-only by default",
    preview: "chart",
  },
  {
    tag: "Prototype canvas", tagBg: "rgba(168,85,247,.05)", tagBorder: "rgba(168,85,247,.1)", tagColor: "var(--purple-800)",
    name: "Design Partner",
    body: "Sketches the flow you just wrote about, so the spec has something to point at.",
    meta: "exports HTML",
    preview: "frames",
  },
];

function PreviewDoc() {
  return (
    <div style={{ height: 56, background: "var(--muted)", borderBottom: "1px solid var(--border)", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 5, justifyContent: "center" }}>
      <span style={{ height: 6, width: "70%", borderRadius: 2, background: "var(--stone-300)", display: "block" }} />
      <span style={{ height: 4, width: "100%", borderRadius: 2, background: "var(--stone-200)", display: "block" }} />
      <span style={{ height: 4, width: "86%", borderRadius: 2, background: "var(--stone-200)", display: "block" }} />
    </div>
  );
}

function PreviewSheet() {
  return (
    <div style={{ height: 56, background: "var(--muted)", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridTemplateRows: "1fr 1fr", gap: 1, padding: "8px 16px" }}>
      {["var(--stone-200)","var(--stone-200)","var(--stone-200)","var(--stone-200)",
        "var(--stone-100)","var(--green-100)","var(--stone-100)","var(--stone-100)"].map((bg, i) => (
        <span key={i} style={{ background: bg, borderRadius: 1 }} />
      ))}
    </div>
  );
}

function PreviewResearch() {
  return (
    <div style={{ height: 56, background: "var(--muted)", borderBottom: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 6 }}>
      {[["rgba(2,132,199,.07)","var(--sky-800)","source"], ["rgba(22,163,74,.06)","var(--green-800)","high"], ["rgba(180,83,9,.06)","var(--amber-700)","medium"]].map(([bg, color, label]) => (
        <span key={label} style={{ height: 20, padding: "0 6px", borderRadius: 6, background: bg, color, fontSize: 12, display: "inline-flex", alignItems: "center" }}>{label}</span>
      ))}
    </div>
  );
}

function PreviewChart() {
  return (
    <div style={{ height: 56, background: "var(--muted)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "flex-end", gap: 4 }}>
      {[["40%","var(--brand-200)"],["65%","var(--brand-300)"],["50%","var(--brand-200)"],["85%","var(--brand-500)"],["70%","var(--brand-300)"]].map(([h, bg], i) => (
        <span key={i} style={{ flex: 1, height: h, background: bg, borderRadius: 1 }} />
      ))}
    </div>
  );
}

function PreviewFrames() {
  return (
    <div style={{ height: 56, background: "var(--muted)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", gap: 6, alignItems: "center" }}>
      <span style={{ width: 36, height: "100%", border: "1px solid var(--stone-200)", borderRadius: 3, background: "var(--card)" }} />
      <span style={{ width: 36, height: "100%", border: "1px solid var(--stone-200)", borderRadius: 3, background: "var(--card)" }} />
      <span style={{ width: 36, height: "100%", border: "1px solid var(--purple-500)", borderRadius: 3, background: "var(--purple-100)" }} />
    </div>
  );
}

const PREVIEWS: Record<string, () => React.JSX.Element> = {
  doc: PreviewDoc, sheet: PreviewSheet, research: PreviewResearch, chart: PreviewChart, frames: PreviewFrames,
};

export default function Templates() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "prev" | "next") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "next" ? 300 : -300, behavior: "smooth" });
  }

  return (
    <div id="templates" style={{ background: "var(--card)", borderRadius: 12, padding: "40px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, padding: "0 40px 24px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginBottom: 8 }}>agent templates</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>
            Start with someone who knows the job.
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["prev", "next"] as const).map(d => (
            <button key={d} type="button" aria-label={d === "prev" ? "Previous templates" : "Next templates"} onClick={() => scroll(d)} style={{
              width: 32, height: 32, border: "1px solid var(--border)", borderRadius: 6,
              background: "var(--bg)", color: "var(--fg1)", fontSize: 13, cursor: "pointer",
            }}>{d === "prev" ? "←" : "→"}</button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} style={{
        display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory",
        padding: "0 40px 4px",
        scrollbarWidth: "none", msOverflowStyle: "none",
      }}>
        {TEMPLATES.map(t => {
          const Preview = PREVIEWS[t.preview];
          return (
            <div key={t.name} style={{
              scrollSnapAlign: "start", flex: "0 0 288px",
              border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden",
            }}>
              <Preview />
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, minHeight: 180 }}>
                <span style={{ display: "inline-flex", alignItems: "center", alignSelf: "flex-start", height: 24, padding: "0 8px", borderRadius: 6, background: t.tagBg, border: `1px solid ${t.tagBorder}`, color: t.tagColor, fontSize: 12, fontWeight: 500 }}>{t.tag}</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>{t.name}</span>
                <p style={{ fontSize: 13, lineHeight: "20px", color: "var(--fg2)", flex: 1, margin: 0 }}>{t.body}</p>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", paddingTop: 10, borderTop: "1px solid var(--border)" }}>{t.meta}</span>
              </div>
            </div>
          );
        })}

        {/* From scratch */}
        <div style={{
          scrollSnapAlign: "start", flex: "0 0 288px",
          border: "1px solid var(--primary)", borderRadius: 8, background: "var(--primary)",
          padding: 20, display: "flex", flexDirection: "column", gap: 10, minHeight: 236, cursor: "pointer",
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", alignSelf: "flex-start", height: 24, padding: "0 8px", borderRadius: 6, background: "rgba(250,250,249,.2)", color: "var(--stone-50)", fontSize: 12, fontWeight: 500 }}>Any canvas</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--stone-50)" }}>Start from scratch</span>
          <p style={{ fontSize: 13, lineHeight: "20px", color: "rgba(250,250,249,.8)", flex: 1, margin: 0 }}>Nobody knows your product like you do. Build the specialist you actually need.</p>
          <span style={{ fontSize: 20, fontWeight: 600, color: "var(--stone-50)", lineHeight: 1 }}>+</span>
        </div>
      </div>
    </div>
  );
}
