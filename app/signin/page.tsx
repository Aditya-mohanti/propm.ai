import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, GOOGLE_CONFIGURED } from "@/lib/server/session";
import { authMessage, isNeutral } from "@/lib/auth-messages";
import GoogleMark from "@/components/ui/GoogleMark";
import ToolOrbit from "@/components/ui/ToolOrbit";
import Logo from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Sign in — ProPM",
  description: "Sign in to open your ProPM workspace.",
};

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
            position: "relative",
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
                position: "absolute",
                top: 32,
                left: 40,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Logo size={24} />
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                ProPM
              </span>
            </Link>

            {/* Badge on a faint grid — the visual anchor above the form. */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
                marginBottom: 4,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(145,132,217,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(145,132,217,0.10) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                  maskImage:
                    "radial-gradient(circle at 50% 50%, #000 5%, transparent 68%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at 50% 50%, #000 5%, transparent 68%)",
                }}
              />
              <span
                style={{
                  position: "relative",
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(150deg, #8d80de 0%, #6f62b4 100%)",
                  boxShadow:
                    "0 0 0 8px rgba(145,132,217,0.10), 0 14px 30px rgba(0,0,0,0.45)",
                  color: "#fff",
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5M15 12H3" />
                </svg>
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                textAlign: "center",
                fontFamily: "var(--font-serif)",
                fontSize: 27,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Sign in to your workspace
            </h1>
            <p
              style={{
                margin: "10px 0 0",
                textAlign: "center",
                fontSize: 13.5,
                lineHeight: 1.65,
                color: "var(--fg2)",
                textWrap: "pretty",
              }}
            >
              Your projects, agents and run history are tied to your account.
              One click and it opens.
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
                    height: 50,
                    width: "100%",
                    borderRadius: 10,
                    border: "1px solid var(--input)",
                    background: "var(--white)",
                    color: "var(--stone-900)",
                    fontSize: 14.5,
                    fontWeight: 500,
                    textDecoration: "none",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
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
                textAlign: "center",
                fontSize: 12,
                lineHeight: 1.6,
                color: "var(--fg3)",
              }}
            >
              We use your Google account to sign you in and to name your
              workspace. Nothing is posted anywhere on your behalf. Free while
              in beta.
            </p>

            <p style={{ margin: "26px 0 0", textAlign: "center", fontSize: 13 }}>
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
            background:
              "radial-gradient(120% 90% at 50% 0%, #221f3a 0%, #191b2b 45%, #141623 100%)",
            color: "#e9e9ed",
            padding: "56px 44px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <h2
            style={{
              margin: 0,
              textAlign: "center",
              fontFamily: "var(--font-serif)",
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              textWrap: "balance",
            }}
          >
            Six tools,{" "}
            <span style={{ color: "#bdb3f4" }}>one workspace</span>
          </h2>
          <p
            style={{
              margin: "10px 0 0",
              maxWidth: "42ch",
              textAlign: "center",
              fontSize: 13.5,
              lineHeight: 1.65,
              color: "#a3a6b8",
              textWrap: "pretty",
            }}
          >
            Docs, sheets, SQL, research, prototypes and chat — collapsed into
            one surface your agents already share the context of.
          </p>

          <div style={{ width: "100%", marginTop: 18 }}>
            <ToolOrbit />
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
