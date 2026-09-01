"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}