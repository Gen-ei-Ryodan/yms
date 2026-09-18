"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import {
  Loader2, Plus, Search, Edit, Trash2, Eye, ArrowUp, TrendingUp, Layers, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LevelsPage() {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchLevels = async () => {
    try {
      const response = await axios.get("/levels", { params: { search } });
      setLevels(response.data.data);
    } catch (error) {
      console.error("Failed to fetch levels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLevels(); }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/levels/${formData.id}`, formData);
      } else {
        await axios.post("/levels", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchLevels();
    } catch (error) {
      console.error("Failed to save level:", error);
    }
  };

  const totalLevels = levels.length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]"></div>
              <Layers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data level...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Manajemen Level</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Level Management</h1>
              <p className="text-white/60 text-lg">Kelola level pembelajaran musik</p>
            </div>
            <Button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Tambah Level
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <StatCard title="Total Level" value={totalLevels} icon={Layers} color="blue" />
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari berdasarkan nama atau kode level..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#0B1526]/5">
            <h2 className="text-lg font-bold text-[#0B1526]">Daftar Level</h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">{levels.length} level terdaftar</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0B1526]/5">
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Urutan</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Kode</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Nama Level</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Deskripsi</th>
                  <th className="text-right p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((level, index) => (
                  <tr key={level.id} className="border-b border-[#0B1526]/5 hover:bg-[#F5F2EB]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-sm">
                          <span className="text-xs font-bold text-[#C9A227]">{level.sequence || index + 1}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 bg-[#0B1526]/5 text-[#0B1526] rounded-lg font-mono text-xs font-semibold">
                        {level.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#8F6F14] flex items-center justify-center shadow-sm">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <p className="font-semibold text-[#0B1526]">{level.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-[#5B6472] max-w-xs truncate">{level.description || "N/A"}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#0B1526] hover:bg-[#0B1526]/5"
                          onClick={() => { setSelectedLevel(level); setShowPanel(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
                          onClick={() => { setFormData(level); setShowForm(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C2542E] hover:bg-[#C2542E]/10"
                          onClick={() => axios.delete(`/levels/${level.id}`).then(() => fetchLevels())}
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
                Menampilkan <span className="font-semibold text-[#0B1526]">{levels.length}</span> dari <span className="font-semibold text-[#0B1526]">{levels.length}</span> level
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
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Level">
        {selectedLevel && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 bg-[#F5F2EB]/50 rounded-xl">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#8F6F14] flex items-center justify-center shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedLevel.name}</h3>
                <p className="text-[#5B6472] font-mono">{selectedLevel.code}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Urutan</p>
                <p className="font-semibold text-[#0B1526]">{selectedLevel.sequence}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Kode</p>
                <p className="font-semibold text-[#0B1526] font-mono">{selectedLevel.code}</p>
              </div>
            </div>

            {selectedLevel.description && (
              <div className="p-4 bg-[#F5F2EB]/50 rounded-xl">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-2">Deskripsi</p>
                <p className="text-sm text-[#0B1526] leading-relaxed">{selectedLevel.description}</p>
              </div>
            )}
          </div>
        )}
      </SlidePanel>

      {/* Form Slide Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Level" : "Tambah Level"} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Kode Level</label>
              <Input
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Nama Level</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Urutan</label>
              <Input
                type="number"
                value={formData.sequence || ""}
                onChange={(e) => setFormData({ ...formData, sequence: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Deskripsi</label>
              <Input
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
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
              {formData.id ? "Simpan Perubahan" : "Tambah Level"}
            </Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
