"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatCurrency } from "@/lib/utils";

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/classes", { params: { search, per_page: 50 } });
      setClasses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    Promise.all([
      axios.get("/courses"),
      axios.get("/teachers"),
      axios.get("/rooms"),
    ]).then(([c, t, r]) => {
      setCourses(c.data.data);
      setTeachers(t.data.data);
      setRooms(r.data.data);
    });
  }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/classes/${formData.id}`, formData);
      } else {
        await axios.post("/classes", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchClasses();
    } catch (error) {
      console.error("Failed to save class:", error);
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
            <h1 className="text-2xl font-bold">Class Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage all classes</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Class
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search classes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Course</th>
                <th className="text-left p-3 font-medium">Level</th>
                <th className="text-left p-3 font-medium">Teacher</th>
                <th className="text-left p-3 font-medium">Room</th>
                <th className="text-left p-3 font-medium">Capacity</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-mono text-xs">{cls.class_code}</td>
                  <td className="p-3 font-medium">{cls.course?.name}</td>
                  <td className="p-3">{cls.level?.name}</td>
                  <td className="p-3">{cls.teacher?.name}</td>
                  <td className="p-3">{cls.room?.name}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {cls.enrolled_count || 0}/{cls.capacity}
                    </div>
                  </td>
                  <td className="p-3"><Badge className={getStatusColor(cls.status)}>{cls.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedClass(cls); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(cls); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => axios.delete(`/classes/${cls.id}`).then(() => fetchClasses())}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Class Details" size="lg">
        {selectedClass && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedClass.course?.name}</h3>
              <p className="text-gray-500 font-mono text-sm">{selectedClass.class_code}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Level</p><p className="font-medium">{selectedClass.level?.name}</p></div>
              <div><p className="text-xs text-gray-500">Teacher</p><p className="font-medium">{selectedClass.teacher?.name}</p></div>
              <div><p className="text-xs text-gray-500">Room</p><p className="font-medium">{selectedClass.room?.name}</p></div>
              <div><p className="text-xs text-gray-500">Capacity</p><p className="font-medium">{selectedClass.capacity}</p></div>
              <div><p className="text-xs text-gray-500">Enrolled</p><p className="font-medium">{selectedClass.enrolled_count || 0}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedClass.status}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Class" : "Add Class"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <select value={formData.course_id || ""} onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Course</option>
                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select value={formData.level_id || ""} onChange={(e) => setFormData({ ...formData, level_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Level</option>
                <option value="1">Beginner</option>
                <option value="2">Basic</option>
                <option value="3">Intermediate</option>
                <option value="4">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <select value={formData.teacher_id || ""} onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Teacher</option>
                {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room</label>
              <select value={formData.room_id || ""} onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Room</option>
                {rooms.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <Input type="number" value={formData.capacity || ""} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status || "ACTIVE"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="FULL">FULL</option>
                <option value="COMPLETED">COMPLETED</option>
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