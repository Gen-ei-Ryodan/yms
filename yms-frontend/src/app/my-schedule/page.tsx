"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_LABELS: Record<string, string> = {
  Monday: "Senin", Tuesday: "Selasa", Wednesday: "Rabu",
  Thursday: "Kamis", Friday: "Jumat", Saturday: "Sabtu", Sunday: "Minggu",
};

export default function MySchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(nowDay());

  function nowDay() {
    const d = new Date().getDay();
    return DAYS[d === 0 ? 6 : d - 1];
  }

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const teacherId = user?.teacher?.id;
        if (teacherId) {
          const response = await axios.get("/schedules", { params: { teacher_id: teacherId, per_page: 100 } });
          setSchedules(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [user]);

  const filtered = activeDay === "ALL"
    ? schedules
    : schedules.filter(s => s.day_of_week === activeDay);

  const groupedByDay = DAYS.filter(d => schedules.some(s => s.day_of_week === d));

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat jadwal...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Jadwal Mengajar</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Jadwal Mengajar</h1>
            <p className="text-white/60 text-lg">Jadwal mengajar Anda</p>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-2 shadow-sm flex gap-2 flex-wrap">
          <button onClick={() => setActiveDay("ALL")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeDay === "ALL" ? "bg-[#0B1526] text-white shadow-lg shadow-[#0B1526]/20" : "text-[#5B6472] hover:text-[#0B1526] hover:bg-[#F5F2EB]"}`}>
            Semua
          </button>
          {groupedByDay.map(d => (
            <button key={d} onClick={() => setActiveDay(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeDay === d ? "bg-[#0B1526] text-white shadow-lg shadow-[#0B1526]/20" : "text-[#5B6472] hover:text-[#0B1526] hover:bg-[#F5F2EB]"}`}>
              {DAY_LABELS[d] || d}
            </button>
          ))}
        </div>

        {/* Schedule Table */}
        {filtered.length > 0 ? (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F2EB]">
                <tr>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Hari</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Jam</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Kelas</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Program</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Ruangan</th>
                  <th className="text-center p-4 font-semibold text-[#0B1526]">Murid</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                    <td className="p-4 font-semibold text-[#0B1526]">{DAY_LABELS[s.day_of_week] || s.day_of_week}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-[#5B6472]">
                        <Clock className="h-3.5 w-3.5 text-[#C9A227]" />
                        {s.start_time?.slice(0, 5)} - {s.end_time?.slice(0, 5)}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#0B1526]">{s.class?.class_code}</td>
                    <td className="p-4 text-[#5B6472]">{s.class?.course?.name} {s.class?.level?.name}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-[#5B6472]">
                        <MapPin className="h-3.5 w-3.5 text-[#C9A227]" />
                        {s.class?.room?.name || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="flex items-center justify-center gap-1.5 text-[#5B6472]">
                        <Users className="h-3.5 w-3.5 text-[#C9A227]" />
                        {s.class?.enrollments_count ?? "–"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-8 text-center shadow-sm">
            <Calendar className="h-14 w-14 mx-auto text-[#8A93A3] mb-3" />
            <p className="text-[#5B6472] font-medium">Tidak ada jadwal untuk hari ini</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
