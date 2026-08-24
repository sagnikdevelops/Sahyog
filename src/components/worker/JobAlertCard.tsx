"use client";

import React from "react";
import { Booking } from "@/types";
import { useAppState } from "@/lib/store/stateContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UrgencyBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { Flame, MapPin, Calendar, Clock, Check, X, Phone } from "lucide-react";
import Link from "next/link";

interface JobAlertCardProps {
  booking: Booking;
}

export function JobAlertCard({ booking }: JobAlertCardProps) {
  const { acceptBookingJob, rejectBookingJob } = useAppState();

  return (
    <Card className={`border shadow-sm transition-all ${
      booking.urgency === "EMERGENCY"
        ? "border-[#DC2626] bg-[#DC2626]/5 ring-1 ring-[#DC2626]"
        : "border-[#E5E5E5] bg-white hover:border-[#111111]"
    }`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-bold text-[#111111]">{booking.serviceName}</CardTitle>
          <UrgencyBadge urgency={booking.urgency} />
        </div>
        <span className="font-bold text-sm text-[#111111]">{formatCurrency(booking.totalAmount)}</span>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 text-xs">
        <div className="flex items-start gap-1.5 text-[#525252]">
          <MapPin className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
          <span className="leading-tight">{booking.customerAddress}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#737373]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {booking.scheduledDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {booking.scheduledTime}
          </span>
        </div>

        <div className="p-2.5 bg-[#F8F8F8] rounded text-[#525252] border border-[#E5E5E5]">
          <p className="text-[10px] font-bold text-[#737373] uppercase">Problem Description</p>
          <p className="mt-0.5 line-clamp-2 leading-relaxed">{booking.description}</p>
        </div>

        <div className="flex justify-between items-center text-[11px] pt-1 text-[#737373]">
          <span>Customer: {booking.customerName}</span>
          <span className="font-semibold text-[#16A34A]">Your Payout: ₹{booking.workerPayoutAmount}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-[#F8F8F8] border-t border-[#E5E5E5] flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => rejectBookingJob(booking.id, "Worker declined request")}
          className="text-xs text-[#DC2626] hover:bg-[#DC2626]/5 border-[#DC2626]/20 gap-1"
        >
          <X className="w-3.5 h-3.5" /> Decline
        </Button>
        <Button
          size="sm"
          onClick={() => acceptBookingJob(booking.id)}
          className="text-xs bg-[#111111] text-white hover:bg-[#262626] gap-1"
        >
          <Check className="w-3.5 h-3.5" /> Accept Job
        </Button>
      </CardFooter>
    </Card>
  );
}