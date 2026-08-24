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
    default: "text-[#111111] bg-[#F3F3F3]",
    success: "text-[#16A34A] bg-[#16A34A]/10",
    warning: "text-[#D97706] bg-[#D97706]/10",
    destructive: "text-[#DC2626] bg-[#DC2626]/10",
    info: "text-[#2563EB] bg-[#2563EB]/10",
  }[variant];

  return (
    <Card className="border-[#E5E5E5] bg-white shadow-sm hover:border-[#111111] transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">{title}</p>
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#111111]">{value}</span>
          {change && (
            <span className="text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 px-1.5 py-0.5 rounded">
              {change}
            </span>
          )}
        </div>
        {subtitle && <p className="text-[11px] text-[#737373] mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}