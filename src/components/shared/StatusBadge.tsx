"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { BookingStatus, VerificationStatus, UrgencyLevel } from "@/types";
import { useI18n } from "@/lib/i18n";
import {
  Clock,
  Search,
  UserCheck,
  CheckCircle2,
  Calendar,
  Navigation,
  Wrench,
  CheckCheck,
  CreditCard,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Flame,
} from "lucide-react";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { t } = useI18n();

  switch (status) {
    case "REQUESTED":
      return (
        <Badge variant="outline" className="gap-1 border-[#E5E7EB] bg-[#F9FAF7] text-[#4B5563]">
          <Clock className="w-3 h-3 text-[#6B7280]" />
          {t("booking.status.REQUESTED")}
        </Badge>
      );
    case "MATCHING":
      return (
        <Badge variant="info" className="gap-1 animate-pulse-subtle">
          <Search className="w-3 h-3 text-[#142D52]" />
          {t("booking.status.MATCHING")}
        </Badge>
      );
    case "ASSIGNED":
      return (
        <Badge variant="info" className="gap-1">
          <UserCheck className="w-3 h-3 text-[#142D52]" />
          {t("booking.status.ASSIGNED")}
        </Badge>
      );
    case "ACCEPTED":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="w-3 h-3 text-[#047857]" />
          {t("booking.status.ACCEPTED")}
        </Badge>
      );
    case "SCHEDULED":
      return (
        <Badge variant="outline" className="gap-1 border-[#E5E7EB] bg-white text-[#1F2937]">
          <Calendar className="w-3 h-3 text-[#142D52]" />
          {t("booking.status.SCHEDULED")}
        </Badge>
      );
    case "WORKER_EN_ROUTE":
      return (
        <Badge variant="warning" className="gap-1 animate-pulse-subtle">
          <Navigation className="w-3 h-3 text-[#D97706]" />
          {t("booking.status.WORKER_EN_ROUTE")}
        </Badge>
      );
    case "SERVICE_STARTED":
      return (
        <Badge variant="warning" className="gap-1">
          <Wrench className="w-3 h-3 text-[#D97706]" />
          {t("booking.status.SERVICE_STARTED")}
        </Badge>
      );
    case "SERVICE_COMPLETED":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCheck className="w-3 h-3 text-[#047857]" />
          {t("booking.status.SERVICE_COMPLETED")}
        </Badge>
      );
    case "PAYMENT_PENDING":
      return (
        <Badge variant="warning" className="gap-1">
          <CreditCard className="w-3 h-3 text-[#D97706]" />
          {t("booking.status.PAYMENT_PENDING")}
        </Badge>
      );
    case "PAYMENT_COMPLETED":
    case "PAYOUT_COMPLETED":
      return (
        <Badge variant="success" className="gap-1 bg-[#047857] text-white">
          <CheckCheck className="w-3 h-3" />
          {t("booking.status.PAYMENT_COMPLETED")}
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3 text-[#DC2626]" />
          {t("booking.status.CANCELLED")}
        </Badge>
      );
    case "DISPUTED":
      return (
        <Badge variant="destructive" className="gap-1 bg-[#DC2626] text-white">
          <AlertTriangle className="w-3 h-3" />
          {t("booking.status.DISPUTED")}
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge variant="outline" className="gap-1 border-[#E5E7EB] text-[#4B5563]">
          <RotateCcw className="w-3 h-3" />
          {t("booking.status.REFUNDED")}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function WorkerVerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  const { t } = useI18n();

  switch (status) {
    case "APPROVED":
      return (
        <Badge variant="success" className="gap-1 font-medium bg-[#047857]/15 text-[#047857]">
          <ShieldCheck className="w-3.5 h-3.5" />
          {t("verification.APPROVED")}
        </Badge>
      );
    case "COOPERATIVE_VERIFIED":
      return (
        <Badge variant="default" className="gap-1 bg-[#142D52] text-white">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
          {t("verification.COOPERATIVE_VERIFIED")}
        </Badge>
      );
    case "SKILL_VERIFIED":
      return (
        <Badge variant="info" className="gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t("verification.SKILL_VERIFIED")}
        </Badge>
      );
    case "DOCUMENT_PENDING":
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="w-3.5 h-3.5" />
          {t("verification.DOCUMENT_PENDING")}
        </Badge>
      );
    case "SUSPENDED":
      return (
        <Badge variant="destructive" className="gap-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          {t("verification.SUSPENDED")}
        </Badge>
      );
    case "UNVERIFIED":
    default:
      return (
        <Badge variant="outline" className="gap-1 text-[#6B7280]">
          {t("verification.UNVERIFIED")}
        </Badge>
      );
  }
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  const { t } = useI18n();
  if (urgency === "EMERGENCY") {
    return (
      <Badge variant="destructive" className="gap-1 bg-[#DC2626] text-white font-semibold">
        <Flame className="w-3 h-3 fill-white" />
        {t("common.emergency")}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1 text-[#4B5563]">
      {t("common.normal")}
    </Badge>
  );
}