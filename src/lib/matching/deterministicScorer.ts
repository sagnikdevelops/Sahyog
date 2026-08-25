// Sahyog Deterministic Worker Matching Engine
// Formula: Total Score (100 pts) = 40% Skill + 30% Proximity + 20% Availability + 10% Workload
import { WorkerProfile, WorkerMatchCandidate, UrgencyLevel } from "@/types";
import { calculateDistanceKm } from "@/lib/utils";

export interface MatchCriteria {
  serviceId: string;
  categoryId?: string;
  customerLat: number;
  customerLng: number;
  urgency: UrgencyLevel;
  maxRadiusKm?: number;
}

export function calculateDeterministicWorkerScore(
  worker: WorkerProfile,
  criteria: MatchCriteria
): WorkerMatchCandidate {
  const { serviceId, customerLat, customerLng, urgency, maxRadiusKm = 25 } = criteria;
  const safeSkills = Array.isArray(worker?.skills) ? worker.skills : [];
  const workerLat = Number.isFinite(Number(worker?.currentLat)) ? Number(worker.currentLat) : 28.6;
  const workerLng = Number.isFinite(Number(worker?.currentLng)) ? Number(worker.currentLng) : 77.3;

  // 1. Skill Match (Weight: 40 points)
  let skillScore = 0;
  const exactSkillMatch = safeSkills.find(
    (s) => s?.serviceId === serviceId && s?.isVerified
  );
  const unverifiedSkillMatch = safeSkills.find(
    (s) => s?.serviceId === serviceId
  );
  const categoryMatch = safeSkills.length > 0;

  if (exactSkillMatch) {
    skillScore = 40;
  } else if (unverifiedSkillMatch) {
    skillScore = 28;
  } else if (categoryMatch) {
    skillScore = 15;
  } else {
    skillScore = 0;
  }

  // 2. Proximity Score (Weight: 30 points)
  const distanceKm = calculateDistanceKm(
    customerLat,
    customerLng,
    workerLat,
    workerLng
  );

  let proximityScore = 0;
  if (distanceKm <= 2) {
    proximityScore = 30;
  } else if (distanceKm <= 5) {
    proximityScore = 25;
  } else if (distanceKm <= 10) {
    proximityScore = 18;
  } else if (distanceKm <= 15) {
    proximityScore = 10;
  } else if (distanceKm <= maxRadiusKm) {
    proximityScore = 5;
  } else {
    proximityScore = 0;
  }

  // 3. Availability Score (Weight: 20 points)
  let availabilityScore = 0;
  if (worker.isAvailable && worker.verificationStatus === "APPROVED") {
    availabilityScore = 20;
  } else if (worker.isAvailable && worker.verificationStatus === "COOPERATIVE_VERIFIED") {
    availabilityScore = 15;
  } else if (worker.isAvailable) {
    availabilityScore = 10;
  } else {
    availabilityScore = 0;
  }

  // 4. Workload Score (Weight: 10 points)
  let workloadScore = 0;
  if (worker.activeBookingsCount === 0) {
    workloadScore = 10;
  } else if (worker.activeBookingsCount === 1) {
    workloadScore = 7;
  } else if (worker.activeBookingsCount === 2) {
    workloadScore = 4;
  } else {
    workloadScore = 0;
  }

  // Total Score Calculation
  let totalScore = skillScore + proximityScore + availabilityScore + workloadScore;

  // Emergency Boost & Prioritization
  if (urgency === "EMERGENCY") {
    if (distanceKm <= 5 && worker.isAvailable && exactSkillMatch) {
      totalScore += 15; // priority bonus for immediate response
    }
  }

  return {
    worker,
    score: Math.min(100, Math.round(totalScore)),
    breakdown: {
      skillScore,
      proximityScore,
      availabilityScore,
      workloadScore,
      distanceKm,
    },
  };
}

export function rankMatchingWorkers(
  workers: WorkerProfile[],
  criteria: MatchCriteria
): WorkerMatchCandidate[] {
  const scored = workers
    .filter((w) => w.verificationStatus !== "SUSPENDED")
    .map((worker) => calculateDeterministicWorkerScore(worker, criteria));

  // Sort descending by score, and then by distance
  return scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.breakdown.distanceKm - b.breakdown.distanceKm;
  });
}