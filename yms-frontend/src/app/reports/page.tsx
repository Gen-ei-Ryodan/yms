"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, FileText, Filter, Download, BarChart3 } from "lucide-react";
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
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat laporan...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Gradient Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Laporan</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Laporan & Analitik</h1>
            <p className="text-white/60 text-lg">Lihat dan ekspor seluruh laporan sekolah</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-1.5 shadow-sm flex gap-1">
          {reports.map((r) => (
            <button key={r.id} onClick={() => setTab(r.id)}
              className={cn("px-5 py-2.5 text-sm font-medium rounded-xl capitalize transition-all",
                tab === r.id ? "bg-[#0B1526] text-white shadow-lg shadow-[#0B1526]/20" : "text-[#5B6472] hover:text-[#0B1526] hover:bg-[#F5F2EB]"
              )}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm">
          {!reportData && (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="h-14 w-14 rounded-2xl bg-[#F5F2EB] flex items-center justify-center">
                <BarChart3 className="h-7 w-7 text-[#8A93A3]" />
              </div>
              <p className="text-[#5B6472] font-medium">Tidak ada data laporan</p>
              <p className="text-[#8A93A3] text-sm">Data laporan tidak tersedia atau terjadi kesalahan saat memuat data.</p>
            </div>
          )}

          {tab === "students" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#0B1526]">Student Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F5F2EB]">
                    <tr>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Student</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Code</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(reportData) && reportData.map((s: any, i: number) => (
                      <tr key={s.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                        <td className="p-4 font-semibold text-[#0B1526]">{s.full_name}</td>
                        <td className="p-4 font-mono text-xs text-[#5B6472]">{s.student_code}</td>
                        <td className="p-4"><Badge className={`${getStatusColor(s.status)} font-medium`}>{s.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "attendance" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#0B1526]">Attendance Report</h3>
              {reportData.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-xs text-[#8A93A3] font-medium">Present</p>
                    <p className="text-xl font-bold text-[#0B1526]">{reportData.summary.present}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-[#8A93A3] font-medium">Late</p>
                    <p className="text-xl font-bold text-[#0B1526]">{reportData.summary.late}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs text-[#8A93A3] font-medium">Absent</p>
                    <p className="text-xl font-bold text-[#0B1526]">{reportData.summary.absent}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-[#8A93A3] font-medium">Rate</p>
                    <p className="text-xl font-bold text-[#0B1526]">{reportData.summary.attendance_rate}%</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "revenue" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#0B1526]">Revenue Report</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-[#8A93A3] font-medium">Total Revenue</p>
                  <p className="text-xl font-bold text-[#0B1526]"><ClientNumber value={reportData.total_revenue} prefix="Rp " /></p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-[#8A93A3] font-medium">Transactions</p>
                  <p className="text-xl font-bold text-[#0B1526]">{reportData.total_transactions}</p>
                </div>
              </div>
            </div>
          )}

          {tab === "loyalty" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#0B1526]">Loyalty Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F5F2EB]">
                    <tr>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Student</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Earned</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Redeemed</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Balance</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(reportData) && reportData.map((r: any, i: number) => (
                      <tr key={i} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                        <td className="p-4 font-semibold text-[#0B1526]">{r.student}</td>
                        <td className="p-4 text-[#5B6472]">{r.points_earned}</td>
                        <td className="p-4 text-[#5B6472]">{r.points_redeemed}</td>
                        <td className="p-4 font-bold text-[#C9A227]">{r.current_balance}</td>
                        <td className="p-4 text-[#5B6472]">{r.tier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "classes" && reportData && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#0B1526]">Class Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F5F2EB]">
                    <tr>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Class</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Course</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Teacher</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Enrolled</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Capacity</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Sessions</th>
                      <th className="text-left p-4 font-semibold text-[#0B1526]">Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(reportData) && reportData.map((c: any, i: number) => (
                      <tr key={i} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                        <td className="p-4 font-mono text-xs text-[#0B1526]">{c.class_code}</td>
                        <td className="p-4 text-[#5B6472]">{c.course}</td>
                        <td className="p-4 text-[#5B6472]">{c.teacher}</td>
                        <td className="p-4 text-[#5B6472]">{c.enrolled}</td>
                        <td className="p-4 text-[#5B6472]">{c.capacity}</td>
                        <td className="p-4 text-[#5B6472]">{c.total_sessions}</td>
                        <td className="p-4">
                          <Badge className={c.attendance_rate >= 80 ? "bg-emerald-100 text-emerald-800 font-medium" : c.attendance_rate >= 50 ? "bg-amber-100 text-amber-800 font-medium" : "bg-red-100 text-red-800 font-medium"}>
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
