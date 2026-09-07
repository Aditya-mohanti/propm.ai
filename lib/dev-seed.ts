import type {
  Agent,
  Connection,
  Project,
  Run,
  Skill,
  WorkspaceState,
} from "@/lib/workspace-context";

/**
 * Representative workspace content for local design work.
 *
 * The empty states are only half the picture — a layout that reads well with
 * nothing in it can still fall apart with six projects and a long run log.
 * This gives something to check the populated side against without having to
 * hand-enter it after every `localStorage.clear()`.
 *
 * Development only. Nothing here is shipped or seeded automatically.
 */

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

const PROJECTS: Project[] = [
  {
    id: "prj_demo1",
    name: "Mobile onboarding",
    goal: "Fix the step-2 drop-off",
    folder: "Growth",
    createdAt: hoursAgo(240),
    updatedAt: hoursAgo(2),
    agentIds: ["agt_demo1", "agt_demo3"],
    canvases: [
      { kind: "prd", name: "PRD", status: "In review", detail: "draft 3" },
      { kind: "decisions", name: "Decisions", status: "1 open" },
      { kind: "prototype", name: "Prototype", status: "3 screens" },
    ],
  },
  {
    id: "prj_demo2",
    name: "Referral loop",
    goal: "Increase D7 retention",
    folder: "Growth",
    createdAt: hoursAgo(400),
    updatedAt: hoursAgo(52),
    agentIds: ["agt_demo2"],
    canvases: [
      { kind: "prd", name: "PRD", status: "Drafting", detail: "draft 1" },
      { kind: "decisions", name: "Decisions", status: "2 decided" },
    ],
  },
  {
    id: "prj_demo3",
    name: "API docs revamp",
    goal: "Cut support tickets by 40%",
    folder: "Platform",
    createdAt: hoursAgo(700),
    updatedAt: hoursAgo(96),
    agentIds: [],
    canvases: [
      { kind: "prd", name: "PRD", status: "In review", detail: "draft 2" },
      { kind: "decisions", name: "Decisions", status: "2 open" },
    ],
  },
  {
    // Deliberately bare: checks that a project with nothing in it still reads
    // as a project rather than as a broken card.
    id: "prj_demo4",
    name: "Permissions model",
    goal: "",
    folder: "Platform",
    createdAt: hoursAgo(20),
    updatedAt: hoursAgo(20),
    agentIds: [],
    canvases: [
      { kind: "prd", name: "PRD", status: "Not started" },
      { kind: "decisions", name: "Decisions", status: "Not started" },
    ],
  },
];

const AGENTS: Agent[] = [
  {
    id: "agt_demo1",
    name: "Research Agent",
    niche: "Market research",
    brief:
      "Pulls market size, competitor packaging and pricing for a named category, and reports what it could not verify.",
    skillIds: ["skl_demo1", "skl_demo2"],
    model: "Claude Sonnet 4.5",
    canvases: ["Doc", "Sheet"],
  },
  {
    id: "agt_demo2",
    name: "GTM Strategy Agent",
    niche: "Go-to-market",
    brief:
      "Orders launch beats across channels with an owner and a date against each one.",
    skillIds: ["skl_demo3"],
    model: "Claude Opus 4.1",
    canvases: ["Doc"],
  },
  {
    id: "agt_demo3",
    name: "PRD Writer",
    niche: "Design & specs",
    // Empty brief on purpose — the card has to survive missing copy.
    brief: "",
    skillIds: ["skl_demo4"],
    model: "Claude Sonnet 4.5",
    canvases: ["Doc"],
  },
];

const SKILLS: Skill[] = [
  {
    id: "skl_demo1",
    name: "Market sizing",
    kind: "Research",
    body: "TAM, SAM and SOM from public filings and pricing pages, with every assumption listed.",
  },
  {
    id: "skl_demo2",
    name: "Competitive teardown",
    kind: "Research",
    body: "Walks a rival onboarding and pricing flow, returns a diff against ours.",
  },
  {
    id: "skl_demo3",
    name: "GTM sequencing",
    kind: "Planning",
    body: "Orders launch beats across channels with owners and a date per beat.",
  },
  {
    id: "skl_demo4",
    name: "Assumption check",
    kind: "Review",
    body: "Flags claims in a document that have no source behind them.",
  },
];

const RUNS: Run[] = [
  {
    id: "run_demo1",
    title: "Rewrote the success criteria",
    agent: "PRD Writer",
    canvas: "PRD",
    projectId: "prj_demo1",
    projectName: "Mobile onboarding",
    model: "Claude Sonnet 4.5",
    at: hoursAgo(0.2),
  },
  {
    id: "run_demo2",
    title: "Sized the solo-PM segment",
    agent: "Research Agent",
    canvas: "Doc",
    projectId: "prj_demo1",
    projectName: "Mobile onboarding",
    model: "Claude Sonnet 4.5",
    at: hoursAgo(2),
  },
  {
    id: "run_demo3",
    title: "Drew onboarding step 2",
    agent: "PRD Writer",
    canvas: "Prototype",
    projectId: "prj_demo1",
    projectName: "Mobile onboarding",
    model: "Claude Sonnet 4.5",
    at: hoursAgo(5),
  },
  {
    id: "run_demo4",
    title: "Launch beat sequence",
    agent: "GTM Strategy Agent",
    canvas: "Doc",
    projectId: "prj_demo2",
    projectName: "Referral loop",
    model: "Claude Opus 4.1",
    at: hoursAgo(26),
  },
  {
    id: "run_demo5",
    title: "Churn model, first fit",
    agent: "Research Agent",
    canvas: "Model",
    projectId: "prj_demo2",
    projectName: "Referral loop",
    model: "Claude Haiku 4.5",
    at: hoursAgo(50),
  },
];

const CONNECTION: Connection = {
  provider: "claude",
  accountEmail: "you@yourcompany.com",
  plan: "Claude Pro",
  method: "oauth",
  connectedAt: hoursAgo(72),
  models: ["Claude Sonnet 4.5", "Claude Opus 4.1", "Claude Haiku 4.5"],
};

export function demoWorkspace(): WorkspaceState {
  return {
    projects: PROJECTS,
    agents: AGENTS,
    skills: SKILLS,
    runs: RUNS,
    connection: CONNECTION,
    ready: true,
  };
}

export const DEV_USER = {
  name: "Test User",
  email: "test@propm.local",
};
