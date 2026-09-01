"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LevelsPage() {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchLevels = async () => {
    try {
      const response = await axios.get("/levels", { params: { search } });
      setLevels(response.data.data);
    } catch (error) {
      console.error("Failed to fetch levels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLevels(); }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/levels/${formData.id}`, formData);
      } else {
        await axios.post("/levels", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchLevels();
    } catch (error) {
      console.error("Failed to save level:", error);
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
            <h1 className="text-2xl font-bold">Level Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage learning levels</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Level
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search levels..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Sequence</th>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Description</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => (
                <tr key={level.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3"><ArrowUp className="h-4 w-4 text-gray-400" /></td>
                  <td className="p-3 font-mono text-xs">{level.code}</td>
                  <td className="p-3 font-medium">{level.name}</td>
                  <td className="p-3 text-gray-500">{level.description || "N/A"}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedLevel(level); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(level); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => axios.delete(`/levels/${level.id}`).then(() => fetchLevels())}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Level Details">
        {selectedLevel && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedLevel.name}</h3>
              <p className="text-gray-500 font-mono text-sm">{selectedLevel.code}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Sequence</p><p className="font-medium">{selectedLevel.sequence}</p></div>
              <div><p className="text-xs text-gray-500">Description</p><p className="font-medium">{selectedLevel.description || "N/A"}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Level" : "Add Level"} size="lg">
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
              <label className="block text-sm font-medium mb-1">Sequence</label>
              <Input type="number" value={formData.sequence || ""} onChange={(e) => setFormData({ ...formData, sequence: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
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