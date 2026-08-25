"use client";

import React from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store/stateContext";
import { normalizeWorkerRecord } from "@/lib/auth/authHelpers";
import { AvailabilityToggle } from "@/components/worker/AvailabilityToggle";
import { JobAlertCard } from "@/components/worker/JobAlertCard";
import { ActiveServiceBar } from "@/components/worker/ActiveServiceBar";
import { WorkerVerificationBadge, BookingStatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  HardHat,
  ShieldCheck,
  Award,
  Wallet,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function WorkerDashboardPage() {
  const { currentUser, workers, bookings } = useAppState();

  const worker =
    workers.find((w) => w.id === currentUser.id) ||
    workers[0] ||
    normalizeWorkerRecord({
      id: currentUser.id,
      profile: { ...currentUser, role: "WORKER" },
      cooperativeName: "Unassigned Cooperative",
    });

  // Incoming jobs assigned to this worker that are not yet accepted
  const pendingIncomingJobs = bookings.filter(
    (b) => b.workerId === worker.id && b.status === "ASSIGNED"
  );

  // Active accepted job
  const activeJob = bookings.find(
    (b) =>
      b.workerId === worker.id &&
      ["ACCEPTED", "WORKER_EN_ROUTE", "SERVICE_STARTED", "SERVICE_COMPLETED"].includes(b.status)
  );

  // Completed jobs
  const completedJobs = bookings.filter(
    (b) => b.workerId === worker.id && b.status === "PAYMENT_COMPLETED"
  );

  const totalEarnings = completedJobs.reduce((sum, b) => sum + b.workerPayoutAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-base">
            {(worker.profile?.fullName || "Worker").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#111111]">{worker.profile?.fullName || "Worker"}</h1>
              <WorkerVerificationBadge status={worker.verificationStatus} />
            </div>
            <p className="text-xs text-[#737373] mt-0.5">{worker.cooperativeName || "Unassigned Cooperative"}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <RatingStars rating={worker.ratingAvg || 5} size="sm" showNumber />
              <span className="text-[11px] text-[#525252]">({worker.ratingCount} Customer Reviews)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/worker/earnings">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <Wallet className="w-3.5 h-3.5 text-[#16A34A]" /> Earnings (₹{totalEarnings})
            </Button>
          </Link>
          <Link href="/worker/profile">
            <Button variant="outline" size="sm" className="text-xs">
              My Skills & Trade
            </Button>
          </Link>
          <Link href="/worker/welfare">
            <Button variant="outline" size="sm" className="text-xs">
              Welfare Policy
            </Button>
          </Link>
        </div>
      </div>

      {/* Online/Offline Availability Switch */}
      <AvailabilityToggle workerId={worker.id} />

      {/* Active Job Action Bar */}
      {activeJob && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
            Current Active Job in Progress
          </h2>
          <ActiveServiceBar booking={activeJob} />
        </div>
      )}

      {/* Incoming Job Requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
          <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${pendingIncomingJobs.length > 0 ? "bg-[#DC2626] animate-pulse" : "bg-[#A3A3A3]"}`} />
            Incoming Job Dispatches ({pendingIncomingJobs.length})
          </h2>
          <span className="text-xs text-[#737373]">Accept within time limit</span>
        </div>

        {pendingIncomingJobs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg border border-[#E5E5E5] text-xs text-[#737373] space-y-1">
            <p className="font-semibold text-[#111111]">No pending job dispatches at this moment.</p>
            <p>Make sure your status is set to Online to receive nearby customer requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingIncomingJobs.map((b) => (
              <JobAlertCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Card className="border-[#E5E5E5] bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#737373] font-semibold">Completed Services</p>
              <p className="text-lg font-bold text-[#111111]">{worker.completedServicesCount} Jobs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E5E5] bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#111111] text-white flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#737373] font-semibold">Total Payout Share (88%)</p>
              <p className="text-lg font-bold text-[#111111]">{formatCurrency(totalEarnings)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E5E5] bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
              🛡️
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#737373] font-semibold">Cooperative Welfare Fund</p>
              <p className="text-lg font-bold text-[#111111]">Active Cover (₹2L)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}