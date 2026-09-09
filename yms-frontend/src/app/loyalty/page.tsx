"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Star, Award, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ClientDate, ClientNumber } from "@/components/ClientDate";
import { getStatusColor, formatCurrency } from "@/lib/utils";

export default function LoyaltyPage() {
  const [tab, setTab] = useState("balance");
  const [data, setData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const [balanceRes, transRes, tiersRes, rulesRes, rewardsRes] = await Promise.all([
        axios.get("/loyalty/balance"),
        axios.get("/loyalty/transactions"),
        axios.get("/loyalty-tiers"),
        axios.get("/loyalty-rules"),
        axios.get("/rewards"),
      ]);
      setData(balanceRes.data.data);
      setTransactions(transRes.data.data);
      setTiers(tiersRes.data.data);
      setRules(rulesRes.data.data);
      setRewards(rewardsRes.data.data);
    } catch (error) {
      console.error("Failed to fetch loyalty data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEarn = async () => {
    try {
      await axios.post("/loyalty/earn", { event_type: "MANUAL", description: formData.description });
      setShowForm(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error("Failed to earn points:", error);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">Loyalty Program</h1>
          <p className="text-sm text-gray-500  mt-1">Manage points, tiers, and rewards</p>
        </div>

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white  rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Current Points</p>
              <p className="text-2xl font-bold text-yellow-600">{data.current_points}</p>
            </div>
            <div className="bg-white  rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Available Points</p>
              <p className="text-2xl font-bold text-green-600">{data.available_points}</p>
            </div>
            <div className="bg-white  rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Expiring Points</p>
              <p className="text-2xl font-bold text-orange-600">{data.expiring_points}</p>
            </div>
            <div className="bg-white  rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Membership Tier</p>
              <p className="text-2xl font-bold text-purple-600">{data.membership_tier}</p>
            </div>
          </div>
        )}

        <div className="flex gap-0 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {["balance", "transactions", "tiers", "rules", "rewards"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-5 py-2.5 text-sm font-medium rounded-md capitalize transition-all",
                tab === t ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}>
              {t}
            </button>
          ))}
        </div>

        {tab === "balance" && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Current Points</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{data.current_points}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Available Points</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{data.available_points}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Expiring Points</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{data.expiring_points}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Membership Tier</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{data.membership_tier}</p>
            </div>
          </div>
        )}

        {tab === "transactions" && (
          <div className="bg-white  rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Points</th>
                  <th className="text-left p-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t: any) => (
                  <tr key={t.id} className="border-t border-gray-200">
                    <td className="p-3"><ClientDate date={t.created_at} format="date" /></td>
                    <td className="p-3"><Badge className={t.type === "EARN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{t.type}</Badge></td>
                    <td className="p-3 font-medium">{t.type === "EARN" ? "+" : "-"}{t.points}</td>
                    <td className="p-3 text-gray-500">{t.description || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "tiers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier: any) => (
              <div key={tier.id} className="bg-white  rounded-lg border border-gray-200 p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <h3 className="font-bold text-lg">{tier.name}</h3>
                <p className="text-sm text-gray-500">{tier.minimum_points} - {tier.maximum_points} points</p>
                <p className="text-xs text-gray-400 mt-2">{tier.benefits || "No benefits listed"}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "rules" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex justify-end p-4">
              <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" /> Add Rule</Button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Event Type</th>
                  <th className="text-left p-3 font-medium">Points</th>
                  <th className="text-left p-3 font-medium">Conditions</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule: any) => (
                  <tr key={rule.id} className="border-t border-gray-200 hover:bg-gray-100">
                    <td className="p-3 font-medium">{rule.name}</td>
                    <td className="p-3"><Badge className="bg-blue-100 text-blue-800">{rule.event_type}</Badge></td>
                    <td className="p-3 font-medium">{rule.points} pts</td>
                    <td className="p-3 text-gray-500">{rule.conditions ? JSON.stringify(rule.conditions) : "—"}</td>
                    <td className="p-3"><Badge className={getStatusColor(rule.status)}>{rule.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "rewards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((r: any) => (
              <div key={r.id} className="bg-white  rounded-lg border border-gray-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Gift className="h-12 w-12 text-white" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{r.name}</h3>
                  <p className="text-sm text-gray-500">{r.code}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge className="bg-yellow-100 text-yellow-800">{r.points_required} points</Badge>
                    <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Stock: {r.stock}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Add Loyalty Rule" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Type</label>
            <Input value={formData.event_type || ""} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Points</label>
            <Input type="number" value={formData.points || ""} onChange={(e) => setFormData({ ...formData, points: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleEarn}>Save</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}