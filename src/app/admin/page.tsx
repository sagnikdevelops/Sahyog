"use client";

import React from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store/stateContext";
import { KpiCard } from "@/components/admin/KpiCard";
import { DemandInsightCard } from "@/components/admin/DemandInsightCard";
import { AdminOperationsMap } from "@/components/maps/AdminOperationsMap";
import { BookingStatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  ShieldCheck,
  Calendar,
  Flame,
  AlertTriangle,
  Wallet,
  TrendingUp,
  MapPin,
  ArrowRight,
  HardHat,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { workers, bookings, disputes, demandInsights } = useAppState();

  const totalWorkers = workers.length;
  const verifiedWorkers = workers.filter(
    (w) => w.verificationStatus === "APPROVED" || w.verificationStatus === "COOPERATIVE_VERIFIED"
  ).length;
  const activeBookings = bookings.filter((b) => b.status !== "PAYMENT_COMPLETED" && b.status !== "CANCELLED").length;
  const emergencyCount = bookings.filter((b) => b.urgency === "EMERGENCY" && b.status !== "PAYMENT_COMPLETED").length;
  const openDisputes = disputes.filter((d) => d.status !== "RESOLVED").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "PAYMENT_COMPLETED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const workerUtilization = Math.round(
    (workers.filter((w) => w.isAvailable).length / Math.max(1, workers.length)) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373]">
            Cooperative Administration Platform
          </span>
          <h1 className="text-2xl font-bold text-[#111111] mt-0.5">
            Operations & Workforce Dispatch Dashboard
          </h1>
          <p className="text-xs text-[#525252] mt-1">
            Labour Cooperative Society & Federation Unified Control Center
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/workers">
            <Button size="sm" className="text-xs bg-[#111111] text-white hover:bg-[#262626]">
              Worker Verification ({totalWorkers})
            </Button>
          </Link>
          <Link href="/admin/bookings">
            <Button variant="outline" size="sm" className="text-xs">
              Dispatch Console
            </Button>
          </Link>
          <Link href="/admin/map">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#111111]" /> GIS Map
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Cooperative Workers"
          value={totalWorkers}
          subtitle={`${verifiedWorkers} Verified Members`}
          icon={HardHat}
          variant="default"
        />
        <KpiCard
          title="Active Service Requests"
          value={activeBookings}
          subtitle="Currently in progress"
          icon={Calendar}
          variant="info"
        />
        <KpiCard
          title="Emergency Radar"
          value={emergencyCount}
          subtitle="Requires <30m dispatch"
          icon={Flame}
          variant={emergencyCount > 0 ? "destructive" : "default"}
        />
        <KpiCard
          title="Worker Utilization Index"
          value={`${workerUtilization}%`}
          subtitle="Available for dispatch"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Live Operations Map Preview */}
      <AdminOperationsMap />

      {/* Demand Insights Rule Engine Alerts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
          <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#111111]" />
            Demand Surge Insights & Workforce Advisory
          </h2>
          <Link href="/admin/insights" className="text-xs text-[#111111] hover:underline font-semibold">
            View All Advisories →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demandInsights.slice(0, 3).map((insight) => (
            <DemandInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Recent Bookings & Dispatch Table */}
      <Card className="border-[#E5E5E5]">
        <CardHeader className="p-4 border-b border-[#E5E5E5] flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold">Today's Service Requests & Dispatch Monitor</CardTitle>
          <Link href="/admin/bookings">
            <Button variant="outline" size="sm" className="text-xs">
              View All Bookings
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#E5E5E5] text-xs">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#F8F8F8] transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111111]">#{b.bookingNumber}</span>
                    <BookingStatusBadge status={b.status} />
                    <UrgencyBadge urgency={b.urgency} />
                  </div>
                  <p className="font-semibold text-[#111111]">{b.serviceName}</p>
                  <p className="text-[#737373] text-[11px]">
                    Customer: {b.customerName} • Assigned: {b.workerName || "Matching..."} ({b.cooperativeName})
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-[#111111] block">{formatCurrency(b.totalAmount)}</span>
                    <span className="text-[10px] text-[#737373]">{formatDate(b.createdAt, "hh:mm a")}</span>
                  </div>
                  <Link href={`/customer/bookings/${b.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">Inspect</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}