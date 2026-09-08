"use client";

import { useState } from "react";
import { useWorkspace, type CanvasKind } from "@/lib/workspace-context";
import { projectOverview } from "../surfaces";
import EmptyState from "../EmptyState";
import { FolderIcon } from "../icons";
import ProjectOverviewA from "./ProjectOverviewA";
import ProjectOverviewB from "./ProjectOverviewB";

type Variant = "a" | "b";

const VARIANTS: { id: Variant; label: string }[] = [
  { id: "a", label: "Digest" },
  { id: "b", label: "Rail" },
];

/**
 * Project overview.
 *
 * Two layouts are live behind a toggle so they can be compared against real
 * data rather than in the abstract. Both read the same derived model, so
 * whichever wins, the other is a single delete.
 */
export default function ProjectHubScreen({
  activeProjectId,
  onOpenCanvas,
  onGoToProjects,
}: {
  activeProjectId: string | null;
  onOpenCanvas: (kind: CanvasKind) => void;
  onGoToProjects: () => void;
}) {
  const { projects, agents, runs, ready } = useWorkspace();
  const [variant, setVariant] = useState<Variant>("a");

  if (!ready) {
    return (
      <div
        aria-hidden="true"
        style={{
          height: 300,
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border)",
          background: "var(--muted)",
          animation: "wsPulse 1.4s ease-in-out infinite",
        }}
      />
    );
  }

  const project = projects.find((p) => p.id === activeProjectId) ?? null;

  if (!project) {
    return (
      <EmptyState
        icon={<FolderIcon size={22} />}
        title="No project open"
        body={
          projects.length === 0
            ? "There are no projects in this workspace yet. Create one and this becomes its home."
            : "Pick a project and this becomes its home — every surface it holds, what has been decided, and what should happen next."
        }
        actions={[
          {
            label:
              projects.length === 0 ? "Start a project" : "Choose a project",
            onClick: onGoToProjects,
          },
        ]}
      />
    );
  }

  const data = projectOverview(project, agents, runs);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          alignSelf: "flex-end",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--fg3)" }}>Layout</span>
        <div
          role="group"
          aria-label="Overview layout"
          style={{
            display: "inline-flex",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          {VARIANTS.map((v) => {
            const on = variant === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariant(v.id)}
                aria-pressed={on}
                style={{
                  height: 30,
                  padding: "0 13px",
                  border: 0,
                  background: on ? "var(--brand-tint-bg)" : "transparent",
                  color: on ? "var(--brand-800)" : "var(--fg2)",
                  boxShadow: on ? "inset 0 0 0 1px var(--brand-300)" : "none",
                  fontSize: 12.5,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {variant === "a" ? (
        <ProjectOverviewA
          project={project}
          data={data}
          onOpenCanvas={onOpenCanvas}
        />
      ) : (
        <ProjectOverviewB
          project={project}
          data={data}
          onOpenCanvas={onOpenCanvas}
        />
      )}
    </div>
  );
}
