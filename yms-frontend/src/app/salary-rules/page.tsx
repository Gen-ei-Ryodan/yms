"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Edit, Trash2, Calculator, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusColor } from "@/lib/utils";

const METHODS: Record<string, string> = {
  PER_CLASS: "Per Kelas",
  PER_STUDENT: "Per Siswa",
  PER_SESSION: "Per Pertemuan",
  FIXED_SALARY: "Gaji Tetap",
};

export default function SalaryRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [calculations, setCalculations] = useState<Record<number, any>>({});
  const [search, setSearch] = useState("");

  const selectClass = "w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30";
  const inputClass = "h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30 text-sm";

  const fetchData = async () => {
    try {
      const [rulesRes, teachersRes] = await Promise.all([
        axios.get("/salary-rules", { params: { per_page: 50 } }),
        axios.get("/teachers", { params: { per_page: 50 } }),
      ]);
      setRules(rulesRes.data.data);
      setTeachers(teachersRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const calculateAll = async () => {
    const results: Record<number, any> = {};
    for (const rule of rules) {
      try {
        const res = await axios.post("/salary-rules/calculate", { teacher_id: rule.teacher_id });
        results[rule.id] = res.data.data;
      } catch { }
    }
    setCalculations(results);
  };

  useEffect(() => { if (rules.length > 0) calculateAll(); }, [rules]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/salary-rules/${formData.id}`, formData);
      } else {
        await axios.post("/salary-rules", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error("Failed to save rule:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus aturan honor ini?")) {
      await axios.delete(`/salary-rules/${id}`);
      fetchData();
    }
  };

  const filtered = rules.filter(r =>
    !search || r.teacher?.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data aturan honor...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Master Honor</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Master Honor Guru</h1>
              <p className="text-white/60 text-lg">Konfigurasi metode perhitungan honor guru</p>
            </div>
            <button
              onClick={() => { setFormData({ calculation_method: "PER_CLASS", is_active: true, effective_from: new Date().toISOString().split("T")[0] }); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold rounded-xl transition-all shadow-lg shadow-[#C9A227]/25"
            >
              <Plus className="h-4 w-4" /> Tambah Aturan
            </button>
          </div>
        </div>

        {/* Method Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(METHODS).map(([key, label]) => (
            <div key={key} className="bg-white rounded-2xl border border-[#0B1526]/5 p-4 text-center shadow-sm">
              <p className="text-xs text-[#8A93A3] uppercase font-semibold">{key.replace("_", " ")}</p>
              <p className="text-sm font-bold text-[#0B1526] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari guru..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        {/* Rules Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Guru</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Metode</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Rate</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Periode</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Estimasi</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rule, i) => {
                const calc = calculations[rule.id];
                return (
                  <tr key={rule.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                    <td className="p-4 font-semibold text-[#0B1526]">{rule.teacher?.user?.name}</td>
                    <td className="p-4"><Badge className="bg-blue-100 text-blue-800 font-medium">{METHODS[rule.calculation_method]}</Badge></td>
                    <td className="p-4 text-[#5B6472]">
                      {rule.calculation_method === "PER_CLASS" && formatCurrency(rule.rate_per_class) + "/kelas"}
                      {rule.calculation_method === "PER_STUDENT" && formatCurrency(rule.rate_per_student) + "/siswa"}
                      {rule.calculation_method === "PER_SESSION" && formatCurrency(rule.rate_per_session) + "/pertemuan"}
                      {rule.calculation_method === "FIXED_SALARY" && formatCurrency(rule.fixed_salary) + "/bulan"}
                    </td>
                    <td className="p-4 text-[#8A93A3] text-xs">{rule.effective_from} {rule.effective_until ? `s/d ${rule.effective_until}` : ''}</td>
                    <td className="p-4">
                      <Badge className={rule.is_active ? "bg-emerald-100 text-emerald-800 font-medium" : "bg-[#F5F2EB] text-[#5B6472] font-medium"}>
                        {rule.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-emerald-600">
                      {calc ? formatCurrency(calc.calculation.base_salary) : "–"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setFormData(rule); setShowForm(true); }} className="p-2 rounded-lg hover:bg-blue-50 text-[#8A93A3] hover:text-blue-600 transition-colors"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(rule.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-12 text-center"><div className="flex flex-col items-center gap-3"><div className="h-12 w-12 rounded-2xl bg-[#F5F2EB] flex items-center justify-center"><Calculator className="h-6 w-6 text-[#8A93A3]" /></div><p className="text-[#8A93A3] font-medium">Belum ada aturan honor</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Aturan Honor" : "Tambah Aturan Honor"} size="md">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Guru</label>
            <select value={formData.teacher_id || ""} onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })} className={selectClass}>
              <option value="">Pilih Guru</option>
              {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.user?.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Metode Perhitungan</label>
            <select value={formData.calculation_method || "PER_CLASS"} onChange={(e) => setFormData({ ...formData, calculation_method: e.target.value })} className={selectClass}>
              {Object.entries(METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {formData.calculation_method === "PER_CLASS" && (
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Rate per Kelas (Rp)</label>
              <Input type="number" min="0" value={formData.rate_per_class || ""} onChange={(e) => setFormData({ ...formData, rate_per_class: e.target.value })} className={inputClass} />
            </div>
          )}
          {formData.calculation_method === "PER_STUDENT" && (
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Rate per Siswa (Rp)</label>
              <Input type="number" min="0" value={formData.rate_per_student || ""} onChange={(e) => setFormData({ ...formData, rate_per_student: e.target.value })} className={inputClass} />
            </div>
          )}
          {formData.calculation_method === "PER_SESSION" && (
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Rate per Pertemuan (Rp)</label>
              <Input type="number" min="0" value={formData.rate_per_session || ""} onChange={(e) => setFormData({ ...formData, rate_per_session: e.target.value })} className={inputClass} />
            </div>
          )}
          {formData.calculation_method === "FIXED_SALARY" && (
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Gaji Tetap per Bulan (Rp)</label>
              <Input type="number" min="0" value={formData.fixed_salary || ""} onChange={(e) => setFormData({ ...formData, fixed_salary: e.target.value })} className={inputClass} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Berlaku Dari</label>
              <Input type="date" value={formData.effective_from || ""} onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Berlaku Sampai</label>
              <Input type="date" value={formData.effective_until || ""} onChange={(e) => setFormData({ ...formData, effective_until: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Catatan</label>
            <textarea value={formData.notes || ""} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 resize-none" rows={2} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-[#0B1526]/10 text-[#5B6472] hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={handleSave} className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/25">Simpan</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
