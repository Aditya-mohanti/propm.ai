"use client";

import { useAuth } from "@/lib/auth-context";

function GoogleMark({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l-.1.3 6.5 5 .5.1c4.1-3.8 6.6-9.4 6.6-15.7Z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.8 1.3-4.3 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-.3.02-6.7 5.2-.1.3C7.9 41.1 15.4 46 24 46Z"
      />
      <path
        fill="#FBBC05"
        d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4 0-1.5.3-3 .7-4.4v-.3l-6.8-5.3-.2.1A22 22 0 0 0 2 24c0 3.6.9 6.9 2.5 9.9l7-5.5Z"
      />
      <path
        fill="#EA4335"
        d="M24 10.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.3 29.9 2 24 2 15.4 2 7.9 6.9 4.5 14.1l7 5.5c1.8-5.3 6.7-9.1 12.5-9.1Z"
      />
    </svg>
  );
}

/**
 * Sign in with Google.
 *
 * A plain link rather than a fetch: the OAuth flow is a full-page redirect to
 * Google and back, which XHR cannot perform.
 */
export default function GoogleSignIn({
  label = "Join ProPM with Google",
  full = false,
}: {
  label?: string;
  full?: boolean;
}) {
  const { user } = useAuth();

  if (user) {
    return (
      <a
        href="/workspace"
        className="btn-primary"
        style={{
          height: 44,
          padding: "0 20px",
          width: full ? "100%" : undefined,
          justifyContent: "center",
        }}
      >
        Open your workspace →
      </a>
    );
  }

  return (
    <a
      href="/api/auth/google"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        height: 44,
        padding: "0 20px",
        width: full ? "100%" : undefined,
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--input)",
        background: "var(--white)",
        color: "var(--stone-900)",
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
        boxShadow: "var(--shadow-sm)",
        transition: "background var(--duration-fast)",
      }}
    >
      <GoogleMark />
      {label}
    </a>
  );
}
