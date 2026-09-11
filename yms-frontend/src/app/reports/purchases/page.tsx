"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function PurchaseReportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/courses").then((r) => setCourses(r.data.data));
  }, []);

  useEffect(() => {
    const params: any = {};
    if (filterCourse) params.course_id = filterCourse;
    axios.get("/reports/purchases", { params })
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, [filterCourse]);

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
            <h1 className="text-2xl font-bold text-gray-900">Laporan Pembelian</h1>
            <p className="text-sm text-gray-500 mt-1">Purchase report summary</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

        <div className="flex gap-4">
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
            <option value="">Semua Program</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Total Pembelian</p>
                <p className="text-2xl font-bold text-blue-600">{data.total_purchases}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Total Nilai</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(data.total_value)}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left p-3 font-medium">Tanggal</th>
                    <th className="text-left p-3 font-medium">Siswa</th>
                    <th className="text-left p-3 font-medium">Produk</th>
                    <th className="text-left p-3 font-medium">Program</th>
                    <th className="text-left p-3 font-medium">Harga</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.details?.map((d: any, i: number) => (
                    <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{d.date}</td>
                      <td className="p-3 font-medium">{d.student}</td>
                      <td className="p-3">{d.product}</td>
                      <td className="p-3 text-gray-500">{d.course}</td>
                      <td className="p-3 font-medium">{formatCurrency(d.amount)}</td>
                      <td className="p-3"><Badge className={d.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{d.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
