"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { createLocalStore } from "@/lib/local-store";

export interface User {
  name: string;
  email: string;
}

interface Session {
  user: User | null;
  /**
   * False during SSR and the hydration pass, true once storage has been read.
   * Without it every consumer sees `user === null` on the first paint and a
   * signed-in visitor flashes the signed-out UI.
   */
  ready: boolean;
}

const SIGNED_OUT: Session = { user: null, ready: false };

/**
 * A hand-edited or half-written entry signs you out rather than crashing the
 * header on `user.name.split`.
 */
function parseSession(raw: string | null): Session {
  if (!raw) return { user: null, ready: true };
  try {
    const parsed = JSON.parse(raw) as Partial<User> | null;
    if (!parsed || typeof parsed.email !== "string") {
      return { user: null, ready: true };
    }
    return {
      user: { name: parsed.name ?? parsed.email, email: parsed.email },
      ready: true,
    };
  } catch {
    return { user: null, ready: true };
  }
}

const store = createLocalStore<Session>({
  key: "pmpro_user",
  parse: parseSession,
  serverValue: SIGNED_OUT,
  // Only the user is persisted; `ready` describes this runtime, not the session.
  serialize: (s) => (s.user ? JSON.stringify(s.user) : null),
});

interface AuthCtx extends Session {
  signIn: (u: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthCtx>({
  ...SIGNED_OUT,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const signIn = useCallback((u: User) => {
    store.set({ user: u, ready: true });
  }, []);

  const signOut = useCallback(() => {
    store.set({ user: null, ready: true });
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ ...session, signIn, signOut }),
    [session, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
