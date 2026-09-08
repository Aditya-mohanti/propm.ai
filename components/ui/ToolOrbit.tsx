/**
 * The six tools, orbiting the one workspace that replaces them.
 *
 * The sign-in page's job is to say what is behind the door, and the product's
 * whole pitch is collapsing six tabs into one surface — so the mark sits at the
 * centre and the tools it absorbs ring it. Positions are computed from an angle
 * and a radius rather than hand-placed, so the ring stays even if a tool is
 * added or dropped. Decorative: the copy beside it carries the meaning.
 */

const TOOLS = [
  { label: "Docs", angle: 292, radius: 37, color: "#38bdf8", glyph: "doc" },
  { label: "Sheets", angle: 8, radius: 30, color: "#34d399", glyph: "sheet" },
  { label: "SQL", angle: 74, radius: 41, color: "#fbbf24", glyph: "sql" },
  { label: "Research", angle: 148, radius: 32, color: "#f472b6", glyph: "search" },
  { label: "Prototypes", angle: 205, radius: 42, color: "#a78bfa", glyph: "frame" },
  { label: "Chat", angle: 246, radius: 29, color: "#2dd4bf", glyph: "chat" },
] as const;

export default function ToolOrbit() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 440,
        aspectRatio: "1 / 1",
        margin: "0 auto",
      }}
    >
      {/* ambient bloom */}
      <span
        style={{
          position: "absolute",
          inset: "12%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(145,132,217,0.30) 0%, rgba(145,132,217,0.07) 45%, rgba(145,132,217,0) 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* rings */}
      <svg
        viewBox="0 0 100 100"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {[29, 38, 47].map((r, i) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgba(233,233,237,0.13)"
            strokeWidth="0.25"
            strokeDasharray={i === 1 ? "1.6 1.6" : undefined}
            style={
              i === 1
                ? {
                    transformOrigin: "50% 50%",
                    animation: "orbitSpin 46s linear infinite",
                  }
                : undefined
            }
          />
        ))}
      </svg>

      {/* the workspace at the centre */}
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 92,
          height: 92,
          borderRadius: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(150deg, #2b2741 0%, #1e2133 100%)",
          border: "1px solid rgba(145,132,217,0.45)",
          boxShadow:
            "0 0 0 10px rgba(145,132,217,0.07), 0 0 44px rgba(145,132,217,0.35), 0 18px 40px rgba(0,0,0,0.5)",
        }}
      >
        <span style={{ display: "flex", transform: "scale(1.05)" }}>
          <OrbitLogo />
        </span>
      </span>

      {/* the tools it replaces */}
      {TOOLS.map((t, i) => {
        const rad = (t.angle * Math.PI) / 180;
        const left = 50 + t.radius * Math.cos(rad);
        const top = 50 + t.radius * Math.sin(rad);
        return (
          <span
            key={t.label}
            title={t.label}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
              transform: "translate(-50%, -50%)",
              width: 46,
              height: 46,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#1e2133",
              border: "1px solid rgba(233,233,237,0.12)",
              boxShadow: `0 10px 26px rgba(0,0,0,0.5), 0 0 22px -6px ${t.color}66`,
              color: t.color,
              animation: `orbitFloat 6s var(--ease-out) ${i * 0.7}s infinite`,
            }}
          >
            <Glyph name={t.glyph} />
          </span>
        );
      })}
    </div>
  );
}

/** The mark, sized for the centre well. Kept local so Logo's own box is unchanged. */
function OrbitLogo() {
  return (
    <svg width="46" height="46" viewBox="0 0 600 600" fill="none">
      <defs>
        <linearGradient id="propm-orbit" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <g transform="translate(130,188)">
        <rect x="0" y="180" width="44" height="70" rx="10" fill="#2A3330" />
        <rect x="66" y="130" width="44" height="120" rx="10" fill="#3E4C47" />
        <rect x="132" y="70" width="44" height="180" rx="10" fill="#57685F" />
        <rect x="198" y="0" width="44" height="250" rx="10" fill="url(#propm-orbit)" />
        <path
          d="M 242 0 L 300 -46 L 300 -18 L 340 -18 L 340 14 L 300 14 L 300 42 Z"
          fill="url(#propm-orbit)"
          transform="translate(0,20)"
        />
      </g>
    </svg>
  );
}

function Glyph({ name }: { name: string }) {
  const p = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "doc":
      return (
        <svg {...p}>
          <path d="M6 3h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M13 3v5h5M9 13h6M9 17h6" />
        </svg>
      );
    case "sheet":
      return (
        <svg {...p}>
          <rect x="4" y="4" width="16" height="16" rx="1.5" />
          <path d="M4 10h16M4 15h16M10 4v16" />
        </svg>
      );
    case "sql":
      return (
        <svg {...p}>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.3-4.3" />
        </svg>
      );
    case "frame":
      return (
        <svg {...p}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h5" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <path d="M20 15a2 2 0 0 1-2 2H8l-4 3V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
        </svg>
      );
  }
}
