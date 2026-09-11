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
            <h1 className="text-2xl font-bold text-gray-900">Pembelian</h1>
            <p className="text-sm text-gray-500 mt-1">Your product purchases</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Produk</th>
                <th className="text-left p-3 font-medium">Harga</th>
                <th className="text-left p-3 font-medium">Mulai</th>
                <th className="text-left p-3 font-medium">Selesai</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-medium">{s.product?.name}</td>
                  <td className="p-3 font-medium">{formatCurrency(s.price)}</td>
                  <td className="p-3"><ClientDate date={s.start_date} format="date" /></td>
                  <td className="p-3"><ClientDate date={s.end_date} format="date" /></td>
                  <td className="p-3"><Badge className={getStatusColor(s.status)}>{s.status}</Badge></td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada pembelian</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
