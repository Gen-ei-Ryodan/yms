"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatDate } from "@/lib/utils";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("/teachers", { params: { search, per_page: 50 } });
      setTeachers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, [search]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      await axios.delete(`/teachers/${id}`);
      fetchTeachers();
    }
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/teachers/${formData.id}`, formData);
      } else {
        await axios.post("/teachers", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchTeachers();
    } catch (error) {
      console.error("Failed to save teacher:", error);
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
            <h1 className="text-2xl font-bold">Teacher Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage all teachers</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Teacher
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Teacher</th>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Specialization</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {teacher.name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-gray-500">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs">{teacher.teacher_code}</td>
                  <td className="p-3">{teacher.specialization || "N/A"}</td>
                  <td className="p-3"><Badge className={getStatusColor(teacher.status)}>{teacher.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedTeacher(teacher); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(teacher); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(teacher.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Teacher Details" size="lg">
        {selectedTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedTeacher.name?.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedTeacher.name}</h3>
                <p className="text-gray-500">{selectedTeacher.teacher_code}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedTeacher.email}</p></div>
              <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{selectedTeacher.phone || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Specialization</p><p className="font-medium">{selectedTeacher.specialization || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Join Date</p><p className="font-medium">{formatDate(selectedTeacher.join_date)}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Teacher" : "Add Teacher"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <Input value={formData.specialization || ""} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Join Date</label>
              <Input type="date" value={formData.join_date || ""} onChange={(e) => setFormData({ ...formData, join_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status || "ACTIVE"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
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