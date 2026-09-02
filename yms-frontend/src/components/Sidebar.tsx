"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Music2,
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardList,
  BookOpen,
  Music,
  TrendingUp,
  School,
  UserPlus,
  CalendarClock,
  DoorOpen,
  CheckCircle,
  CalendarCheck,
  Banknote,
  CreditCard,
  Receipt,
  DollarSign,
  Star,
  Gift,
  RotateCcw,
  Ticket,
  Plane,
  ArrowLeftRight,
  BarChart3,
  Settings,
  User,
  CalendarDays,
  FileText,
  Bell,
} from "lucide-react";
import React from "react";

interface SidebarProps {
  role: string;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: Record<string, { label: string; href: string; icon: React.ComponentType<any> }[]> = {
  super_admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/students", icon: GraduationCap },
    { label: "Guardians", href: "/guardians", icon: Users },
    { label: "Membership", href: "/memberships", icon: ClipboardList },
    { label: "Teachers", href: "/teachers", icon: BookOpen },
    { label: "Courses", href: "/courses", icon: Music },
    { label: "Levels", href: "/levels", icon: TrendingUp },
    { label: "Classes", href: "/classes", icon: School },
    { label: "Enrollments", href: "/enrollments", icon: UserPlus },
    { label: "Schedules", href: "/schedules", icon: CalendarClock },
    { label: "Rooms", href: "/rooms", icon: DoorOpen },
    { label: "Attendance", href: "/attendance", icon: CheckCircle },
    { label: "Teacher Attendance", href: "/teacher-attendance", icon: CalendarCheck },
    { label: "Tuition", href: "/tuition", icon: Banknote },
    { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    { label: "Invoices", href: "/invoices", icon: Receipt },
    { label: "Payments", href: "/payments", icon: DollarSign },
    { label: "Loyalty", href: "/loyalty", icon: Star },
    { label: "Rewards", href: "/rewards", icon: Gift },
    { label: "Redemptions", href: "/redemptions", icon: RotateCcw },
    { label: "Vouchers", href: "/vouchers", icon: Ticket },
    { label: "Leaves", href: "/leaves", icon: Plane },
    { label: "Transfers", href: "/transfers", icon: ArrowLeftRight },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/students", icon: GraduationCap },
    { label: "Guardians", href: "/guardians", icon: Users },
    { label: "Membership", href: "/memberships", icon: ClipboardList },
    { label: "Teachers", href: "/teachers", icon: BookOpen },
    { label: "Courses", href: "/courses", icon: Music },
    { label: "Levels", href: "/levels", icon: TrendingUp },
    { label: "Classes", href: "/classes", icon: School },
    { label: "Enrollments", href: "/enrollments", icon: UserPlus },
    { label: "Schedules", href: "/schedules", icon: CalendarClock },
    { label: "Rooms", href: "/rooms", icon: DoorOpen },
    { label: "Attendance", href: "/attendance", icon: CheckCircle },
    { label: "Teacher Attendance", href: "/teacher-attendance", icon: CalendarCheck },
    { label: "Tuition", href: "/tuition", icon: Banknote },
    { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    { label: "Invoices", href: "/invoices", icon: Receipt },
    { label: "Payments", href: "/payments", icon: DollarSign },
    { label: "Loyalty", href: "/loyalty", icon: Star },
    { label: "Rewards", href: "/rewards", icon: Gift },
    { label: "Redemptions", href: "/redemptions", icon: RotateCcw },
    { label: "Vouchers", href: "/vouchers", icon: Ticket },
    { label: "Leaves", href: "/leaves", icon: Plane },
    { label: "Transfers", href: "/transfers", icon: ArrowLeftRight },
    { label: "Reports", href: "/reports", icon: BarChart3 },
  ],
  teacher: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Classes", href: "/my-classes", icon: School },
    { label: "My Schedule", href: "/my-schedule", icon: CalendarClock },
    { label: "Student List", href: "/students", icon: GraduationCap },
    { label: "Attendance", href: "/attendance", icon: CheckCircle },
    { label: "Attendance History", href: "/attendance-history", icon: CalendarDays },
  ],
  student: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/profile", icon: User },
    { label: "My Class", href: "/my-class", icon: School },
    { label: "Attendance", href: "/attendance", icon: CheckCircle },
    { label: "Payment", href: "/payments", icon: CreditCard },
    { label: "Loyalty", href: "/loyalty", icon: Star },
    { label: "Rewards", href: "/rewards", icon: Gift },
    { label: "Requests", href: "/requests", icon: FileText },
    { label: "Notifications", href: "/notifications", icon: Bell },
  ],
};

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const items = menuItems[role] || menuItems.student;
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm shadow-blue-200">
            <Music2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base text-gray-900 tracking-tight">Yamaha</h2>
            <p className="text-[11px] text-gray-500 font-medium">Music School</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="space-y-0.5">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] flex-shrink-0",
                        isActive ? "text-blue-600" : "text-gray-400"
                      )}
                    />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100">
          <a href="/profile" className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold text-white">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">User</p>
              <p className="text-[11px] text-gray-500 capitalize font-medium">
                {role.replace("_", " ")}
              </p>
            </div>
          </a>
        </div>
      </aside>
    </>
  );
}
