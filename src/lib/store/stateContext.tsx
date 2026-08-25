"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Profile,
  WorkerProfile,
  Booking,
  BookingStatus,
  Payment,
  Payout,
  Rating,
  Dispute,
  Notification,
  AuditLog,
  UserRole,
  VerificationStatus,
  PaymentMethod,
  UrgencyLevel,
  DemandInsight,
  Certification,
  WorkerSkill,
} from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  INITIAL_CUSTOMERS,
  INITIAL_WORKERS,
  INITIAL_BOOKINGS,
  INITIAL_RATINGS,
  INITIAL_DISPUTES,
  INITIAL_DEMAND_INSIGHTS,
  INITIAL_AUDIT_LOGS,
  logoutCurrent,
  changePassword,
} from "./demoStore";
import { SERVICES } from "@/constants";
import { generateBookingNumber } from "@/lib/utils";
import { processSimulatedPayment } from "@/lib/payments/mockPaymentEngine";
import {
  cloneWorkerTemplateForRegistration,
  createRegisteredCustomerProfile,
  findDemoUserByEmail,
  generateUserId,
  normalizeWorkerRecord,
} from "@/lib/auth/authHelpers";
import {
  DEMO_FEDERATION_ADMIN,
  DEMO_SOCIETY_ADMIN,
  GUEST_PROFILE,
  dashboardForRole,
} from "@/lib/auth/guest";
import {
  deleteCertification,
  deleteWorkerSkill,
  fetchProfileByAuthId,
  fetchWorkerBundle,
  persistCertification,
  persistProfile,
  persistWorkerBio,
  persistWorkerSkill,
  persistBookingForAuthUser,
  removeAvatarFile,
  uploadAvatarFile,
  uploadCertificateFile,
} from "@/lib/supabase/profileApi";

interface StateContextType {
  currentUser: Profile;
  currentRole: UserRole;
  realUser: Profile | null;
  demoUser: Profile | null;
  demoRole: UserRole | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  authReady: boolean;
  setCurrentRole: (role: UserRole) => void;
  switchDemoUser: (role: UserRole) => void;
  enterDemoMode: (role: UserRole) => void;
  exitDemoMode: () => void;
  registerDemoUser: (params: {
    fullName: string;
    email: string;
    role: "CUSTOMER" | "WORKER";
  }) => Profile;
  registerAccount: (params: {
    fullName: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "WORKER";
  }) => Promise<{ profile?: Profile; needsEmailConfirmation?: boolean; error?: string }>;
  loginAccount: (email: string, password: string) => Promise<{ role?: UserRole; targetUrl?: string; error?: string }>;
  loginDemoByEmail: (email: string) => { role: UserRole; targetUrl: string } | null;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<{ error?: string }>;
  changePassword: (newPassword: string) => Promise<{ error?: unknown } | { data?: unknown }>;
  authenticatedUser?: Profile | null;
  updateOwnProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  updateOwnWorkerBio: (bio: string) => Promise<{ error?: string }>;
  uploadOwnAvatar: (file: File) => Promise<{ url?: string; error?: string }>;
  removeOwnAvatar: () => Promise<{ error?: string }>;
  addOwnSkill: (skill: Omit<WorkerSkill, "id" | "workerId">) => Promise<{ error?: string }>;
  removeOwnSkill: (skillId: string) => Promise<{ error?: string }>;
  saveOwnCertification: (
    cert: Omit<Certification, "id" | "workerId" | "isVerified" | "certificationStatus"> & { id?: string }
  ) => Promise<{ certification?: Certification; error?: string }>;
  removeOwnCertification: (certId: string) => Promise<{ error?: string }>;
  uploadOwnCertificateFile: (certId: string, file: File) => Promise<{ error?: string; path?: string }>;
  reviewCertification: (workerId: string, certId: string, status: "APPROVED" | "REJECTED", notes?: string) => void;
  
  customers: Profile[];
  workers: WorkerProfile[];
  bookings: Booking[];
  payments: Payment[];
  payouts: Payout[];
  ratings: Rating[];
  disputes: Dispute[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  demandInsights: DemandInsight[];

  // Actions
  createBooking: (params: {
    serviceId: string;
    urgency: UrgencyLevel;
    scheduledDate: string;
    scheduledTime: string;
    customerAddress: string;
    customerLat: number;
    customerLng: number;
    description: string;
    customerNotes?: string;
    preferredWorkerId?: string;
  }) => Booking;

  updateBookingStatus: (
    bookingId: string,
    newStatus: BookingStatus,
    reason?: string,
    notes?: string
  ) => void;

  assignWorkerToBooking: (bookingId: string, workerId: string) => void;
  acceptBookingJob: (bookingId: string) => void;
  rejectBookingJob: (bookingId: string, reason?: string) => void;
  startWorkerTravel: (bookingId: string) => void;
  startServiceExecution: (bookingId: string) => void;
  completeServiceExecution: (
    bookingId: string,
    completionNotes: string,
    photoUrl?: string
  ) => void;

  submitPayment: (bookingId: string, paymentMethod: PaymentMethod) => void;
  submitRating: (params: {
    bookingId: string;
    rating: number;
    skillRating: number;
    punctualityRating: number;
    politenessRating: number;
    feedback: string;
  }) => void;

  createDispute: (params: {
    bookingId: string;
    reason: string;
    description: string;
    evidenceUrl?: string;
  }) => void;

  resolveDisputeAction: (
    disputeId: string,
    action: "REFUND_FULL" | "REFUND_PARTIAL" | "RE_SERVICE" | "REJECTED",
    adminNotes: string
  ) => void;

  updateWorkerVerification: (
    workerId: string,
    status: VerificationStatus,
    notes?: string
  ) => void;

  toggleWorkerAvailability: (workerId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  resetToSeedData: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const STORAGE_KEY = "sahyog_state_v1";

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [realUser, setRealUser] = useState<Profile | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState<Profile>(INITIAL_CUSTOMERS[0]);
  const [demoRole, setDemoRole] = useState<UserRole>("CUSTOMER");
  const [customers, setCustomers] = useState<Profile[]>(INITIAL_CUSTOMERS);
  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [ratings, setRatings] = useState<Rating[]>(INITIAL_RATINGS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [demandInsights, setDemandInsights] = useState<DemandInsight[]>(INITIAL_DEMAND_INSIGHTS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const isAuthenticated = Boolean(realUser);
  const currentUser = isDemoMode ? demoUser : realUser ?? GUEST_PROFILE;
  const currentRole = isDemoMode ? demoRole : realUser?.role ?? "CUSTOMER";
  const authenticatedUser = realUser;

  const clearDemoPersistence = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const applyRealUser = async (profile: Profile) => {
    setRealUser(profile);
    if (profile.role === "CUSTOMER") {
      setCustomers((prev) => (prev.some((c) => c.id === profile.id) ? prev.map((c) => (c.id === profile.id ? profile : c)) : [...prev, profile]));
    }
    if (profile.role === "WORKER") {
      const bundled = (await fetchWorkerBundle(profile.id)) ?? normalizeWorkerRecord({
        id: profile.id,
        profile: { ...profile, role: "WORKER" },
      });
      setWorkers((prev) => (prev.some((w) => w.id === bundled.id) ? prev.map((w) => (w.id === bundled.id ? bundled : w)) : [...prev, bundled]));
    }
  };

  const resolveAuthUser = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setRealUser(null);
      setIsDemoMode(false);
      clearDemoPersistence();
      setAuthReady(true);
      return;
    }
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setRealUser(null);
        setIsDemoMode(false);
        clearDemoPersistence();
        setAuthReady(true);
        return;
      }

      setIsDemoMode(false);
      clearDemoPersistence();

      const profile = await fetchProfileByAuthId(data.user.id);
      if (profile) {
        await applyRealUser(profile);
      } else {
        const fallback: Profile = {
          ...GUEST_PROFILE,
          id: data.user.id,
          email: data.user.email ?? "",
          fullName: (data.user.user_metadata?.full_name as string) || data.user.email?.split("@")[0] || "Member",
          role: ((data.user.user_metadata?.role as UserRole) || "CUSTOMER"),
        };
        await applyRealUser(fallback);
      }
    } catch {
      setRealUser(null);
      setIsDemoMode(false);
      clearDemoPersistence();
    } finally {
      setAuthReady(true);
    }
  };

  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only demo simulation data is restored from the browser. Real identity and
        // real application data are always rehydrated from Supabase below.
        if (parsed.isDemoMode) {
          if (parsed.customers) setCustomers(parsed.customers);
          if (parsed.workers) setWorkers(parsed.workers);
          if (parsed.bookings) setBookings(parsed.bookings);
          if (parsed.payments) setPayments(parsed.payments);
          if (parsed.payouts) setPayouts(parsed.payouts);
          if (parsed.ratings) setRatings(parsed.ratings);
          if (parsed.disputes) setDisputes(parsed.disputes);
          if (parsed.notifications) setNotifications(parsed.notifications);
          if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
          setIsDemoMode(true);
          if (parsed.demoUser) setDemoUser(parsed.demoUser);
          if (parsed.demoRole) setDemoRole(parsed.demoRole);
        }
      }
    } catch (e) {
      console.warn("Failed to load Sahyog saved state, using defaults:", e);
    }

    resolveAuthUser().catch(() => setAuthReady(true));
    setIsLoaded(true);

    if (!isSupabaseConfigured || !supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      resolveAuthUser().catch(() => {});
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        customers,
        workers,
        bookings,
        payments,
        payouts,
        ratings,
        disputes,
        notifications,
        auditLogs,
        isDemoMode,
        demoUser,
        demoRole,
      };
      if (typeof window !== "undefined") {
        if (isDemoMode) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        else window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Failed to save state to localStorage:", e);
    }
  }, [
    isLoaded,
    customers,
    workers,
    bookings,
    payments,
    payouts,
    ratings,
    disputes,
    notifications,
    auditLogs,
    isDemoMode,
    demoUser,
    demoRole,
  ]);

  const demoProfileForRole = (role: UserRole): Profile => {
    if (role === "CUSTOMER") return INITIAL_CUSTOMERS[0];
    if (role === "WORKER") {
      const w = INITIAL_WORKERS[0];
      return { ...w.profile, role: "WORKER" };
    }
    if (role === "SOCIETY_ADMIN") return DEMO_SOCIETY_ADMIN;
    return DEMO_FEDERATION_ADMIN;
  };

  const enterDemoMode = (role: UserRole) => {
    setIsDemoMode(true);
    setDemoRole(role);
    setDemoUser(demoProfileForRole(role));
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
  };

  const switchDemoUser = (role: UserRole) => {
    enterDemoMode(role);
  };

  const setCurrentRole = (role: UserRole) => {
    if (isDemoMode) {
      enterDemoMode(role);
      return;
    }
    if (realUser) return;
    enterDemoMode(role);
  };

  const registerAccount = async (params: {
    fullName: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "WORKER";
  }): Promise<{ profile?: Profile; needsEmailConfirmation?: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." };
    }

    const { data, error } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: params.password,
      options: {
        data: { full_name: params.fullName.trim(), role: params.role },
      },
    });
    if (error) return { error: error.message };

    setIsDemoMode(false);

    if (!data.session) {
      return { needsEmailConfirmation: true };
    }

    if (data.user) {
      const profile = await fetchProfileByAuthId(data.user.id);
      if (profile) {
        await applyRealUser(profile);
        return { profile };
      }
    }
    await resolveAuthUser();
    return { profile: realUser ?? undefined };
  };

  const loginAccount = async (
    email: string,
    password: string
  ): Promise<{ role?: UserRole; targetUrl?: string; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: "Supabase is not configured." };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { error: error.message };
    setIsDemoMode(false);
    if (!data.user) return { error: "Login failed." };
    const profile = (await fetchProfileByAuthId(data.user.id)) ?? {
      ...GUEST_PROFILE,
      id: data.user.id,
      email: data.user.email ?? email,
      fullName: (data.user.user_metadata?.full_name as string) || email.split("@")[0],
      role: ((data.user.user_metadata?.role as UserRole) || "CUSTOMER"),
    };
    await applyRealUser(profile);
    return { role: profile.role, targetUrl: dashboardForRole(profile.role) };
  };

  const registerDemoUser = (params: {
    fullName: string;
    email: string;
    role: "CUSTOMER" | "WORKER";
  }): Profile => {
    const fullName = params.fullName.trim();
    const email = params.email.trim();
    if (params.role === "CUSTOMER") {
      const id = generateUserId("cust");
      const profile = createRegisteredCustomerProfile({
        id,
        fullName,
        email,
        template: INITIAL_CUSTOMERS[0],
      });
      setCustomers((prev) => [...prev, profile]);
      enterDemoMode("CUSTOMER");
      setDemoUser(profile);
      return profile;
    }

    const id = generateUserId("worker");
    const worker = cloneWorkerTemplateForRegistration({
      id,
      fullName,
      email,
      template: INITIAL_WORKERS[0],
    });
    const normalizedWorker = normalizeWorkerRecord(worker);
    setWorkers((prev) => [...prev, normalizedWorker]);
    enterDemoMode("WORKER");
    setDemoUser({ ...normalizedWorker.profile, role: "WORKER" });
    return normalizedWorker.profile;
  };

  const loginDemoByEmail = (email: string): { role: UserRole; targetUrl: string } | null => {
    const match = findDemoUserByEmail(email, customers, workers);
    if (match) {
      setIsDemoMode(true);
      setDemoUser(match.profile);
      setDemoRole(match.role);
      return { role: match.role, targetUrl: match.targetUrl };
    }
    return null;
  };

  const addNotification = (notif: Omit<Notification, "id" | "createdAt" | "isRead">) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addAuditLog = (log: Omit<AuditLog, "id" | "createdAt">) => {
    const newLog: AuditLog = {
      ...log,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const createBooking = (params: {
    serviceId: string;
    urgency: UrgencyLevel;
    scheduledDate: string;
    scheduledTime: string;
    customerAddress: string;
    customerLat: number;
    customerLng: number;
    description: string;
    customerNotes?: string;
    preferredWorkerId?: string;
  }): Booking => {
    const service = SERVICES.find((s) => s.id === params.serviceId) || SERVICES[0];
    const bookingNumber = generateBookingNumber();
    const totalAmount = params.urgency === "EMERGENCY" ? service.basePrice + 100 : service.basePrice;
    const platformFee = Math.round(totalAmount * 0.05);
    const cooperativeFee = Math.round(totalAmount * 0.07);
    const workerPayoutAmount = totalAmount - platformFee - cooperativeFee;

    let assignedWorker: WorkerProfile | undefined;
    if (params.preferredWorkerId) {
      assignedWorker = workers.find((w) => w.id === params.preferredWorkerId);
    } else {
      assignedWorker = workers.find(
        (w) =>
          w.isAvailable &&
          (w.verificationStatus === "APPROVED" || w.verificationStatus === "COOPERATIVE_VERIFIED") &&
          Array.isArray(w.skills) && w.skills.some((s) => s?.serviceId === service.id)
      );
    }

    const newBooking: Booking = {
      id: isAuthenticated && !isDemoMode ? crypto.randomUUID() : `bk_${Date.now()}`,
      bookingNumber,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerPhone: currentUser.phone,
      customerAddress: params.customerAddress,
      customerLat: params.customerLat,
      customerLng: params.customerLng,
      serviceId: service.id,
      serviceName: service.name,
      categoryName: service.categoryName,
      workerId: assignedWorker?.id,
      workerName: assignedWorker?.profile.fullName,
      workerPhone: assignedWorker?.profile.phone,
      workerAvatarUrl: assignedWorker?.profile.avatarUrl,
      cooperativeName: assignedWorker?.cooperativeName || "Noida Shramik Utthan Labour Society",
      status: assignedWorker ? "ASSIGNED" : "MATCHING",
      urgency: params.urgency,
      scheduledDate: params.scheduledDate,
      scheduledTime: params.scheduledTime,
      description: params.description,
      customerNotes: params.customerNotes,
      totalAmount,
      platformFee,
      cooperativeFee,
      workerPayoutAmount,
      paymentStatus: "PAYMENT_PENDING",
      payoutStatus: "PAYOUT_PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    if (isAuthenticated && !isDemoMode) {
      void persistBookingForAuthUser({
        id: newBooking.id,
        booking_number: newBooking.bookingNumber,
        customer_id: newBooking.customerId,
        service_id: newBooking.serviceId,
        worker_id: newBooking.workerId ?? null,
        status: newBooking.status,
        urgency: newBooking.urgency,
        scheduled_date: newBooking.scheduledDate,
        scheduled_time: newBooking.scheduledTime,
        customer_address: newBooking.customerAddress,
        description: newBooking.description,
        customer_notes: newBooking.customerNotes ?? null,
        total_amount: newBooking.totalAmount,
        platform_fee: newBooking.platformFee,
        cooperative_fee: newBooking.cooperativeFee,
        worker_payout_amount: newBooking.workerPayoutAmount,
      });
    }

    // Notify worker
    if (assignedWorker) {
      addNotification({
        userId: assignedWorker.id,
        role: "WORKER",
        title: params.urgency === "EMERGENCY" ? "🚨 Emergency Job Dispatch!" : "New Service Request",
        message: `New booking ${bookingNumber} for ${service.name} at ${params.customerAddress}`,
        type: params.urgency === "EMERGENCY" ? "URGENT" : "INFO",
        link: `/worker/jobs/${newBooking.id}`,
      });
    }

    // Notify customer
    addNotification({
      userId: currentUser.id,
      role: "CUSTOMER",
      title: "Booking Requested & Matched",
      message: `Booking ${bookingNumber} placed. Assigned to ${assignedWorker?.profile.fullName || "Cooperative Worker"}.`,
      type: "SUCCESS",
      link: `/customer/bookings/${newBooking.id}`,
    });

    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: "CUSTOMER",
      action: "CREATE_BOOKING",
      entityType: "BOOKING",
      entityId: newBooking.id,
      details: `Created booking ${bookingNumber} for ${service.name} (${params.urgency})`,
    });

    return newBooking;
  };

  const updateBookingStatus = (
    bookingId: string,
    newStatus: BookingStatus,
    reason?: string,
    notes?: string
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: newStatus,
            cancellationReason: reason || b.cancellationReason,
            workerCompletionNotes: notes || b.workerCompletionNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );
  };

  const assignWorkerToBooking = (bookingId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            workerId: worker.id,
            workerName: worker.profile.fullName,
            workerPhone: worker.profile.phone,
            cooperativeName: worker.cooperativeName,
            status: "ASSIGNED",
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    addNotification({
      userId: worker.id,
      role: "WORKER",
      title: "Admin Dispatched Job Assignment",
      message: `You have been manually assigned to booking ${bookingId} by cooperative supervisor.`,
      type: "INFO",
      link: `/worker/jobs/${bookingId}`,
    });

    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentRole,
      action: "MANUAL_REASSIGN_WORKER",
      entityType: "BOOKING",
      entityId: bookingId,
      details: `Assigned worker ${worker.profile.fullName} to booking ${bookingId}`,
    });
  };

  const acceptBookingJob = (bookingId: string) => {
    updateBookingStatus(bookingId, "ACCEPTED");
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: booking.customerId,
        role: "CUSTOMER",
        title: "Worker Accepted Your Booking! 🎉",
        message: `${booking.workerName || "Your worker"} has accepted the job and scheduled the visit for ${booking.scheduledTime}.`,
        type: "SUCCESS",
        link: `/customer/bookings/${booking.id}`,
      });
    }
  };

  const rejectBookingJob = (bookingId: string, reason?: string) => {
    updateBookingStatus(bookingId, "MATCHING", reason);
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: "admin_demo_1",
        role: "SOCIETY_ADMIN",
        title: "Worker Declined Job - Re-matching Needed",
        message: `Booking ${booking.bookingNumber} was declined: ${reason || "Worker unavailable"}.`,
        type: "WARNING",
        link: `/admin/bookings`,
      });
    }
  };

  const startWorkerTravel = (bookingId: string) => {
    updateBookingStatus(bookingId, "WORKER_EN_ROUTE");
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: booking.customerId,
        role: "CUSTOMER",
        title: "Worker is En Route 🛵",
        message: `${booking.workerName || "Worker"} is on the way to your location.`,
        type: "INFO",
        link: `/customer/bookings/${booking.id}`,
      });
    }
  };

  const startServiceExecution = (bookingId: string) => {
    updateBookingStatus(bookingId, "SERVICE_STARTED");
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: booking.customerId,
        role: "CUSTOMER",
        title: "Service Started 🛠️",
        message: `${booking.workerName || "Worker"} has arrived and started the service.`,
        type: "INFO",
        link: `/customer/bookings/${booking.id}`,
      });
    }
  };

  const completeServiceExecution = (
    bookingId: string,
    completionNotes: string,
    photoUrl?: string
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: "SERVICE_COMPLETED",
            workerCompletionNotes: completionNotes,
            workerCompletionPhotoUrl: photoUrl,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      addNotification({
        userId: booking.customerId,
        role: "CUSTOMER",
        title: "Service Completed! Please Confirm & Pay",
        message: `${booking.workerName || "Worker"} has finished the work. Please review and complete payment.`,
        type: "SUCCESS",
        link: `/customer/bookings/${booking.id}`,
      });
    }
  };

  const submitPayment = (bookingId: string, paymentMethod: PaymentMethod) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const { payment, payout } = processSimulatedPayment({
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      customerId: booking.customerId,
      customerName: booking.customerName,
      workerId: booking.workerId || "unassigned",
      workerName: booking.workerName || "Unassigned worker",
      cooperativeId: "coop_noida_1",
      cooperativeName: booking.cooperativeName || "Noida Shramik Utthan Labour Society",
      totalAmount: booking.totalAmount,
      paymentMethod,
    });

    setPayments((prev) => [payment, ...prev]);
    setPayouts((prev) => [payout, ...prev]);

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: "PAYMENT_COMPLETED",
            paymentStatus: "PAYMENT_COMPLETED",
            payoutStatus: "PAYOUT_COMPLETED",
            paymentMethod,
            transactionRef: payment.transactionRef,
            invoiceNumber: payment.invoiceNumber,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    // Update worker completed count
    if (booking.workerId) {
      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id === booking.workerId) {
            return {
              ...w,
              completedServicesCount: w.completedServicesCount + 1,
            };
          }
          return w;
        })
      );
    }

    addNotification({
      userId: booking.customerId,
      role: "CUSTOMER",
      title: "Payment Received & Invoice Generated 🧾",
      message: `Payment of ₹${booking.totalAmount} was successful. Invoice ${payment.invoiceNumber} is ready.`,
      type: "SUCCESS",
      link: `/customer/bookings/${booking.id}`,
    });

    if (booking.workerId) {
      addNotification({
        userId: booking.workerId,
        role: "WORKER",
        title: "Payout Credited to Cooperative Account ₹",
        message: `₹${payment.workerShare} credited for booking ${booking.bookingNumber}.`,
        type: "SUCCESS",
        link: `/worker/earnings`,
      });
    }

    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: "CUSTOMER",
      action: "PROCESS_PAYMENT",
      entityType: "PAYMENT",
      entityId: payment.id,
      details: `Processed ₹${booking.totalAmount} for ${booking.bookingNumber} via ${paymentMethod}`,
    });
  };

  const submitRating = (params: {
    bookingId: string;
    rating: number;
    skillRating: number;
    punctualityRating: number;
    politenessRating: number;
    feedback: string;
  }) => {
    const booking = bookings.find((b) => b.id === params.bookingId);
    if (!booking || !booking.workerId) return;

    const newRating: Rating = {
      id: `rat_${Date.now()}`,
      bookingId: booking.id,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      workerId: booking.workerId,
      rating: params.rating,
      skillRating: params.skillRating,
      punctualityRating: params.punctualityRating,
      politenessRating: params.politenessRating,
      feedback: params.feedback,
      createdAt: new Date().toISOString(),
    };

    setRatings((prev) => [newRating, ...prev]);

    // Recalculate worker rating
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === booking.workerId) {
          const newCount = w.ratingCount + 1;
          const newAvg = (w.ratingAvg * w.ratingCount + params.rating) / newCount;
          return {
            ...w,
            ratingAvg: Math.round(newAvg * 10) / 10,
            ratingCount: newCount,
          };
        }
        return w;
      })
    );

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === params.bookingId) {
          return { ...b, ratingId: newRating.id };
        }
        return b;
      })
    );

    addNotification({
      userId: booking.workerId,
      role: "WORKER",
      title: `New Rating Received: ${params.rating} ⭐`,
      message: `Customer feedback: "${params.feedback.slice(0, 60)}..."`,
      type: "SUCCESS",
      link: `/worker/profile`,
    });
  };

  const createDispute = (params: {
    bookingId: string;
    reason: string;
    description: string;
    evidenceUrl?: string;
  }) => {
    const booking = bookings.find((b) => b.id === params.bookingId);
    if (!booking) return;

    const newDispute: Dispute = {
      id: `disp_${Date.now()}`,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      raisedBy: currentUser.id,
      raisedByName: currentUser.fullName,
      raisedByRole: currentRole,
      reason: params.reason,
      description: params.description,
      evidenceUrls: params.evidenceUrl ? [params.evidenceUrl] : [],
      status: "DISPUTE_OPENED",
      createdAt: new Date().toISOString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);
    updateBookingStatus(booking.id, "DISPUTED");

    addNotification({
      userId: "admin_demo_1",
      role: "SOCIETY_ADMIN",
      title: "New Dispute Raised",
      message: `Dispute filed on booking ${booking.bookingNumber} by ${currentUser.fullName}.`,
      type: "WARNING",
      link: `/admin/disputes`,
    });

    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentRole,
      action: "RAISE_DISPUTE",
      entityType: "DISPUTE",
      entityId: newDispute.id,
      details: `Raised dispute for ${booking.bookingNumber}: ${params.reason}`,
    });
  };

  const resolveDisputeAction = (
    disputeId: string,
    action: "REFUND_FULL" | "REFUND_PARTIAL" | "RE_SERVICE" | "REJECTED",
    adminNotes: string
  ) => {
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id === disputeId) {
          return {
            ...d,
            status: "RESOLVED",
            resolutionAction: action,
            adminNotes,
            resolvedBy: currentUser.fullName,
            resolvedAt: new Date().toISOString(),
          };
        }
        return d;
      })
    );

    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentRole,
      action: "RESOLVE_DISPUTE",
      entityType: "DISPUTE",
      entityId: disputeId,
      details: `Resolved dispute with action ${action}. Notes: ${adminNotes}`,
    });
  };

  const updateWorkerVerification = (
    workerId: string,
    status: VerificationStatus,
    notes?: string
  ) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            verificationStatus: status,
          };
        }
        return w;
      })
    );

    addNotification({
      userId: workerId,
      role: "WORKER",
      title: "Verification Status Updated",
      message: `Your cooperative verification status is now: ${status}`,
      type: status === "APPROVED" ? "SUCCESS" : "INFO",
      link: `/worker/profile`,
    });

    addAuditLog({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentRole,
      action: "UPDATE_WORKER_VERIFICATION",
      entityType: "WORKER_PROFILE",
      entityId: workerId,
      details: `Set verification status to ${status}. Notes: ${notes || "None"}`,
    });
  };

  const toggleWorkerAvailability = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            isAvailable: !w.isAvailable,
          };
        }
        return w;
      })
    );
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const resetToSeedData = () => {
    clearDemoPersistence();
    setCustomers(INITIAL_CUSTOMERS);
    setWorkers(INITIAL_WORKERS);
    setBookings(INITIAL_BOOKINGS);
    setPayments([]);
    setPayouts([]);
    setRatings(INITIAL_RATINGS);
    setDisputes(INITIAL_DISPUTES);
    setNotifications([]);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setDemandInsights(INITIAL_DEMAND_INSIGHTS);
    setDemoUser(INITIAL_CUSTOMERS[0]);
    setDemoRole("CUSTOMER");
    setIsDemoMode(false);
  };

  const logout = async () => {
    try {
      await logoutCurrent();
    } catch (e) {
      console.warn("Logout helper failed:", e);
    }
    setRealUser(null);
    setIsDemoMode(false);
    clearDemoPersistence();
    if (typeof window !== "undefined") {
      window.location.assign("/");
    }
  };

  const deleteAccount = async (): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) return { error: "Supabase is not configured" };
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return { error: "Not authenticated" };
    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ confirm: "DELETE" }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: json.error || "Could not delete account" };
    setRealUser(null);
    setIsDemoMode(false);
    await logoutCurrent();
    if (typeof window !== "undefined") {
      window.location.assign("/?deleted=1");
    }
    return {};
  };

  const updateOwnProfile = async (updates: Partial<Profile>): Promise<{ error?: string }> => {
    if (!realUser || isDemoMode) {
      const next = { ...currentUser, ...updates, updatedAt: new Date().toISOString() };
      if (isDemoMode) setDemoUser(next);
      return {};
    }
    const next = { ...realUser, ...updates, updatedAt: new Date().toISOString() };
    const result = await persistProfile(next);
    if (result.error) return result;
    await applyRealUser(next);
    return {};
  };

  const updateOwnWorkerBio = async (bio: string): Promise<{ error?: string }> => {
    if (!realUser || isDemoMode) {
      setWorkers((prev) => prev.map((w) => (w.id === currentUser.id ? { ...w, bio } : w)));
      return {};
    }
    const result = await persistWorkerBio(realUser.id, bio);
    if (result.error) return result;
    setWorkers((prev) => prev.map((w) => (w.id === realUser.id ? { ...w, bio } : w)));
    return {};
  };

  const uploadOwnAvatar = async (file: File) => {
    const userId = isDemoMode ? currentUser.id : realUser?.id;
    if (!userId || userId === "guest") return { error: "Sign in to upload an avatar." };
    if (isDemoMode || !realUser) return { error: "Avatar upload is available for real accounts." };
    const result = await uploadAvatarFile(userId, file);
    if (result.url) {
      await applyRealUser({ ...realUser, avatarUrl: result.url });
    }
    return result;
  };

  const removeOwnAvatar = async () => {
    if (!realUser || isDemoMode) return { error: "Avatar removal is available for real accounts." };
    const result = await removeAvatarFile(realUser.id);
    if (!result.error) await applyRealUser({ ...realUser, avatarUrl: undefined });
    return result;
  };

  const addOwnSkill = async (skill: Omit<WorkerSkill, "id" | "workerId">) => {
    const workerId = currentUser.id;
    if (isDemoMode || !realUser) {
      const local: WorkerSkill = { ...skill, id: `ws_${Date.now()}`, workerId };
      setWorkers((prev) => prev.map((w) => (w.id === workerId ? { ...w, skills: [...w.skills, local] } : w)));
      return {};
    }
    const result = await persistWorkerSkill(realUser.id, skill);
    if (result.error || !result.skill) return { error: result.error };
    setWorkers((prev) => prev.map((w) => (w.id === realUser.id ? { ...w, skills: [...w.skills.filter((s) => s.skillId !== result.skill!.skillId), result.skill!] } : w)));
    return {};
  };

  const removeOwnSkill = async (skillId: string) => {
    if (isDemoMode || !realUser) {
      setWorkers((prev) => prev.map((w) => (w.id === currentUser.id ? { ...w, skills: w.skills.filter((s) => s.id !== skillId) } : w)));
      return {};
    }
    const result = await deleteWorkerSkill(skillId);
    if (result.error) return result;
    setWorkers((prev) => prev.map((w) => (w.id === realUser.id ? { ...w, skills: w.skills.filter((s) => s.id !== skillId) } : w)));
    return {};
  };

  const saveOwnCertification = async (
    cert: Omit<Certification, "id" | "workerId" | "isVerified" | "certificationStatus"> & { id?: string }
  ) => {
    if (isDemoMode || !realUser) {
      const local: Certification = {
        ...cert,
        id: cert.id ?? `cert_${Date.now()}`,
        workerId: currentUser.id,
        isVerified: false,
        certificationStatus: "PENDING",
      };
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === currentUser.id
            ? {
                ...w,
                certifications: cert.id
                  ? w.certifications.map((c) => (c.id === cert.id ? local : c))
                  : [...w.certifications, local],
              }
            : w
        )
      );
      return { certification: local };
    }
    const result = await persistCertification(realUser.id, cert);
    if (result.certification) {
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === realUser.id
            ? {
                ...w,
                certifications: w.certifications.some((c) => c.id === result.certification!.id)
                  ? w.certifications.map((c) => (c.id === result.certification!.id ? result.certification! : c))
                  : [...w.certifications, result.certification!],
              }
            : w
        )
      );
    }
    return result;
  };

  const removeOwnCertification = async (certId: string) => {
    if (isDemoMode || !realUser) {
      setWorkers((prev) => prev.map((w) => (w.id === currentUser.id ? { ...w, certifications: w.certifications.filter((c) => c.id !== certId) } : w)));
      return {};
    }
    const result = await deleteCertification(certId, realUser.id);
    if (result.error) return result;
    setWorkers((prev) => prev.map((w) => (w.id === realUser.id ? { ...w, certifications: w.certifications.filter((c) => c.id !== certId) } : w)));
    return {};
  };

  const uploadOwnCertificateFile = async (certId: string, file: File) => {
    if (!realUser || isDemoMode) return { error: "Certificate upload is available for real accounts." };
    const result = await uploadCertificateFile(realUser.id, certId, file);
    if (result.path) {
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === realUser.id
            ? { ...w, certifications: w.certifications.map((c) => (c.id === certId ? { ...c, documentUrl: result.path } : c)) }
            : w
        )
      );
    }
    return result;
  };

  const reviewCertification = (workerId: string, certId: string, status: "APPROVED" | "REJECTED", notes?: string) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              certifications: w.certifications.map((c) =>
                c.id === certId
                  ? {
                      ...c,
                      certificationStatus: status,
                      isVerified: status === "APPROVED",
                      adminNotes: notes,
                      reviewedAt: new Date().toISOString(),
                    }
                  : c
              ),
            }
          : w
      )
    );
  };

  const changePasswordWrapper = async (newPassword: string) => {
    try {
      return await changePassword(newPassword);
    } catch (e) {
      console.error(e);
      return { error: e };
    }
  };

  return (
    <StateContext.Provider
      value={{
        currentUser,
        currentRole,
        realUser,
        demoUser: isDemoMode ? demoUser : null,
        demoRole: isDemoMode ? demoRole : null,
        isAuthenticated,
        isDemoMode,
        authReady,
        setCurrentRole,
        switchDemoUser,
        enterDemoMode,
        exitDemoMode,
        registerDemoUser,
        registerAccount,
        loginAccount,
        loginDemoByEmail,
        logout,
        deleteAccount,
        changePassword: changePasswordWrapper,
        authenticatedUser,
        updateOwnProfile,
        updateOwnWorkerBio,
        uploadOwnAvatar,
        removeOwnAvatar,
        addOwnSkill,
        removeOwnSkill,
        saveOwnCertification,
        removeOwnCertification,
        uploadOwnCertificateFile,
        reviewCertification,
        customers,
        workers,
        bookings,
        payments,
        payouts,
        ratings,
        disputes,
        notifications,
        auditLogs,
        demandInsights,
        createBooking,
        updateBookingStatus,
        assignWorkerToBooking,
        acceptBookingJob,
        rejectBookingJob,
        startWorkerTravel,
        startServiceExecution,
        completeServiceExecution,
        submitPayment,
        submitRating,
        createDispute,
        resolveDisputeAction,
        updateWorkerVerification,
        toggleWorkerAvailability,
        markNotificationAsRead,
        resetToSeedData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}
