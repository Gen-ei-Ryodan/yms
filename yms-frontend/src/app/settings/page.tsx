"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Shield, Users, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function SettingsPage() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const response = await axios.get("/settings");
      setSettings(response.data.data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage system settings</p>
        </div>

        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
          {[
            { id: "users", label: "Users", icon: Users },
            { id: "roles", label: "Roles & Permissions", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "system", label: "System Settings", icon: Settings },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center gap-2",
                tab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              )}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "system" && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-bold text-lg mb-4">System Settings</h3>
            <div className="space-y-4">
              {settings.map((group: any, gi: number) => (
                <div key={gi} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0">
                  <h4 className="font-medium mb-2 capitalize">{gi === 0 ? "Attendance" : gi === 1 ? "Payment" : "General"}</h4>
                  {group.map((s: any) => (
                    <div key={s.key} className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">{s.key}</span>
                      <Input value={s.value || ""} className="max-w-xs" onChange={(e) => {
                        const newSettings = settings.map((g: any) => g === group ? g.map((ss: any) => ss.key === s.key ? { ...ss, value: e.target.value } : ss) : g);
                        setSettings(newSettings);
                      }} />
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button onClick={async () => {
                  const flatSettings: any[] = [];
                  settings.forEach((g: any) => g.forEach((s: any) => flatSettings.push({ key: s.key, value: s.value })));
                  await axios.put("/settings", { settings: flatSettings });
                }}>Save Settings</Button>
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-bold text-lg mb-4">User Management</h3>
            <p className="text-gray-500 text-sm">User management is handled through the Admin panel. Please use the user management interface.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}