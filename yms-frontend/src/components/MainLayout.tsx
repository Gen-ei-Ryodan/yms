"use client";

import { useState } from "react";
import { Bell, Menu, Music2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1526]"></div>
          <p className="text-sm text-[#5B6472] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const role = user?.role || "student";

  return (
    <div className="min-h-screen bg-[#F5F2EB]">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-[#0B1526]/10 bg-white/80 backdrop-blur-md">
          <div className="flex h-full items-center justify-between px-4 lg:px-6">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5 text-[#0B1526]" />
              </Button>

              <div className="flex items-center gap-2 lg:hidden">
                <div className="h-8 w-8 rounded-lg bg-[#0B1526] flex items-center justify-center">
                  <Music2 className="h-4 w-4 text-[#C9A227]" />
                </div>
                <span className="font-bold text-[#0B1526] text-sm">Yamaha</span>
              </div>

              {/* Search bar - desktop */}
              <div className="hidden md:flex items-center gap-2 bg-[#F5F2EB] rounded-xl px-4 py-2 w-80">
                <Search className="h-4 w-4 text-[#5B6472]" />
                <input
                  type="text"
                  placeholder="Cari menu, siswa, kelas..."
                  className="bg-transparent text-sm text-[#0B1526] placeholder:text-[#8A93A3] focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Right: Notifications + User */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-[#5B6472]" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#C2542E] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                  3
                </span>
              </Button>

              <div className="hidden sm:flex items-center gap-2.5 ml-1 pl-3 border-l border-[#0B1526]/10">
                <div className="h-8 w-8 rounded-full bg-[#0B1526] flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-[#C9A227]">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-[#0B1526]">{user?.name}</p>
                  <p className="text-[11px] text-[#5B6472] capitalize">{role.replace("_", " ")}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={cn("p-4 lg:p-6")}>
          {children}
        </main>
      </div>
    </div>
  );
}
