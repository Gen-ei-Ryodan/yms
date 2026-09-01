"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Ticket, Percent, Banknote } from "lucide-react";
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
            <h1 className="text-2xl font-bold">Vouchers</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage voucher codes</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Create Voucher
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search vouchers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Discount</th>
                <th className="text-left p-3 font-medium">Valid From</th>
                <th className="text-left p-3 font-medium">Valid Until</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-mono text-xs">{v.code}</td>
                  <td className="p-3 font-medium">{v.student?.full_name}</td>
                  <td className="p-3">
                    {v.discount_type === "PERCENTAGE" ? <Percent className="inline h-3 w-3" /> : <Banknote className="inline h-3 w-3" />}
                    {v.discount_value}
                  </td>
                  <td className="p-3">{v.valid_from}</td>
                  <td className="p-3">{v.valid_until}</td>
                  <td className="p-3"><Badge className={getStatusColor(v.status)}>{v.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedVoucher(v); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(v); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => axios.delete(`/vouchers/${v.id}`).then(() => fetchVouchers())}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Voucher Details">
        {selectedVoucher && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold font-mono">{selectedVoucher.code}</h3>
              <p className="text-gray-500">{selectedVoucher.student?.full_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Discount Type</p><p className="font-medium">{selectedVoucher.discount_type}</p></div>
              <div><p className="text-xs text-gray-500">Discount Value</p><p className="font-medium">{selectedVoucher.discount_value}</p></div>
              <div><p className="text-xs text-gray-500">Minimum Transaction</p><p className="font-medium">{selectedVoucher.minimum_transaction}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedVoucher.status}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Voucher" : "Create Voucher"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Student</option>
                {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select value={formData.discount_type || "PERCENTAGE"} onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="PERCENTAGE">PERCENTAGE</option>
                <option value="FIXED">FIXED</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount Value</label>
              <Input type="number" value={formData.discount_value || ""} onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Transaction</label>
              <Input type="number" value={formData.minimum_transaction || ""} onChange={(e) => setFormData({ ...formData, minimum_transaction: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Valid From</label>
              <Input type="date" value={formData.valid_from || ""} onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valid Until</label>
              <Input type="date" value={formData.valid_until || ""} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={async () => {
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
            }}>Save</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}