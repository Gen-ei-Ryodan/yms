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
import { getStatusColor, getRoleColor, cn } from "@/lib/utils";

export default function SettingsPage() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const [settingsRes, usersRes] = await Promise.all([
        axios.get("/settings"),
        axios.get("/users"),
      ]);
      const data = settingsRes.data.data;
      const flatSettings = [...(data.string || []), ...(data.integer || [])];
      setSettings(flatSettings);
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
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
          <h1 className="text-2xl font-bold text-gray-900 ">Settings</h1>
          <p className="text-sm text-gray-500  mt-1">Manage system settings</p>
        </div>

        <div className="flex gap-0 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {[
            { id: "users", label: "Users", icon: Users },
            { id: "roles", label: "Roles & Permissions", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "system", label: "System Settings", icon: Settings },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("px-5 py-2.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all",
                tab === t.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "system" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4">System Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 text-gray-700">School Information</h4>
                {settings.filter((s: any) => s.type === "string").map((s: any) => (
                  <div key={s.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <span className="text-sm font-medium">{s.key.replace(/_/g, " ")}</span>
                      <p className="text-xs text-gray-400">{s.description}</p>
                    </div>
                    <Input value={s.value || ""} className="max-w-xs" onChange={(e) => {
                      const newSettings = settings.map((ss: any) => ss.key === s.key ? { ...ss, value: e.target.value } : ss);
                      setSettings(newSettings);
                    }} />
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium mb-3 text-gray-700">Configuration</h4>
                {settings.filter((s: any) => s.type === "integer").map((s: any) => (
                  <div key={s.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <span className="text-sm font-medium">{s.key.replace(/_/g, " ")}</span>
                      <p className="text-xs text-gray-400">{s.description}</p>
                    </div>
                    <Input type="number" value={s.value || ""} className="max-w-xs" onChange={(e) => {
                      const newSettings = settings.map((ss: any) => ss.key === s.key ? { ...ss, value: e.target.value } : ss);
                      setSettings(newSettings);
                    }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={async () => {
                  const flatSettings: any[] = [];
                  settings.forEach((s: any) => flatSettings.push({ key: s.key, value: s.value }));
                  await axios.put("/settings", { settings: flatSettings });
                }}>Save Settings</Button>
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">User Management</h3>
              <div className="flex gap-2">
                <Input placeholder="Search users..." className="w-64" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Role</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-t border-gray-200 hover:bg-gray-100">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3 text-gray-500">{u.email}</td>
                      <td className="p-3"><Badge className={getRoleColor(u.role)}>{u.role.replace("_", " ")}</Badge></td>
                      <td className="p-3">
                        <Badge className={u.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {u.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-400">{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "roles" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4">Roles & Permissions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left p-3 font-medium">Role</th>
                    <th className="text-center p-3 font-medium">Students</th>
                    <th className="text-center p-3 font-medium">Teachers</th>
                    <th className="text-center p-3 font-medium">Classes</th>
                    <th className="text-center p-3 font-medium">Payments</th>
                    <th className="text-center p-3 font-medium">Reports</th>
                    <th className="text-center p-3 font-medium">Settings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="p-3 font-medium"><Badge className="bg-purple-100 text-purple-800">Super Admin</Badge></td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-3 font-medium"><Badge className="bg-blue-100 text-blue-800">Admin</Badge></td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-green-600 font-bold">All</td>
                    <td className="p-3 text-center text-red-500 font-bold">None</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-3 font-medium"><Badge className="bg-green-100 text-green-800">Teacher</Badge></td>
                    <td className="p-3 text-center text-yellow-600 font-bold">View</td>
                    <td className="p-3 text-center text-red-500 font-bold">None</td>
                    <td className="p-3 text-center text-yellow-600 font-bold">View</td>
                    <td className="p-3 text-center text-red-500 font-bold">None</td>
                    <td className="p-3 text-center text-yellow-600 font-bold">View</td>
                    <td className="p-3 text-center text-red-500 font-bold">None</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-3 font-medium"><Badge className="bg-orange-100 text-orange-800">Student</Badge></td>
                    <td className="p-3 text-center text-red-500 font-bold">None</td>
                    <td className="p-3 text-center text-red-500 font-bold">None</td>
                    <td className="p-3 text-center text-yellow-600 font-bold">Own</td>
                    <td className="p-3 text-center text-yellow-600 font-bold">Own</td>
                    <td className="p-3 text-center text-red-500 font-bold">None</td>
                    <td className="p-3 text-center text-red-500 font-bold">None</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium">Payment Reminders</p>
                  <p className="text-xs text-gray-400">Send reminders for upcoming and overdue payments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium">Attendance Alerts</p>
                  <p className="text-xs text-gray-400">Notify parents when student is absent</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium">Schedule Changes</p>
                  <p className="text-xs text-gray-400">Notify when class schedule is modified</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium">Loyalty Points</p>
                  <p className="text-xs text-gray-400">Notify when points are earned or redeemed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Email Digest</p>
                  <p className="text-xs text-gray-400">Receive weekly summary email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex justify-end pt-4">
                <Button>Save Preferences</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
