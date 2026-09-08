"use client";

import type { Agent, CanvasKind, Project, Run } from "@/lib/workspace-context";
import { withinWeek } from "@/lib/format";
import {
  DocIcon,
  PhoneIcon,
  SearchIcon,
  ChartIcon,
  NoteIcon,
  BranchIcon,
} from "./icons";

export interface SurfaceDef {
  kind: CanvasKind;
  label: string;
  /** Shown in the Option B detail panel and in the canvas empty states. */
  blurb: string;
  icon: React.ReactNode;
}

/**
 * The six surfaces a project can hold, in the order the overview shows them.
 * A project only stores the ones it has actually used, so this is the
 * canonical list and `project.canvases` supplies status on top.
 */
export const SURFACES: SurfaceDef[] = [
  {
    kind: "research",
    label: "Research",
    blurb:
      "Market size, competitor teardowns and pricing, with sources attached and gaps called out.",
    icon: <SearchIcon size={19} />,
  },
  {
    kind: "prd",
    label: "PRD",
    blurb:
      "Problem, success criteria, scope cuts and open questions.",
    icon: <DocIcon size={19} />,
  },
  {
    kind: "prototype",
    label: "Design",
    blurb:
      "Screens and flows drawn against the spec, so the two cannot drift apart.",
    icon: <PhoneIcon size={19} />,
  },
  {
    kind: "data",
    label: "Data",
    blurb:
      "Charts and BI views over your revenue, growth, funnel and retention numbers.",
    icon: <ChartIcon size={19} />,
  },
  {
    kind: "notes",
    label: "Notes",
    blurb:
      "Call notes and half-formed thinking, promotable into the PRD later.",
    icon: <NoteIcon size={19} />,
  },
  {
    kind: "decisions",
    label: "Decisions",
    blurb:
      "What was decided, by whom, off which surface, and what it ruled out.",
    icon: <BranchIcon size={19} />,
  },
];

export interface ResolvedSurface extends SurfaceDef {
  status: string;
  started: boolean;
  inherits: string[];
}

export interface AgentOnProject {
  id: string;
  name: string;
  initials: string;
  meta: string;
  /** "idle", or how long ago it last ran on this project. */
  state: string;
  busy: boolean;
}

export interface ProjectOverview {
  surfaces: ResolvedSurface[];
  activeCount: number;
  /** Surfaces that have been worked, over the total available. */
  surfaceLabel: string;
  runsThisWeek: number;
  decisionsLocked: number;
  openQuestions: number;
  decisions: Project["decisions"];
  context: NonNullable<Project["context"]>;
  suggestions: string[];
  agents: AgentOnProject[];
  movement: Run[];
}

const DEFAULT_SUGGESTIONS = [
  "Draft the PRD from research",
  "Size the opportunity",
  "Sketch the core flow",
  "Find what is blocking us",
];

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Derives everything both overview layouts display. Most of the headline
 * numbers are computed from runs and decisions rather than stored, so they
 * cannot drift out of step with the data underneath them.
 */
export function projectOverview(
  project: Project,
  allAgents: Agent[],
  allRuns: Run[],
): ProjectOverview {
  const byKind = new Map(project.canvases.map((c) => [c.kind, c]));

  const surfaces: ResolvedSurface[] = SURFACES.map((s) => {
    const stored = byKind.get(s.kind);
    const status = stored?.status ?? "Not started";
    return {
      ...s,
      status,
      started: status !== "Not started",
      inherits: stored?.inherits ?? [],
    };
  });

  const projectRuns = allRuns.filter((r) => r.projectId === project.id);
  const decisions = project.decisions ?? [];

  const agents: AgentOnProject[] = (project.agentIds ?? [])
    .map((id) => allAgents.find((a) => a.id === id))
    .filter((a): a is Agent => Boolean(a))
    .map((a) => {
      // Last run is looked up by agent name because runs record the name, not
      // the id — an agent renamed mid-project simply reads as idle.
      const last = projectRuns.find((r) => r.agent === a.name);
      return {
        id: a.id,
        name: a.name,
        initials: initialsOf(a.name),
        meta: `${a.niche} · ${a.skillIds.length} ${
          a.skillIds.length === 1 ? "skill" : "skills"
        }`,
        state: last ? `ran ${relativeShort(last.at)}` : "idle",
        busy: Boolean(last),
      };
    });

  const activeCount = surfaces.filter((s) => s.started).length;

  return {
    surfaces,
    activeCount,
    surfaceLabel: `${activeCount}/${surfaces.length}`,
    runsThisWeek: projectRuns.filter((r) => withinWeek(r.at)).length,
    decisionsLocked: decisions.filter((d) => d.status === "decided").length,
    openQuestions: decisions.filter((d) => d.status === "open").length,
    decisions,
    context: project.context ?? [],
    suggestions:
      project.suggestions && project.suggestions.length > 0
        ? project.suggestions
        : DEFAULT_SUGGESTIONS,
    agents,
    movement: projectRuns.slice(0, 4),
  };
}

function relativeShort(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "recently";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
