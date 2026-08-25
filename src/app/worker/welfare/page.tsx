"use client";

import React from "react";
import { useAppState } from "@/lib/store/stateContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, HeartHandshake, FileCheck, CheckCircle2 } from "lucide-react";
import { normalizeWorkerRecord } from "@/lib/auth/authHelpers";

export default function WorkerWelfarePage() {
  const { currentUser, workers } = useAppState();
  const worker =
    workers.find((w) => w.id === currentUser.id) ||
    normalizeWorkerRecord({
      id: currentUser.id,
      profile: { ...currentUser, role: "WORKER" },
      cooperativeName: "Unassigned Cooperative",
    });

  const welfarePolicies = Array.isArray(worker.welfare) ? worker.welfare : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4">
        <h1 className="text-2xl font-bold text-[#111111]">Worker Social Security & Welfare</h1>
        <p className="text-xs text-[#737373]">
          Insurance schemes and healthcare coverage provided through {worker.cooperativeName || "Unassigned Cooperative"}.
        </p>
      </div>

      <div className="space-y-4">
        {welfarePolicies.length === 0 ? (
          <div className="p-6 bg-[#F8F8F8] rounded-lg border border-[#E5E5E5] text-xs text-[#525252]">
            Enrolled in General Cooperative Membership Welfare Fund. Group accident coverage activates upon document verification.
          </div>
        ) : (
          welfarePolicies.map((w) => (
            <Card key={w.id || Math.random()} className="border-[#E5E5E5] bg-white p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#111111]">{w.schemeName || "General Welfare Policy"}</h3>
                    <p className="text-[11px] text-[#737373]">Policy No: {w.policyNo || "Pending"}</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">ACTIVE POLICY</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-[#E5E5E5]">
                <div>
                  <span className="text-[10px] uppercase text-[#737373]">Coverage Sum</span>
                  <p className="font-bold text-[#111111]">₹{Number(w.coverageAmount || 0).toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#737373]">Underwriter / Trust</span>
                  <p className="font-semibold text-[#525252]">{w.provider || "Cooperative Welfare Board"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#737373]">Valid Until</span>
                  <p className="font-semibold text-[#525252]">{w.validUntil || "Pending verification"}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
