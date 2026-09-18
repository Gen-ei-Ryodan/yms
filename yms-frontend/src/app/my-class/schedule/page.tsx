"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Calendar, Clock, MapPin } from "lucide-react";

export default function MySchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const enrollRes = await axios.get("/enrollments", { params: { student_id: studentId, status: "ACTIVE", per_page: 1 } });
          const enrollment = enrollRes.data.data[0];
          if (enrollment) {
            setSchedules(enrollment.class?.schedules || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat jadwal kelas...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sorted = [...schedules].sort((a, b) => dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week));

  const DAY_LABELS: Record<string, string> = {
    Monday: "Senin", Tuesday: "Selasa", Wednesday: "Rabu",
    Thursday: "Kamis", Friday: "Jumat", Saturday: "Sabtu", Sunday: "Minggu",
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Gradient Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Jadwal Kelas</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Jadwal Kelas</h1>
            <p className="text-white/60 text-lg">Jadwal kelas Anda</p>
          </div>
        </div>

        {/* Schedule Cards */}
        {sorted.length > 0 ? (
          <div className="space-y-3">
            {sorted.map((s, i) => (
              <div key={s.id} className="bg-white rounded-2xl border border-[#0B1526]/5 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Calendar className="h-7 w-7 text-[#C9A227]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#0B1526]">{DAY_LABELS[s.day_of_week] || s.day_of_week}</p>
                  <div className="flex items-center gap-4 text-sm text-[#5B6472] mt-1.5">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#C9A227]" /> {s.start_time?.slice(0, 5)} - {s.end_time?.slice(0, 5)}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#C9A227]" /> {s.room?.name || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-8 text-center shadow-sm">
            <Calendar className="h-14 w-14 mx-auto text-[#8A93A3] mb-3" />
            <p className="text-[#5B6472] font-medium">Belum ada jadwal</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
