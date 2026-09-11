"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Music2, LayoutDashboard, GraduationCap, Users, ClipboardList, BookOpen,
  Music, TrendingUp, School, UserPlus, CalendarClock, DoorOpen, CheckCircle,
  CalendarCheck, Banknote, CreditCard, Receipt, DollarSign, Star, Gift,
  RotateCcw, Ticket, Plane, ArrowLeftRight, BarChart3, Settings, User,
  CalendarDays, FileText, Bell, LogOut, Target, Wallet, Clipboard, History, Calendar,
  UserMinus, ShoppingCart, AlertCircle, BookOpen as BookIcon
} from "lucide-react";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  role: string;
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface MenuGroup {
  title?: string;
  items: MenuItem[];
}

function buildGroupedMenu(groups: { title?: string; items: MenuItem[] }[]): MenuItem[] {
  return groups.flatMap(g => g.items);
}

const superAdminMenu: MenuGroup[] = [
  { items: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ]},
  { title: "Master Data", items: [
    { label: "Siswa", href: "/students", icon: GraduationCap },
    { label: "Orang Tua / Wali", href: "/guardians", icon: Users },
    { label: "Guru", href: "/teachers", icon: BookOpen },
    { label: "Program", href: "/courses", icon: Music },
    { label: "Level", href: "/levels", icon: TrendingUp },
    { label: "Kelas", href: "/classes", icon: School },
    { label: "Jadwal", href: "/schedules", icon: CalendarClock },
    { label: "Ruangan", href: "/rooms", icon: DoorOpen },
    { label: "Produk", href: "/tuition", icon: Banknote },
    { label: "Pengaturan Loyalty", href: "/loyalty", icon: Star },
    { label: "Reward", href: "/rewards", icon: Gift },
    { label: "Voucher", href: "/vouchers", icon: Ticket },
    { label: "Pengaturan", href: "/settings", icon: Settings },
  ]},
  { title: "Student Management", items: [
    { label: "Pendaftaran Siswa", href: "/students/register", icon: UserPlus },
    { label: "Data Siswa", href: "/students", icon: GraduationCap },
    { label: "Status Siswa", href: "/students/status", icon: CheckCircle },
    { label: "Riwayat Siswa", href: "/students/history", icon: History },
    { label: "Riwayat Perpindahan", href: "/transfer-history", icon: ArrowLeftRight },
  ]},
  { title: "Attendance & Schedule", items: [
    { label: "Absensi", href: "/attendance", icon: CheckCircle },
    { label: "Riwayat Absensi", href: "/admin/attendance-history", icon: CalendarDays },
    { label: "Absensi Guru", href: "/teacher-attendance", icon: CalendarCheck },
    { label: "Pengajuan Cuti / Libur", href: "/leaves", icon: Plane },
    { label: "Pengajuan Pindah Kelas", href: "/transfers", icon: ArrowLeftRight },
    { label: "Approval", href: "/approvals", icon: AlertCircle },
    { label: "Pergantian Jadwal", href: "/schedule-changes", icon: CalendarClock },
  ]},
  { title: "Transaction", items: [
    { label: "Pembayaran Les", href: "/payments", icon: DollarSign },
    { label: "Pembelian Produk", href: "/product-purchases", icon: ShoppingCart },
    { label: "Riwayat Transaksi", href: "/transaction-history", icon: Receipt },
    { label: "Langganan", href: "/subscriptions", icon: CreditCard },
    { label: "Invoice", href: "/invoices", icon: Receipt },
    { label: "Enrollment", href: "/enrollments", icon: UserPlus },
  ]},
  { title: "Loyalty", items: [
    { label: "Saldo Poin", href: "/loyalty", icon: Star },
    { label: "Penukaran Poin", href: "/redemptions", icon: RotateCcw },
  ]},
  { title: "Guru", items: [
    { label: "Data Guru", href: "/teachers", icon: BookOpen },
    { label: "Kelas Guru", href: "/teacher-classes", icon: School },
    { label: "Progress Murid", href: "/student-progress", icon: TrendingUp },
    { label: "Catatan Pembelajaran", href: "/learning-notes", icon: Clipboard },
    { label: "Honor / Gaji", href: "/salary", icon: Wallet },
  ]},
  { title: "Laporan", items: [
    { label: "Laporan Siswa", href: "/reports", icon: BarChart3 },
    { label: "Laporan Pembelian", href: "/reports/purchases", icon: ShoppingCart },
    { label: "Laporan Guru", href: "/reports/teachers", icon: BookOpen },
  ]},
];

const adminMenu: MenuGroup[] = superAdminMenu.filter(g => {
  if (!g.title) return true;
  return g.title !== "Master Data" || g.items.some(i => i.href !== "/settings");
}).map(g => ({
  ...g,
  items: g.items.filter(i => i.href !== "/settings"),
}));

const teacherMenu: MenuGroup[] = [
  { items: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ]},
  { title: "Jadwal Mengajar", items: [
    { label: "Jadwal Hari Ini", href: "/teacher-schedule", icon: CalendarClock },
    { label: "Jadwal Mingguan", href: "/my-schedule", icon: Calendar },
    { label: "Kalender Mengajar", href: "/my-classes", icon: CalendarDays },
  ]},
  { title: "Kelas Saya", items: [
    { label: "Kelas Aktif", href: "/my-classes", icon: School },
    { label: "Detail Kelas", href: "/class-summary", icon: BookOpen },
    { label: "Daftar Murid", href: "/teacher/my-students", icon: GraduationCap },
  ]},
  { title: "Murid", items: [
    { label: "Daftar Murid", href: "/teacher/my-students", icon: Users },
    { label: "Progress Murid", href: "/student-progress", icon: TrendingUp },
    { label: "Riwayat Absensi", href: "/attendance-history", icon: CalendarDays },
    { label: "Catatan Pembelajaran", href: "/learning-notes", icon: Clipboard },
  ]},
  { title: "Absensi", items: [
    { label: "Absensi Murid", href: "/teacher/student-attendance", icon: CheckCircle },
  ]},
  { title: "Progress", items: [
    { label: "Progress Kelas", href: "/class-summary", icon: BarChart3 },
    { label: "Progress Individu", href: "/student-progress", icon: TrendingUp },
  ]},
  { title: "Honor / Gaji", items: [
    { label: "Rekap Kelas Aktif", href: "/class-summary", icon: Clipboard },
    { label: "Perhitungan Honor", href: "/salary", icon: Wallet },
    { label: "Riwayat Pembayaran", href: "/salary", icon: Receipt },
  ]},
];

const studentMenu: MenuGroup[] = [
  { items: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ]},
  { title: "Profil", items: [
    { label: "Data Saya", href: "/profile", icon: User },
    { label: "Orang Tua / Wali", href: "/profile/parents", icon: Users },
  ]},
  { title: "Kelas Saya", items: [
    { label: "Kelas Aktif", href: "/my-class", icon: School },
    { label: "Jadwal", href: "/my-class/schedule", icon: CalendarClock },
    { label: "Program & Level", href: "/my-class/program", icon: Music },
    { label: "Progress Belajar", href: "/progress", icon: TrendingUp },
  ]},
  { title: "Absensi", items: [
    { label: "Absensi Saya", href: "/attendance", icon: CheckCircle },
    { label: "Riwayat Absensi", href: "/student/attendance-history", icon: CalendarDays },
  ]},
  { title: "Pengajuan", items: [
    { label: "Ajukan Cuti / Libur", href: "/requests", icon: Plane },
    { label: "Ajukan Pindah Kelas", href: "/requests", icon: ArrowLeftRight },
  ]},
  { title: "Transaksi", items: [
    { label: "Pembayaran Les", href: "/my-payments", icon: DollarSign },
    { label: "Riwayat Pembayaran", href: "/my-transactions", icon: Receipt },
    { label: "Pembelian", href: "/my-purchases", icon: ShoppingCart },
    { label: "Invoice", href: "/my-invoices", icon: FileText },
  ]},
  { title: "Loyalty", items: [
    { label: "Saldo Poin", href: "/loyalty", icon: Star },
    { label: "Reward", href: "/rewards", icon: Gift },
    { label: "Riwayat Penukaran", href: "/my-redemptions", icon: RotateCcw },
  ]},
];

const menuData: Record<string, MenuGroup[] | MenuItem[]> = {
  super_admin: superAdminMenu,
  admin: adminMenu,
  teacher: teacherMenu,
  student: studentMenu,
};

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const menu = menuData[role] || studentMenu;
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isGrouped = Array.isArray(menu) && menu.length > 0 && 'items' in menu[0];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} />
      )}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center gap-3 p-5 border-b border-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm shadow-blue-200">
            <Music2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base text-gray-900 tracking-tight">Yamaha</h2>
            <p className="text-[11px] text-gray-500 font-medium">Music School</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {isGrouped ? (
            <ul className="space-y-4">
              {(menu as MenuGroup[]).map((group, gi) => (
                <li key={gi}>
                  {group.title && (
                    <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{group.title}</p>
                  )}
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <a href={item.href} className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                            isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}>
                            <item.icon className={cn("h-[18px] w-[18px] flex-shrink-0", isActive ? "text-blue-600" : "text-gray-400")} />
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-0.5">
              {(menu as MenuItem[]).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <a href={item.href} className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}>
                      <item.icon className={cn("h-[18px] w-[18px] flex-shrink-0", isActive ? "text-blue-600" : "text-gray-400")} />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <a href="/profile" className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold text-white">{user?.name?.charAt(0) || "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
              <p className="text-[11px] text-gray-500 capitalize font-medium">{role.replace("_", " ")}</p>
            </div>
          </a>
          <button onClick={logout} className="flex items-center gap-3 w-full rounded-lg p-2 mt-1 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
