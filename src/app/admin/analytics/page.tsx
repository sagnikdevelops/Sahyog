"use client";

import React from "react";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { KpiCard } from "@/components/admin/KpiCard";
import { useAppState } from "@/lib/store/stateContext";
import { Users, TrendingUp, Wallet, ShieldCheck, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const { bookings, workers } = useAppState();

  const completedCount = bookings.filter((b) => b.status === "PAYMENT_COMPLETED").length;
  const totalVolume = bookings
    .filter((b) => b.status === "PAYMENT_COMPLETED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const coopWelfarePool = Math.round(totalVolume * 0.07);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4">
        <h1 className="text-2xl font-bold text-[#111111]">Cooperative Operational Analytics</h1>
        <p className="text-xs text-[#737373]">
          Data-driven metrics on workforce deployment, service volume, trade demand, and member welfare fund growth.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Service GMV"
          value={formatCurrency(totalVolume)}
          subtitle="Processed via Sahyog"
          icon={Wallet}
          variant="default"
        />
        <KpiCard
          title="Cooperative Welfare Fund"
          value={formatCurrency(coopWelfarePool)}
          subtitle="7% allocated to member safety"
          icon={ShieldCheck}
          variant="success"
        />
        <KpiCard
          title="Completed Job Ratio"
          value={`${Math.round((completedCount / Math.max(1, bookings.length)) * 100)}%`}
          subtitle={`${completedCount} of ${bookings.length} delivered`}
          icon={CheckCircle2}
          variant="info"
        />
      </div>

      <AnalyticsCharts />
    </div>
  );
}