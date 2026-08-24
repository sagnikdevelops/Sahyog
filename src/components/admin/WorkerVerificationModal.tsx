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
      <DialogContent className="max-w-md bg-white border border-[#E5E5E5]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
            Verify Worker: {worker.profile.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 bg-[#F8F8F8] rounded-md border border-[#E5E5E5]">
            <p className="font-bold text-[#111111]">{worker.profile.fullName}</p>
            <p className="text-[#737373] text-[11px]">{worker.cooperativeName}</p>
            <p className="text-[#525252] mt-1">{worker.skills.map((s) => s.skillName).join(", ") || "General Skilled Labour"}</p>
          </div>

          <div>
            <label className="font-bold text-[#111111] block mb-2">Set Verification Pipeline State</label>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {statuses.map((s) => (
                <label
                  key={s.val}
                  className={`flex items-start gap-2 p-2.5 rounded border cursor-pointer ${
                    status === s.val
                      ? "border-[#111111] bg-[#F8F8F8] font-bold"
                      : "border-[#E5E5E5] hover:bg-[#F8F8F8]"
                  }`}
                >
                  <input
                    type="radio"
                    name="workerStatus"
                    value={s.val}
                    checked={status === s.val}
                    onChange={() => setStatus(s.val)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-[#111111]">{s.label}</span>
                    <span className="text-[10px] text-[#737373]">{s.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Supervisor Audit Notes</label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified trade certificate and cooperative membership roll."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} size="sm" className="bg-[#111111] text-white">
            Save Verification Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}