"use client";

import { useEffect, useState } from "react";
import { CrossIcon } from "@/components/workspace/icons";

/**
 * Kept out of the source so the address is not sitting in a public repo for
 * scrapers to harvest. It still reaches the browser — NEXT_PUBLIC_* values are
 * inlined into the client bundle — so this hides it from the repository, not
 * from a determined visitor. Unset means the form is not offered at all,
 * mirroring how GOOGLE_CONFIGURED gates sign-in.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

/**
 * "Any queries?" — the contact form behind the header button.
 *
 * There is no mail provider wired into the app, so submitting hands the
 * message to the visitor's own mail client through a mailto: link rather
 * than posting it to a route that would silently drop it. The address is
 * shown and copyable too, for anyone whose browser has no mail handler.
 *
 * Mounted only while open, so the form is empty every time it appears.
 */
export default function QueriesDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the address is on screen to select by hand.
    }
  }

  function submit() {
    if (!message.trim()) {
      setError("Write your question first.");
      return;
    }
    const subject = `ProPM query${name.trim() ? ` from ${name.trim()}` : ""}`;
    const body = [
      message.trim(),
      "",
      "—",
      name.trim() ? `Name: ${name.trim()}` : null,
      from.trim() ? `Reply to: ${from.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 55,
        background: "rgba(8, 8, 16, 0.6)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 24,
        overflow: "auto",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Any queries"
        style={{
          width: "100%",
          maxWidth: 460,
          margin: "auto",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          animation: "wsFadeUp 200ms var(--ease-out) both",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Any queries?
            </h2>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: 12.5,
                lineHeight: 1.6,
                color: "var(--fg2)",
              }}
            >
              Ask anything about ProPM — it reaches the person building it, and
              you get a real answer back.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              marginLeft: "auto",
              width: 28,
              height: 28,
              border: 0,
              borderRadius: 6,
              background: "transparent",
              color: "var(--fg3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CrossIcon size={15} />
          </button>
        </div>

        {!CONTACT_EMAIL ? (
          <div
            style={{
              padding: 16,
              borderRadius: "var(--radius-lg)",
              border: "1px dashed var(--input)",
              background: "var(--muted)",
              fontSize: 12.5,
              lineHeight: 1.65,
              color: "var(--fg2)",
            }}
          >
            <strong style={{ color: "var(--fg1)" }}>
              No contact address is configured yet.
            </strong>
            <br />
            Set <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
              NEXT_PUBLIC_CONTACT_EMAIL
            </code>{" "}
            in <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
              .env.local
            </code>{" "}
            and restart the dev server.
          </div>
        ) : sent ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: 16,
              borderRadius: "var(--radius-lg)",
              background: "var(--brand-tint-bg)",
              border: "1px solid var(--brand-tint-border)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-900)" }}>
              Your mail app should be open.
            </span>
            <span style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--fg2)" }}>
              If nothing happened, send your question straight to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--brand-800)" }}>
                {CONTACT_EMAIL}
              </a>
              .
            </span>
          </div>
        ) : (
          <>
            <Field label="Your name (optional)">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aditya"
                style={INPUT}
              />
            </Field>

            <Field label="Your email (so you can be answered)">
              <input
                type="email"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="you@company.com"
                style={INPUT}
              />
            </Field>

            <Field label="Your question">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Does the PRD agent read my existing docs?"
                rows={4}
                aria-invalid={error ? true : undefined}
                style={{
                  ...INPUT,
                  height: "auto",
                  padding: 10,
                  lineHeight: 1.6,
                  resize: "vertical",
                  fontFamily: "inherit",
                  borderColor: error ? "var(--red-800)" : "var(--input)",
                }}
              />
              {error && (
                <span role="alert" style={{ fontSize: 12, color: "var(--red-800)" }}>
                  {error}
                </span>
              )}
            </Field>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                paddingTop: 2,
              }}
            >
              <span style={{ fontSize: 12, color: "var(--fg3)", marginRight: "auto" }}>
                or email {CONTACT_EMAIL}
              </span>
              <button
                type="button"
                className="btn-ghost"
                style={{ height: 36, padding: "0 14px" }}
                onClick={copyAddress}
              >
                {copied ? "Copied" : "Copy address"}
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ height: 36, padding: "0 16px" }}
                onClick={submit}
              >
                Send question
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const INPUT: React.CSSProperties = {
  width: "100%",
  height: 38,
  padding: "0 10px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--input)",
  background: "var(--muted)",
  color: "var(--fg1)",
  fontSize: 13,
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12, color: "var(--fg2)" }}>{label}</span>
      {children}
    </div>
  );
}
