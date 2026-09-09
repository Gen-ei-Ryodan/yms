"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, FileText, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientNumber } from "@/components/ClientDate";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, cn } from "@/lib/utils";

export default function ReportsPage() {
  const [tab, setTab] = useState("students");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchReport = async (reportType: string) => {
    setLoading(true);
    setReportData(null);
    try {
      const response = await axios.get(`/reports/${reportType}`, { params: filters });
      setReportData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(tab);
  }, [tab]);

  const reports = [
    { id: "students", label: "Student Report" },
    { id: "attendance", label: "Attendance Report" },
    { id: "revenue", label: "Revenue Report" },
    { id: "loyalty", label: "Loyalty Report" },
    { id: "classes", label: "Class Report" },
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-500 mt-1">View and export reports</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>

        <div className="flex gap-0 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {reports.map((r) => (
            <button key={r.id} onClick={() => setTab(r.id)}
              className={cn("px-5 py-2.5 text-sm font-medium rounded-md capitalize transition-all",
                tab === r.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}>
              {r.label}
            </button>
          ))}
        </div>

        <div className="bg-white  rounded-lg border border-gray-200 p-6">
          {tab === "students" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Student Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-2 font-medium">Student</th>
                      <th className="text-left p-2 font-medium">Code</th>
                      <th className="text-left p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(reportData) && reportData.map((s: any) => (
                      <tr key={s.id} className="border-t border-gray-200">
                        <td className="p-2">{s.full_name}</td>
                        <td className="p-2 font-mono text-xs">{s.student_code}</td>
                        <td className="p-2"><Badge className={getStatusColor(s.status)}>{s.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "attendance" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Attendance Report</h3>
              {reportData.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-green-50 rounded-lg"><p className="text-xs text-gray-500">Present</p><p className="font-bold">{reportData.summary.present}</p></div>
                  <div className="p-3 bg-yellow-50 rounded-lg"><p className="text-xs text-gray-500">Late</p><p className="font-bold">{reportData.summary.late}</p></div>
                  <div className="p-3 bg-red-50 rounded-lg"><p className="text-xs text-gray-500">Absent</p><p className="font-bold">{reportData.summary.absent}</p></div>
                  <div className="p-3 bg-blue-50 rounded-lg"><p className="text-xs text-gray-500">Rate</p><p className="font-bold">{reportData.summary.attendance_rate}%</p></div>
                </div>
              )}
            </div>
          )}

          {tab === "revenue" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Revenue Report</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="font-bold"><ClientNumber value={reportData.total_revenue} prefix="Rp " /></p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500">Transactions</p>
                  <p className="font-bold">{reportData.total_transactions}</p>
                </div>
              </div>
            </div>
          )}

          {tab === "loyalty" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Loyalty Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-2 font-medium">Student</th>
                      <th className="text-left p-2 font-medium">Earned</th>
                      <th className="text-left p-2 font-medium">Redeemed</th>
                      <th className="text-left p-2 font-medium">Balance</th>
                      <th className="text-left p-2 font-medium">Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(reportData) && reportData.map((r: any, i: number) => (
                      <tr key={i} className="border-t border-gray-200">
                        <td className="p-2">{r.student}</td>
                        <td className="p-2">{r.points_earned}</td>
                        <td className="p-2">{r.points_redeemed}</td>
                        <td className="p-2 font-bold text-yellow-600">{r.current_balance}</td>
                        <td className="p-2">{r.tier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "classes" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Class Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-2 font-medium">Class</th>
                      <th className="text-left p-2 font-medium">Course</th>
                      <th className="text-left p-2 font-medium">Teacher</th>
                      <th className="text-left p-2 font-medium">Enrolled</th>
                      <th className="text-left p-2 font-medium">Capacity</th>
                      <th className="text-left p-2 font-medium">Sessions</th>
                      <th className="text-left p-2 font-medium">Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(reportData) && reportData.map((c: any, i: number) => (
                      <tr key={i} className="border-t border-gray-200 hover:bg-gray-100">
                        <td className="p-2 font-mono text-xs">{c.class_code}</td>
                        <td className="p-2">{c.course}</td>
                        <td className="p-2">{c.teacher}</td>
                        <td className="p-2">{c.enrolled}</td>
                        <td className="p-2">{c.capacity}</td>
                        <td className="p-2">{c.total_sessions}</td>
                        <td className="p-2">
                          <Badge className={c.attendance_rate >= 80 ? "bg-green-100 text-green-800" : c.attendance_rate >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                            {c.attendance_rate}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
