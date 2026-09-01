"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/courses", { params: { search, per_page: 50 } });
      setCourses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [search]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await axios.delete(`/courses/${id}`);
      fetchCourses();
    }
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/courses/${formData.id}`, formData);
      } else {
        await axios.post("/courses", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchCourses();
    } catch (error) {
      console.error("Failed to save course:", error);
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
            <h1 className="text-2xl font-bold">Course Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage all courses</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Course
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Level</th>
                <th className="text-left p-3 font-medium">Duration</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-mono text-xs">{course.code}</td>
                  <td className="p-3 font-medium">{course.name}</td>
                  <td className="p-3">{course.level || "N/A"}</td>
                  <td className="p-3">{course.duration} min</td>
                  <td className="p-3">Rp {course.price?.toLocaleString("id-ID")}</td>
                  <td className="p-3"><Badge className={getStatusColor(course.status)}>{course.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedCourse(course); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(course); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Course Details" size="lg">
        {selectedCourse && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedCourse.name}</h3>
              <p className="text-gray-500 font-mono text-sm">{selectedCourse.code}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Level</p><p className="font-medium">{selectedCourse.level || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Duration</p><p className="font-medium">{selectedCourse.duration} minutes</p></div>
              <div><p className="text-xs text-gray-500">Price</p><p className="font-medium">Rp {selectedCourse.price?.toLocaleString("id-ID")}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedCourse.status}</p></div>
            </div>
            {selectedCourse.description && (
              <div><p className="text-xs text-gray-500">Description</p><p className="font-medium">{selectedCourse.description}</p></div>
            )}
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Course" : "Add Course"} size="lg">
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <Input value={formData.level || ""} onChange={(e) => setFormData({ ...formData, level: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (min)</label>
              <Input type="number" value={formData.duration || ""} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
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