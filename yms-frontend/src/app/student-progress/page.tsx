"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, TrendingUp, Plus, CheckCircle, Circle, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function StudentProgressPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const selectClass = "w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30";
  const inputClass = "h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30 text-sm";

  const fetchData = async () => {
    try {
      const teacherId = user?.teacher?.id;
      if (teacherId) {
        const [progressRes, classesRes] = await Promise.all([
          axios.get("/student-progress", { params: { per_page: 50 } }),
          axios.get("/classes", { params: { teacher_id: teacherId, per_page: 50, with: "enrollments.student.user" } }),
        ]);
        setProgress(progressRes.data.data);
        setClasses(classesRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  useEffect(() => {
    if (formData.class_id) {
      const cls = classes.find(c => c.id == formData.class_id);
      setClassStudents(cls?.enrollments?.map((e: any) => e.student) || []);
    }
  }, [formData.class_id, classes]);

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        lessons_completed: formData.lessons_completed || 0,
        total_lessons: formData.total_lessons || 10,
        teacher_notes: formData.teacher_notes || "",
      };
      await axios.post("/student-progress", payload);
      setShowForm(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "EXCELLENT": return "bg-emerald-100 text-emerald-800";
      case "PROFICIENT": return "bg-blue-100 text-blue-800";
      case "DEVELOPING": return "bg-amber-100 text-amber-800";
      default: return "bg-[#F5F2EB] text-[#5B6472]";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data progress...</p>
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
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Progress Murid</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Student Progress</h1>
              <p className="text-white/60 text-lg">Update dan pantau progress belajar siswa</p>
            </div>
            <button
              onClick={() => { setFormData({ assessed_at: new Date().toISOString().split("T")[0], lessons_completed: 1, total_lessons: 10 }); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold rounded-xl transition-all shadow-lg shadow-[#C9A227]/25"
            >
              <Plus className="h-4 w-4" /> Tambah Progress
            </button>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="space-y-4">
          {progress.map((p) => {
            const expanded = expandedId === p.id;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-[#0B1526]/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#F5F2EB]/30 transition-colors" onClick={() => setExpandedId(expanded ? null : p.id)}>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                      <BookOpen className="h-5 w-5 text-[#C9A227]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B1526]">{p.student?.full_name}</p>
                      <p className="text-sm text-[#8A93A3]">{p.title} · {p.class?.course?.name} {p.class?.level?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.level && <Badge className={`${getLevelColor(p.level)} font-medium`}>{p.level}</Badge>}
                    <span className="text-sm text-[#8A93A3]">{p.lessons_completed ?? 0}/{p.total_lessons ?? 10} Lesson</span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-[#8A93A3]" /> : <ChevronDown className="h-4 w-4 text-[#8A93A3]" />}
                  </div>
                </div>

                {expanded && (
                  <div className="px-5 pb-5 border-t border-[#0B1526]/5 pt-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#F5F2EB] rounded-xl p-4">
                      <div>
                        <p className="text-xs text-[#8A93A3] font-medium">Program</p>
                        <p className="font-semibold text-[#0B1526]">{p.class?.course?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8A93A3] font-medium">Level</p>
                        <p className="font-semibold text-[#0B1526]">{p.class?.level?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8A93A3] font-medium">Kelas</p>
                        <p className="font-semibold text-[#0B1526]">{p.class?.class_code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8A93A3] font-medium">Tanggal</p>
                        <p className="font-semibold text-[#0B1526]">{p.assessed_at}</p>
                      </div>
                    </div>

                    {/* Lesson Progress */}
                    <div>
                      <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-2">Materi</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: p.total_lessons || 10 }, (_, i) => {
                          const completed = i < (p.lessons_completed || 0);
                          return (
                            <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${completed ? "bg-emerald-100 text-emerald-700" : "bg-[#F5F2EB] text-[#8A93A3]"}`}>
                              {completed ? <CheckCircle className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                              Lesson {i + 1}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Catatan */}
                    {p.teacher_notes && (
                      <div>
                        <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Catatan Guru</p>
                        <p className="text-sm text-[#5B6472] bg-[#F5F2EB] rounded-xl p-3">{p.teacher_notes}</p>
                      </div>
                    )}

                    {p.description && (
                      <div>
                        <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Deskripsi</p>
                        <p className="text-sm text-[#5B6472]">{p.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {progress.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-12 text-center shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#F5F2EB] flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#8A93A3]" />
                </div>
                <p className="text-[#8A93A3] font-medium">Belum ada data progress</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Progress Form */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Tambah Progress" size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Kelas</label>
              <select value={formData.class_id || ""} onChange={(e) => setFormData({ ...formData, class_id: e.target.value, student_id: "" })} className={selectClass}>
                <option value="">Pilih Kelas</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.class_code} - {c.course?.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Murid</label>
              <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className={selectClass}>
                <option value="">Pilih Murid</option>
                {classStudents.map((s: any) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Judul / Materi</label>
            <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: Chord Dasar" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Lesson Selesai</label>
              <Input type="number" min="0" max="100" value={formData.lessons_completed || ""} onChange={(e) => setFormData({ ...formData, lessons_completed: parseInt(e.target.value) || 0 })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Total Lesson</label>
              <Input type="number" min="1" max="100" value={formData.total_lessons || ""} onChange={(e) => setFormData({ ...formData, total_lessons: parseInt(e.target.value) || 10 })} className={inputClass} />
            </div>
          </div>

          {/* Lesson Visual */}
          {formData.total_lessons > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Preview Materi</label>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: formData.total_lessons || 10 }, (_, i) => {
                  const completed = i < (formData.lessons_completed || 0);
                  return (
                    <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${completed ? "bg-emerald-100 text-emerald-700" : "bg-[#F5F2EB] text-[#8A93A3]"}`}>
                      {completed ? <CheckCircle className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                      Lesson {i + 1}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Catatan Guru</label>
            <textarea value={formData.teacher_notes || ""} onChange={(e) => setFormData({ ...formData, teacher_notes: e.target.value })}
              placeholder="Contoh: Sudah memahami materi dasar. Perlu latihan finger positioning."
              className="w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 resize-none" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Level Kompetensi</label>
              <select value={formData.level || ""} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className={selectClass}>
                <option value="">Pilih Level</option>
                <option value="BEGINNER">Beginner</option>
                <option value="DEVELOPING">Developing</option>
                <option value="PROFICIENT">Proficient</option>
                <option value="EXCELLENT">Excellent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Tanggal Update</label>
              <Input type="date" value={formData.assessed_at || ""} onChange={(e) => setFormData({ ...formData, assessed_at: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-[#0B1526]/10 text-[#5B6472] hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={handleSave} className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/25">Simpan Progress</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
