"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Eye, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatCurrency } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function MyInvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get("/invoices", { params: { student_id: studentId, per_page: 50 } });
          setInvoices(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
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
              <p className="text-sm font-semibold text-[#0B1526]">Memuat invoice...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Invoice</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Invoice</h1>
              <p className="text-white/60 text-lg">Invoice dan bukti pembayaran Anda</p>
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
                <th className="text-left p-4 font-semibold text-[#0B1526]">Invoice #</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Issue Date</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Due Date</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Total</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={inv.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4 font-mono text-xs text-[#0B1526]">{inv.invoice_number}</td>
                  <td className="p-4 text-[#5B6472]"><ClientDate date={inv.issue_date} format="date" /></td>
                  <td className="p-4 text-[#5B6472]"><ClientDate date={inv.due_date} format="date" /></td>
                  <td className="p-4 font-semibold text-[#0B1526]">{formatCurrency(inv.total)}</td>
                  <td className="p-4"><Badge className={`${getStatusColor(inv.status)} font-medium`}>{inv.status}</Badge></td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setSelectedInvoice(inv); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-[#5B6472]">Belum ada invoice</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Invoice">
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <FileText className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526] font-mono">{selectedInvoice.invoice_number}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedInvoice.student?.full_name}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Subtotal</p>
                  <p className="font-semibold text-[#0B1526]">{formatCurrency(selectedInvoice.subtotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Diskon</p>
                  <p className="font-semibold text-[#0B1526]">{formatCurrency(selectedInvoice.discount || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Pajak</p>
                  <p className="font-semibold text-[#0B1526]">{formatCurrency(selectedInvoice.tax || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Total</p>
                  <p className="text-xl font-bold text-[#C9A227]">{formatCurrency(selectedInvoice.total)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedInvoice.status)} font-medium`}>{selectedInvoice.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
