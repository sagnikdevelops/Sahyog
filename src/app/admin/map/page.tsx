"use client";

import React from "react";
import { AdminOperationsMap } from "@/components/maps/AdminOperationsMap";

export default function AdminMapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4">
        <h1 className="text-2xl font-bold text-[#111111]">GIS Operations Radar</h1>
        <p className="text-xs text-[#737373]">
          Real-time OpenStreetMap & PostGIS spatial visualization of cooperative technicians and active jobs.
        </p>
      </div>

      <AdminOperationsMap />
    </div>
  );
}