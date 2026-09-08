"use client";

import { useEffect, useRef, useState } from "react";
import {
  useWorkspace,
  type CanvasKind,
  type ChatThread,
  type Project,
} from "@/lib/workspace-context";
import { PROVIDERS } from "@/lib/providers";
import { relative } from "@/lib/format";
import { PlugIcon, ArrowIcon, CrossIcon, AlertIcon, NoteIcon } from "./icons";

/**
 * One thread of a project's chat.
 *
 * The thread is passed in rather than looked up, because the shell owns which
 * one is open. Everything the assistant is told about the project — including
 * the shelf — is assembled in `describe` below, so two threads in the same
 * project argue from the same facts even though their transcripts differ.
 */
export default function ChatPane({
  project,
  thread,
  onToast,
}: {
  project: Project;
  thread: ChatThread;
  onToast?: (message: string) => void;
}) {
  const { connection, appendChatMessage, clearChat, addToShelf, agents } =
    useWorkspace();

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [agent, setAgent] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);

  const meta = connection ? PROVIDERS[connection.provider] : null;
  const messages = thread.messages;
  const shelf = project.shelf ?? [];

  // Keep the newest turn in view as the thread grows.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, sending]);

  // Switching threads resets the composer — a half-typed line belongs to the
  // conversation it was being written into. That is handled by the shell
  // keying this component on the thread id, so it remounts rather than
  // carrying state across; no effect is needed to clear it.

  async function send(text: string) {
    const body = text.trim();
    if (!body || sending || !connection) return;

    setDraft("");
    setSending(true);
    appendChatMessage(project.id, thread.id, { role: "user", content: body });

    // Built from the state we already have rather than read back from the
    // store, which has not re-rendered yet at this point.
    const outgoing = [
      ...messages
        .filter((m) => !m.failed)
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: body },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: connection.provider,
          messages: outgoing,
          projectContext: describe(project, thread, agent),
        }),
      });
      const data = (await res.json()) as {
        text?: string;
        model?: string;
        error?: string;
      };

      if (!res.ok || data.error) {
        appendChatMessage(project.id, thread.id, {
          role: "assistant",
          content: data.error ?? `Request failed (${res.status}).`,
          provider: connection.provider,
          failed: true,
        });
      } else {
        appendChatMessage(project.id, thread.id, {
          role: "assistant",
          content: data.text ?? "",
          provider: connection.provider,
          model: data.model,
        });
      }
    } catch {
      appendChatMessage(project.id, thread.id, {
        role: "assistant",
        content: "Could not reach the server. Is the dev server still running?",
        provider: connection.provider,
        failed: true,
      });
    } finally {
      setSending(false);
    }
  }

  // Surfaces without their own starters fall back to the PRD set rather than
  // showing none — an empty chat with no way in is the worst empty state.
  const starters = STARTERS[thread.surface] ?? DEFAULT_STARTERS;
  const canSend = Boolean(connection) && !sending && draft.trim().length > 0;

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "11px 28px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            flex: "0 0 7px",
            borderRadius: "50%",
            background: connection ? "var(--brand-500)" : "var(--dot-idle)",
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          {meta ? `Chat · ${meta.name}` : "Chat"}
        </span>

        {messages.length > 0 && (
          <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {confirmClear ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    clearChat(project.id, thread.id);
                    setConfirmClear(false);
                    onToast?.("History cleared — the shelf is untouched");
                  }}
                  style={linkBtn}
                >
                  Clear history
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  style={{ ...linkBtn, color: "var(--fg3)" }}
                >
                  Keep
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                aria-label="Clear chat history"
                style={{
                  ...linkBtn,
                  color: "var(--fg3)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CrossIcon size={13} />
              </button>
            )}
          </span>
        )}
      </div>

      {/* ── Transcript ── */}
      <div
        ref={scroller}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "20px 28px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {!connection ? (
          <EmptyChat
            icon={<PlugIcon size={20} />}
            title="No provider connected"
            body="Connect Claude or ChatGPT and this becomes a working chat, grounded in everything on this project's shelf."
            footer={`${shelf.length} shelf ${shelf.length === 1 ? "item" : "items"} waiting`}
          />
        ) : messages.length === 0 ? (
          <EmptyChat
            icon={<NoteIcon size={20} />}
            title={`Ask ${meta?.name} about ${project.name}`}
            body="It reads this project's shelf — the goal, the sources on file and what has already been decided. Ask it to draft, critique or size something."
            footer={`${shelf.length} shelf ${shelf.length === 1 ? "item" : "items"} in scope · every chat in this project reads the same shelf`}
            starters={starters.map((s) => ({
              kicker: s.kicker,
              label: s.short,
              onPick: () => void send(s.prompt),
            }))}
          />
        ) : (
          <div
            style={{
              maxWidth: 800,
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m) => (
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
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    fontSize: 11,
                    color: "var(--fg3)",
                  }}
                >
                  {relative(m.at)}
                  {m.model ? ` · ${m.model}` : ""}

                  {/* Anything the assistant said can become project context.
                      This is the one move that makes a thread's output
                      outlive the thread. */}
                  {m.role === "assistant" && !m.failed && m.content.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        addToShelf(project.id, {
                          kind: "Note",
                          name: titleOf(m.content),
                          source: `from ${agent ?? meta?.name ?? "chat"} · just now`,
                          fromChat: true,
                        });
                        onToast?.(
                          `On ${project.name}'s shelf — every chat here inherits it`,
                        );
                      }}
                      style={{ ...linkBtn, fontSize: 11 }}
                    >
                      Add to project context
                    </button>
                  )}
                </span>
              </div>
            ))}

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
        )}
      </div>

      {/* ── Composer ── */}
      <div
        style={{
          flex: "0 0 auto",
          padding: "12px 28px 16px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                // Enter sends; Shift+Enter breaks the line.
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(draft);
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
              onClick={() => void send(draft)}
              disabled={!canSend}
              aria-label="Send"
              className="btn-primary"
              style={{
                height: 38,
                width: 38,
                flex: "0 0 38px",
                padding: 0,
                justifyContent: "center",
                opacity: canSend ? 1 : 0.45,
                cursor: canSend ? "pointer" : "not-allowed",
              }}
            >
              <ArrowIcon size={16} />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              flexWrap: "wrap",
            }}
          >
            {agents.length > 0 && (
              <>
                <span style={{ fontSize: 11, color: "var(--fg3)" }}>agent</span>
                {agents.slice(0, 3).map((a) => {
                  const on = agent === a.name;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAgent(on ? null : a.name)}
                      aria-pressed={on}
                      style={{
                        height: 25,
                        padding: "0 9px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${on ? "var(--brand-400)" : "var(--border)"}`,
                        background: on ? "var(--brand-tint-bg)" : "transparent",
                        color: on ? "var(--brand-800)" : "var(--fg3)",
                        fontFamily: "inherit",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      {a.name}
                    </button>
                  );
                })}
              </>
            )}
            <span
              style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg3)" }}
            >
              {shelf.length} shelf {shelf.length === 1 ? "item" : "items"} in
              scope
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Starters — surface-aware, because what you want from a
   thread tagged "Design" is not what you want from "PRD".
   ───────────────────────────────────────────────────────── */

type Starter = { kicker: string; short: string; prompt: string };

const DEFAULT_STARTERS: Starter[] = [
  { kicker: "DRAFT", short: "Write the success criteria", prompt: "Write the success criteria section from the research on file." },
  { kicker: "CHALLENGE", short: "Which claims have no source?", prompt: "Which claims in the current draft have no source behind them?" },
  { kicker: "SCOPE", short: "What should we cut?", prompt: "What should we cut to ship this in three weeks?" },
];

const STARTERS: Partial<Record<CanvasKind, Starter[]>> = {
  prd: DEFAULT_STARTERS,
  prototype: [
    { kicker: "DRAW", short: "Draw the second-session screen", prompt: "Draw the second-session screen from the PRD's success criteria." },
    { kicker: "CRITIQUE", short: "Where do we lose people?", prompt: "Where does the current onboarding flow lose people?" },
    { kicker: "CHECK", short: "Does this still match the spec?", prompt: "Does the prototype still match the current draft of the spec?" },
  ],
  research: [
    { kicker: "SIZE", short: "Size the opportunity", prompt: "Size the opportunity from the research on file, and mark what is a guess." },
    { kicker: "SYNTHESISE", short: "What do the sources agree on?", prompt: "What do the sources on the shelf agree and disagree on?" },
  ],
  notes: [
    { kicker: "THINK", short: "What is blocking this?", prompt: "What is actually blocking this project right now?" },
    { kicker: "SUMMARISE", short: "Summarise for a stakeholder", prompt: "Summarise where we are for a stakeholder." },
  ],
  decisions: [
    { kicker: "VARIATE", short: "Give me two alternatives", prompt: "Give me two alternatives to the most recent decision, with trade-offs." },
    { kicker: "REVIEW", short: "Which decisions are stale?", prompt: "Which decisions on file are stale given what we now know?" },
  ],
  data: [
    { kicker: "READ", short: "What do the numbers say?", prompt: "What do the numbers on the shelf actually say about the goal?" },
  ],
};

/* ─────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────── */

/** A shelf item needs a short name; assistant turns rarely have one. */
function titleOf(text: string) {
  const line = text.trim().split("\n")[0].replace(/\s+/g, " ");
  return line.length > 48 ? `${line.slice(0, 48)}…` : line || "Note from chat";
}

/**
 * Everything the assistant should know, as plain text.
 *
 * The shelf goes in first: it is the project's shared ground, and putting it
 * ahead of the surface detail is what makes two threads answer consistently.
 */
function describe(p: Project, thread: ChatThread, agent: string | null) {
  const lines = [
    `Name: ${p.name}`,
    p.goal ? `Goal: ${p.goal}` : null,
    `Folder: ${p.folder}`,
    p.metric ? `Key metric: ${p.metric.value} ${p.metric.label}` : null,
    `This thread is working on: ${thread.surface}`,
    agent ? `Answer as the ${agent} agent.` : null,
  ].filter(Boolean);

  if (p.shelf?.length) {
    lines.push(
      "Project context shelf (every thread reads this):\n" +
        p.shelf.map((i) => `- ${i.kind}: ${i.name} (${i.source})`).join("\n"),
    );
  }

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

function EmptyChat({
  icon,
  title,
  body,
  footer,
  starters,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  footer: string;
  starters?: { kicker: string; label: string; onPick: () => void }[];
}) {
  return (
    <div
      style={{
        margin: "auto",
        width: "100%",
        maxWidth: 640,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 4,
        padding: "48px 32px",
        border: "1px dashed var(--input)",
        borderRadius: "var(--radius-xl)",
        background: "var(--card)",
        animation: "wsFadeUp 300ms var(--ease-out) both",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-lg)",
          background: "var(--brand-tint-bg)",
          border: "1px solid var(--brand-tint-border)",
          color: "var(--brand-800)",
          marginBottom: 12,
        }}
      >
        {icon}
      </span>
      <h3
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: "6px 0 0",
          maxWidth: "52ch",
          fontSize: 13,
          lineHeight: 1.65,
          color: "var(--fg2)",
          textWrap: "pretty",
        }}
      >
        {body}
      </p>

      {starters && starters.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginTop: 18,
          }}
        >
          {starters.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={s.onPick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 32,
                padding: "0 12px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                background: "transparent",
                color: "var(--fg2)",
                fontFamily: "inherit",
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.07em",
                  color: "var(--brand-700)",
                }}
              >
                {s.kicker}
              </span>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 18,
          paddingTop: 16,
          borderTop: "1px solid var(--border)",
          width: "100%",
          maxWidth: 420,
          fontSize: 12,
          lineHeight: 1.6,
          color: "var(--fg3)",
        }}
      >
        {footer}
      </div>
    </div>
  );
}
