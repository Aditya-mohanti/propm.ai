"use client";

import { AuthProvider, type User } from "@/lib/auth-context";
import { WorkspaceProvider } from "@/lib/workspace-context";

export default function Providers({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <AuthProvider user={user}>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </AuthProvider>
  );
}
