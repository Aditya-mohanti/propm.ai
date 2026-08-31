"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface User {
  name: string;
  email: string;
}

interface AuthCtx {
  user: User | null;
  signIn: (u: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pmpro_user");
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore parse errors
    }
  }, []);

  function signIn(u: User) {
    setUser(u);
    localStorage.setItem("pmpro_user", JSON.stringify(u));
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("pmpro_user");
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
