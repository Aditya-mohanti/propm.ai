"use client";

import { useEffect, useRef, useState } from "react";
import {
  PROVIDER_LIST,
  PROVIDERS,
  SCOPES,
  checkKey,
  keyHint,
  type ProviderMeta,
} from "@/lib/providers";
import {
  useWorkspace,
  type ConnectMethod,
  type ProviderId,
} from "@/lib/workspace-context";
import { useAuth } from "@/lib/auth-context";
import { AlertIcon, CheckIcon, CrossIcon, KeyIcon } from "./icons";

type Step = "choose" | "review" | "key" | "connecting" | "error" | "done";

/** Provider marks are drawn rather than fetched, so nothing 404s offline. */
function ProviderMark({
  provider,
  size = 34,
}: {
  provider: ProviderMeta;
  size?: number;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `color-mix(in srgb, ${provider.tint} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${provider.tint} 30%, transparent)`,
        color: provider.tint,
      }}
    >
      {provider.id === "claude" ? (
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 3 4 20h3.4l1.6-3.7h6l1.6 3.7H20L12 3Zm-1.9 10.4L12 8.6l1.9 4.8h-3.8Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5v17M4.3 7.8l15.4 8.4M19.7 7.8 4.3 16.2" />
        </svg>
      )}
    </span>
  );
}

const ACCOUNT_STEPS = [
  "Looking for a signed-in account on this machine",
  "Checking the credential with the provider",
  "Reading which models your plan includes",
];

const KEY_STEPS = [
  "Checking the key format",
  "Calling the provider to verify it",
  "Reading your plan and model access",
];

/**
 * Mounted only while open, so every run of the flow starts from a clean slate
 * without an effect resetting state on the way in.
 */
export default function ConnectProviderDialog({
  onClose,
  initialProvider,
}: {
  onClose: () => void;
  initialProvider?: ProviderId;
}) {
  const { connect, connection } = useWorkspace();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>(initialProvider ? "review" : "choose");
  const [provider, setProvider] = useState<ProviderMeta>(
    PROVIDERS[initialProvider ?? "claude"],
  );
  const [method, setMethod] = useState<ConnectMethod>("oauth");
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [failure, setFailure] = useState("");

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Drop any in-flight handshake timers when the dialog unmounts.
  useEffect(() => clearTimers, []);

  // Escape closes, but not mid handshake: cancelling there would leave the
  // user unsure whether the grant went through.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "connecting") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  const steps = method === "oauth" ? ACCOUNT_STEPS : KEY_STEPS;

  function finish(m: ConnectMethod, hint?: string, models?: string[]) {
    connect({
      provider: provider.id,
      accountEmail: user?.email ?? "you@yourcompany.com",
      plan: m === "oauth" ? provider.oauthPlan : provider.apiKeyPlan,
      method: m,
      keyHint: hint,
      connectedAt: new Date().toISOString(),
      // Models the key can actually see, as reported by the provider.
      models: models && models.length > 0 ? models : provider.models,
    });
    setStep("done");
  }

  /**
   * Connects the user's own provider account. Nothing is sent: the server
   * checks whether a signed-in profile resolves on this machine, and if so
   * records that runs should use it.
   */
  async function connectAccount() {
    clearTimers();
    setMethod("oauth");
    setProgress(0);
    setStep("connecting");

    ACCOUNT_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setProgress(i + 1), 380 * (i + 1)));
    });

    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: provider.id, mode: "account" }),
      });
      const data = (await res.json()) as { models?: string[]; error?: string };
      clearTimers();

      if (!res.ok || data.error) {
        setFailure(data.error ?? `Could not use that account (${res.status}).`);
        setStep("error");
        return;
      }
      finish("oauth", undefined, data.models);
    } catch {
      clearTimers();
      setFailure("Could not reach the server. Is the dev server running?");
      setStep("error");
    }
  }

  /**
   * Hands the key to our own server, which verifies it against the provider
   * and stores it in an httpOnly cookie. Nothing here keeps the key: it lives
   * in this component only for as long as the request takes.
   */
  async function submitKey() {
    const shape = checkKey(provider, key);
    if (!shape.ok) {
      setKeyError(shape.message ?? "That key does not look right.");
      return;
    }

    clearTimers();
    setKeyError(null);
    setMethod("api-key");
    setProgress(0);
    setStep("connecting");

    // The steps advance on a timer purely as progress feedback; the request
    // below is what actually decides the outcome.
    KEY_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setProgress(i + 1), 380 * (i + 1)));
    });

    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: provider.id, apiKey: key }),
      });
      const data = (await res.json()) as {
        keyHint?: string;
        models?: string[];
        error?: string;
      };

      clearTimers();

      if (!res.ok || data.error) {
        setFailure(data.error ?? `The provider rejected that (${res.status}).`);
        setStep("error");
        return;
      }

      setKey("");
      finish("api-key", data.keyHint ?? keyHint(key), data.models);
    } catch {
      clearTimers();
      setFailure("Could not reach the server. Is the dev server running?");
      setStep("error");
    }
  }

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && step !== "connecting") onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(28, 25, 23, 0.55)",
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
        aria-label="Connect an AI provider"
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "auto",
          background: "var(--card)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          animation: "wsFadeUp 200ms var(--ease-out) both",
        }}
      >
        {/* Step 1 - pick a provider */}
        {step === "choose" && (
          <>
            <Header
              title="Connect an AI provider"
              sub="Agents, PRD drafting and prototyping run on your own account. Pick the one you already pay for."
              onClose={onClose}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PROVIDER_LIST.map((p) => {
                const selected = provider.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProvider(p)}
                    aria-pressed={selected}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: 14,
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: "var(--radius-lg)",
                      background: selected
                        ? "var(--brand-tint-bg)"
                        : "transparent",
                      border: `1px solid ${
                        selected ? "var(--brand-400)" : "var(--border)"
                      }`,
                      transition:
                        "border-color var(--duration-fast), background var(--duration-fast)",
                    }}
                  >
                    <ProviderMark provider={p} />
                    <span style={{ minWidth: 0 }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--fg1)",
                        }}
                      >
                        {p.name}
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 400,
                            color: "var(--fg3)",
                          }}
                        >
                          {p.company}
                        </span>
                      </span>
                      <span
                        style={{
                          display: "block",
                          marginTop: 3,
                          fontSize: 12.5,
                          lineHeight: 1.6,
                          color: "var(--fg2)",
                        }}
                      >
                        {p.blurb}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        marginLeft: "auto",
                        flex: "0 0 auto",
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `1.5px solid ${
                          selected ? "var(--brand-600)" : "var(--input)"
                        }`,
                        background: selected ? "var(--brand-600)" : "transparent",
                        color: "var(--white)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selected && <CheckIcon size={12} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <Footer>
              <button
                type="button"
                className="btn-ghost"
                style={BTN}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={BTN}
                onClick={() => setStep("review")}
              >
                Continue
              </button>
            </Footer>
          </>
        )}

        {/* Step 2 - what access is granted, and how to grant it */}
        {step === "review" && (
          <>
            <Header
              title={`Connect ${provider.name}`}
              sub={`${provider.company} - this workspace never stores a copy of your credentials on a server.`}
              onClose={onClose}
              mark={<ProviderMark provider={provider} size={30} />}
            />

            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <ScopeList
                label="This workspace will be able to"
                items={SCOPES.allowed}
                tone="allow"
              />
              <div style={{ height: 1, background: "var(--border)" }} />
              <ScopeList label="It will never" items={SCOPES.denied} tone="deny" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {provider.supportsAccount && (
                <>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ ...BTN, height: 40, justifyContent: "center" }}
                    onClick={() => void connectAccount()}
                  >
                    Use my {provider.name} account
                  </button>
                  <span
                    style={{
                      fontSize: 11.5,
                      lineHeight: 1.55,
                      color: "var(--fg3)",
                      textAlign: "center",
                    }}
                  >
                    Runs bill to the {provider.name} subscription you already
                    pay for. Requires being signed in on this machine with{" "}
                    <code style={{ fontFamily: "var(--font-mono)" }}>
                      ant auth login
                    </code>
                    .
                  </span>
                </>
              )}
              <button
                type="button"
                className={provider.supportsAccount ? "btn-ghost" : "btn-primary"}
                style={{ ...BTN, height: 40, justifyContent: "center", gap: 7 }}
                onClick={() => {
                  setMethod("api-key");
                  setStep("key");
                }}
              >
                <KeyIcon size={15} />
                {provider.supportsAccount
                  ? "Use an API key instead"
                  : "Connect with an API key"}
              </button>
              {provider.supportsAccount && (
                <span
                  style={{
                    fontSize: 11.5,
                    lineHeight: 1.55,
                    color: "var(--fg3)",
                    textAlign: "center",
                  }}
                >
                  An API key bills pay-as-you-go against API credits instead.
                </span>
              )}
            </div>

            <button type="button" onClick={() => setStep("choose")} style={LINK}>
              Pick a different provider
            </button>
          </>
        )}

        {/* Step 2b - API key */}
        {step === "key" && (
          <>
            <Header
              title={`Paste your ${provider.name} key`}
              sub="It is kept in this browser only, and is never sent anywhere except the provider."
              onClose={onClose}
              mark={<ProviderMark provider={provider} size={30} />}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="ws-key" style={{ fontSize: 12, color: "var(--fg2)" }}>
                API key
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="ws-key"
                  autoFocus
                  type={showKey ? "text" : "password"}
                  value={key}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder={provider.keyPlaceholder}
                  onChange={(e) => {
                    setKey(e.target.value);
                    if (keyError) setKeyError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void submitKey();
                  }}
                  aria-invalid={keyError ? true : undefined}
                  style={{
                    ...INPUT,
                    paddingRight: 64,
                    fontFamily: "var(--font-mono)",
                    borderColor: keyError ? "var(--red-800)" : "var(--input)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 6,
                    top: 6,
                    height: 26,
                    padding: "0 8px",
                    border: 0,
                    borderRadius: 5,
                    background: "transparent",
                    fontSize: 12,
                    color: "var(--fg2)",
                    cursor: "pointer",
                  }}
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>

              {keyError ? (
                <span
                  role="alert"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "var(--red-800)",
                  }}
                >
                  <AlertIcon size={13} />
                  {keyError}
                </span>
              ) : (
                <span style={{ fontSize: 12, color: "var(--fg3)" }}>
                  Starts with{" "}
                  <code style={{ fontFamily: "var(--font-mono)" }}>
                    {provider.keyPrefix}
                  </code>{" "}
                  &middot;{" "}
                  <a href={provider.docsUrl} target="_blank" rel="noreferrer">
                    where do I find this?
                  </a>
                </span>
              )}
            </div>

            <Footer>
              <button
                type="button"
                className="btn-ghost"
                style={BTN}
                onClick={() => setStep("review")}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                style={BTN}
                onClick={() => void submitKey()}
              >
                Connect
              </button>
            </Footer>
          </>
        )}

        {/* Step 3 - handshake */}
        {step === "connecting" && (
          <>
            <Header
              title={`Connecting to ${provider.name}`}
              sub="This takes a couple of seconds. Leave this window open."
              mark={<ProviderMark provider={provider} size={30} />}
            />

            <ol
              aria-live="polite"
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {steps.map((s, i) => {
                const done = i < progress;
                const active = i === progress;
                return (
                  <li
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 13,
                      color: done || active ? "var(--fg1)" : "var(--fg3)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 18,
                        height: 18,
                        flex: "0 0 18px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: done ? "var(--brand-700)" : "transparent",
                        border: `1.5px solid ${
                          done
                            ? "var(--brand-700)"
                            : active
                              ? "var(--brand-400)"
                              : "var(--input)"
                        }`,
                        color: "var(--white)",
                      }}
                    >
                      {done ? (
                        <CheckIcon size={11} />
                      ) : active ? (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--brand-500)",
                            animation: "wsPulse 1s ease-in-out infinite",
                          }}
                        />
                      ) : null}
                    </span>
                    {s}
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              onClick={() => {
                clearTimers();
                setFailure("You cancelled before the provider replied.");
                setStep("error");
              }}
              style={LINK}
            >
              Cancel
            </button>
          </>
        )}

        {/* Failure */}
        {step === "error" && (
          <>
            <Header
              title="That did not go through"
              sub={failure}
              onClose={onClose}
              mark={
                <span
                  style={{
                    ...MARK_BOX,
                    color: "var(--red-800)",
                    borderColor: "var(--red-800)",
                  }}
                >
                  <CrossIcon size={16} />
                </span>
              }
            />
            <Footer>
              <button
                type="button"
                className="btn-ghost"
                style={BTN}
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                style={BTN}
                onClick={() => setStep(method === "oauth" ? "review" : "key")}
              >
                Try again
              </button>
            </Footer>
          </>
        )}

        {/* Success */}
        {step === "done" && connection && (
          <>
            <Header
              title={`${provider.name} connected`}
              sub={`Runs are billed to your ${connection.plan} plan. Nothing is metered here.`}
              mark={
                <span
                  style={{
                    ...MARK_BOX,
                    color: "var(--green-700)",
                    borderColor: "var(--green-600)",
                  }}
                >
                  <CheckIcon size={16} />
                </span>
              }
            />

            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 9,
                fontSize: 13,
              }}
            >
              <Row k="Account" v={connection.accountEmail} />
              <Row k="Plan" v={connection.plan} />
              <Row
                k="Method"
                v={
                  connection.method === "oauth"
                    ? `Your ${provider.name} account`
                    : `API key ending ${connection.keyHint}`
                }
              />
              <Row k="Models" v={connection.models.join(", ")} />
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ ...BTN, height: 40, justifyContent: "center" }}
              onClick={onClose}
            >
              Start building
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── local pieces ── */

const BTN: React.CSSProperties = { height: 36, padding: "0 16px" };

const LINK: React.CSSProperties = {
  alignSelf: "center",
  border: 0,
  background: "transparent",
  fontSize: 12.5,
  color: "var(--fg2)",
  cursor: "pointer",
  padding: 4,
};

const INPUT: React.CSSProperties = {
  width: "100%",
  height: 38,
  padding: "0 10px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--input)",
  background: "var(--card)",
  color: "var(--fg1)",
  fontSize: 13,
};

const MARK_BOX: React.CSSProperties = {
  width: 30,
  height: 30,
  flex: "0 0 30px",
  borderRadius: 9,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid",
  background: "transparent",
};

function Header({
  title,
  sub,
  onClose,
  mark,
}: {
  title: string;
  sub: string;
  onClose?: () => void;
  mark?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      {mark}
      <div style={{ minWidth: 0 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--fg1)",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: "5px 0 0",
            fontSize: 12.5,
            lineHeight: 1.6,
            color: "var(--fg2)",
            textWrap: "pretty",
          }}
        >
          {sub}
        </p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            marginLeft: "auto",
            flex: "0 0 auto",
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
      )}
    </div>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 2,
      }}
    >
      {children}
    </div>
  );
}

function ScopeList({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "allow" | "deny";
}) {
  const color = tone === "allow" ? "var(--green-700)" : "var(--fg3)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{ fontSize: 11.5, color: "var(--fg3)", letterSpacing: "0.02em" }}
      >
        {label}
      </span>
      {items.map((t) => (
        <span
          key={t}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            fontSize: 12.5,
            lineHeight: 1.55,
            color: "var(--fg1)",
          }}
        >
          <span style={{ color, flex: "0 0 auto", marginTop: 1 }}>
            {tone === "allow" ? <CheckIcon size={13} /> : <CrossIcon size={13} />}
          </span>
          {t}
        </span>
      ))}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <span style={{ display: "flex", gap: 12 }}>
      <span style={{ flex: "0 0 74px", color: "var(--fg3)" }}>{k}</span>
      <span style={{ minWidth: 0, color: "var(--fg1)", wordBreak: "break-word" }}>
        {v}
      </span>
    </span>
  );
}
