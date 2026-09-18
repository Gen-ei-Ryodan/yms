"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Search, Eye, Download, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatCurrency } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function TransactionHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("/payments", { params: { search, per_page: 50 } });
      setPayments(response.data.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [search]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat riwayat transaksi...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Riwayat Transaksi</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
              <p className="text-white/60 text-lg">Riwayat transaksi lengkap</p>
            </div>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10"><Download className="h-4 w-4 mr-2" /> Export</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Transaksi", value: payments.length, icon: DollarSign, color: "bg-blue-500" },
            { label: "Total Nilai", value: formatCurrency(payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)), icon: DollarSign, color: "bg-emerald-500" },
            { label: "Berhasil", value: payments.filter(p => p.status === "PAID").length, icon: Eye, color: "bg-amber-500" },
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

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Payment #</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Jumlah</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Metode</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4 font-mono text-xs text-[#5B6472]">{p.payment_number}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{p.student?.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-[#0B1526]">{formatCurrency(p.amount)}</td>
                  <td className="p-4 text-[#5B6472]"><ClientDate date={p.payment_date} format="date" /></td>
                  <td className="p-4">
                    <Badge variant="outline" className="border-[#0B1526]/10 text-[#5B6472]">{p.payment_method}</Badge>
                  </td>
                  <td className="p-4"><Badge className={`${getStatusColor(p.status)} font-medium`}>{p.status}</Badge></td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => { setSelectedItem(p); setShowPanel(true); }}
                      className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Transaksi">
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <DollarSign className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono text-[#0B1526]">{selectedItem.payment_number}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedItem.student?.full_name}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Jumlah</p>
                  <p className="font-bold text-[#0B1526]">{formatCurrency(selectedItem.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal</p>
                  <p className="font-semibold text-[#0B1526]"><ClientDate date={selectedItem.payment_date} format="date" /></p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Metode</p>
                  <Badge variant="outline" className="border-[#0B1526]/10 text-[#5B6472]">{selectedItem.payment_method}</Badge>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedItem.status)} font-medium`}>{selectedItem.status}</Badge>
                </div>
                {selectedItem.reference && (
                  <div className="col-span-2">
                    <p className="text-xs text-[#8A93A3] font-medium mb-1">Referensi</p>
                    <p className="font-semibold text-[#0B1526]">{selectedItem.reference}</p>
                  </div>
                )}
                {selectedItem.notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-[#8A93A3] font-medium mb-1">Catatan</p>
                    <p className="font-semibold text-[#0B1526]">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
