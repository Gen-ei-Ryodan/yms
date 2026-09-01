"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, BookOpen, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatDate } from "@/lib/utils";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("/subscriptions", { params: { search, per_page: 50 } });
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    Promise.all([
      axios.get("/students"),
      axios.get("/tuition-products"),
    ]).then(([s, p]) => {
      setStudents(s.data.data);
      setProducts(p.data.data);
    });
  }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/subscriptions/${formData.id}`, formData);
      } else {
        await axios.post("/subscriptions", { ...formData, status: "ACTIVE" });
      }
      setShowForm(false);
      setFormData({});
      fetchSubscriptions();
    } catch (error) {
      console.error("Failed to save subscription:", error);
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
            <h1 className="text-2xl font-bold">Subscriptions</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage student subscriptions</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Subscription
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search subscriptions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">Start Date</th>
                <th className="text-left p-3 font-medium">End Date</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-medium">{s.student?.full_name}</td>
                  <td className="p-3 text-gray-500">{s.product?.name}</td>
                  <td className="p-3">{formatDate(s.start_date)}</td>
                  <td className="p-3">{formatDate(s.end_date)}</td>
                  <td className="p-3">Rp {s.price?.toLocaleString("id-ID")}</td>
                  <td className="p-3"><Badge className={getStatusColor(s.status)}>{s.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedSubscription(s); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(s); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => axios.delete(`/subscriptions/${s.id}`).then(() => fetchSubscriptions())}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Subscription Details">
        {selectedSubscription && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedSubscription.student?.full_name}</h3>
              <p className="text-gray-500">{selectedSubscription.product?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Start Date</p><p className="font-medium">{formatDate(selectedSubscription.start_date)}</p></div>
              <div><p className="text-xs text-gray-500">End Date</p><p className="font-medium">{formatDate(selectedSubscription.end_date)}</p></div>
              <div><p className="text-xs text-gray-500">Price</p><p className="font-medium">Rp {selectedSubscription.price?.toLocaleString("id-ID")}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedSubscription.status}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Subscription" : "Add Subscription"} size="lg">
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
              <label className="block text-sm font-medium mb-1">Product</label>
              <select value={formData.product_id || ""} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="">Select Product</option>
                {products.map((p: any) => <option key={p.id} value={p.id}>{p.name} - Rp {p.price?.toLocaleString("id-ID")}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input type="date" value={formData.start_date || ""} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input type="date" value={formData.end_date || ""} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Auto Renew</label>
              <select value={formData.auto_renew ? "true" : "false"} onChange={(e) => setFormData({ ...formData, auto_renew: e.target.value === "true" })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
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