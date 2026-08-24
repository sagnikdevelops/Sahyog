"use client";

import React from "react";
import { Booking, Payment } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Handshake, Download, Printer, ShieldCheck } from "lucide-react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  payment?: Payment;
}

export function InvoiceModal({ isOpen, onClose, booking, payment }: InvoiceModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = payment?.invoiceNumber || `INV-${booking.bookingNumber}`;
  const txnRef = payment?.transactionRef || booking.transactionRef || "TXN_SIMULATED_2026";
  const dateStr = formatDate(booking.updatedAt || booking.createdAt, "dd MMMM yyyy");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 bg-white border border-[#E5E5E5]">
        <DialogHeader className="border-b border-[#E5E5E5] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#111111] flex items-center justify-center text-white">
                <Handshake className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-[#111111]">Sahyog Invoicing</DialogTitle>
                <p className="text-[10px] text-[#737373]">Cooperative Digital Marketplace</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-[#16A34A]/10 text-[#16A34A] px-2 py-0.5 rounded font-semibold border border-[#16A34A]/20">
                PAID & SETTLED
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-xs py-2">
          <div className="grid grid-cols-2 gap-2 text-[#737373]">
            <div>
              <p className="text-[10px] uppercase text-[#A3A3A3]">Invoice Number</p>
              <p className="font-semibold text-[#111111]">{invoiceNo}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase text-[#A3A3A3]">Date of Service</p>
              <p className="font-semibold text-[#111111]">{dateStr}</p>
            </div>
          </div>

          <div className="p-3 bg-[#F8F8F8] rounded-md border border-[#E5E5E5] space-y-1">
            <p className="text-[10px] uppercase text-[#737373] font-semibold">Service Beneficiary</p>
            <p className="font-bold text-[#111111]">{booking.customerName}</p>
            <p className="text-[#525252] text-[11px]">{booking.customerAddress}</p>
          </div>

          <div className="p-3 bg-[#F8F8F8] rounded-md border border-[#E5E5E5] space-y-1">
            <p className="text-[10px] uppercase text-[#737373] font-semibold">Service Performed By</p>
            <p className="font-bold text-[#111111]">{booking.workerName || "Verified Cooperative Technician"}</p>
            <p className="text-[#525252] text-[11px]">{booking.cooperativeName}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-[#E5E5E5]">
              <span className="text-[#525252]">{booking.serviceName} ({booking.urgency})</span>
              <span className="font-bold text-[#111111]">{formatCurrency(booking.totalAmount)}</span>
            </div>
            
            {/* Transparent Cooperative Fee Breakdown */}
            <div className="space-y-1 text-[11px] text-[#737373] pt-1">
              <div className="flex justify-between">
                <span>Direct Worker Remuneration (88%)</span>
                <span>{formatCurrency(booking.workerPayoutAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cooperative Welfare Fund (7%)</span>
                <span>{formatCurrency(booking.cooperativeFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Digital Ops Fee (5%)</span>
                <span>{formatCurrency(booking.platformFee)}</span>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between text-sm font-bold text-[#111111]">
              <span>Total Paid</span>
              <span>{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

          <div className="bg-[#F3F3F3] p-2.5 rounded text-[11px] text-[#525252] space-y-0.5">
            <p><span className="font-semibold">Txn Reference:</span> {txnRef}</p>
            <p><span className="font-semibold">Payment Mode:</span> {booking.paymentMethod || "MOCK_UPI"}</p>
            <div className="flex items-center gap-1 text-[#16A34A] pt-1 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>Cooperative Trust & Fair Wage Compliant</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1 text-xs">
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          <Button variant="default" size="sm" onClick={onClose} className="text-xs">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}