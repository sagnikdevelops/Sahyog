"use client";

import React, { useState } from "react";
import { useAppState } from "@/lib/store/stateContext";
import { WorkerProfile, VerificationStatus } from "@/types";
import { WorkerVerificationBadge } from "@/components/shared/StatusBadge";
import { WorkerVerificationModal } from "@/components/admin/WorkerVerificationModal";
import { RatingStars } from "@/components/shared/RatingStars";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldCheck, CheckCircle2, AlertTriangle, HardHat, Phone, MapPin } from "lucide-react";

export default function AdminWorkersPage() {
  const { workers } = useAppState();
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  const filteredWorkers = workers.filter((w) => {
    const matchesStatus = filter === "ALL" || w.verificationStatus === filter;
    const matchesSearch =
      w.profile.fullName.toLowerCase().includes(search.toLowerCase()) ||
      w.cooperativeName.toLowerCase().includes(search.toLowerCase()) ||
      w.skills.some((s) => s.skillName.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Cooperative Workforce & Verification</h1>
          <p className="text-xs text-[#737373]">
            Manage member onboarding, trade certifications, skill validation, and suspension.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto text-xs">
          {[
            { id: "ALL", label: "All Members" },
            { id: "APPROVED", label: "Approved" },
            { id: "COOPERATIVE_VERIFIED", label: "Cooperative Verified" },
            { id: "DOCUMENT_PENDING", label: "Docs Pending" },
            { id: "UNVERIFIED", label: "Unverified" },
            { id: "SUSPENDED", label: "Suspended" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 rounded-full font-medium border transition-colors ${
                filter === item.id
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-[#525252] border-[#E5E5E5] hover:bg-[#F8F8F8]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#737373]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search worker or trade..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Workers Directory Table */}
      <Card className="border-[#E5E5E5]">
        <CardContent className="p-0">
          <div className="divide-y divide-[#E5E5E5] text-xs">
            {filteredWorkers.map((w) => (
              <div key={w.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#F8F8F8] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {w.profile.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#111111]">{w.profile.fullName}</span>
                      <WorkerVerificationBadge status={w.verificationStatus} />
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        w.isAvailable ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-[#F3F3F3] text-[#737373]"
                      }`}>
                        {w.isAvailable ? "Online" : "Offline"}
                      </span>
                    </div>
                    <p className="text-[#737373] text-[11px]">{w.cooperativeName}</p>
                    <p className="text-[#525252] text-xs">
                      Skills: {w.skills.map((s) => s.skillName).join(", ") || "General Labour"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right text-[11px] text-[#737373]">
                    <p className="font-semibold text-[#111111]">{w.completedServicesCount} Jobs Completed</p>
                    <RatingStars rating={w.ratingAvg || 5} size="sm" showNumber />
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setSelectedWorker(w)}
                    className="text-xs bg-[#111111] text-white hover:bg-[#262626]"
                  >
                    Verify & Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedWorker && (
        <WorkerVerificationModal
          isOpen={Boolean(selectedWorker)}
          onClose={() => setSelectedWorker(null)}
          worker={selectedWorker}
        />
      )}
    </div>
  );
}