"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusColor, formatDate } from "@/lib/utils";

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
const [selectedStudent, setSelectedStudent] = useState<any>(null);
const [showPanel, setShowPanel] = useState(false);
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/students", { params: { search, per_page: 50 } });
      setStudents(response.data.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [search]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await axios.delete(`/students/${id}`);
      fetchStudents();
    }
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/students/${formData.id}`, formData);
      } else {
        await axios.post("/students", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchStudents();
    } catch (error) {
      console.error("Failed to save student:", error);
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Student Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all students</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Student
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Membership</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {student.full_name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{student.full_name}</p>
                        <p className="text-xs text-gray-500">{student.student_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs">{student.student_code}</td>
                  <td className="p-3">
                    <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={getStatusColor(student.membership_status)}>{student.membership_status}</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedStudent(student); setShowPanel(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(student); setShowForm(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Student Details" size="lg">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedStudent.full_name?.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedStudent.full_name}</h3>
                <p className="text-gray-500">{selectedStudent.student_code}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Gender</p><p className="font-medium capitalize">{selectedStudent.gender}</p></div>
              <div><p className="text-xs text-gray-500">Date of Birth</p><p className="font-medium">{formatDate(selectedStudent.date_of_birth)}</p></div>
              <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{selectedStudent.phone || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedStudent.email || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">School</p><p className="font-medium">{selectedStudent.school_name || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Join Date</p><p className="font-medium">{formatDate(selectedStudent.join_date)}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Student" : "Add Student"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input value={formData.full_name || ""} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Student Number</label>
              <Input value={formData.student_number || ""} onChange={(e) => setFormData({ ...formData, student_number: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select value={formData.gender || "male"} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status || "ACTIVE"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="GRADUATED">GRADUATED</option>
                <option value="TRANSFERRED">TRANSFERRED</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
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