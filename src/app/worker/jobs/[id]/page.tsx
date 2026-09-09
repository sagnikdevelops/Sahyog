"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { ActiveServiceBar } from "@/components/worker/ActiveServiceBar";
import { BookingStatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, MapPin, Calendar, Clock, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function WorkerJobCardPage() {
  const params = useParams();
  const { bookings } = useAppState();

  const bookingId = params.id as string;
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-[#142D52]">Job Card Not Found</h2>
        <Link href="/worker">
          <Button size="sm" className="text-xs bg-[#047857] hover:bg-[#065F46] text-white">Return to Worker App</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link href="/worker">
        <Button variant="outline" size="sm" className="text-xs gap-1 border-[#E5E7EB] text-[#142D52] hover:bg-[#F9FAF7]">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Button>
      </Link>

      <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#142D52]">Job #{booking.bookingNumber}</h1>
            <BookingStatusBadge status={booking.status} />
            <UrgencyBadge urgency={booking.urgency} />
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5">{booking.serviceName}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#6B7280] block">Direct Worker Remuneration</span>
          <span className="text-base font-bold text-[#047857]">₹{booking.workerPayoutAmount}</span>
        </div>
      </div>

      <ActiveServiceBar booking={booking} />

      <Card className="border-[#E5E7EB] bg-white">
        <CardHeader className="p-4 border-b border-[#E5E7EB]">
          <CardTitle className="text-sm font-bold text-[#142D52]">Customer &amp; Location Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase text-[#6B7280] font-semibold">Customer</p>
              <p className="font-bold text-[#142D52]">{booking.customerName}</p>
              <a href={`tel:${booking.customerPhone}`} className="text-[#047857] hover:underline flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" /> {booking.customerPhone}
              </a>
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#6B7280] font-semibold">Address</p>
              <p className="font-medium text-[#1F2937] leading-tight">{booking.customerAddress}</p>
            </div>
          </div>

          <div className="p-3 bg-[#F9FAF7] rounded border border-[#E5E7EB] space-y-2">
            <p className="text-[10px] uppercase text-[#6B7280] font-semibold">Problem Notes</p>
            <p className="text-[#4B5563] leading-relaxed">{booking.description}</p>
            {booking.problemPhotoUrl && (
              <div className="pt-2 border-t border-[#E5E7EB]">
                <p className="text-[10px] font-bold text-[#142D52] mb-1">Customer Problem Photo Attachment:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.problemPhotoUrl}
                  alt="Customer problem photo"
                  className="w-48 h-32 object-cover rounded-md border border-[#E5E7EB]"
                />
              </div>
            )}
            {booking.customerNotes && (
              <p className="text-[#142D52] text-[11px] font-medium pt-1">
                Landmark / Entry instructions: {booking.customerNotes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}