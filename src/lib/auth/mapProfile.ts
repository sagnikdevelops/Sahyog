import { Certification, Profile, UserRole, WorkerBadge, WorkerProfile, WorkerSkill } from "@/types";
import { normalizeWorkerRecord } from "@/lib/auth/authHelpers";

type ProfileRow = {
  id: string;
  email: string;
  full_name?: string;
  phone?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  role: UserRole;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  location?: { coordinates?: number[] } | null;
  created_at?: string;
  updated_at?: string;
};

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name ?? "",
    phone: row.phone ?? "",
    avatarUrl: row.avatar_url ?? undefined,
    bio: row.bio ?? "",
    role: row.role,
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    postalCode: row.postal_code ?? "",
    lat: row.location?.coordinates?.[1] ?? 0,
    lng: row.location?.coordinates?.[0] ?? 0,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

export function mapCertificationRow(row: Record<string, unknown>, workerId: string): Certification {
  return {
    id: String(row.id),
    workerId,
    title: String(row.title ?? "Certification"),
    issuingBody: String(row.issuing_body ?? "Cooperative"),
    certificationNumber: row.certification_number ? String(row.certification_number) : undefined,
    issueDate: String(row.issue_date ?? new Date().toISOString()),
    expiryDate: row.expiry_date ? String(row.expiry_date) : undefined,
    documentUrl: row.document_url ? String(row.document_url) : undefined,
    isVerified: Boolean(row.is_verified),
    certificationStatus: (row.certification_status as Certification["certificationStatus"]) ?? "PENDING",
    adminNotes: row.admin_notes ? String(row.admin_notes) : undefined,
    reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
    reviewedAt: row.reviewed_at ? String(row.reviewed_at) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
  };
}

export function mapWorkerFromJoin(row: ProfileRow & { workers?: Record<string, unknown>[] | Record<string, unknown> | null }): WorkerProfile {
  const profile = mapProfileRow(row);
  const workerRow = Array.isArray(row.workers) ? row.workers[0] : row.workers;
  return normalizeWorkerRecord({
    id: profile.id,
    profile,
    cooperativeId: workerRow?.cooperative_id ? String(workerRow.cooperative_id) : undefined,
    verificationStatus: (workerRow?.verification_status as WorkerProfile["verificationStatus"]) ?? "UNVERIFIED",
    experienceYears: Number(workerRow?.experience_years ?? 0),
    serviceRadiusKm: Number(workerRow?.service_radius_km ?? 10),
    isAvailable: Boolean(workerRow?.is_available ?? true),
    ratingAvg: Number(workerRow?.rating_avg ?? 0),
    ratingCount: Number(workerRow?.rating_count ?? 0),
    completedServicesCount: Number(workerRow?.completed_services_count ?? 0),
    bio: String(workerRow?.bio ?? profile.bio ?? ""),
  });
}

export function mergeWorkerDetails(
  worker: WorkerProfile,
  extras: {
    skills?: WorkerSkill[];
    certifications?: Certification[];
    badges?: WorkerBadge[];
  }
): WorkerProfile {
  return {
    ...worker,
    skills: extras.skills ?? worker.skills,
    certifications: extras.certifications ?? worker.certifications,
    badges: extras.badges ?? worker.badges ?? [],
  };
}
