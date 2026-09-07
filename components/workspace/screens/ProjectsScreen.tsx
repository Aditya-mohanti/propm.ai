"use client";

import { useWorkspace } from "@/lib/workspace-context";
import EmptyState from "../EmptyState";
import { FolderIcon, ArrowIcon } from "../icons";

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

export default function ProjectsScreen({
  onNewProject,
  onOpenProject,
}: {
  onNewProject: () => void;
  onOpenProject: (id: string) => void;
}) {
  const { projects, ready, runs } = useWorkspace();

  if (!ready) return <ProjectsSkeleton />;

  // The whole point of this branch: a freshly signed-in account has no
  // projects at all, and that has to read as a starting line rather than
  // a broken screen.
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderIcon size={22} />}
        title="No projects yet"
        body="A project holds one goal, its PRD, its decisions and everything your agents produce against it. Create the first one and the workspace fills in around it."
        actions={[{ label: "Start a project", onClick: onNewProject }]}
        footnote={
          <>
            Not sure where to begin? Name the outcome you are chasing — “cut
            checkout drop-off” — rather than the document you think you need.
          </>
        }
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {projects.map((p) => {
          const runCount = runs.filter((r) => r.projectId === p.id).length;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpenProject(p.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: 16,
                textAlign: "left",
                cursor: "pointer",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                animation: "wsFadeUp 260ms var(--ease-out) both",
                transition: "border-color var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--brand-300)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="tag tag-brand">{p.folder}</span>
                <span
                  style={{ marginLeft: "auto", fontSize: 12, color: "var(--fg3)" }}
                >
                  {relative(p.updatedAt)}
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--fg1)",
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "var(--fg2)",
                  }}
                >
                  {p.goal || "No goal set yet"}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  paddingTop: 10,
                  borderTop: "1px solid var(--border)",
                }}
              >
                {p.canvases.map((c) => (
                  <span
                    key={c.kind}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12.5,
                      color: "var(--fg2)",
                    }}
                  >
                    <span
                      className="mono-label"
                      style={{ flex: "0 0 66px", fontSize: 11 }}
                    >
                      {c.name}
                    </span>
                    <span style={{ color: "var(--fg3)" }}>{c.status}</span>
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "var(--fg3)",
                }}
              >
                {runCount === 0
                  ? "No runs yet"
                  : `${runCount} ${runCount === 1 ? "run" : "runs"}`}
                <span style={{ marginLeft: "auto", color: "var(--brand-600)" }}>
                  <ArrowIcon size={15} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
      }}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            height: 178,
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border)",
            background: "var(--muted)",
            animation: "wsPulse 1.4s ease-in-out infinite",
            animationDelay: `${i * 120}ms`,
          }}
        />
      ))}
    </div>
  );
}
