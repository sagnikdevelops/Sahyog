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
  const [error, setError] = useState<string | null>(null);

  const handleReassign = () => {
    if (!selectedWorkerId) {
      setError("Please select a worker before dispatching.");
      return;
    }
    setError(null);
    assignWorkerToBooking(booking.id, selectedWorkerId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border border-[#E5E7EB]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-[#142D52]">
            <UserCheck className="w-5 h-5 text-[#047857]" />
            Manual Dispatch & Reassign Worker
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          {error ? (
            <p role="alert" className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200 font-medium">
              {error}
            </p>
          ) : null}
          <p className="text-[#4B5563]">
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
                      ? "border-[#142D52] bg-[#F9FAF7] ring-1 ring-[#142D52]"
                      : "border-[#E5E7EB] hover:bg-[#F9FAF7]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#142D52]">{w.profile.fullName}</span>
                        <WorkerVerificationBadge status={w.verificationStatus} />
                      </div>
                      <p className="text-[10px] text-[#6B7280]">{w.cooperativeName}</p>
                    </div>
                    <RatingStars rating={w.ratingAvg || 5} size="sm" />
                  </div>
                  <div className="flex gap-3 text-[10px] text-[#4B5563] mt-1">
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
          <Button variant="outline" size="sm" onClick={onClose} className="border-[#E5E7EB] text-[#1F2937]">
            Cancel
          </Button>
          <Button onClick={handleReassign} size="sm" className="bg-[#142D52] hover:bg-[#0E203B] text-white">
            Dispatch Selected Worker
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}