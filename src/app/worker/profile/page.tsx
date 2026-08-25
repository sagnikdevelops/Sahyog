"use client";

import React from "react";
import { useAppState } from "@/lib/store/stateContext";
import { normalizeWorkerRecord } from "@/lib/auth/authHelpers";
import { WorkerVerificationBadge } from "@/components/shared/StatusBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Award, Wrench, Calendar, CheckCircle2 } from "lucide-react";

export default function WorkerProfilePage() {
  const { currentUser, workers } = useAppState();
  const worker =
    workers.find((w) => w.id === currentUser.id) ||
    workers[0] ||
    normalizeWorkerRecord({
      id: currentUser.id,
      profile: { ...currentUser, role: "WORKER" },
      cooperativeName: "Unassigned Cooperative",
    });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#111111]">{worker.profile?.fullName || "Worker"}</h1>
            <WorkerVerificationBadge status={worker.verificationStatus} />
          </div>
           <p className="text-xs text-[#737373] mt-0.5">{worker.cooperativeName || "Unassigned Cooperative"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skills & Certifications (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-[#E5E5E5]">
            <CardHeader className="p-4 border-b border-[#E5E5E5]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#111111]" />
                Certified Trade Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {(Array.isArray(worker.skills) ? worker.skills : []).length === 0 ? (
                <p className="text-xs text-[#737373]">No skills added yet. Please update your profile after registration.</p>
              ) : (
                (Array.isArray(worker.skills) ? worker.skills : []).map((s) => (
                  <div key={s?.id || Math.random()} className="p-3 bg-[#F8F8F8] rounded-md border border-[#E5E5E5] flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-[#111111]">{s?.skillName || "General Labour"}</h4>
                      <p className="text-[11px] text-[#737373]">{s?.serviceName || "General Service"}</p>
                    </div>
                    {s?.isVerified ? (
                      <Badge variant="success" className="text-[10px] gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Certified by Society
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px]">Verification Pending</Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-[#E5E5E5]">
            <CardHeader className="p-4 border-b border-[#E5E5E5]">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-[#111111]" />
                Professional Certifications & Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              {(Array.isArray(worker.certifications) ? worker.certifications : []).length === 0 ? (
                <p className="text-xs text-[#737373]">No certificates uploaded yet.</p>
              ) : (
                (Array.isArray(worker.certifications) ? worker.certifications : []).map((c) => (
                  <div key={c?.id || Math.random()} className="p-3 bg-[#F8F8F8] rounded-md border border-[#E5E5E5] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#111111]">{c?.title || "Certificate"}</span>
                      <span className="text-[10px] text-[#16A34A] font-semibold bg-[#16A34A]/10 px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-[#737373]">Issued by: {c?.issuingBody || "Cooperative"} • {c?.issueDate || "Not available"}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bio & Ratings Column */}
        <div className="space-y-6">
          <Card className="border-[#E5E5E5]">
            <CardHeader className="p-4 border-b border-[#E5E5E5]">
              <CardTitle className="text-sm font-bold">Worker Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <p className="text-[10px] uppercase text-[#737373] font-semibold">Experience</p>
                <p className="font-bold text-[#111111]">{worker.experienceYears} Years in Trade</p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-[#737373] font-semibold">Service Area</p>
                <p className="font-medium text-[#111111]">{worker.serviceRadiusKm || 10} km around {worker.profile?.city || "your area"}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-[#737373] font-semibold">Bio</p>
                <p className="text-[#525252] leading-relaxed mt-0.5">{worker.bio}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}