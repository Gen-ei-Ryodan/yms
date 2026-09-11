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
            <h1 className="text-2xl font-bold text-gray-900">Pembelian Produk</h1>
            <p className="text-sm text-gray-500 mt-1">Product purchases and subscriptions</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search purchases..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Siswa</th>
                <th className="text-left p-3 font-medium">Produk</th>
                <th className="text-left p-3 font-medium">Harga</th>
                <th className="text-left p-3 font-medium">Mulai</th>
                <th className="text-left p-3 font-medium">Selesai</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium">{s.student?.full_name}</td>
                  <td className="p-3">{s.product?.name}</td>
                  <td className="p-3 font-medium">{formatCurrency(s.price)}</td>
                  <td className="p-3"><ClientDate date={s.start_date} format="date" /></td>
                  <td className="p-3"><ClientDate date={s.end_date} format="date" /></td>
                  <td className="p-3"><Badge className={getStatusColor(s.status)}>{s.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(s); setShowPanel(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Belum ada pembelian</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Pembelian">
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedItem.product?.name}</h3>
              <p className="text-gray-500">{selectedItem.student?.full_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Harga</p><p className="font-bold">{formatCurrency(selectedItem.price)}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><Badge className={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge></div>
              <div><p className="text-xs text-gray-500">Mulai</p><p className="font-medium"><ClientDate date={selectedItem.start_date} format="date" /></p></div>
              <div><p className="text-xs text-gray-500">Selesai</p><p className="font-medium"><ClientDate date={selectedItem.end_date} format="date" /></p></div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
