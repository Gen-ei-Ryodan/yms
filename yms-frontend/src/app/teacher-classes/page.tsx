"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, BookOpen, Users, TrendingUp, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function TeacherClassesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/reports/teachers")
      .then((r) => setData(r.data.data))
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
          <h1 className="text-2xl font-bold text-gray-900">Kelas Guru</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of teacher assignments and classes</p>
        </div>

        <div className="space-y-4">
          {data?.map((teacher: any) => (
            <div key={teacher.teacher_code} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{teacher.name}</h3>
                  <p className="text-sm text-gray-500">{teacher.teacher_code} · {teacher.specialization}</p>
                </div>
                <Badge className={getStatusColor(teacher.status)}>{teacher.status}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Kelas: {teacher.active_classes}/{teacher.total_classes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Murid: {teacher.total_students}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Sesi: {teacher.total_sessions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Kehadiran: {teacher.attendance_rate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
