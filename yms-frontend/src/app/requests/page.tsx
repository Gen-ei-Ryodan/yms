"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Eye, CheckCircle, XCircle, RefreshCw, Calendar, ArrowLeftRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function RequestsPage() {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("transfers");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [transferData, setTransferData] = useState<Record<string, any>>({});
  const [leaveData, setLeaveData] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const studentId = user?.student?.id;
      if (studentId) {
        const [tRes, lRes, classesRes, enrollRes] = await Promise.all([
          axios.get("/transfers", { params: { student_id: studentId, per_page: 50 } }),
          axios.get("/leaves", { params: { student_id: studentId, per_page: 50 } }),
          axios.get("/classes", { params: { per_page: 50 } }),
          axios.get("/enrollments", { params: { student_id: studentId, status: "ACTIVE", per_page: 1 } }),
        ]);
        setTransfers(tRes.data.data);
        setLeaves(lRes.data.data);
        setClasses(classesRes.data.data);
        setEnrollment(enrollRes.data.data[0] || null);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleCancelTransfer = async (id: number) => {
    await axios.put(`/transfers/${id}/cancel`, {});
    fetchData();
  };

  const handleCancelLeave = async (id: number) => {
    await axios.put(`/leaves/${id}/cancel`, {});
    fetchData();
  };

  const handleTransferSubmit = async () => {
    try {
      await axios.post("/transfers", {
        student_id: user?.student?.id,
        from_class_id: enrollment?.class_id,
        to_class_id: transferData.to_class_id,
        reason: transferData.reason,
        notes: transferData.notes,
      });
      setShowTransferForm(false);
      setTransferData({});
      fetchData();
    } catch (error) {
      console.error("Failed to submit transfer:", error);
    }
  };

  const handleLeaveSubmit = async () => {
    try {
      await axios.post("/leaves", {
        student_id: user?.student?.id,
        start_date: leaveData.start_date,
        end_date: leaveData.end_date,
        reason: leaveData.reason,
        notes: leaveData.notes,
      });
      setShowLeaveForm(false);
      setLeaveData({});
      fetchData();
    } catch (error) {
      console.error("Failed to submit leave:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat pengajuan...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Pengajuan</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Pengajuan Saya</h1>
              <p className="text-white/60 text-lg">Kelola pengajuan pindah kelas dan cuti</p>
            </div>
            <Button onClick={() => tab === "transfers" ? setShowTransferForm(true) : setShowLeaveForm(true)} className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-[#0B1526] font-semibold rounded-xl shadow-lg shadow-[#C9A227]/20">
              <Plus className="h-4 w-4 mr-2" /> Ajukan Baru
            </Button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-1.5 shadow-sm flex gap-1">
          <button onClick={() => setTab("transfers")}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${tab === "transfers" ? "bg-[#0B1526] text-white shadow-lg shadow-[#0B1526]/20" : "text-[#5B6472] hover:text-[#0B1526] hover:bg-[#F5F2EB]"}`}>
            <ArrowLeftRight className="h-4 w-4" />
            Pindah Kelas ({transfers.filter(t => t.status === "PENDING").length})
          </button>
          <button onClick={() => setTab("leaves")}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${tab === "leaves" ? "bg-[#0B1526] text-white shadow-lg shadow-[#0B1526]/20" : "text-[#5B6472] hover:text-[#0B1526] hover:bg-[#F5F2EB]"}`}>
            <Plane className="h-4 w-4" />
            Cuti ({leaves.filter(l => l.status === "PENDING").length})
          </button>
        </div>

        {tab === "transfers" && (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F2EB]">
                <tr>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Dari</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Ke</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Alasan</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal</th>
                  <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t, i) => (
                  <tr key={t.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                    <td className="p-4 font-semibold text-[#0B1526]">{t.fromClass?.course?.name} - {t.fromClass?.level?.name}</td>
                    <td className="p-4 text-[#5B6472]">{t.toClass?.course?.name} - {t.toClass?.level?.name}</td>
                    <td className="p-4 text-[#5B6472] max-w-xs truncate">{t.reason}</td>
                    <td className="p-4"><Badge className={`${getStatusColor(t.status)} font-medium`}>{t.status}</Badge></td>
                    <td className="p-4 text-[#5B6472]"><ClientDate date={t.requested_at} format="date" /></td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setSelectedItem(t); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      {t.status === "PENDING" && (
                        <button onClick={() => handleCancelTransfer(t.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-500 transition-colors">
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {transfers.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-[#5B6472]">Belum ada pengajuan pindah kelas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "leaves" && (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F2EB]">
                <tr>
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
                    <td className="p-4 text-[#5B6472]">{l.start_date}</td>
                    <td className="p-4 text-[#5B6472]">{l.end_date}</td>
                    <td className="p-4 text-[#5B6472] max-w-xs truncate">{l.reason}</td>
                    <td className="p-4"><Badge className={`${getStatusColor(l.status)} font-medium`}>{l.status}</Badge></td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setSelectedItem(l); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      {l.status === "PENDING" && (
                        <button onClick={() => handleCancelLeave(l.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-500 transition-colors">
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-[#5B6472]">Belum ada pengajuan cuti</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Pengajuan">
        {selectedItem && (
          <div className="space-y-6">
            {tab === "transfers" ? (
              <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium mb-1">Dari Kelas</p>
                    <p className="font-semibold text-[#0B1526]">{selectedItem.fromClass?.course?.name} - {selectedItem.fromClass?.level?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium mb-1">Ke Kelas</p>
                    <p className="font-semibold text-[#0B1526]">{selectedItem.toClass?.course?.name} - {selectedItem.toClass?.level?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                    <Badge className={`${getStatusColor(selectedItem.status)} font-medium`}>{selectedItem.status}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal</p>
                    <p className="font-semibold text-[#0B1526]"><ClientDate date={selectedItem.requested_at} /></p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Alasan</p>
                  <p className="font-semibold text-[#0B1526]">{selectedItem.reason}</p>
                </div>
              </div>
            ) : (
              <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal Mulai</p>
                    <p className="font-semibold text-[#0B1526]">{selectedItem.start_date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal Selesai</p>
                    <p className="font-semibold text-[#0B1526]">{selectedItem.end_date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                    <Badge className={`${getStatusColor(selectedItem.status)} font-medium`}>{selectedItem.status}</Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Alasan</p>
                  <p className="font-semibold text-[#0B1526]">{selectedItem.reason}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showTransferForm} onClose={() => setShowTransferForm(false)} title="Pengajuan Pindah Kelas" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Kelas Saat Ini</label>
            <p className="text-sm text-[#5B6472] bg-[#F5F2EB] rounded-xl px-4 py-2.5">{enrollment?.class?.course?.name} - {enrollment?.class?.level?.name} ({enrollment?.class?.class_code})</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Pindah Ke Kelas</label>
            <select value={transferData.to_class_id || ""} onChange={(e) => setTransferData({ ...transferData, to_class_id: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30">
              <option value="">Pilih Kelas</option>
              {classes.filter((c: any) => c.id !== enrollment?.class_id).map((c: any) => (
                <option key={c.id} value={c.id}>{c.class_code} - {c.course?.name} - {c.level?.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Alasan *</label>
            <textarea value={transferData.reason || ""} onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30" rows={3} placeholder="Jelaskan alasan pindah kelas..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Catatan Tambahan</label>
            <textarea value={transferData.notes || ""} onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30" rows={2} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowTransferForm(false)} className="rounded-xl border-[#0B1526]/10 hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={handleTransferSubmit} className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-[#0B1526] font-semibold rounded-xl">Kirim Pengajuan</Button>
          </div>
        </div>
      </SlidePanel>

      <SlidePanel open={showLeaveForm} onClose={() => setShowLeaveForm(false)} title="Pengajuan Cuti" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Tanggal Mulai *</label>
              <Input type="date" value={leaveData.start_date || ""} onChange={(e) => setLeaveData({ ...leaveData, start_date: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Tanggal Selesai *</label>
              <Input type="date" value={leaveData.end_date || ""} onChange={(e) => setLeaveData({ ...leaveData, end_date: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Alasan *</label>
            <textarea value={leaveData.reason || ""} onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30" rows={3} placeholder="Jelaskan alasan cuti..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Catatan Tambahan</label>
            <textarea value={leaveData.notes || ""} onChange={(e) => setLeaveData({ ...leaveData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30" rows={2} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowLeaveForm(false)} className="rounded-xl border-[#0B1526]/10 hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={handleLeaveSubmit} className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-[#0B1526] font-semibold rounded-xl">Kirim Pengajuan</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
