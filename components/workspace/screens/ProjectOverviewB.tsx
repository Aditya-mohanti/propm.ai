"use client";

import { useState } from "react";
import type { CanvasKind, Project } from "@/lib/workspace-context";
import type { ProjectOverview } from "../surfaces";
import { relative } from "@/lib/format";

/**
 * Option B — the rail.
 *
 * The six surfaces run along a timeline; picking one expands it below with
 * what it inherits from the project. Agents and recent movement sit at the
 * bottom, so the screen answers "who is working on this and what moved" as
 * well as "what is here".
 */
export default function ProjectOverviewB({
  project,
  data,
  onOpenCanvas,
}: {
  project: Project;
  data: ProjectOverview;
  onOpenCanvas: (kind: CanvasKind) => void;
}) {
  // Open on the first surface with work in it, falling back to the first.
  const initial = Math.max(
    0,
    data.surfaces.findIndex((s) => s.started),
  );
  const [selected, setSelected] = useState(initial);
  const active = data.surfaces[selected] ?? data.surfaces[0];

  const ringPct = Math.round(
    (data.activeCount / Math.max(1, data.surfaces.length)) * 100,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* ── Header ── */}
      <section
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: 22,
          display: "flex",
          alignItems: "flex-start",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 340px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span className="tag tag-brand-solid">{project.folder}</span>
            <span style={{ fontSize: 12.5, color: "var(--fg3)" }}>
              project{project.startedAt ? ` · started ${project.startedAt}` : ""}
            </span>
          </div>

          <h2
            style={{
              margin: "10px 0 0",
              fontFamily: "var(--font-serif)",
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {project.name}
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              maxWidth: "68ch",
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--fg2)",
              textWrap: "pretty",
            }}
          >
            {project.goal || "No goal set yet."}
            {project.metric &&
              ` — ${project.metric.value} ${project.metric.label}.`}
          </p>

          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn-ghost"
              style={{
                height: 36,
                padding: "0 16px",
                borderColor: "var(--brand-400)",
                color: "var(--brand-800)",
              }}
            >
              Ask an agent
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ height: 36, padding: "0 16px" }}
              onClick={() => onOpenCanvas(active.kind)}
            >
              Pick up where you left off
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <Ring pct={ringPct} label={data.surfaceLabel} sub="surfaces" />
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <MiniStat n={data.runsThisWeek} label="runs this week" />
            <MiniStat n={data.decisionsLocked} label="decisions locked" />
            <MiniStat
              n={data.openQuestions}
              label={
                data.openQuestions === 1 ? "question open" : "questions open"
              }
            />
          </div>
        </div>
      </section>

      {/* ── Surface rail + detail ── */}
      <section
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ overflowX: "auto" }} data-scroller>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${data.surfaces.length}, minmax(132px, 1fr))`,
              gap: 4,
              minWidth: 132 * data.surfaces.length,
            }}
          >
            {data.surfaces.map((s, i) => {
              const on = i === selected;
              return (
                <button
                  key={s.kind}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={on}
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    padding: "12px 12px 14px",
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: "var(--radius-lg)",
                    border: `1px solid ${on ? "var(--brand-tint-border)" : "transparent"}`,
                    background: on ? "var(--brand-tint-bg)" : "transparent",
                  }}
                >
                  {/* dot + connector */}
                  <span
                    aria-hidden="true"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0,
                      height: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        flex: "0 0 9px",
                        borderRadius: "50%",
                        background: s.started
                          ? "var(--brand-500)"
                          : "var(--dot-idle)",
                      }}
                    />
                    {i < data.surfaces.length - 1 && (
                      <span
                        style={{
                          flex: 1,
                          height: 1,
                          background: "var(--border)",
                        }}
                      />
                    )}
                  </span>

                  <span
                    style={{
                      marginTop: 4,
                      fontFamily: "var(--font-serif)",
                      fontSize: 15,
                      fontWeight: 600,
                      color: s.started ? "var(--fg1)" : "var(--fg2)",
                    }}
                  >
                    {s.label}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--fg3)" }}>
                    {s.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail for the selected surface */}
        <div
          key={active.kind}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            gap: 20,
            padding: 20,
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            background: "var(--muted)",
            animation: "wsFadeUp 220ms var(--ease-out) both",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span className="mono-label" style={{ fontSize: 11 }}>
              SURFACE {String(selected + 1).padStart(2, "0")} ·{" "}
              {active.label.toUpperCase()}
            </span>
            <h3
              style={{
                margin: "10px 0 0",
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.015em",
              }}
            >
              {active.label}
            </h3>
            <p
              style={{
                margin: "8px 0 0",
                maxWidth: "58ch",
                fontSize: 13.5,
                lineHeight: 1.7,
                color: "var(--fg2)",
                textWrap: "pretty",
              }}
            >
              {active.blurb}
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-ghost"
                style={{
                  height: 34,
                  padding: "0 15px",
                  borderColor: "var(--brand-400)",
                  color: "var(--brand-800)",
                  background: "var(--card)",
                }}
                onClick={() => onOpenCanvas(active.kind)}
              >
                {active.started ? `Open ${active.label}` : `Start ${active.label}`}
              </button>
              {data.agents.length > 0 && (
                <button
                  type="button"
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    fontSize: 13,
                    fontFamily: "inherit",
                    color: "var(--brand-700)",
                    cursor: "pointer",
                  }}
                >
                  Hand it to {data.agents[0].name}
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              minWidth: 0,
              paddingLeft: 20,
              borderLeft: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: 12.5, color: "var(--fg2)" }}>
              What it inherits from this project
            </span>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {active.inherits.length > 0 ? (
                active.inherits.map((line) => (
                  <span
                    key={line}
                    style={{
                      paddingLeft: 11,
                      borderLeft: "2px solid var(--brand-300)",
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "var(--fg1)",
                    }}
                  >
                    {line}
                  </span>
                ))
              ) : (
                <span
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: "var(--fg3)",
                  }}
                >
                  Nothing yet. Once other surfaces have work in them, this one
                  reads from them automatically.
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Agents + movement ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 14,
          alignItems: "start",
        }}
      >
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h3 className="mono-label" style={{ margin: 0, fontSize: 11 }}>
            AGENTS ON THIS PROJECT
          </h3>
          {data.agents.length > 0 ? (
            data.agents.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "13px 15px",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <span
                  style={{
                    width: 30,
                    height: 30,
                    flex: "0 0 30px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--brand-200)",
                    background: "var(--brand-50)",
                    color: "var(--brand-800)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  {a.initials}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13.5 }}>
                    {a.name}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "var(--fg3)",
                    }}
                  >
                    {a.meta}
                  </span>
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    flex: "0 0 auto",
                    fontSize: 12,
                    color: a.busy ? "var(--brand-700)" : "var(--fg3)",
                  }}
                >
                  {a.state}
                </span>
              </div>
            ))
          ) : (
            <Blank text="No agents on this project yet. Attach one and its runs show up here." />
          )}
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h3 className="mono-label" style={{ margin: 0, fontSize: 11 }}>
            LATEST MOVEMENT
          </h3>
          {data.movement.length > 0 ? (
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "6px 16px",
              }}
            >
              {data.movement.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 0",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      marginTop: 6,
                      width: 6,
                      height: 6,
                      flex: "0 0 6px",
                      borderRadius: "50%",
                      background: "var(--brand-400)",
                    }}
                  />
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 13.5 }}>
                      {r.agent} {r.title}
                    </span>
                    <span
                      style={{
                        display: "block",
                        marginTop: 2,
                        fontSize: 12,
                        color: "var(--fg3)",
                      }}
                    >
                      {relative(r.at)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Blank text="Nothing has run on this project yet. Agent passes and logged decisions appear here as they happen." />
          )}
        </section>
      </div>
    </div>
  );
}

function Ring({
  pct,
  label,
  sub,
}: {
  pct: number;
  label: string;
  sub: string;
}) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 78, height: 78, flex: "0 0 78px" }}>
      <svg width="78" height="78" viewBox="0 0 78 78" aria-hidden="true">
        <circle
          cx="39"
          cy="39"
          r={r}
          fill="none"
          stroke="var(--track)"
          strokeWidth="6"
        />
        <circle
          cx="39"
          cy="39"
          r={r}
          fill="none"
          stroke="var(--brand-500)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform="rotate(-90 39 39)"
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 17,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 10.5, color: "var(--fg3)" }}>{sub}</span>
      </span>
    </div>
  );
}

function MiniStat({ n, label }: { n: number; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 17,
          fontWeight: 600,
          minWidth: 18,
          textAlign: "right",
        }}
      >
        {n}
      </span>
      <span style={{ fontSize: 12, color: "var(--fg3)" }}>{label}</span>
    </span>
  );
}

function Blank({ text }: { text: string }) {
  return (
    <p
      style={{
        margin: 0,
        padding: 18,
        border: "1px dashed var(--input)",
        borderRadius: "var(--radius-lg)",
        background: "var(--muted)",
        fontSize: 12.5,
        lineHeight: 1.6,
        color: "var(--fg3)",
      }}
    >
      {text}
    </p>
  );
}
