"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, TrendingUp, Plus, CheckCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";
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
      case "EXCELLENT": return "bg-green-100 text-green-800";
      case "PROFICIENT": return "bg-blue-100 text-blue-800";
      case "DEVELOPING": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress Murid</h1>
            <p className="text-sm text-gray-500 mt-1">Update dan pantau progress belajar siswa</p>
          </div>
          <Button onClick={() => { setFormData({ assessed_at: new Date().toISOString().split("T")[0], lessons_completed: 1, total_lessons: 10 }); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Progress
          </Button>
        </div>

        {/* Progress Cards */}
        {progress.map((p) => {
          const expanded = expandedId === p.id;
          return (
            <div key={p.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(expanded ? null : p.id)}>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{p.student?.full_name}</p>
                  <p className="text-sm text-gray-500">{p.title} · {p.class?.course?.name} {p.class?.level?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  {p.level && <Badge className={getLevelColor(p.level)}>{p.level}</Badge>}
                  <span className="text-sm text-gray-400">{p.lessons_completed ?? 0}/{p.total_lessons ?? 10} Lesson</span>
                  {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
              </div>

              {expanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><p className="text-xs text-gray-400">Program</p><p className="font-medium">{p.class?.course?.name}</p></div>
                    <div><p className="text-xs text-gray-400">Level</p><p className="font-medium">{p.class?.level?.name}</p></div>
                    <div><p className="text-xs text-gray-400">Kelas</p><p className="font-medium">{p.class?.class_code}</p></div>
                    <div><p className="text-xs text-gray-400">Tanggal</p><p className="font-medium">{p.assessed_at}</p></div>
                  </div>

                  {/* Lesson Progress */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Materi</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: p.total_lessons || 10 }, (_, i) => {
                        const completed = i < (p.lessons_completed || 0);
                        return (
                          <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
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
                      <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Catatan Guru</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">{p.teacher_notes}</p>
                    </div>
                  )}

                  {p.description && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Deskripsi</p>
                      <p className="text-sm text-gray-500">{p.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {progress.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Belum ada data progress</p>
          </div>
        )}
      </div>

      {/* Add Progress Form */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Add Student Progress" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Kelas</label>
              <select value={formData.class_id || ""} onChange={(e) => setFormData({ ...formData, class_id: e.target.value, student_id: "" })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
                <option value="">Pilih Kelas</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.class_code} - {c.course?.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Murid</label>
              <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
                <option value="">Pilih Murid</option>
                {classStudents.map((s: any) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Judul / Materi</label>
            <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: Chord Dasar" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Lesson Selesai</label>
              <Input type="number" min="0" max="100" value={formData.lessons_completed || ""} onChange={(e) => setFormData({ ...formData, lessons_completed: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Lesson</label>
              <Input type="number" min="1" max="100" value={formData.total_lessons || ""} onChange={(e) => setFormData({ ...formData, total_lessons: parseInt(e.target.value) || 10 })} />
            </div>
          </div>

          {/* Lesson Visual */}
          {formData.total_lessons > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Preview Materi</label>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: formData.total_lessons || 10 }, (_, i) => {
                  const completed = i < (formData.lessons_completed || 0);
                  return (
                    <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                      {completed ? <CheckCircle className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                      Lesson {i + 1}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Catatan Guru</label>
            <textarea value={formData.teacher_notes || ""} onChange={(e) => setFormData({ ...formData, teacher_notes: e.target.value })}
              placeholder="Contoh: Sudah memahami materi dasar. Perlu latihan finger positioning."
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Level Kompetensi</label>
              <select value={formData.level || ""} onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
                <option value="">Pilih Level</option>
                <option value="BEGINNER">Beginner</option>
                <option value="DEVELOPING">Developing</option>
                <option value="PROFICIENT">Proficient</option>
                <option value="EXCELLENT">Excellent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Update</label>
              <Input type="date" value={formData.assessed_at || ""} onChange={(e) => setFormData({ ...formData, assessed_at: e.target.value })} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Progress</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
