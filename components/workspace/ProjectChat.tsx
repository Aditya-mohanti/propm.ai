"use client";

import { useEffect, useRef, useState } from "react";
import { useWorkspace, type Project } from "@/lib/workspace-context";
import { PROVIDERS } from "@/lib/providers";
import { relative } from "@/lib/format";
import { PlugIcon, ArrowIcon, CrossIcon, AlertIcon } from "./icons";

/**
 * Per-project chat, on whichever provider the workspace is connected to.
 *
 * The transcript is stored per project id and persists across reloads, so a
 * project keeps its own thread. History is sent with every turn — the APIs are
 * stateless — and the server trims it, so a long thread cannot grow unbounded.
 */
export default function ProjectChat({ project }: { project: Project }) {
  const { chats, connection, appendChatMessage, clearChat } = useWorkspace();
  const messages = chats[project.id] ?? [];

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);

  const meta = connection ? PROVIDERS[connection.provider] : null;

  // Keep the newest turn in view as the thread grows.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, sending]);

  async function send() {
    const text = draft.trim();
    if (!text || sending || !connection) return;

    setDraft("");
    setSending(true);
    appendChatMessage(project.id, { role: "user", content: text });

    // Built from the state we already have rather than read back from the
    // store, which has not re-rendered yet at this point.
    const outgoing = [
      ...messages
        .filter((m) => !m.failed)
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: connection.provider,
          messages: outgoing,
          projectContext: describe(project),
        }),
      });
      const data = (await res.json()) as {
        text?: string;
        model?: string;
        error?: string;
      };

      if (!res.ok || data.error) {
        appendChatMessage(project.id, {
          role: "assistant",
          content: data.error ?? `Request failed (${res.status}).`,
          provider: connection.provider,
          failed: true,
        });
      } else {
        appendChatMessage(project.id, {
          role: "assistant",
          content: data.text ?? "",
          provider: connection.provider,
          model: data.model,
        });
      }
    } catch {
      appendChatMessage(project.id, {
        role: "assistant",
        content: "Could not reach the server. Is the dev server still running?",
        provider: connection.provider,
        failed: true,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 420,
        maxHeight: "calc(100vh - 190px)",
        position: "sticky",
        top: 16,
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "13px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: connection ? "var(--green-600)" : "var(--fg3)",
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          {meta ? `Chat · ${meta.name}` : "Chat"}
        </span>
        {messages.length > 0 && (
          <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {confirmClear ? (
              <>
                <button type="button" onClick={() => { clearChat(project.id); setConfirmClear(false); }} style={linkBtn}>
                  Clear history
                </button>
                <button type="button" onClick={() => setConfirmClear(false)} style={{ ...linkBtn, color: "var(--fg3)" }}>
                  Keep
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                aria-label="Clear chat history"
                style={{ ...linkBtn, color: "var(--fg3)", display: "flex", alignItems: "center", gap: 5 }}
              >
                <CrossIcon size={13} />
              </button>
            )}
          </span>
        )}
      </div>

      {/* Transcript */}
      <div
        ref={scroller}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {!connection ? (
          <Notice
            icon={<PlugIcon size={18} />}
            title="No provider connected"
            body="Connect Claude or ChatGPT and this becomes a working chat, grounded in this project."
          />
        ) : messages.length === 0 ? (
          <Notice
            icon={<span style={{ fontSize: 16 }}>{meta?.name.slice(0, 1)}</span>}
            title={`Ask ${meta?.name} about this project`}
            body={`It knows the goal, the surfaces that have work in them and what has been decided. Ask it to draft, critique or size something.`}
          />
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "88%",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                animation: "wsFadeUp 200ms var(--ease-out) both",
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--radius-lg)",
                  fontSize: 13,
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  background:
                    m.role === "user"
                      ? "var(--brand-tint-bg)"
                      : m.failed
                        ? "var(--red-50)"
                        : "var(--muted)",
                  border: `1px solid ${
                    m.role === "user"
                      ? "var(--brand-tint-border)"
                      : m.failed
                        ? "var(--red-800)"
                        : "var(--border)"
                  }`,
                  color: m.failed ? "var(--red-800)" : "var(--fg1)",
                }}
              >
                {m.failed && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                      fontSize: 11.5,
                    }}
                  >
                    <AlertIcon size={13} />
                    Failed
                  </span>
                )}
                {m.content}
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--fg3)",
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {relative(m.at)}
                {m.model ? ` · ${m.model}` : ""}
              </span>
            </div>
          ))
        )}

        {sending && (
          <span
            style={{
              alignSelf: "flex-start",
              fontSize: 12,
              color: "var(--fg3)",
              animation: "wsPulse 1.1s ease-in-out infinite",
            }}
          >
            {meta?.name} is thinking…
          </span>
        )}
      </div>

      {/* Composer */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: 12,
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends; Shift+Enter breaks the line.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={2}
          disabled={!connection || sending}
          placeholder={
            connection
              ? `Ask ${meta?.name} about ${project.name}…`
              : "Connect a provider to start chatting"
          }
          style={{
            flex: 1,
            minWidth: 0,
            padding: "9px 10px",
            resize: "none",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--input)",
            background: "var(--bg)",
            color: "var(--fg1)",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            lineHeight: 1.55,
            opacity: connection ? 1 : 0.6,
          }}
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={!connection || sending || !draft.trim()}
          aria-label="Send"
          className="btn-primary"
          style={{
            height: 38,
            width: 38,
            padding: 0,
            justifyContent: "center",
            opacity: !connection || sending || !draft.trim() ? 0.45 : 1,
            cursor:
              !connection || sending || !draft.trim() ? "not-allowed" : "pointer",
          }}
        >
          <ArrowIcon size={16} />
        </button>
      </div>
    </section>
  );
}

/** Everything the assistant should know about the project, as plain text. */
function describe(p: Project) {
  const lines = [
    `Name: ${p.name}`,
    p.goal ? `Goal: ${p.goal}` : null,
    `Folder: ${p.folder}`,
    p.metric ? `Key metric: ${p.metric.value} ${p.metric.label}` : null,
  ].filter(Boolean);

  const worked = p.canvases.filter((c) => c.status !== "Not started");
  if (worked.length > 0) {
    lines.push(
      `Surfaces with work: ${worked.map((c) => `${c.name} (${c.status})`).join(", ")}`,
    );
  }
  if (p.decisions?.length) {
    lines.push(
      "Decisions: " +
        p.decisions
          .map((d) =>
            d.status === "open"
              ? `OPEN — ${d.title}${d.note ? ` (${d.note})` : ""}`
              : `${d.title} (decided ${d.when})`,
          )
          .join("; "),
    );
  }
  if (p.context?.length) {
    lines.push(
      `Context available: ${p.context.map((c) => `${c.kind} ${c.label}`).join(", ")}`,
    );
  }
  return lines.join("\n");
}

const linkBtn: React.CSSProperties = {
  border: 0,
  background: "transparent",
  padding: 2,
  fontSize: 12,
  fontFamily: "inherit",
  color: "var(--brand-700)",
  cursor: "pointer",
};

function Notice({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        margin: "auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "24px 8px",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--brand-tint-bg)",
          border: "1px solid var(--brand-tint-border)",
          color: "var(--brand-700)",
        }}
      >
        {icon}
      </span>
      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</span>
      <span
        style={{
          maxWidth: 260,
          fontSize: 12.5,
          lineHeight: 1.6,
          color: "var(--fg2)",
        }}
      >
        {body}
      </span>
    </div>
  );
}
