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
          <h1 className="text-2xl font-bold text-gray-900">Honor / Gaji</h1>
          <p className="text-sm text-gray-500 mt-1">Informasi honor dan perhitungan Anda</p>
        </div>

        {/* Rekap Perhitungan */}
        {calculation && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-5 w-5" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">Rekap Honor Bulan Ini</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-green-100 text-xs">Metode</p>
                <p className="text-lg font-bold">{calculation.calculation.method}</p>
              </div>
              <div>
                <p className="text-green-100 text-xs">Kelas Aktif</p>
                <p className="text-lg font-bold">{calculation.calculation.active_classes}</p>
              </div>
              <div>
                <p className="text-green-100 text-xs">Total Siswa</p>
                <p className="text-lg font-bold">{calculation.calculation.total_students}</p>
              </div>
              <div>
                <p className="text-green-100 text-xs">Estimasi Honor</p>
                <p className="text-2xl font-bold">{formatCurrency(calculation.calculation.base_salary)}</p>
              </div>
            </div>
            <p className="text-green-100 text-xs mt-3">{calculation.calculation.breakdown}</p>
          </div>
        )}

        {/* Summary Cards */}
        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-gray-500">Total Diterima</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(data.total_earned)}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <p className="text-sm text-gray-500">Total Pending</p>
                </div>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(data.total_pending)}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-blue-500" />
                  <p className="text-sm text-gray-500">Total Bonus</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(data.total_bonus)}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-4 w-4 text-purple-500" />
                  <p className="text-sm text-gray-500">Total Kelas</p>
                </div>
                <p className="text-2xl font-bold text-purple-600">{data.total_classes}</p>
              </div>
            </div>

            {/* Riwayat */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg">Riwayat Honor</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left p-3 font-medium">Periode</th>
                    <th className="text-left p-3 font-medium">Gaji Pokok</th>
                    <th className="text-left p-3 font-medium">Bonus</th>
                    <th className="text-left p-3 font-medium">Potongan</th>
                    <th className="text-left p-3 font-medium">Total</th>
                    <th className="text-left p-3 font-medium">Kelas</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.salaries?.map((s: any) => (
                    <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-medium">{s.period}</td>
                      <td className="p-3">{formatCurrency(s.base_salary)}</td>
                      <td className="p-3 text-green-600">+{formatCurrency(s.bonus)}</td>
                      <td className="p-3 text-red-600">-{formatCurrency(s.deductions)}</td>
                      <td className="p-3 font-bold">{formatCurrency(s.total_salary)}</td>
                      <td className="p-3">{s.total_classes}</td>
                      <td className="p-3">
                        <Badge className={s.status === "PAID" ? "bg-green-100 text-green-800" : s.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {(!data.salaries || data.salaries.length === 0) && (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-500">Belum ada data gaji</td></tr>
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
