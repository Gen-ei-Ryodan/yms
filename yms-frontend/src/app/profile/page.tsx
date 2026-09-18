"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Save, User, Mail, Phone, Image, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/profile", formData);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat profil...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Gradient Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Profil</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Profil Saya</h1>
            <p className="text-white/60 text-lg">Kelola informasi profil Anda</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm">
          <div className="flex items-center gap-5 mb-8">
            <div className="h-20 w-20 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg shadow-[#0B1526]/20">
              <span className="text-3xl font-bold text-[#C9A227]">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0B1526]">{user?.name}</h3>
              <p className="text-[#8A93A3] capitalize">{user?.role?.replace("_", " ")}</p>
              {user?.student && <p className="text-sm text-[#5B6472] mt-0.5">{user.student.student_code}</p>}
              {user?.teacher && <p className="text-sm text-[#5B6472] mt-0.5">{user.teacher.teacher_code}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Nama</label>
              <Input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Email</label>
              <Input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#0B1526]">Telepon</label>
              <Input value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={saving} className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-[#0B1526] font-semibold rounded-xl px-6">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
