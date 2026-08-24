// Sahyog - Central Type Definitions

export type UserRole =
  | "CUSTOMER"
  | "WORKER"
  | "SOCIETY_ADMIN"
  | "FEDERATION_ADMIN"
  | "SUPER_ADMIN";

export type VerificationStatus =
  | "UNVERIFIED"
  | "DOCUMENT_PENDING"
  | "COOPERATIVE_VERIFIED"
  | "SKILL_VERIFIED"
  | "BACKGROUND_CHECKED"
  | "APPROVED"
  | "SUSPENDED";

export type BookingStatus =
  | "REQUESTED"
  | "MATCHING"
  | "ASSIGNED"
  | "ACCEPTED"
  | "SCHEDULED"
  | "WORKER_EN_ROUTE"
  | "SERVICE_STARTED"
  | "SERVICE_COMPLETED"
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "PAYOUT_PENDING"
  | "PAYOUT_COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "DISPUTED"
  | "REFUNDED"
  | "PAYMENT_FAILED"
  | "NO_SHOW";

export type PaymentStatus =
  | "PAYMENT_PENDING"
  | "PAYMENT_PROCESSING"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_FAILED"
  | "REFUND_PENDING"
  | "REFUNDED";

export type PayoutStatus = "PAYOUT_PENDING" | "PAYOUT_COMPLETED";

export type DisputeStatus = "DISPUTE_OPENED" | "UNDER_REVIEW" | "RESOLVED";

export type UrgencyLevel = "NORMAL" | "EMERGENCY";

export type PaymentMethod =
  | "MOCK_UPI"
  | "MOCK_CARD"
  | "MOCK_NETBANKING"
  | "SANDBOX_GATEWAY"
  | "CASH_ON_DELIVERY";

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
}

export interface Federation {
  id: string;
  name: string;
  registrationNo: string;
  state: string;
  contactEmail: string;
  phone: string;
  societiesCount: number;
  workersCount: number;
}

export interface Cooperative {
  id: string;
  federationId: string;
  name: string;
  registrationNo: string;
  district: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  isActive: boolean;
  workersCount: number;
}

export interface Skill {
  id: string;
  serviceId: string;
  name: string;
  description: string;
}

export interface WorkerSkill {
  id: string;
  workerId: string;
  skillId: string;
  skillName: string;
  serviceId: string;
  serviceName: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Certification {
  id: string;
  workerId: string;
  title: string;
  issuingBody: string;
  issueDate: string;
  expiryDate?: string;
  documentUrl?: string;
  isVerified: boolean;
}

export interface WorkerAvailability {
  id: string;
  workerId: string;
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
  isActive: boolean;
}

export interface WorkerWelfare {
  id: string;
  workerId: string;
  schemeName: string;
  policyNo: string;
  provider: string;
  coverageAmount: number;
  validUntil: string;
  status: "ACTIVE" | "PENDING_RENEWAL" | "EXPIRED";
}

export interface WorkerProfile {
  id: string; // maps to profile id
  profile: Profile;
  cooperativeId: string;
  cooperativeName: string;
  federationName: string;
  verificationStatus: VerificationStatus;
  experienceYears: number;
  serviceRadiusKm: number;
  isAvailable: boolean;
  currentLat: number;
  currentLng: number;
  ratingAvg: number;
  ratingCount: number;
  completedServicesCount: number;
  bio: string;
  skills: WorkerSkill[];
  certifications: Certification[];
  availability: WorkerAvailability[];
  welfare: WorkerWelfare[];
  activeBookingsCount: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  description: string;
  descriptionHi: string;
  iconName: string;
  isActive: boolean;
  servicesCount: number;
}

export interface Service {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  basePrice: number;
  estimatedDurationMins: number;
  isEmergencyEligible: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLat: number;
  customerLng: number;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  workerId?: string;
  workerName?: string;
  workerPhone?: string;
  workerAvatarUrl?: string;
  cooperativeName?: string;
  status: BookingStatus;
  urgency: UrgencyLevel;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  notes?: string;
  customerNotes?: string;
  workerCompletionNotes?: string;
  workerCompletionPhotoUrl?: string;
  totalAmount: number;
  platformFee: number;
  cooperativeFee: number;
  workerPayoutAmount: number;
  paymentStatus: PaymentStatus;
  payoutStatus: PayoutStatus;
  paymentMethod?: PaymentMethod;
  transactionRef?: string;
  invoiceNumber?: string;
  disputeId?: string;
  ratingId?: string;
  cancellationActor?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingAssignment {
  id: string;
  bookingId: string;
  workerId: string;
  assignedBy: "SYSTEM" | "ADMIN";
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  responseNotes?: string;
  assignedAt: string;
  respondedAt?: string;
}

export interface BookingStatusHistory {
  id: string;
  bookingId: string;
  oldStatus?: BookingStatus;
  newStatus: BookingStatus;
  changedBy: string;
  changedByRole: UserRole;
  reason?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface Payment {
  id: string;
  bookingId: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  platformFee: number;
  cooperativeFee: number;
  workerShare: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionRef: string;
  invoiceNumber: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  paymentId: string;
  bookingId: string;
  workerId: string;
  workerName: string;
  cooperativeId: string;
  cooperativeName: string;
  amount: number;
  status: PayoutStatus;
  transactionRef: string;
  processedAt?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  rating: number; // 1-5
  feedback: string;
  skillRating: number;
  punctualityRating: number;
  politenessRating: number;
  createdAt: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  bookingNumber: string;
  raisedBy: string;
  raisedByName: string;
  raisedByRole: UserRole;
  reason: string;
  description: string;
  evidenceUrls?: string[];
  status: DisputeStatus;
  resolutionAction?: "REFUND_FULL" | "REFUND_PARTIAL" | "RE_SERVICE" | "REJECTED";
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "URGENT";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface PrivacyConsent {
  id: string;
  userId: string;
  purpose: string;
  consentVersion: string;
  consentStatus: "GRANTED" | "REVOKED";
  ipAddress?: string;
  consentedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
}

export interface WorkerMatchCandidate {
  worker: WorkerProfile;
  score: number;
  breakdown: {
    skillScore: number;
    proximityScore: number;
    availabilityScore: number;
    workloadScore: number;
    distanceKm: number;
  };
}

export interface DemandInsight {
  id: string;
  serviceCategory: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  trendPercentage: number;
  trendType: "INCREASE" | "DECREASE" | "STABLE";
  severity: "INFO" | "WARNING" | "URGENT";
  suggestedAction: string;
  suggestedActionHi: string;
  affectedArea: string;
}