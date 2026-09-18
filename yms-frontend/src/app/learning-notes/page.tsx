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

  const selectClass = "w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30";
  const inputClass = "h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30 text-sm";

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
    if (confirm("Hapus catatan ini?")) {
      await axios.delete(`/learning-notes/${id}`);
      fetchData();
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat catatan pembelajaran...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Catatan Pembelajaran</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Learning Notes</h1>
              <p className="text-white/60 text-lg">Kelola catatan pembelajaran siswa</p>
            </div>
            <button
              onClick={() => { setFormData({ note_date: new Date().toISOString().split("T")[0] }); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold rounded-xl transition-all shadow-lg shadow-[#C9A227]/25"
            >
              <Plus className="h-4 w-4" /> Tambah Catatan
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari catatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Murid</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Topik</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Kelas</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Rating</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((n, i) => (
                <tr key={n.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4 text-[#5B6472]"><ClientDate date={n.note_date} format="date" /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{n.student?.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5B6472]">{n.topic || "N/A"}</td>
                  <td className="p-4 text-[#5B6472]">{n.class?.course?.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= (n.rating || 0) ? "fill-[#C9A227] text-[#C9A227]" : "text-[#D9DDE5]"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedNote(n); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => { setFormData(n); setShowForm(true); }} className="p-2 rounded-lg hover:bg-blue-50 text-[#8A93A3] hover:text-blue-600 transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(n.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {notes.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center"><div className="flex flex-col items-center gap-3"><div className="h-12 w-12 rounded-2xl bg-[#F5F2EB] flex items-center justify-center"><BookOpen className="h-6 w-6 text-[#8A93A3]" /></div><p className="text-[#8A93A3] font-medium">Belum ada catatan</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Catatan">
        {selectedNote && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <BookOpen className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedNote.topic || "Untitled"}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedNote.student?.full_name} - {selectedNote.class?.course?.name}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal</p>
                  <p className="font-semibold text-[#0B1526]"><ClientDate date={selectedNote.note_date} format="date" /></p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Rating</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= (selectedNote.rating || 0) ? "fill-[#C9A227] text-[#C9A227]" : "text-[#D9DDE5]"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-[#8A93A3] font-medium mb-1">Isi Catatan</p>
                <p className="font-medium text-[#0B1526] whitespace-pre-wrap">{selectedNote.content}</p>
              </div>
              {selectedNote.homework && (
                <div className="mt-4">
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">PR</p>
                  <p className="font-medium text-[#0B1526] whitespace-pre-wrap">{selectedNote.homework}</p>
                </div>
              )}
              {selectedNote.teacher_feedback && (
                <div className="mt-4">
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Feedback</p>
                  <p className="font-medium text-[#0B1526] whitespace-pre-wrap">{selectedNote.teacher_feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Form Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Catatan" : "Tambah Catatan"} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Student</label>
              <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className={selectClass}>
                <option value="">Pilih Siswa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Class</label>
              <select value={formData.class_id || ""} onChange={(e) => setFormData({ ...formData, class_id: e.target.value })} className={selectClass}>
                <option value="">Pilih Kelas</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.class_code} - {c.course?.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Topik</label>
              <Input value={formData.topic || ""} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Tanggal</label>
              <Input type="date" value={formData.note_date || ""} onChange={(e) => setFormData({ ...formData, note_date: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Isi Catatan *</label>
            <textarea value={formData.content || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 resize-none" rows={4} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">PR</label>
            <textarea value={formData.homework || ""} onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 resize-none" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Feedback</label>
            <textarea value={formData.teacher_feedback || ""} onChange={(e) => setFormData({ ...formData, teacher_feedback: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 resize-none" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Rating (1-5)</label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setFormData({ ...formData, rating: s })}>
                  <Star className={`h-6 w-6 ${s <= (formData.rating || 0) ? "fill-[#C9A227] text-[#C9A227]" : "text-[#D9DDE5]"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-[#0B1526]/10 text-[#5B6472] hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={handleSave} className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/25">Simpan</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
