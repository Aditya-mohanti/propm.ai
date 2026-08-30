export const NAV_LINKS = [
  { href: "#stations", label: "Stations" },
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
] as const;

export const PROBLEM_TABS = [
  "ChatGPT tab",
  "Notion doc",
  "Figma file",
  "Slack thread",
  "Spreadsheet",
] as const;

export const STEPS = [
  {
    num: 1,
    title: "Open a station",
    body: "Pick agents, playground, docs, or prototype based on what you're doing right now.",
  },
  {
    num: 2,
    title: "Brief it",
    body: "Tell an agent the job, or start typing straight into the canvas yourself.",
  },
  {
    num: 3,
    title: "Work the canvas",
    body: "Edit, question, and refine in place — no exporting to check your work elsewhere.",
  },
  {
    num: 4,
    title: "Hand it off",
    body: "Share a doc, a prototype link, or roll the output straight into the next station.",
  },
] as const;

export type FeatureIconName =
  | "model"
  | "history"
  | "skills"
  | "team"
  | "link"
  | "audit";

export const FEATURES: {
  icon: FeatureIconName;
  title: string;
  body: string;
}[] = [
  {
    icon: "model",
    title: "Bring your own model",
    body: "Point any agent at the model that fits the job and the budget.",
  },
  {
    icon: "history",
    title: "Version history",
    body: "Every doc and prototype keeps its full edit trail — yours and your agents'.",
  },
  {
    icon: "skills",
    title: "Skill library",
    body: "Reuse a skill — SQL, market sizing, tone-of-voice — across every agent you build.",
  },
  {
    icon: "team",
    title: "Team roster",
    body: "Invite teammates to a station or share an agent across the team.",
  },
  {
    icon: "link",
    title: "Shareable links",
    body: "Send a doc or a prototype without exporting it to somewhere else first.",
  },
  {
    icon: "audit",
    title: "Audit trail",
    body: "See what an agent changed, when, and off which source — nothing silent.",
  },
];

export const FOOTER_TAGLINE =
  "Built for product managers who are tired of six tabs open at once.";
