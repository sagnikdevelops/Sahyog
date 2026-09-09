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
import { Navigation, Wrench, CheckCheck, Phone, MapPin, FileCheck, Camera, Image as ImageIcon, X } from "lucide-react";
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteSubmit = () => {
    if (!completionNotes.trim()) {
      alert("Please provide completion notes describing what was fixed.");
      return;
    }
    completeServiceExecution(booking.id, completionNotes, photoUrl || undefined);
    setIsCompleteOpen(false);
  };

  return (
    <Card className="border border-[#142D52]/20 bg-white shadow-md">
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#142D52]">Active Job #{booking.bookingNumber}</span>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="text-xs font-semibold text-[#142D52] mt-0.5">{booking.serviceName}</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href={`tel:${booking.customerPhone}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-[#E5E7EB] hover:bg-[#F9FAF7] text-[#142D52] font-medium"
            >
              <Phone className="w-3.5 h-3.5" /> Call Customer
            </a>
            <Link
              href={`/worker/jobs/${booking.id}`}
              className="px-3 py-1.5 rounded-md bg-[#142D52] text-white hover:bg-[#0E203B] font-medium"
            >
              View Job Card
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-1 text-xs text-[#4B5563]">
          <MapPin className="w-3.5 h-3.5 text-[#047857] shrink-0 mt-0.5" />
          <span className="leading-tight">{booking.customerAddress}</span>
        </div>

        {/* Action Transitions */}
        <div className="pt-2 flex flex-wrap gap-2">
          {booking.status === "ACCEPTED" && (
            <Button
              onClick={() => startWorkerTravel(booking.id)}
              className="w-full sm:w-auto bg-[#142D52] hover:bg-[#047857] text-white text-xs gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" /> Start Travel (Mark En Route)
            </Button>
          )}

          {booking.status === "WORKER_EN_ROUTE" && (
            <Button
              onClick={() => startServiceExecution(booking.id)}
              className="w-full sm:w-auto bg-[#D97706] hover:bg-[#B45309] text-white text-xs gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" /> Arrived &amp; Start Service
            </Button>
          )}

          {booking.status === "SERVICE_STARTED" && (
            <Button
              onClick={() => setIsCompleteOpen(true)}
              className="w-full sm:w-auto bg-[#047857] hover:bg-[#065F46] text-white text-xs gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Complete Service &amp; Bill
            </Button>
          )}

          {booking.status === "SERVICE_COMPLETED" && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#047857] bg-[#047857]/10 px-3 py-1.5 rounded border border-[#047857]/20">
              <FileCheck className="w-4 h-4" />
              <span>Service marked complete. Waiting for customer payment settlement.</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Completion Modal */}
      <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <DialogContent className="max-w-md bg-white border border-[#E5E7EB]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#142D52]">Complete Service Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-[#142D52]">Work Completion Summary *</label>
              <Textarea
                rows={3}
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="e.g. Replaced faulty washer and brass valve, tested water flow at 4 bar, left site clean."
                className="border-[#E5E7EB]"
              />
            </div>
            
            <div className="p-3 bg-[#F9FAF7] rounded-lg border border-[#E5E7EB] space-y-2">
              <label className="font-semibold block text-[#142D52] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#047857]" /> Work Completion Photo Proof (Upload from System)
              </label>
              {photoUrl ? (
                <div className="relative inline-block mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt="Completion proof"
                    className="w-32 h-24 object-cover rounded-md border border-[#E5E7EB]"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl("")}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[#DC2626] text-white rounded-full flex items-center justify-center shadow"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#047857] text-[#047857] hover:bg-[#047857]/10 text-xs font-medium bg-white">
                    <ImageIcon className="w-3.5 h-3.5" /> Choose from System
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-[#6B7280]">Attach before/after photo</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsCompleteOpen(false)} className="border-[#E5E7EB] text-[#142D52]">
              Cancel
            </Button>
            <Button onClick={handleCompleteSubmit} size="sm" className="bg-[#047857] hover:bg-[#065F46] text-white">
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}