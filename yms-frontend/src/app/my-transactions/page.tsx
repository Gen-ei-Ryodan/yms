"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Search, Eye, DollarSign, CreditCard, Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatCurrency } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function MyTransactionsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("payments");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const [payRes, invRes] = await Promise.all([
            axios.get("/payments", { params: { student_id: studentId, per_page: 50 } }),
            axios.get("/invoices", { params: { student_id: studentId, per_page: 50 } }),
          ]);
          setPayments(payRes.data.data);
          setInvoices(invRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
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

  const totalPaid = payments.filter(p => p.status === "PAID").reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalPending = invoices.filter(i => ["UNPAID", "PARTIAL"].includes(i.status)).reduce((sum, i) => sum + parseFloat(i.total), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
            <p className="text-sm text-gray-500 mt-1">View your payment and invoice history</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Dibayar</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Pending</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalPending)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Transaksi</p>
            <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          <button onClick={() => setTab("payments")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === "payments" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            Pembayaran ({payments.length})
          </button>
          <button onClick={() => setTab("invoices")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === "invoices" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            Invoice ({invoices.length})
          </button>
        </div>

        {tab === "payments" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium">Payment #</th>
                  <th className="text-left p-3 font-medium">Tanggal</th>
                  <th className="text-left p-3 font-medium">Jumlah</th>
                  <th className="text-left p-3 font-medium">Metode</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{p.payment_number}</td>
                    <td className="p-3"><ClientDate date={p.payment_date} format="date" /></td>
                    <td className="p-3 font-medium">{formatCurrency(p.amount)}</td>
                    <td className="p-3">{p.payment_method}</td>
                    <td className="p-3"><Badge className={getStatusColor(p.status)}>{p.status}</Badge></td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(p); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada pembayaran</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "invoices" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium">Invoice #</th>
                  <th className="text-left p-3 font-medium">Issue Date</th>
                  <th className="text-left p-3 font-medium">Due Date</th>
                  <th className="text-left p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{inv.invoice_number}</td>
                    <td className="p-3"><ClientDate date={inv.issue_date} format="date" /></td>
                    <td className="p-3"><ClientDate date={inv.due_date} format="date" /></td>
                    <td className="p-3 font-medium">{formatCurrency(inv.total)}</td>
                    <td className="p-3"><Badge className={getStatusColor(inv.status)}>{inv.status}</Badge></td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(inv); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada invoice</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title={tab === "payments" ? "Detail Pembayaran" : "Detail Invoice"}>
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold font-mono">{selectedItem.payment_number || selectedItem.invoice_number}</h3>
              <p className="text-gray-500">{selectedItem.student?.full_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {tab === "payments" ? (
                <>
                  <div><p className="text-xs text-gray-500">Jumlah</p><p className="font-medium">{formatCurrency(selectedItem.amount)}</p></div>
                  <div><p className="text-xs text-gray-500">Tanggal</p><p className="font-medium"><ClientDate date={selectedItem.payment_date} format="date" /></p></div>
                  <div><p className="text-xs text-gray-500">Metode</p><p className="font-medium">{selectedItem.payment_method}</p></div>
                  <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedItem.status}</p></div>
                  {selectedItem.reference && <div className="col-span-2"><p className="text-xs text-gray-500">Referensi</p><p className="font-medium">{selectedItem.reference}</p></div>}
                </>
              ) : (
                <>
                  <div><p className="text-xs text-gray-500">Subtotal</p><p className="font-medium">{formatCurrency(selectedItem.subtotal)}</p></div>
                  <div><p className="text-xs text-gray-500">Diskon</p><p className="font-medium">{formatCurrency(selectedItem.discount || 0)}</p></div>
                  <div><p className="text-xs text-gray-500">Pajak</p><p className="font-medium">{formatCurrency(selectedItem.tax || 0)}</p></div>
                  <div><p className="text-xs text-gray-500">Total</p><p className="font-bold">{formatCurrency(selectedItem.total)}</p></div>
                  <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedItem.status}</p></div>
                </>
              )}
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
