"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store/stateContext";
import { useI18n } from "@/lib/i18n";
import { SERVICE_CATEGORIES, SERVICES } from "@/constants";
import { ServiceCard } from "@/components/customer/ServiceCard";
import { BookingStatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Flame,
  Search,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const { currentUser, bookings } = useAppState();
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const activeBookings = bookings.filter(
    (b) => b.customerId === currentUser.id && b.status !== "PAYMENT_COMPLETED" && b.status !== "CANCELLED"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373]">
            Customer Portal
          </span>
          <h1 className="text-2xl font-bold text-[#111111] mt-0.5">
            Welcome back, {currentUser.fullName} 👋
          </h1>
          <p className="text-xs text-[#525252] mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#111111]" />
            Default Area: {currentUser.address} ({currentUser.city})
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/customer/book">
            <Button className="text-xs bg-[#111111] text-white hover:bg-[#262626]">
              + Book New Service
            </Button>
          </Link>
          <Link href="/customer/history">
            <Button variant="outline" className="text-xs">
              Past Invoices
            </Button>
          </Link>
        </div>
      </div>

      {/* Emergency Quick Action Banner */}
      <div className="p-4 rounded-lg bg-[#DC2626]/5 border border-[#DC2626]/25 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#DC2626] text-white flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-[#111111]">Emergency Plumbing or Power Breakdown?</h3>
            <p className="text-[11px] text-[#737373]">PostGIS auto-assigns the nearest verified technician in under 30 minutes.</p>
          </div>
        </div>
        <Link href="/customer/book?urgency=EMERGENCY">
          <Button variant="emergency" size="sm" className="text-xs shrink-0">
            Book Emergency Now
          </Button>
        </Link>
      </div>

      {/* Active Bookings Bar */}
      {activeBookings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            Active Service Trackers ({activeBookings.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => (
              <Card key={b.id} className="border-[#111111] bg-white shadow-sm">
                <CardContent className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111111]">#{b.bookingNumber}</span>
                      <BookingStatusBadge status={b.status} />
                    </div>
                    <UrgencyBadge urgency={b.urgency} />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#111111]">{b.serviceName}</h3>
                    <p className="text-[11px] text-[#737373]">
                      Worker: {b.workerName || "Matching Cooperative Worker..."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]">
                    <span className="text-[11px] text-[#525252]">Scheduled: {b.scheduledDate} ({b.scheduledTime})</span>
                    <Link href={`/customer/bookings/${b.id}`}>
                      <Button size="sm" className="text-xs bg-[#111111] text-white gap-1 h-7">
                        Track Live <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Service Trades Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
          <h2 className="text-base font-bold text-[#111111]">Choose a Cooperative Service</h2>
          <span className="text-xs text-[#737373]">100% Certified Members</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SERVICE_CATEGORIES.map((cat) => (
            <ServiceCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}