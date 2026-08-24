"use client";

import React, { useState } from "react";
import { useAppState } from "@/lib/store/stateContext";
import { Dispute } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, ShieldAlert, FileText, ArrowRight } from "lucide-react";

export default function AdminDisputesPage() {
  const { disputes, resolveDisputeAction } = useAppState();
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionType, setActionType] = useState<"REFUND_FULL" | "REFUND_PARTIAL" | "RE_SERVICE" | "REJECTED">("REFUND_PARTIAL");

  const handleResolve = () => {
    if (!selectedDispute) return;
    if (!adminNotes.trim()) {
      alert("Please provide supervisor audit notes.");
      return;
    }
    resolveDisputeAction(selectedDispute.id, actionType, adminNotes);
    setSelectedDispute(null);
    setAdminNotes("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4">
        <h1 className="text-2xl font-bold text-[#111111]">Dispute Resolution Center</h1>
        <p className="text-xs text-[#737373]">
          Investigate customer grievances, review evidence, and execute fair cooperative settlements.
        </p>
      </div>

      <div className="space-y-4">
        {disputes.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg border border-[#E5E5E5] text-xs text-[#737373]">
            No disputes on record. Customer satisfaction is 100% in good standing.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {disputes.map((d) => (
              <Card key={d.id} className="border-[#E5E5E5] bg-white">
                <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111111]">Dispute on #{d.bookingNumber}</span>
                      <Badge variant={d.status === "RESOLVED" ? "success" : "destructive"} className="text-[10px]">
                        {d.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm text-[#DC2626] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {d.reason}
                    </h3>
                    <p className="text-[#525252] leading-relaxed">{d.description}</p>
                    <p className="text-[10px] text-[#737373]">
                      Filed by {d.raisedByName} on {formatDate(d.createdAt)}
                    </p>

                    {d.status === "RESOLVED" && (
                      <div className="p-3 bg-[#F8F8F8] rounded border border-[#E5E5E5] mt-2 space-y-0.5">
                        <p className="font-bold text-[11px] text-[#16A34A]">Resolution: {d.resolutionAction}</p>
                        <p className="text-[#525252] text-[11px]">{d.adminNotes}</p>
                        <p className="text-[10px] text-[#737373]">Resolved by: {d.resolvedBy} on {formatDate(d.resolvedAt || d.createdAt)}</p>
                      </div>
                    )}
                  </div>

                  {d.status !== "RESOLVED" && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedDispute(d)}
                      className="text-xs bg-[#111111] text-white hover:bg-[#262626] shrink-0"
                    >
                      Investigate & Resolve
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Resolution Dialog */}
      <Dialog open={Boolean(selectedDispute)} onOpenChange={() => setSelectedDispute(null)}>
        <DialogContent className="max-w-md bg-white border border-[#E5E5E5]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Resolve Dispute</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-[#F8F8F8] rounded border border-[#E5E5E5]">
              <p className="font-bold text-[#111111]">Booking #{selectedDispute?.bookingNumber}</p>
              <p className="text-[#DC2626] font-semibold mt-0.5">{selectedDispute?.reason}</p>
              <p className="text-[#525252] mt-1">{selectedDispute?.description}</p>
            </div>

            <div>
              <label className="font-bold text-[#111111] block mb-1">Resolution Action</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full h-9 rounded-md border border-[#E5E5E5] bg-white px-3 text-xs"
              >
                <option value="REFUND_PARTIAL">Partial Goodwill Concession (e.g. ₹50)</option>
                <option value="REFUND_FULL">Full Refund to Customer</option>
                <option value="RE_SERVICE">Free Re-service by Senior Master Worker</option>
                <option value="REJECTED">Reject Grievance (Service Deemed Complete)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Cooperative Committee Notes *</label>
              <Textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Detail the investigation and resolution agreed upon..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSelectedDispute(null)}>
              Cancel
            </Button>
            <Button onClick={handleResolve} size="sm" className="bg-[#16A34A] hover:bg-[#15803D] text-white">
              Confirm Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}