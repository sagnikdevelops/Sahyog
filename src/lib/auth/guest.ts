import { Profile, UserRole } from "@/types";

export const GUEST_PROFILE: Profile = {
  id: "guest",
  email: "",
  fullName: "",
  phone: "",
  role: "CUSTOMER",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  lat: 0,
  lng: 0,
  createdAt: "",
  updatedAt: "",
};

export const DEMO_SOCIETY_ADMIN: Profile = {
  id: "admin_demo_1",
  email: "admin.demo@example.com",
  fullName: "Sunita Deshmukh",
  phone: "+91 98222 33445",
  role: "SOCIETY_ADMIN",
  address: "Labour Cooperative Bhawan, Sector 62",
  city: "Noida",
  state: "Uttar Pradesh",
  postalCode: "201301",
  lat: 28.629,
  lng: 77.362,
  createdAt: "2026-07-01T00:00:00Z",
  updatedAt: "2026-07-01T00:00:00Z",
};

export const DEMO_FEDERATION_ADMIN: Profile = {
  id: "fed_demo_1",
  email: "federation.demo@example.com",
  fullName: "Dr. Rajeshwar Patil",
  phone: "+91 98333 44556",
  role: "FEDERATION_ADMIN",
  address: "National Cooperative Union Complex, Siri Fort",
  city: "New Delhi",
  state: "Delhi",
  postalCode: "110049",
  lat: 28.552,
  lng: 77.218,
  createdAt: "2026-07-01T00:00:00Z",
  updatedAt: "2026-07-01T00:00:00Z",
};

export function dashboardForRole(role: UserRole): string {
  if (role === "WORKER") return "/worker";
  if (role === "SOCIETY_ADMIN") return "/admin";
  if (role === "FEDERATION_ADMIN") return "/admin/analytics";
  if (role === "SUPER_ADMIN") return "/admin";
  return "/customer";
}

export function profilePathForRole(role: UserRole): string {
  if (role === "WORKER") return "/worker/profile";
  if (role === "SOCIETY_ADMIN" || role === "FEDERATION_ADMIN" || role === "SUPER_ADMIN") {
    return "/admin";
  }
  return "/customer/profile";
}

export function initialsFromName(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SY";
}
