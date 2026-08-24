"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { LiveTracker } from "@/components/customer/LiveTracker";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings } = useAppState();

  const bookingId = params.id as string;
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-[#111111]">Booking Not Found</h2>
        <p className="text-xs text-[#737373]">The requested service booking was not found or has expired.</p>
        <Link href="/customer">
          <Button size="sm" className="text-xs">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/customer">
          <Button variant="outline" size="sm" className="text-xs gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <LiveTracker booking={booking} />
    </div>
  );
}