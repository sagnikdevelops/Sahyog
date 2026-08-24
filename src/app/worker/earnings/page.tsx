"use client";

import React from "react";
import { useAppState } from "@/lib/store/stateContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Wallet, ArrowDownRight, CheckCheck, ShieldCheck } from "lucide-react";

export default function WorkerEarningsPage() {
  const { currentUser, workers, bookings, payouts } = useAppState();
  const worker = workers.find((w) => w.id === currentUser.id) || workers[0];

  const completedJobs = bookings.filter(
    (b) => b.workerId === worker.id && b.status === "PAYMENT_COMPLETED"
  );

  const totalEarnings = completedJobs.reduce((sum, b) => sum + b.workerPayoutAmount, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4">
        <h1 className="text-2xl font-bold text-[#111111]">Earnings & Cooperative Payouts</h1>
        <p className="text-xs text-[#737373]">
          Transparent records of direct compensation credited to your cooperative bank account.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#F8F8F8] rounded-lg border border-[#E5E5E5]">
          <span className="text-xs text-[#737373] font-medium">Total Earned to Date</span>
          <p className="text-2xl font-bold text-[#111111] mt-1">{formatCurrency(totalEarnings)}</p>
          <span className="text-[10px] text-[#16A34A] font-semibold">88% Direct Payout Rate</span>
        </div>
        <div className="p-5 bg-[#F8F8F8] rounded-lg border border-[#E5E5E5]">
          <span className="text-xs text-[#737373] font-medium">Completed Jobs</span>
          <p className="text-2xl font-bold text-[#111111] mt-1">{completedJobs.length} Jobs</p>
          <span className="text-[10px] text-[#525252]">100% Settled</span>
        </div>
        <div className="p-5 bg-[#F8F8F8] rounded-lg border border-[#E5E5E5]">
          <span className="text-xs text-[#737373] font-medium">Welfare Contributions</span>
          <p className="text-2xl font-bold text-[#16A34A] mt-1">₹{Math.round(totalEarnings * 0.08)}</p>
          <span className="text-[10px] text-[#737373]">Credited to Group Insurance</span>
        </div>
      </div>

      {/* Payouts Table */}
      <Card className="border-[#E5E5E5]">
        <CardHeader className="p-4 border-b border-[#E5E5E5]">
          <CardTitle className="text-sm font-bold">Service Remuneration Ledger</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {completedJobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#737373]">
              No settled jobs yet. Complete assigned bookings to view ledger entries.
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5] text-xs">
              {completedJobs.map((b) => (
                <div key={b.id} className="p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111111]">#{b.bookingNumber}</span>
                      <Badge variant="success" className="text-[10px]">PAID OUT</Badge>
                    </div>
                    <p className="text-[#525252]">{b.serviceName} • Customer: {b.customerName}</p>
                    <p className="text-[10px] text-[#737373]">Txn: {b.transactionRef || "TXN_SETTLED"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#16A34A]">+{formatCurrency(b.workerPayoutAmount)}</span>
                    <span className="text-[10px] text-[#737373] block">{formatDate(b.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}