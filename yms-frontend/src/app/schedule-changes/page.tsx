"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, CalendarClock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function ScheduleChangesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/schedules", { params: { per_page: 50 } })
      .then((r) => setSchedules(r.data.data))
      .finally(() => setLoading(false));
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-900">Pergantian Jadwal</h1>
          <p className="text-sm text-gray-500 mt-1">Manage schedule changes</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Kelas</th>
                <th className="text-left p-3 font-medium">Hari</th>
                <th className="text-left p-3 font-medium">Jam</th>
                <th className="text-left p-3 font-medium">Guru</th>
                <th className="text-left p-3 font-medium">Ruangan</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Berlaku</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium">{s.class?.class_code} - {s.class?.course?.name}</td>
                  <td className="p-3">{s.day_of_week}</td>
                  <td className="p-3">{s.start_time} - {s.end_time}</td>
                  <td className="p-3 text-gray-500">{s.teacher?.name}</td>
                  <td className="p-3 text-gray-500">{s.room?.name}</td>
                  <td className="p-3"><Badge className={getStatusColor(s.status)}>{s.status}</Badge></td>
                  <td className="p-3 text-gray-500">{s.effective_from} s/d {s.effective_until || "∞"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
