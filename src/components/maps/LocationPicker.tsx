"use client";

import React, { useState } from "react";
import { LeafletMap } from "./LeafletMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Check } from "lucide-react";

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

export function LocationPicker({
  initialLat = 28.628,
  initialLng = 77.3649,
  initialAddress = "Sector 62, Noida, Uttar Pradesh",
  onLocationChange,
}: LocationPickerProps) {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [address, setAddress] = useState(initialAddress);
  const [isLocating, setIsLocating] = useState(false);

  const handleMapClick = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    const mockAddress = `Coordinates: ${newLat.toFixed(4)}, ${newLng.toFixed(4)} (Sector Zone, NCR)`;
    setAddress(mockAddress);
    onLocationChange(newLat, newLng, mockAddress);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setLat(userLat);
        setLng(userLng);
        const geoAddress = `Current GPS Location (${userLat.toFixed(4)}, ${userLng.toFixed(4)})`;
        setAddress(geoAddress);
        onLocationChange(userLat, userLng, geoAddress);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation fallback:", error);
        // Fallback to Noida cooperative district
        const defaultLat = 28.628;
        const defaultLng = 77.3649;
        setLat(defaultLat);
        setLng(defaultLng);
        const fallbackAddress = "Sector 62, Noida, Uttar Pradesh (Cooperative Hub)";
        setAddress(fallbackAddress);
        onLocationChange(defaultLat, defaultLng, fallbackAddress);
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#737373]" />
          <Input
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              onLocationChange(lat, lng, e.target.value);
            }}
            placeholder="Enter address or landmark"
            className="pl-9 text-xs"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="gap-1 text-xs shrink-0"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
          {isLocating ? "Locating..." : "Use GPS"}
        </Button>
      </div>

      <div className="h-48 sm:h-56 rounded-lg overflow-hidden border border-[#E5E5E5] relative">
        <LeafletMap
          center={[lat, lng]}
          zoom={14}
          interactive={true}
          onLocationSelect={handleMapClick}
          markers={[
            {
              id: "pin",
              lat,
              lng,
              title: "Service Location",
              subtitle: address,
              type: "CUSTOMER",
            },
          ]}
        />
        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] text-[#525252] border border-[#E5E5E5]">
          Click map to pin exact service location
        </div>
      </div>
    </div>
  );
}