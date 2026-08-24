// Sahyog - Demo-only auth helpers (no real authentication, never persist passwords)
import { Profile, UserRole, WorkerProfile } from "@/types";
import { DEMO_USERS } from "@/constants";

export function generateUserId(role: "cust" | "worker"): string {
  return `${role}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function generateCertId(): string {
  return `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export const DEMO_QUICK_ACCOUNTS = [
  { label: "Customer", email: "customer.demo@example.com", name: "Aarav Sharma", role: "CUSTOMER" as const, targetUrl: "/customer" },
  { label: "Worker (Plumber)", email: "worker.demo@example.com", name: "Ramesh Kumar Verma", role: "WORKER" as const, targetUrl: "/worker" },
  { label: "Society Admin", email: "admin.demo@example.com", name: "Sunita Deshmukh", role: "SOCIETY_ADMIN" as const, targetUrl: "/admin" },
  { label: "Federation Admin", email: "federation.demo@example.com", name: "Dr. Rajeshwar Patil", role: "FEDERATION_ADMIN" as const, targetUrl: "/admin/analytics" },
];

export function createRegisteredCustomerProfile(params: {
  id: string;
  fullName: string;
  email: string;
  template: Profile;
}): Profile {
  const now = new Date().toISOString();
  return {
    ...params.template,
    id: params.id,
    email: params.email,
    fullName: params.fullName,
    role: "CUSTOMER",
    createdAt: now,
    updatedAt: now,
  };
}

export function cloneWorkerTemplateForRegistration(params: {
  id: string;
  fullName: string;
  email: string;
  template: WorkerProfile;
}): WorkerProfile {
  const now = new Date().toISOString();
  const clone: WorkerProfile = JSON.parse(JSON.stringify(params.template));
  const id = params.id;

  return {
    ...clone,
    id,
    profile: {
      ...clone.profile,
      id,
      email: params.email,
      fullName: params.fullName,
      role: "WORKER",
      createdAt: now,
      updatedAt: now,
    },
    skills: clone.skills.map((skill, index) => ({
      ...skill,
      id: `ws_${id}_${index}`,
      workerId: id,
    })),
    certifications: clone.certifications.map((cert, index) => ({
      ...cert,
      id: `cert_${id}_${index}`,
      workerId: id,
    })),
    availability: clone.availability.map((slot, index) => ({
      ...slot,
      id: `av_${id}_${index}`,
      workerId: id,
    })),
    welfare: clone.welfare.map((item, index) => ({
      ...item,
      id: `welf_${id}_${index}`,
      workerId: id,
    })),
    activeBookingsCount: 0,
  };
}

export type DemoLoginMatch = {
  profile: Profile;
  role: UserRole;
  targetUrl: string;
};

function withProfileTimestamps(partial: (typeof DEMO_USERS)[number]): Profile {
  return {
    id: partial.id,
    email: partial.email,
    fullName: partial.fullName,
    phone: partial.phone,
    role: partial.role,
    address: partial.address,
    city: partial.city,
    state: partial.state,
    postalCode: partial.postalCode,
    lat: partial.lat,
    lng: partial.lng,
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
  };
}

export function findDemoUserByEmail(
  email: string,
  customers: Profile[],
  workers: WorkerProfile[]
): DemoLoginMatch | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const customer = customers.find((c) => c.email.toLowerCase() === normalized);
  if (customer) {
    return { profile: customer, role: "CUSTOMER", targetUrl: "/customer" };
  }

  const worker = workers.find((w) => w.profile.email.toLowerCase() === normalized);
  if (worker) {
    return {
      profile: { ...worker.profile, role: "WORKER" },
      role: "WORKER",
      targetUrl: "/worker",
    };
  }

  const demoUser = DEMO_USERS.find((u) => u.email.toLowerCase() === normalized);
  if (!demoUser) return null;

  if (demoUser.role === "SOCIETY_ADMIN") {
    return { profile: withProfileTimestamps(demoUser), role: "SOCIETY_ADMIN", targetUrl: "/admin" };
  }
  if (demoUser.role === "FEDERATION_ADMIN") {
    return {
      profile: withProfileTimestamps(demoUser),
      role: "FEDERATION_ADMIN",
      targetUrl: "/admin/analytics",
    };
  }
  if (demoUser.role === "CUSTOMER") {
    const seedCustomer = customers.find((c) => c.id === demoUser.id) ?? withProfileTimestamps(demoUser);
    return { profile: seedCustomer, role: "CUSTOMER", targetUrl: "/customer" };
  }
  if (demoUser.role === "WORKER") {
    const seedWorker = workers.find((w) => w.id === demoUser.id);
    if (seedWorker) {
      return {
        profile: { ...seedWorker.profile, role: "WORKER" },
        role: "WORKER",
        targetUrl: "/worker",
      };
    }
  }

  return null;
}
