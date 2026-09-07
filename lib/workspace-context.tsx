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

export interface WorkspaceState {
  projects: Project[];
  agents: Agent[];
  skills: Skill[];
  runs: Run[];
  connection: Connection | null;
  /** False during SSR and the hydration pass, true once storage has been read. */
  ready: boolean;
}

const PENDING: WorkspaceState = {
  projects: [],
  agents: [],
  skills: [],
  runs: [],
  connection: null,
  ready: false,
};

/* ─────────────────────────────────────────────────────────
   Persistence

   Storage is scoped per signed-in user, so signing in as somebody new opens
   a genuinely empty workspace rather than inheriting the previous session.
   ───────────────────────────────────────────────────────── */

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

  /** Empty this workspace back to its starting state. */
  reset: () => void;
  /** Swap the whole workspace in one go. Used by the dev tools to seed. */
  replaceAll: (next: Omit<WorkspaceState, "ready">) => void;
}

const WorkspaceContext = createContext<WorkspaceCtx | null>(null);

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
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
      };
      store.update((s) => ({ ...s, projects: [project, ...s.projects] }));
      return project;
    },
    [store],
  );

  const deleteProject = useCallback(
    (projectId: string) => {
      store.update((s) => ({
        ...s,
        projects: s.projects.filter((p) => p.id !== projectId),
      }));
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
