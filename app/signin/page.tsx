import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, GOOGLE_CONFIGURED } from "@/lib/server/session";
import { authMessage, isNeutral } from "@/lib/auth-messages";
import GoogleMark from "@/components/ui/GoogleMark";

export const metadata: Metadata = {
  title: "Sign in — ProPM",
  description: "Sign in to open your ProPM workspace.",
};

const INSIDE = [
  {
    title: "Projects with six surfaces",
    body: "Research, PRD, design, data, notes and decisions — all reading the same context.",
  },
  {
    title: "Agents you configure",
    body: "A niche, a set of skills, and the canvases each one is allowed to write.",
  },
  {
    title: "Chat on your own account",
    body: "Runs bill to the Claude subscription you already pay for, not to us.",
  },
];

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Already signed in? There is nothing to do on this page.
  const user = await getSession();
  if (user) redirect("/workspace");

  const params = await searchParams;
  const raw = params.auth;
  const code = Array.isArray(raw) ? raw[0] : raw;
  const message = authMessage(code);
  const neutral = isNeutral(code);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg1)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
      }}
    >
      <div className="signin-grid">
        {/* ── Sign-in ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 40px",
            minHeight: "100vh",
          }}
        >
          <div style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 40,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: "var(--brand-800)",
                  color: "var(--white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                P
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 19,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                ProPM
              </span>
            </Link>

            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Sign in
            </h1>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 14,
                lineHeight: 1.65,
                color: "var(--fg2)",
                textWrap: "pretty",
              }}
            >
              Your projects, agents and run history are tied to your account.
              One click and the workspace opens.
            </p>

            {message && (
              <div
                role="status"
                style={{
                  marginTop: 20,
                  padding: "11px 13px",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${
                    neutral ? "var(--brand-tint-border)" : "var(--amber-600)"
                  }`,
                  background: neutral ? "var(--brand-tint-bg)" : "var(--amber-50)",
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: neutral ? "var(--brand-900)" : "var(--amber-800)",
                }}
              >
                {message}
              </div>
            )}

            <div style={{ marginTop: 26 }}>
              {GOOGLE_CONFIGURED ? (
                <a
                  href="/api/auth/google"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    height: 46,
                    width: "100%",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--input)",
                    background: "var(--white)",
                    color: "var(--stone-900)",
                    fontSize: 14.5,
                    fontWeight: 500,
                    textDecoration: "none",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <GoogleMark size={18} />
                  Continue with Google
                </a>
              ) : (
                <div
                  style={{
                    padding: 16,
                    borderRadius: "var(--radius-md)",
                    border: "1px dashed var(--input)",
                    background: "var(--muted)",
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "var(--fg2)",
                  }}
                >
                  <strong style={{ color: "var(--fg1)" }}>
                    Google sign-in is not configured yet.
                  </strong>
                  <br />
                  Add <code style={mono}>GOOGLE_CLIENT_ID</code> and{" "}
                  <code style={mono}>GOOGLE_CLIENT_SECRET</code> to{" "}
                  <code style={mono}>.env.local</code>, then restart the dev
                  server. The redirect URI to register is{" "}
                  <code style={mono}>
                    http://localhost:3000/api/auth/google/callback
                  </code>
                  .
                </div>
              )}
            </div>

            <p
              style={{
                margin: "18px 0 0",
                fontSize: 12,
                lineHeight: 1.6,
                color: "var(--fg3)",
              }}
            >
              We use your Google account to sign you in and to name your
              workspace. Nothing is posted anywhere on your behalf. Free while
              in beta.
            </p>

            <p style={{ margin: "26px 0 0", fontSize: 13 }}>
              <Link href="/" style={{ color: "var(--fg2)" }}>
                ← Back to the site
              </Link>
            </p>
          </div>
        </div>

        {/* ── What is behind the door ── */}
        <aside
          className="signin-aside"
          style={{
            background: "#161826",
            color: "#e9e9ed",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: 400 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                letterSpacing: "0.1em",
                color: "#9184d9",
              }}
            >
              INSIDE THE WORKSPACE
            </span>
            <h2
              style={{
                margin: "14px 0 0",
                fontFamily: "var(--font-serif)",
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              The product team you wish you had.
            </h2>

            <div
              style={{
                marginTop: 30,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {INSIDE.map((item) => (
                <div
                  key={item.title}
                  style={{
                    paddingLeft: 14,
                    borderLeft: "2px solid rgba(145, 132, 217, 0.5)",
                  }}
                >
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>
                    {item.title}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: "#a3a6b8",
                    }}
                  >
                    {item.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  wordBreak: "break-all",
};
