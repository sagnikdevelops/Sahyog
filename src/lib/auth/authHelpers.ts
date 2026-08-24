// Sahyog - Auth Helper Utilities (Dummy / Hackathon Auth)
import { Profile, WorkerProfile } from "@/types";
import { SERVICE_CATEGORIES, COOPERATIVE_SOCIETIES } from "@/constants";

// ID Generators
export function generateUserId(role: "cust" | "worker"): string {
  return `${role}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function generateCertId(): string {
  return `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

// Demo Password Map - all seed users use "demo1234"
export const DEMO_PASSWORDS: Record<string, string> = {
  "customer.demo@example.com": "demo1234",
  "priya.nair@example.com": "demo1234",
  "vikram.malhotra@example.com": "demo1234",
  "ananya.sen@example.com": "demo1234",
  "rohit.kapoor@example.com": "demo1234",
  "meera.iyer@example.com": "demo1234",
  "sanjay.gupta@example.com": "demo1234",
  "neha.bansal@example.com": "demo1234",
  "alok.tripathi@example.com": "demo1234",
  "deepa.menon@example.com": "demo1234",
  "worker.demo@example.com": "demo1234",
  "rajesh.elec@example.com": "demo1234",
  "manoj.carp@example.com": "demo1234",
  "sunil.paint@example.com": "demo1234",
  "anita.clean@example.com": "demo1234",
  "sarita.care@example.com": "demo1234",
  "deepak.tech@example.com": "demo1234",
  "virender.driver@example.com": "demo1234",
  "ramprasad.garden@example.com": "demo1234",
  "sunita.bai@example.com": "demo1234",
  "admin.demo@example.com": "demo1234",
  "federation.demo@example.com": "demo1234",
};

// Quick-access demo account metadata for the login page panel
export const DEMO_QUICK_ACCOUNTS = [
  { label: "Customer", email: "customer.demo@example.com", password: "demo1234", name: "Aarav Sharma", role: "CUSTOMER" as const, targetUrl: "/customer" },
  { label: "Worker (Plumber)", email: "worker.demo@example.com", password: "demo1234", name: "Ramesh Kumar Verma", role: "WORKER" as const, targetUrl: "/worker" },
  { label: "Society Admin", email: "admin.demo@example.com", password: "demo1234", name: "Sunita Deshmukh", role: "SOCIETY_ADMIN" as const, targetUrl: "/admin" },
  { label: "Federation Admin", email: "federation.demo@example.com", password: "demo1234", name: "Dr. Rajeshwar Patil", role: "FEDERATION_ADMIN" as const, targetUrl: "/admin/analytics" },
];

// New Customer Profile Factory
export function createNewCustomerProfile(params: {
  id: string; fullName: string; phone: string; email: string; city: string;
}): Profile {
  const now = new Date().toISOString();
  return {
    id: params.id, email: params.email, fullName: params.fullName,
    phone: params.phone, role: "CUSTOMER", address: params.city,
    city: params.city, state: "India", postalCode: "",
    lat: 28.628, lng: 77.3649, createdAt: now, updatedAt: now,
  };
}

// New Worker Profile Factory
export function createNewWorkerProfile(params: {
  id: string; fullName: string; phone: string; email: string;
  city: string; tradeCategoryId: string; cooperativeId: string; experienceYears: number;
}): WorkerProfile {
  const now = new Date().toISOString();
  const category = SERVICE_CATEGORIES.find((c) => c.id === params.tradeCategoryId);
  const cooperative = COOPERATIVE_SOCIETIES.find((c) => c.id === params.cooperativeId);
  const profile: Profile = {
    id: params.id, email: params.email, fullName: params.fullName,
    phone: params.phone, role: "WORKER", address: params.city,
    city: params.city, state: "India", postalCode: "",
    lat: 28.628, lng: 77.3649, createdAt: now, updatedAt: now,
  };
  return {
    id: params.id, profile,
    cooperativeId: params.cooperativeId,
    cooperativeName: cooperative?.name ?? "Sahyog Labour Cooperative",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "DOCUMENT_PENDING",
    experienceYears: params.experienceYears,
    serviceRadiusKm: 10, isAvailable: false,
    currentLat: 28.628, currentLng: 77.3649,
    ratingAvg: 0, ratingCount: 0, completedServicesCount: 0,
    bio: `Skilled ${category?.name ?? "Trade"} professional with ${params.experienceYears} years of experience. Cooperative member pending verification.`,
    skills: [], certifications: [],
    availability: [
      { id: `av_${params.id}_1`, workerId: params.id, dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isActive: true },
      { id: `av_${params.id}_2`, workerId: params.id, dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isActive: true },
      { id: `av_${params.id}_3`, workerId: params.id, dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isActive: true },
      { id: `av_${params.id}_4`, workerId: params.id, dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isActive: true },
      { id: `av_${params.id}_5`, workerId: params.id, dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isActive: true },
    ],
    welfare: [], activeBookingsCount: 0,
  };
}
