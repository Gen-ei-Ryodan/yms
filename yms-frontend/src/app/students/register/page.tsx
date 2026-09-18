"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, UserPlus, CheckCircle, User, Phone, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StudentForm {
  full_name: string;
  nickname: string;
  gender: string;
  date_of_birth: string;
  place_of_birth: string;
  phone: string;
  email: string;
  address: string;
  school_name: string;
  school_grade: string;
  join_date: string;
}

const defaultForm: StudentForm = {
  full_name: "",
  nickname: "",
  gender: "MALE",
  date_of_birth: "",
  place_of_birth: "",
  phone: "",
  email: "",
  address: "",
  school_name: "",
  school_grade: "",
  join_date: new Date().toISOString().split("T")[0],
};

export default function StudentRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<StudentForm>(defaultForm);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("/students", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setForm(defaultForm);
    } catch (error) {
      console.error("Failed to register student:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30 text-sm";
  const selectClass = "w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30";
  const textareaClass = "w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 resize-none";
  const labelClass = "block text-sm font-semibold text-[#0B1526] mb-2";

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
              <UserPlus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Mendaftarkan siswa...</p>
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
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Pendaftaran Siswa</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Student Registration</h1>
            <p className="text-white/60 text-lg">Daftarkan siswa baru ke Yamaha Music School</p>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-green-800 text-sm font-semibold">Berhasil!</p>
              <p className="text-green-700 text-xs mt-0.5">Siswa berhasil didaftarkan ke sistem</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#0B1526]/5">
            <h2 className="text-lg font-bold text-[#0B1526]">Formulir Pendaftaran</h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">Lengkapi data siswa dengan benar</p>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center">
                  <User className="h-4 w-4 text-[#C9A227]" />
                </div>
                <h3 className="text-sm font-bold text-[#0B1526] uppercase tracking-wide">Data Pribadi</h3>
                <div className="flex-1 h-px bg-[#0B1526]/10 ml-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Nama Lengkap <span className="text-[#C2542E]">*</span></label>
                  <Input
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className={inputClass}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className={labelClass}>Nama Panggilan</label>
                  <Input
                    value={form.nickname}
                    onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                    className={inputClass}
                    placeholder="Masukkan nama panggilan"
                  />
                </div>
                <div>
                  <label className={labelClass}>Jenis Kelamin</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className={selectClass}
                  >
                    <option value="MALE">Laki-laki</option>
                    <option value="FEMALE">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tanggal Lahir</label>
                  <Input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tempat Lahir</label>
                  <Input
                    value={form.place_of_birth}
                    onChange={(e) => setForm({ ...form, place_of_birth: e.target.value })}
                    className={inputClass}
                    placeholder="Masukkan tempat lahir"
                  />
                </div>
                <div>
                  <label className={labelClass}>Tanggal Masuk</label>
                  <Input
                    type="date"
                    value={form.join_date}
                    onChange={(e) => setForm({ ...form, join_date: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center">
                  <Phone className="h-4 w-4 text-[#C9A227]" />
                </div>
                <h3 className="text-sm font-bold text-[#0B1526] uppercase tracking-wide">Kontak</h3>
                <div className="flex-1 h-px bg-[#0B1526]/10 ml-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>No. HP</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="Masukkan nomor HP"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder="Masukkan alamat email"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Alamat</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={textareaClass}
                    rows={3}
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center">
                  <School className="h-4 w-4 text-[#C9A227]" />
                </div>
                <h3 className="text-sm font-bold text-[#0B1526] uppercase tracking-wide">Sekolah</h3>
                <div className="flex-1 h-px bg-[#0B1526]/10 ml-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Sekolah</label>
                  <Input
                    value={form.school_name}
                    onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                    className={inputClass}
                    placeholder="Masukkan nama sekolah"
                  />
                </div>
                <div>
                  <label className={labelClass}>Kelas Sekolah</label>
                  <Input
                    value={form.school_grade}
                    onChange={(e) => setForm({ ...form, school_grade: e.target.value })}
                    className={inputClass}
                    placeholder="Masukkan kelas sekolah"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#0B1526]/5">
              <Button
                onClick={handleSubmit}
                disabled={loading || !form.full_name}
                className="h-11 px-8 bg-gradient-to-r from-[#0B1526] to-[#14233B] hover:from-[#14233B] hover:to-[#0B1526] text-white font-semibold shadow-lg shadow-[#0B1526]/20 rounded-xl transition-all duration-300"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Daftarkan Siswa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
