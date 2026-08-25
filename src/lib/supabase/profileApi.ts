import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapProfileRow, mapCertificationRow, mapWorkerFromJoin, mergeWorkerDetails } from "@/lib/auth/mapProfile";
import { Certification, Profile, WorkerBadge, WorkerProfile, WorkerSkill } from "@/types";
import { SERVICES } from "@/constants";

const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const CERT_MAX_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const CERT_TYPES = [...IMAGE_TYPES, "application/pdf"];

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function fetchProfileByAuthId(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return mapProfileRow(data);
}

export async function fetchWorkerBundle(workerId: string): Promise<WorkerProfile | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*, workers(*)")
    .eq("id", workerId)
    .maybeSingle();
  if (error || !data) return null;

  let worker = mapWorkerFromJoin(data);

  const [{ data: skillRows }, { data: certRows }, { data: badgeRows }] = await Promise.all([
    supabase.from("worker_skills").select("*").eq("worker_id", workerId),
    supabase.from("certifications").select("*").eq("worker_id", workerId),
    supabase.from("worker_badges").select("*").eq("worker_id", workerId),
  ]);

  const skills: WorkerSkill[] = (skillRows ?? []).map((row) => {
    const service = SERVICES.find((s) => s.id === row.skill_id) ?? SERVICES.find((s) => s.name === row.skill_id);
    return {
      id: row.id,
      workerId,
      skillId: row.skill_id,
      skillName: service?.name ?? String(row.skill_id),
      serviceId: service?.id ?? String(row.skill_id),
      serviceName: service?.categoryName ?? "Trade",
      isVerified: Boolean(row.is_verified),
      verifiedBy: row.verified_by ?? undefined,
      verifiedAt: row.verified_at ?? undefined,
    };
  });

  const certifications = (certRows ?? []).map((row) => mapCertificationRow(row, workerId));
  const badges: WorkerBadge[] = (badgeRows ?? []).map((row) => ({
    id: row.id,
    workerId,
    badgeKey: row.badge_key,
    label: row.label,
    description: row.description ?? "",
    awardedBy: row.awarded_by ?? undefined,
    awardedAt: row.awarded_at,
  }));

  worker = mergeWorkerDetails(worker, { skills, certifications, badges });
  return worker;
}

export async function persistProfile(profile: Partial<Profile> & { id: string }): Promise<{ error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: profile.fullName,
      phone: profile.phone,
      city: profile.city,
      address: profile.address,
      state: profile.state,
      postal_code: profile.postalCode,
      bio: profile.bio,
      avatar_url: profile.avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);
  return error ? { error: error.message } : {};
}

export async function persistWorkerBio(workerId: string, bio: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  const [{ error: workerError }, { error: profileError }] = await Promise.all([
    supabase.from("workers").update({ bio, updated_at: new Date().toISOString() }).eq("id", workerId),
    supabase.from("profiles").update({ bio, updated_at: new Date().toISOString() }).eq("id", workerId),
  ]);
  if (workerError) return { error: workerError.message };
  if (profileError) return { error: profileError.message };
  return {};
}

export async function uploadAvatarFile(userId: string, file: File): Promise<{ url?: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  if (!IMAGE_TYPES.includes(file.type)) return { error: "Use JPG, PNG, or WEBP images only." };
  if (file.size > AVATAR_MAX_BYTES) return { error: "Avatar must be 2 MB or smaller." };

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const url = `${data.publicUrl}?t=${Date.now()}`;
  await supabase.from("profiles").update({ avatar_url: url, updated_at: new Date().toISOString() }).eq("id", userId);
  return { url };
}

export async function removeAvatarFile(userId: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  await supabase.storage.from("avatars").remove([`${userId}/avatar.jpg`, `${userId}/avatar.jpeg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]);
  const { error } = await supabase.from("profiles").update({ avatar_url: null, updated_at: new Date().toISOString() }).eq("id", userId);
  return error ? { error: error.message } : {};
}

export async function persistWorkerSkill(workerId: string, skill: Omit<WorkerSkill, "id" | "workerId"> & { id?: string }): Promise<{ skill?: WorkerSkill; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  const payload = {
    worker_id: workerId,
    skill_id: skill.skillId,
    is_verified: false,
  };
  const { data, error } = await supabase.from("worker_skills").upsert(payload, { onConflict: "worker_id,skill_id" }).select().single();
  if (error) return { error: error.message };
  return {
    skill: {
      id: data.id,
      workerId,
      skillId: skill.skillId,
      skillName: skill.skillName,
      serviceId: skill.serviceId,
      serviceName: skill.serviceName,
      isVerified: false,
    },
  };
}

export async function deleteWorkerSkill(skillRowId: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  const { error } = await supabase.from("worker_skills").delete().eq("id", skillRowId);
  return error ? { error: error.message } : {};
}

export async function persistCertification(
  workerId: string,
  cert: Omit<Certification, "id" | "workerId" | "isVerified" | "certificationStatus"> & { id?: string }
): Promise<{ certification?: Certification; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  const payload = {
    worker_id: workerId,
    title: cert.title,
    issuing_body: cert.issuingBody,
    certification_number: cert.certificationNumber ?? null,
    issue_date: cert.issueDate || null,
    expiry_date: cert.expiryDate || null,
    document_url: cert.documentUrl ?? null,
    notes: cert.notes ?? null,
    certification_status: "PENDING",
    is_verified: false,
  };

  const query = cert.id
    ? supabase.from("certifications").update(payload).eq("id", cert.id).eq("worker_id", workerId)
    : supabase.from("certifications").insert(payload);

  const { data, error } = await query.select().single();
  if (error) return { error: error.message };
  return { certification: mapCertificationRow(data, workerId) };
}

export async function deleteCertification(certId: string, workerId: string): Promise<{ error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  const { error } = await supabase.from("certifications").delete().eq("id", certId).eq("worker_id", workerId);
  return error ? { error: error.message } : {};
}

export async function uploadCertificateFile(
  workerId: string,
  certificateId: string,
  file: File
): Promise<{ path?: string; signedUrl?: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  if (!CERT_TYPES.includes(file.type)) return { error: "Use JPG, PNG, WEBP, or PDF files only." };
  if (file.size > CERT_MAX_BYTES) return { error: "Certificate file must be 8 MB or smaller." };

  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const path = `${workerId}/${certificateId}/certificate.${ext}`;
  const { error } = await supabase.storage.from("certificates").upload(path, file, { upsert: true, contentType: file.type });
  if (error) return { error: error.message };

  await supabase.from("certifications").update({ document_url: path }).eq("id", certificateId).eq("worker_id", workerId);
  const signed = await createCertificateSignedUrl(path);
  return { path, signedUrl: signed.url };
}

export async function createCertificateSignedUrl(path: string): Promise<{ url?: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
  if (path.startsWith("http")) return { url: path };
  const { data, error } = await supabase.storage.from("certificates").createSignedUrl(path, 60 * 30);
  if (error) return { error: error.message };
  return { url: data.signedUrl };
}

export async function persistBookingForAuthUser(row: Record<string, unknown>): Promise<{ error?: string }> {
  if (!isSupabaseConfigured || !supabase) return {};
  const { error } = await supabase.from("bookings").insert(row);
  return error ? { error: error.message } : {};
}
