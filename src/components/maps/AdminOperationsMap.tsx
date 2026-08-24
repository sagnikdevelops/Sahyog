"use client";

import React, { useState } from "react";
import { LeafletMap, MapMarker } from "./LeafletMap";
import { useAppState } from "@/lib/store/stateContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, ShieldCheck, UserCheck, MapPin } from "lucide-react";

export function AdminOperationsMap() {
  const { workers, bookings } = useAppState();
  const [filter, setFilter] = useState<"ALL" | "EMERGENCY" | "WORKERS" | "BOOKINGS">("ALL");

  // Build markers
  const markers: MapMarker[] = [];

  // Add Worker markers
  if (filter === "ALL" || filter === "WORKERS") {
    workers.forEach((w) => {
      markers.push({
        id: w.id,
        lat: w.currentLat,
        lng: w.currentLng,
        title: `${w.profile.fullName} (${w.skills[0]?.skillName || "Skilled Worker"})`,
        subtitle: `${w.cooperativeName} • ${w.isAvailable ? "Available" : "Busy"}`,
        type: "WORKER",
        status: w.verificationStatus,
      });
    });
  }

  // Add Booking markers
  if (filter === "ALL" || filter === "BOOKINGS" || filter === "EMERGENCY") {
    bookings.forEach((b) => {
      if (filter === "EMERGENCY" && b.urgency !== "EMERGENCY") return;
      markers.push({
        id: b.id,
        lat: b.customerLat,
        lng: b.customerLng,
        title: `${b.urgency === "EMERGENCY" ? "🚨 " : ""}${b.serviceName}`,
        subtitle: `${b.customerAddress} • ₹${b.totalAmount}`,
        type: b.urgency === "EMERGENCY" ? "EMERGENCY" : "CUSTOMER",
        status: b.status,
      });
    });
  }

  const activeEmergencies = bookings.filter((b) => b.urgency === "EMERGENCY" && b.status !== "PAYMENT_COMPLETED").length;
  const onlineWorkers = workers.filter((w) => w.isAvailable).length;

  return (
    <Card className="border-[#E5E5E5]">
      <CardHeader className="p-4 border-b border-[#E5E5E5] flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#111111]" />
            Live Cooperative Operations Map
          </CardTitle>
          <p className="text-xs text-[#737373] mt-0.5">
            Geographic PostGIS distribution of active service requests & verified workforce
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filter === "ALL" ? "bg-[#111111] text-white font-medium" : "bg-[#F3F3F3] text-[#525252]"
            }`}
          >
            All Pins ({markers.length})
          </button>
          <button
            onClick={() => setFilter("EMERGENCY")}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              filter === "EMERGENCY" ? "bg-[#DC2626] text-white font-medium" : "bg-[#F3F3F3] text-[#525252]"
            }`}
          >
            <Flame className="w-3 h-3" />
            Emergency ({activeEmergencies})
          </button>
          <button
            onClick={() => setFilter("WORKERS")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filter === "WORKERS" ? "bg-[#111111] text-white font-medium" : "bg-[#F3F3F3] text-[#525252]"
            }`}
          >
            Workers ({onlineWorkers} Online)
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-[450px] relative">
        <LeafletMap center={[28.628, 77.3649]} zoom={13} markers={markers} />

        {/* Overlay Legend */}
        <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur border border-[#E5E5E5] rounded-lg p-2.5 shadow-md text-xs space-y-1.5">
          <p className="font-bold text-[11px] text-[#111111] border-b border-[#E5E5E5] pb-1">
            Map Legend
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#171717]">
            <span className="w-3 h-3 rounded-full bg-[#16A34A] inline-block" />
            <span>Cooperative Worker (Online)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#171717]">
            <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block" />
            <span>Standard Customer Booking</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#171717]">
            <span className="w-3 h-3 rounded-full bg-[#DC2626] inline-block" />
            <span>Emergency Request Radar</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}