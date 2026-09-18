"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import axios from "axios";
import {
  Loader2,
  ArrowLeftRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function TransferHistoryPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/transfers", { params: { per_page: 50 } })
      .then((r) => setTransfers(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const totalTransfers = transfers.length;
  const pendingTransfers = transfers.filter(
    (t) => t.status === "PENDING"
  ).length;
  const approvedTransfers = transfers.filter(
    (t) => t.status === "APPROVED"
  ).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]"></div>
              <ArrowLeftRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">
                Memuat riwayat perpindahan...
              </p>
              <p className="text-xs text-[#8A93A3] mt-1">
                Mohon tunggu sebentar
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">
                Riwayat Perpindahan
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Transfer History</h1>
            <p className="text-white/60 text-lg">
              History of class/program transfers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Perpindahan"
            value={totalTransfers}
            icon={ArrowLeftRight}
            color="blue"
          />
          <StatCard
            title="Pending"
            value={pendingTransfers}
            icon={Loader2}
            color="yellow"
          />
          <StatCard
            title="Disetujui"
            value={approvedTransfers}
            icon={ArrowRight}
            color="green"
          />
        </div>

        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#0B1526]/5">
            <h2 className="text-lg font-bold text-[#0B1526]">
              Daftar Perpindahan
            </h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">
              {totalTransfers} perpindahan tercatat
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0B1526]/5">
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Siswa
                  </th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Dari
                  </th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Ke
                  </th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Alasan
                  </th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-[#0B1526]/5 hover:bg-[#F5F2EB]/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-[#C9A227]">
                            {t.student?.full_name?.charAt(0)}
                          </span>
                        </div>
                        <span className="font-semibold text-[#0B1526]">
                          {t.student?.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 px-3 rounded-lg bg-[#F5F2EB]/60 border border-[#0B1526]/5 flex items-center gap-2">
                          <span className="text-xs text-[#5B6472]">
                            {t.fromClass?.course?.name} -{" "}
                            {t.fromClass?.level?.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-[#C9A227]" />
                        <div className="h-8 px-3 rounded-lg bg-[#F5F2EB]/60 border border-[#0B1526]/5 flex items-center gap-2">
                          <span className="text-xs text-[#5B6472]">
                            {t.toClass?.course?.name} -{" "}
                            {t.toClass?.level?.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-[#5B6472] max-w-[200px] truncate">
                        {t.reason || "N/A"}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(t.status)}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-[#5B6472]">
                        <ClientDate date={t.requested_at} format="date" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transfers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-16 w-16 rounded-full bg-[#F5F2EB] flex items-center justify-center mb-4">
                  <ArrowLeftRight className="h-8 w-8 text-[#8A93A3]" />
                </div>
                <p className="text-lg font-semibold text-[#0B1526]">
                  Belum ada riwayat perpindahan
                </p>
                <p className="text-sm text-[#8A93A3] mt-1">
                  Perpindahan kelas akan muncul di sini
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#0B1526]/5 bg-[#F5F2EB]/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#5B6472]">
                Menampilkan{" "}
                <span className="font-semibold text-[#0B1526]">
                  {totalTransfers}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-[#0B1526]">
                  {totalTransfers}
                </span>{" "}
                perpindahan
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-[#0B1526]/10"
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-[#0B1526]/10 bg-[#0B1526] text-white hover:bg-[#14233B]"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-[#0B1526]/10"
                  disabled
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
