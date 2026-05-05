import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getPrototypeSessionUser,
  initializePrototypeStorage,
  loginPrototypeUser,
  logoutPrototypeUser,
  registerPrototypeUser,
} from "@/lib/prototype-storage";
import type { PrototypeUser } from "@/types/prototype";

type AuthContextValue = {
  user: PrototypeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PrototypeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializePrototypeStorage();
    setUser(getPrototypeSessionUser());
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const nextUser = loginPrototypeUser(email, password);
    setUser(nextUser);
  };

  const signup = async (email: string, password: string) => {
    const nextUser = registerPrototypeUser(email, password);
    setUser(nextUser);
  };

  const logout = async () => {
    logoutPrototypeUser();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
