"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Search, Eye, ShoppingCart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatCurrency } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function ProductPurchasesPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("/subscriptions", { params: { search, per_page: 50 } });
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
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
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data pembelian...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Pembelian Produk</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Product Purchases</h1>
              <p className="text-white/60 text-lg">Pembelian produk dan langganan</p>
            </div>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10"><Download className="h-4 w-4 mr-2" /> Export</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Pembelian", value: subscriptions.length, icon: ShoppingCart, color: "bg-blue-500" },
            { label: "Aktif", value: subscriptions.filter(s => s.status === "ACTIVE").length, icon: Eye, color: "bg-emerald-500" },
            { label: "Total Nilai", value: formatCurrency(subscriptions.reduce((sum, s) => sum + (Number(s.price) || 0), 0)), icon: ShoppingCart, color: "bg-amber-500" },
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
              placeholder="Cari pembelian..."
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
                <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Produk</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Harga</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Mulai</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Selesai</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s, i) => (
                <tr key={s.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{s.student?.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5B6472]">{s.product?.name}</td>
                  <td className="p-4 font-medium text-[#0B1526]">{formatCurrency(s.price)}</td>
                  <td className="p-4 text-[#5B6472]"><ClientDate date={s.start_date} format="date" /></td>
                  <td className="p-4 text-[#5B6472]"><ClientDate date={s.end_date} format="date" /></td>
                  <td className="p-4"><Badge className={`${getStatusColor(s.status)} font-medium`}>{s.status}</Badge></td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => { setSelectedItem(s); setShowPanel(true); }}
                      className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr><td colSpan={7} className="p-12 text-center"><div className="flex flex-col items-center gap-3"><div className="h-12 w-12 rounded-2xl bg-[#F5F2EB] flex items-center justify-center"><ShoppingCart className="h-6 w-6 text-[#8A93A3]" /></div><p className="text-[#8A93A3] font-medium">Belum ada pembelian</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Pembelian">
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedItem.product?.name}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedItem.student?.full_name}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Harga</p>
                  <p className="font-bold text-[#0B1526]">{formatCurrency(selectedItem.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedItem.status)} font-medium`}>{selectedItem.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Mulai</p>
                  <p className="font-semibold text-[#0B1526]"><ClientDate date={selectedItem.start_date} format="date" /></p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Selesai</p>
                  <p className="font-semibold text-[#0B1526]"><ClientDate date={selectedItem.end_date} format="date" /></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
