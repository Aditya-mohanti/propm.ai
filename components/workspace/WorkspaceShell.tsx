"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useWorkspace, type CanvasKind } from "@/lib/workspace-context";
import { PROVIDERS } from "@/lib/providers";
import Logo from "@/components/ui/Logo";

import ConnectProviderDialog from "./ConnectProviderDialog";
import NewProjectDialog from "./NewProjectDialog";
import EmptyState from "./EmptyState";
import ChatPane from "./ChatPane";
import ContextPanel from "./ContextPanel";
import ProjectsScreen from "./screens/ProjectsScreen";
import AgentsScreen from "./screens/AgentsScreen";
import SkillsScreen from "./screens/SkillsScreen";
import RunsScreen from "./screens/RunsScreen";
import AccountScreen from "./screens/AccountScreen";
import CanvasScreen from "./screens/CanvasScreen";
import ProjectHubScreen from "./screens/ProjectHubScreen";
import DevBar from "./DevBar";
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
  CaretIcon,
  PlusIcon,
  MenuIcon,
} from "./icons";

/**
 * The workspace.
 *
 * Chat is the surface you land on, because that is where the work starts. The
 * sidebar is a project → thread tree rather than a nav list: threads belong to
 * projects, and showing them nested is what makes the shelf's scope obvious.
 * Everything that used to be in the sidebar — the other workspace screens and
 * the seven project surfaces — moved into the menu, which is one click away
 * and no longer competes with the thing you actually came here to do.
 */

type ScreenId =
  | "chat"
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

const TITLES: Record<ScreenId, string> = {
  chat: "Chat",
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

/** The workspace-wide destinations, as the menu lists them. */
const MENU_WORKSPACE: { id: ScreenId; label: string; icon: React.ReactNode }[] =
  [
    { id: "projects", label: "Projects", icon: <FolderIcon size={16} /> },
    { id: "runs", label: "Run history", icon: <ClockIcon size={16} /> },
    { id: "agents", label: "Agents", icon: <RobotIcon size={16} /> },
    { id: "skills", label: "Skills", icon: <SparkIcon size={16} /> },
  ];

/** The seven surfaces of whichever project is open. */
const MENU_SURFACES: {
  id: ScreenId;
  label: string;
  icon: React.ReactNode;
  kind?: CanvasKind;
}[] = [
  { id: "project", label: "Overview", icon: <GridIcon size={16} /> },
  { id: "research", label: "Research", icon: <SearchIcon size={16} />, kind: "research" },
  { id: "prd", label: "PRD", icon: <DocIcon size={16} />, kind: "prd" },
  { id: "prototype", label: "Design", icon: <PhoneIcon size={16} />, kind: "prototype" },
  { id: "data", label: "Data", icon: <ChartIcon size={16} />, kind: "data" },
  { id: "notes", label: "Notes", icon: <NoteIcon size={16} />, kind: "notes" },
  { id: "decisions", label: "Decisions", icon: <BranchIcon size={16} />, kind: "decisions" },
];

/** How a thread's surface tag is written in the sidebar and header. */
const SURFACE_LABEL: Record<CanvasKind, string> = {
  prd: "PRD",
  prototype: "Design",
  research: "Research",
  data: "Data",
  notes: "Notes",
  decisions: "Decisions",
  model: "Model",
  sheet: "Sheet",
};

export default function WorkspaceShell() {
  const { user, ready: authReady } = useAuth();
  const {
    projects,
    agents,
    skills,
    chats,
    connection,
    isConnected,
    ready: wsReady,
    createThread,
  } = useWorkspace();

  const [screen, setScreen] = useState<ScreenId>("chat");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [connectOpen, setConnectOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [toast, setToast] = useState("");

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function flash(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  }
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;
  const threads = useMemo(
    () => (activeProjectId ? (chats[activeProjectId] ?? []) : []),
    [chats, activeProjectId],
  );
  const activeThread =
    threads.find((t) => t.id === activeThreadId) ?? threads[0] ?? null;

  function openProject(id: string) {
    setActiveProjectId(id);
    setExpanded((e) => ({ ...e, [id]: true }));
    const first = chats[id]?.[0] ?? null;
    setActiveThreadId(first?.id ?? null);
    setScreen("chat");
  }

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

  // The /workspace route redirects when there is no session, so reaching here
  // without a user means the session expired mid-visit.
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
            title="Your session ended"
            body="Sign in again with Google to get back to your projects, agents and run history."
            actions={[{ label: "Sign in again", href: "/signin?auth=expired" }]}
          />
        </div>
        <DevBar />
      </div>
    );
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
        height: "100vh",
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
        background: "var(--bg)",
        color: "var(--fg1)",
        fontSize: 13,
        lineHeight: 1.55,
      }}
    >
      {/* ══ Sidebar: the project → thread tree ══ */}
      <aside
        style={{
          width: 250,
          flex: "0 0 250px",
          borderRight: "1px solid var(--border)",
          background: "var(--muted)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 13px 11px",
            flex: "0 0 auto",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "inherit",
              minWidth: 0,
            }}
          >
            <Logo size={20} />
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              PmPro.ai
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Workspace menu"
            aria-expanded={menuOpen}
            style={{
              marginLeft: "auto",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid transparent",
              borderRadius: "var(--radius-md)",
              background: menuOpen ? "var(--brand-tint-bg)" : "transparent",
              color: "var(--fg3)",
              cursor: "pointer",
            }}
          >
            <MenuIcon size={16} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "2px 13px 8px",
            flex: "0 0 auto",
          }}
        >
          <span
            className="mono-label"
            style={{ fontSize: 10, letterSpacing: "0.09em" }}
          >
            PROJECTS
          </span>
          <button
            type="button"
            onClick={() => setNewProjectOpen(true)}
            aria-label="New project"
            style={{
              marginLeft: "auto",
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              background: "transparent",
              color: "var(--fg3)",
              cursor: "pointer",
            }}
          >
            <PlusIcon size={14} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "0 8px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {projects.length === 0 ? (
            <p
              style={{
                margin: "4px 6px",
                fontSize: 12,
                lineHeight: 1.6,
                color: "var(--fg3)",
              }}
            >
              No projects yet. Start one and its first chat opens with it.
            </p>
          ) : (
            projects.map((p) => {
              const projectThreads = chats[p.id] ?? [];
              const isActive = p.id === activeProjectId;
              const open = expanded[p.id] ?? false;

              return (
                <div
                  key={p.id}
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      // Collapsing the project you are in closes the chat too,
                      // which is what makes the home view reachable again.
                      const collapsing = open && isActive;
                      setExpanded((e) => ({ ...e, [p.id]: !collapsing }));
                      if (collapsing) {
                        setActiveProjectId(null);
                        setActiveThreadId(null);
                      } else {
                        openProject(p.id);
                      }
                    }}
                    aria-expanded={open}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      height: 32,
                      padding: "0 8px",
                      border: `1px solid ${isActive ? "var(--brand-tint-border)" : "transparent"}`,
                      borderRadius: "var(--radius-md)",
                      background: isActive
                        ? "var(--brand-tint-bg)"
                        : "transparent",
                      color: isActive ? "var(--brand-900)" : "var(--fg2)",
                      fontFamily: "inherit",
                      fontSize: 13,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: "flex",
                        flex: "0 0 auto",
                        color: open ? "var(--brand-600)" : "var(--fg3)",
                        transform: open ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 160ms var(--ease-out)",
                      }}
                    >
                      <CaretIcon size={13} />
                    </span>
                    <span
                      style={{
                        minWidth: 0,
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{
                        flex: "0 0 auto",
                        fontSize: 10,
                        color: isActive ? "var(--brand-700)" : "var(--fg3)",
                      }}
                    >
                      {projectThreads.length}
                    </span>
                  </button>

                  {open && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        padding: "2px 0 6px 14px",
                        marginLeft: 6,
                        borderLeft: "1px solid var(--border)",
                      }}
                    >
                      {projectThreads.map((t) => {
                        const on =
                          isActive &&
                          screen === "chat" &&
                          t.id === activeThread?.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setActiveProjectId(p.id);
                              setActiveThreadId(t.id);
                              setScreen("chat");
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              minHeight: 29,
                              padding: "5px 8px",
                              border: `1px solid ${on ? "var(--brand-tint-border)" : "transparent"}`,
                              borderRadius: "var(--radius-md)",
                              background: on
                                ? "var(--brand-tint-bg)"
                                : "transparent",
                              color: on ? "var(--brand-900)" : "var(--fg3)",
                              fontFamily: "inherit",
                              fontSize: 12.5,
                              textAlign: "left",
                              cursor: "pointer",
                            }}
                          >
                            <span
                              style={{
                                minWidth: 0,
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t.title}
                            </span>
                            <span
                              style={{
                                flex: "0 0 auto",
                                fontSize: 10,
                                color: on ? "var(--brand-700)" : "var(--fg3)",
                              }}
                            >
                              {SURFACE_LABEL[t.surface]}
                            </span>
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          const t = createThread(p.id);
                          setActiveProjectId(p.id);
                          setActiveThreadId(t.id);
                          setScreen("chat");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          height: 28,
                          marginTop: 3,
                          padding: "0 8px",
                          border: "1px dashed var(--input)",
                          borderRadius: "var(--radius-md)",
                          background: "transparent",
                          color: "var(--fg3)",
                          fontFamily: "inherit",
                          fontSize: 12,
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <PlusIcon size={13} />
                        New chat
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div
          style={{
            flex: "0 0 auto",
            padding: "11px 13px",
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
                fontSize: 11,
                color: "var(--fg2)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  flex: "0 0 6px",
                  borderRadius: "50%",
                  background: "var(--brand-500)",
                }}
              />
              {PROVIDERS[connection.provider].name} · {connection.plan}
            </span>
          ) : (
            <button
              type="button"
              className="btn-primary"
              style={{
                height: 32,
                padding: "0 12px",
                justifyContent: "center",
                gap: 7,
              }}
              onClick={() => setConnectOpen(true)}
            >
              <PlugIcon size={14} />
              Connect provider
            </button>
          )}
        </div>
      </aside>

      {/* ══ Main ══ */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            padding: "11px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {activeProject ? (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                style={{
                  border: 0,
                  background: "transparent",
                  padding: 0,
                  fontSize: 12,
                  fontFamily: "inherit",
                  color: "var(--fg3)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                {activeProject.name}
              </button>
              <span style={{ fontSize: 12, color: "var(--fg3)" }}>/</span>
              <span
                style={{ fontFamily: "var(--font-serif)", fontSize: 14 }}
              >
                {screen === "chat"
                  ? (activeThread?.title ?? "New chat")
                  : TITLES[screen]}
              </span>
              {screen === "chat" && activeThread && (
                <span
                  className="tag tag-brand"
                  style={{ fontSize: 10, letterSpacing: "0.05em" }}
                >
                  {SURFACE_LABEL[activeThread.surface]}
                </span>
              )}
            </>
          ) : (
            <span style={{ fontSize: 12, color: "var(--fg3)" }}>
              {screen === "chat" ? "All projects" : TITLES[screen]}
            </span>
          )}

          <span
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {!isConnected && (
              <button
                type="button"
                className="btn-ghost"
                style={{ height: 28, padding: "0 12px", fontSize: 12 }}
                onClick={() => setConnectOpen(true)}
              >
                Connect provider
              </button>
            )}
            {activeProject && screen === "chat" && (
              <button
                type="button"
                className="btn-ghost"
                style={{ height: 28, padding: "0 12px", fontSize: 12 }}
                onClick={() => setPanelOpen((v) => !v)}
              >
                {panelOpen ? "Hide panel" : "Show panel"}
              </button>
            )}
            <button
              type="button"
              className="btn-primary"
              style={{ height: 28, padding: "0 14px", fontSize: 12 }}
              onClick={() => setNewProjectOpen(true)}
            >
              New project
            </button>
          </span>
        </header>

        {/* ── Chat: the default surface ── */}
        {screen === "chat" &&
          (activeProject && activeThread ? (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                alignItems: "stretch",
                overflow: "hidden",
              }}
            >
              <ChatPane
                key={activeThread.id}
                project={activeProject}
                thread={activeThread}
                onToast={flash}
              />
              {panelOpen && (
                <ContextPanel project={activeProject} onToast={flash} />
              )}
            </div>
          ) : (
            <ProjectHome
              projects={projects}
              chats={chats}
              wsReady={wsReady}
              onOpen={openProject}
              onNew={() => setNewProjectOpen(true)}
              onBrowse={() => setMenuOpen(true)}
            />
          ))}

        {/* ── Everything else, reached from the menu ── */}
        {screen !== "chat" && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: 22,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
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
        )}
      </main>

      {/* ══ Menu ══ */}
      {menuOpen && (
        <div
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setMenuOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 24,
            background: "rgba(8, 8, 16, 0.6)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: 14,
          }}
        >
          <div
            role="dialog"
            aria-label="Workspace menu"
            style={{
              width: 262,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              background: "var(--card)",
              boxShadow: "var(--shadow-lg)",
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              animation: "wsFadeUp 180ms var(--ease-out) both",
            }}
          >
            <span
              className="mono-label"
              style={{
                padding: "7px 8px 5px",
                fontSize: 10,
                letterSpacing: "0.09em",
              }}
            >
              WORKSPACE
            </span>
            {MENU_WORKSPACE.map((m) => (
              <MenuRow
                key={m.id}
                icon={m.icon}
                label={m.label}
                count={counts[m.id]}
                onClick={() => {
                  setScreen(m.id);
                  setMenuOpen(false);
                }}
              />
            ))}

            {activeProject && (
              <>
                <span
                  className="mono-label"
                  style={{
                    padding: "11px 8px 5px",
                    fontSize: 10,
                    letterSpacing: "0.09em",
                  }}
                >
                  THIS PROJECT
                </span>
                {MENU_SURFACES.map((sf) => {
                  const canvas = sf.kind
                    ? activeProject.canvases.find((c) => c.kind === sf.kind)
                    : null;
                  return (
                    <MenuRow
                      key={sf.id}
                      icon={sf.icon}
                      label={sf.label}
                      hint={canvas?.status}
                      onClick={() => {
                        setScreen(sf.id);
                        setMenuOpen(false);
                      }}
                    />
                  );
                })}
              </>
            )}

            <div
              style={{
                marginTop: 8,
                paddingTop: 9,
                borderTop: "1px solid var(--border)",
              }}
            >
              <MenuRow
                icon={<GearIcon size={16} />}
                label="Account"
                onClick={() => {
                  setScreen("account");
                  setMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {connectOpen && (
        <ConnectProviderDialog onClose={() => setConnectOpen(false)} />
      )}
      {newProjectOpen && (
        <NewProjectDialog
          onClose={() => setNewProjectOpen(false)}
          onCreated={(p) => {
            // createProject opens the project with a thread already in it, so
            // this lands straight in a usable chat rather than a list.
            openProject(p.id);
            flash(`${p.name} created — first chat is open`);
          }}
        />
      )}

      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "11px 14px",
            borderRadius: "var(--radius-lg)",
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
            animation: "wsFadeUp 220ms var(--ease-out) both",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--brand-500)",
            }}
          />
          <span style={{ fontSize: 12 }}>{toast}</span>
        </div>
      )}

      <DevBar />
    </div>
  );
}

/**
 * What you see before a project is open.
 *
 * There is deliberately no composer here: a chat belongs to a project, and
 * having nowhere to type until one is open is what keeps every thread carrying
 * the same goal and decisions.
 */
function ProjectHome({
  projects,
  chats,
  wsReady,
  onOpen,
  onNew,
  onBrowse,
}: {
  projects: ReturnType<typeof useWorkspace>["projects"];
  chats: ReturnType<typeof useWorkspace>["chats"];
  wsReady: boolean;
  onOpen: (id: string) => void;
  onNew: () => void;
  onBrowse: () => void;
}) {
  const has = projects.length > 0;

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 28px",
      }}
    >
      <div
        style={{
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
          <FolderIcon size={20} />
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
          {has ? "Pick a project to start chatting" : "No projects yet"}
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
          {has
            ? "Every chat belongs to a project, and inherits its goal, sources, decisions and shelf. Open one below, or start a new one."
            : "A project is one goal with its own agents, shelf and chats. Start one and its first chat opens with it."}
        </p>

        {has && (
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              display: "flex",
              flexDirection: "column",
              gap: 7,
              marginTop: 20,
            }}
          >
            {projects.slice(0, 6).map((p) => {
              const n = chats[p.id]?.length ?? 0;
              const shelf = p.shelf?.length ?? 0;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onOpen(p.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "11px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    background: "transparent",
                    color: "var(--fg1)",
                    fontFamily: "inherit",
                    fontSize: 13,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ flex: "0 0 auto", color: "var(--brand-600)" }}>
                    <FolderIcon size={16} />
                  </span>
                  <span
                    style={{
                      minWidth: 0,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.name}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--fg3)" }}>
                      {n} {n === 1 ? "chat" : "chats"} · {shelf} shelf{" "}
                      {shelf === 1 ? "item" : "items"}
                    </span>
                  </span>
                  <span
                    style={{
                      flex: "0 0 auto",
                      fontSize: 11,
                      color: "var(--fg3)",
                    }}
                  >
                    {p.folder}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginTop: 18,
          }}
        >
          <button
            type="button"
            className="btn-primary"
            style={{ height: 36, padding: "0 16px" }}
            onClick={onNew}
          >
            Start a project
          </button>
          {has && (
            <button
              type="button"
              className="btn-ghost"
              style={{ height: 36, padding: "0 16px" }}
              onClick={onBrowse}
            >
              Browse the workspace
            </button>
          )}
        </div>

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
          {wsReady
            ? "Chats live inside a project, so there is nowhere to type until one is open — that is what keeps every thread carrying the same goal, sources and decisions."
            : "Reading your workspace…"}
        </div>
      </div>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  count,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        height: 31,
        padding: "0 8px",
        border: "1px solid transparent",
        borderRadius: "var(--radius-md)",
        background: "transparent",
        color: "var(--fg2)",
        fontFamily: "inherit",
        fontSize: 13,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span style={{ display: "flex", flex: "0 0 auto", color: "var(--fg3)" }}>
        {icon}
      </span>
      {label}
      {(typeof count === "number" && count > 0) || hint ? (
        <span
          style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg3)" }}
        >
          {hint ?? count}
        </span>
      ) : null}
    </button>
  );
}

function ScreenHeading({ screen }: { screen: ScreenId }) {
  const sub: Record<ScreenId, string> = {
    chat: "",
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
