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
  name?: string;
  username?: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  private: boolean;
}
interface AuthContextType {
  name: any;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const supabase = createClient();

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const response = await fetch(`/api/user?userId=${session.user.id}`);
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        fetchUser();
      }
    );
    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
