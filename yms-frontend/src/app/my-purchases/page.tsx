"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, ShoppingCart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatCurrency } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function MyPurchasesPage() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get("/subscriptions", { params: { student_id: studentId, per_page: 50 } });
          setSubscriptions(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
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
              <p className="text-sm font-semibold text-[#0B1526]">Memuat pembelian...</p>
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
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Pembelian</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Pembelian Produk</h1>
              <p className="text-white/60 text-lg">Daftar pembelian langganan Anda</p>
            </div>
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Produk</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Harga</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Mulai</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Selesai</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s, i) => (
                <tr key={s.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4 font-semibold text-[#0B1526]">{s.product?.name}</td>
                  <td className="p-4 font-semibold text-[#0B1526]">{formatCurrency(s.price)}</td>
                  <td className="p-4 text-[#5B6472]"><ClientDate date={s.start_date} format="date" /></td>
                  <td className="p-4 text-[#5B6472]"><ClientDate date={s.end_date} format="date" /></td>
                  <td className="p-4"><Badge className={`${getStatusColor(s.status)} font-medium`}>{s.status}</Badge></td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-[#5B6472]">Belum ada pembelian</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
