"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Eye, CheckCircle, XCircle, Plane, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);

  const selectClass = "w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30";

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("/leaves", { params: { per_page: 50 } });
      setLeaves(response.data.data);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    axios.get("/students").then(r => setStudents(r.data.data));
  }, []);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/leaves/${formData.id}`, formData);
      } else {
        await axios.post("/leaves", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchLeaves();
    } catch (error) {
      console.error("Failed to save leave:", error);
    }
  };

  const handleApprove = async (id: number) => {
    await axios.put(`/leaves/${id}/approve`, {});
    fetchLeaves();
  };

  const handleReject = async (id: number) => {
    const notes = prompt("Alasan penolakan:");
    if (notes) {
      await axios.put(`/leaves/${id}/reject`, { notes });
      fetchLeaves();
    }
  };

  const pendingCount = leaves.filter(l => l.status === "PENDING").length;
  const approvedCount = leaves.filter(l => l.status === "APPROVED").length;
  const rejectedCount = leaves.filter(l => l.status === "REJECTED").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data cuti...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Pengajuan Cuti / Libur</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Leave Request</h1>
              <p className="text-white/60 text-lg">Kelola pengajuan cuti siswa</p>
            </div>
            <button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold rounded-xl transition-all shadow-lg shadow-[#C9A227]/25"
            >
              <Plus className="h-4 w-4" /> Ajukan Cuti
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Pending", value: pendingCount, icon: Clock, color: "bg-amber-500" },
            { label: "Disetujui", value: approvedCount, icon: CheckCircle, color: "bg-emerald-500" },
            { label: "Ditolak", value: rejectedCount, icon: XCircle, color: "bg-red-500" },
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

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari pengajuan cuti..."
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
                <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal Mulai</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal Selesai</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Alasan</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l, i) => (
                <tr key={l.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{l.student?.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5B6472]">{l.start_date}</td>
                  <td className="p-4 text-[#5B6472]">{l.end_date}</td>
                  <td className="p-4 text-[#5B6472] max-w-xs truncate">{l.reason}</td>
                  <td className="p-4">
                    <Badge className={`${getStatusColor(l.status)} font-medium`}>{l.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedLeave(l); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors"><Eye className="h-4 w-4" /></button>
                      {l.status === "PENDING" && (
                        <>
                          <button onClick={() => handleApprove(l.id)} className="p-2 rounded-lg hover:bg-emerald-50 text-[#8A93A3] hover:text-emerald-600 transition-colors"><CheckCircle className="h-4 w-4" /></button>
                          <button onClick={() => handleReject(l.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-600 transition-colors"><XCircle className="h-4 w-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Cuti">
        {selectedLeave && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <Plane className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedLeave.student?.full_name}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedLeave.student?.student_code}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal Mulai</p>
                  <p className="font-semibold text-[#0B1526]">{selectedLeave.start_date}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal Selesai</p>
                  <p className="font-semibold text-[#0B1526]">{selectedLeave.end_date}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedLeave.status)} font-medium`}>{selectedLeave.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Diajukan</p>
                  <p className="font-semibold text-[#0B1526]"><ClientDate date={selectedLeave.requested_at} /></p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-[#8A93A3] font-medium mb-1">Alasan</p>
                <p className="font-semibold text-[#0B1526]">{selectedLeave.reason}</p>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Form Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Ajukan Cuti" size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Siswa</label>
              <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className={selectClass}>
                <option value="">Pilih Siswa</option>
                {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Alasan</label>
              <Input value={formData.reason || ""} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Alasan pengajuan cuti" className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Tanggal Mulai</label>
              <Input type="date" value={formData.start_date || ""} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Tanggal Selesai</label>
              <Input type="date" value={formData.end_date || ""} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Catatan</label>
            <Input value={formData.notes || ""} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Catatan tambahan (opsional)" className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-[#0B1526]/10 text-[#5B6472] hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={handleSave} className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/25">Kirim Pengajuan</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
