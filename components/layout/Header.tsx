export default function Header() {
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
        }}>PmPro.ai</span>
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

      <a href="#waitlist" className="btn-primary" style={{ height: 32, padding: "0 14px" }}>
        Join the waitlist
      </a>
    </header>
  );
}
