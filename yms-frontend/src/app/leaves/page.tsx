"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("/leaves", { params: { per_page: 50 } });
      setLeaves(response.data.data);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    axios.get("/students").then(r => setStudents(r.data.data));
  }, []);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/leaves/${formData.id}`, formData);
      } else {
        await axios.post("/leaves", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchLeaves();
    } catch (error) {
      console.error("Failed to save leave:", error);
    }
  };

  const handleApprove = async (id: number) => {
    await axios.put(`/leaves/${id}/approve`, {});
    fetchLeaves();
  };

  const handleReject = async (id: number) => {
    const notes = prompt("Rejection reason:");
    if (notes) {
      await axios.put(`/leaves/${id}/reject`, { notes });
      fetchLeaves();
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
            <h1 className="text-2xl font-bold">Leave / Cuti</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage student leave requests</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Request Leave
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search leaves..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Start Date</th>
                <th className="text-left p-3 font-medium">End Date</th>
                <th className="text-left p-3 font-medium">Reason</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-medium">{l.student?.full_name}</td>
                  <td className="p-3">{l.start_date}</td>
                  <td className="p-3">{l.end_date}</td>
                  <td className="p-3 text-gray-500 max-w-xs truncate">{l.reason}</td>
                  <td className="p-3"><Badge className={getStatusColor(l.status)}>{l.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedLeave(l); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    {l.status === "PENDING" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleApprove(l.id)}><CheckCircle className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleReject(l.id)}><XCircle className="h-4 w-4" /></Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Leave Details">
        {selectedLeave && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedLeave.student?.full_name}</h3>
              <p className="text-gray-500">{selectedLeave.student?.student_code}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Start Date</p><p className="font-medium">{selectedLeave.start_date}</p></div>
              <div><p className="text-xs text-gray-500">End Date</p><p className="font-medium">{selectedLeave.end_date}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedLeave.status}</p></div>
              <div><p className="text-xs text-gray-500">Requested</p><p className="font-medium">{new Date(selectedLeave.requested_at).toLocaleString("id-ID")}</p></div>
            </div>
            <div><p className="text-xs text-gray-500">Reason</p><p className="font-medium">{selectedLeave.reason}</p></div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Request Leave" size="lg">
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
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input type="date" value={formData.start_date || ""} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input type="date" value={formData.end_date || ""} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Input value={formData.notes || ""} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>Submit</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}