"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useAuth } from "@/lib/auth-context";
import { createLocalStore, memoStore, type LocalStore } from "@/lib/local-store";

/* ─────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────── */

export type ProviderId = "claude" | "openai";
export type ConnectMethod = "oauth" | "api-key";

export interface Connection {
  provider: ProviderId;
  /** Account the workspace is acting as. */
  accountEmail: string;
  plan: string;
  method: ConnectMethod;
  /** Last 4 characters of the key, when connected by key. Never the key itself. */
  keyHint?: string;
  connectedAt: string;
  models: string[];
}

export type CanvasKind =
  | "prd"
  | "prototype"
  | "research"
  | "data"
  | "notes"
  | "decisions"
  | "model"
  | "sheet";

export interface Canvas {
  kind: CanvasKind;
  name: string;
  status: string;
  detail?: string;
  /**
   * What this surface reads from the rest of the project — the
   * "Goal · … · Decision · …" line under each surface in the overview.
   */
  inherits?: string[];
}

/** A source every surface on the project can read. */
export interface ContextRef {
  /** "Goal", "PDF", "Notion", "SQL", "Notes" — rendered as the chip prefix. */
  kind: string;
  label: string;
}

export interface DecisionEntry {
  id: string;
  title: string;
  /** Human date as shown, e.g. "12 Mar". Empty while still open. */
  when: string;
  /** Where it was decided off, e.g. "the prototype". */
  source: string;
  status: "decided" | "open";
  /** For open questions: what it is holding up. */
  note?: string;
}

export interface Project {
  id: string;
  name: string;
  goal: string;
  folder: string;
  createdAt: string;
  updatedAt: string;
  agentIds: string[];
  canvases: Canvas[];

  /* The fields below are optional so projects stored by an earlier build
     still parse. Every overview section renders an empty state without
     them, which is also what a brand-new project looks like. */

  /** Display date the project started, e.g. "4 Mar". */
  startedAt?: string;
  /** The headline number, e.g. 12% reach a second session. */
  metric?: { value: string; label: string };
  context?: ContextRef[];
  decisions?: DecisionEntry[];
  /** Suggested next actions offered in the overview prompt bar. */
  suggestions?: string[];
  /** What every thread and agent in this project reads. */
  shelf?: ShelfItem[];
}

export interface Agent {
  id: string;
  name: string;
  niche: string;
  brief: string;
  skillIds: string[];
  model: string;
  canvases: string[];
}

export interface Skill {
  id: string;
  name: string;
  kind: string;
  body: string;
}

export interface Run {
  id: string;
  title: string;
  agent: string;
  canvas: string;
  projectId: string | null;
  projectName: string;
  model: string;
  at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string;
  /** Which provider answered, so a switched connection stays legible later. */
  provider?: ProviderId;
  model?: string;
  /** Set when the turn failed, so errors persist in the transcript. */
  failed?: boolean;
}

/**
 * One thread inside a project.
 *
 * A project holds several of these rather than a single transcript: the
 * sidebar lists them under their project, and each one is tagged with the
 * surface it is working on, so "draft the spec" and "why does step 2 drop
 * off" stay separate conversations that still read the same shelf.
 */
export interface ChatThread {
  id: string;
  /** Taken from the opening message, so an untouched thread reads "New chat". */
  title: string;
  /** Which surface this thread is working on — the tag beside its name. */
  surface: CanvasKind;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

/**
 * An item on a project's context shelf.
 *
 * The shelf is what every thread and agent in the project inherits: the goal,
 * uploaded sources, connected data, and anything promoted out of a chat. It is
 * per project rather than per thread, which is the whole point — it is how two
 * conversations in the same project end up arguing from the same facts.
 */
export interface ShelfItem {
  id: string;
  /** "Goal", "PDF", "Doc", "SQL", "Screen" — the chip before the name. */
  kind: string;
  name: string;
  /** Provenance line, e.g. "from PRD Writer · just now". */
  source: string;
  /** True when it was promoted out of a chat, which the panel outlines. */
  fromChat?: boolean;
  at: string;
}

export interface WorkspaceState {
  projects: Project[];
  agents: Agent[];
  skills: Skill[];
  runs: Run[];
  connection: Connection | null;
  /** Threads keyed by project id, newest first. */
  chats: Record<string, ChatThread[]>;
  /** False during SSR and the hydration pass, true once storage has been read. */
  ready: boolean;
}

const PENDING: WorkspaceState = {
  projects: [],
  agents: [],
  skills: [],
  runs: [],
  connection: null,
  chats: {},
  ready: false,
};

/* ─────────────────────────────────────────────────────────
   Persistence

   Storage is scoped per signed-in user, so signing in as somebody new opens
   a genuinely empty workspace rather than inheriting the previous session.
   ───────────────────────────────────────────────────────── */

/**
 * Threads as they are stored, tolerating the shape the previous build wrote.
 *
 * That build kept one flat transcript per project. Those messages are real
 * work, so they are lifted into a single thread rather than discarded — the
 * project reads as having one existing conversation, which is what it had.
 */
function parseThreads(value: unknown): ChatThread[] {
  if (!Array.isArray(value)) return [];

  // Old shape: an array of messages, each with a role. New shape: an array of
  // threads, each with a messages array. One probe tells them apart.
  const looksLikeMessages = value.some(
    (v) => v && typeof v === "object" && "role" in (v as object),
  );

  if (looksLikeMessages) {
    const messages = value as ChatMessage[];
    if (messages.length === 0) return [];
    const first = messages.find((m) => m.role === "user");
    return [
      {
        id: newId("thr"),
        title: first ? titleFrom(first.content) : "New chat",
        surface: "prd",
        createdAt: messages[0]?.at ?? new Date().toISOString(),
        updatedAt: messages[messages.length - 1]?.at ?? new Date().toISOString(),
        messages,
      },
    ];
  }

  return (value as ChatThread[]).filter(
    (t) => t && typeof t === "object" && Array.isArray(t.messages),
  );
}

/**
 * Every collection is coerced to an array on the way out. A hand-edited entry,
 * a half-written value, or a shape from an older build degrades to an empty
 * workspace instead of crashing a screen on `.map`.
 */
function parseWorkspace(raw: string | null): WorkspaceState {
  const empty: WorkspaceState = { ...PENDING, ready: true };
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as Partial<WorkspaceState> | null;
    if (!parsed || typeof parsed !== "object") return empty;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      agents: Array.isArray(parsed.agents) ? parsed.agents : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      runs: Array.isArray(parsed.runs) ? parsed.runs : [],
      connection: parsed.connection ?? null,
      chats:
        parsed.chats && typeof parsed.chats === "object" && !Array.isArray(parsed.chats)
          ? Object.fromEntries(
              Object.entries(parsed.chats).map(([id, v]) => [id, parseThreads(v)]),
            )
          : {},
      ready: true,
    };
  } catch {
    return empty;
  }
}

const registry = new Map<string, LocalStore<WorkspaceState>>();

function storeFor(email: string | null) {
  const key = `pmpro_workspace:${email ?? "anon"}`;
  return memoStore(registry, key, () =>
    createLocalStore<WorkspaceState>({
      key,
      parse: parseWorkspace,
      serverValue: PENDING,
      // `ready` describes this runtime, not the saved workspace, so it is
      // listed out rather than spread in.
      serialize: (v) =>
        JSON.stringify({
          projects: v.projects,
          agents: v.agents,
          skills: v.skills,
          runs: v.runs,
          connection: v.connection,
          chats: v.chats,
        }),
    }),
  );
}

/* ─────────────────────────────────────────────────────────
   Context
   ───────────────────────────────────────────────────────── */

interface WorkspaceCtx extends WorkspaceState {
  isConnected: boolean;

  createProject: (input: {
    name: string;
    goal: string;
    folder: string;
  }) => Project;
  deleteProject: (id: string) => void;

  createAgent: (input: Omit<Agent, "id">) => Agent;
  createSkill: (input: Omit<Skill, "id">) => Skill;

  connect: (c: Connection) => void;
  disconnect: () => void;

  logRun: (input: Omit<Run, "id" | "at">) => void;

  /** Open a new thread on a project and return it. */
  createThread: (projectId: string, surface?: CanvasKind) => ChatThread;
  /** Retag a thread with the surface it is working on. */
  setThreadSurface: (
    projectId: string,
    threadId: string,
    surface: CanvasKind,
  ) => void;
  /** Remove a thread and its transcript. */
  deleteThread: (projectId: string, threadId: string) => void;

  /**
   * Append a turn to a thread and return it. The thread takes its title from
   * the first message sent into it, so the sidebar stops saying "New chat".
   */
  appendChatMessage: (
    projectId: string,
    threadId: string,
    input: Omit<ChatMessage, "id" | "at">,
  ) => ChatMessage;
  /** Empty one thread's transcript, keeping the thread and the shelf. */
  clearChat: (projectId: string, threadId: string) => void;

  /** Put something on the project's shelf, where every thread reads it. */
  addToShelf: (
    projectId: string,
    input: Omit<ShelfItem, "id" | "at">,
  ) => ShelfItem;
  /** Take something back off the shelf. */
  removeFromShelf: (projectId: string, itemId: string) => void;

  /** Empty this workspace back to its starting state. */
  reset: () => void;
  /** Swap the whole workspace in one go. Used by the dev tools to seed. */
  replaceAll: (next: Omit<WorkspaceState, "ready">) => void;
}

const WorkspaceContext = createContext<WorkspaceCtx | null>(null);

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/** A thread names itself from its opening message, the way the sidebar shows it. */
export function titleFrom(text: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean) return "New chat";
  return clean.length > 32 ? `${clean.slice(0, 32)}…` : clean;
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const email = user?.email ?? null;

  const store = useMemo(() => storeFor(email), [email]);

  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const createProject = useCallback<WorkspaceCtx["createProject"]>(
    (input) => {
      const now = new Date().toISOString();
      const project: Project = {
        id: newId("prj"),
        name: input.name.trim() || "Untitled project",
        goal: input.goal.trim(),
        folder: input.folder,
        createdAt: now,
        updatedAt: now,
        agentIds: [],
        canvases: [
          { kind: "prd", name: "PRD", status: "Not started" },
          { kind: "decisions", name: "Decisions", status: "Not started" },
        ],
        // The goal is the first thing on the shelf, so the project's very
        // first chat already knows what it is for.
        shelf: [
          {
            id: newId("shf"),
            kind: "Goal",
            name: input.goal.trim() || "No goal set yet",
            source: "project owner · just now",
            at: now,
          },
        ],
      };
      // A project opens with a thread already in it: there is nowhere to type
      // otherwise, and an empty project with no way in reads as broken.
      const thread: ChatThread = {
        id: newId("thr"),
        title: "New chat",
        surface: "prd",
        createdAt: now,
        updatedAt: now,
        messages: [],
      };
      store.update((s) => ({
        ...s,
        projects: [project, ...s.projects],
        chats: { ...s.chats, [project.id]: [thread] },
      }));
      return project;
    },
    [store],
  );

  const deleteProject = useCallback(
    (projectId: string) => {
      store.update((s) => {
        // Threads are keyed by project, so they would otherwise outlive it.
        const chats = { ...s.chats };
        delete chats[projectId];
        return {
          ...s,
          projects: s.projects.filter((p) => p.id !== projectId),
          chats,
        };
      });
    },
    [store],
  );

  const createAgent = useCallback<WorkspaceCtx["createAgent"]>(
    (input) => {
      const agent: Agent = { ...input, id: newId("agt") };
      store.update((s) => ({ ...s, agents: [agent, ...s.agents] }));
      return agent;
    },
    [store],
  );

  const createSkill = useCallback<WorkspaceCtx["createSkill"]>(
    (input) => {
      const skill: Skill = { ...input, id: newId("skl") };
      store.update((s) => ({ ...s, skills: [skill, ...s.skills] }));
      return skill;
    },
    [store],
  );

  const connect = useCallback(
    (c: Connection) => store.update((s) => ({ ...s, connection: c })),
    [store],
  );

  const disconnect = useCallback(
    () => store.update((s) => ({ ...s, connection: null })),
    [store],
  );

  const logRun = useCallback<WorkspaceCtx["logRun"]>(
    (input) => {
      const run: Run = {
        ...input,
        id: newId("run"),
        at: new Date().toISOString(),
      };
      store.update((s) => ({ ...s, runs: [run, ...s.runs].slice(0, 200) }));
    },
    [store],
  );

  const createThread = useCallback<WorkspaceCtx["createThread"]>(
    (projectId, surface = "prd") => {
      const now = new Date().toISOString();
      const thread: ChatThread = {
        id: newId("thr"),
        title: "New chat",
        surface,
        createdAt: now,
        updatedAt: now,
        messages: [],
      };
      store.update((s) => ({
        ...s,
        chats: {
          ...s.chats,
          [projectId]: [thread, ...(s.chats[projectId] ?? [])],
        },
      }));
      return thread;
    },
    [store],
  );

  /** One helper for every edit that rewrites a single thread in place. */
  const patchThread = useCallback(
    (
      projectId: string,
      threadId: string,
      fn: (t: ChatThread) => ChatThread,
    ) => {
      store.update((s) => ({
        ...s,
        chats: {
          ...s.chats,
          [projectId]: (s.chats[projectId] ?? []).map((t) =>
            t.id === threadId ? fn(t) : t,
          ),
        },
      }));
    },
    [store],
  );

  const setThreadSurface = useCallback<WorkspaceCtx["setThreadSurface"]>(
    (projectId, threadId, surface) =>
      patchThread(projectId, threadId, (t) => ({ ...t, surface })),
    [patchThread],
  );

  const deleteThread = useCallback<WorkspaceCtx["deleteThread"]>(
    (projectId, threadId) => {
      store.update((s) => ({
        ...s,
        chats: {
          ...s.chats,
          [projectId]: (s.chats[projectId] ?? []).filter(
            (t) => t.id !== threadId,
          ),
        },
      }));
    },
    [store],
  );

  const appendChatMessage = useCallback<WorkspaceCtx["appendChatMessage"]>(
    (projectId, threadId, input) => {
      const message: ChatMessage = {
        ...input,
        id: newId("msg"),
        at: new Date().toISOString(),
      };
      patchThread(projectId, threadId, (t) => ({
        ...t,
        // The opening user turn names the thread; later turns leave it alone,
        // so a renamed or established thread keeps the name it has.
        title:
          t.messages.length === 0 && input.role === "user"
            ? titleFrom(input.content)
            : t.title,
        updatedAt: message.at,
        messages: [...t.messages, message],
      }));
      return message;
    },
    [patchThread],
  );

  const clearChat = useCallback<WorkspaceCtx["clearChat"]>(
    (projectId, threadId) =>
      patchThread(projectId, threadId, (t) => ({
        ...t,
        title: "New chat",
        messages: [],
      })),
    [patchThread],
  );

  const addToShelf = useCallback<WorkspaceCtx["addToShelf"]>(
    (projectId, input) => {
      const item: ShelfItem = {
        ...input,
        id: newId("shf"),
        at: new Date().toISOString(),
      };
      store.update((s) => ({
        ...s,
        projects: s.projects.map((p) =>
          p.id === projectId ? { ...p, shelf: [item, ...(p.shelf ?? [])] } : p,
        ),
      }));
      return item;
    },
    [store],
  );

  const removeFromShelf = useCallback<WorkspaceCtx["removeFromShelf"]>(
    (projectId, itemId) => {
      store.update((s) => ({
        ...s,
        projects: s.projects.map((p) =>
          p.id === projectId
            ? { ...p, shelf: (p.shelf ?? []).filter((i) => i.id !== itemId) }
            : p,
        ),
      }));
    },
    [store],
  );

  const reset = useCallback(
    () => store.set({ ...PENDING, ready: true }),
    [store],
  );

  const replaceAll = useCallback<WorkspaceCtx["replaceAll"]>(
    (next) => store.set({ ...next, ready: true }),
    [store],
  );

  const value = useMemo<WorkspaceCtx>(
    () => ({
      ...state,
      isConnected: state.connection !== null,
      createProject,
      deleteProject,
      createAgent,
      createSkill,
      connect,
      disconnect,
      logRun,
      createThread,
      setThreadSurface,
      deleteThread,
      appendChatMessage,
      clearChat,
      addToShelf,
      removeFromShelf,
      reset,
      replaceAll,
    }),
    [
      state,
      createProject,
      deleteProject,
      createAgent,
      createSkill,
      connect,
      disconnect,
      logRun,
      createThread,
      setThreadSurface,
      deleteThread,
      appendChatMessage,
      clearChat,
      addToShelf,
      removeFromShelf,
      reset,
      replaceAll,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used inside a WorkspaceProvider");
  }
  return ctx;
}
