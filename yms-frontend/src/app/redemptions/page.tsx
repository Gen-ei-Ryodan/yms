"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle, RotateCcw, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRedemption, setSelectedRedemption] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [rewards, setRewards] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const fetchRedemptions = async () => {
    try {
      const response = await axios.get("/redemptions", { params: { per_page: 50 } });
      setRedemptions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch redemptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
    Promise.all([
      axios.get("/rewards"),
      axios.get("/students"),
    ]).then(([r, s]) => {
      setRewards(r.data.data);
      setStudents(s.data.data);
    });
  }, []);

  const handleApprove = async (id: number) => {
    if (confirm("Approve this redemption?")) {
      await axios.put(`/redemptions/${id}/approve`, {});
      fetchRedemptions();
    }
  };

  const handleFulfill = async (id: number) => {
    await axios.put(`/redemptions/${id}/fulfill`, {});
    fetchRedemptions();
  };

  const handleReject = async (id: number) => {
    await axios.put(`/redemptions/${id}/reject`, {});
    fetchRedemptions();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat penukaran...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Penukaran Reward</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Penukaran Poin</h1>
              <p className="text-white/60 text-lg">Kelola penukaran reward oleh siswa</p>
            </div>
            <Button onClick={() => { setFormData({}); setShowForm(true); }} className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-[#0B1526] font-semibold rounded-xl shadow-lg shadow-[#C9A227]/20">
              <Plus className="h-4 w-4 mr-2" /> Redeem Reward
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input placeholder="Cari penukaran..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Redemption #</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Reward</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Poin</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {redemptions.map((r, i) => (
                <tr key={r.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4 font-mono text-xs text-[#0B1526]">{r.redemption_number}</td>
                  <td className="p-4 font-semibold text-[#0B1526]">{r.student?.full_name}</td>
                  <td className="p-4 text-[#5B6472]">{r.reward?.name}</td>
                  <td className="p-4 font-semibold text-[#C9A227]">{r.points_used}</td>
                  <td className="p-4"><Badge className={`${getStatusColor(r.status)} font-medium`}>{r.status}</Badge></td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setSelectedRedemption(r); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    {r.status === "PENDING" && (
                      <>
                        <button onClick={() => handleApprove(r.id)} className="p-2 rounded-lg hover:bg-emerald-50 text-[#8A93A3] hover:text-emerald-600 transition-colors">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleReject(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-600 transition-colors">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {r.status === "APPROVED" && (
                      <button onClick={() => handleFulfill(r.id)} className="p-2 rounded-lg hover:bg-blue-50 text-[#8A93A3] hover:text-blue-600 transition-colors">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Redemption">
        {selectedRedemption && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <Gift className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526] font-mono">{selectedRedemption.redemption_number}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedRedemption.student?.full_name}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Reward</p>
                  <p className="font-semibold text-[#0B1526]">{selectedRedemption.reward?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Poin Digunakan</p>
                  <p className="font-semibold text-[#C9A227]">{selectedRedemption.points_used}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedRedemption.status)} font-medium`}>{selectedRedemption.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal</p>
                  <p className="font-semibold text-[#0B1526]"><ClientDate date={selectedRedemption.redeemed_at} /></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Tukar Reward" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#0B1526]">Siswa</label>
            <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30">
              <option value="">Pilih Siswa</option>
              {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#0B1526]">Reward</label>
            <select value={formData.reward_id || ""} onChange={(e) => setFormData({ ...formData, reward_id: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30">
              <option value="">Pilih Reward</option>
              {rewards.map((r: any) => <option key={r.id} value={r.id}>{r.name} ({r.points_required} pts)</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl border-[#0B1526]/10 hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={async () => {
              try {
                await axios.post("/loyalty/redeem", formData);
                setShowForm(false);
                setFormData({});
                fetchRedemptions();
              } catch (error) {
                console.error("Failed to redeem:", error);
              }
            }} className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-[#0B1526] font-semibold rounded-xl">Tukar</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
