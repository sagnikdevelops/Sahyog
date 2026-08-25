import { Profile, WorkerProfile } from "@/types";
import { normalizeWorkerRecord } from "@/lib/auth/authHelpers";

export function findOwnWorker(workers: WorkerProfile[], user: Profile): WorkerProfile | null {
  return workers.find((w) => w.id === user.id) ?? null;
}

export function workerFromUser(user: Profile): WorkerProfile {
  return normalizeWorkerRecord({
    id: user.id,
    profile: { ...user, role: "WORKER" },
  });
}

export function resolveOwnWorker(workers: WorkerProfile[], user: Profile): WorkerProfile {
  return findOwnWorker(workers, user) ?? workerFromUser(user);
}

export const SYSTEM_BADGES = [
  { key: "verified_worker", label: "Verified Worker", description: "Cooperative identity verified" },
  { key: "top_rated", label: "Top Rated", description: "Consistently high customer ratings" },
  { key: "experienced", label: "Experienced Worker", description: "Proven completed jobs" },
  { key: "fast_response", label: "Fast Response", description: "Quick job acceptance" },
  { key: "certified_pro", label: "Certified Professional", description: "Approved trade certification" },
  { key: "coop_member", label: "Cooperative Member", description: "Registered society member" },
] as const;
