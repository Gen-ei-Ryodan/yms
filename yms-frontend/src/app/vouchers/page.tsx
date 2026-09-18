"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import {
  Loader2, Plus, Search, Edit, Trash2, Eye, Ticket, Percent, Banknote,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get("/vouchers", { params: { search, per_page: 50 } });
      setVouchers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
    axios.get("/students").then(r => setStudents(r.data.data));
  }, [search]);

  const totalVouchers = vouchers.length;
  const activeVouchers = vouchers.filter(v => v.status === "ACTIVE").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]"></div>
              <Ticket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data voucher...</p>
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
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Manajemen Voucher</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Voucher Management</h1>
              <p className="text-white/60 text-lg">Kelola seluruh voucher diskon Yamaha Music School</p>
            </div>
            <Button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Buat Voucher
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Total Voucher" value={totalVouchers} icon={Ticket} color="blue" />
          <StatCard title="Voucher Aktif" value={activeVouchers} icon={Percent} color="green" />
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari berdasarkan kode atau nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#0B1526]/5">
            <h2 className="text-lg font-bold text-[#0B1526]">Daftar Voucher</h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">{vouchers.length} voucher terdaftar</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0B1526]/5">
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Kode Voucher</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Siswa</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Diskon</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Valid Dari</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Berlaku Hingga</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Status</th>
                  <th className="text-right p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v) => (
                  <tr key={v.id} className="border-b border-[#0B1526]/5 hover:bg-[#F5F2EB]/30 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#0B1526] text-[#C9A227] font-mono text-xs font-bold tracking-wider shadow-sm">
                        {v.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-sm">
                          <span className="text-xs font-bold text-[#C9A227]">
                            {v.student?.full_name?.charAt(0)}
                          </span>
                        </div>
                        <span className="font-semibold text-[#0B1526]">{v.student?.full_name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={
                        v.discount_type === "PERCENTAGE"
                          ? "bg-[#0B1526]/10 text-[#0B1526] border border-[#0B1526]/20"
                          : "bg-[#C9A227]/10 text-[#8F6F14] border border-[#C9A227]/20"
                      }>
                        {v.discount_type === "PERCENTAGE" ? (
                          <Percent className="h-3 w-3 mr-1 inline" />
                        ) : (
                          <Banknote className="h-3 w-3 mr-1 inline" />
                        )}
                        {v.discount_type === "PERCENTAGE" ? `${v.discount_value}%` : `Rp ${Number(v.discount_value).toLocaleString("id-ID")}`}
                      </Badge>
                    </td>
                    <td className="p-4 text-[#5B6472]">{v.valid_from}</td>
                    <td className="p-4 text-[#5B6472]">{v.valid_until}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(v.status)}>{v.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#0B1526] hover:bg-[#0B1526]/5"
                          onClick={() => { setSelectedVoucher(v); setShowPanel(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
                          onClick={() => { setFormData(v); setShowForm(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C2542E] hover:bg-[#C2542E]/10"
                          onClick={() => axios.delete(`/vouchers/${v.id}`).then(() => fetchVouchers())}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[#0B1526]/5 bg-[#F5F2EB]/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#5B6472]">
                Menampilkan <span className="font-semibold text-[#0B1526]">{vouchers.length}</span> dari <span className="font-semibold text-[#0B1526]">{vouchers.length}</span> voucher
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 border-[#0B1526]/10" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 border-[#0B1526]/10 bg-[#0B1526] text-white hover:bg-[#14233B]">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-9 border-[#0B1526]/10" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Slide Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Voucher" size="lg">
        {selectedVoucher && (
          <div className="space-y-6">
            {/* Voucher Header */}
            <div className="flex items-center gap-4 p-4 bg-[#F5F2EB]/50 rounded-xl">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-lg">
                <Ticket className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526] font-mono tracking-wider">{selectedVoucher.code}</h3>
                <p className="text-[#5B6472]">{selectedVoucher.student?.full_name}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Tipe Diskon</p>
                <p className="font-semibold text-[#0B1526]">{selectedVoucher.discount_type}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Nilai Diskon</p>
                <p className="font-semibold text-[#0B1526]">
                  {selectedVoucher.discount_type === "PERCENTAGE"
                    ? `${selectedVoucher.discount_value}%`
                    : `Rp ${Number(selectedVoucher.discount_value).toLocaleString("id-ID")}`}
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Transaksi Minimum</p>
                <p className="font-semibold text-[#0B1526]">Rp {Number(selectedVoucher.minimum_transaction || 0).toLocaleString("id-ID")}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Status</p>
                <Badge className={getStatusColor(selectedVoucher.status)}>{selectedVoucher.status}</Badge>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Valid Dari</p>
                <p className="font-semibold text-[#0B1526]">{selectedVoucher.valid_from}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Berlaku Hingga</p>
                <p className="font-semibold text-[#0B1526]">{selectedVoucher.valid_until}</p>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Form Slide Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Voucher" : "Buat Voucher"} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Siswa</label>
              <select
                value={formData.student_id || ""}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
              >
                <option value="">Pilih Siswa</option>
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Tipe Diskon</label>
              <select
                value={formData.discount_type || "PERCENTAGE"}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
              >
                <option value="PERCENTAGE">PERSENTASE</option>
                <option value="FIXED">TETAP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Nilai Diskon</label>
              <Input
                type="number"
                value={formData.discount_value || ""}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Transaksi Minimum</label>
              <Input
                type="number"
                value={formData.minimum_transaction || ""}
                onChange={(e) => setFormData({ ...formData, minimum_transaction: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Valid Dari</label>
              <Input
                type="date"
                value={formData.valid_from || ""}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Berlaku Hingga</label>
              <Input
                type="date"
                value={formData.valid_until || ""}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="h-11 border-[#0B1526]/10 hover:bg-[#F5F2EB]"
            >
              Batal
            </Button>
            <Button
              onClick={async () => {
                try {
                  if (formData.id) {
                    await axios.put(`/vouchers/${formData.id}`, formData);
                  } else {
                    await axios.post("/vouchers", formData);
                  }
                  setShowForm(false);
                  setFormData({});
                  fetchVouchers();
                } catch (error) {
                  console.error("Failed to save voucher:", error);
                }
              }}
              className="h-11 bg-[#0B1526] hover:bg-[#14233B] text-white shadow-lg shadow-[#0B1526]/20"
            >
              {formData.id ? "Simpan Perubahan" : "Buat Voucher"}
            </Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
