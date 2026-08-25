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

export function normalizeWorkerRecord(worker?: Partial<WorkerProfile> | null): WorkerProfile {
  const source = worker ?? {};
  const profile: Partial<Profile> = source.profile ?? {};
  const fallbackId = source.id ?? profile.id ?? generateUserId("worker");
  const fallbackEmail = profile.email ?? "worker@local.example";
  const fallbackFullName = profile.fullName ?? "Worker";

  const normalizedProfile = {
    id: fallbackId,
    email: fallbackEmail,
    fullName: fallbackFullName,
    phone: profile.phone ?? "",
    avatarUrl: profile.avatarUrl,
    role: "WORKER" as const,
    address: profile.address ?? "",
    city: profile.city ?? "",
    state: profile.state ?? "",
    postalCode: profile.postalCode ?? "",
    lat: Number.isFinite(Number(profile.lat)) ? Number(profile.lat) : 28.6,
    lng: Number.isFinite(Number(profile.lng)) ? Number(profile.lng) : 77.3,
    createdAt: profile.createdAt ?? new Date().toISOString(),
    updatedAt: profile.updatedAt ?? new Date().toISOString(),
  };

  return {
    id: fallbackId,
    profile: normalizedProfile,
    cooperativeId: source.cooperativeId ?? "",
    cooperativeName: source.cooperativeName ?? "Unassigned Cooperative",
    federationName: source.federationName ?? "Unassigned Federation",
    verificationStatus: source.verificationStatus ?? "UNVERIFIED",
    experienceYears: Number(source.experienceYears ?? 0),
    serviceRadiusKm: Number(source.serviceRadiusKm ?? 10),
    isAvailable: Boolean(source.isAvailable),
    currentLat: Number.isFinite(Number(source.currentLat)) ? Number(source.currentLat) : normalizedProfile.lat,
    currentLng: Number.isFinite(Number(source.currentLng)) ? Number(source.currentLng) : normalizedProfile.lng,
    ratingAvg: Number(source.ratingAvg ?? 0),
    ratingCount: Number(source.ratingCount ?? 0),
    completedServicesCount: Number(source.completedServicesCount ?? 0),
    bio: source.bio ?? "",
    skills: Array.isArray(source.skills) ? source.skills.map((skill, index) => ({
      ...skill,
      id: skill?.id ?? `ws_${fallbackId}_${index}`,
      workerId: skill?.workerId ?? fallbackId,
      skillName: skill?.skillName ?? "General Labour",
      serviceName: skill?.serviceName ?? "General Service",
    })) : [],
    badges: Array.isArray(source.badges) ? source.badges : [],
    certifications: Array.isArray(source.certifications) ? source.certifications.map((cert, index) => ({
      ...cert,
      id: cert?.id ?? `cert_${fallbackId}_${index}`,
      workerId: cert?.workerId ?? fallbackId,
      title: cert?.title ?? "Certification",
      issuingBody: cert?.issuingBody ?? "Cooperative",
      issueDate: cert?.issueDate ?? new Date().toISOString(),
      certificationStatus: cert?.certificationStatus ?? "PENDING",
    })) : [],
    availability: Array.isArray(source.availability) ? source.availability.map((slot, index) => ({
      ...slot,
      id: slot?.id ?? `av_${fallbackId}_${index}`,
      workerId: slot?.workerId ?? fallbackId,
      dayOfWeek: slot?.dayOfWeek ?? 0,
      startTime: slot?.startTime ?? "09:00",
      endTime: slot?.endTime ?? "18:00",
      isActive: slot?.isActive ?? true,
    })) : [],
    welfare: Array.isArray(source.welfare) ? source.welfare.map((item, index) => ({
      ...item,
      id: item?.id ?? `welf_${fallbackId}_${index}`,
      workerId: item?.workerId ?? fallbackId,
      schemeName: item?.schemeName ?? "Welfare Policy",
      policyNo: item?.policyNo ?? `POL-${fallbackId}`,
      provider: item?.provider ?? "Cooperative Welfare Board",
      coverageAmount: Number(item?.coverageAmount ?? 0),
      validUntil: item?.validUntil ?? new Date().toISOString(),
      status: item?.status ?? "ACTIVE",
    })) : [],
    activeBookingsCount: Number(source.activeBookingsCount ?? 0),
  };
}

export function cloneWorkerTemplateForRegistration(params: {
  id: string;
  fullName: string;
  email: string;
  template: WorkerProfile;
}): WorkerProfile {
  const now = new Date().toISOString();
  const base = normalizeWorkerRecord(params.template);
  const id = params.id;

  return normalizeWorkerRecord({
    ...base,
    id,
    profile: {
      ...base.profile,
      id,
      email: params.email,
      fullName: params.fullName,
      role: "WORKER",
      createdAt: now,
      updatedAt: now,
    },
    cooperativeName: base.cooperativeName || "Unassigned Cooperative",
    federationName: base.federationName || "Unassigned Federation",
    skills: Array.isArray(base.skills) ? base.skills.map((skill, index) => ({
      ...skill,
      id: `ws_${id}_${index}`,
      workerId: id,
    })) : [],
    certifications: Array.isArray(base.certifications) ? base.certifications.map((cert, index) => ({
      ...cert,
      id: `cert_${id}_${index}`,
      workerId: id,
    })) : [],
    availability: Array.isArray(base.availability) ? base.availability.map((slot, index) => ({
      ...slot,
      id: `av_${id}_${index}`,
      workerId: id,
    })) : [],
    welfare: Array.isArray(base.welfare) ? base.welfare.map((item, index) => ({
      ...item,
      id: `welf_${id}_${index}`,
      workerId: id,
    })) : [],
    activeBookingsCount: 0,
  });
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

  const worker = workers.find((w) => (w.profile?.email ?? "").toLowerCase() === normalized);
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
