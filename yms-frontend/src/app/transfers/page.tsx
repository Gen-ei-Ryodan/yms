"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const fetchTransfers = async () => {
    try {
      const response = await axios.get("/transfers", { params: { per_page: 50 } });
      setTransfers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch transfers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
    Promise.all([
      axios.get("/students"),
      axios.get("/classes"),
    ]).then(([s, c]) => {
      setStudents(s.data.data);
      setClasses(c.data.data);
    });
  }, []);

  const handleApprove = async (id: number) => {
    if (confirm("Approve this transfer?")) {
      await axios.put(`/transfers/${id}/approve`, {});
      fetchTransfers();
    }
  };

  const handleReject = async (id: number) => {
    const notes = prompt("Rejection reason:");
    if (notes) {
      await axios.put(`/transfers/${id}/reject`, { notes });
      fetchTransfers();
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
            <h1 className="text-2xl font-bold">Class Transfer</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage class transfer requests</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Request Transfer
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search transfers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">From</th>
                <th className="text-left p-3 font-medium">To</th>
                <th className="text-left p-3 font-medium">Reason</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-medium">{t.student?.full_name}</td>
                  <td className="p-3 text-gray-500">{t.fromClass?.course?.name}</td>
                  <td className="p-3 text-gray-500">{t.toClass?.course?.name}</td>
                  <td className="p-3 text-gray-500 max-w-xs truncate">{t.reason}</td>
                  <td className="p-3"><Badge className={getStatusColor(t.status)}>{t.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedTransfer(t); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    {t.status === "PENDING" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleApprove(t.id)}><CheckCircle className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleReject(t.id)}><XCircle className="h-4 w-4" /></Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Transfer Details">
        {selectedTransfer && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedTransfer.student?.full_name}</h3>
              <p className="text-gray-500">{selectedTransfer.student?.student_code}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">From Class</p><p className="font-medium">{selectedTransfer.fromClass?.course?.name} - {selectedTransfer.fromClass?.level?.name}</p></div>
              <div><p className="text-xs text-gray-500">To Class</p><p className="font-medium">{selectedTransfer.toClass?.course?.name} - {selectedTransfer.toClass?.level?.name}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedTransfer.status}</p></div>
              <div><p className="text-xs text-gray-500">Requested</p><p className="font-medium">{new Date(selectedTransfer.requested_at).toLocaleString("id-ID")}</p></div>
            </div>
            <div><p className="text-xs text-gray-500">Reason</p><p className="font-medium">{selectedTransfer.reason}</p></div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Request Transfer" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Student</option>
                {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <Input value={formData.reason || ""} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From Class</label>
              <select value={formData.from_class_id || ""} onChange={(e) => setFormData({ ...formData, from_class_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Class</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.course?.name} - {c.level?.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Class</label>
              <select value={formData.to_class_id || ""} onChange={(e) => setFormData({ ...formData, to_class_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Class</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.course?.name} - {c.level?.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={() => axios.post("/transfers", formData).then(() => { setShowForm(false); fetchTransfers(); })}>Submit</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
