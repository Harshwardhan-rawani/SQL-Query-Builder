import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginApi, signupApi } from "@/services/authApi";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔁 Restore session on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("auth-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // ✅ LOGIN (Backend)
  const login = async (email: string, password: string) => {
    try {
      const data = await loginApi(email, password);

      localStorage.setItem("auth-token", data.token);
      localStorage.setItem("auth-user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // ✅ SIGNUP (Backend)
  const signup = async (email: string, password: string, name: string) => {
    try {
      await signupApi(email, password, name);
      return await login(email, password); // auto login
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;