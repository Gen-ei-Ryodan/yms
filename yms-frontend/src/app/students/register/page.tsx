"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StudentRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({
    full_name: "", nickname: "", gender: "MALE", date_of_birth: "",
    place_of_birth: "", phone: "", email: "", address: "",
    school_name: "", school_grade: "", join_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("/students", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setForm({ full_name: "", nickname: "", gender: "MALE", date_of_birth: "", place_of_birth: "", phone: "", email: "", address: "", school_name: "", school_grade: "", join_date: new Date().toISOString().split("T")[0] });
    } catch (error) {
      console.error("Failed to register student:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Siswa Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Register a new student</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 text-sm font-medium">Siswa berhasil didaftarkan!</p>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nama Panggilan</label>
              <Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
                <option value="MALE">Laki-laki</option>
                <option value="FEMALE">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
              <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tempat Lahir</label>
              <Input value={form.place_of_birth} onChange={(e) => setForm({ ...form, place_of_birth: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. HP</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Masuk</label>
              <Input type="date" value={form.join_date} onChange={(e) => setForm({ ...form, join_date: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Alamat</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sekolah</label>
              <Input value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kelas Sekolah</label>
              <Input value={form.school_grade} onChange={(e) => setForm({ ...form, school_grade: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-6">
            <Button onClick={handleSubmit} disabled={loading || !form.full_name}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Daftarkan Siswa
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
