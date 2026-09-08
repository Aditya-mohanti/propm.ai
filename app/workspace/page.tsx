import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/server/session";
import WorkspaceShell from "@/components/workspace/WorkspaceShell";

export const metadata: Metadata = {
  title: "Workspace — ProPM",
  description:
    "Your projects, agents, skills and run history in one workspace.",
};

export default async function WorkspacePage() {
  // Gated on the server: without a valid session cookie the workspace is
  // never rendered or sent, so this cannot be bypassed from the client.
  const user = await getSession();
  if (!user) redirect("/signin?auth=required");

  return <WorkspaceShell />;
}
