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
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Today's Classes" value={(data as any)?.today_classes || 0} icon={Calendar} color="blue" />
            <StatCard title="Total Students" value={(data as any)?.total_students || 0} icon={Users} color="green" />
            <StatCard title="Attendance Today" value={(data as any)?.attendance_today || 0} icon={Clock} color="purple" />
            <StatCard title="Pending Attendance" value={(data as any)?.pending_attendance || 0} icon={Clock} color="orange" />
          </div>
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
