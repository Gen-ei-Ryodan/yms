"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Search, Eye, Download } from "lucide-react";
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
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
            <p className="text-sm text-gray-500 mt-1">Complete transaction history</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Payment #</th>
                <th className="text-left p-3 font-medium">Siswa</th>
                <th className="text-left p-3 font-medium">Jumlah</th>
                <th className="text-left p-3 font-medium">Tanggal</th>
                <th className="text-left p-3 font-medium">Metode</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{p.payment_number}</td>
                  <td className="p-3 font-medium">{p.student?.full_name}</td>
                  <td className="p-3 font-medium">{formatCurrency(p.amount)}</td>
                  <td className="p-3"><ClientDate date={p.payment_date} format="date" /></td>
                  <td className="p-3">{p.payment_method}</td>
                  <td className="p-3"><Badge className={getStatusColor(p.status)}>{p.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(p); setShowPanel(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Transaksi">
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold font-mono">{selectedItem.payment_number}</h3>
              <p className="text-gray-500">{selectedItem.student?.full_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Jumlah</p><p className="font-bold">{formatCurrency(selectedItem.amount)}</p></div>
              <div><p className="text-xs text-gray-500">Tanggal</p><p className="font-medium"><ClientDate date={selectedItem.payment_date} format="date" /></p></div>
              <div><p className="text-xs text-gray-500">Metode</p><p className="font-medium">{selectedItem.payment_method}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><Badge className={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge></div>
              {selectedItem.reference && <div className="col-span-2"><p className="text-xs text-gray-500">Referensi</p><p className="font-medium">{selectedItem.reference}</p></div>}
              {selectedItem.notes && <div className="col-span-2"><p className="text-xs text-gray-500">Catatan</p><p className="font-medium">{selectedItem.notes}</p></div>}
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
