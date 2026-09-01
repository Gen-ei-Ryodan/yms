"use client";

import { useState } from "react";
import { Bell, Menu, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const role = user?.role || "student";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 lg:hidden">
            <Music2 className="h-6 w-6 text-blue-600" />
            <span className="font-bold">Yamaha</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Button>
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <span className="text-sm font-medium hidden md:block">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className={cn("p-4 lg:p-6")}>
          {children}
        </main>
      </div>
    </div>
  );
}