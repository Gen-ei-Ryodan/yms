"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Star, Award, Gift, TrendingUp } from "lucide-react";
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rewards</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage reward catalog</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Reward
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search rewards..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((r) => (
            <div key={r.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Gift className="h-12 w-12 text-white" />
              </div>
              <div className="p-4">
                <h3 className="font-bold">{r.name}</h3>
                <p className="text-sm text-gray-500">{r.code}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">{r.points_required} pts</Badge>
                  <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">Stock: {r.stock}</p>
                <div className="flex gap-1 mt-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedReward(r); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setFormData(r); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => axios.delete(`/rewards/${r.id}`).then(() => fetchRewards())}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Reward Details">
        {selectedReward && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedReward.name}</h3>
              <p className="text-gray-500 font-mono text-sm">{selectedReward.code}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Points Required</p><p className="font-medium">{selectedReward.points_required}</p></div>
              <div><p className="text-xs text-gray-500">Stock</p><p className="font-medium">{selectedReward.stock}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedReward.status}</p></div>
            </div>
            {selectedReward.description && <div><p className="text-xs text-gray-500">Description</p><p className="font-medium">{selectedReward.description}</p></div>}
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Reward" : "Add Reward"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <Input value={formData.code || ""} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Points Required</label>
              <Input type="number" value={formData.points_required || ""} onChange={(e) => setFormData({ ...formData, points_required: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <Input type="number" value={formData.stock || ""} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={formData.status || "ACTIVE"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}