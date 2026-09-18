"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import {
  Loader2, Plus, Search, Edit, Trash2, Eye, Gift, Star, TrendingUp, Award, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatCurrency } from "@/lib/utils";

export default function RewardsPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchRewards = async () => {
    try {
      const response = await axios.get("/rewards", { params: { search, per_page: 50 } });
      setRewards(response.data.data);
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRewards(); }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/rewards/${formData.id}`, formData);
      } else {
        await axios.post("/rewards", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchRewards();
    } catch (error) {
      console.error("Failed to save reward:", error);
    }
  };

  const totalRewards = rewards.length;
  const activeRewards = rewards.filter(r => r.status === "ACTIVE").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]"></div>
              <Gift className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data reward...</p>
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
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Manajemen Reward</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Reward Management</h1>
              <p className="text-white/60 text-lg">Kelola katalog reward dan poin loyalitas siswa</p>
            </div>
            <Button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Tambah Reward
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Total Reward" value={totalRewards} icon={Gift} color="yellow" />
          <StatCard title="Reward Aktif" value={activeRewards} icon={Star} color="green" />
        </div>

        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari berdasarkan nama atau kode reward..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="h-36 bg-gradient-to-br from-[#C9A227] via-[#D4AF37] to-[#E8A020] flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                <div className="absolute bottom-2 left-2 w-12 h-12 bg-white/10 rounded-full blur-lg" />
                <Gift className="h-14 w-14 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#0B1526] text-lg">{r.name}</h3>
                <p className="text-sm text-[#8A93A3] font-mono mt-0.5">{r.code}</p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#C9A227]/10 text-[#C9A227] rounded-full text-xs font-bold">
                    <Star className="h-3 w-3" />
                    {r.points_required} pts
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    r.status === "ACTIVE"
                      ? "bg-[#2E7D5B]/10 text-[#2E7D5B]"
                      : "bg-[#C2542E]/10 text-[#C2542E]"
                  }`}>
                    {r.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <Package className="h-3.5 w-3.5 text-[#8A93A3]" />
                  <p className="text-xs text-[#5B6472] font-medium">Stok: <span className="text-[#0B1526]">{r.stock}</span></p>
                </div>
                <div className="flex gap-1.5 mt-4 pt-4 border-t border-[#0B1526]/5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#5B6472] hover:text-[#0B1526] hover:bg-[#0B1526]/5"
                    onClick={() => { setSelectedReward(r); setShowPanel(true); }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#5B6472] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
                    onClick={() => { setFormData(r); setShowForm(true); }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-[#5B6472] hover:text-[#C2542E] hover:bg-[#C2542E]/10"
                    onClick={() => axios.delete(`/rewards/${r.id}`).then(() => fetchRewards())}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Reward">
        {selectedReward && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-[#F5F2EB]/50 rounded-xl">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#C9A227] to-[#D4AF37] flex items-center justify-center shadow-lg">
                <Gift className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedReward.name}</h3>
                <p className="text-[#5B6472] font-mono text-sm">{selectedReward.code}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-[#8A93A3]" />
                  <p className="text-xs text-[#8A93A3] uppercase font-semibold">Poin Dibutuhkan</p>
                </div>
                <p className="font-semibold text-[#0B1526]">{selectedReward.points_required}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-[#8A93A3]" />
                  <p className="text-xs text-[#8A93A3] uppercase font-semibold">Stok</p>
                </div>
                <p className="font-semibold text-[#0B1526]">{selectedReward.stock}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-[#8A93A3]" />
                  <p className="text-xs text-[#8A93A3] uppercase font-semibold">Status</p>
                </div>
                <p className="font-semibold text-[#0B1526]">{selectedReward.status}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-[#8A93A3]" />
                  <p className="text-xs text-[#8A93A3] uppercase font-semibold">Deskripsi</p>
                </div>
                <p className="font-semibold text-[#0B1526]">{selectedReward.description || "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Reward" : "Tambah Reward"} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Kode Reward</label>
              <Input
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Nama Reward</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Poin Dibutuhkan</label>
              <Input
                type="number"
                value={formData.points_required || ""}
                onChange={(e) => setFormData({ ...formData, points_required: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Stok</label>
              <Input
                type="number"
                value={formData.stock || ""}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Status</label>
            <select
              value={formData.status || "ACTIVE"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm text-[#0B1526] focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
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
              {formData.id ? "Simpan Perubahan" : "Tambah Reward"}
            </Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
