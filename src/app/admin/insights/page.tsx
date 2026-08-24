"use client";

import React from "react";
import { useAppState } from "@/lib/store/stateContext";
import { DemandInsightCard } from "@/components/admin/DemandInsightCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Cpu, Sparkles } from "lucide-react";

export default function AdminInsightsPage() {
  const { demandInsights } = useAppState();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#111111] text-white px-2 py-0.5 rounded font-bold uppercase">
            AI-Ready Rule Engine
          </span>
          <span className="text-xs text-[#737373]">Real-time Demand Pattern Analysis</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111111]">Demand Insights & Workforce Allocation</h1>
        <p className="text-xs text-[#737373]">
          Automated heuristics tracking trade surge requests, seasonal spikes, and regional technician shortages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demandInsights.map((insight) => (
          <DemandInsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      <Card className="border-[#E5E5E5] bg-[#F8F8F8] p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#111111]" />
          <CardTitle className="text-sm font-bold">Machine Learning Extension Architecture</CardTitle>
        </div>
        <p className="text-xs text-[#525252] leading-relaxed">
          The Sahyog demand forecasting interface is structured to ingest historical booking frequency, local weather events, and spatial clustering models in Phase 2 for predictive automated dispatch.
        </p>
      </Card>
    </div>
  );
}