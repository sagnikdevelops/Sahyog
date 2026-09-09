import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
}

export function KpiCard({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
  variant = "default",
}: KpiCardProps) {
  const iconColor = {
    default: "text-[#142D52] bg-[#F9FAF7] border border-[#E5E7EB]",
    success: "text-[#047857] bg-[#047857]/10 border border-[#047857]/20",
    warning: "text-[#D97706] bg-[#D97706]/10 border border-[#D97706]/20",
    destructive: "text-[#DC2626] bg-[#DC2626]/10 border border-[#DC2626]/20",
    info: "text-[#142D52] bg-[#142D52]/10 border border-[#142D52]/20",
  }[variant];

  return (
    <Card className="border-[#E5E7EB] bg-white shadow-sm hover:border-[#047857] transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{title}</p>
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#142D52]">{value}</span>
          {change && (
            <span className="text-[11px] font-semibold text-[#047857] bg-[#047857]/10 px-1.5 py-0.5 rounded border border-[#047857]/20">
              {change}
            </span>
          )}
        </div>
        {subtitle && <p className="text-[11px] text-[#6B7280] mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}