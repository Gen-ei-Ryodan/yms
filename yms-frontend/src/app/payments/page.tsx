"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, DollarSign, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/utils";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("/payments", { params: { search, per_page: 50 } });
      setPayments(response.data.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    axios.get("/students").then(r => setStudents(r.data.data));
  }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/payments/${formData.id}`, formData);
      } else {
        await axios.post("/payments", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchPayments();
    } catch (error) {
      console.error("Failed to save payment:", error);
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
            <h1 className="text-2xl font-bold">Payment Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage payments and receipts</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Record Payment
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Payment #</th>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Amount</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Method</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-mono text-xs">{p.payment_number}</td>
                  <td className="p-3 font-medium">{p.student?.full_name}</td>
                  <td className="p-3 font-medium">{formatCurrency(p.amount)}</td>
                  <td className="p-3">{formatDate(p.payment_date)}</td>
                  <td className="p-3">{p.payment_method}</td>
                  <td className="p-3"><Badge className={getStatusColor(p.status)}>{p.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedPayment(p); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(p); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => axios.delete(`/payments/${p.id}`).then(() => fetchPayments())}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Payment Details">
        {selectedPayment && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold font-mono">{selectedPayment.payment_number}</h3>
              <p className="text-gray-500">{selectedPayment.student?.full_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Amount</p><p className="font-medium">{formatCurrency(selectedPayment.amount)}</p></div>
              <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{formatDate(selectedPayment.payment_date)}</p></div>
              <div><p className="text-xs text-gray-500">Method</p><p className="font-medium">{selectedPayment.payment_method}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedPayment.status}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Payment" : "Record Payment"} size="lg">
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
              <label className="block text-sm font-medium mb-1">Amount</label>
              <Input type="number" value={formData.amount || ""} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select value={formData.payment_method || "CASH"} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="CASH">CASH</option>
                <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                <option value="CREDIT_CARD">CREDIT_CARD</option>
                <option value="DEBIT_CARD">DEBIT_CARD</option>
                <option value="EWALLET">EWALLET</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Date</label>
              <Input type="date" value={formData.payment_date || ""} onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reference</label>
            <Input value={formData.reference || ""} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} />
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