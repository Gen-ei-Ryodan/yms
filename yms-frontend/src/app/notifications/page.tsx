"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Bell, CheckCheck, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400">View and manage notifications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={async () => {
              await axios.post("/notifications/mark-all-read");
              fetchNotifications();
            }}>
              <CheckCheck className="h-4 w-4 mr-2" /> Mark All Read
            </Button>
            <Button variant="outline" onClick={async () => {
              await axios.post("/notifications/delete-all");
              fetchNotifications();
            }}>
              <Trash className="h-4 w-4 mr-2" /> Delete All
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
            <Bell className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className={cn("bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex items-start gap-3",
                !n.read_at && "border-l-4 border-l-blue-600"
              )}>
                <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{n.data?.message || n.type}</p>
                  <p className="text-sm text-gray-500">{new Date(n.created_at).toLocaleString("id-ID")}</p>
                </div>
                {!n.read_at && <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">New</Badge>}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}