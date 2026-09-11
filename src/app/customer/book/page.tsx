"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { BookingWizard } from "@/components/customer/BookingWizard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BookServicePage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E7EB] pb-4">
        <Badge variant="outline" className="text-xs border-[#E5E7EB] text-[#142D52]">Sahyog Booking Engine</Badge>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#142D52]">Request a Verified Cooperative Service</h1>
          <p className="text-xs text-[#6B7280]">
            Step-by-step service request, location geo-matching, and transparent pricing.
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="w-fit gap-1.5 border-[#142D52] bg-white text-xs font-semibold text-[#142D52] hover:bg-[#142D52] hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Button>

      <Suspense fallback={<div className="text-center py-12 text-xs text-[#6B7280]">Loading booking engine...</div>}>
        <BookingWizard />
      </Suspense>
    </div>
  );
}