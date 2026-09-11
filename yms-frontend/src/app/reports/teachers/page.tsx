"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function TeacherReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/reports/teachers")
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

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
            <h1 className="text-2xl font-bold text-gray-900">Laporan Guru</h1>
            <p className="text-sm text-gray-500 mt-1">Teacher performance report</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Guru</th>
                <th className="text-left p-3 font-medium">Kode</th>
                <th className="text-left p-3 font-medium">Spesialisasi</th>
                <th className="text-left p-3 font-medium">Kelas Aktif</th>
                <th className="text-left p-3 font-medium">Total Murid</th>
                <th className="text-left p-3 font-medium">Sesi</th>
                <th className="text-left p-3 font-medium">Kehadiran</th>
                <th className="text-left p-3 font-medium">Total Gaji</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.teacher_code} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium">{t.name}</td>
                  <td className="p-3 font-mono text-xs">{t.teacher_code}</td>
                  <td className="p-3 text-gray-500">{t.specialization}</td>
                  <td className="p-3">{t.active_classes}</td>
                  <td className="p-3 font-medium">{t.total_students}</td>
                  <td className="p-3">{t.total_sessions}</td>
                  <td className="p-3">{t.attendance_rate}%</td>
                  <td className="p-3 font-medium">{formatCurrency(t.total_salary_paid)}</td>
                  <td className="p-3"><Badge className={t.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
