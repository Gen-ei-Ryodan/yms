"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Shield, Users, Settings, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface Setting {
  key: string;
  value: string;
  type: string;
  description: string;
}

export default function SettingsPage() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");

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
        <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: "#F5F2EB" }}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0B1526, #1A2744)" }}>
                <Settings className="h-8 w-8 animate-spin" style={{ color: "#C9A227" }} />
              </div>
              <div className="absolute -inset-2 rounded-full animate-ping opacity-20" style={{ backgroundColor: "#C9A227" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "#0B1526" }}>Loading Settings...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "roles", label: "Roles & Permissions", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System Settings", icon: Settings },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen" style={{ backgroundColor: "#F5F2EB" }}>
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0B1526 0%, #1A2744 50%, #0B1526 100%)" }}>
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: "#C9A227", transform: "translate(-30%, -30%)" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: "#C9A227", transform: "translate(20%, 20%)" }} />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: "#C9A227", transform: "translate(-50%, -50%)" }} />
          
          <div className="relative px-8 py-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C9A227, #E8C84A)" }}>
                <Settings className="h-5 w-5" style={{ color: "#0B1526" }} />
              </div>
              <h1 className="text-3xl font-bold text-white">Pengaturan Sistem</h1>
            </div>
            <div className="w-20 h-1 rounded-full mt-3" style={{ backgroundColor: "#C9A227" }} />
            <p className="text-sm mt-3 opacity-80" style={{ color: "rgba(255,255,255,0.7)" }}>Kelola pengaturan dan konfigurasi sistem Anda</p>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="flex gap-2 p-1.5 rounded-2xl shadow-lg" style={{ backgroundColor: "white", border: "1px solid rgba(11, 21, 38, 0.08)" }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "px-5 py-3 text-sm font-semibold rounded-xl flex items-center gap-2.5 transition-all duration-300",
                  tab === t.id
                    ? "text-white shadow-lg"
                    : "hover:shadow-md"
                )}
                style={tab === t.id ? {
                  background: "linear-gradient(135deg, #0B1526, #1A2744)",
                  boxShadow: "0 4px 15px rgba(11, 21, 38, 0.3)"
                } : {
                  color: "#0B1526",
                  backgroundColor: "transparent"
                }}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {tab === "users" && (
            <div className="mt-6 bg-white rounded-2xl overflow-hidden shadow-lg" style={{ border: "1px solid rgba(11, 21, 38, 0.06)" }}>
              <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(11, 21, 38, 0.06)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0B1526, #1A2744)" }}>
                      <Users className="h-5 w-5" style={{ color: "#C9A227" }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: "#0B1526" }}>User Management</h3>
                      <p className="text-xs" style={{ color: "#0B1526", opacity: 0.6 }}>Kelola akun pengguna sistem</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "#0B1526", opacity: 0.4 }} />
                      <Input
                        placeholder="Search users..."
                        className="pl-10 w-64 h-10 rounded-xl"
                        style={{ borderColor: "rgba(11, 21, 38, 0.1)" }}
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "#0B1526" }}>
                      <th className="text-left px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Name</th>
                      <th className="text-left px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Role</th>
                      <th className="text-left px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter((u) => {
                      if (!userSearch) return true;
                      const q = userSearch.toLowerCase();
                      return (
                        u.name?.toLowerCase().includes(q) ||
                        u.email?.toLowerCase().includes(q) ||
                        u.role?.toLowerCase().includes(q)
                      );
                    }).map((u: User) => (
                      <tr
                        key={u.id}
                        className="transition-colors duration-150 hover:shadow-sm"
                        style={{ borderBottom: "1px solid rgba(11, 21, 38, 0.06)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(11, 21, 38, 0.02)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white" style={{ background: "linear-gradient(135deg, #0B1526, #1A2744)" }}>
                              {u.name.charAt(0)}
                            </div>
                            <span className="font-semibold" style={{ color: "#0B1526" }}>{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ color: "#0B1526", opacity: 0.7 }}>{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold", getRoleBadgeColor(u.role))}>
                            {u.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold", u.is_active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")}>
                            {u.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4" style={{ color: "#0B1526", opacity: 0.6 }}>
                          {new Date(u.created_at).toLocaleDateString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "roles" && (
            <div className="mt-6 bg-white rounded-2xl overflow-hidden shadow-lg" style={{ border: "1px solid rgba(11, 21, 38, 0.06)" }}>
              <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(11, 21, 38, 0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0B1526, #1A2744)" }}>
                    <Shield className="h-5 w-5" style={{ color: "#C9A227" }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "#0B1526" }}>Roles & Permissions</h3>
                    <p className="text-xs" style={{ color: "#0B1526", opacity: 0.6 }}>Kelola akses dan hak pengguna</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "#0B1526" }}>
                      <th className="text-left px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Role</th>
                      <th className="text-center px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Students</th>
                      <th className="text-center px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Teachers</th>
                      <th className="text-center px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Classes</th>
                      <th className="text-center px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Payments</th>
                      <th className="text-center px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Reports</th>
                      <th className="text-center px-6 py-4 font-semibold text-white text-xs uppercase tracking-wider">Settings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesData.map((role) => (
                      <tr key={role.name} style={{ borderBottom: "1px solid rgba(11, 21, 38, 0.06)" }}>
                        <td className="px-6 py-4">
                          <span className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold", role.color)}>{role.name}</span>
                        </td>
                        {role.permissions.map((perm, idx) => (
                          <td key={idx} className="px-6 py-4 text-center">
                            <span className={cn("px-3 py-1 rounded-lg text-xs font-bold", perm === "All" ? "bg-emerald-100 text-emerald-800" : perm === "View" || perm === "Own" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800")}>
                              {perm}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="mt-6 bg-white rounded-2xl overflow-hidden shadow-lg" style={{ border: "1px solid rgba(11, 21, 38, 0.06)" }}>
              <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(11, 21, 38, 0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0B1526, #1A2744)" }}>
                    <Bell className="h-5 w-5" style={{ color: "#C9A227" }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "#0B1526" }}>Notification Settings</h3>
                    <p className="text-xs" style={{ color: "#0B1526", opacity: 0.6 }}>Atur preferensi notifikasi sistem</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-1">
                {notificationItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-4 px-2 rounded-xl transition-colors duration-150"
                    style={{ borderBottom: idx < notificationItems.length - 1 ? "1px solid rgba(11, 21, 38, 0.06)" : "none" }}
                  >
                    <div>
                      <p className="font-semibold" style={{ color: "#0B1526" }}>{item.label}</p>
                      <p className="text-xs mt-1" style={{ color: "#0B1526", opacity: 0.5 }}>{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                      <div
                        className="w-12 h-6 rounded-full peer transition-all duration-300 peer-focus:ring-2 peer-focus:ring-offset-2"
                        style={{
                          backgroundColor: item.defaultChecked ? "#0B1526" : "#E5E7EB",
                          boxShadow: item.defaultChecked ? "0 2px 8px rgba(11, 21, 38, 0.3)" : "none",
                          borderColor: "rgba(11, 21, 38, 0.1)",
                        }}
                      />
                      <div
                        className="absolute left-1 top-1 bg-white rounded-full h-4 w-4 transition-all duration-300 shadow-sm peer-checked:translate-x-6"
                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                      />
                    </label>
                  </div>
                ))}
                <div className="flex justify-end pt-6">
                  <Button
                    className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, #0B1526, #1A2744)",
                      boxShadow: "0 4px 15px rgba(11, 21, 38, 0.3)",
                    }}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          )}

          {tab === "system" && (
            <div className="mt-6 bg-white rounded-2xl overflow-hidden shadow-lg" style={{ border: "1px solid rgba(11, 21, 38, 0.06)" }}>
              <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(11, 21, 38, 0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0B1526, #1A2744)" }}>
                    <Settings className="h-5 w-5" style={{ color: "#C9A227" }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "#0B1526" }}>System Settings</h3>
                    <p className="text-xs" style={{ color: "#0B1526", opacity: 0.6 }}>Konfigurasi pengaturan sistem</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: "#C9A227" }} />
                    <h4 className="font-bold" style={{ color: "#0B1526" }}>School Information</h4>
                  </div>
                  <div className="space-y-3">
                    {settings.filter((s: Setting) => s.type === "string").map((s: Setting) => (
                      <div
                        key={s.key}
                        className="flex items-center justify-between py-3 px-4 rounded-xl transition-colors duration-150"
                        style={{ backgroundColor: "rgba(11, 21, 38, 0.02)", border: "1px solid rgba(11, 21, 38, 0.04)" }}
                      >
                        <div className="flex-1 mr-4">
                          <span className="text-sm font-semibold" style={{ color: "#0B1526" }}>
                            {s.key.replace(/_/g, " ")}
                          </span>
                          <p className="text-xs mt-0.5" style={{ color: "#0B1526", opacity: 0.5 }}>{s.description}</p>
                        </div>
                        <Input
                          value={s.value || ""}
                          className="max-w-xs h-10 rounded-xl"
                          style={{ borderColor: "rgba(11, 21, 38, 0.1)" }}
                          onChange={(e) => {
                            const newSettings = settings.map((ss: Setting) => ss.key === s.key ? { ...ss, value: e.target.value } : ss);
                            setSettings(newSettings);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: "#C9A227" }} />
                    <h4 className="font-bold" style={{ color: "#0B1526" }}>Configuration</h4>
                  </div>
                  <div className="space-y-3">
                    {settings.filter((s: Setting) => s.type === "integer").map((s: Setting) => (
                      <div
                        key={s.key}
                        className="flex items-center justify-between py-3 px-4 rounded-xl transition-colors duration-150"
                        style={{ backgroundColor: "rgba(11, 21, 38, 0.02)", border: "1px solid rgba(11, 21, 38, 0.04)" }}
                      >
                        <div className="flex-1 mr-4">
                          <span className="text-sm font-semibold" style={{ color: "#0B1526" }}>
                            {s.key.replace(/_/g, " ")}
                          </span>
                          <p className="text-xs mt-0.5" style={{ color: "#0B1526", opacity: 0.5 }}>{s.description}</p>
                        </div>
                        <Input
                          type="number"
                          value={s.value || ""}
                          className="max-w-xs h-10 rounded-xl"
                          style={{ borderColor: "rgba(11, 21, 38, 0.1)" }}
                          onChange={(e) => {
                            const newSettings = settings.map((ss: Setting) => ss.key === s.key ? { ...ss, value: e.target.value } : ss);
                            setSettings(newSettings);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={async () => {
                      const flatSettings: { key: string; value: string }[] = [];
                      settings.forEach((s: Setting) => flatSettings.push({ key: s.key, value: s.value }));
                      await axios.put("/settings", { settings: flatSettings });
                    }}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, #0B1526, #1A2744)",
                      boxShadow: "0 4px 15px rgba(11, 21, 38, 0.3)",
                    }}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: "bg-red-100 text-red-800",
    admin: "bg-purple-100 text-purple-800",
    teacher: "bg-blue-100 text-blue-800",
    student: "bg-green-100 text-green-800",
    parent: "bg-yellow-100 text-yellow-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
}

const rolesData = [
  { name: "Super Admin", color: "bg-red-100 text-red-800", permissions: ["All", "All", "All", "All", "All", "All"] },
  { name: "Admin", color: "bg-purple-100 text-purple-800", permissions: ["All", "All", "All", "All", "All", "None"] },
  { name: "Teacher", color: "bg-blue-100 text-blue-800", permissions: ["View", "None", "View", "None", "View", "None"] },
  { name: "Student", color: "bg-orange-100 text-orange-800", permissions: ["None", "None", "Own", "Own", "None", "None"] },
];

const notificationItems = [
  { label: "Payment Reminders", desc: "Send reminders for upcoming and overdue payments", defaultChecked: true },
  { label: "Attendance Alerts", desc: "Notify parents when student is absent", defaultChecked: true },
  { label: "Schedule Changes", desc: "Notify when class schedule is modified", defaultChecked: true },
  { label: "Loyalty Points", desc: "Notify when points are earned or redeemed", defaultChecked: false },
  { label: "Email Digest", desc: "Receive weekly summary email", defaultChecked: false },
];