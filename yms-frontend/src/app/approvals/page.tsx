"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, CheckCircle, XCircle, Plane, ArrowLeftRight, Gift, AlertCircle } from "lucide-react";
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
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approval</h1>
          <p className="text-sm text-gray-500 mt-1">Manage pending approvals</p>
        </div>

        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2"><AlertCircle className="h-4 w-4 text-orange-500" /><p className="text-sm text-gray-500">Total Pending</p></div>
              <p className="text-2xl font-bold text-orange-600">{summary.total}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2"><Plane className="h-4 w-4 text-blue-500" /><p className="text-sm text-gray-500">Cuti / Libur</p></div>
              <p className="text-2xl font-bold text-blue-600">{summary.leaves}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2"><ArrowLeftRight className="h-4 w-4 text-purple-500" /><p className="text-sm text-gray-500">Pindah Kelas</p></div>
              <p className="text-2xl font-bold text-purple-600">{summary.transfers}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2"><Gift className="h-4 w-4 text-green-500" /><p className="text-sm text-gray-500">Redeem Reward</p></div>
              <p className="text-2xl font-bold text-green-600">{summary.redemptions}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 border-b border-gray-200">
          {["all", "leaves", "transfers", "redemptions"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize ${tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t === "all" ? "Semua" : t === "leaves" ? "Cuti/Libur" : t === "transfers" ? "Pindah Kelas" : "Redeem"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Tipe</th>
                <th className="text-left p-3 font-medium">Siswa</th>
                <th className="text-left p-3 font-medium">Detail</th>
                <th className="text-left p-3 font-medium">Alasan</th>
                <th className="text-left p-3 font-medium">Tanggal</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={`${a.type}-${a.id}-${i}`} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3">
                    <Badge className={a.type === "LEAVE" ? "bg-blue-100 text-blue-800" : a.type === "TRANSFER" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}>
                      {a.type}
                    </Badge>
                  </td>
                  <td className="p-3 font-medium">{a.student}</td>
                  <td className="p-3 text-gray-500">{a.detail}</td>
                  <td className="p-3 text-gray-500 max-w-xs truncate">{a.reason || "N/A"}</td>
                  <td className="p-3"><ClientDate date={a.requested_at} format="date" /></td>
                  <td className="p-3 text-right">
                    {a.type === "LEAVE" && <Button variant="ghost" size="icon" className="text-green-600" onClick={() => approveLeave(a.id)}><CheckCircle className="h-4 w-4" /></Button>}
                    {a.type === "TRANSFER" && <Button variant="ghost" size="icon" className="text-green-600" onClick={() => approveTransfer(a.id)}><CheckCircle className="h-4 w-4" /></Button>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Tidak ada pengajuan pending</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
