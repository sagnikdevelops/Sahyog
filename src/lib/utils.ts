import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string, formatStr: string = "dd MMM yyyy"): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    return format(date, formatStr);
  } catch (err) {
    return dateString;
  }
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  if (timeStr.includes("T")) {
    try {
      return format(parseISO(timeStr), "hh:mm a");
    } catch {
      return timeStr;
    }
  }
  return timeStr;
}

// Calculate Haversine distance in kilometers between two lat/lng coordinates
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function generateBookingNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `SHY-${timestamp}-${random}`;
}

export function generateInvoiceNumber(): string {
  const dateStr = format(new Date(), "yyyyMMdd");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${dateStr}-${random}`;
}

export function generateTransactionRef(): string {
  return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}