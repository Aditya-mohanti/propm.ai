"use client";

import { useEffect, useState } from "react";
import { useWorkspace, type Project } from "@/lib/workspace-context";
import { CrossIcon } from "./icons";

const FOLDERS = ["Growth", "Platform", "Research"];

/** Mounted only while open, so the form is empty every time it appears. */
export default function NewProjectDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: (p: Project) => void;
}) {
  const { createProject } = useWorkspace();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [folder, setFolder] = useState(FOLDERS[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit() {
    if (!name.trim()) {
      setError("Give the project a name so you can find it later.");
      return;
    }
    const project = createProject({ name, goal, folder });
    onCreated?.(project);
    onClose();
  }

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 55,
        background: "rgba(28, 25, 23, 0.55)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 24,
        overflow: "auto",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Start a project"
        style={{
          width: "100%",
          maxWidth: 440,
          margin: "auto",
          background: "var(--card)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          animation: "wsFadeUp 200ms var(--ease-out) both",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Start a project
            </h2>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: 12.5,
                lineHeight: 1.6,
                color: "var(--fg2)",
              }}
            >
              A project is one goal with its own canvases, agents and run history.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              marginLeft: "auto",
              width: 28,
              height: 28,
              border: 0,
              borderRadius: 6,
              background: "transparent",
              color: "var(--fg3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CrossIcon size={15} />
          </button>
        </div>

        <Field label="Name">
          <input
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Mobile checkout"
            aria-invalid={error ? true : undefined}
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

        <Field label="Goal">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Cut abandoned carts by 20%"
            style={INPUT}
          />
        </Field>

        <Field label="Folder">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FOLDERS.map((f) => {
              const on = folder === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFolder(f)}
                  aria-pressed={on}
                  style={{
                    height: 30,
                    padding: "0 12px",
                    borderRadius: "var(--radius-md)",
                    fontSize: 12.5,
                    cursor: "pointer",
                    border: `1px solid ${on ? "var(--brand-400)" : "var(--border)"}`,
                    background: on ? "var(--brand-tint-bg)" : "transparent",
                    color: on ? "var(--brand-800)" : "var(--fg2)",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </Field>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 2,
          }}
        >
          <button
            type="button"
            className="btn-ghost"
            style={{ height: 36, padding: "0 16px" }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ height: 36, padding: "0 16px" }}
            onClick={submit}
          >
            Create project
          </button>
        </div>
      </div>
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
};

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
