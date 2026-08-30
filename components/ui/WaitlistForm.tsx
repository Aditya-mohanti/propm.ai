"use client";

import { useState } from "react";

interface Props {
  variant?: "hero" | "cta";
}

export default function WaitlistForm({ variant = "hero" }: Props) {
  const [email, setEmail]       = useState("");
  const [role, setRole]         = useState("");
  const [status, setStatus]     = useState<"idle" | "ok" | "err">("idle");
  const [label, setLabel]       = useState("Get early access");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLabel("Joining…");
    await new Promise(r => setTimeout(r, 600));
    setStatus("ok");
    setLabel("Get early access");
  }

  if (variant === "cta") {
    return (
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 12, color: "var(--fg2)" }}>Work email</label>
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{
              height: 40, padding: "0 12px", border: "1px solid var(--input)", borderRadius: 6,
              fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg1)", background: "var(--bg)",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 12, color: "var(--fg2)" }}>Your role (optional)</label>
          <select
            value={role} onChange={e => setRole(e.target.value)}
            style={{
              height: 40, padding: "0 10px", border: "1px solid var(--input)", borderRadius: 6,
              fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg1)", background: "var(--bg)",
            }}
          >
            <option>Select</option>
            <option>PM / Product lead</option><option>Founder</option>
            <option>Design</option><option>Engineering</option><option>Other</option>
          </select>
        </div>
        {/* Honeypot */}
        <input type="text" name="company_website" tabIndex={-1} aria-hidden="true"
          style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
        <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          {label}
        </button>
        {status === "ok" && (
          <div style={{
            display: "flex", flexDirection: "column", gap: 2,
            padding: "10px 12px", border: "1px solid rgba(22,163,74,.15)",
            background: "var(--green-50)", borderRadius: 6,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--green-800)" }}>You're on the list — position #1,284.</span>
            <span style={{ fontSize: 12, color: "var(--fg2)" }}>Confirmation sent. Next: an invite when your workspace is provisioned.</span>
          </div>
        )}
        {status === "err" && (
          <div style={{ padding: "8px 12px", border: "1px solid rgba(153,27,27,.15)", background: "var(--red-50)", borderRadius: 6, fontSize: 12, color: "var(--red-800)" }}>
            Couldn't save that. Check the address and try again.
          </div>
        )}
        <div style={{ fontSize: 12, lineHeight: "16px", color: "var(--fg2)" }}>
          By joining you agree to receive product emails. Unsubscribe any time.{" "}
          <a href="#privacy" style={{ color: "var(--fg2)", textDecoration: "underline" }}>Privacy</a>
        </div>
      </form>
    );
  }

  // hero variant
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 500, marginTop: 8 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com" aria-label="Work email"
          style={{
            flex: 1, minWidth: 0, height: 40, padding: "0 12px",
            border: "1px solid var(--input)", borderRadius: 6,
            fontFamily: "var(--font-sans)", fontSize: 13,
            color: "var(--fg1)", background: "var(--bg)",
          }}
        />
        <select
          value={role} onChange={e => setRole(e.target.value)} aria-label="Your role"
          style={{
            height: 40, padding: "0 10px", border: "1px solid var(--input)", borderRadius: 6,
            fontFamily: "var(--font-sans)", fontSize: 13,
            color: "var(--fg2)", background: "var(--bg)",
          }}
        >
          <option>Role (optional)</option>
          <option>PM / Product lead</option><option>Founder</option>
          <option>Design</option><option>Engineering</option><option>Other</option>
        </select>
        <button type="submit" className="btn-primary" style={{ height: 40, padding: "0 18px", whiteSpace: "nowrap" }}>
          {label}
        </button>
      </form>

      {status === "ok" && (
        <div style={{
          display: "flex", flexDirection: "column", gap: 2,
          padding: "10px 12px", border: "1px solid rgba(22,163,74,.15)",
          background: "var(--green-50)", borderRadius: 6,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--green-800)" }}>You're on the list.</span>
          <span style={{ fontSize: 12, color: "var(--fg2)" }}>Confirmation sent. Next: an invite when your workspace is provisioned.</span>
        </div>
      )}
      {status === "err" && (
        <div style={{ padding: "8px 12px", border: "1px solid rgba(153,27,27,.15)", background: "var(--red-50)", borderRadius: 6, fontSize: 12, color: "var(--red-800)" }}>
          That address didn't look right — try again.
        </div>
      )}

      <div style={{ fontSize: 12, lineHeight: "16px", color: "var(--fg2)" }}>
        No spam. One email when your seat is ready.{" "}
        <a href="#privacy" style={{ color: "var(--fg2)", textDecoration: "underline" }}>Privacy</a>
      </div>
    </div>
  );
}
