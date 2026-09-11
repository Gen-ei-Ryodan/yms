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

export default function MyPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get("/payments", { params: { student_id: studentId, per_page: 50 } });
          setPayments(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
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
            <h1 className="text-2xl font-bold text-gray-900">Pembayaran Les</h1>
            <p className="text-sm text-gray-500 mt-1">Your lesson payments</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

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
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedPayment(p); setShowPanel(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada pembayaran</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Pembayaran">
        {selectedPayment && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-mono">{selectedPayment.payment_number}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Jumlah</p><p className="font-bold">{formatCurrency(selectedPayment.amount)}</p></div>
              <div><p className="text-xs text-gray-500">Tanggal</p><p className="font-medium"><ClientDate date={selectedPayment.payment_date} format="date" /></p></div>
              <div><p className="text-xs text-gray-500">Metode</p><p className="font-medium">{selectedPayment.payment_method}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><Badge className={getStatusColor(selectedPayment.status)}>{selectedPayment.status}</Badge></div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
