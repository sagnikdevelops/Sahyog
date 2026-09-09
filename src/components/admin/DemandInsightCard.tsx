import React from "react";
import { DemandInsight } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Info, ArrowUpRight } from "lucide-react";

export function DemandInsightCard({ insight }: { insight: DemandInsight }) {
  const severityBadge = {
    INFO: <Badge variant="info">Demand Notice</Badge>,
    WARNING: <Badge variant="warning">Surge Warning</Badge>,
    URGENT: <Badge variant="destructive">Capacity Shortage</Badge>,
  }[insight.severity];

  return (
    <Card className="border-[#E5E7EB] bg-white hover:border-[#047857] transition-all">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#047857]" />
          <CardTitle className="text-xs font-bold text-[#142D52]">{insight.title}</CardTitle>
        </div>
        {severityBadge}
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-xs">
        <p className="text-[#4B5563] leading-relaxed">{insight.description}</p>
        <div className="p-2.5 bg-[#F9FAF7] rounded-md border border-[#E5E7EB] text-[11px] space-y-1">
          <p className="font-semibold text-[#142D52]">Recommended Cooperative Action:</p>
          <p className="text-[#4B5563]">{insight.suggestedAction}</p>
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#6B7280] pt-1">
          <span>Target Area: {insight.affectedArea}</span>
          <span className="font-bold text-[#047857]">+{insight.trendPercentage}% Demand Shift</span>
        </div>
      </CardContent>
    </Card>
  );
}