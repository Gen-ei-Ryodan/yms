"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function LearningNotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const teacherId = user?.teacher?.id;
      if (teacherId) {
        const [notesRes, classesRes] = await Promise.all([
          axios.get("/learning-notes", { params: { teacher_id: teacherId, per_page: 50 } }),
          axios.get("/classes", { params: { teacher_id: teacherId, per_page: 50 } }),
        ]);
        setNotes(notesRes.data.data);
        setClasses(classesRes.data.data);
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
      if (formData.id) {
        await axios.put(`/learning-notes/${formData.id}`, formData);
      } else {
        await axios.post("/learning-notes", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/learning-notes/${id}`);
    fetchData();
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
            <h1 className="text-2xl font-bold text-gray-900">Catatan Pembelajaran</h1>
            <p className="text-sm text-gray-500 mt-1">Manage learning notes for your students</p>
          </div>
          <Button onClick={() => { setFormData({ note_date: new Date().toISOString().split("T")[0] }); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Note
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Tanggal</th>
                <th className="text-left p-3 font-medium">Murid</th>
                <th className="text-left p-3 font-medium">Topik</th>
                <th className="text-left p-3 font-medium">Kelas</th>
                <th className="text-left p-3 font-medium">Rating</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((n) => (
                <tr key={n.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3"><ClientDate date={n.note_date} format="date" /></td>
                  <td className="p-3 font-medium">{n.student?.full_name}</td>
                  <td className="p-3">{n.topic || "N/A"}</td>
                  <td className="p-3 text-gray-500">{n.class?.course?.name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= (n.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedNote(n); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(n); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {notes.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada catatan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Catatan">
        {selectedNote && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedNote.topic || "Untitled"}</h3>
              <p className="text-gray-500">{selectedNote.student?.full_name} - {selectedNote.class?.course?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Tanggal</p><p className="font-medium"><ClientDate date={selectedNote.note_date} format="date" /></p></div>
              <div><p className="text-xs text-gray-500">Rating</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= (selectedNote.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  ))}
                </div>
              </div>
            </div>
            <div><p className="text-xs text-gray-500">Isi Catatan</p><p className="font-medium whitespace-pre-wrap">{selectedNote.content}</p></div>
            {selectedNote.homework && <div><p className="text-xs text-gray-500">PR</p><p className="font-medium whitespace-pre-wrap">{selectedNote.homework}</p></div>}
            {selectedNote.teacher_feedback && <div><p className="text-xs text-gray-500">Feedback</p><p className="font-medium whitespace-pre-wrap">{selectedNote.teacher_feedback}</p></div>}
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Catatan" : "Tambah Catatan"} size="lg">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Topic</label>
              <Input value={formData.topic || ""} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input type="date" value={formData.note_date || ""} onChange={(e) => setFormData({ ...formData, note_date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <textarea value={formData.content || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Homework</label>
            <textarea value={formData.homework || ""} onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Feedback</label>
            <textarea value={formData.teacher_feedback || ""} onChange={(e) => setFormData({ ...formData, teacher_feedback: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setFormData({ ...formData, rating: s })}>
                  <Star className={`h-6 w-6 ${s <= (formData.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
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
