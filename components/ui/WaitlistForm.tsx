"use client";

import { useEffect, useSyncExternalStore } from "react";
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

const AUTH_MESSAGES: Record<string, string> = {
  required: "Sign in to open your workspace.",
  unconfigured:
    "Google sign-in is not configured on this server yet. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
  denied: "Sign-in was cancelled.",
  state: "That sign-in link expired. Try again.",
  token: "Google would not complete the sign-in. Try again.",
  profile: "Could not read your Google profile.",
  unverified: "That Google account has no verified email address.",
  network: "Could not reach Google. Check your connection.",
};

/**
 * The ?auth=… code the server redirected back with, captured once.
 *
 * Cached at module scope so it survives the URL being tidied below — and read
 * through useSyncExternalStore rather than an effect, which keeps the value
 * stable across renders without a cascading setState.
 */
let cachedAuthCode: string | null | undefined;

function readAuthCode(): string | null {
  if (cachedAuthCode === undefined) {
    cachedAuthCode = new URLSearchParams(window.location.search).get("auth");
  }
  return cachedAuthCode;
}

const noopSubscribe = () => () => {};

/** Reads ?auth=… once so a failed or gated redirect explains itself. */
function useAuthNotice() {
  const code = useSyncExternalStore(noopSubscribe, readAuthCode, () => null);

  // Tidy the URL so a refresh does not re-show the message. No setState here,
  // so this stays a pure synchronisation with an external system.
  useEffect(() => {
    if (!code) return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("auth")) return;
    url.searchParams.delete("auth");
    window.history.replaceState({}, "", url.toString());
  }, [code]);

  if (!code) return null;
  return AUTH_MESSAGES[code] ?? "Sign-in did not complete.";
}

function Notice({ text }: { text: string }) {
  return (
    <div
      role="status"
      style={{
        padding: "9px 12px",
        border: "1px solid var(--brand-tint-border)",
        background: "var(--brand-tint-bg)",
        borderRadius: 6,
        fontSize: 12.5,
        lineHeight: 1.55,
        color: "var(--brand-900)",
      }}
    >
      {text}
    </div>
  );
}

export default function WaitlistForm({ variant = "hero" }: Props) {
  const notice = useAuthNotice();

  if (variant === "cta") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notice && <Notice text={notice} />}
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
      {notice && <Notice text={notice} />}
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
