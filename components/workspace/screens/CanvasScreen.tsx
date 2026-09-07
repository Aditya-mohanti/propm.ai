"use client";

import { useWorkspace, type CanvasKind } from "@/lib/workspace-context";
import EmptyState from "../EmptyState";
import { DocIcon, BranchIcon, PhoneIcon, FolderIcon } from "../icons";

interface CanvasCopy {
  label: string;
  icon: React.ReactNode;
  /** Shown when a project is open but the canvas has nothing in it. */
  emptyTitle: string;
  emptyBody: string;
  cta: string;
}

const COPY: Record<CanvasKind, CanvasCopy> = {
  prd: {
    label: "PRD",
    icon: <DocIcon size={22} />,
    emptyTitle: "This PRD is blank",
    emptyBody:
      "Start with the problem in one paragraph and what success looks like in three lines. An agent can take it from there, and every edit you make afterwards is kept.",
    cta: "Draft the first section",
  },
  decisions: {
    label: "Decisions",
    icon: <BranchIcon size={22} />,
    emptyTitle: "No decisions logged",
    emptyBody:
      "Record what was decided, who decided it, which canvas it came off and what it ruled out. Six weeks from now this is the only record of why the product looks like this.",
    cta: "Log a decision",
  },
  prototype: {
    label: "Prototype",
    icon: <PhoneIcon size={22} />,
    emptyTitle: "No screens yet",
    emptyBody:
      "Describe a screen in a sentence and it gets drawn against this project's PRD and decisions, so the prototype and the spec cannot drift apart.",
    cta: "Describe the first screen",
  },
  model: {
    label: "Model",
    icon: <DocIcon size={22} />,
    emptyTitle: "Nothing fitted yet",
    emptyBody:
      "Point this at a table, pick the column you want predicted, and it fits and scores a small model with the split shown.",
    cta: "Choose a dataset",
  },
  sheet: {
    label: "Sheet",
    icon: <DocIcon size={22} />,
    emptyTitle: "This sheet is empty",
    emptyBody:
      "Sheets hold the numbers behind a decision — sizing, pricing, funnel maths — so an agent can cite a cell rather than a guess.",
    cta: "Add the first column",
  },
};

export default function CanvasScreen({
  kind,
  activeProjectId,
  onGoToProjects,
  onAction,
}: {
  kind: CanvasKind;
  activeProjectId: string | null;
  onGoToProjects: () => void;
  onAction?: () => void;
}) {
  const { projects, ready } = useWorkspace();
  const copy = COPY[kind];

  if (!ready) {
    return (
      <div
        aria-hidden="true"
        style={{
          height: 260,
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border)",
          background: "var(--muted)",
          animation: "wsPulse 1.4s ease-in-out infinite",
        }}
      />
    );
  }

  const project = projects.find((p) => p.id === activeProjectId) ?? null;

  // No project open at all — the canvas has no subject, so send them back
  // rather than showing an empty document with nothing behind it.
  if (!project) {
    return (
      <EmptyState
        icon={<FolderIcon size={22} />}
        title={`Open a project to use the ${copy.label.toLowerCase()}`}
        body={
          projects.length === 0
            ? "Canvases belong to a project. There are no projects in this workspace yet, so there is nothing for this one to describe."
            : "Every canvas belongs to one project, so it can pull that project's goal, context and decisions. Pick one to continue."
        }
        actions={[
          {
            label: projects.length === 0 ? "Start a project" : "Choose a project",
            onClick: onGoToProjects,
          },
        ]}
      />
    );
  }

  return (
    <EmptyState
      icon={copy.icon}
      title={copy.emptyTitle}
      body={copy.emptyBody}
      actions={onAction ? [{ label: copy.cta, onClick: onAction }] : []}
      footnote={
        <>
          Working inside <strong style={{ color: "var(--fg2)" }}>{project.name}</strong>
          {project.goal ? ` — ${project.goal}` : ""}
        </>
      }
    />
  );
}
