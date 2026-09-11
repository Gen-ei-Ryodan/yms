"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Edit, Trash2, Calculator, Wallet, Search } from "lucide-react";
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
            <h1 className="text-2xl font-bold text-gray-900">Master Honor Guru</h1>
            <p className="text-sm text-gray-500 mt-1">Konfigurasi metode perhitungan honor guru</p>
          </div>
          <Button onClick={() => { setFormData({ calculation_method: "PER_CLASS", is_active: true, effective_from: new Date().toISOString().split("T")[0] }); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Tambah Aturan
          </Button>
        </div>

        {/* Method Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(METHODS).map(([key, label]) => (
            <div key={key} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
              <p className="text-xs text-gray-400 uppercase">{key.replace("_", " ")}</p>
              <p className="text-sm font-semibold mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Cari guru..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        {/* Rules Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Guru</th>
                <th className="text-left p-3 font-medium">Metode</th>
                <th className="text-left p-3 font-medium">Rate</th>
                <th className="text-left p-3 font-medium">Periode</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Estimasi</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rule) => {
                const calc = calculations[rule.id];
                return (
                  <tr key={rule.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-medium">{rule.teacher?.user?.name}</td>
                    <td className="p-3"><Badge className="bg-blue-100 text-blue-800">{METHODS[rule.calculation_method]}</Badge></td>
                    <td className="p-3">
                      {rule.calculation_method === "PER_CLASS" && formatCurrency(rule.rate_per_class) + "/kelas"}
                      {rule.calculation_method === "PER_STUDENT" && formatCurrency(rule.rate_per_student) + "/siswa"}
                      {rule.calculation_method === "PER_SESSION" && formatCurrency(rule.rate_per_session) + "/pertemuan"}
                      {rule.calculation_method === "FIXED_SALARY" && formatCurrency(rule.fixed_salary) + "/bulan"}
                    </td>
                    <td className="p-3 text-gray-500">{rule.effective_from} {rule.effective_until ? `s/d ${rule.effective_until}` : ''}</td>
                    <td className="p-3">
                      <Badge className={rule.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {rule.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="p-3 font-bold text-green-600">
                      {calc ? formatCurrency(calc.calculation.base_salary) : "–"}
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setFormData(rule); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Belum ada aturan honor</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Aturan Honor" : "Tambah Aturan Honor"} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Guru</label>
            <select value={formData.teacher_id || ""} onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
              <option value="">Pilih Guru</option>
              {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.user?.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Metode Perhitungan</label>
            <select value={formData.calculation_method || "PER_CLASS"} onChange={(e) => setFormData({ ...formData, calculation_method: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
              {Object.entries(METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {formData.calculation_method === "PER_CLASS" && (
            <div>
              <label className="block text-sm font-medium mb-1">Rate per Kelas (Rp)</label>
              <Input type="number" min="0" value={formData.rate_per_class || ""} onChange={(e) => setFormData({ ...formData, rate_per_class: e.target.value })} />
            </div>
          )}
          {formData.calculation_method === "PER_STUDENT" && (
            <div>
              <label className="block text-sm font-medium mb-1">Rate per Siswa (Rp)</label>
              <Input type="number" min="0" value={formData.rate_per_student || ""} onChange={(e) => setFormData({ ...formData, rate_per_student: e.target.value })} />
            </div>
          )}
          {formData.calculation_method === "PER_SESSION" && (
            <div>
              <label className="block text-sm font-medium mb-1">Rate per Pertemuan (Rp)</label>
              <Input type="number" min="0" value={formData.rate_per_session || ""} onChange={(e) => setFormData({ ...formData, rate_per_session: e.target.value })} />
            </div>
          )}
          {formData.calculation_method === "FIXED_SALARY" && (
            <div>
              <label className="block text-sm font-medium mb-1">Gaji Tetap per Bulan (Rp)</label>
              <Input type="number" min="0" value={formData.fixed_salary || ""} onChange={(e) => setFormData({ ...formData, fixed_salary: e.target.value })} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Berlaku Dari</label>
              <Input type="date" value={formData.effective_from || ""} onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Berlaku Sampai</label>
              <Input type="date" value={formData.effective_until || ""} onChange={(e) => setFormData({ ...formData, effective_until: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catatan</label>
            <textarea value={formData.notes || ""} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm" rows={2} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
