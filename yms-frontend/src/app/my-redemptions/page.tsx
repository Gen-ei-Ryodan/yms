"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Gift, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function MyRedemptionsPage() {
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get("/redemptions", { params: { student_id: studentId, per_page: 50 } });
          setRedemptions(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch redemptions:", error);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Penukaran</h1>
          <p className="text-sm text-gray-500 mt-1">Your reward redemption history</p>
        </div>

        {redemptions.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium">Reward</th>
                  <th className="text-left p-3 font-medium">Poin</th>
                  <th className="text-left p-3 font-medium">Tanggal</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((r) => (
                  <tr key={r.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.reward?.name}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {r.points_used}
                      </span>
                    </td>
                    <td className="p-3"><ClientDate date={r.redeemed_at} format="date" /></td>
                    <td className="p-3"><Badge className={getStatusColor(r.status)}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Gift className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Belum ada riwayat penukaran</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
