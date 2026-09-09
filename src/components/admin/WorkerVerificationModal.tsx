"use client";

import React, { useState } from "react";
import { WorkerProfile, VerificationStatus } from "@/types";
import { useAppState } from "@/lib/store/stateContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WorkerVerificationBadge } from "@/components/shared/StatusBadge";
import { ShieldCheck, UserCheck, AlertTriangle } from "lucide-react";

interface WorkerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: WorkerProfile;
}

export function WorkerVerificationModal({
  isOpen,
  onClose,
  worker,
}: WorkerVerificationModalProps) {
  const { updateWorkerVerification } = useAppState();
  const [status, setStatus] = useState<VerificationStatus>(worker.verificationStatus);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    updateWorkerVerification(worker.id, status, notes);
    onClose();
  };

  const statuses: { val: VerificationStatus; label: string; desc: string }[] = [
    { val: "UNVERIFIED", label: "Unverified", desc: "No documents submitted yet" },
    { val: "DOCUMENT_PENDING", label: "Documents Pending", desc: "Awaiting Aadhaar / address / skill proofs" },
    { val: "COOPERATIVE_VERIFIED", label: "Verified by Cooperative", desc: "Verified by Society Member Committee" },
    { val: "SKILL_VERIFIED", label: "Skill & Trade Certified", desc: "NSDC / ITI certification verified" },
    { val: "APPROVED", label: "Fully Approved", desc: "Active member in good standing" },
    { val: "SUSPENDED", label: "Suspended", desc: "Temporarily blocked from receiving new jobs" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border border-[#E5E7EB]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-[#142D52]">
            <ShieldCheck className="w-5 h-5 text-[#047857]" />
            Verify Worker: {worker.profile?.fullName || "Unknown Worker"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 bg-[#F9FAF7] rounded-md border border-[#E5E7EB]">
            <p className="font-bold text-[#142D52]">{worker.profile?.fullName || "Unknown Worker"}</p>
            <p className="text-[#6B7280] text-[11px]">{worker.cooperativeName || "Unknown Cooperative"}</p>
            <p className="text-[#4B5563] mt-1">
              {Array.isArray(worker.skills) ? worker.skills.map((s) => s?.skillName).filter(Boolean).join(", ") || "General Skilled Labour" : "General Skilled Labour"}
            </p>
          </div>

          <div>
            <label className="font-bold text-[#142D52] block mb-2">Set Verification Pipeline State</label>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {statuses.map((s) => (
                <label
                  key={s.val}
                  className={`flex items-start gap-2 p-2.5 rounded border cursor-pointer transition-colors ${
                    status === s.val
                      ? "border-[#047857] bg-[#047857]/5 font-bold"
                      : "border-[#E5E7EB] hover:bg-[#F9FAF7]"
                  }`}
                >
                  <input
                    type="radio"
                    name="workerStatus"
                    value={s.val}
                    checked={status === s.val}
                    onChange={() => setStatus(s.val)}
                    className="mt-0.5 accent-[#047857]"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-[#142D52]">{s.label}</span>
                    <span className="text-[10px] text-[#6B7280]">{s.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#1F2937] block mb-1">Supervisor Audit Notes</label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified trade certificate and cooperative membership roll."
              className="border-[#E5E7EB] focus:ring-[#047857]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} className="border-[#E5E7EB] text-[#1F2937]">
            Cancel
          </Button>
          <Button onClick={handleSave} size="sm" className="bg-[#047857] hover:bg-[#065F46] text-white">
            Save Verification Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}