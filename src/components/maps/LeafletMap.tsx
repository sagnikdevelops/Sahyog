"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type?: "WORKER" | "CUSTOMER" | "EMERGENCY" | "SOCIETY";
  status?: string;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  className?: string;
  selectedMarkerId?: string;
}

// Inner Leaflet component that only loads on client
function MapInternal({
  center = [28.628, 77.3649],
  zoom = 13,
  markers = [],
  interactive = false,
  onLocationSelect,
  className,
}: MapProps) {
  const [LInstance, setLInstance] = useState<any>(null);
  const [mapElementId] = useState(() => `map_${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let map: any = null;

    import("leaflet").then((L) => {
      setLInstance(L);

      // Fix default leaflet icons in webpack/next
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const container = document.getElementById(mapElementId);
      if (!container) return;

      map = L.map(mapElementId, {
        center,
        zoom,
        zoomControl: true,
      });

      // Monochrome / clean OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Render markers
      markers.forEach((m) => {
        let markerColor = "#111111";
        if (m.type === "EMERGENCY") markerColor = "#DC2626";
        if (m.type === "WORKER") markerColor = "#16A34A";
        if (m.type === "CUSTOMER") markerColor = "#2563EB";
        if (m.type === "SOCIETY") markerColor = "#111111";

        const customIcon = L.divIcon({
          className: "custom-map-pin",
          html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">${
            m.type === "EMERGENCY" ? "🚨" : m.type === "WORKER" ? "🛠️" : "📍"
          }</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <div style="font-weight: bold; font-size: 13px; color: #111111;">${m.title}</div>
            ${m.subtitle ? `<div style="font-size: 11px; color: #525252; margin-top: 2px;">${m.subtitle}</div>` : ""}
            ${m.status ? `<div style="font-size: 10px; margin-top: 4px; display: inline-block; padding: 2px 6px; background: #F3F3F3; border-radius: 4px; color: #171717;">${m.status}</div>` : ""}
          </div>
        `);
      });

      if (interactive && onLocationSelect) {
        map.on("click", (e: any) => {
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
      }
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [center, zoom, markers, interactive, onLocationSelect, mapElementId]);

  return <div id={mapElementId} className={`w-full h-full min-h-[300px] rounded-lg ${className || ""}`} />;
}

export const LeafletMap = dynamic(() => Promise.resolve(MapInternal), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 bg-[#F8F8F8] border border-[#E5E5E5] rounded-lg flex items-center justify-center text-xs text-[#737373] animate-pulse">
      Loading OpenStreetMap Layer...
    </div>
  ),
});