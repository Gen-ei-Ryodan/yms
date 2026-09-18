"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Bell, CheckCheck, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientDate } from "@/components/ClientDate";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/notifications", { params: { per_page: 50 } });
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat notifikasi...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Notifikasi</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Notifikasi</h1>
              <p className="text-white/60 text-lg">Lihat dan kelola notifikasi Anda</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={async () => { await axios.post("/notifications/mark-all-read"); fetchNotifications(); }} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl">
                <CheckCheck className="h-4 w-4 mr-2" /> Tandai Dibaca
              </Button>
              <Button onClick={async () => { await axios.post("/notifications/delete-all"); fetchNotifications(); }} className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/20 rounded-xl">
                <Trash className="h-4 w-4 mr-2" /> Hapus Semua
              </Button>
            </div>
          </div>
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-8 text-center shadow-sm">
            <Bell className="h-14 w-14 mx-auto text-[#8A93A3] mb-3" />
            <p className="text-[#5B6472] font-medium">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`bg-white rounded-2xl border border-[#0B1526]/5 p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow ${!n.read_at && "border-l-4 border-l-[#C9A227]"}`}>
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-[#0B1526]/5 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-[#0B1526]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0B1526]">{n.data?.message || n.type}</p>
                  <p className="text-sm text-[#8A93A3] mt-1"><ClientDate date={n.created_at} /></p>
                </div>
                {!n.read_at && <Badge className="bg-[#C9A227]/20 text-[#C9A227] font-medium">Baru</Badge>}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
