"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, ArrowLeftRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function TransferHistoryPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/transfers", { params: { per_page: 50 } })
      .then((r) => setTransfers(r.data.data))
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Perpindahan</h1>
          <p className="text-sm text-gray-500 mt-1">History of class/program transfers</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Siswa</th>
                <th className="text-left p-3 font-medium">Dari</th>
                <th className="text-left p-3 font-medium">Ke</th>
                <th className="text-left p-3 font-medium">Alasan</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium">{t.student?.full_name}</td>
                  <td className="p-3 text-gray-500">{t.fromClass?.course?.name} - {t.fromClass?.level?.name}</td>
                  <td className="p-3 text-gray-500">{t.toClass?.course?.name} - {t.toClass?.level?.name}</td>
                  <td className="p-3 text-gray-500 max-w-xs truncate">{t.reason}</td>
                  <td className="p-3"><Badge className={getStatusColor(t.status)}>{t.status}</Badge></td>
                  <td className="p-3"><ClientDate date={t.requested_at} format="date" /></td>
                </tr>
              ))}
              {transfers.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada riwayat perpindahan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
