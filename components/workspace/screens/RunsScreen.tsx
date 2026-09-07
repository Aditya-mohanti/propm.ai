"use client";

import { useWorkspace } from "@/lib/workspace-context";
import EmptyState from "../EmptyState";
import { ClockIcon } from "../icons";

function relative(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "recently";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

export default function RunsScreen({
  onGoToProjects,
  onConnect,
}: {
  onGoToProjects: () => void;
  onConnect: () => void;
}) {
  const { runs, projects, isConnected, ready } = useWorkspace();

  if (!ready) return <Skeleton />;

  if (runs.length === 0) {
    // Three different reasons the list can be empty, and each one deserves a
    // different next step rather than one generic shrug.
    if (!isConnected) {
      return (
        <EmptyState
          icon={<ClockIcon size={22} />}
          title="Nothing has run yet"
          body="Run history records every agent pass, what it touched and which model answered. It stays empty until a provider is connected."
          actions={[{ label: "Connect a provider", onClick: onConnect }]}
        />
      );
    }
    if (projects.length === 0) {
      return (
        <EmptyState
          icon={<ClockIcon size={22} />}
          title="Nothing has run yet"
          body="Agents run against a project. Create one, point an agent at it, and every pass lands here with the version it produced."
          actions={[{ label: "Start a project", onClick: onGoToProjects }]}
        />
      );
    }
    return (
      <EmptyState
        icon={<ClockIcon size={22} />}
        title="Nothing has run yet"
        body="Open a project and run an agent against it. Each pass is recorded here with the canvas it wrote and the model that answered, so you can always retrace a decision."
        actions={[{ label: "Open a project", onClick: onGoToProjects }]}
      />
    );
  }

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr) 100px 90px 120px",
          gap: 10,
          padding: "11px 16px",
          borderBottom: "1px solid var(--border)",
          fontSize: 11.5,
          color: "var(--fg3)",
        }}
      >
        <span>Run</span>
        <span>Agent</span>
        <span>Canvas</span>
        <span>When</span>
        <span style={{ textAlign: "right" }}>Model</span>
      </div>

      {runs.map((r) => (
        <div
          key={r.id}
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0,1.5fr) minmax(0,1fr) 100px 90px 120px",
            gap: 10,
            padding: "13px 16px",
            borderBottom: "1px solid var(--border)",
            alignItems: "center",
            fontSize: 13,
          }}
        >
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", color: "var(--fg1)" }}>
              {r.title}
            </span>
            <span style={{ display: "block", fontSize: 12, color: "var(--fg3)" }}>
              {r.projectName}
            </span>
          </span>
          <span style={{ color: "var(--fg2)" }}>{r.agent}</span>
          <span>
            <span className="tag tag-brand">{r.canvas}</span>
          </span>
          <span style={{ fontSize: 12, color: "var(--fg3)" }}>
            {relative(r.at)}
          </span>
          <span
            style={{ fontSize: 12, color: "var(--fg2)", textAlign: "right" }}
          >
            {r.model}
          </span>
        </div>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 200,
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        background: "var(--muted)",
        animation: "wsPulse 1.4s ease-in-out infinite",
      }}
    />
  );
}
