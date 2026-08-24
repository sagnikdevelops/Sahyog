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
    <Card className="border-[#E5E5E5] bg-white hover:border-[#111111] transition-all">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#111111]" />
          <CardTitle className="text-xs font-bold text-[#111111]">{insight.title}</CardTitle>
        </div>
        {severityBadge}
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-xs">
        <p className="text-[#525252] leading-relaxed">{insight.description}</p>
        <div className="p-2.5 bg-[#F8F8F8] rounded-md border border-[#E5E5E5] text-[11px] space-y-1">
          <p className="font-semibold text-[#111111]">Recommended Cooperative Action:</p>
          <p className="text-[#525252]">{insight.suggestedAction}</p>
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#737373] pt-1">
          <span>Target Area: {insight.affectedArea}</span>
          <span className="font-bold text-[#16A34A]">+{insight.trendPercentage}% Demand Shift</span>
        </div>
      </CardContent>
    </Card>
  );
}