"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import GoogleMark from "./GoogleMark";

/**
 * Entry point to signing in.
 *
 * Sends people to the dedicated /signin screen rather than straight to
 * Google: the screen explains what they are signing into, and can say
 * something useful when Google is not configured or an attempt failed.
 */
export default function GoogleSignIn({
  label = "Join ProPM",
  full = false,
}: {
  label?: string;
  full?: boolean;
}) {
  const { user } = useAuth();

  const style: React.CSSProperties = {
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
  };

  if (user) {
    return (
      <Link
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
      </Link>
    );
  }

  return (
    <Link href="/signin" style={style}>
      <GoogleMark />
      {label}
    </Link>
  );
}
