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
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sorted = [...schedules].sort((a, b) => dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week));

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Kelas</h1>
          <p className="text-sm text-gray-500 mt-1">Your class schedule</p>
        </div>

        {sorted.length > 0 ? (
          <div className="space-y-3">
            {sorted.map((s) => (
              <div key={s.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{s.day_of_week}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.start_time} - {s.end_time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.room?.name || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Belum ada jadwal</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
