"use client";

import { useState } from "react";
import WaitlistForm from "@/components/ui/WaitlistForm";
import QueriesDialog from "@/components/ui/QueriesDialog";
import Logo from "@/components/ui/Logo";
import DocCanvas from "./DocCanvas";
import { useAuth } from "@/lib/auth-context";

const AGENTS = [
  { delay: 0,    color: "#0284c7", tagColor: "rgba(2,132,199,.06)", tagBorder: "rgba(2,132,199,.12)", tagText: "var(--sky-800)", tag: "Doc",       name: "PRD Writer",  id: "agent_01" },
  { delay: 0.4,  color: "var(--green-600)", tagColor: "rgba(22,163,74,.05)", tagBorder: "rgba(22,163,74,.1)", tagText: "var(--green-800)", tag: "Sheet",     name: "GTM Planner", id: "agent_02" },
  { delay: 0.8,  color: "#0284c7", tagColor: "rgba(2,132,199,.06)", tagBorder: "rgba(2,132,199,.12)", tagText: "var(--sky-800)", tag: "Doc",       name: "Research",    id: "agent_03" },
  { delay: 1.2,  color: "#115e59", tagColor: "rgba(17,94,89,.06)",  tagBorder: "rgba(17,94,89,.12)",  tagText: "var(--teal-800)", tag: "Dashboard", name: "SQL Analyst", id: "agent_04" },
  { delay: 1.6,  color: "var(--purple-500)", tagColor: "rgba(168,85,247,.05)", tagBorder: "rgba(168,85,247,.1)", tagText: "var(--purple-800)", tag: "Prototype", name: "Design",      id: "agent_05" },
];

export default function Hero() {
  const { user, signOut } = useAuth();
  const [queriesOpen, setQueriesOpen] = useState(false);

  return (
    <div style={{ background: "var(--card)", borderRadius: 12, overflow: "hidden" }}>
      {queriesOpen && <QueriesDialog onClose={() => setQueriesOpen(false)} />}
      <header style={{
        display: "flex", alignItems: "center", gap: 32,
        padding: "16px 40px", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
          <Logo size={24} />
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
            PmPro.ai
          </span>
          <span className="tag tag-brand" style={{ marginLeft: 4 }}>Beta</span>
        </div>
        <nav style={{ display: "flex", gap: 24, fontSize: 13 }}>
          {[
            ["#how", "How it works"], ["#templates", "Agents"],
            ["#anatomy", "Anatomy of a run"], ["#playground", "Playground"],
            ["#today", "What works today"], ["#faq", "FAQ"],
          ].map(([href, label]) => (
            <a key={href} href={href} style={{ color: "var(--fg2)", textDecoration: "none" }}>{label}</a>
          ))}
          <button
            type="button"
            onClick={() => setQueriesOpen(true)}
            style={{
              border: 0, background: "transparent", padding: 0,
              fontFamily: "inherit", fontSize: 13, color: "var(--brand-800)",
              cursor: "pointer",
            }}
          >
            Any queries?
          </button>
        </nav>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", height: 32, borderRadius: 6, border: "1px solid var(--border)", background: "var(--muted)" }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "var(--brand-100)", border: "1px solid var(--brand-200)",
                color: "var(--brand-900)", fontSize: 11, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {user.name.slice(0, 2).toUpperCase()}
              </span>
              <span style={{ fontSize: 13, color: "var(--fg1)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </span>
            </div>
            <a href="#playground" className="btn-primary" style={{ height: 32, padding: "0 14px" }}>
              Open workspace →
            </a>
            <button
              onClick={signOut}
              style={{
                height: 32, padding: "0 10px", border: "1px solid var(--border)",
                borderRadius: 6, background: "transparent", fontSize: 13,
                color: "var(--fg2)", cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <a href="#waitlist" className="btn-primary" style={{ height: 32, padding: "0 14px" }}>
            Join ProPM
          </a>
        )}
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Left: headline + form + stats */}
        <div style={{
          padding: "64px 40px 56px",
          display: "flex", flexDirection: "column", gap: 24,
          borderRight: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>
            <span style={{
              width: 6, height: 6, borderRadius: 9999, background: "var(--brand-600)",
              display: "block", animation: "pulseDot 2.4s ease-in-out infinite",
            }} />
            {user ? `Welcome back, ${user.name}` : "Early access · built by a PM, in the open"}
          </div>

          <h1 style={{
            fontFamily: "var(--font-sans)", fontSize: 48, fontWeight: 600,
            lineHeight: "52px", letterSpacing: "-0.02em",
            maxWidth: "16ch", textWrap: "balance" as const, margin: 0,
          }}>
            Assemble the product team you wish you had.
          </h1>

          <p style={{ fontSize: 16, lineHeight: "26px", color: "var(--fg2)", maxWidth: "46ch", textWrap: "pretty" as const, margin: 0 }}>
            Customizable AI agents — PRD, GTM, market research, SQL, design — working on real docs, sheets, prototypes and dashboards. One workspace instead of six tabs.
          </p>

          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 500, marginTop: 8 }}>
              <div style={{
                padding: "14px 16px", borderRadius: 8,
                background: "var(--brand-50)", border: "1px solid var(--brand-tint-border)",
                display: "flex", flexDirection: "column", gap: 2,
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-900)" }}>Your workspace is ready.</span>
                <span style={{ fontSize: 12, color: "var(--fg2)" }}>Pick up where you left off — your agents and projects are waiting.</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href="#playground" className="btn-primary" style={{ height: 40, padding: "0 18px", display: "inline-flex", alignItems: "center" }}>
                  Open workspace →
                </a>
                <button
                  onClick={signOut}
                  style={{
                    height: 40, padding: "0 14px", border: "1px solid var(--border)",
                    borderRadius: 6, background: "transparent", fontSize: 13,
                    color: "var(--fg2)", cursor: "pointer",
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <WaitlistForm variant="hero" />
          )}

          {/* Stats */}
          <div style={{ display: "flex", gap: 8, paddingTop: 24, marginTop: 8, borderTop: "1px solid var(--border)" }}>
            {[
              { val: "6 → 1", label: "tools collapsed"       },
              { val: "4",     label: "canvases, not chat logs"},
              { val: "5 min", label: "to your first agent"   },
            ].map(({ val, label }) => (
              <div key={label} style={{
                flex: 1, padding: "14px 16px",
                border: "1px solid var(--border)", borderRadius: 8, background: "var(--muted)",
              }}>
                <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>{val}</div>
                <div style={{ fontSize: 12, color: "var(--fg2)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: agent grid + doc canvas animation */}
        <div style={{ padding: 32, background: "var(--muted)", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>
            <span>your team</span><span>assembling…</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {AGENTS.map((a) => (
              <div key={a.id} style={{
                animation: `agentIn 7s var(--ease-out) infinite`,
                animationDelay: `${a.delay}s`,
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 8, overflow: "hidden", minHeight: 104,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ height: 3, background: a.color, opacity: .6 }} />
                <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6, flex: 1, justifyContent: "space-between" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", alignSelf: "flex-start",
                    height: 20, padding: "0 6px", borderRadius: 6,
                    background: a.tagColor, border: `1px solid ${a.tagBorder}`,
                    color: a.tagText, fontSize: 12, fontWeight: 500,
                  }}>{a.tag}</span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, lineHeight: "22px" }}>{a.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>{a.id}</span>
                </div>
              </div>
            ))}

            {/* From scratch */}
            <div style={{
              animation: "agentIn 7s var(--ease-out) infinite", animationDelay: "2s",
              background: "var(--primary)", border: "1px solid var(--primary)",
              borderRadius: 8, padding: 12, minHeight: 104,
              display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 6,
              cursor: "pointer",
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", alignSelf: "flex-start",
                height: 20, padding: "0 6px", borderRadius: 6,
                background: "rgba(250,250,249,.2)", color: "var(--stone-50)", fontSize: 12, fontWeight: 500,
              }}>New</span>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, lineHeight: "22px", color: "var(--stone-50)" }}>From scratch</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--stone-50)", lineHeight: 1 }}>+</span>
            </div>
          </div>

          {/* Doc canvas — demo loop until you click into it, then editable */}
          <DocCanvas />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg2)" }}>agents assembling, then drafting — the doc above is yours to edit</div>
        </div>
      </div>
    </div>
  );
}
