"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

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
            <h1 className="text-2xl font-bold">Reward Redemptions</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage reward redemptions</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Redeem Reward
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search redemptions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Redemption #</th>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Reward</th>
                <th className="text-left p-3 font-medium">Points</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {redemptions.map((r) => (
                <tr key={r.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-mono text-xs">{r.redemption_number}</td>
                  <td className="p-3 font-medium">{r.student?.full_name}</td>
                  <td className="p-3 text-gray-500">{r.reward?.name}</td>
                  <td className="p-3 font-medium">{r.points_used}</td>
                  <td className="p-3"><Badge className={getStatusColor(r.status)}>{r.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedRedemption(r); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    {r.status === "PENDING" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleApprove(r.id)}><CheckCircle className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleReject(r.id)}><XCircle className="h-4 w-4" /></Button>
                      </>
                    )}
                    {r.status === "APPROVED" && (
                      <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => handleFulfill(r.id)}><RotateCcw className="h-4 w-4" /></Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Redemption Details">
        {selectedRedemption && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold font-mono">{selectedRedemption.redemption_number}</h3>
              <p className="text-gray-500">{selectedRedemption.student?.full_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Reward</p><p className="font-medium">{selectedRedemption.reward?.name}</p></div>
              <div><p className="text-xs text-gray-500">Points Used</p><p className="font-medium">{selectedRedemption.points_used}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedRedemption.status}</p></div>
              <div><p className="text-xs text-gray-500">Redeemed</p><p className="font-medium">{new Date(selectedRedemption.redeemed_at).toLocaleString("id-ID")}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Redeem Reward" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
              <option value="">Select Student</option>
              {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reward</label>
            <select value={formData.reward_id || ""} onChange={(e) => setFormData({ ...formData, reward_id: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
              <option value="">Select Reward</option>
              {rewards.map((r: any) => <option key={r.id} value={r.id}>{r.name} ({r.points_required} pts)</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={async () => {
              try {
                await axios.post("/loyalty/redeem", formData);
                setShowForm(false);
                setFormData({});
                fetchRedemptions();
              } catch (error) {
                console.error("Failed to redeem:", error);
              }
            }}>Redeem</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}