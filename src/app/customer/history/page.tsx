"use client";

import React from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store/stateContext";
import { BookingStatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowRight, FileText, CheckCircle2 } from "lucide-react";

export default function CustomerHistoryPage() {
  const { currentUser, bookings, ratings } = useAppState();

  const userBookings = bookings.filter((b) => b.customerId === currentUser.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4 space-y-1">
        <h1 className="text-2xl font-bold text-[#111111]">Service History & Invoices</h1>
        <p className="text-xs text-[#737373]">
          All completed and active service requests registered under your account.
        </p>
      </div>

      {userBookings.length === 0 ? (
        <div className="text-center py-16 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5] space-y-3">
          <p className="text-sm font-semibold text-[#111111]">No active bookings yet.</p>
          <p className="text-xs text-[#737373]">Book verified plumbers, electricians, carpenters with one click.</p>
          <Link href="/customer/book">
            <Button size="sm" className="text-xs bg-[#111111] text-white">Book a Service</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {userBookings.map((b) => {
            const review = ratings.find((r) => r.bookingId === b.id);
            return (
              <Card key={b.id} className="border-[#E5E5E5] bg-white hover:border-[#111111] transition-all">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111111]">#{b.bookingNumber}</span>
                      <BookingStatusBadge status={b.status} />
                      <UrgencyBadge urgency={b.urgency} />
                    </div>
                    <h3 className="font-bold text-sm text-[#111111]">{b.serviceName}</h3>
                    <p className="text-[11px] text-[#737373]">
                      Worker: {b.workerName || "Cooperative Assigned"} • {formatDate(b.scheduledDate)} at {b.scheduledTime}
                    </p>
                    {review && (
                      <div className="pt-1 flex items-center gap-2">
                        <RatingStars rating={review.rating} size="sm" />
                        <span className="text-[11px] text-[#525252] italic">"{review.feedback}"</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <span className="text-base font-bold text-[#111111]">{formatCurrency(b.totalAmount)}</span>
                    <Link href={`/customer/bookings/${b.id}`}>
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        View Details <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}