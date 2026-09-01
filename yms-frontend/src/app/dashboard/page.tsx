"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import axios from "axios";
import { Loader2, TrendingUp, Users, GraduationCap, Calendar, DollarSign, Star, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardData {
  students: {
    total_students: number;
    active_students: number;
    inactive_students: number;
    new_students: number;
    students_on_leave: number;
  };
  attendance: {
    today_attendance: number;
    attendance_rate: number;
    present_today: number;
    late_today: number;
    absent_today: number;
  };
  classes: {
    active_classes: number;
    today_classes: number;
    available_capacity: number;
    full_classes: number;
  };
  payment: {
    today_revenue: number;
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
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const endpoint = user?.role === "teacher" ? "/dashboard/teacher"
          : user?.role === "student" ? "/dashboard/student"
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
  }, [user?.role]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  if (user?.role === "teacher" || user?.role === "student") {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name}!</p>
          </div>
          {user?.role === "teacher" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Today's Classes" value={(data as any)?.today_classes || 0} icon={Calendar} color="blue" />
              <StatCard title="Total Students" value={(data as any)?.total_students || 0} icon={Users} color="green" />
              <StatCard title="Attendance Today" value={(data as any)?.attendance_today || 0} icon={Clock} color="purple" />
              <StatCard title="Pending Attendance" value={(data as any)?.pending_attendance || 0} icon={Clock} color="orange" />
            </div>
          )}
          {user?.role === "student" && data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Membership Status" value={(data as any).membership_status || "N/A"} icon={GraduationCap} color="blue" />
              <StatCard title="Attendance Rate" value={`${(data as any).attendance_rate || 0}%`} icon={TrendingUp} color="green" />
              <StatCard title="Loyalty Points" value={(data as any).loyalty_points || 0} icon={Star} color="yellow" />
              <StatCard title="Payment Status" value={(data as any).payment_status || "N/A"} icon={DollarSign} color="purple" />
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Overview of Yamaha Music School operations</p>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Students" value={data.students.total_students} icon={Users} color="blue" />
              <StatCard title="Active Students" value={data.students.active_students} icon={GraduationCap} color="green" />
              <StatCard title="New Students" value={data.students.new_students} icon={TrendingUp} color="purple" />
              <StatCard title="On Leave" value={data.students.students_on_leave} icon={Calendar} color="orange" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Attendance Rate" value={`${data.attendance.attendance_rate}%`} icon={Clock} color="green" />
              <StatCard title="Present Today" value={data.attendance.present_today} icon={Clock} color="blue" />
              <StatCard title="Late Today" value={data.attendance.late_today} icon={Clock} color="yellow" />
              <StatCard title="Absent Today" value={data.attendance.absent_today} icon={Clock} color="red" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Active Classes" value={data.classes.active_classes} icon={Calendar} color="blue" />
              <StatCard title="Available Capacity" value={data.classes.available_capacity} icon={Users} color="green" />
              <StatCard title="Full Classes" value={data.classes.full_classes} icon={Calendar} color="purple" />
              <StatCard title="Monthly Revenue" value={formatCurrency(data.payment.monthly_revenue)} icon={DollarSign} color="green" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Outstanding" value={formatCurrency(data.payment.outstanding_payment)} icon={DollarSign} color="orange" />
              <StatCard title="Overdue Invoices" value={data.payment.overdue_invoice} icon={DollarSign} color="red" />
              <StatCard title="Points Issued" value={data.loyalty.total_points_issued} icon={Star} color="yellow" />
              <StatCard title="Redemptions" value={data.loyalty.reward_redemption} icon={Star} color="purple" />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}