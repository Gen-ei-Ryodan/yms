"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import axios from "axios";
import {
  Loader2, TrendingUp, Users, GraduationCap, Calendar, DollarSign, Star,
  Clock, School, BookOpen, ShoppingCart, ArrowLeftRight, Plane, Gift,
  CheckCircle, AlertCircle, XCircle, UserMinus, Receipt, Music2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardData {
  students: {
    total_students: number;
    active_students: number;
    new_students: number;
    students_on_leave: number;
    students_holiday: number;
    students_left: number;
    students_graduated: number;
    students_transferred: number;
    students_inactive: number;
    students_suspended: number;
  };
  classes: {
    total_classes: number;
    active_classes: number;
    full_classes: number;
    today_schedules: number;
    students_per_class: Record<string, number>;
  };
  attendance: {
    today_attendance: number;
    attendance_rate: number;
    present_today: number;
    late_today: number;
    absent_today: number;
    on_leave_today: number;
    excused_today: number;
  };
  payment: {
    today_revenue: number;
    today_purchases: number;
    total_transactions: number;
    monthly_revenue: number;
    outstanding_payment: number;
    overdue_invoice: number;
  };
  loyalty: {
    total_points_issued: number;
    points_redeemed: number;
    active_loyalty_members: number;
    reward_redemption: number;
  };
  approvals: {
    total_pending: number;
    pending_leaves: number;
    pending_transfers: number;
    pending_redemptions: number;
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchDashboard = async () => {
      try {
        const endpoint = user.role === "teacher" ? "/dashboard/teacher"
          : user.role === "student" ? "/dashboard/student"
          : "/dashboard/admin";
        const response = await axios.get(endpoint);
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user, authLoading]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]"></div>
              <Music2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat dashboard...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── TEACHER DASHBOARD ──
  if (user?.role === "teacher") {
    const d = data as any;
    return (
      <MainLayout>
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Panel Guru</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Selamat Datang, {user?.name} 👋</h1>
              <p className="text-white/60 text-lg">Siap mengajar dan memberikan yang terbaik hari ini?</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Jadwal Hari Ini"
              value={d?.today_classes_count || 0}
              icon={Calendar}
              color="blue"
              trend="up"
              trendValue="+2 dari kemarin"
            />
            <StatCard
              title="Total Murid"
              value={d?.total_students || 0}
              icon={Users}
              color="green"
            />
            <StatCard
              title="Kelas Aktif"
              value={d?.active_classes_count || 0}
              icon={School}
              color="purple"
            />
            <StatCard
              title="Tingkat Kehadiran"
              value={`${d?.progress_rate || 0}%`}
              icon={TrendingUp}
              color="yellow"
              trend="up"
              trendValue="Meningkat"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Jadwal Hari Ini - 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#0B1526]/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1526]">Jadwal Hari Ini</h2>
                    <p className="text-sm text-[#8A93A3] mt-0.5">{d?.today_schedules?.length || 0} kelas terjadwal</p>
                  </div>
                  <a href="/my-schedule" className="text-sm font-medium text-[#0B1526] hover:text-[#C9A227] transition-colors">
                    Lihat Semua →
                  </a>
                </div>
              </div>
              <div className="p-4">
                {d?.today_schedules?.length > 0 ? (
                  <div className="space-y-2">
                    {d.today_schedules.slice(0, 4).map((sched: any) => (
                      <div key={sched.id} className="flex items-center gap-4 p-4 bg-[#F5F2EB]/50 rounded-xl hover:bg-[#F5F2EB] transition-colors group">
                        <div className="text-center min-w-[70px] bg-white rounded-lg p-2 shadow-sm">
                          <p className="text-xs font-bold text-[#0B1526]">{sched.start_time?.slice(0, 5)}</p>
                          <div className="w-full h-px bg-[#C9A227]/30 my-1" />
                          <p className="text-xs font-bold text-[#0B1526]">{sched.end_time?.slice(0, 5)}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#0B1526] truncate">{sched.course} {sched.level}</p>
                          <p className="text-sm text-[#5B6472] truncate">{sched.class_code} · {sched.room}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0B1526]/5 rounded-full text-xs font-semibold text-[#0B1526]">
                            <Users className="h-3 w-3" />
                            {sched.enrolled_count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-[#8A93A3] mx-auto mb-3" />
                    <p className="text-[#5B6472] font-medium">Tidak ada jadwal hari ini</p>
                    <p className="text-sm text-[#8A93A3]">Nikmati hari libur Anda</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats - 1 column */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-6">
                <h3 className="text-sm font-bold text-[#0B1526] uppercase tracking-wide mb-4">Ringkasan</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#F5F2EB]/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#2E7D5B]/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-[#2E7D5B]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#5B6472]">Hadir</p>
                        <p className="font-bold text-[#0B1526]">{d?.total_students || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F5F2EB]/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#C9A227]/10 rounded-lg flex items-center justify-center">
                        <Star className="h-5 w-5 text-[#C9A227]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#5B6472]">Total Kelas</p>
                        <p className="font-bold text-[#0B1526]">{d?.active_classes_count || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivational Card */}
              <div className="bg-gradient-to-br from-[#C9A227] to-[#8F6F14] rounded-2xl p-6 text-white shadow-lg shadow-[#C9A227]/20">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">Semangat Mengajar!</h3>
                    <p className="text-sm text-white/80 mt-1">Setiap lesson adalah kesempatan untuk menginspirasi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kelas Aktif */}
          {d?.active_classes?.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#0B1526]/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1526]">Kelas Aktif</h2>
                    <p className="text-sm text-[#8A93A3] mt-0.5">{d.active_classes.length} kelas aktif</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {d.active_classes.map((cls: any) => (
                    <div key={cls.id} className="p-4 bg-[#F5F2EB]/50 rounded-xl hover:bg-[#F5F2EB] transition-colors group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-[#0B1526] group-hover:text-[#C9A227] transition-colors">{cls.course} {cls.level}</p>
                          <p className="text-sm text-[#5B6472]">{cls.class_code}</p>
                        </div>
                        <School className="h-5 w-5 text-[#8A93A3]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#5B6472]">{cls.enrolled_count}/{cls.capacity} siswa</span>
                        <a href={`/student-progress?class_id=${cls.id}`} className="text-xs font-medium text-[#0B1526] hover:text-[#C9A227] transition-colors">
                          Lihat Detail →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  // ── STUDENT DASHBOARD ──
  if (user?.role === "student") {
    const d = data as any;
    const classInfo = d?.current_class?.class;
    const nextSched = d?.next_schedule;

    return (
      <MainLayout>
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Portal Siswa</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Halo, {user?.name}! 👋</h1>
              <p className="text-white/60 text-lg">Selamat datang di Yamaha Music School</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#0B1526]/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1526]">Kelas Aktif</h2>
                    <p className="text-sm text-[#8A93A3] mt-0.5">Informasi kelas Anda</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#2E7D5B]/10 text-[#2E7D5B]">
                    {d?.membership_status || "Active"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {classInfo ? (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-14 w-14 bg-gradient-to-br from-[#0B1526] to-[#14233B] rounded-xl flex items-center justify-center shadow-lg">
                        <Music2 className="h-7 w-7 text-[#C9A227]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0B1526]">
                          {classInfo.course?.name} {classInfo.level?.name}
                        </h3>
                        <p className="text-[#5B6472]">{classInfo.class_code}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-[#F5F2EB]/50 rounded-xl">
                        <p className="text-xs text-[#5B6472] font-medium mb-1">Pengajar</p>
                        <p className="font-bold text-[#0B1526]">{classInfo.teacher?.name || "N/A"}</p>
                      </div>
                      <div className="p-4 bg-[#F5F2EB]/50 rounded-xl">
                        <p className="text-xs text-[#5B6472] font-medium mb-1">Ruangan</p>
                        <p className="font-bold text-[#0B1526]">{classInfo.room?.name || "N/A"}</p>
                      </div>
                      <div className="p-4 bg-[#F5F2EB]/50 rounded-xl">
                        <p className="text-xs text-[#5B6472] font-medium mb-1">Kapasitas</p>
                        <p className="font-bold text-[#0B1526]">{classInfo.capacity} siswa</p>
                      </div>
                      {nextSched && (
                        <div className="col-span-2 md:col-span-3 p-4 bg-gradient-to-r from-[#C9A227]/10 to-[#C9A227]/5 rounded-xl border border-[#C9A227]/20">
                          <p className="text-xs text-[#5B6472] font-medium mb-1">Jadwal Berikutnya</p>
                          <p className="font-bold text-[#0B1526]">
                            {nextSched.day_of_week}, {nextSched.start_time} - {nextSched.end_time}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <School className="h-12 w-12 text-[#8A93A3] mx-auto mb-3" />
                    <p className="text-[#5B6472] font-medium">Belum terdaftar di kelas</p>
                    <p className="text-sm text-[#8A93A3]">Hubungi admin untuk pendaftaran</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#C9A227] to-[#8F6F14] rounded-2xl p-6 text-white shadow-lg shadow-[#C9A227]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Star className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">Saldo Loyalty</p>
                </div>
                <p className="text-4xl font-bold mb-1">{d?.loyalty_points || 0}</p>
                <p className="text-sm text-white/70">poin tersedia</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-[#2E7D5B]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-[#2E7D5B]" />
                  </div>
                  <p className="text-sm font-semibold text-[#0B1526]">Kehadiran</p>
                </div>
                <p className="text-3xl font-bold text-[#2E7D5B]">{d?.attendance_rate || 0}%</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-[#0B1526]/5 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-[#0B1526]" />
                  </div>
                  <p className="text-sm font-semibold text-[#0B1526]">Pembayaran</p>
                </div>
                <p className="text-lg font-bold text-[#0B1526]">
                  {d?.payment_status === "ACTIVE" ? "✅ Lunas" : d?.payment_status || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Shortcut Buttons */}
          <div>
            <h2 className="text-lg font-bold text-[#0B1526] mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { href: "/requests", icon: Plane, label: "Ajukan Cuti", color: "from-[#0B1526] to-[#14233B]" },
                { href: "/requests", icon: ArrowLeftRight, label: "Pindah Kelas", color: "from-[#4A1D96] to-[#351570]" },
                { href: "/my-class", icon: Calendar, label: "Lihat Jadwal", color: "from-[#2E7D5B] to-[#1A5C3E]" },
                { href: "/my-transactions", icon: Receipt, label: "Riwayat Bayar", color: "from-[#C2542E] to-[#A03D1F]" },
                { href: "/attendance", icon: CheckCircle, label: "Absensi", color: "from-[#C9A227] to-[#8F6F14]" },
                { href: "/rewards", icon: Gift, label: "Reward", color: "from-[#C2542E] to-[#A03D1F]" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-[#0B1526]/5 hover:border-transparent hover:shadow-lg transition-all duration-300"
                >
                  <div className={`h-12 w-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-[#0B1526] text-center leading-tight">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Progress Belajar */}
          {d?.progress && (
            <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#0B1526]/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#0B1526] rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1526]">Progress Belajar</h2>
                    <p className="text-sm text-[#8A93A3]">Perkembangan pembelajaran Anda</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { label: "Program", value: classInfo?.course?.name || "N/A" },
                      { label: "Level", value: d.progress.latest_level || classInfo?.level?.name || "N/A" },
                      { label: "Lesson", value: `${d.progress.completed_lessons} / ${d.progress.total_lessons}` },
                      ...(d.progress.latest_topic ? [{ label: "Materi Terakhir", value: d.progress.last_material || d.progress.latest_topic }] : []),
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-[#F5F2EB]/50 rounded-xl">
                        <span className="text-sm text-[#5B6472]">{item.label}</span>
                        <span className="font-bold text-[#0B1526]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  {d.progress.teacher_notes && (
                    <div className="bg-gradient-to-br from-[#0B1526]/5 to-[#0B1526]/10 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-[#0B1526]" />
                        <p className="text-xs text-[#5B6472] uppercase font-bold">Catatan Guru</p>
                      </div>
                      <p className="text-sm text-[#0B1526] leading-relaxed">{d.progress.teacher_notes}</p>
                      {d.progress.teacher_feedback && (
                        <p className="text-sm text-[#5B6472] mt-3 italic">&ldquo;{d.progress.teacher_feedback}&rdquo;</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Admin Panel</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-white/60 text-lg">Overview of Yamaha Music School operations</p>
          </div>
        </div>

        {data && (
          <>
            {/* ── SISWA ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-[#0B1526] rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-[#C9A227]" />
                </div>
                <h2 className="text-lg font-bold text-[#0B1526]">Siswa</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Siswa" value={data.students.total_students} icon={Users} color="blue" />
                <StatCard title="Siswa Aktif" value={data.students.active_students} icon={GraduationCap} color="green" />
                <StatCard title="Siswa Baru" value={data.students.new_students} icon={TrendingUp} color="purple" />
                <StatCard title="Siswa Cuti" value={data.students.students_on_leave} icon={Plane} color="orange" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <StatCard title="Siswa Libur" value={data.students.students_holiday} icon={Calendar} color="yellow" />
                <StatCard title="Siswa Keluar" value={data.students.students_left} icon={UserMinus} color="red" />
                <StatCard title="Lulus" value={data.students.students_graduated} icon={GraduationCap} color="blue" />
                <StatCard title="Pindah" value={data.students.students_transferred} icon={ArrowLeftRight} color="purple" />
              </div>
            </div>

            {/* ── KELAS ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-[#0B1526] rounded-lg flex items-center justify-center">
                  <School className="h-4 w-4 text-[#C9A227]" />
                </div>
                <h2 className="text-lg font-bold text-[#0B1526]">Kelas</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Kelas" value={data.classes.total_classes} icon={School} color="blue" />
                <StatCard title="Kelas Aktif" value={data.classes.active_classes} icon={School} color="green" />
                <StatCard title="Kelas Hari Ini" value={data.classes.today_schedules} icon={Calendar} color="purple" />
                <StatCard title="Kelas Penuh" value={data.classes.full_classes} icon={AlertCircle} color="red" />
              </div>
              {Object.keys(data.classes.students_per_class).length > 0 && (
                <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-5 mt-4 shadow-sm">
                  <p className="text-sm font-bold text-[#0B1526] mb-4">Jumlah Siswa per Kelas</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(data.classes.students_per_class).map(([classId, count]) => (
                      <div key={classId} className="flex items-center justify-between p-3 bg-[#F5F2EB]/50 rounded-xl">
                        <span className="text-sm text-[#5B6472]">Class #{classId}</span>
                        <span className="text-sm font-bold text-[#0B1526]">{count} siswa</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── ABSENSI ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-[#0B1526] rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-[#C9A227]" />
                </div>
                <h2 className="text-lg font-bold text-[#0B1526]">Absensi</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Hadir Hari Ini" value={data.attendance.present_today} icon={CheckCircle} color="green" />
                <StatCard title="Alpha Hari Ini" value={data.attendance.absent_today} icon={XCircle} color="red" />
                <StatCard title="Cuti Hari Ini" value={data.attendance.on_leave_today} icon={Plane} color="orange" />
                <StatCard title="Libur Hari Ini" value={data.attendance.excused_today} icon={Calendar} color="yellow" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <StatCard title="Rate Kehadiran" value={`${data.attendance.attendance_rate}%`} icon={TrendingUp} color="blue" />
                <StatCard title="Terlambat" value={data.attendance.late_today} icon={Clock} color="yellow" />
                <StatCard title="Total Absensi Hari Ini" value={data.attendance.today_attendance} icon={BookOpen} color="purple" />
              </div>
            </div>

            {/* ── TRANSAKSI ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-[#0B1526] rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-[#C9A227]" />
                </div>
                <h2 className="text-lg font-bold text-[#0B1526]">Transaksi</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Pembayaran Hari Ini" value={formatCurrency(data.payment.today_revenue)} icon={DollarSign} color="green" />
                <StatCard title="Pembelian Hari Ini" value={data.payment.today_purchases} icon={ShoppingCart} color="blue" />
                <StatCard title="Total Transaksi" value={data.payment.total_transactions} icon={BookOpen} color="purple" />
                <StatCard title="Pendapatan Bulanan" value={formatCurrency(data.payment.monthly_revenue)} icon={DollarSign} color="green" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <StatCard title="Outstanding" value={formatCurrency(data.payment.outstanding_payment)} icon={DollarSign} color="orange" />
                <StatCard title="Invoice Jatuh Tempo" value={data.payment.overdue_invoice} icon={AlertCircle} color="red" />
              </div>
            </div>

            {/* ── LOYALTY ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-[#0B1526] rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-[#C9A227]" />
                </div>
                <h2 className="text-lg font-bold text-[#0B1526]">Loyalty</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Poin" value={data.loyalty.total_points_issued} icon={Star} color="yellow" />
                <StatCard title="Poin Digunakan" value={data.loyalty.points_redeemed} icon={Star} color="orange" />
                <StatCard title="Anggota Aktif" value={data.loyalty.active_loyalty_members} icon={Users} color="blue" />
                <StatCard title="Reward Ditukar" value={data.loyalty.reward_redemption} icon={Gift} color="purple" />
              </div>
            </div>

            {/* ── APPROVALS ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-[#0B1526] rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-[#C9A227]" />
                </div>
                <h2 className="text-lg font-bold text-[#0B1526]">Menunggu Persetujuan</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Pending" value={data.approvals.total_pending} icon={AlertCircle} color="orange" />
                <StatCard title="Pengajuan Cuti" value={data.approvals.pending_leaves} icon={Plane} color="blue" />
                <StatCard title="Pindah Kelas/Program" value={data.approvals.pending_transfers} icon={ArrowLeftRight} color="purple" />
                <StatCard title="Redeem Reward" value={data.approvals.pending_redemptions} icon={Gift} color="green" />
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
