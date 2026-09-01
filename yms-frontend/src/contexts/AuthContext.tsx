"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  role: string;
  is_active: boolean;
  student: {
    id: number;
    student_code: string;
    student_number: string;
    full_name: string;
  } | null;
  teacher: {
    id: number;
    teacher_code: string;
    name: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

axios.defaults.baseURL = API_URL;
axios.defaults.timeout = 15000; // 15 second timeout

// Debug interceptor to trace requests
axios.interceptors.request.use((config) => {
  console.log(`[AXIOS] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
  return config;
});

axios.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS] Response ${response.status}:`, response.data);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('[AXIOS] Request timed out:', error.message);
    } else if (error.response) {
      console.error(`[AXIOS] Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('[AXIOS] No response received. Request was:', error.request);
    } else {
      console.error('[AXIOS] Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("yms_token");
  };

  const checkAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      if (pathname !== "/login") {
        router.push("/login");
      }
      return;
    }

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      const response = await axios.get("/me");
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        localStorage.removeItem("yms_token");
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      localStorage.removeItem("yms_token");
      setUser(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, pathname]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/login", { email, password });
      if (response.data.success) {
        localStorage.setItem("yms_token", response.data.data.token);
        axios.defaults.headers.common.Authorization = `Bearer ${response.data.data.token}`;
        setUser(response.data.data.user);
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
    } catch (error) {
      // Continue even if logout fails
    }
    localStorage.removeItem("yms_token");
    delete axios.defaults.headers.common.Authorization;
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}