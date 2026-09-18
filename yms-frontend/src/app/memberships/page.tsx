"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Star, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatDate } from "@/lib/utils";

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);

  const fetchMemberships = async () => {
    try {
      const response = await axios.get("/memberships", { params: { search, per_page: 50 } });
      setMemberships(response.data.data);
    } catch (error) {
      console.error("Failed to fetch memberships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
    axios.get("/students").then(r => setStudents(r.data.data));
  }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/memberships/${formData.id}`, formData);
      } else {
        await axios.post("/memberships", { ...formData, membership_number: `MBR-${Date.now()}` });
      }
      setShowForm(false);
      setFormData({});
      fetchMemberships();
    } catch (error) {
      console.error("Failed to save membership:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat membership...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Membership</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Membership Siswa</h1>
              <p className="text-white/60 text-lg">Kelola data membership siswa</p>
            </div>
            <Button onClick={() => { setFormData({}); setShowForm(true); }} className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-[#0B1526] font-semibold rounded-xl shadow-lg shadow-[#C9A227]/20">
              <Plus className="h-4 w-4 mr-2" /> Tambah Membership
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input placeholder="Cari membership..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Membership #</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tipe</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Mulai</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Selesai</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m, i) => (
                <tr key={m.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4 font-mono text-xs text-[#0B1526]">{m.membership_number}</td>
                  <td className="p-4 font-semibold text-[#0B1526]">{m.student?.full_name}</td>
                  <td className="p-4 text-[#5B6472]">{m.membership_type}</td>
                  <td className="p-4 text-[#5B6472]">{formatDate(m.start_date)}</td>
                  <td className="p-4 text-[#5B6472]">{formatDate(m.end_date)}</td>
                  <td className="p-4"><Badge className={`${getStatusColor(m.status)} font-medium`}>{m.status}</Badge></td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setSelectedMembership(m); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => { setFormData(m); setShowForm(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => axios.delete(`/memberships/${m.id}`).then(() => fetchMemberships())} className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Membership">
        {selectedMembership && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <Star className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526] font-mono">{selectedMembership.membership_number}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedMembership.student?.full_name}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Tipe</p>
                  <p className="font-semibold text-[#0B1526]">{selectedMembership.membership_type}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedMembership.status)} font-medium`}>{selectedMembership.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Mulai</p>
                  <p className="font-semibold text-[#0B1526]">{formatDate(selectedMembership.start_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Selesai</p>
                  <p className="font-semibold text-[#0B1526]">{formatDate(selectedMembership.end_date)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Membership" : "Tambah Membership"} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#0B1526]">Siswa</label>
            <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30">
              <option value="">Pilih Siswa</option>
              {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0B1526]">Tipe Membership</label>
              <select value={formData.membership_type || "BASIC"} onChange={(e) => setFormData({ ...formData, membership_type: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30">
                <option value="BASIC">BASIC</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0B1526]">Status</label>
              <select value={formData.status || "ACTIVE"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30">
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0B1526]">Tanggal Mulai</label>
              <Input type="date" value={formData.start_date || ""} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0B1526]">Tanggal Selesai</label>
              <Input type="date" value={formData.end_date || ""} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl border-[#0B1526]/10 hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={handleSave} className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-[#0B1526] font-semibold rounded-xl">Simpan</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
