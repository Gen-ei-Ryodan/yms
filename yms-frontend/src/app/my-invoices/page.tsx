"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Eye, Download } from "lucide-react";
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
            <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
            <p className="text-sm text-gray-500 mt-1">Your invoices and receipts</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

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
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedInvoice(inv); setShowPanel(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada invoice</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Invoice">
        {selectedInvoice && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-mono">{selectedInvoice.invoice_number}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Subtotal</p><p className="font-medium">{formatCurrency(selectedInvoice.subtotal)}</p></div>
              <div><p className="text-xs text-gray-500">Diskon</p><p className="font-medium">{formatCurrency(selectedInvoice.discount || 0)}</p></div>
              <div><p className="text-xs text-gray-500">Pajak</p><p className="font-medium">{formatCurrency(selectedInvoice.tax || 0)}</p></div>
              <div><p className="text-xs text-gray-500">Total</p><p className="font-bold">{formatCurrency(selectedInvoice.total)}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><Badge className={getStatusColor(selectedInvoice.status)}>{selectedInvoice.status}</Badge></div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
