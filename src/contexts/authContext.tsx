"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  email?: string; // Allow undefined
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  private?: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const supabase = createClient();

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name ?? null,
          username: data.user.user_metadata?.username ?? null,
          email: data.user.email ?? "", // Ensure email is never undefined
          role: data.user.user_metadata?.role ?? "user",
          createdAt: data.user.created_at
            ? new Date(data.user.created_at)
            : undefined,
          updatedAt: data.user.updated_at
            ? new Date(data.user.updated_at)
            : undefined,
          private: data.user.user_metadata?.private ?? false,
        });
      }
    };
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
