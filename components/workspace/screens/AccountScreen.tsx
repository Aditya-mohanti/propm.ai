"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useWorkspace } from "@/lib/workspace-context";
import { PROVIDERS } from "@/lib/providers";
import EmptyState from "../EmptyState";
import { PlugIcon, CheckIcon } from "../icons";

export default function AccountScreen({
  onConnect,
}: {
  onConnect: () => void;
}) {
  const { user } = useAuth();
  const { connection, disconnect, runs, projects, ready } = useWorkspace();
  const [confirming, setConfirming] = useState(false);

  if (!ready) return <Skeleton />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Who you are signed in as */}
      <Panel title="Signed in as">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 34,
              height: 34,
              flex: "0 0 34px",
              borderRadius: 9,
              background: "var(--brand-100)",
              border: "1px solid var(--brand-200)",
              color: "var(--brand-900)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {(user?.name ?? "?").slice(0, 1).toUpperCase()}
          </span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 14, color: "var(--fg1)" }}>
              {user?.name ?? "Not signed in"}
            </span>
            <span style={{ display: "block", fontSize: 12.5, color: "var(--fg3)" }}>
              {user?.email ?? "—"}
            </span>
          </span>
        </div>
      </Panel>

      {/* The provider connection */}
      {connection ? (
        <Panel title="AI provider">
          {(() => {
            const meta = PROVIDERS[connection.provider];
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      flex: "0 0 32px",
                      borderRadius: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `color-mix(in srgb, ${meta.tint} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${meta.tint} 30%, transparent)`,
                      color: meta.tint,
                    }}
                  >
                    <CheckIcon size={16} />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {meta.name}
                      <span className="tag tag-brand">{connection.plan}</span>
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 12.5,
                        color: "var(--fg3)",
                      }}
                    >
                      {connection.method === "oauth"
                        ? `Authorised as ${connection.accountEmail}`
                        : `API key ending ${connection.keyHint}`}
                    </span>
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    paddingTop: 12,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {connection.models.map((m) => (
                    <span key={m} className="tag tag-brand">
                      {m}
                    </span>
                  ))}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: "var(--fg2)",
                  }}
                >
                  Every run is billed to this plan. This workspace stores no key
                  on a server and meters nothing of its own.
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ height: 34, padding: "0 14px" }}
                    onClick={onConnect}
                  >
                    Switch provider
                  </button>
                  {confirming ? (
                    <>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ height: 34, padding: "0 14px" }}
                        onClick={() => {
                          // Clear the server-side credential too, not just the
                          // local flag, or the key would outlive the UI state.
                          void fetch(
                            `/api/connect?provider=${connection.provider}`,
                            { method: "DELETE" },
                          ).catch(() => {});
                          disconnect();
                          setConfirming(false);
                        }}
                      >
                        Yes, disconnect
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ height: 34, padding: "0 14px" }}
                        onClick={() => setConfirming(false)}
                      >
                        Keep it
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ height: 34, padding: "0 14px" }}
                      onClick={() => setConfirming(true)}
                    >
                      Disconnect
                    </button>
                  )}
                </div>

                {confirming && (
                  <p
                    role="alert"
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      color: "var(--fg2)",
                    }}
                  >
                    Disconnecting stops all agent runs. Your projects, agents and
                    run history stay exactly as they are.
                  </p>
                )}
              </div>
            );
          })()}
        </Panel>
      ) : (
        <EmptyState
          size="compact"
          icon={<PlugIcon size={20} />}
          title="No AI provider connected"
          body="Agents, PRD drafting and prototyping run on your own Claude or ChatGPT account. Connect one and the rest of the workspace comes alive."
          actions={[{ label: "Connect a provider", onClick: onConnect }]}
          footnote="Your credentials stay in this browser. Nothing is sent to a server we run."
        />
      )}

      {/* Usage */}
      <Panel title="Usage">
        {runs.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: "var(--fg2)" }}>
            No runs recorded yet across {projects.length}{" "}
            {projects.length === 1 ? "project" : "projects"}.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {["PRD", "Prototype", "Doc", "Model"].map((canvas) => {
              const n = runs.filter((r) => r.canvas === canvas).length;
              const pct = Math.round((n / Math.max(1, runs.length)) * 100);
              return (
                <div
                  key={canvas}
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12.5,
                      color: "var(--fg2)",
                    }}
                  >
                    <span>{canvas}</span>
                    <span style={{ color: "var(--fg3)" }}>
                      {n} {n === 1 ? "run" : "runs"}
                    </span>
                  </span>
                  <span
                    style={{
                      display: "block",
                      height: 4,
                      borderRadius: 2,
                      background: "var(--track)",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: 4,
                        width: `${pct}%`,
                        background: "var(--brand-500)",
                      }}
                    />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2 className="mono-label" style={{ margin: 0, fontSize: 11.5 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Skeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 240,
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        background: "var(--muted)",
        animation: "wsPulse 1.4s ease-in-out infinite",
      }}
    />
  );
}
