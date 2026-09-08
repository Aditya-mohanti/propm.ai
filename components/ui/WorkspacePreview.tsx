/**
 * A picture of the thing you are signing into.
 *
 * Drawn rather than shipped as a bitmap: it stays sharp at every size,
 * costs no asset pipeline, and cannot drift from the real workspace the
 * way a stale screenshot does. Purely decorative — the sign-in copy beside
 * it carries the meaning, so the whole block is hidden from assistive tech.
 */
export default function WorkspacePreview() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        borderRadius: 14,
        padding: 16,
        background: "linear-gradient(155deg, #1e2133 0%, #191b2b 60%, #15172480 100%)",
        border: "1px solid rgba(233,233,237,0.10)",
        boxShadow:
          "0 26px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(145,132,217,0.08), 0 0 90px -30px rgba(145,132,217,0.45)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflow: "hidden",
      }}
    >
      {/* soft brand bloom behind the card */}
      <span
        style={{
          position: "absolute",
          top: -70,
          right: -50,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(145,132,217,0.28) 0%, rgba(145,132,217,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── header row: chip, title, ring ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 18,
              padding: "0 7px",
              borderRadius: 5,
              background: "#3a3360",
              color: "#ece9ff",
              fontSize: 10.5,
              fontWeight: 500,
            }}
          >
            Growth
          </span>
          <div
            style={{
              marginTop: 8,
              fontFamily: "var(--font-serif)",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#e9e9ed",
            }}
          >
            Increase user engagement
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: "#a3a6b8" }}>
            12% of weekly signups reach a second session
          </div>
        </div>

        <Ring />
      </div>

      {/* ── surface rail ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 3 }}>
        {[
          ["Research", true],
          ["PRD", true],
          ["Design", true],
          ["Data", false],
          ["Notes", true],
          ["Decisions", false],
        ].map(([label, on], i) => (
          <div
            key={label as string}
            style={{
              padding: "8px 7px 9px",
              borderRadius: 7,
              border: `1px solid ${i === 1 ? "rgba(145,132,217,0.32)" : "transparent"}`,
              background: i === 1 ? "rgba(145,132,217,0.14)" : "transparent",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", height: 8 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  flex: "0 0 6px",
                  borderRadius: "50%",
                  background: on ? "#9184d9" : "rgba(233,233,237,0.26)",
                }}
              />
              {i < 5 && (
                <span
                  style={{ flex: 1, height: 1, background: "rgba(233,233,237,0.10)" }}
                />
              )}
            </span>
            <div
              style={{
                marginTop: 5,
                fontFamily: "var(--font-serif)",
                fontSize: 10.5,
                fontWeight: 600,
                color: on ? "#e9e9ed" : "#7c7f92",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── the open surface ── */}
      <div
        style={{
          padding: 13,
          borderRadius: 9,
          background: "#1b1d2c",
          border: "1px solid rgba(233,233,237,0.10)",
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: 13,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.08em",
              color: "#a3a6b8",
            }}
          >
            SURFACE 02 · PRD
          </div>
          <div
            style={{
              marginTop: 7,
              fontFamily: "var(--font-serif)",
              fontSize: 14,
              fontWeight: 600,
              color: "#e9e9ed",
            }}
          >
            PRD
          </div>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 5 }}>
            {[100, 88, 64].map((w, i) => (
              <span
                key={i}
                style={{
                  height: 4,
                  width: `${w}%`,
                  borderRadius: 2,
                  background: "rgba(233,233,237,0.13)",
                }}
              />
            ))}
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginTop: 10,
              height: 24,
              padding: "0 10px",
              borderRadius: 5,
              border: "1px solid rgba(145,132,217,0.45)",
              color: "#d6d0fd",
              fontSize: 10.5,
              fontWeight: 500,
            }}
          >
            Open the spec
          </span>
        </div>

        <div style={{ paddingLeft: 13, borderLeft: "1px solid rgba(233,233,237,0.10)" }}>
          <div style={{ fontSize: 10, color: "#a3a6b8" }}>Inherits from this project</div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 7 }}>
            {["Research · segment sizing", "Decision · 15% CTA target", "Context · strategy.pdf"].map(
              (line) => (
                <span
                  key={line}
                  style={{
                    paddingLeft: 8,
                    borderLeft: "2px solid #4f4682",
                    fontSize: 10,
                    lineHeight: 1.4,
                    color: "#e9e9ed",
                  }}
                >
                  {line}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* ── agents ── */}
      <div style={{ display: "flex", gap: 7 }}>
        {[
          ["RA", "Research Agent", "idle"],
          ["PW", "PRD Writer", "ran 12m ago"],
          ["P", "Prototyper", "idle"],
        ].map(([initials, name, state]) => (
          <div
            key={name}
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 9px",
              borderRadius: 7,
              background: "#1e2133",
              border: "1px solid rgba(233,233,237,0.10)",
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                flex: "0 0 20px",
                borderRadius: 5,
                border: "1px solid #3a3360",
                background: "#24203a",
                color: "#d6d0fd",
                fontSize: 8.5,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {initials}
            </span>
            <span style={{ minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 10,
                  color: "#e9e9ed",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </span>
              <span style={{ display: "block", fontSize: 9, color: "#7c7f92" }}>
                {state}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Ring() {
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 52, height: 52, flex: "0 0 52px" }}>
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="rgba(233,233,237,0.12)"
          strokeWidth="4.5"
        />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="#9184d9"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={`${(c * 67) / 100} ${c}`}
          transform="rotate(-90 26 26)"
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-serif)",
          fontSize: 12,
          fontWeight: 600,
          color: "#e9e9ed",
        }}
      >
        4/6
      </span>
    </div>
  );
}
