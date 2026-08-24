"use client";

import React, { useState } from "react";
import { Booking } from "@/types";
import { useAppState } from "@/lib/store/stateContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BookingStatusBadge } from "@/components/shared/StatusBadge";
import { Navigation, Wrench, CheckCheck, Phone, MapPin, FileCheck } from "lucide-react";
import Link from "next/link";

interface ActiveServiceBarProps {
  booking: Booking;
}

export function ActiveServiceBar({ booking }: ActiveServiceBarProps) {
  const {
    startWorkerTravel,
    startServiceExecution,
    completeServiceExecution,
  } = useAppState();

  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const handleCompleteSubmit = () => {
    if (!completionNotes.trim()) {
      alert("Please provide completion notes describing what was fixed.");
      return;
    }
    completeServiceExecution(booking.id, completionNotes, photoUrl || undefined);
    setIsCompleteOpen(false);
  };

  return (
    <Card className="border border-[#111111] bg-[#F8F8F8] shadow-md">
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#111111]">Active Job #{booking.bookingNumber}</span>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="text-xs font-semibold text-[#111111] mt-0.5">{booking.serviceName}</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href={`tel:${booking.customerPhone}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-[#E5E5E5] hover:bg-[#F3F3F3] text-[#111111] font-medium"
            >
              <Phone className="w-3.5 h-3.5" /> Call Customer
            </a>
            <Link
              href={`/worker/jobs/${booking.id}`}
              className="px-3 py-1.5 rounded-md bg-[#111111] text-white hover:bg-[#262626] font-medium"
            >
              View Job Card
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-1 text-xs text-[#525252]">
          <MapPin className="w-3.5 h-3.5 text-[#111111] shrink-0 mt-0.5" />
          <span className="leading-tight">{booking.customerAddress}</span>
        </div>

        {/* Action Transitions */}
        <div className="pt-2 flex flex-wrap gap-2">
          {booking.status === "ACCEPTED" && (
            <Button
              onClick={() => startWorkerTravel(booking.id)}
              className="w-full sm:w-auto bg-[#111111] text-white text-xs gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" /> Start Travel (Mark En Route)
            </Button>
          )}

          {booking.status === "WORKER_EN_ROUTE" && (
            <Button
              onClick={() => startServiceExecution(booking.id)}
              className="w-full sm:w-auto bg-[#D97706] hover:bg-[#B45309] text-white text-xs gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" /> Arrived & Start Service
            </Button>
          )}

          {booking.status === "SERVICE_STARTED" && (
            <Button
              onClick={() => setIsCompleteOpen(true)}
              className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white text-xs gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Complete Service & Bill
            </Button>
          )}

          {booking.status === "SERVICE_COMPLETED" && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#16A34A] bg-[#16A34A]/10 px-3 py-1.5 rounded border border-[#16A34A]/20">
              <FileCheck className="w-4 h-4" />
              <span>Service marked complete. Waiting for customer payment settlement.</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Completion Modal */}
      <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <DialogContent className="max-w-md bg-white border border-[#E5E5E5]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Complete Service Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Work Completion Summary *</label>
              <Textarea
                rows={3}
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="e.g. Replaced faulty washer and brass valve, tested water flow at 4 bar, left site clean."
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Photo of Completed Work (Optional URL)</label>
              <Input
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/proof_photo.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsCompleteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteSubmit} size="sm" className="bg-[#16A34A] hover:bg-[#15803D] text-white">
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}