"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useWorkspace } from "@/lib/workspace-context";
import { demoWorkspace, DEV_USER } from "@/lib/dev-seed";

/**
 * Local design harness.
 *
 * Sign-in is a client-side flag with no backend behind it, so there is nothing
 * real to bypass — this just sets the flag directly and lets you flip the
 * workspace between its empty and populated states without re-entering data
 * after every reset.
 *
 * Rendered only when NODE_ENV is "development". `process.env.NODE_ENV` is
 * inlined at build time, so the whole component is dead code in a production
 * bundle and cannot be reached by a visitor.
 */
export const DEV_TOOLS_ENABLED = process.env.NODE_ENV === "development";

export default function DevBar() {
  const { user, signIn, signOut } = useAuth();
  const { projects, isConnected, replaceAll, reset, disconnect } =
    useWorkspace();
  const [open, setOpen] = useState(false);

  if (!DEV_TOOLS_ENABLED) return null;

  const populated = projects.length > 0;

  return (
    <div
      style={{
        position: "fixed",
        left: 14,
        bottom: 14,
        zIndex: 70,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        fontFamily: "var(--font-sans)",
      }}
    >
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 12,
            minWidth: 216,
            borderRadius: "var(--radius-lg)",
            background: "var(--stone-900)",
            color: "var(--stone-100)",
            boxShadow: "var(--shadow-lg)",
            animation: "wsFadeUp 160ms var(--ease-out) both",
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              letterSpacing: "0.09em",
              color: "var(--stone-400)",
            }}
          >
            DEV TOOLS
          </span>

          <Line label="Signed in" value={user ? user.email : "no"} />
          <Line label="Projects" value={String(projects.length)} />
          <Line label="Provider" value={isConnected ? "connected" : "none"} />

          <div style={{ height: 1, background: "var(--stone-700)", margin: "2px 0" }} />

          {user ? (
            <DevButton onClick={signOut}>Sign out</DevButton>
          ) : (
            <DevButton primary onClick={() => signIn(DEV_USER)}>
              Sign in as test user
            </DevButton>
          )}

          <DevButton
            onClick={() => {
              if (!user) signIn(DEV_USER);
              replaceAll(demoWorkspace());
            }}
          >
            {populated ? "Re-seed demo data" : "Seed demo data"}
          </DevButton>

          <DevButton onClick={reset} disabled={!populated && !isConnected}>
            Empty the workspace
          </DevButton>

          <DevButton onClick={disconnect} disabled={!isConnected}>
            Disconnect provider
          </DevButton>

          <span
            style={{
              marginTop: 2,
              fontSize: 10.5,
              lineHeight: 1.5,
              color: "var(--stone-500)",
            }}
          >
            Development build only. Stripped from production.
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          height: 30,
          padding: "0 11px",
          border: 0,
          borderRadius: 999,
          background: "var(--stone-900)",
          color: "var(--stone-100)",
          fontSize: 12,
          fontFamily: "inherit",
          cursor: "pointer",
          boxShadow: "var(--shadow-default)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: user ? "var(--green-600)" : "var(--brand-400)",
          }}
        />
        dev
      </button>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ display: "flex", gap: 10, fontSize: 11.5 }}>
      <span style={{ flex: "0 0 62px", color: "var(--stone-500)" }}>
        {label}
      </span>
      <span
        style={{
          minWidth: 0,
          color: "var(--stone-200)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </span>
  );
}

function DevButton({
  children,
  onClick,
  primary,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 29,
        padding: "0 10px",
        width: "100%",
        textAlign: "left",
        borderRadius: "var(--radius-md)",
        border: `1px solid ${primary ? "var(--brand-500)" : "var(--stone-700)"}`,
        background: primary ? "var(--brand-700)" : "transparent",
        color: disabled ? "var(--stone-600)" : "var(--stone-100)",
        fontSize: 12,
        fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {children}
    </button>
  );
}
