"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatDate } from "@/lib/utils";
import { ClientNumber } from "@/components/ClientDate";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);

  const selectClass = "w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30";
  const inputClass = "h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30 text-sm";

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("/invoices", { params: { search, per_page: 50 } });
      setInvoices(response.data.data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    axios.get("/students").then(r => setStudents(r.data.data));
  }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/invoices/${formData.id}`, formData);
      } else {
        await axios.post("/invoices", { ...formData, status: "DRAFT" });
      }
      setShowForm(false);
      setFormData({});
      fetchInvoices();
    } catch (error) {
      console.error("Failed to save invoice:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus invoice ini?")) {
      await axios.delete(`/invoices/${id}`);
      fetchInvoices();
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data invoice...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Invoice</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Invoices</h1>
              <p className="text-white/60 text-lg">Kelola invoice pembayaran</p>
            </div>
            <button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold rounded-xl transition-all shadow-lg shadow-[#C9A227]/25"
            >
              <Plus className="h-4 w-4" /> Buat Invoice
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Invoice", value: invoices.length, icon: FileText, color: "bg-blue-500" },
            { label: "Paid", value: invoices.filter(i => i.status === "PAID").length, icon: Eye, color: "bg-emerald-500" },
            { label: "Unpaid", value: invoices.filter(i => i.status !== "PAID").length, icon: FileText, color: "bg-amber-500" },
          ].map((stat) => (
            <div key={stat.label} className="relative overflow-hidden rounded-2xl bg-white border border-[#0B1526]/5 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0B1526]">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Invoice #</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Issue Date</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Due Date</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Total</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={inv.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4 font-mono text-xs text-[#5B6472]">{inv.invoice_number}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{inv.student?.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5B6472]">{formatDate(inv.issue_date)}</td>
                  <td className="p-4 text-[#5B6472]">{formatDate(inv.due_date)}</td>
                  <td className="p-4 font-medium text-[#0B1526]"><ClientNumber value={inv.total} prefix="Rp " /></td>
                  <td className="p-4"><Badge className={`${getStatusColor(inv.status)} font-medium`}>{inv.status}</Badge></td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedInvoice(inv); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => { setFormData(inv); setShowForm(true); }} className="p-2 rounded-lg hover:bg-blue-50 text-[#8A93A3] hover:text-blue-600 transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(inv.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Invoice">
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <FileText className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono text-[#0B1526]">{selectedInvoice.invoice_number}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedInvoice.student?.full_name}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Issue Date</p>
                  <p className="font-semibold text-[#0B1526]">{formatDate(selectedInvoice.issue_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Due Date</p>
                  <p className="font-semibold text-[#0B1526]">{formatDate(selectedInvoice.due_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Subtotal</p>
                  <p className="font-semibold text-[#0B1526]"><ClientNumber value={selectedInvoice.subtotal} prefix="Rp " /></p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Total</p>
                  <p className="font-bold text-[#0B1526]"><ClientNumber value={selectedInvoice.total} prefix="Rp " /></p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedInvoice.status)} font-medium`}>{selectedInvoice.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Form Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Invoice" : "Buat Invoice"} size="lg">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Siswa</label>
            <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className={selectClass}>
              <option value="">Pilih Siswa</option>
              {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Issue Date</label>
              <Input type="date" value={formData.issue_date || ""} onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Due Date</label>
              <Input type="date" value={formData.due_date || ""} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Subtotal</label>
              <Input type="number" value={formData.subtotal || ""} onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Diskon</label>
              <Input type="number" value={formData.discount || ""} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Pajak</label>
              <Input type="number" value={formData.tax || ""} onChange={(e) => setFormData({ ...formData, tax: e.target.value })} className={inputClass} />
            </div>
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
