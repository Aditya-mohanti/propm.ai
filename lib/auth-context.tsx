"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";

export interface User {
  name: string;
  email: string;
  picture?: string;
}

interface AuthCtx {
  user: User | null;
  /**
   * Always true. The session is resolved on the server and handed in as a
   * prop, so there is no loading pass and no signed-out flash. Kept so
   * consumers written against the old client-side session still compile.
   */
  ready: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  ready: true,
  signOut: () => {},
});

export function AuthProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const signOut = useCallback(() => {
    // The session lives in an httpOnly cookie, so only the server can clear
    // it. refresh() then re-runs the server layout, which re-renders with no
    // user rather than trusting anything held on the client.
    void fetch("/api/auth/signout", { method: "POST" })
      .catch(() => {})
      .finally(() => {
        router.replace("/");
        router.refresh();
      });
  }, [router]);

  const value = useMemo<AuthCtx>(
    () => ({ user, ready: true, signOut }),
    [user, signOut],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
