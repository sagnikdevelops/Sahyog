"use client";

import React from "react";
import { useAppState } from "@/lib/store/stateContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, MapPin } from "lucide-react";
import { normalizeWorkerRecord } from "@/lib/auth/authHelpers";

export function AvailabilityToggle({ workerId }: { workerId: string }) {
  const { workers, toggleWorkerAvailability } = useAppState();
  const worker = workers.find((w) => w.id === workerId) ?? normalizeWorkerRecord({ id: workerId, profile: { id: workerId, email: "", fullName: "Worker", phone: "", role: "WORKER", address: "", city: "", state: "", postalCode: "", lat: 0, lng: 0, createdAt: "", updatedAt: "" } });

  return (
    <Card className={`border transition-all ${
      worker.isAvailable
        ? "border-[#047857]/40 bg-[#047857]/5"
        : "border-[#E5E7EB] bg-[#F9FAF7]"
    }`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${
            worker.isAvailable ? "bg-[#047857] shadow-sm" : "bg-[#6B7280]"
          }`}>
            <Power className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#142D52]">
                {worker.isAvailable ? "Online & Ready for Jobs" : "Offline / On Break"}
              </h3>
              <Badge variant={worker.isAvailable ? "success" : "secondary"} className="text-[10px]">
                {worker.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <p className="text-[11px] text-[#6B7280] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#047857]" />
              Operating within {worker.serviceRadiusKm} km of {worker.profile.city} ({worker.cooperativeName})
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleWorkerAvailability(worker.id)}
          className={`px-4 py-2 rounded-md font-semibold text-xs transition-all shadow-sm ${
            worker.isAvailable
              ? "bg-[#142D52] text-white hover:bg-[#0E203B]"
              : "bg-[#047857] text-white hover:bg-[#065F46]"
          }`}
        >
          {worker.isAvailable ? "Go Offline" : "Go Online"}
        </button>
      </CardContent>
    </Card>
  );
}
