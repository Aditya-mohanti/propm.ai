"use client";

import type { CanvasKind, Project } from "@/lib/workspace-context";
import type { ProjectOverview } from "../surfaces";
import { ArrowIcon, SparkIcon } from "../icons";

/**
 * Option A — the digest.
 *
 * Leads with the question rather than the contents: what should happen next.
 * Underneath, the surfaces list sits beside a decision digest and the shared
 * context panel, so "where is this project" is answerable without opening
 * anything.
 */
export default function ProjectOverviewA({
  project,
  data,
  onOpenCanvas,
}: {
  project: Project;
  data: ProjectOverview;
  onOpenCanvas: (kind: CanvasKind) => void;
}) {
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
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0, flex: "1 1 320px" }}>
            <span
              className="mono-label"
              style={{ fontSize: 11, letterSpacing: "0.1em" }}
            >
              {project.folder.toUpperCase()} · PROJECT
            </span>
            <h2
              style={{
                margin: "8px 0 0",
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
                fontSize: 14,
                color: "var(--fg2)",
                lineHeight: 1.55,
              }}
            >
              {project.goal || "No goal set yet."}
            </p>
          </div>

          <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
            <Stat
              value={project.metric?.value ?? "—"}
              label={project.metric?.label ?? "no metric set"}
            />
            <Stat value={data.surfaceLabel} label="surfaces active" />
            <Stat
              value={String(data.openQuestions)}
              label={
                data.openQuestions === 1 ? "open question" : "open questions"
              }
            />
          </div>
        </div>

        {/* Prompt bar */}
        <div
          style={{
            border: "1px solid var(--brand-tint-border)",
            background: "var(--brand-tint-bg)",
            borderRadius: "var(--radius-lg)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "var(--brand-600)", display: "flex" }}>
              <SparkIcon size={16} />
            </span>
            <span style={{ fontSize: 15, color: "var(--fg2)" }}>
              What should happen next on this project?
            </span>
            <button
              type="button"
              className="btn-ghost"
              style={{
                marginLeft: "auto",
                height: 32,
                padding: "0 16px",
                borderColor: "var(--brand-400)",
                color: "var(--brand-800)",
                background: "var(--card)",
              }}
            >
              Plan it
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {data.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                style={{
                  height: 34,
                  padding: "0 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--fg1)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two columns ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
          gap: 14,
          alignItems: "start",
        }}
      >
        {/* Surfaces */}
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h3 className="mono-label" style={{ margin: 0, fontSize: 11 }}>
              SURFACES
            </h3>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 12,
                color: "var(--fg3)",
              }}
            >
              {data.activeCount} of {data.surfaces.length} have work in them
            </span>
          </div>

          {data.surfaces.map((s, i) => (
            <button
              key={s.kind}
              type="button"
              onClick={() => onOpenCanvas(s.kind)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 16px 14px 18px",
                textAlign: "left",
                cursor: "pointer",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                animation: "wsFadeUp 240ms var(--ease-out) both",
                animationDelay: `${i * 30}ms`,
                transition: "border-color var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--brand-300)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              {/* Accent rail: full strength once a surface has work in it. */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 12,
                  bottom: 12,
                  width: 3,
                  borderRadius: 3,
                  background: s.started
                    ? "var(--brand-500)"
                    : "var(--track)",
                }}
              />
              <span style={{ minWidth: 0, flex: 1 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-serif)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: s.started ? "var(--fg1)" : "var(--fg2)",
                  }}
                >
                  {s.label}
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
                  {s.inherits.length > 0 ? s.inherits.join(" · ") : s.blurb}
                </span>
              </span>
              <span
                className="tag"
                style={{
                  flex: "0 0 auto",
                  height: 24,
                  padding: "0 10px",
                  border: `1px solid ${
                    s.started ? "var(--brand-tint-border)" : "var(--border)"
                  }`,
                  background: s.started ? "var(--brand-tint-bg)" : "transparent",
                  color: s.started ? "var(--brand-800)" : "var(--fg3)",
                  whiteSpace: "nowrap",
                }}
              >
                {s.status}
              </span>
            </button>
          ))}
        </section>

        {/* Digest + context */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <section
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <h3 className="mono-label" style={{ margin: 0, fontSize: 11 }}>
              DECISION DIGEST
            </h3>

            {data.decisions && data.decisions.length > 0 ? (
              data.decisions.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  style={{
                    paddingLeft: 12,
                    borderLeft: `2px solid ${
                      d.status === "open"
                        ? "var(--brand-400)"
                        : "var(--track)"
                    }`,
                  }}
                >
                  <div style={{ fontSize: 13.5, color: "var(--fg1)" }}>
                    {d.title}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 12,
                      color: "var(--fg3)",
                    }}
                  >
                    {d.status === "open"
                      ? `Open · ${d.note ?? "not yet decided"}`
                      : `Decided ${d.when} · off ${d.source}`}
                  </div>
                </div>
              ))
            ) : (
              <Blank
                text="Nothing decided yet. Decisions logged on any surface land here."
                action="Open decisions"
                onClick={() => onOpenCanvas("decisions")}
              />
            )}
          </section>

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
            <h3 className="mono-label" style={{ margin: 0, fontSize: 11 }}>
              CONTEXT EVERY SURFACE READS
            </h3>

            {data.context.length > 0 ? (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {data.context.map((c) => (
                    <span
                      key={`${c.kind}-${c.label}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        maxWidth: "100%",
                        height: 28,
                        padding: "0 10px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--brand-tint-border)",
                        background: "var(--brand-tint-bg)",
                        fontSize: 12,
                        color: "var(--brand-900)",
                      }}
                    >
                      <span style={{ color: "var(--brand-600)", flex: "0 0 auto" }}>
                        {c.kind}
                      </span>
                      <span
                        style={{
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.label}
                      </span>
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
                  Anything added here reaches research, the PRD, design and the
                  model without being re-explained.
                </p>
              </>
            ) : (
              <Blank text="No shared context yet. Attach a doc, a Notion page or a warehouse table and every surface can read it." />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ minWidth: 74 }}>
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 26,
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 3,
          fontSize: 12,
          lineHeight: 1.4,
          color: "var(--fg3)",
          maxWidth: 90,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Blank({
  text,
  action,
  onClick,
}: {
  text: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p
        style={{
          margin: 0,
          fontSize: 12.5,
          lineHeight: 1.6,
          color: "var(--fg3)",
        }}
      >
        {text}
      </p>
      {action && onClick && (
        <button
          type="button"
          onClick={onClick}
          style={{
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            border: 0,
            background: "transparent",
            padding: 0,
            fontSize: 12.5,
            fontFamily: "inherit",
            color: "var(--brand-700)",
            cursor: "pointer",
          }}
        >
          {action}
          <ArrowIcon size={13} />
        </button>
      )}
    </div>
  );
}
