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
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Mengajar</h1>
          <p className="text-sm text-gray-500 mt-1">Jadwal mengajar Anda</p>
        </div>

        {/* Day Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveDay("ALL")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeDay === "ALL" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            Semua
          </button>
          {groupedByDay.map(d => (
            <button key={d} onClick={() => setActiveDay(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeDay === d ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {DAY_LABELS[d] || d}
            </button>
          ))}
        </div>

        {/* Schedule Table */}
        {filtered.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium">Hari</th>
                  <th className="text-left p-3 font-medium">Jam</th>
                  <th className="text-left p-3 font-medium">Kelas</th>
                  <th className="text-left p-3 font-medium">Program</th>
                  <th className="text-left p-3 font-medium">Ruangan</th>
                  <th className="text-center p-3 font-medium">Murid</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-medium">{DAY_LABELS[s.day_of_week] || s.day_of_week}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {s.start_time?.slice(0, 5)} - {s.end_time?.slice(0, 5)}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">{s.class?.class_code}</td>
                    <td className="p-3">{s.class?.course?.name} {s.class?.level?.name}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {s.class?.room?.name || "N/A"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="flex items-center justify-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        {s.class?.enrollments_count ?? "–"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Tidak ada jadwal untuk hari ini</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
