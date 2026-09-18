"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import {
  Loader2, Plus, Search, Edit, Trash2, Eye, Users, UserCheck, Phone, Mail, Home, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGuardian, setSelectedGuardian] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchGuardians = async () => {
    try {
      const response = await axios.get("/guardians", { params: { search, per_page: 50 } });
      setGuardians(response.data.data);
    } catch (error) {
      console.error("Failed to fetch guardians:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuardians(); }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/guardians/${formData.id}`, formData);
      } else {
        await axios.post("/guardians", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchGuardians();
    } catch (error) {
      console.error("Failed to save guardian:", error);
    }
  };

  const totalGuardians = guardians.length;
  const primaryGuardians = guardians.filter(g => g.is_primary).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]"></div>
              <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data wali...</p>
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
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Manajemen Wali</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Guardian Management</h1>
              <p className="text-white/60 text-lg">Kelola data orang tua dan wali siswa</p>
            </div>
            <Button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Tambah Wali
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Total Wali" value={totalGuardians} icon={Users} color="blue" />
          <StatCard title="Wali Utama" value={primaryGuardians} icon={UserCheck} color="green" />
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari berdasarkan nama, telepon, atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#0B1526]/5">
            <h2 className="text-lg font-bold text-[#0B1526]">Daftar Wali</h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">{guardians.length} wali terdaftar</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0B1526]/5">
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Nama</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Hubungan</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Telepon</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Status</th>
                  <th className="text-right p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {guardians.map((guardian) => (
                  <tr key={guardian.id} className="border-b border-[#0B1526]/5 hover:bg-[#F5F2EB]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-[#C9A227]">
                            {guardian.name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0B1526]">{guardian.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#5B6472]">{guardian.relationship}</td>
                    <td className="p-4 text-[#5B6472]">{guardian.phone}</td>
                    <td className="p-4">
                      {guardian.is_primary ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2E7D5B]/10 text-[#2E7D5B] rounded-full text-xs font-semibold">
                          <UserCheck className="h-3 w-3" />
                          Utama
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0B1526]/5 text-[#5B6472] rounded-full text-xs font-semibold">
                          Sekunder
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#0B1526] hover:bg-[#0B1526]/5"
                          onClick={() => { setSelectedGuardian(guardian); setShowPanel(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
                          onClick={() => { setFormData(guardian); setShowForm(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C2542E] hover:bg-[#C2542E]/10"
                          onClick={() => axios.delete(`/guardians/${guardian.id}`).then(() => fetchGuardians())}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[#0B1526]/5 bg-[#F5F2EB]/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#5B6472]">
                Menampilkan <span className="font-semibold text-[#0B1526]">{guardians.length}</span> dari <span className="font-semibold text-[#0B1526]">{guardians.length}</span> wali
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 border-[#0B1526]/10" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 border-[#0B1526]/10 bg-[#0B1526] text-white hover:bg-[#14233B]">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-9 border-[#0B1526]/10" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Slide Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Wali">
        {selectedGuardian && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 bg-[#F5F2EB]/50 rounded-xl">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#C9A227]">
                  {selectedGuardian.name?.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedGuardian.name}</h3>
                <p className="text-[#5B6472]">{selectedGuardian.relationship}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-[#8A93A3]" />
                  <p className="text-xs text-[#8A93A3] uppercase font-semibold">Telepon</p>
                </div>
                <p className="font-semibold text-[#0B1526]">{selectedGuardian.phone || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-[#8A93A3]" />
                  <p className="text-xs text-[#8A93A3] uppercase font-semibold">Email</p>
                </div>
                <p className="font-semibold text-[#0B1526]">{selectedGuardian.email || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="h-4 w-4 text-[#8A93A3]" />
                  <p className="text-xs text-[#8A93A3] uppercase font-semibold">Status</p>
                </div>
                <p className="font-semibold text-[#0B1526]">{selectedGuardian.is_primary ? "Wali Utama" : "Wali Sekunder"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="h-4 w-4 text-[#8A93A3]" />
                  <p className="text-xs text-[#8A93A3] uppercase font-semibold">Alamat</p>
                </div>
                <p className="font-semibold text-[#0B1526]">{selectedGuardian.address || "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Form Slide Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Wali" : "Tambah Wali"} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Nama Lengkap</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Hubungan</label>
              <select
                value={formData.relationship || "Father"}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
              >
                <option value="Father">Ayah</option>
                <option value="Mother">Ibu</option>
                <option value="Guardian">Wali</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Telepon</label>
              <Input
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Email</label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Alamat</label>
            <Input
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="h-11 border-[#0B1526]/10 hover:bg-[#F5F2EB]"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="h-11 bg-[#0B1526] hover:bg-[#14233B] text-white shadow-lg shadow-[#0B1526]/20"
            >
              {formData.id ? "Simpan Perubahan" : "Tambah Wali"}
            </Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
