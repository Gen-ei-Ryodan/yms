"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, CheckCircle, Plane, ArrowLeftRight, Gift, AlertCircle, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientDate } from "@/components/ClientDate";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  const fetchData = async () => {
    try {
      const response = await axios.get("/approvals");
      setApprovals(response.data.data);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Failed to fetch approvals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const approveLeave = async (id: number) => {
    await axios.post("/approvals/approve-leaves", { ids: [id] });
    fetchData();
  };

  const approveTransfer = async (id: number) => {
    await axios.post("/approvals/approve-transfers", { ids: [id] });
    fetchData();
  };

  const filtered = tab === "all" ? approvals : approvals.filter((a) => {
    if (tab === "leaves") return a.type === "LEAVE";
    if (tab === "transfers") return a.type === "TRANSFER";
    if (tab === "redemptions") return a.type === "REDEMPTION";
    return true;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data approval...</p>
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
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Approval</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Approval Center</h1>
            <p className="text-white/60 text-lg">Kelola persetujuan pengajuan yang pending</p>
          </div>
        </div>

        {/* Stats */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Pending", value: summary.total, icon: Clock, color: "bg-amber-500" },
              { label: "Cuti / Libur", value: summary.leaves, icon: Plane, color: "bg-blue-500" },
              { label: "Pindah Kelas", value: summary.transfers, icon: ArrowLeftRight, color: "bg-purple-500" },
              { label: "Redeem Reward", value: summary.redemptions, icon: Gift, color: "bg-emerald-500" },
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
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-1.5 flex gap-2">
          {[
            { id: "all", label: "Semua" },
            { id: "leaves", label: "Cuti/Libur" },
            { id: "transfers", label: "Pindah Kelas" },
            { id: "redemptions", label: "Redeem" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                tab === t.id
                  ? "bg-[#0B1526] text-white shadow-lg"
                  : "text-[#5B6472] hover:text-[#0B1526] hover:bg-[#F5F2EB]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tipe</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Detail</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Alasan</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={`${a.type}-${a.id}-${i}`} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4">
                    <Badge className={`font-medium ${
                      a.type === "LEAVE" ? "bg-blue-100 text-blue-800"
                      : a.type === "TRANSFER" ? "bg-purple-100 text-purple-800"
                      : "bg-emerald-100 text-emerald-800"
                    }`}>{a.type}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{a.student}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5B6472]">{a.detail}</td>
                  <td className="p-4 text-[#5B6472] max-w-xs truncate">{a.reason || "N/A"}</td>
                  <td className="p-4 text-[#5B6472]"><ClientDate date={a.requested_at} format="date" /></td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {a.type === "LEAVE" && (
                        <button onClick={() => approveLeave(a.id)} className="p-2 rounded-lg hover:bg-emerald-50 text-[#8A93A3] hover:text-emerald-600 transition-colors"><CheckCircle className="h-4 w-4" /></button>
                      )}
                      {a.type === "TRANSFER" && (
                        <button onClick={() => approveTransfer(a.id)} className="p-2 rounded-lg hover:bg-emerald-50 text-[#8A93A3] hover:text-emerald-600 transition-colors"><CheckCircle className="h-4 w-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-[#F5F2EB] flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-[#8A93A3]" />
                      </div>
                      <p className="text-[#8A93A3] font-medium">Tidak ada pengajuan pending</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
