"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, School, Users, CheckCircle, TrendingUp, BookOpen, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClassSummaryPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/teacher/class-summary");
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch class summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          <h1 className="text-2xl font-bold text-gray-900">Rekap Kelas</h1>
          <p className="text-sm text-gray-500 mt-1">Summary of all your classes</p>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Total Kelas</p>
                <p className="text-2xl font-bold text-blue-600">{data.total_classes}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Total Murid</p>
                <p className="text-2xl font-bold text-green-600">{data.total_students}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Total Sesi</p>
                <p className="text-2xl font-bold text-purple-600">{data.total_sessions}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Rata-rata Kehadiran</p>
                <p className="text-2xl font-bold text-orange-600">{data.overall_attendance_rate}%</p>
              </div>
            </div>

            <div className="space-y-4">
              {data.classes?.map((cls: any) => (
                <div key={cls.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{cls.course_name}</h3>
                      <p className="text-sm text-gray-500">{cls.class_code} · {cls.level_name}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Room: {cls.room_name || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Murid: {cls.enrolled_count}/{cls.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Sesi: {cls.total_sessions}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Kehadiran: {cls.attendance_rate}%</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Capacity</span>
                      <span>{cls.enrolled_count}/{cls.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((cls.enrolled_count / cls.capacity) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              {(!data.classes || data.classes.length === 0) && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <School className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No active classes</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
