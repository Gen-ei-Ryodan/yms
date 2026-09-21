"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Menu, Music2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchItem {
  label: string;
  href: string;
  group: string;
}

const searchMenus: Record<string, SearchItem[]> = {
  super_admin: [
    { label: "Dashboard", href: "/dashboard", group: "Menu" },
    { label: "Siswa", href: "/students", group: "Master Data" },
    { label: "Orang Tua / Wali", href: "/guardians", group: "Master Data" },
    { label: "Guru", href: "/teachers", group: "Master Data" },
    { label: "Program", href: "/courses", group: "Master Data" },
    { label: "Level", href: "/levels", group: "Master Data" },
    { label: "Kelas", href: "/classes", group: "Master Data" },
    { label: "Jadwal", href: "/schedules", group: "Master Data" },
    { label: "Ruangan", href: "/rooms", group: "Master Data" },
    { label: "Produk", href: "/tuition", group: "Master Data" },
    { label: "Pengaturan Loyalty", href: "/loyalty", group: "Master Data" },
    { label: "Reward", href: "/rewards", group: "Master Data" },
    { label: "Voucher", href: "/vouchers", group: "Master Data" },
    { label: "Pengaturan", href: "/settings", group: "Master Data" },
    { label: "Pendaftaran Siswa", href: "/students/register", group: "Student Management" },
    { label: "Status Siswa", href: "/students/status", group: "Student Management" },
    { label: "Riwayat Siswa", href: "/students/history", group: "Student Management" },
    { label: "Absensi", href: "/attendance", group: "Attendance" },
    { label: "Riwayat Absensi", href: "/admin/attendance-history", group: "Attendance" },
    { label: "Absensi Guru", href: "/teacher-attendance", group: "Attendance" },
    { label: "Cuti / Libur", href: "/leaves", group: "Attendance" },
    { label: "Pindah Kelas", href: "/transfers", group: "Attendance" },
    { label: "Approval", href: "/approvals", group: "Attendance" },
    { label: "Pembayaran Les", href: "/payments", group: "Transaction" },
    { label: "Pembelian Produk", href: "/product-purchases", group: "Transaction" },
    { label: "Riwayat Transaksi", href: "/transaction-history", group: "Transaction" },
    { label: "Langganan", href: "/subscriptions", group: "Transaction" },
    { label: "Invoice", href: "/invoices", group: "Transaction" },
    { label: "Enrollment", href: "/enrollments", group: "Transaction" },
    { label: "Penukaran Poin", href: "/redemptions", group: "Loyalty" },
    { label: "Saldo Poin", href: "/loyalty", group: "Loyalty" },
    { label: "Kelas Guru", href: "/teacher-classes", group: "Guru" },
    { label: "Progress Murid", href: "/student-progress", group: "Guru" },
    { label: "Catatan Pembelajaran", href: "/learning-notes", group: "Guru" },
    { label: "Honor / Gaji", href: "/salary", group: "Guru" },
    { label: "Laporan Siswa", href: "/reports", group: "Laporan" },
    { label: "Laporan Pembelian", href: "/reports/purchases", group: "Laporan" },
    { label: "Laporan Guru", href: "/reports/teachers", group: "Laporan" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", group: "Menu" },
    { label: "Siswa", href: "/students", group: "Master Data" },
    { label: "Guru", href: "/teachers", group: "Master Data" },
    { label: "Kelas", href: "/classes", group: "Master Data" },
    { label: "Jadwal", href: "/schedules", group: "Master Data" },
    { label: "Enrollment", href: "/enrollments", group: "Transaction" },
    { label: "Pembayaran", href: "/payments", group: "Transaction" },
    { label: "Absensi", href: "/attendance", group: "Attendance" },
  ],
  teacher: [
    { label: "Dashboard", href: "/dashboard", group: "Menu" },
    { label: "Jadwal Hari Ini", href: "/teacher-schedule", group: "Jadwal" },
    { label: "Jadwal Mingguan", href: "/my-schedule", group: "Jadwal" },
    { label: "Kelas Aktif", href: "/my-classes", group: "Kelas" },
    { label: "Daftar Murid", href: "/teacher/my-students", group: "Murid" },
    { label: "Progress Murid", href: "/student-progress", group: "Murid" },
    { label: "Absensi Murid", href: "/teacher/student-attendance", group: "Absensi" },
    { label: "Catatan Pembelajaran", href: "/learning-notes", group: "Murid" },
    { label: "Honor Saya", href: "/salary", group: "Honor" },
  ],
  student: [
    { label: "Dashboard", href: "/dashboard", group: "Menu" },
    { label: "Data Saya", href: "/profile", group: "Profil" },
    { label: "Kelas Aktif", href: "/my-class", group: "Kelas" },
    { label: "Jadwal", href: "/my-class/schedule", group: "Kelas" },
    { label: "Progress Belajar", href: "/progress", group: "Kelas" },
    { label: "Absensi Saya", href: "/attendance", group: "Absensi" },
    { label: "Pembayaran Les", href: "/my-payments", group: "Transaksi" },
    { label: "Invoice", href: "/my-invoices", group: "Transaksi" },
    { label: "Saldo Poin", href: "/loyalty", group: "Loyalty" },
    { label: "Reward", href: "/rewards", group: "Loyalty" },
  ],
  parent: [
    { label: "Dashboard", href: "/dashboard", group: "Menu" },
    { label: "Data Saya", href: "/profile", group: "Profil" },
    { label: "Kelas Aktif", href: "/my-class", group: "Kelas" },
    { label: "Absensi", href: "/attendance", group: "Absensi" },
    { label: "Pembayaran", href: "/my-payments", group: "Transaksi" },
  ],
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
  const menus = searchMenus[role] || searchMenus.student;

  const filteredMenus = searchQuery
    ? menus.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : menus;

  const groupedResults = filteredMenus.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const handleSelect = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setSearchOpen(false);
  };

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
              <div ref={searchRef} className="hidden md:block relative">
                <div className="flex items-center gap-2 bg-[#F5F2EB] rounded-xl px-4 py-2 w-80">
                  <Search className="h-4 w-4 text-[#5B6472]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Cari menu, siswa, kelas..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    className="bg-transparent text-sm text-[#0B1526] placeholder:text-[#8A93A3] focus:outline-none w-full"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                      className="text-[#8A93A3] hover:text-[#0B1526]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {searchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#0B1526]/10 shadow-xl max-h-80 overflow-y-auto z-50">
                    {Object.keys(groupedResults).length === 0 ? (
                      <div className="p-4 text-center text-sm text-[#8A93A3]">
                        Tidak ada hasil untuk "{searchQuery}"
                      </div>
                    ) : (
                      Object.entries(groupedResults).map(([group, items]) => (
                        <div key={group}>
                          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8A93A3] bg-[#F5F2EB]/50">
                            {group}
                          </div>
                          {items.map((item) => (
                            <button
                              key={item.href}
                              onClick={() => handleSelect(item.href)}
                              className="w-full text-left px-4 py-2.5 text-sm text-[#0B1526] hover:bg-[#C9A227]/10 transition-colors flex items-center gap-3"
                            >
                              <Search className="h-3.5 w-3.5 text-[#8A93A3]" />
                              {item.label}
                            </button>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                )}
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
