"use client";

import React, { useState } from "react";
import { Booking } from "@/types";
import { useAppState } from "@/lib/store/stateContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";
import { WorkerVerificationBadge } from "@/components/shared/StatusBadge";
import { RatingStars } from "@/components/shared/RatingStars";

interface ReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

export function ReassignModal({ isOpen, onClose, booking }: ReassignModalProps) {
  const { workers, assignWorkerToBooking } = useAppState();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(booking.workerId || "");

  const handleReassign = () => {
    if (!selectedWorkerId) {
      alert("Please select a worker.");
      return;
    }
    assignWorkerToBooking(booking.id, selectedWorkerId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border border-[#E5E5E5]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#111111]" />
            Manual Dispatch & Reassign Worker
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <p className="text-[#525252]">
            Booking #{booking.bookingNumber} • {booking.serviceName}
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {workers.map((w) => {
              const isSelected = selectedWorkerId === w.id;
              return (
                <div
                  key={w.id}
                  onClick={() => setSelectedWorkerId(w.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#111111] bg-[#F8F8F8] ring-1 ring-[#111111]"
                      : "border-[#E5E5E5] hover:bg-[#F8F8F8]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#111111]">{w.profile.fullName}</span>
                        <WorkerVerificationBadge status={w.verificationStatus} />
                      </div>
                      <p className="text-[10px] text-[#737373]">{w.cooperativeName}</p>
                    </div>
                    <RatingStars rating={w.ratingAvg || 5} size="sm" />
                  </div>
                  <div className="flex gap-3 text-[10px] text-[#525252] mt-1">
                    <span>{w.isAvailable ? "🟢 Available" : "🔴 Busy"}</span>
                    <span>📍 {w.profile.city}</span>
                    <span>✅ {w.completedServicesCount} jobs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleReassign} size="sm" className="bg-[#111111] text-white">
            Dispatch Selected Worker
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}