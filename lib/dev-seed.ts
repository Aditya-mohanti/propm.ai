import type {
  Agent,
  ChatMessage,
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
 * The first project mirrors the Project Overview artboards, so both overview
 * layouts can be compared against the content they were designed around.
 * Numbers the overview shows are derived, not stored, so the runs and
 * decisions below have to be real for the headline figures to read right.
 *
 * Development only. Nothing here is shipped or seeded automatically.
 */

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

const PROJECTS: Project[] = [
  {
    id: "prj_demo1",
    name: "Increase user engagement",
    goal: "Increase DAU in platform",
    folder: "Growth",
    startedAt: "4 Mar",
    metric: { value: "12%", label: "reach 2nd session" },
    createdAt: hoursAgo(240),
    updatedAt: hoursAgo(0.2),
    agentIds: ["agt_demo1", "agt_demo2", "agt_demo3"],
    suggestions: [
      "Draft the PRD from research",
      "Size the engagement opportunity",
      "Sketch the second-session flow",
      "Find what is blocking us",
    ],
    context: [
      { kind: "Goal", label: "Increase DAU in platform" },
      { kind: "PDF", label: "strategy-2026.pdf" },
      { kind: "Notion", label: "engagement research" },
      { kind: "SQL", label: "events_weekly" },
      { kind: "Notes", label: "4 call notes" },
    ],
    decisions: [
      {
        id: "dec_1",
        title: "Sticky CTA over a second hero",
        when: "12 Mar",
        source: "the prototype",
        status: "decided",
      },
      {
        id: "dec_2",
        title: "Mobile web first, not the app",
        when: "9 Mar",
        source: "the PRD",
        status: "decided",
      },
      {
        id: "dec_3",
        title: "Skip pricing on the onboarding path",
        when: "7 Mar",
        source: "strategy-2026.pdf",
        status: "decided",
      },
      {
        id: "dec_4",
        title: "Target the solo-PM segment first",
        when: "5 Mar",
        source: "the research",
        status: "decided",
      },
      {
        id: "dec_5",
        title: "Who owns the funnel export",
        when: "",
        source: "the PRD",
        status: "open",
        note: "blocking two criteria",
      },
    ],
    canvases: [
      {
        kind: "research",
        name: "Research",
        status: "3 sources",
        inherits: [
          "Goal · Increase DAU in platform",
          "Decision · Mobile web first",
          "Notes · 4 call notes",
        ],
      },
      {
        kind: "prd",
        name: "PRD",
        status: "draft 3",
        inherits: [
          "Research · segment sizing v2",
          "Decision · 15% CTA target (provisional)",
          "Context · strategy-2026.pdf",
        ],
      },
      {
        kind: "prototype",
        name: "Design",
        status: "3 screens",
        inherits: [
          "PRD · draft 3",
          "Decision · sticky CTA over a second hero",
          "Notes · usability call, 5 Mar",
        ],
      },
      {
        kind: "data",
        name: "Data",
        status: "Not started",
        inherits: [
          "Goal · Increase DAU in platform",
          "Warehouse · events_weekly",
          "PRD · success criteria",
        ],
      },
      {
        kind: "notes",
        name: "Notes",
        status: "4 notes",
        inherits: [
          "Goal · Increase DAU in platform",
          "Team · 3 members",
        ],
      },
      {
        kind: "decisions",
        name: "Decisions",
        status: "Not started",
        inherits: [
          "PRD · risks",
          "Design · prototype brief",
          "Research · pricing sweep",
        ],
      },
    ],
  },
  {
    id: "prj_demo2",
    name: "Referral loop",
    goal: "Increase D7 retention",
    folder: "Growth",
    startedAt: "20 Feb",
    createdAt: hoursAgo(400),
    updatedAt: hoursAgo(52),
    agentIds: ["agt_demo2"],
    context: [{ kind: "Goal", label: "Increase D7 retention" }],
    decisions: [
      {
        id: "dec_r1",
        title: "Double-sided reward, not single",
        when: "2 Mar",
        source: "the research",
        status: "decided",
      },
    ],
    canvases: [
      { kind: "prd", name: "PRD", status: "Drafting", detail: "draft 1" },
      { kind: "decisions", name: "Decisions", status: "1 decided" },
    ],
  },
  {
    id: "prj_demo3",
    name: "API docs revamp",
    goal: "Cut support tickets by 40%",
    folder: "Platform",
    startedAt: "14 Feb",
    createdAt: hoursAgo(700),
    updatedAt: hoursAgo(96),
    agentIds: [],
    canvases: [
      { kind: "prd", name: "PRD", status: "In review", detail: "draft 2" },
    ],
  },
  {
    // Deliberately bare: checks that a project with nothing in it still reads
    // as a project rather than as a broken card, and that every overview
    // section falls back to its empty state.
    id: "prj_demo4",
    name: "Permissions model",
    goal: "",
    folder: "Platform",
    createdAt: hoursAgo(20),
    updatedAt: hoursAgo(20),
    agentIds: [],
    canvases: [],
  },
];

const SKILLS: Skill[] = [
  {
    id: "skl_1",
    name: "Market sizing",
    kind: "Research",
    body: "TAM, SAM and SOM from public filings and pricing pages, with every assumption listed.",
  },
  {
    id: "skl_2",
    name: "Competitive teardown",
    kind: "Research",
    body: "Walks a rival onboarding and pricing flow, returns a diff against ours.",
  },
  {
    id: "skl_3",
    name: "Pricing benchmark",
    kind: "Research",
    body: "Collects list prices and packaging across a named set of competitors.",
  },
  {
    id: "skl_4",
    name: "Spec drafting",
    kind: "Writing",
    body: "Problem, success criteria, scope cuts and open questions, in the house template.",
  },
  {
    id: "skl_5",
    name: "Assumption check",
    kind: "Review",
    body: "Flags claims in a document that have no source behind them.",
  },
  {
    id: "skl_6",
    name: "Flow sketching",
    kind: "Planning",
    body: "Turns a written flow into screen-by-screen states, including the empty and error ones.",
  },
];

const AGENTS: Agent[] = [
  {
    id: "agt_demo1",
    name: "Research Agent",
    niche: "Market research",
    brief:
      "Pulls market size, competitor packaging and pricing for a named category, and reports what it could not verify.",
    skillIds: ["skl_1", "skl_2", "skl_3", "skl_4", "skl_5", "skl_6"],
    model: "Claude Sonnet 4.5",
    canvases: ["Doc", "Sheet"],
  },
  {
    id: "agt_demo2",
    name: "PRD Writer",
    niche: "Specs",
    brief: "",
    skillIds: ["skl_4", "skl_5", "skl_1"],
    model: "Claude Sonnet 4.5",
    canvases: ["Doc"],
  },
  {
    id: "agt_demo3",
    name: "Prototyper",
    niche: "Design",
    brief:
      "Draws screens against the current spec and flags where the two disagree.",
    skillIds: ["skl_6", "skl_4", "skl_2", "skl_5"],
    model: "Claude Opus 4.1",
    canvases: ["Prototype"],
  },
];

/** The four named passes from the artboard, newest first. */
const NAMED_RUNS: [string, string, string, number][] = [
  ["added a Risks section to draft 3", "PRD Writer", "PRD", 0.2],
  ["logged the sticky CTA decision", "PRD Writer", "PRD", 2],
  ["drew Onboarding — step 2", "Prototyper", "Prototype", 5],
  ["sized the solo-PM segment", "Research Agent", "Doc", 26],
];

/** Filler so "12 runs this week" is a real count rather than a caption. */
const FILLER_RUNS: [string, string, string, number][] = [
  ["checked assumptions in draft 2", "PRD Writer", "PRD", 30],
  ["swept competitor pricing", "Research Agent", "Doc", 44],
  ["drew the empty state", "Prototyper", "Prototype", 52],
  ["rewrote the success criteria", "PRD Writer", "PRD", 68],
  ["pulled events_weekly for the funnel", "Research Agent", "Doc", 74],
  ["drew Onboarding — step 1", "Prototyper", "Prototype", 96],
  ["benchmarked activation rates", "Research Agent", "Doc", 120],
  ["outlined scope cuts", "PRD Writer", "PRD", 140],
];

const RUNS: Run[] = [
  ...NAMED_RUNS,
  ...FILLER_RUNS,
].map(([title, agent, canvas, h], i) => ({
  id: `run_d1_${i}`,
  title,
  agent,
  canvas,
  projectId: "prj_demo1",
  projectName: "Increase user engagement",
  model: agent === "Prototyper" ? "Claude Opus 4.1" : "Claude Sonnet 4.5",
  at: hoursAgo(h),
}));

RUNS.push({
  id: "run_d2_0",
  title: "Launch beat sequence",
  agent: "PRD Writer",
  canvas: "Doc",
  projectId: "prj_demo2",
  projectName: "Referral loop",
  model: "Claude Opus 4.1",
  at: hoursAgo(52),
});

const CONNECTION: Connection = {
  provider: "claude",
  accountEmail: "you@yourcompany.com",
  plan: "Claude Pro",
  method: "oauth",
  connectedAt: hoursAgo(72),
  models: ["Claude Sonnet 4.5", "Claude Opus 4.1", "Claude Haiku 4.5"],
};

/** A short prior thread, so chat history is visible without typing one. */
const CHATS: Record<string, ChatMessage[]> = {
  prj_demo1: [
    {
      id: "msg_d1",
      role: "user",
      content: "What is the biggest risk in the current PRD draft?",
      at: hoursAgo(3),
    },
    {
      id: "msg_d2",
      role: "assistant",
      content:
        "The success criteria are anchored on a desktop conversion rate, and there is no funnel export to check them against. Until someone owns that export, the 15% CTA target is a guess rather than a target — which is also why it is still marked provisional.",
      at: hoursAgo(3),
      provider: "claude",
      model: "claude-opus-5",
    },
  ],
};

export function demoWorkspace(): WorkspaceState {
  return {
    projects: PROJECTS,
    agents: AGENTS,
    skills: SKILLS,
    runs: RUNS,
    connection: CONNECTION,
    chats: CHATS,
    ready: true,
  };
}

export const DEV_USER = {
  name: "Test User",
  email: "test@propm.local",
};
