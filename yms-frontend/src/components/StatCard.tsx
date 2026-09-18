import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "orange";
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const colorStyles: Record<string, {
  bg: string;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  gradient: string;
}> = {
  blue: {
    bg: "bg-gradient-to-br from-[#0B1526]/5 to-[#0B1526]/10",
    iconBg: "bg-[#0B1526]",
    iconColor: "text-[#C9A227]",
    valueColor: "text-[#0B1526]",
    gradient: "from-[#0B1526] to-[#14233B]",
  },
  green: {
    bg: "bg-gradient-to-br from-[#2E7D5B]/5 to-[#2E7D5B]/10",
    iconBg: "bg-[#2E7D5B]",
    iconColor: "text-white",
    valueColor: "text-[#2E7D5B]",
    gradient: "from-[#2E7D5B] to-[#1A5C3E]",
  },
  red: {
    bg: "bg-gradient-to-br from-[#C2542E]/5 to-[#C2542E]/10",
    iconBg: "bg-[#C2542E]",
    iconColor: "text-white",
    valueColor: "text-[#C2542E]",
    gradient: "from-[#C2542E] to-[#A03D1F]",
  },
  yellow: {
    bg: "bg-gradient-to-br from-[#C9A227]/5 to-[#C9A227]/10",
    iconBg: "bg-[#C9A227]",
    iconColor: "text-[#0B1526]",
    valueColor: "text-[#C9A227]",
    gradient: "from-[#C9A227] to-[#8F6F14]",
  },
  purple: {
    bg: "bg-gradient-to-br from-[#4A1D96]/5 to-[#4A1D96]/10",
    iconBg: "bg-[#4A1D96]",
    iconColor: "text-white",
    valueColor: "text-[#4A1D96]",
    gradient: "from-[#4A1D96] to-[#351570]",
  },
  orange: {
    bg: "bg-gradient-to-br from-[#C2542E]/5 to-[#C2542E]/10",
    iconBg: "bg-[#C2542E]",
    iconColor: "text-white",
    valueColor: "text-[#C2542E]",
    gradient: "from-[#C2542E] to-[#A03D1F]",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
  trendValue,
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 group"
    )}>
      <div className={cn("absolute inset-0 opacity-50", styles.bg)} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5B6472]">{title}</p>
            <p className={cn("text-3xl font-bold tracking-tight", styles.valueColor)}>
              {value}
            </p>
            {(trend || trendValue) && (
              <div className="flex items-center gap-1.5">
                {trend === "up" && (
                  <svg className="h-4 w-4 text-[#2E7D5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                {trend === "down" && (
                  <svg className="h-4 w-4 text-[#C2542E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {trendValue && (
                  <span className={cn(
                    "text-xs font-medium",
                    trend === "up" ? "text-[#2E7D5B]" : trend === "down" ? "text-[#C2542E]" : "text-[#5B6472]"
                  )}>
                    {trendValue}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300",
            styles.iconBg
          )}>
            <Icon className={cn("h-6 w-6", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
