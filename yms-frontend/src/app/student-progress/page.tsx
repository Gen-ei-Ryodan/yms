"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, TrendingUp, Award, BookOpen, Music, Target, Star, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function StudentProgressPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const teacherId = user?.teacher?.id;
      if (teacherId) {
        const [progressRes, classesRes] = await Promise.all([
          axios.get("/student-progress", { params: { per_page: 50 } }),
          axios.get("/classes", { params: { teacher_id: teacherId, per_page: 50 } }),
        ]);
        setProgress(progressRes.data.data);
        setClasses(classesRes.data.data);

        const studentIds = new Set<number>();
        classesRes.data.data.forEach((c: any) => {
          if (c.enrollments) {
            c.enrollments.forEach((e: any) => studentIds.add(e.student_id));
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleSave = async () => {
    try {
      await axios.post("/student-progress", formData);
      setShowForm(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error("Failed to save progress:", error);
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
            <p className="text-sm text-gray-500 mt-1">Manage and track student learning progress</p>
          </div>
          <Button onClick={() => { setFormData({ assessed_at: new Date().toISOString().split("T")[0], category: "GENERAL" }); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Progress
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Tanggal</th>
                <th className="text-left p-3 font-medium">Murid</th>
                <th className="text-left p-3 font-medium">Judul</th>
                <th className="text-left p-3 font-medium">Kategori</th>
                <th className="text-left p-3 font-medium">Nilai</th>
                <th className="text-left p-3 font-medium">Level</th>
                <th className="text-left p-3 font-medium">Kelas</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((p) => (
                <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3"><ClientDate date={p.assessed_at} format="date" /></td>
                  <td className="p-3 font-medium">{p.student?.full_name}</td>
                  <td className="p-3">{p.title}</td>
                  <td className="p-3"><Badge className={getCategoryColor(p.category)}>{p.category}</Badge></td>
                  <td className="p-3 font-medium">{p.score ?? "N/A"}</td>
                  <td className="p-3">{p.level ? <Badge className={getLevelColor(p.level)}>{p.level}</Badge> : "N/A"}</td>
                  <td className="p-3 text-gray-500">{p.class?.course?.name}</td>
                </tr>
              ))}
              {progress.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Belum ada data progress</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Add Student Progress" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
                <option value="">Select Student</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select value={formData.class_id || ""} onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
                <option value="">Select Class</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.class_code} - {c.course?.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={3} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={formData.category || "GENERAL"} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
                <option value="TECHNIQUE">Technique</option>
                <option value="THEORY">Theory</option>
                <option value="PRACTICE">Practice</option>
                <option value="PERFORMANCE">Performance</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Score (0-100)</label>
              <Input type="number" min="0" max="100" value={formData.score || ""} onChange={(e) => setFormData({ ...formData, score: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select value={formData.level || ""} onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
                <option value="">Select Level</option>
                <option value="BEGINNER">Beginner</option>
                <option value="DEVELOPING">Developing</option>
                <option value="PROFICIENT">Proficient</option>
                <option value="EXCELLENT">Excellent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assessment Date</label>
            <Input type="date" value={formData.assessed_at || ""} onChange={(e) => setFormData({ ...formData, assessed_at: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
