"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Eye, CheckCircle, XCircle, RefreshCw, Calendar } from "lucide-react";
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
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your requests</p>
          </div>
          <Button onClick={() => tab === "transfers" ? setShowTransferForm(true) : setShowLeaveForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Request
          </Button>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          <button onClick={() => setTab("transfers")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === "transfers" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            Class Transfer ({transfers.filter(t => t.status === "PENDING").length})
          </button>
          <button onClick={() => setTab("leaves")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === "leaves" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            Leave / Cuti ({leaves.filter(l => l.status === "PENDING").length})
          </button>
        </div>

        {tab === "transfers" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium">Dari</th>
                  <th className="text-left p-3 font-medium">Ke</th>
                  <th className="text-left p-3 font-medium">Alasan</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Tanggal</th>
                  <th className="text-right p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t) => (
                  <tr key={t.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-medium">{t.fromClass?.course?.name} - {t.fromClass?.level?.name}</td>
                    <td className="p-3 text-gray-500">{t.toClass?.course?.name} - {t.toClass?.level?.name}</td>
                    <td className="p-3 text-gray-500 max-w-xs truncate">{t.reason}</td>
                    <td className="p-3"><Badge className={getStatusColor(t.status)}>{t.status}</Badge></td>
                    <td className="p-3"><ClientDate date={t.requested_at} format="date" /></td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(t); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                      {t.status === "PENDING" && (
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleCancelTransfer(t.id)}><XCircle className="h-4 w-4" /></Button>
                      )}
                    </td>
                  </tr>
                ))}
                {transfers.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada pengajuan pindah kelas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "leaves" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium">Tanggal Mulai</th>
                  <th className="text-left p-3 font-medium">Tanggal Selesai</th>
                  <th className="text-left p-3 font-medium">Alasan</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{l.start_date}</td>
                    <td className="p-3">{l.end_date}</td>
                    <td className="p-3 text-gray-500 max-w-xs truncate">{l.reason}</td>
                    <td className="p-3"><Badge className={getStatusColor(l.status)}>{l.status}</Badge></td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(l); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                      {l.status === "PENDING" && (
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleCancelLeave(l.id)}><XCircle className="h-4 w-4" /></Button>
                      )}
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada pengajuan cuti</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Request">
        {selectedItem && (
          <div className="space-y-4">
            {tab === "transfers" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Dari Kelas</p><p className="font-medium">{selectedItem.fromClass?.course?.name} - {selectedItem.fromClass?.level?.name}</p></div>
                  <div><p className="text-xs text-gray-500">Ke Kelas</p><p className="font-medium">{selectedItem.toClass?.course?.name} - {selectedItem.toClass?.level?.name}</p></div>
                  <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedItem.status}</p></div>
                  <div><p className="text-xs text-gray-500">Tanggal</p><p className="font-medium"><ClientDate date={selectedItem.requested_at} /></p></div>
                </div>
                <div><p className="text-xs text-gray-500">Alasan</p><p className="font-medium">{selectedItem.reason}</p></div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Tanggal Mulai</p><p className="font-medium">{selectedItem.start_date}</p></div>
                  <div><p className="text-xs text-gray-500">Tanggal Selesai</p><p className="font-medium">{selectedItem.end_date}</p></div>
                  <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedItem.status}</p></div>
                </div>
                <div><p className="text-xs text-gray-500">Alasan</p><p className="font-medium">{selectedItem.reason}</p></div>
              </>
            )}
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showTransferForm} onClose={() => setShowTransferForm(false)} title="Pengajuan Pindah Kelas" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kelas Saat Ini</label>
            <p className="text-sm text-gray-700">{enrollment?.class?.course?.name} - {enrollment?.class?.level?.name} ({enrollment?.class?.class_code})</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pindah Ke Kelas</label>
            <select value={transferData.to_class_id || ""} onChange={(e) => setTransferData({ ...transferData, to_class_id: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
              <option value="">Pilih Kelas</option>
              {classes.filter((c: any) => c.id !== enrollment?.class_id).map((c: any) => (
                <option key={c.id} value={c.id}>{c.class_code} - {c.course?.name} - {c.level?.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alasan *</label>
            <textarea value={transferData.reason || ""} onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={3} placeholder="Jelaskan alasan pindah kelas..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catatan Tambahan</label>
            <textarea value={transferData.notes || ""} onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={2} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowTransferForm(false)}>Batal</Button>
            <Button onClick={handleTransferSubmit}>Kirim Pengajuan</Button>
          </div>
        </div>
      </SlidePanel>

      <SlidePanel open={showLeaveForm} onClose={() => setShowLeaveForm(false)} title="Pengajuan Cuti" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Mulai *</label>
              <Input type="date" value={leaveData.start_date || ""} onChange={(e) => setLeaveData({ ...leaveData, start_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Selesai *</label>
              <Input type="date" value={leaveData.end_date || ""} onChange={(e) => setLeaveData({ ...leaveData, end_date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alasan *</label>
            <textarea value={leaveData.reason || ""} onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={3} placeholder="Jelaskan alasan cuti..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catatan Tambahan</label>
            <textarea value={leaveData.notes || ""} onChange={(e) => setLeaveData({ ...leaveData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={2} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowLeaveForm(false)}>Batal</Button>
            <Button onClick={handleLeaveSubmit}>Kirim Pengajuan</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
