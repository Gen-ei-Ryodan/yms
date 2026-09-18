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
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat progress...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
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
      case "PRACTICE": return "bg-emerald-100 text-emerald-800";
      case "PERFORMANCE": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "EXCELLENT": return "bg-emerald-100 text-emerald-800";
      case "PROFICIENT": return "bg-blue-100 text-blue-800";
      case "DEVELOPING": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Progress Belajar</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Progress Belajar</h1>
            <p className="text-white/60 text-lg">Pantau perkembangan belajar Anda</p>
          </div>
        </div>

        {data && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Penilaian", value: data.total_assessments, icon: BookOpen, color: "bg-blue-500" },
                { label: "Rata-rata Nilai", value: data.average_score ? Math.round(data.average_score) : "N/A", icon: TrendingUp, color: "bg-emerald-500" },
                { label: "Level Terkini", value: data.latest_level || "N/A", icon: Award, color: "bg-purple-500" },
                { label: "Kategori Aktif", value: data.categories ? Object.keys(data.categories).length : 0, icon: Target, color: "bg-amber-500" },
              ].map((stat) => (
                <div key={stat.label} className="relative overflow-hidden rounded-2xl bg-white border border-[#0B1526]/5 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8A93A3] font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-[#0B1526]">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Summary */}
            {data.categories && Object.keys(data.categories).length > 0 && (
              <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm">
                <h3 className="font-bold text-lg text-[#0B1526] mb-4">Ringkasan per Kategori</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(data.categories).map(([category, info]: [string, any]) => (
                    <div key={category} className="flex items-center gap-3 p-3 rounded-xl border border-[#0B1526]/5 bg-[#F5F2EB]/30">
                      <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>
                        {getCategoryIcon(category)}
                      </div>
                      <div>
                        <p className="font-medium capitalize text-[#0B1526]">{category.toLowerCase()}</p>
                        <p className="text-sm text-[#8A93A3]">{info.count} penilaian · Rata-rata {info.avg_score ? Math.round(info.avg_score) : "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Table */}
            <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#0B1526]/5">
                <h3 className="font-bold text-lg text-[#0B1526]">Riwayat Penilaian</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-[#F5F2EB]">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Judul</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Kategori</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Nilai</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Level</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Kelas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_progress?.map((p: any, i: number) => (
                    <tr key={p.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`} onClick={() => { setSelectedProgress(p); setShowPanel(true); }}>
                      <td className="p-4 text-[#5B6472]"><ClientDate date={p.assessed_at} format="date" /></td>
                      <td className="p-4 font-semibold text-[#0B1526]">{p.title}</td>
                      <td className="p-4"><Badge className={`${getCategoryColor(p.category)} font-medium`}>{p.category}</Badge></td>
                      <td className="p-4 font-semibold text-[#0B1526]">{p.score ?? "N/A"}</td>
                      <td className="p-4">{p.level ? <Badge className={`${getLevelColor(p.level)} font-medium`}>{p.level}</Badge> : "N/A"}</td>
                      <td className="p-4 text-[#5B6472]">{p.class?.course?.name}</td>
                    </tr>
                  ))}
                  {(!data.recent_progress || data.recent_progress.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#5B6472]">Belum ada penilaian</td>
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
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#0B1526]">{selectedProgress.title}</h3>
              <p className="text-[#8A93A3]">{selectedProgress.class?.course?.name} - {selectedProgress.class?.level?.name}</p>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal</p>
                  <p className="font-semibold text-[#0B1526]"><ClientDate date={selectedProgress.assessed_at} format="date" /></p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Kategori</p>
                  <p className="font-semibold text-[#0B1526] capitalize">{selectedProgress.category?.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Nilai</p>
                  <p className="font-bold text-[#C9A227]">{selectedProgress.score ?? "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Level</p>
                  <p className="font-semibold text-[#0B1526]">{selectedProgress.level || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Guru</p>
                  <p className="font-semibold text-[#0B1526]">{selectedProgress.teacher?.name}</p>
                </div>
              </div>
            </div>
            {selectedProgress.description && (
              <div>
                <p className="text-xs text-[#8A93A3] font-medium mb-1">Deskripsi</p>
                <p className="font-semibold text-[#0B1526]">{selectedProgress.description}</p>
              </div>
            )}
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
