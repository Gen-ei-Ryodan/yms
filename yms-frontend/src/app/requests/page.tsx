"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Eye, CheckCircle, XCircle, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function RequestsPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("transfers");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const [tRes, lRes] = await Promise.all([
        axios.get("/transfers", { params: { per_page: 50 } }),
        axios.get("/leaves", { params: { per_page: 50 } }),
      ]);
      setTransfers(tRes.data.data);
      setLeaves(lRes.data.data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancelTransfer = async (id: number) => {
    await axios.put(`/transfers/${id}/cancel`, {});
    fetchData();
  };

  const handleCancelLeave = async (id: number) => {
    await axios.put(`/leaves/${id}/cancel`, {});
    fetchData();
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
        <div>
          <h1 className="text-2xl font-bold">Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your requests</p>
        </div>

        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
          <button onClick={() => setTab("transfers")}
            className={cn("px-4 py-2 text-sm font-medium border-b-2 -mb-px",
              tab === "transfers" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            )}>
            Class Transfer ({transfers.filter(t => t.status === "PENDING").length})
          </button>
          <button onClick={() => setTab("leaves")}
            className={cn("px-4 py-2 text-sm font-medium border-b-2 -mb-px",
              tab === "leaves" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            )}>
            Leave / Cuti ({leaves.filter(l => l.status === "PENDING").length})
          </button>
        </div>

        {tab === "transfers" && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-left p-3 font-medium">From</th>
                  <th className="text-left p-3 font-medium">To</th>
                  <th className="text-left p-3 font-medium">Reason</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t) => (
                  <tr key={t.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-medium">{t.student?.full_name}</td>
                    <td className="p-3 text-gray-500">{t.fromClass?.course?.name}</td>
                    <td className="p-3 text-gray-500">{t.toClass?.course?.name}</td>
                    <td className="p-3 text-gray-500 max-w-xs truncate">{t.reason}</td>
                    <td className="p-3"><Badge className={getStatusColor(t.status)}>{t.status}</Badge></td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(t); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                      {t.status === "PENDING" && (
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleCancelTransfer(t.id)}><XCircle className="h-4 w-4" /></Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "leaves" && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-left p-3 font-medium">Start Date</th>
                  <th className="text-left p-3 font-medium">End Date</th>
                  <th className="text-left p-3 font-medium">Reason</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-medium">{l.student?.full_name}</td>
                    <td className="p-3">{l.start_date}</td>
                    <td className="p-3">{l.end_date}</td>
                    <td className="p-3 text-gray-500 max-w-xs truncate">{l.reason}</td>
                    <td className="p-3"><Badge className={getStatusColor(l.status)}>{l.status}</Badge></td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(l); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                      {l.status === "PENDING" && (
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleCancelLeave(l.id)}><XCircle className="h-4 w-4" /></Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Request Details">
        {selectedItem && (
          <div className="space-y-4">
            {tab === "transfers" ? (
              <>
                <div>
                  <h3 className="text-xl font-bold">{selectedItem.student?.full_name}</h3>
                  <p className="text-gray-500">{selectedItem.student?.student_code}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">From Class</p><p className="font-medium">{selectedItem.fromClass?.course?.name} - {selectedItem.fromClass?.level?.name}</p></div>
                  <div><p className="text-xs text-gray-500">To Class</p><p className="font-medium">{selectedItem.toClass?.course?.name} - {selectedItem.toClass?.level?.name}</p></div>
                  <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedItem.status}</p></div>
                  <div><p className="text-xs text-gray-500">Requested</p><p className="font-medium">{new Date(selectedItem.requested_at).toLocaleString("id-ID")}</p></div>
                </div>
                <div><p className="text-xs text-gray-500">Reason</p><p className="font-medium">{selectedItem.reason}</p></div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-xl font-bold">{selectedItem.student?.full_name}</h3>
                  <p className="text-gray-500">{selectedItem.student?.student_code}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Start Date</p><p className="font-medium">{selectedItem.start_date}</p></div>
                  <div><p className="text-xs text-gray-500">End Date</p><p className="font-medium">{selectedItem.end_date}</p></div>
                  <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedItem.status}</p></div>
                </div>
                <div><p className="text-xs text-gray-500">Reason</p><p className="font-medium">{selectedItem.reason}</p></div>
              </>
            )}
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}