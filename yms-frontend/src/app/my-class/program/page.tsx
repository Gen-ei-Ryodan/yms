"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Music, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MyProgramPage() {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get("/enrollments", { params: { student_id: studentId, status: "ACTIVE", per_page: 1 } });
          setEnrollment(response.data.data[0] || null);
        }
      } catch (error) {
        console.error("Failed to fetch program:", error);
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

  const classInfo = enrollment?.class;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program & Level</h1>
          <p className="text-sm text-gray-500 mt-1">Your enrolled program and level</p>
        </div>

        {classInfo ? (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Music className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{classInfo.course?.name}</h3>
                    <p className="text-sm text-gray-500">{classInfo.class_code}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold mb-3">Detail Program</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Program</p>
                    <p className="font-medium">{classInfo.course?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Level</p>
                    <p className="font-medium">{classInfo.level?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Durasi Sesi</p>
                    <p className="font-medium">{classInfo.course?.duration} menit</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Harga</p>
                  <p className="font-medium">Rp {Number(classInfo.course?.price || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold mb-3">Deskripsi Program</h3>
              <p className="text-sm text-gray-600">{classInfo.course?.description || "Tidak ada deskripsi"}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Music className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Belum terdaftar di program manapun</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
