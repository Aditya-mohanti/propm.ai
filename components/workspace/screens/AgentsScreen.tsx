"use client";

import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { PROVIDERS } from "@/lib/providers";
import EmptyState from "../EmptyState";
import { RobotIcon } from "../icons";

const NICHES = [
  "Market research",
  "Go-to-market",
  "Data & analytics",
  "Design & specs",
];

export default function AgentsScreen({
  onConnect,
}: {
  onConnect: () => void;
}) {
  const { agents, skills, createAgent, connection, ready } = useWorkspace();
  const [building, setBuilding] = useState(false);
  const [name, setName] = useState("");
  const [niche, setNiche] = useState(NICHES[0]);
  const [brief, setBrief] = useState("");
  const [error, setError] = useState<string | null>(null);

  const models = connection ? connection.models : PROVIDERS.claude.models;

  // The picked model is held loosely: connecting a different provider swaps
  // the whole list, and a value that is no longer on offer would render the
  // select blank. Fall back to the first available instead.
  const [picked, setPicked] = useState<string | null>(null);
  const model = picked && models.includes(picked) ? picked : models[0];

  if (!ready) return <Skeleton />;

  function submit() {
    if (!name.trim()) {
      setError("Name the agent first.");
      return;
    }
    createAgent({
      name: name.trim(),
      niche,
      brief: brief.trim(),
      skillIds: [],
      model,
      canvases: ["Doc"],
    });
    setName("");
    setBrief("");
    setError(null);
    setBuilding(false);
  }

  if (agents.length === 0 && !building) {
    return (
      <EmptyState
        icon={<RobotIcon size={22} />}
        title="No agents yet"
        body="An agent is a niche, a set of skills and the canvases it is allowed to write. Build one and it becomes available to every project in this workspace."
        actions={[
          { label: "Build an agent", onClick: () => setBuilding(true) },
          ...(connection
            ? []
            : [
                {
                  label: "Connect a provider",
                  onClick: onConnect,
                  variant: "ghost" as const,
                },
              ]),
        ]}
        footnote={
          connection
            ? `Runs will use your ${PROVIDERS[connection.provider].name} connection.`
            : "You can build agents now, but they cannot run until a provider is connected."
        }
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {building && (
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            animation: "wsFadeUp 220ms var(--ease-out) both",
          }}
        >
          <Field label="Agent name">
            <input
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Research Agent"
              style={{
                ...INPUT,
                borderColor: error ? "var(--red-800)" : "var(--input)",
              }}
            />
            {error && (
              <span role="alert" style={{ fontSize: 12, color: "var(--red-800)" }}>
                {error}
              </span>
            )}
          </Field>

          <Field label="Niche">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {NICHES.map((n) => {
                const on = niche === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNiche(n)}
                    aria-pressed={on}
                    style={chip(on)}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="What it does">
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={3}
              placeholder="Pulls market size and competitor packaging for a named category, and reports what it could not verify."
              style={{ ...INPUT, height: "auto", padding: 10, resize: "vertical" }}
            />
          </Field>

          <Field label="Model">
            <select
              value={model}
              onChange={(e) => setPicked(e.target.value)}
              style={INPUT}
            >
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              className="btn-ghost"
              style={{ height: 36, padding: "0 16px" }}
              onClick={() => {
                setBuilding(false);
                setError(null);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ height: 36, padding: "0 16px" }}
              onClick={submit}
            >
              Create agent
            </button>
          </div>
        </div>
      )}

      {agents.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "var(--fg2)" }}>
              {agents.length} {agents.length === 1 ? "agent" : "agents"}
              {skills.length > 0 && ` · ${skills.length} skills available`}
            </span>
            {!building && (
              <button
                type="button"
                className="btn-ghost"
                style={{ marginLeft: "auto", height: 32, padding: "0 14px" }}
                onClick={() => setBuilding(true)}
              >
                Build an agent
              </button>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {agents.map((a) => (
              <div
                key={a.id}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xl)",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  animation: "wsFadeUp 260ms var(--ease-out) both",
                }}
              >
                <span className="mono-label" style={{ fontSize: 11 }}>
                  {a.niche}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {a.name}
                </span>
                <span
                  style={{ fontSize: 13, lineHeight: 1.55, color: "var(--fg2)" }}
                >
                  {a.brief || "No description yet."}
                </span>
                <span
                  style={{
                    marginTop: 4,
                    paddingTop: 10,
                    borderTop: "1px solid var(--border)",
                    fontSize: 12,
                    color: "var(--fg3)",
                  }}
                >
                  {a.model}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const INPUT: React.CSSProperties = {
  width: "100%",
  height: 38,
  padding: "0 10px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--input)",
  background: "var(--card)",
  color: "var(--fg1)",
  fontSize: 13,
  fontFamily: "var(--font-sans)",
};

function chip(on: boolean): React.CSSProperties {
  return {
    height: 30,
    padding: "0 12px",
    borderRadius: "var(--radius-md)",
    fontSize: 12.5,
    cursor: "pointer",
    border: `1px solid ${on ? "var(--brand-400)" : "var(--border)"}`,
    background: on ? "var(--brand-tint-bg)" : "transparent",
    color: on ? "var(--brand-800)" : "var(--fg2)",
  };
}

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

function Skeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 220,
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        background: "var(--muted)",
        animation: "wsPulse 1.4s ease-in-out infinite",
      }}
    />
  );
}
