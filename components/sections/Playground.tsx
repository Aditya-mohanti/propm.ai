"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

type Tab = "doc" | "sheet" | "proto" | "dash";

function DocCanvas() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", minHeight: 420 }}>
      <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: 14 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>PRD · Sticky mobile CTA · draft 3</span>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 600 }}>Problem</span>
        <p style={{ fontSize: 13, lineHeight: "22px", color: "var(--fg1)", maxWidth: "64ch", margin: 0 }}>On mobile the value proposition and the primary action fall below the fold, so cold visitors scroll once and drop off before they know what the product is.</p>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 600, marginTop: 8 }}>Success criteria</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "64ch" }}>
          {["Hero CTA click rate ≥ 15% in 30 days", "Form completion (starts → submits) ≥ 70%", "50% of visitors reach the playground section"].map(s => (
            <span key={s} style={{ display: "flex", gap: 10, fontSize: 13, lineHeight: "20px" }}>
              <span style={{ color: "var(--brand-800)" }}>•</span>{s}
            </span>
          ))}
        </div>
      </div>
      <div style={{ borderLeft: "1px solid var(--border)", padding: 20, background: "var(--muted)", display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontSize: 12, color: "var(--fg2)" }}>Agent notes</span>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, display: "block" }}>Assumption flagged</span>
          <span style={{ fontSize: 12, color: "var(--fg2)", lineHeight: "16px" }}>No baseline conversion data — targets are illustrative.</span>
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, display: "block" }}>Pulled from context</span>
          <span style={{ fontSize: 12, color: "var(--fg2)", lineHeight: "16px" }}>strategy-2026.pdf, p.4 — &ldquo;waitlist first, pricing later&rdquo;.</span>
        </div>
      </div>
    </div>
  );
}

function SheetCanvas() {
  return (
    <div style={{ padding: 20, minHeight: 420, background: "var(--stone-100)" }}>
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", background: "var(--muted)", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--fg2)" }}>
          {["Segment","Users","ARR","Confidence"].map((h, i) => (
            <span key={h} style={{ padding: "10px 12px", textAlign: i > 0 ? "right" : undefined as never }}>{h}</span>
          ))}
        </div>
        {[
          { seg: "Solo PM", users: "12,400", arr: "$1.1M", conf: "High", confBg: "rgba(22,163,74,.05)", confBorder: "rgba(22,163,74,.1)", confColor: "var(--green-800)" },
          { seg: "Product team (5–20)", users: "3,180", arr: "$2.7M", conf: "Medium", confBg: "rgba(180,83,9,.05)", confBorder: "rgba(180,83,9,.1)", confColor: "var(--amber-700)" },
          { seg: "Enterprise", users: "640", arr: "$4.9M", conf: "Low", confBg: "rgba(220,38,38,.05)", confBorder: "rgba(220,38,38,.1)", confColor: "var(--red-800)" },
        ].map(r => (
          <div key={r.seg} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
            <span style={{ padding: "10px 12px" }}>{r.seg}</span>
            <span style={{ padding: "10px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.users}</span>
            <span style={{ padding: "10px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.arr}</span>
            <span style={{ padding: "10px 12px", textAlign: "right" }}>
              <span style={{ display: "inline-flex", height: 20, padding: "0 6px", borderRadius: 6, background: r.confBg, border: `1px solid ${r.confBorder}`, color: r.confColor, fontSize: 12, alignItems: "center" }}>{r.conf}</span>
            </span>
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", fontSize: 13, fontWeight: 600, background: "var(--muted)" }}>
          <span style={{ padding: "10px 12px" }}>Total</span>
          <span style={{ padding: "10px 12px", textAlign: "right" }}>16,220</span>
          <span style={{ padding: "10px 12px", textAlign: "right" }}>$8.7M</span>
          <span style={{ padding: "10px 12px" }} />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>formula shown on every derived cell — nothing is a black box</span>
      </div>
    </div>
  );
}

function ProtoCanvas() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: 420 }}>
      <div style={{ borderRight: "1px solid var(--border)", padding: 16, display: "flex", flexDirection: "column", gap: 8, background: "var(--muted)" }}>
        <span style={{ fontSize: 12, color: "var(--fg2)" }}>Screens</span>
        <span style={{ height: 28, display: "flex", alignItems: "center", padding: "0 8px", borderRadius: 4, background: "var(--card)", border: "1px solid var(--brand-tint-strong)", fontSize: 13, fontWeight: 500 }}>Onboarding — step 2</span>
        {["Team invite", "Empty state"].map(s => (
          <span key={s} style={{ height: 28, display: "flex", alignItems: "center", padding: "0 8px", borderRadius: 4, fontSize: 13, color: "var(--fg2)" }}>{s}</span>
        ))}
        <span style={{ marginTop: "auto", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", lineHeight: "16px" }}>prompt → &ldquo;make the CTA sticky on mobile&rdquo;</span>
      </div>
      <div style={{ padding: 24, background: "var(--stone-100)", display: "flex", gap: 20, alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ width: 236, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-default)" }}>
          <div style={{ height: 28, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 12px", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 9999, background: "var(--stone-300)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>9:41</span>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, lineHeight: "22px" }}>Pick your first agent</span>
            <span style={{ fontSize: 12, color: "var(--fg2)", lineHeight: "16px" }}>You can add more later.</span>
            <span style={{ height: 44, border: "1px solid var(--brand-tint-strong)", background: "var(--brand-50)", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13, fontWeight: 500, color: "var(--brand-900)" }}>PRD Writer</span>
            <span style={{ height: 44, border: "1px solid var(--border)", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13, color: "var(--fg2)" }}>GTM Planner</span>
            <span style={{ height: 44, border: "1px solid var(--border)", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 13, color: "var(--fg2)" }}>SQL Analyst</span>
            <span style={{ height: 44, borderRadius: 6, background: "var(--primary)", color: "var(--primary-fg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, marginTop: 4 }}>Continue</span>
          </div>
        </div>
        <div style={{ width: 236, background: "var(--card)", border: "1px dashed var(--stone-300)", borderRadius: 12, minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 20, color: "var(--stone-400)", fontWeight: 600 }}>+</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", textAlign: "center", padding: "0 20px", lineHeight: "16px" }}>describe the next screen — the agent draws it</span>
        </div>
      </div>
    </div>
  );
}

const BAR_HEIGHTS = [32, 40, 36, 52, 48, 64, 58, 76, 70, 88, 82, 100];
const BAR_COLORS  = ["var(--brand-200)","var(--brand-200)","var(--brand-200)","var(--brand-300)","var(--brand-300)","var(--brand-400)","var(--brand-400)","var(--brand-500)","var(--brand-500)","var(--brand-600)","var(--brand-600)","var(--brand-800)"];

function DashCanvas() {
  return (
    <div style={{ padding: 20, background: "var(--stone-100)", display: "flex", flexDirection: "column", gap: 12, minHeight: 420 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Weekly active PMs",   val: "1,284",  delta: "+12.4% WoW", color: "var(--green-800)"  },
          { label: "Agents created",      val: "3,910",  delta: "+8.1% WoW",  color: "var(--green-800)"  },
          { label: "Docs shipped",        val: "742",    delta: "flat",        color: "var(--fg2)"        },
          { label: "Median time to draft",val: "6m 20s", delta: "+40s",        color: "var(--red-800)"   },
        ].map(m => (
          <div key={m.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
            <span style={{ fontSize: 12, color: "var(--fg2)" }}>{m.label}</span>
            <div style={{ fontSize: 24, fontWeight: 600, fontVariantNumeric: "tabular-nums", marginTop: 4 }}>{m.val}</div>
            <span style={{ fontSize: 12, color: m.color }}>{m.delta}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12, flex: 1 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500 }}>Agent runs by week</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>last 12w</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180, marginTop: 16, paddingTop: 8, borderBottom: "1px solid var(--border)" }}>
            {BAR_HEIGHTS.map((h, i) => (
              <span key={i} style={{
                flex: 1, height: `${h}%`, background: BAR_COLORS[i], borderRadius: "3px 3px 0 0",
                transformOrigin: "bottom", animation: `barRise .5s var(--ease-out) both`, animationDelay: `${i * 0.05}s`,
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginTop: 8 }}>
            <span>W23</span><span>W29</span><span>W34</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, flex: 1 }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500 }}>Top agents</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {[["PRD Writer","41%","41%","var(--brand-800)"],["SQL Analyst","27%","27%","var(--brand-600)"],["Market Research","19%","19%","var(--brand-500)"],["From scratch","13%","13%","var(--brand-400)"]].map(([name,pct,w,bg]) => (
                <div key={name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--fg2)" }}>
                    <span>{name}</span><span>{pct}</span>
                  </div>
                  <span style={{ display: "block", height: 6, borderRadius: 3, background: "var(--stone-200)", marginTop: 4 }}>
                    <span style={{ display: "block", width: w, height: 6, borderRadius: 3, background: bg }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
            <span style={{ fontSize: 12, color: "var(--fg2)" }}>Query behind this view</span>
            <code style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg1)", marginTop: 6, lineHeight: "16px" }}>select week, count(*) from agent_runs group by 1 order by 1</code>
          </div>
        </div>
      </div>
    </div>
  );
}

const CANVAS_META: Record<Tab, { title: string; meta: string }> = {
  doc:   { title: "Doc canvas",       meta: "PRD · draft 3"     },
  sheet: { title: "Sheet canvas",     meta: "sizing model · v2" },
  proto: { title: "Prototype canvas", meta: "onboarding flow"   },
  dash:  { title: "Dashboard canvas", meta: "last 12w"          },
};

const PROJECTS = [
  {
    folder: "GROWTH",
    icon: "↗",
    count: "3",
    items: [
      { name: "Mobile onboarding", goal: "Fix step-2 drop-off", sub: "3 runs · updated today", active: true },
      { name: "Referral loop", goal: "Increase D7 retention", sub: "1 run · 2d ago", active: false },
    ],
  },
  {
    folder: "PLATFORM",
    icon: "⊞",
    count: "2",
    items: [
      { name: "API docs revamp", goal: "Cut support tickets 40%", sub: "2 runs · 4d ago", active: false },
      { name: "Permissions model", goal: "Unblock enterprise tier", sub: "draft", active: false },
    ],
  },
];

function ProjectsSidebar({ activeProject }: { activeProject: string }) {
  return (
    <div style={{
      width: 240, flexShrink: 0,
      border: "1px solid var(--border)", borderRadius: 8,
      background: "var(--muted)", display: "flex", flexDirection: "column",
      alignSelf: "flex-start",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: 13, fontWeight: 600, marginRight: "auto" }}>Projects</span>
        <span style={{
          width: 24, height: 24, borderRadius: 6, border: "1px solid var(--border)",
          background: "var(--card)", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 13, color: "var(--brand-700)", cursor: "pointer",
        }}>+</span>
      </div>
      <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
        {PROJECTS.map(g => (
          <div key={g.folder} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px" }}>
              <span style={{ fontSize: 12, color: "var(--fg2)" }}>▾</span>
              <span style={{ fontSize: 11, color: "var(--brand-700)" }}>{g.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg1)", letterSpacing: "0.02em" }}>{g.folder}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginLeft: "auto" }}>{g.count}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 10, marginLeft: 6, borderLeft: "1px solid var(--border)" }}>
              {g.items.map(p => (
                <div key={p.name} style={{
                  display: "flex", flexDirection: "column", gap: 2,
                  padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                  background: p.active ? "var(--card)" : "transparent",
                  border: p.active ? "1px solid var(--brand-tint-strong)" : "1px solid transparent",
                }}>
                  <span style={{ fontSize: 13, fontWeight: p.active ? 500 : 400, color: p.active ? "var(--fg1)" : "var(--fg1)" }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: "var(--fg2)", lineHeight: "16px" }}>{p.goal}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>{p.sub}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>archive · 6 projects</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>shared with me · 2</span>
      </div>
    </div>
  );
}

export default function Playground() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("proto");

  return (
    <div id="playground" style={{ background: "var(--card)", borderRadius: 12, padding: 40 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginBottom: 8 }}>
            {user ? "your workspace · projects" : "idea playground · runs on credits"}
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>
            {user ? "Your agents. Your context. Your output." : "Brainstorm an idea. Or hand it your Notion."}
          </h2>
          <p style={{ fontSize: 16, lineHeight: "26px", color: "var(--fg2)", marginTop: 10, maxWidth: "62ch", textWrap: "pretty" as const }}>
            {user
              ? "Every project is a goal with its own agents, canvases, context and credits. Pick a project or start a new one."
              : "Type a half-formed idea, paste a Notion page, or drop a file. One credit turns it into a real artifact — a PRD you can ship, a sheet that adds up, a clickable prototype, a dashboard with the query behind it."}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 24, padding: "0 8px", borderRadius: 6, background: "var(--brand-tint-bg)", border: "1px solid var(--brand-tint-border)", color: "var(--brand-800)", fontSize: 12, fontWeight: 500 }}>
            {user ? "5 of 5 credits left" : "3 of 3 credits left"}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>
            {user ? "1 credit per run · resets monthly" : "1 credit per run · free on the waitlist"}
          </span>
        </div>
      </div>

      {/* Signed-in layout: sidebar + main */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {user && <ProjectsSidebar activeProject="Mobile onboarding" />}

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Input area */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 16, background: "var(--muted)", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1, background: "var(--card)", border: "1px solid var(--input)", borderRadius: 6, padding: "12px 14px", minHeight: 76, display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, lineHeight: "20px", color: "var(--fg1)" }}>Onboarding drops off at step two on mobile — I think the value prop is buried. Work out what to change and show me.</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>
                  <span style={{ width: 2, height: 13, background: "var(--brand-800)", display: "block" }} />
                  brainstorm mode — half-formed is fine
                </span>
              </div>
              <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, height: 32, padding: "0 10px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--card)", fontSize: 13, color: "var(--fg1)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 20, padding: "0 6px", borderRadius: 6, background: "rgba(2,132,199,.06)", border: "1px solid rgba(2,132,199,.12)", color: "var(--sky-800)", fontSize: 12, fontWeight: 500 }}>Notion</span>
                  Onboarding research
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, height: 32, padding: "0 10px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--card)", fontSize: 13, color: "var(--fg1)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 20, padding: "0 6px", borderRadius: 6, background: "rgba(220,38,38,.05)", border: "1px solid rgba(220,38,38,.1)", color: "var(--red-800)", fontSize: 12, fontWeight: 500 }}>PDF</span>
                  funnel-q3.pdf
                </span>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 32, border: "1px dashed var(--stone-300)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>+ drop a file or paste a link</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <span className="btn-primary" style={{ height: 32, padding: "0 14px", cursor: "default" }}>Run — 1 credit</span>
              <span style={{ fontSize: 13, color: "var(--fg2)", marginRight: "auto" }}>
                {user
                  ? "Output lands on the canvas below and saves to this project."
                  : "Output lands on the canvas below. Nothing is saved until you have a workspace."}
              </span>
              {!user && (
                <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, background: "rgba(180,83,9,.05)", border: "1px solid rgba(180,83,9,.1)", color: "var(--amber-700)", fontSize: 12, fontWeight: 500 }}>Sandbox</span>
              )}
              {user && (
                <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, background: "rgba(22,163,74,.05)", border: "1px solid rgba(22,163,74,.1)", color: "var(--green-800)", fontSize: 12, fontWeight: 500 }}>Saved</span>
              )}
            </div>
          </div>

          {/* Canvas tabs */}
          <div style={{ display: "flex", gap: 4, padding: 3, borderRadius: 8, background: "var(--muted)", border: "1px solid var(--border)", maxWidth: 520 }}>
            {(["doc","sheet","proto","dash"] as Tab[]).map(t => (
              <button key={t} type="button" onClick={() => setTab(t)} style={{
                flex: 1, height: 32, border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13,
                ...(tab === t
                  ? { background: "var(--card)", fontWeight: 500, color: "var(--fg1)", boxShadow: "var(--shadow-sm)" }
                  : { background: "transparent", color: "var(--fg2)" }),
              }}>
                {t === "doc" ? "Doc" : t === "sheet" ? "Sheet" : t === "proto" ? "Prototype" : "Dashboard"}
              </button>
            ))}
          </div>

          {/* Canvas panel */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
              <span style={{ width: 6, height: 6, borderRadius: 9999, background: "var(--brand-600)", display: "block" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{CANVAS_META[tab].title}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)", marginLeft: "auto" }}>{CANVAS_META[tab].meta}</span>
              {user && (
                <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--fg2)", fontSize: 12, cursor: "pointer" }}>Export</span>
                  <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 8px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--fg2)", fontSize: 12 }}>Version 3</span>
                </div>
              )}
            </div>
            {tab === "proto" && <ProtoCanvas />}
            {tab === "dash"  && <DashCanvas />}
            {tab === "doc"   && <DocCanvas />}
            {tab === "sheet" && <SheetCanvas />}
          </div>

          {!user && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <a href="#waitlist" className="btn-primary">Get early access</a>
              <span style={{ fontSize: 13, color: "var(--fg2)" }}>Playground projects aren't saved — early access gives you a real workspace with folders, team and credits.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
