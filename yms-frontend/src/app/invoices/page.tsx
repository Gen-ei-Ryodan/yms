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

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Invoices</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage invoices</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Create Invoice
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Invoice #</th>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Issue Date</th>
                <th className="text-left p-3 font-medium">Due Date</th>
                <th className="text-left p-3 font-medium">Total</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-mono text-xs">{inv.invoice_number}</td>
                  <td className="p-3 font-medium">{inv.student?.full_name}</td>
                  <td className="p-3">{formatDate(inv.issue_date)}</td>
                  <td className="p-3">{formatDate(inv.due_date)}</td>
                  <td className="p-3">Rp {inv.total?.toLocaleString("id-ID")}</td>
                  <td className="p-3"><Badge className={getStatusColor(inv.status)}>{inv.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedInvoice(inv); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(inv); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => axios.delete(`/invoices/${inv.id}`).then(() => fetchInvoices())}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Invoice Details">
        {selectedInvoice && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold font-mono">{selectedInvoice.invoice_number}</h3>
              <p className="text-gray-500">{selectedInvoice.student?.full_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Issue Date</p><p className="font-medium">{formatDate(selectedInvoice.issue_date)}</p></div>
              <div><p className="text-xs text-gray-500">Due Date</p><p className="font-medium">{formatDate(selectedInvoice.due_date)}</p></div>
              <div><p className="text-xs text-gray-500">Subtotal</p><p className="font-medium">Rp {selectedInvoice.subtotal?.toLocaleString("id-ID")}</p></div>
              <div><p className="text-xs text-gray-500">Total</p><p className="font-medium">Rp {selectedInvoice.total?.toLocaleString("id-ID")}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedInvoice.status}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Invoice" : "Create Invoice"} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
              <option value="">Select Student</option>
              {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Issue Date</label>
              <Input type="date" value={formData.issue_date || ""} onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input type="date" value={formData.due_date || ""} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subtotal</label>
              <Input type="number" value={formData.subtotal || ""} onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount</label>
              <Input type="number" value={formData.discount || ""} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax</label>
              <Input type="number" value={formData.tax || ""} onChange={(e) => setFormData({ ...formData, tax: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}