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
  fetchProfilesByMode,
  createProfileForMode,
  getActiveProfileId,
  setActiveProfileId,
  getActiveProfile,
  logoutCurrent,
  changePassword,
} from "./demoStore";
import { DEMO_USERS, SERVICES, SERVICE_CATEGORIES } from "@/constants";
import { generateBookingNumber } from "@/lib/utils";
import { processSimulatedPayment } from "@/lib/payments/mockPaymentEngine";
import {
  cloneWorkerTemplateForRegistration,
  createRegisteredCustomerProfile,
  findDemoUserByEmail,
  generateUserId,
} from "@/lib/auth/authHelpers";

interface StateContextType {
  currentUser: Profile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  switchDemoUser: (role: UserRole) => void;
  registerDemoUser: (params: {
    fullName: string;
    email: string;
    role: "CUSTOMER" | "WORKER";
  }) => Profile;
  loginDemoByEmail: (email: string) => { role: UserRole; targetUrl: string } | null;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<any>;
  authenticatedUser?: Profile | null;
  
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
  const [currentUser, setCurrentUser] = useState<Profile>(INITIAL_CUSTOMERS[0]);
  const [currentRole, setCurrentRoleState] = useState<UserRole>("CUSTOMER");
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
  const [authenticatedUser, setAuthenticatedUser] = useState<Profile | null>(null);

  // Load from localStorage if present
  useEffect(() => {
    // After initial load, attempt to resolve authenticated user from Supabase and map to profile
    const resolveAuthUser = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) return;
        const email = data.user.email;
        if (!email) return;
        // fetch profile by email
        const { data: profileRows, error: pErr } = await supabase.from("profiles").select("*").eq("email", email).limit(1).single();
        if (pErr || !profileRows) {
          return;
        }
        const prof = profileRows;
        const mapped: Profile = {
          id: prof.id,
          email: prof.email,
          fullName: prof.full_name ?? prof.fullName ?? "",
          phone: prof.phone,
          role: prof.role,
          address: prof.address,
          city: prof.city,
          state: prof.state,
          postalCode: prof.postal_code ?? prof.postalCode,
          lat: prof.location?.coordinates?.[1] ?? prof.lat ?? undefined,
          lng: prof.location?.coordinates?.[0] ?? prof.lng ?? undefined,
          createdAt: prof.created_at,
          updatedAt: prof.updated_at,
        };
        setAuthenticatedUser(mapped);
      } catch (e) {
        // ignore
      }
    };

    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.workers) setWorkers(parsed.workers);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.payouts) setPayouts(parsed.payouts);
        if (parsed.ratings) setRatings(parsed.ratings);
        if (parsed.disputes) setDisputes(parsed.disputes);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.currentRole) setCurrentRoleState(parsed.currentRole);
      }
    } catch (e) {
      console.warn("Failed to load Sahyog saved state, using defaults:", e);
    }

    // resolve authenticated user (async)
    resolveAuthUser().catch(() => {});
    setIsLoaded(true);
  }, []);

  // Save to localStorage on state change
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
        currentUser,
        currentRole,
      };
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
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
    currentUser,
    currentRole,
  ]);

  const switchDemoUser = (role: UserRole) => {
    setCurrentRoleState(role);

    const mode = (() => {
      if (role === "CUSTOMER") return "customer";
      if (role === "WORKER") return "worker";
      if (role === "SOCIETY_ADMIN") return "cooperative";
      if (role === "FEDERATION_ADMIN") return "federation";
      return "customer";
    })();

    // Try to fetch persisted profiles (Supabase) first, fallback to demo data
    try {
      // fetchProfilesByMode returns either Profile[] or WorkerProfile[]
      // Do not await here to keep function synchronous for callers; update state when promise resolves
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchProfilesByMode(mode as any).then((list: any) => {
        if (!list || (Array.isArray(list) && list.length === 0)) {
          // fallback to prior demo defaults
          if (role === "CUSTOMER") setCurrentUser(INITIAL_CUSTOMERS[0]);
          else if (role === "WORKER") {
            const w = workers[0];
            setCurrentUser({ ...w.profile, role: "WORKER" });
          } else if (role === "SOCIETY_ADMIN") {
            setCurrentUser({
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
            });
          } else if (role === "FEDERATION_ADMIN") {
            setCurrentUser({
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
            });
          }
          return;
        }

        // select active profile id if set, else pick first
        const activeId = getActiveProfileId(mode as any);
        let selected: any = null;
        if (activeId) selected = (list as any[]).find((p) => p.id === activeId || (p.profile && p.profile.id === activeId));
        if (!selected) selected = (list as any[])[0];

        if (!selected) return;

        if (role === "WORKER") {
          setCurrentUser({ ...selected.profile, role: "WORKER" });
          setActiveProfileId(mode as any, selected.id || selected.profile.id);
        } else {
          setCurrentUser({ ...selected, role });
          setActiveProfileId(mode as any, selected.id);
        }
      });
    } catch (e) {
      // fallback to previous behaviour
      if (role === "CUSTOMER") setCurrentUser(INITIAL_CUSTOMERS[0]);
      else if (role === "WORKER") {
        const w = workers[0];
        setCurrentUser({ ...w.profile, role: "WORKER" });
      }
    }
  };

  const setCurrentRole = (role: UserRole) => {
    switchDemoUser(role);
  };

  const registerDemoUser = (params: {
    fullName: string;
    email: string;
    role: "CUSTOMER" | "WORKER";
  }): Profile => {
    const fullName = params.fullName.trim();
    const email = params.email.trim();

    // Try to persist to Supabase (via createProfileForMode). If not available, fallback to local demo arrays
    try {
      const mode = params.role === "CUSTOMER" ? "customer" : "worker";
      // Fire-and-forget; update local state when promise resolves
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const created: any = await createProfileForMode(mode as any, { fullName, email });
        if (!created) return;
        if (params.role === "CUSTOMER") {
          setCustomers((prev) => [...prev, created]);
          setCurrentUser(created);
          setCurrentRoleState("CUSTOMER");
          setActiveProfileId("customer", created.id);
        } else {
          // WorkerProfile
          setWorkers((prev) => [...prev, created]);
          setCurrentUser({ ...created.profile, role: "WORKER" });
          setCurrentRoleState("WORKER");
          setActiveProfileId("worker", created.id);
        }
      })();
    } catch (e) {
      // fallback to previous demo behavior
      if (params.role === "CUSTOMER") {
        const id = generateUserId("cust");
        const profile = createRegisteredCustomerProfile({
          id,
          fullName,
          email,
          template: INITIAL_CUSTOMERS[0],
        });
        setCustomers((prev) => [...prev, profile]);
        setCurrentUser(profile);
        setCurrentRoleState("CUSTOMER");
        return profile;
      }

      const id = generateUserId("worker");
      const worker = cloneWorkerTemplateForRegistration({
        id,
        fullName,
        email,
        template: INITIAL_WORKERS[0],
      });
      setWorkers((prev) => [...prev, worker]);
      setCurrentUser({ ...worker.profile, role: "WORKER" });
      setCurrentRoleState("WORKER");
      return worker.profile;
    }

    // Return a temporary profile immediately (UX) while persistence completes
    if (params.role === "CUSTOMER") {
      const id = generateUserId("cust");
      const profile = createRegisteredCustomerProfile({
        id,
        fullName,
        email,
        template: INITIAL_CUSTOMERS[0],
      });
      setCustomers((prev) => [...prev, profile]);
      setCurrentUser(profile);
      setCurrentRoleState("CUSTOMER");
      return profile;
    }

    const id = generateUserId("worker");
    const worker = cloneWorkerTemplateForRegistration({
      id,
      fullName,
      email,
      template: INITIAL_WORKERS[0],
    });
    setWorkers((prev) => [...prev, worker]);
    setCurrentUser({ ...worker.profile, role: "WORKER" });
    setCurrentRoleState("WORKER");
    return worker.profile;
  };

  const loginDemoByEmail = (email: string): { role: UserRole; targetUrl: string } | null => {
    // First check local demo arrays
    const match = findDemoUserByEmail(email, customers, workers);
    if (match) {
      setCurrentUser(match.profile);
      setCurrentRoleState(match.role);
      return { role: match.role, targetUrl: match.targetUrl };
    }

    // Otherwise try Supabase-backed profiles (async) and set user when found
    (async () => {
      try {
        const customerList: Profile[] = (await fetchProfilesByMode("customer")) as Profile[];
        const workerList: WorkerProfile[] = (await fetchProfilesByMode("worker")) as WorkerProfile[];
        const c = customerList.find((p) => p.email === email);
        if (c) {
          setCurrentUser(c);
          setCurrentRoleState("CUSTOMER");
          return;
        }
        const w = workerList.find((wp) => wp.profile?.email === email || wp.email === email);
        if (w) {
          setCurrentUser({ ...w.profile, role: "WORKER" });
          setCurrentRoleState("WORKER");
          return;
        }
      } catch (e) {
        // ignore
      }
    })();

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
          w.skills.some((s) => s.serviceId === service.id)
      ) || workers[0];
    }

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
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
      status: "ASSIGNED",
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
      workerId: booking.workerId || "worker_demo_1",
      workerName: booking.workerName || "Cooperative Worker",
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
    localStorage.removeItem(STORAGE_KEY);
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
    setCurrentUser(INITIAL_CUSTOMERS[0]);
    setCurrentRoleState("CUSTOMER");
  };

  const logout = async () => {
    try {
      await logoutCurrent();
    } catch (e) {
      console.warn("Logout helper failed:", e);
    }
    resetToSeedData();
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
        setCurrentRole,
        switchDemoUser,
        registerDemoUser,
        loginDemoByEmail,
        logout,
        changePassword: changePasswordWrapper,
        authenticatedUser,
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