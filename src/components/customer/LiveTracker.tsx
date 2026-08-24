"use client";

import React, { useState } from "react";
import { Booking } from "@/types";
import { useAppState } from "@/lib/store/stateContext";
import { BookingStatusBadge, WorkerVerificationBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { InvoiceModal } from "@/components/customer/InvoiceModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Phone,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  Star,
} from "lucide-react";

interface LiveTrackerProps {
  booking: Booking;
}

export function LiveTracker({ booking }: LiveTrackerProps) {
  const {
    updateBookingStatus,
    submitPayment,
    submitRating,
    createDispute,
    ratings,
    payments,
  } = useAppState();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<any>("MOCK_UPI");
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [skillRatingVal, setSkillRatingVal] = useState<number>(5);
  const [punctualityVal, setPunctualityVal] = useState<number>(5);
  const [politenessVal, setPolitenessVal] = useState<number>(5);
  const [ratingFeedback, setRatingFeedback] = useState<string>("");

  const [disputeReason, setDisputeReason] = useState<string>("");
  const [disputeDesc, setDisputeDesc] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");

  const existingRating = ratings.find((r) => r.bookingId === booking.id);
  const existingPayment = payments.find((p) => p.bookingId === booking.id);

  const stages = [
    { key: "REQUESTED", label: "Requested" },
    { key: "ACCEPTED", label: "Accepted" },
    { key: "WORKER_EN_ROUTE", label: "En Route" },
    { key: "SERVICE_STARTED", label: "In Progress" },
    { key: "SERVICE_COMPLETED", label: "Completed" },
    { key: "PAYMENT_COMPLETED", label: "Paid & Settled" },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case "REQUESTED":
      case "MATCHING":
      case "ASSIGNED":
        return 0;
      case "ACCEPTED":
      case "SCHEDULED":
        return 1;
      case "WORKER_EN_ROUTE":
        return 2;
      case "SERVICE_STARTED":
        return 3;
      case "SERVICE_COMPLETED":
      case "PAYMENT_PENDING":
        return 4;
      case "PAYMENT_COMPLETED":
      case "PAYOUT_COMPLETED":
        return 5;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(booking.status);

  const handleConfirmCompletion = () => {
    setIsPaymentOpen(true);
  };

  const handleExecutePayment = () => {
    submitPayment(booking.id, paymentMethod);
    setIsPaymentOpen(false);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setIsRatingOpen(true);
    }, 800);
  };

  const handleExecuteRating = () => {
    if (!ratingFeedback.trim()) {
      alert("Please write a short review.");
      return;
    }
    submitRating({
      bookingId: booking.id,
      rating: ratingVal,
      skillRating: skillRatingVal,
      punctualityRating: punctualityVal,
      politenessRating: politenessVal,
      feedback: ratingFeedback,
    });
    setIsRatingOpen(false);
  };

  const handleExecuteDispute = () => {
    if (!disputeReason || !disputeDesc) {
      alert("Please enter dispute reason and description.");
      return;
    }
    createDispute({
      bookingId: booking.id,
      reason: disputeReason,
      description: disputeDesc,
    });
    setIsDisputeOpen(false);
  };

  const handleExecuteCancel = () => {
    updateBookingStatus(booking.id, "CANCELLED", cancelReason || "Customer requested cancellation");
    setIsCancelOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#111111]">Booking #{booking.bookingNumber}</h2>
            <BookingStatusBadge status={booking.status} />
            <UrgencyBadge urgency={booking.urgency} />
          </div>
          <p className="text-xs text-[#737373] mt-1">
            {booking.serviceName} • Scheduled for {booking.scheduledDate} at {booking.scheduledTime}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === "PAYMENT_COMPLETED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInvoiceOpen(true)}
              className="text-xs gap-1"
            >
              <FileText className="w-3.5 h-3.5" /> View Invoice
            </Button>
          )}

          {booking.status !== "CANCELLED" && booking.status !== "PAYMENT_COMPLETED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelOpen(true)}
              className="text-xs text-[#DC2626] hover:bg-[#DC2626]/5 border-[#DC2626]/20"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {booking.status !== "CANCELLED" && (
        <Card className="border-[#E5E5E5] p-5 bg-white">
          <div className="grid grid-cols-6 gap-1 relative">
            {stages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div key={stage.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? "bg-[#16A34A] text-white"
                        : isCurrent
                        ? "bg-[#111111] text-white ring-4 ring-[#111111]/10"
                        : "bg-[#F3F3F3] text-[#A3A3A3]"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] mt-2 leading-tight ${
                      isCurrent
                        ? "font-bold text-[#111111]"
                        : isPast
                        ? "font-medium text-[#16A34A]"
                        : "text-[#A3A3A3]"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="border-[#E5E5E5]">
            <CardHeader className="p-4 border-b border-[#E5E5E5]">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Assigned Cooperative Service Provider</span>
                <WorkerVerificationBadge status="APPROVED" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                  {booking.workerName ? booking.workerName.slice(0, 2).toUpperCase() : "CW"}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-[#111111]">
                    {booking.workerName || "Cooperative Assigned Worker"}
                  </h3>
                  <p className="text-[11px] text-[#737373]">{booking.cooperativeName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <RatingStars rating={4.9} size="sm" showNumber />
                    <span className="text-[10px] text-[#A3A3A3]">• 38 Cooperative Jobs Completed</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${booking.workerPhone || "+919811122334"}`}
                    className="p-2 rounded-md bg-[#F3F3F3] hover:bg-[#E5E5E5] text-[#111111]"
                    title="Call Worker"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {booking.workerCompletionNotes && (
                <div className="p-3 bg-[#F8F8F8] rounded-md border border-[#E5E5E5] mt-3 space-y-1">
                  <p className="text-[10px] font-bold text-[#111111] uppercase">Worker Job Completion Notes</p>
                  <p className="text-[#525252] text-xs leading-relaxed">{booking.workerCompletionNotes}</p>
                </div>
              )}

              {booking.status === "SERVICE_COMPLETED" && (
                <div className="p-4 bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-lg space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-[#16A34A] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Work Completed! Confirm & Proceed to Payment</span>
                  </div>
                  <p className="text-xs text-[#525252]">
                    Please inspect the work performed. When satisfied, proceed with the simulated payment.
                  </p>
                  <Button
                    onClick={handleConfirmCompletion}
                    className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold gap-1 mt-2"
                  >
                    <CreditCard className="w-4 h-4" /> Confirm & Pay ₹{booking.totalAmount}
                  </Button>
                </div>
              )}

              {booking.status === "PAYMENT_COMPLETED" && !existingRating && (
                <div className="p-3.5 bg-[#F8F8F8] border border-[#E5E5E5] rounded-lg flex items-center justify-between mt-3">
                  <div>
                    <p className="font-bold text-xs text-[#111111]">How was your service experience?</p>
                    <p className="text-[11px] text-[#737373]">Your rating directly impacts cooperative worker incentives.</p>
                  </div>
                  <Button
                    onClick={() => setIsRatingOpen(true)}
                    size="sm"
                    className="text-xs bg-[#111111] text-white gap-1"
                  >
                    <Star className="w-3.5 h-3.5" /> Rate Worker
                  </Button>
                </div>
              )}

              {existingRating && (
                <div className="p-3 bg-[#F8F8F8] rounded-md border border-[#E5E5E5] space-y-1 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#111111]">Your Submitted Review</span>
                    <RatingStars rating={existingRating.rating} size="sm" showNumber />
                  </div>
                  <p className="text-xs text-[#525252] italic">"{existingRating.feedback}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-right">
            <button
              onClick={() => setIsDisputeOpen(true)}
              className="text-xs text-[#737373] hover:text-[#DC2626] underline transition-colors"
            >
              Have an issue with this service? Raise a Cooperative Dispute
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-[#E5E5E5]">
            <CardHeader className="p-4 border-b border-[#E5E5E5]">
              <CardTitle className="text-sm font-bold">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="space-y-1">
                <p className="text-[10px] uppercase text-[#737373] font-semibold">Service Location</p>
                <p className="text-[#111111] font-medium leading-tight">{booking.customerAddress}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase text-[#737373] font-semibold">Problem Description</p>
                <p className="text-[#525252] leading-tight">{booking.description}</p>
              </div>

              <div className="pt-2 border-t border-[#E5E5E5] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#737373]">Service Charge</span>
                  <span>{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#111111] pt-1 border-t border-[#E5E5E5]">
                  <span>Total Amount</span>
                  <span>{formatCurrency(booking.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="max-w-md bg-white border border-[#E5E5E5]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Simulated Cooperative Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="p-3 bg-[#F8F8F8] rounded-md border border-[#E5E5E5]">
              <div className="flex justify-between font-semibold text-[#111111]">
                <span>Total Amount Due</span>
                <span className="text-sm">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <p className="text-[10px] text-[#737373] mt-1">
                88% direct worker share, 7% Cooperative Welfare, 5% Platform.
              </p>
            </div>

            <div>
              <label className="font-bold text-[#111111] block mb-2">Select Mock Payment Method</label>
              <div className="space-y-2">
                {[
                  { id: "MOCK_UPI", label: "Mock UPI (GPay / PhonePe / Paytm)" },
                  { id: "MOCK_CARD", label: "Mock Debit / Credit Card" },
                  { id: "MOCK_NETBANKING", label: "Mock NetBanking Simulation" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer ${
                      paymentMethod === m.id
                        ? "border-[#111111] bg-[#F8F8F8] font-bold"
                        : "border-[#E5E5E5] hover:bg-[#F8F8F8]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsPaymentOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExecutePayment}
              size="sm"
              className="bg-[#16A34A] hover:bg-[#15803D] text-white gap-1"
            >
              Pay {formatCurrency(booking.totalAmount)} <CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
        <DialogContent className="max-w-md bg-white border border-[#E5E5E5]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Rate & Review Worker</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="flex flex-col items-center justify-center p-3 bg-[#F8F8F8] rounded-md">
              <span className="font-bold text-sm text-[#111111] mb-2">Overall Experience</span>
              <RatingStars
                rating={ratingVal}
                size="lg"
                interactive={true}
                onRatingChange={setRatingVal}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Technical Skill & Quality</span>
                <RatingStars rating={skillRatingVal} interactive onRatingChange={setSkillRatingVal} />
              </div>
              <div className="flex justify-between items-center">
                <span>Punctuality & Arrival</span>
                <RatingStars rating={punctualityVal} interactive onRatingChange={setPunctualityVal} />
              </div>
              <div className="flex justify-between items-center">
                <span>Politeness & Professionalism</span>
                <RatingStars rating={politenessVal} interactive onRatingChange={setPolitenessVal} />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Written Feedback</label>
              <Textarea
                rows={3}
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                placeholder="Share your experience to help the cooperative maintain quality standards..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsRatingOpen(false)}>
              Skip
            </Button>
            <Button onClick={handleExecuteRating} size="sm" className="bg-[#111111] text-white">
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDisputeOpen} onOpenChange={setIsDisputeOpen}>
        <DialogContent className="max-w-md bg-white border border-[#E5E5E5]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#DC2626] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Raise Cooperative Dispute
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Dispute Reason</label>
              <Input
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="e.g. Work left incomplete, pricing mismatch"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Detailed Explanation</label>
              <Textarea
                rows={3}
                value={disputeDesc}
                onChange={(e) => setDisputeDesc(e.target.value)}
                placeholder="Describe the issue in detail. A cooperative society supervisor will investigate..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsDisputeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExecuteDispute} size="sm" variant="destructive">
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent className="max-w-md bg-white border border-[#E5E5E5]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Cancel Service Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <p className="text-[#525252]">Are you sure you want to cancel this booking?</p>
            <Input
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsCancelOpen(false)}>
              Keep Booking
            </Button>
            <Button onClick={handleExecuteCancel} size="sm" variant="destructive">
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        booking={booking}
        payment={existingPayment}
      />
    </div>
  );
}