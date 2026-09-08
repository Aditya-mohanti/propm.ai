"use client";

import { useWorkspace, type Project } from "@/lib/workspace-context";
import { relative } from "@/lib/format";
import { RobotIcon, CrossIcon } from "./icons";

/**
 * The right-hand panel: what this project knows, who works on it, what moved.
 *
 * The shelf is the reason the panel exists. It is per project, not per thread,
 * so it answers the question the sidebar raises — if these are separate
 * conversations, what keeps them consistent?
 */
export default function ContextPanel({
  project,
  onToast,
}: {
  project: Project;
  onToast?: (message: string) => void;
}) {
  const { agents, runs, removeFromShelf } = useWorkspace();

  const shelf = project.shelf ?? [];
  const projectAgents = agents.filter((a) => project.agentIds.includes(a.id));
  const activity = runs.filter((r) => r.projectId === project.id).slice(0, 6);

  return (
    <aside
      style={{
        width: 288,
        flex: "0 0 288px",
        borderLeft: "1px solid var(--border)",
        overflowY: "auto",
        padding: "17px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* ── Shelf ── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span className="mono-label" style={{ fontSize: 10, letterSpacing: "0.09em" }}>
            PROJECT CONTEXT SHELF
          </span>
          <span
            style={{
              marginLeft: "auto",
              flex: "0 0 auto",
              fontSize: 11,
              color: "var(--fg3)",
            }}
          >
            {shelf.length} {shelf.length === 1 ? "item" : "items"}
          </span>
        </div>

        {shelf.length === 0 ? (
          <p
            style={{
              margin: 0,
              padding: 12,
              border: "1px dashed var(--input)",
              borderRadius: "var(--radius-lg)",
              fontSize: 12,
              lineHeight: 1.6,
              color: "var(--fg3)",
            }}
          >
            Nothing on the shelf yet. Promote an answer out of a chat and every
            thread in this project starts reading it.
          </p>
        ) : (
          shelf.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "9px 10px",
                border: `1px solid ${
                  item.fromChat ? "var(--brand-tint-border)" : "var(--border)"
                }`,
                borderRadius: "var(--radius-md)",
                animation: "wsFadeUp 280ms var(--ease-out) both",
              }}
            >
              <span
                className="tag tag-brand"
                style={{ fontSize: 10, flex: "0 0 auto" }}
              >
                {item.kind}
              </span>
              <span
                style={{
                  minWidth: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 12, lineHeight: 1.45 }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 11, color: "var(--fg3)" }}>
                  {item.source}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  removeFromShelf(project.id, item.id);
                  onToast?.("Taken off the shelf");
                }}
                aria-label={`Remove ${item.name} from the shelf`}
                style={{
                  flex: "0 0 auto",
                  border: 0,
                  background: "transparent",
                  padding: 2,
                  color: "var(--fg3)",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <CrossIcon size={12} />
              </button>
            </div>
          ))
        )}

        <span style={{ fontSize: 11, color: "var(--fg3)", lineHeight: 1.55 }}>
          Every chat and agent in this project inherits the shelf.
        </span>
      </section>

      {/* ── Agents ── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span className="mono-label" style={{ fontSize: 10, letterSpacing: "0.09em" }}>
          AGENTS IN THIS PROJECT
        </span>
        {projectAgents.length === 0 ? (
          <span style={{ fontSize: 11.5, color: "var(--fg3)", lineHeight: 1.55 }}>
            No agents attached yet.
          </span>
        ) : (
          projectAgents.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 9px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ flex: "0 0 auto", color: "var(--brand-600)" }}>
                <RobotIcon size={15} />
              </span>
              <span
                style={{
                  minWidth: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: 12 }}>{a.name}</span>
                <span style={{ fontSize: 11, color: "var(--fg3)" }}>
                  {a.niche}
                </span>
              </span>
            </div>
          ))
        )}
      </section>

      {/* ── Activity ── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <span className="mono-label" style={{ fontSize: 10, letterSpacing: "0.09em" }}>
          ACTIVITY
        </span>
        {activity.length === 0 ? (
          <span style={{ fontSize: 11.5, color: "var(--fg3)", lineHeight: 1.55 }}>
            Nothing has run on this project yet.
          </span>
        ) : (
          activity.map((r) => (
            <div key={r.id} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <span
                aria-hidden="true"
                style={{
                  width: 5,
                  height: 5,
                  flex: "0 0 5px",
                  borderRadius: "50%",
                  background: "var(--brand-400)",
                  marginTop: 6,
                }}
              />
              <span style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12, color: "var(--fg2)", lineHeight: 1.5 }}>
                  {r.agent} {r.title}
                </span>
                <span style={{ fontSize: 11, color: "var(--fg3)" }}>
                  {relative(r.at)}
                </span>
              </span>
            </div>
          ))
        )}
      </section>
    </aside>
  );
}
