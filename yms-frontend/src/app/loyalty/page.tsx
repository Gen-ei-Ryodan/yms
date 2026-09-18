"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import { StatCard } from "@/components/StatCard";
import axios from "axios";
import { Plus, Star, Award, Gift, ArrowUpRight, ArrowDownRight, Clock, Trophy, Shield, Zap, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientDate, ClientNumber } from "@/components/ClientDate";
import { cn } from "@/lib/utils";

interface LoyaltyBalance {
  current_points: number;
  available_points: number;
  expiring_points: number;
  membership_tier: string;
}

interface LoyaltyTransaction {
  id: number;
  type: string;
  points: number;
  description: string;
  created_at: string;
}

interface LoyaltyTier {
  id: number;
  name: string;
  minimum_points: number;
  maximum_points: number;
  benefits: string;
}

interface LoyaltyRule {
  id: number;
  name: string;
  event_type: string;
  points: number;
  conditions: any;
  status: string;
}

interface LoyaltyReward {
  id: number;
  name: string;
  code: string;
  points_required: number;
  stock: number;
  status: string;
}

export default function LoyaltyPage() {
  const [tab, setTab] = useState("balance");
  const [data, setData] = useState<LoyaltyBalance | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [rules, setRules] = useState<LoyaltyRule[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
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
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
              <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Loading loyalty data...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Please wait a moment</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const tabs = [
    { key: "balance", label: "Balance", icon: Star },
    { key: "transactions", label: "Transactions", icon: ArrowUpRight },
    { key: "tiers", label: "Tiers", icon: Trophy },
    { key: "rules", label: "Rules", icon: Shield },
    { key: "rewards", label: "Rewards", icon: Gift },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Program Loyalty</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Loyalty Program</h1>
            <p className="text-white/60 text-lg">Manage points, tiers, and rewards</p>
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Current Points"
              value={data.current_points}
              icon={Star}
              color="yellow"
            />
            <StatCard
              title="Available Points"
              value={data.available_points}
              icon={Zap}
              color="green"
            />
            <StatCard
              title="Expiring Points"
              value={data.expiring_points}
              icon={Clock}
              color="orange"
            />
            <StatCard
              title="Membership Tier"
              value={data.membership_tier}
              icon={Award}
              color="purple"
            />
          </div>
        )}

        <div className="flex gap-0 bg-white border border-[#0B1526]/5 rounded-xl p-1 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                tab === t.key
                  ? "bg-gradient-to-r from-[#0B1526] to-[#14233B] text-white shadow-md shadow-[#0B1526]/20"
                  : "text-[#5B6472] hover:text-[#0B1526] hover:bg-[#F5F2EB]"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "balance" && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#C9A227] to-[#8F6F14] rounded-2xl p-6 text-white shadow-lg shadow-[#C9A227]/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Star className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-white/80">Current Points</p>
                </div>
                <p className="text-3xl font-bold"><ClientNumber value={data.current_points} /></p>
              </div>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#2E7D5B] to-[#1A5C3E] rounded-2xl p-6 text-white shadow-lg shadow-[#2E7D5B]/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-white/80">Available Points</p>
                </div>
                <p className="text-3xl font-bold"><ClientNumber value={data.available_points} /></p>
              </div>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#C2542E] to-[#A03D1F] rounded-2xl p-6 text-white shadow-lg shadow-[#C2542E]/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Clock className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-white/80">Expiring Points</p>
                </div>
                <p className="text-3xl font-bold"><ClientNumber value={data.expiring_points} /></p>
              </div>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#4A1D96] to-[#351570] rounded-2xl p-6 text-white shadow-lg shadow-[#4A1D96]/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Award className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-white/80">Membership Tier</p>
                </div>
                <p className="text-3xl font-bold">{data.membership_tier}</p>
              </div>
            </div>
          </div>
        )}

        {tab === "transactions" && (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#0B1526]/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#0B1526] rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="h-5 w-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1526]">Transaction History</h2>
                    <p className="text-sm text-[#8A93A3]">{transactions.length} transactions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#0B1526]/5">
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Date</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Type</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Points</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-[#0B1526]/5 last:border-b-0 hover:bg-[#F5F2EB]/50 transition-colors">
                      <td className="p-4">
                        <ClientDate date={t.created_at} format="date" />
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                          t.type === "EARN"
                            ? "bg-[#2E7D5B]/10 text-[#2E7D5B]"
                            : "bg-[#C2542E]/10 text-[#C2542E]"
                        )}>
                          {t.type === "EARN" ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {t.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "font-bold",
                          t.type === "EARN" ? "text-[#2E7D5B]" : "text-[#C2542E]"
                        )}>
                          {t.type === "EARN" ? "+" : "-"}{t.points}
                        </span>
                      </td>
                      <td className="p-4 text-[#5B6472]">{t.description || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "tiers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div key={tier.id} className="relative overflow-hidden bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="h-2 bg-gradient-to-r from-[#C9A227] to-[#8F6F14]" />
                <div className="p-6 text-center">
                  <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-[#C9A227] to-[#8F6F14] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C9A227]/20 group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-[#0B1526]">{tier.name}</h3>
                  <p className="text-sm text-[#5B6472] mt-1">
                    <ClientNumber value={tier.minimum_points} /> - <ClientNumber value={tier.maximum_points} /> points
                  </p>
                  <p className="text-xs text-[#8A93A3] mt-3 leading-relaxed">{tier.benefits || "No benefits listed"}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "rules" && (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#0B1526]/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#0B1526] rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0B1526]">Loyalty Rules</h2>
                    <p className="text-sm text-[#8A93A3]">{rules.length} rules configured</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-[#0B1526] to-[#14233B] hover:from-[#14233B] hover:to-[#0B1526] text-white shadow-md shadow-[#0B1526]/20"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Rule
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#0B1526]/5">
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Name</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Event Type</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Points</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Conditions</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => (
                    <tr key={rule.id} className="border-b border-[#0B1526]/5 last:border-b-0 hover:bg-[#F5F2EB]/50 transition-colors">
                      <td className="p-4 font-medium text-[#0B1526]">{rule.name}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0B1526]/5 text-[#0B1526]">
                          {rule.event_type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#C9A227]">{rule.points} pts</span>
                      </td>
                      <td className="p-4 text-[#5B6472]">
                        {rule.conditions ? JSON.stringify(rule.conditions) : "—"}
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                          rule.status === "ACTIVE"
                            ? "bg-[#2E7D5B]/10 text-[#2E7D5B]"
                            : rule.status === "INACTIVE"
                            ? "bg-[#8A93A3]/10 text-[#8A93A3]"
                            : "bg-[#C2542E]/10 text-[#C2542E]"
                        )}>
                          {rule.status === "ACTIVE" ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : rule.status === "INACTIVE" ? (
                            <XCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {rule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "rewards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((r) => (
              <div key={r.id} className="relative overflow-hidden bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="h-32 bg-gradient-to-br from-[#C9A227] via-[#D4AF37] to-[#8F6F14] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full blur-lg translate-y-1/2 -translate-x-1/4" />
                  <Gift className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-[#0B1526]">{r.name}</h3>
                  <p className="text-sm text-[#8A93A3] font-mono mt-0.5">{r.code}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#C9A227]/10 text-[#C9A227]">
                      <Star className="h-3 w-3" />
                      <ClientNumber value={r.points_required} /> pts
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                      r.status === "ACTIVE"
                        ? "bg-[#2E7D5B]/10 text-[#2E7D5B]"
                        : r.status === "INACTIVE"
                        ? "bg-[#8A93A3]/10 text-[#8A93A3]"
                        : "bg-[#C2542E]/10 text-[#C2542E]"
                    )}>
                      {r.status === "ACTIVE" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#0B1526]/5">
                    <p className="text-xs text-[#5B6472]">Stock: <span className="font-bold text-[#0B1526]">{r.stock}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Add Loyalty Rule" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Event Type</label>
            <Input
              value={formData.event_type || ""}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              className="border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Points</label>
            <Input
              type="number"
              value={formData.points || ""}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              className="border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Description</label>
            <Input
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/20"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="border-[#0B1526]/10 hover:bg-[#F5F2EB]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEarn}
              className="bg-gradient-to-r from-[#0B1526] to-[#14233B] hover:from-[#14233B] hover:to-[#0B1526] text-white shadow-md shadow-[#0B1526]/20"
            >
              Save
            </Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
