"use client";

import { useAuth } from "@/lib/auth-context";

function initials(name: string) {
  return name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0].toUpperCase())
    .join("");
}

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      gap: 32,
      padding: "16px 40px",
      borderBottom: "1px solid var(--border)",
      background: "var(--card)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
        <span style={{
          width: 24, height: 24, borderRadius: 6,
          background: "var(--brand-800)", color: "var(--white)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 600, fontSize: 13,
        }}>P</span>
        <span style={{
          fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600,
          letterSpacing: "-0.01em",
        }}>ProPM</span>
        <span className="tag tag-brand" style={{ marginLeft: 4 }}>Beta</span>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", gap: 24, fontSize: 13 }} aria-label="Main navigation">
        {[
          { href: "#how",       label: "How it works"      },
          { href: "#templates", label: "Agents"             },
          { href: "#anatomy",   label: "Anatomy of a run"  },
          { href: "#playground",label: "Playground"         },
          { href: "#today",     label: "What works today"  },
          { href: "#faq",       label: "FAQ"               },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            style={{ color: "var(--fg2)", textDecoration: "none", transition: "color var(--duration-fast)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--fg1)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--fg2)")}
          >{label}</a>
        ))}
      </nav>

      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", height: 32, borderRadius: 6, border: "1px solid var(--border)", background: "var(--muted)" }}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "var(--brand-100)", border: "1px solid var(--brand-200)",
              color: "var(--brand-900)", fontSize: 11, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>{initials(user.name)}</span>
            <span style={{ fontSize: 13, color: "var(--fg1)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name}
            </span>
          </div>
          <a href="/workspace" className="btn-primary" style={{ height: 32, padding: "0 14px" }}>
            Open workspace →
          </a>
          <button
            onClick={signOut}
            style={{
              height: 32, padding: "0 10px", border: "1px solid var(--border)",
              borderRadius: 6, background: "transparent", fontSize: 13,
              color: "var(--fg2)", cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--fg1)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--fg2)")}
          >
            Sign out
          </button>
        </div>
      ) : (
        <a href="/signin" className="btn-primary" style={{ height: 32, padding: "0 14px" }}>
          Join ProPM
        </a>
      )}
    </header>
  );
}
