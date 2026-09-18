"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, DollarSign, Clock, Award, TrendingUp, Calculator, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function SalaryPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salaryRes, calcRes] = await Promise.all([
          axios.get("/my-salary"),
          axios.post("/salary-rules/calculate", { teacher_id: user?.teacher?.id }).catch(() => null),
        ]);
        setData(salaryRes.data.data);
        if (calcRes?.data?.data) setCalculation(calcRes.data.data);
      } catch (error) {
        console.error("Failed to fetch salary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data honor...</p>
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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Honor / Gaji</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Honor & Salary</h1>
            <p className="text-white/60 text-lg">Informasi honor dan perhitungan Anda</p>
          </div>
        </div>

        {/* Rekap Perhitungan */}
        {calculation && (
          <div className="relative overflow-hidden bg-gradient-to-r from-[#2E7D5B] to-[#1A5C3E] rounded-2xl p-6 text-white shadow-lg shadow-[#2E7D5B]/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-5 w-5" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">Rekap Honor Bulan Ini</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-white/60 text-xs">Metode</p>
                  <p className="text-lg font-bold">{calculation.calculation.method}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Kelas Aktif</p>
                  <p className="text-lg font-bold">{calculation.calculation.active_classes}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Total Siswa</p>
                  <p className="text-lg font-bold">{calculation.calculation.total_students}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Estimasi Honor</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculation.calculation.base_salary)}</p>
                </div>
              </div>
              <p className="text-white/60 text-xs mt-3">{calculation.calculation.breakdown}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-12 text-center shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-[#F5F2EB] flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-[#8A93A3]" />
              </div>
              <p className="text-[#5B6472] font-medium text-lg">Tidak ada data honor</p>
              <p className="text-[#8A93A3] text-sm">Anda belum memiliki data honor atau tidak memiliki akses ke halaman ini.</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Diterima", value: formatCurrency(data.total_earned), icon: DollarSign, color: "bg-emerald-500" },
                { label: "Total Pending", value: formatCurrency(data.total_pending), icon: Clock, color: "bg-amber-500" },
                { label: "Total Bonus", value: formatCurrency(data.total_bonus), icon: Award, color: "bg-blue-500" },
                { label: "Total Kelas", value: data.total_classes, icon: Wallet, color: "bg-purple-500" },
              ].map((stat) => (
                <div key={stat.label} className="relative overflow-hidden rounded-2xl bg-white border border-[#0B1526]/5 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8A93A3] font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-[#0B1526]">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Riwayat */}
            <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#0B1526]/5">
                <h3 className="font-bold text-lg text-[#0B1526]">Riwayat Honor</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-[#F5F2EB]">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Periode</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Gaji Pokok</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Bonus</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Potongan</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Total</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Kelas</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.salaries?.map((s: any, i: number) => (
                    <tr key={s.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                      <td className="p-4 font-medium text-[#0B1526]">{s.period}</td>
                      <td className="p-4 text-[#5B6472]">{formatCurrency(s.base_salary)}</td>
                      <td className="p-4 text-emerald-600">+{formatCurrency(s.bonus)}</td>
                      <td className="p-4 text-red-600">-{formatCurrency(s.deductions)}</td>
                      <td className="p-4 font-bold text-[#0B1526]">{formatCurrency(s.total_salary)}</td>
                      <td className="p-4 text-[#5B6472]">{s.total_classes}</td>
                      <td className="p-4">
                        <Badge className={s.status === "PAID" ? "bg-emerald-100 text-emerald-800 font-medium" : s.status === "PENDING" ? "bg-amber-100 text-amber-800 font-medium" : "bg-red-100 text-red-800 font-medium"}>
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {(!data.salaries || data.salaries.length === 0) && (
                    <tr><td colSpan={7} className="p-12 text-center"><div className="flex flex-col items-center gap-3"><div className="h-12 w-12 rounded-2xl bg-[#F5F2EB] flex items-center justify-center"><DollarSign className="h-6 w-6 text-[#8A93A3]" /></div><p className="text-[#8A93A3] font-medium">Belum ada data gaji</p></div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
