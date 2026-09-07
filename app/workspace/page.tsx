import type { Metadata } from "next";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";

export const metadata: Metadata = {
  title: "Workspace — PmPro.ai",
  description:
    "Your projects, agents, skills and run history in one workspace.",
};

export default function WorkspacePage() {
  return <WorkspaceShell />;
}
