"use client";

import GoogleSignIn from "./GoogleSignIn";

interface Props {
  variant?: "hero" | "cta";
}

/**
 * Joining ProPM.
 *
 * This used to be an email capture that signed you in locally with no
 * verification of any kind. Signing in is now a real Google handshake, so
 * this is the entry point to that rather than a form.
 */

export default function WaitlistForm({ variant = "hero" }: Props) {

  if (variant === "cta") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <GoogleSignIn full />
        <div style={{ fontSize: 12, lineHeight: "16px", color: "var(--fg2)" }}>
          We use your Google account to sign you in and to name your workspace.
          Nothing is posted anywhere on your behalf.{" "}
          <a
            href="#privacy"
            style={{ color: "var(--fg2)", textDecoration: "underline" }}
          >
            Privacy
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 500,
        marginTop: 8,
      }}
    >
      <div>
        <GoogleSignIn />
      </div>
      <div style={{ fontSize: 12, lineHeight: "16px", color: "var(--fg2)" }}>
        Free while in beta. Your workspace opens straight after sign-in.{" "}
        <a
          href="#privacy"
          style={{ color: "var(--fg2)", textDecoration: "underline" }}
        >
          Privacy
        </a>
      </div>
    </div>
  );
}
