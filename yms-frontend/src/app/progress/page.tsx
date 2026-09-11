"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, TrendingUp, Award, BookOpen, Music, Target, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClientDate } from "@/components/ClientDate";

export default function ProgressPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProgress, setSelectedProgress] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get(`/student-progress/student/${studentId}`);
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "TECHNIQUE": return <Target className="h-4 w-4" />;
      case "THEORY": return <BookOpen className="h-4 w-4" />;
      case "PRACTICE": return <Music className="h-4 w-4" />;
      case "PERFORMANCE": return <Star className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "TECHNIQUE": return "bg-blue-100 text-blue-800";
      case "THEORY": return "bg-purple-100 text-purple-800";
      case "PRACTICE": return "bg-green-100 text-green-800";
      case "PERFORMANCE": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "EXCELLENT": return "bg-green-100 text-green-800";
      case "PROFICIENT": return "bg-blue-100 text-blue-800";
      case "DEVELOPING": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Belajar</h1>
          <p className="text-sm text-gray-500 mt-1">Track your learning progress</p>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Total Penilaian</p>
                <p className="text-2xl font-bold text-blue-600">{data.total_assessments}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Rata-rata Nilai</p>
                <p className="text-2xl font-bold text-green-600">{data.average_score ? Math.round(data.average_score) : "N/A"}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Level Terkini</p>
                <p className="text-2xl font-bold text-purple-600">{data.latest_level || "N/A"}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Kategori Aktif</p>
                <p className="text-2xl font-bold text-orange-600">{data.categories ? Object.keys(data.categories).length : 0}</p>
              </div>
            </div>

            {data.categories && Object.keys(data.categories).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-4">Ringkasan per Kategori</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(data.categories).map(([category, info]: [string, any]) => (
                    <div key={category} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                      <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                        {getCategoryIcon(category)}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{category.toLowerCase()}</p>
                        <p className="text-sm text-gray-500">{info.count} penilaian · Rata-rata {info.avg_score ? Math.round(info.avg_score) : "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg">Riwayat Penilaian</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left p-3 font-medium">Tanggal</th>
                    <th className="text-left p-3 font-medium">Judul</th>
                    <th className="text-left p-3 font-medium">Kategori</th>
                    <th className="text-left p-3 font-medium">Nilai</th>
                    <th className="text-left p-3 font-medium">Level</th>
                    <th className="text-left p-3 font-medium">Kelas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_progress?.map((p: any) => (
                    <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedProgress(p); setShowPanel(true); }}>
                      <td className="p-3"><ClientDate date={p.assessed_at} format="date" /></td>
                      <td className="p-3 font-medium">{p.title}</td>
                      <td className="p-3"><Badge className={getCategoryColor(p.category)}>{p.category}</Badge></td>
                      <td className="p-3 font-medium">{p.score ?? "N/A"}</td>
                      <td className="p-3">{p.level ? <Badge className={getLevelColor(p.level)}>{p.level}</Badge> : "N/A"}</td>
                      <td className="p-3 text-gray-500">{p.class?.course?.name}</td>
                    </tr>
                  ))}
                  {(!data.recent_progress || data.recent_progress.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">Belum ada penilaian</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Penilaian">
        {selectedProgress && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedProgress.title}</h3>
              <p className="text-gray-500">{selectedProgress.class?.course?.name} - {selectedProgress.class?.level?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Tanggal</p><p className="font-medium"><ClientDate date={selectedProgress.assessed_at} format="date" /></p></div>
              <div><p className="text-xs text-gray-500">Kategori</p><p className="font-medium capitalize">{selectedProgress.category?.toLowerCase()}</p></div>
              <div><p className="text-xs text-gray-500">Nilai</p><p className="font-medium">{selectedProgress.score ?? "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Level</p><p className="font-medium">{selectedProgress.level || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Guru</p><p className="font-medium">{selectedProgress.teacher?.name}</p></div>
            </div>
            {selectedProgress.description && (
              <div><p className="text-xs text-gray-500">Deskripsi</p><p className="font-medium">{selectedProgress.description}</p></div>
            )}
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
