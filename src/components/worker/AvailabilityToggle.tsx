"use client";

import React from "react";
import { useAppState } from "@/lib/store/stateContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, MapPin } from "lucide-react";

export function AvailabilityToggle({ workerId }: { workerId: string }) {
  const { workers, toggleWorkerAvailability } = useAppState();
  const worker = workers.find((w) => w.id === workerId) || workers[0];

  return (
    <Card className={`border transition-all ${
      worker.isAvailable
        ? "border-[#16A34A]/40 bg-[#16A34A]/5"
        : "border-[#E5E5E5] bg-[#F8F8F8]"
    }`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${
            worker.isAvailable ? "bg-[#16A34A]" : "bg-[#737373]"
          }`}>
            <Power className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#111111]">
                {worker.isAvailable ? "Online & Ready for Jobs" : "Offline / On Break"}
              </h3>
              <Badge variant={worker.isAvailable ? "success" : "secondary"} className="text-[10px]">
                {worker.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <p className="text-[11px] text-[#737373] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#525252]" />
              Operating within {worker.serviceRadiusKm} km of {worker.profile.city} ({worker.cooperativeName})
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleWorkerAvailability(worker.id)}
          className={`px-4 py-2 rounded-md font-semibold text-xs transition-all shadow-sm ${
            worker.isAvailable
              ? "bg-[#111111] text-white hover:bg-[#262626]"
              : "bg-[#16A34A] text-white hover:bg-[#15803D]"
          }`}
        >
          {worker.isAvailable ? "Go Offline" : "Go Online"}
        </button>
      </CardContent>
    </Card>
  );
}