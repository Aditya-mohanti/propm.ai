"use client";

import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import EmptyState from "../EmptyState";
import { SparkIcon } from "../icons";

const KINDS = ["Research", "Data", "Writing", "Planning", "Review"];

export default function SkillsScreen() {
  const { skills, createSkill, ready } = useWorkspace();
  const [name, setName] = useState("");
  const [kind, setKind] = useState(KINDS[0]);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) return <Skeleton />;

  function submit() {
    if (!name.trim()) {
      setError("Give the skill a name.");
      return;
    }
    createSkill({
      name: name.trim(),
      kind,
      body: "New skill — add the steps and the sources it may read.",
    });
    setName("");
    setError(null);
    setAdding(false);
  }

  if (skills.length === 0 && !adding) {
    return (
      <EmptyState
        icon={<SparkIcon size={22} />}
        title="The skill library is empty"
        body="A skill is a named procedure any agent can borrow — the steps it follows, the sources it may read, and the shape of what it hands back."
        actions={[{ label: "Add a skill", onClick: () => setAdding(true) }]}
        footnote="Good first skills are the ones you already repeat by hand every week."
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: 14,
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--fg2)" }}>New skill</span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Competitor pricing sweep"
            style={{
              ...INPUT,
              borderColor: error ? "var(--red-800)" : "var(--input)",
            }}
          />
        </div>
        <div style={{ flex: "0 1 160px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--fg2)" }}>Kind</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            style={INPUT}
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn-primary"
          style={{ height: 38, padding: "0 16px" }}
          onClick={submit}
        >
          Add skill
        </button>
        {error && (
          <span
            role="alert"
            style={{ flexBasis: "100%", fontSize: 12, color: "var(--red-800)" }}
          >
            {error}
          </span>
        )}
      </div>

      {skills.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {skills.map((s) => (
            <div
              key={s.id}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: 15,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                animation: "wsFadeUp 260ms var(--ease-out) both",
              }}
            >
              <span className="mono-label" style={{ fontSize: 11 }}>
                {s.kind}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {s.name}
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.55, color: "var(--fg2)" }}>
                {s.body}
              </span>
            </div>
          ))}
        </div>
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

function Skeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 180,
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        background: "var(--muted)",
        animation: "wsPulse 1.4s ease-in-out infinite",
      }}
    />
  );
}
