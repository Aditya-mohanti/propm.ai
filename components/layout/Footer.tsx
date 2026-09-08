export default function Footer() {
  return (
    <footer style={{
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 16,
      padding: "20px 8px 12px",
    }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 12,
        color: "rgba(250,250,249,.68)", marginRight: "auto",
      }}>
        PmPro.ai · early access · 2026
      </span>
      {[
        { href: "#privacy",   label: "Privacy"   },
        { href: "#terms",     label: "Terms"     },
        { href: "#changelog", label: "Build log" },
      ].map(({ href, label }) => (
        <a
          key={href}
          href={href}
          style={{ fontSize: 12, color: "rgba(250,250,249,.6)", textDecoration: "none" }}
        >{label}</a>
      ))}
    </footer>
  );
}
