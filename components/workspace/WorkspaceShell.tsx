"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useWorkspace } from "@/lib/workspace-context";
import { PROVIDERS } from "@/lib/providers";

import ConnectProviderDialog from "./ConnectProviderDialog";
import NewProjectDialog from "./NewProjectDialog";
import EmptyState from "./EmptyState";
import ProjectsScreen from "./screens/ProjectsScreen";
import AgentsScreen from "./screens/AgentsScreen";
import SkillsScreen from "./screens/SkillsScreen";
import RunsScreen from "./screens/RunsScreen";
import AccountScreen from "./screens/AccountScreen";
import CanvasScreen from "./screens/CanvasScreen";
import ProjectHubScreen from "./screens/ProjectHubScreen";
import DevBar, { DEV_TOOLS_ENABLED } from "./DevBar";
import { DEV_USER } from "@/lib/dev-seed";
import {
  FolderIcon,
  ClockIcon,
  RobotIcon,
  SparkIcon,
  DocIcon,
  BranchIcon,
  PhoneIcon,
  SearchIcon,
  ChartIcon,
  NoteIcon,
  GridIcon,
  GearIcon,
  PlugIcon,
} from "./icons";

type ScreenId =
  | "projects"
  | "runs"
  | "agents"
  | "skills"
  | "project"
  | "prd"
  | "prototype"
  | "research"
  | "data"
  | "notes"
  | "decisions"
  | "account";

/** Screens that render a canvas and therefore need a project open. */
const CANVAS_SCREENS = [
  "prd",
  "prototype",
  "research",
  "data",
  "notes",
  "decisions",
] as const;

type CanvasScreenId = (typeof CANVAS_SCREENS)[number];

function isCanvasScreen(id: ScreenId): id is CanvasScreenId {
  return (CANVAS_SCREENS as readonly string[]).includes(id);
}

const NAV: {
  group: string;
  items: { id: ScreenId; label: string; icon: React.ReactNode }[];
}[] = [
  {
    group: "Workspace",
    items: [
      { id: "projects", label: "Projects", icon: <FolderIcon size={16} /> },
      { id: "runs", label: "Run history", icon: <ClockIcon size={16} /> },
    ],
  },
  {
    group: "Build",
    items: [
      { id: "agents", label: "Agents", icon: <RobotIcon size={16} /> },
      { id: "skills", label: "Skills", icon: <SparkIcon size={16} /> },
    ],
  },
  {
    group: "Project",
    items: [
      { id: "project", label: "Overview", icon: <GridIcon size={16} /> },
      { id: "research", label: "Research", icon: <SearchIcon size={16} /> },
      { id: "prd", label: "PRD", icon: <DocIcon size={16} /> },
      { id: "prototype", label: "Design", icon: <PhoneIcon size={16} /> },
      { id: "data", label: "Data", icon: <ChartIcon size={16} /> },
      { id: "notes", label: "Notes", icon: <NoteIcon size={16} /> },
      { id: "decisions", label: "Decisions", icon: <BranchIcon size={16} /> },
    ],
  },
];

const TITLES: Record<ScreenId, string> = {
  projects: "Projects",
  runs: "Run history",
  agents: "Agents",
  skills: "Skills",
  project: "Overview",
  prd: "PRD",
  prototype: "Design & prototyping",
  research: "Research",
  data: "Data",
  notes: "Notes",
  decisions: "Decisions",
  account: "Account",
};

export default function WorkspaceShell() {
  const { user, ready: authReady, signIn } = useAuth();
  const {
    projects,
    agents,
    skills,
    connection,
    isConnected,
    ready: wsReady,
  } = useWorkspace();

  const [screen, setScreen] = useState<ScreenId>("projects");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  // Hold the frame until the stored session resolves, so a signed-in user
  // never sees the sign-in gate flash past on the way in.
  if (!authReady) {
    return (
      <div
        data-workspace
        aria-busy="true"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--fg3)" }}>
          Opening your workspace…
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        data-workspace
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
          padding: 24,
        }}
      >
        <div style={{ width: "100%", maxWidth: 520 }}>
          <EmptyState
            icon={<FolderIcon size={22} />}
            title="Sign in to open your workspace"
            body="Projects, agents and run history are tied to your account, so there is nothing to show until we know who you are."
            actions={[
              { label: "Go to sign in", href: "/#waitlist" },
              ...(DEV_TOOLS_ENABLED
                ? [
                    {
                      label: "Skip sign-in (dev)",
                      onClick: () => signIn(DEV_USER),
                      variant: "ghost" as const,
                    },
                  ]
                : [{ label: "Back to the site", href: "/", variant: "ghost" as const }]),
            ]}
          />
        </div>
        <DevBar />
      </div>
    );
  }

  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? null;

  function openProject(id: string) {
    setActiveProjectId(id);
    setScreen("project");
  }

  const counts: Partial<Record<ScreenId, number>> = {
    projects: projects.length,
    agents: agents.length,
    skills: skills.length,
  };

  return (
    <div
      data-workspace
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
        background: "var(--bg)",
        color: "var(--fg1)",
        fontSize: 14,
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 236,
          flex: "0 0 236px",
          borderRight: "1px solid var(--border)",
          background: "var(--muted)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "16px 16px 14px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "var(--brand-800)",
              color: "var(--white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            P
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            PmPro.ai
          </span>
        </Link>

        <nav
          style={{ padding: "0 10px", display: "flex", flexDirection: "column" }}
          aria-label="Workspace"
        >
          {NAV.map((section) => (
            <div key={section.group} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                className="mono-label"
                style={{ padding: "12px 8px 5px", fontSize: 10.5, letterSpacing: "0.08em" }}
              >
                {section.group.toUpperCase()}
              </span>
              {section.items.map((item) => {
                const on = screen === item.id;
                const count = counts[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScreen(item.id)}
                    aria-current={on ? "page" : undefined}
                    style={navBtn(on)}
                  >
                    <span style={{ display: "flex", color: on ? "var(--brand-700)" : "var(--fg3)" }}>
                      {item.icon}
                    </span>
                    {item.label}
                    {typeof count === "number" && count > 0 && (
                      <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--fg3)" }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: 14,
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          {isConnected && connection ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12,
                color: "var(--fg2)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--green-600)",
                }}
              />
              {PROVIDERS[connection.provider].name} · {connection.plan}
            </span>
          ) : (
            <button
              type="button"
              className="btn-primary"
              style={{ height: 32, padding: "0 12px", justifyContent: "center", gap: 7 }}
              onClick={() => setConnectOpen(true)}
            >
              <PlugIcon size={14} />
              Connect provider
            </button>
          )}

          <button type="button" onClick={() => setScreen("account")} style={navBtn(screen === "account")}>
            <span style={{ display: "flex", color: screen === "account" ? "var(--brand-700)" : "var(--fg3)" }}>
              <GearIcon size={16} />
            </span>
            Account
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            padding: "13px 22px",
            borderBottom: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          {activeProject ? (
            <button
              type="button"
              onClick={() => setScreen("project")}
              style={{
                border: 0,
                background: "transparent",
                padding: 0,
                fontSize: 12.5,
                fontFamily: "inherit",
                color: "var(--fg2)",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                textDecorationColor: "var(--input)",
              }}
            >
              {activeProject.name}
            </button>
          ) : (
            <span style={{ fontSize: 12.5, color: "var(--fg3)" }}>
              All projects
            </span>
          )}
          <span style={{ fontSize: 12.5, color: "var(--fg3)" }}>/</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 600 }}>
            {TITLES[screen]}
          </span>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            {!isConnected && (
              <button
                type="button"
                className="btn-ghost"
                style={{ height: 32, padding: "0 12px" }}
                onClick={() => setConnectOpen(true)}
              >
                Connect provider
              </button>
            )}
            <button
              type="button"
              className="btn-primary"
              style={{ height: 32, padding: "0 14px" }}
              onClick={() => setNewProjectOpen(true)}
            >
              New project
            </button>
          </div>
        </header>

        {/* A single, quiet nudge rather than a blocking wall — you can build
            projects, agents and skills before connecting anything. */}
        {wsReady && !isConnected && screen !== "account" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              padding: "10px 22px",
              background: "var(--brand-tint-bg)",
              borderBottom: "1px solid var(--brand-tint-border)",
              fontSize: 12.5,
              color: "var(--brand-900)",
            }}
          >
            <PlugIcon size={15} />
            You can set everything up now, but agents cannot run until Claude or
            ChatGPT is connected.
            <button
              type="button"
              onClick={() => setConnectOpen(true)}
              style={{
                marginLeft: "auto",
                border: 0,
                background: "transparent",
                color: "var(--brand-800)",
                fontSize: 12.5,
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Connect now
            </button>
          </div>
        )}

        <div style={{ flex: 1, padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          <ScreenHeading screen={screen} />

          {screen === "projects" && (
            <ProjectsScreen
              onNewProject={() => setNewProjectOpen(true)}
              onOpenProject={openProject}
            />
          )}

          {screen === "runs" && (
            <RunsScreen
              onGoToProjects={() => setScreen("projects")}
              onConnect={() => setConnectOpen(true)}
            />
          )}

          {screen === "agents" && (
            <AgentsScreen onConnect={() => setConnectOpen(true)} />
          )}

          {screen === "skills" && <SkillsScreen />}

          {screen === "project" && (
            <ProjectHubScreen
              activeProjectId={activeProjectId}
              onOpenCanvas={(kind) => setScreen(kind as ScreenId)}
              onGoToProjects={() => setScreen("projects")}
            />
          )}

          {isCanvasScreen(screen) && (
            <CanvasScreen
              kind={screen}
              activeProjectId={activeProjectId}
              onGoToProjects={() => setScreen("projects")}
            />
          )}

          {screen === "account" && (
            <AccountScreen onConnect={() => setConnectOpen(true)} />
          )}
        </div>
      </main>

      {connectOpen && (
        <ConnectProviderDialog onClose={() => setConnectOpen(false)} />
      )}
      {newProjectOpen && (
        <NewProjectDialog
          onClose={() => setNewProjectOpen(false)}
          onCreated={(p) => {
            setActiveProjectId(p.id);
            setScreen("projects");
          }}
        />
      )}

      <DevBar />
    </div>
  );
}

function ScreenHeading({ screen }: { screen: ScreenId }) {
  const sub: Record<ScreenId, string> = {
    projects:
      "Every project is one goal with its own canvases, agents and run history.",
    runs: "Every agent pass, what it touched and which model answered.",
    agents:
      "Give an agent a niche, a set of skills and the canvases it may write.",
    skills: "A skill is a named procedure any agent can borrow.",
    project: "Everything this project can hold, in one place.",
    prd: "Problem, success criteria, scope cuts and open questions.",
    prototype: "Screens and flows drawn against this project's spec.",
    research: "Market size, competitors and pricing, with sources attached.",
    data: "Charts and BI views over your revenue, growth and funnel numbers.",
    notes: "Loose thinking that is not ready to be a document yet.",
    decisions: "What was decided, by whom, and what it ruled out.",
    account: "Your session, your provider connection and where the runs went.",
  };

  return (
    <div>
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.015em",
        }}
      >
        {TITLES[screen]}
      </h1>
      <p
        style={{
          margin: "5px 0 0",
          maxWidth: "62ch",
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--fg2)",
          textWrap: "pretty",
        }}
      >
        {sub[screen]}
      </p>
    </div>
  );
}

function navBtn(on: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 9,
    height: 32,
    padding: "0 8px",
    width: "100%",
    borderRadius: "var(--radius-md)",
    border: `1px solid ${on ? "var(--brand-tint-border)" : "transparent"}`,
    background: on ? "var(--brand-tint-bg)" : "transparent",
    color: on ? "var(--brand-900)" : "var(--fg2)",
    fontSize: 13,
    fontFamily: "var(--font-sans)",
    textAlign: "left",
    cursor: "pointer",
  };
}
