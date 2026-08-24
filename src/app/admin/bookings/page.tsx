"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store/stateContext";
import { Booking } from "@/types";
import { BookingStatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { ReassignModal } from "@/components/admin/ReassignModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Flame, UserCheck, Eye } from "lucide-react";

export default function AdminBookingsPage() {
  const { bookings } = useAppState();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [reassignBooking, setReassignBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (b.workerName && b.workerName.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Service Dispatch & Booking Management</h1>
          <p className="text-xs text-[#737373]">
            Monitor all incoming bookings, track lifecycle transitions, and override worker assignments.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: "ALL", label: "All Bookings" },
            { id: "REQUESTED", label: "Requested" },
            { id: "ASSIGNED", label: "Assigned" },
            { id: "ACCEPTED", label: "Accepted" },
            { id: "SERVICE_STARTED", label: "In Progress" },
            { id: "SERVICE_COMPLETED", label: "Completed" },
            { id: "PAYMENT_COMPLETED", label: "Paid" },
            { id: "DISPUTED", label: "Disputed" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-full font-medium border transition-colors ${
                statusFilter === item.id
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-[#525252] border-[#E5E5E5] hover:bg-[#F8F8F8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#737373]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking # or name..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="border-[#E5E5E5]">
        <CardContent className="p-0">
          <div className="divide-y divide-[#E5E5E5] text-xs">
            {filteredBookings.map((b) => (
              <div key={b.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#F8F8F8] transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111111]">#{b.bookingNumber}</span>
                    <BookingStatusBadge status={b.status} />
                    <UrgencyBadge urgency={b.urgency} />
                  </div>
                  <h4 className="font-semibold text-xs text-[#111111]">{b.serviceName}</h4>
                  <p className="text-[11px] text-[#737373]">
                    Customer: {b.customerName} ({b.customerPhone}) • Address: {b.customerAddress}
                  </p>
                  <p className="text-[11px] text-[#525252]">
                    Worker: <span className="font-semibold">{b.workerName || "System Matching..."}</span> ({b.cooperativeName})
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="font-bold text-sm text-[#111111] block">{formatCurrency(b.totalAmount)}</span>
                    <span className="text-[10px] text-[#737373]">{formatDate(b.scheduledDate)} at {b.scheduledTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setReassignBooking(b)}
                      className="text-xs gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Reassign
                    </Button>
                    <Link href={`/customer/bookings/${b.id}`}>
                      <Button size="sm" className="text-xs bg-[#111111] text-white">
                        Inspect
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {reassignBooking && (
        <ReassignModal
          isOpen={Boolean(reassignBooking)}
          onClose={() => setReassignBooking(null)}
          booking={reassignBooking}
        />
      )}
    </div>
  );
}