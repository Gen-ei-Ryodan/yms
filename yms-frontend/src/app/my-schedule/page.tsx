"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Calendar, Clock, MapPin, User, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MySchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-2xl font-bold">My Schedule</h1>
          <p className="text-gray-500 dark:text-gray-400">Your teaching schedule</p>
        </div>

        {schedules.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No schedules found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map((s) => (
              <div key={s.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
                <div className="text-center min-w-[80px]">
                  <p className="text-xs text-gray-500">{s.day_of_week.slice(0, 3)}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{s.class?.course?.name} - {s.class?.level?.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.start_time} - {s.end_time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.room?.name}</span>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{s.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
