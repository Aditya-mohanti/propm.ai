"use client";

import { useWorkspace, type CanvasKind } from "@/lib/workspace-context";
import EmptyState from "../EmptyState";
import {
  FolderIcon,
  DocIcon,
  PhoneIcon,
  SearchIcon,
  ChartIcon,
  NoteIcon,
  BranchIcon,
  ArrowIcon,
} from "../icons";

export interface HubOption {
  kind: CanvasKind;
  label: string;
  blurb: string;
  icon: React.ReactNode;
}

/**
 * The work a project can hold. Opening a project lands here rather than on any
 * one canvas: a project is a goal, and which surface you need first depends on
 * where the thinking currently is, not on a default we picked.
 */
export const HUB_OPTIONS: HubOption[] = [
  {
    kind: "research",
    label: "Research",
    blurb:
      "Market size, competitor teardowns and pricing. Start here when the problem is still fuzzy.",
    icon: <SearchIcon size={19} />,
  },
  {
    kind: "prd",
    label: "PRD",
    blurb:
      "The spec: problem, success criteria, scope cuts and open questions.",
    icon: <DocIcon size={19} />,
  },
  {
    kind: "prototype",
    label: "Design & prototyping",
    blurb:
      "Sketch screens and flows against the spec, so the two cannot drift apart.",
    icon: <PhoneIcon size={19} />,
  },
  {
    kind: "data",
    label: "Manage data",
    blurb:
      "Charts and BI views over your numbers — revenue, growth, funnels, retention.",
    icon: <ChartIcon size={19} />,
  },
  {
    kind: "notes",
    label: "Notes",
    blurb:
      "Loose thinking, call notes and anything not ready to be a document yet.",
    icon: <NoteIcon size={19} />,
  },
  {
    kind: "decisions",
    label: "Decisions",
    blurb:
      "What was decided, by whom, off which canvas, and what it ruled out.",
    icon: <BranchIcon size={19} />,
  },
];

export default function ProjectHubScreen({
  activeProjectId,
  onOpenCanvas,
  onGoToProjects,
}: {
  activeProjectId: string | null;
  onOpenCanvas: (kind: CanvasKind) => void;
  onGoToProjects: () => void;
}) {
  const { projects, runs, ready } = useWorkspace();

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

  if (!project) {
    return (
      <EmptyState
        icon={<FolderIcon size={22} />}
        title="No project open"
        body={
          projects.length === 0
            ? "There are no projects in this workspace yet. Create one and this becomes its home."
            : "Pick a project and this becomes its home — every surface it can hold, in one place."
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

  const projectRuns = runs.filter((r) => r.projectId === project.id).length;
  // Canvases the project has actually been used for, so the cards can show
  // real status rather than a uniform "Not started".
  const statusOf = (kind: CanvasKind) =>
    project.canvases.find((c) => c.kind === kind)?.status ?? "Not started";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          padding: 18,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <span className="tag tag-brand">{project.folder}</span>
          <h2
            style={{
              margin: "9px 0 0",
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
          >
            {project.name}
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--fg2)",
            }}
          >
            {project.goal || "No goal set yet."}
          </p>
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "var(--fg3)",
            whiteSpace: "nowrap",
          }}
        >
          {projectRuns === 0
            ? "No runs yet"
            : `${projectRuns} ${projectRuns === 1 ? "run" : "runs"}`}
        </span>
      </div>

      <div>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          What do you want to do?
        </h3>
        <p
          style={{
            margin: "4px 0 0",
            maxWidth: "62ch",
            fontSize: 13,
            lineHeight: 1.6,
            color: "var(--fg2)",
            textWrap: "pretty",
          }}
        >
          Every surface below shares this project&rsquo;s goal, context and
          decisions, so work done in one is visible to the rest.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(266px, 1fr))",
          gap: 12,
        }}
      >
        {HUB_OPTIONS.map((opt, i) => {
          const status = statusOf(opt.kind);
          const started = status !== "Not started";
          return (
            <button
              key={opt.kind}
              type="button"
              onClick={() => onOpenCanvas(opt.kind)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 9,
                padding: 16,
                textAlign: "left",
                cursor: "pointer",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                animation: "wsFadeUp 260ms var(--ease-out) both",
                animationDelay: `${i * 35}ms`,
                transition: "border-color var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--brand-300)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 34,
                    height: 34,
                    flex: "0 0 34px",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--brand-tint-bg)",
                    border: "1px solid var(--brand-tint-border)",
                    color: "var(--brand-700)",
                  }}
                >
                  {opt.icon}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--fg1)",
                  }}
                >
                  {opt.label}
                </span>
                <span
                  aria-hidden="true"
                  style={{ marginLeft: "auto", color: "var(--brand-600)" }}
                >
                  <ArrowIcon size={15} />
                </span>
              </span>

              <span
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  color: "var(--fg2)",
                }}
              >
                {opt.blurb}
              </span>

              <span
                style={{
                  marginTop: 2,
                  paddingTop: 9,
                  borderTop: "1px solid var(--border)",
                  fontSize: 11.5,
                  color: started ? "var(--brand-700)" : "var(--fg3)",
                }}
              >
                {status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
