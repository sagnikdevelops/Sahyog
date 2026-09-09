"use client";

import React from "react";
import { AdminOperationsMap } from "@/components/maps/AdminOperationsMap";

export default function AdminMapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E7EB] pb-4">
        <h1 className="text-2xl font-bold text-[#142D52]">GIS Operations Radar</h1>
        <p className="text-xs text-[#6B7280]">
          Real-time OpenStreetMap &amp; PostGIS spatial visualization of cooperative technicians and active jobs.
        </p>
      </div>

      <AdminOperationsMap />
    </div>
  );
}