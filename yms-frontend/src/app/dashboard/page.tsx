"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import axios from "axios";
import {
  Loader2, TrendingUp, Users, GraduationCap, Calendar, DollarSign, Star,
  Clock, School, BookOpen, ShoppingCart, ArrowLeftRight, Plane, Gift,
  CheckCircle, AlertCircle, XCircle, UserMinus, Receipt
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex items-center justify-center h-64 bg-white/60 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (user?.role === "teacher") {
    const d = data as any;
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold">Halo, {user?.name} 👋</h1>
            <p className="text-green-100 mt-1">Selamat mengajar hari ini</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="h-5 w-5 text-blue-600" /></div>
                <div>
                  <p className="text-xs text-gray-400">Jadwal Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{d?.today_classes_count || 0}</p>
                  <p className="text-xs text-gray-400">Kelas</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg"><Users className="h-5 w-5 text-green-600" /></div>
                <div>
                  <p className="text-xs text-gray-400">Total Murid</p>
                  <p className="text-2xl font-bold text-gray-900">{d?.total_students || 0}</p>
                  <p className="text-xs text-gray-400">Siswa</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg"><BookOpen className="h-5 w-5 text-purple-600" /></div>
                <div>
                  <p className="text-xs text-gray-400">Kelas Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{d?.active_classes_count || 0}</p>
                  <p className="text-xs text-gray-400">Kelas</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg"><TrendingUp className="h-5 w-5 text-yellow-600" /></div>
                <div>
                  <p className="text-xs text-gray-400">Progress Murid</p>
                  <p className="text-2xl font-bold text-gray-900">{d?.progress_rate || 0}%</p>
                  <p className="text-xs text-gray-400">Kehadiran</p>
                </div>
              </div>
            </div>
          </div>

          {/* Jadwal Hari Ini */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Jadwal Hari Ini</h2>
            {d?.today_schedules?.length > 0 ? (
              <div className="space-y-3">
                {d.today_schedules.map((sched: any) => (
                  <div key={sched.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-gray-400">{sched.start_time?.slice(0, 5)}</p>
                      <div className="w-0.5 h-6 bg-blue-300 mx-auto my-1"></div>
                      <p className="text-xs text-gray-400">{sched.end_time?.slice(0, 5)}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{sched.course} {sched.level}</p>
                      <p className="text-sm text-gray-500">{sched.class_code} · {sched.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">{sched.enrolled_count} Siswa</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Tidak ada jadwal hari ini</p>
            )}
          </div>

          {/* Kelas Aktif */}
          {d?.active_classes?.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Kelas Aktif</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {d.active_classes.map((cls: any) => (
                  <div key={cls.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{cls.course} {cls.level}</p>
                    <p className="text-sm text-gray-500">{cls.class_code}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{cls.enrolled_count}/{cls.capacity} siswa</span>
                      <a href={`/student-progress?class_id=${cls.id}`} className="text-xs text-blue-600 hover:underline">Lihat Detail →</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  if (user?.role === "student") {
    const d = data as any;
    const classInfo = d?.current_class?.class;
    const schedules = classInfo?.schedules || [];
    const nextSched = d?.next_schedule;

    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold">Halo, {user?.name} 👋</h1>
            <p className="text-blue-100 mt-1">Selamat datang di Yamaha Music School</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Card */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Kelas Aktif</p>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">
                    {classInfo ? `${classInfo.course?.name} ${classInfo.level?.name}` : "Tidak ada kelas"}
                  </h2>
                  {classInfo && <p className="text-sm text-gray-500">{classInfo.class_code}</p>}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {d?.membership_status || "Active"}
                </span>
              </div>

              {classInfo && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Pengajar</p>
                    <p className="text-sm font-semibold">{classInfo.teacher?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Ruangan</p>
                    <p className="text-sm font-semibold">{classInfo.room?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Kapasitas</p>
                    <p className="text-sm font-semibold">{classInfo.capacity} siswa</p>
                  </div>
                  {nextSched && (
                    <div className="col-span-2 md:col-span-3">
                      <p className="text-xs text-gray-400">Jadwal Berikutnya</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {nextSched.day_of_week}, {nextSched.start_time} - {nextSched.end_time}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!classInfo && (
                <p className="text-gray-400 text-sm mt-4">Anda belum terdaftar di kelas manapun.</p>
              )}
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Saldo Loyalty</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">{d?.loyalty_points || 0}</p>
                <p className="text-xs text-gray-400 mt-1">poin</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Tingkat Kehadiran</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{d?.attendance_rate || 0}%</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Status Pembayaran</p>
                <p className="text-sm font-bold mt-1">{d?.payment_status === "ACTIVE" ? "Lunas" : d?.payment_status || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Shortcut Buttons */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Akses Cepat</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <a href="/requests" className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <Plane className="h-6 w-6 text-blue-600" />
                <span className="text-xs font-medium text-gray-700 text-center">Ajukan Cuti</span>
              </a>
              <a href="/requests" className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
                <ArrowLeftRight className="h-6 w-6 text-purple-600" />
                <span className="text-xs font-medium text-gray-700 text-center">Pindah Kelas</span>
              </a>
              <a href="/my-class" className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
                <Calendar className="h-6 w-6 text-green-600" />
                <span className="text-xs font-medium text-gray-700 text-center">Lihat Jadwal</span>
              </a>
              <a href="/my-transactions" className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all">
                <Receipt className="h-6 w-6 text-orange-600" />
                <span className="text-xs font-medium text-gray-700 text-center">Riwayat Pembayaran</span>
              </a>
              <a href="/attendance" className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
                <span className="text-xs font-medium text-gray-700 text-center">Riwayat Absensi</span>
              </a>
              <a href="/rewards" className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all">
                <Gift className="h-6 w-6 text-pink-600" />
                <span className="text-xs font-medium text-gray-700 text-center">Reward</span>
              </a>
            </div>
          </div>

          {/* Progress Belajar */}
          {d?.progress && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Progress Belajar</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Program</span>
                    <span className="font-semibold">{classInfo?.course?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Level</span>
                    <span className="font-semibold">{d.progress.latest_level || classInfo?.level?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Lesson</span>
                    <span className="font-semibold">{d.progress.completed_lessons} / {d.progress.total_lessons}</span>
                  </div>
                  {d.progress.latest_topic && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Materi Terakhir</span>
                      <span className="font-semibold text-blue-600">{d.progress.last_material || d.progress.latest_topic}</span>
                    </div>
                  )}
                </div>
                {d.progress.teacher_notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Catatan Guru</p>
                    <p className="text-sm text-gray-700">{d.progress.teacher_notes}</p>
                    {d.progress.teacher_feedback && (
                      <p className="text-sm text-gray-500 mt-2 italic">"{d.progress.teacher_feedback}"</p>
                    )}
                  </div>
                )}
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of Yamaha Music School operations</p>
        </div>

        {data && (
          <>
            {/* ── SISWA ── */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Siswa</h2>
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
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Kelas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Kelas" value={data.classes.total_classes} icon={School} color="blue" />
                <StatCard title="Kelas Aktif" value={data.classes.active_classes} icon={School} color="green" />
                <StatCard title="Kelas Hari Ini" value={data.classes.today_schedules} icon={Calendar} color="purple" />
                <StatCard title="Kelas Penuh" value={data.classes.full_classes} icon={AlertCircle} color="red" />
              </div>
              {Object.keys(data.classes.students_per_class).length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
                  <p className="text-sm font-semibold text-gray-500 mb-3">Jumlah Siswa per Kelas</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(data.classes.students_per_class).map(([classId, count]) => (
                      <div key={classId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500">Class #{classId}</span>
                        <span className="text-sm font-bold text-blue-600">{count} siswa</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── ABSENSI ── */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Absensi</h2>
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
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Transaksi</h2>
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
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Loyalty</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Poin" value={data.loyalty.total_points_issued} icon={Star} color="yellow" />
                <StatCard title="Poin Digunakan" value={data.loyalty.points_redeemed} icon={Star} color="orange" />
                <StatCard title="Anggota Aktif" value={data.loyalty.active_loyalty_members} icon={Users} color="blue" />
                <StatCard title="Reward Ditukar" value={data.loyalty.reward_redemption} icon={Gift} color="purple" />
              </div>
            </div>

            {/* ── APPROVALS ── */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Menunggu Persetujuan</h2>
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
