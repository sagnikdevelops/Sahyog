// Sahyog - Complete Seed Data & Initial Store
import {
  Profile,
  WorkerProfile,
  Cooperative,
  Federation,
  Booking,
  Payment,
  Payout,
  Rating,
  Dispute,
  Notification,
  AuditLog,
  DemandInsight,
} from "@/types";
import { COOPERATIVE_SOCIETIES, FEDERATION, SERVICES } from "@/constants";

export const INITIAL_CUSTOMERS: Profile[] = [
  {
    id: "cust_demo_1",
    email: "customer.demo@example.com",
    fullName: "Aarav Sharma",
    phone: "+91 98765 43210",
    role: "CUSTOMER",
    address: "B-402, Green Valley Apartments, Sector 62",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201301",
    lat: 28.628,
    lng: 77.3649,
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "cust_demo_2",
    email: "priya.nair@example.com",
    fullName: "Priya Nair",
    phone: "+91 98765 43211",
    role: "CUSTOMER",
    address: "Flat 12A, Amrapali Platinum, Sector 119",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201307",
    lat: 28.585,
    lng: 77.391,
    createdAt: "2026-08-02T11:30:00Z",
    updatedAt: "2026-08-02T11:30:00Z",
  },
  {
    id: "cust_demo_3",
    email: "vikram.malhotra@example.com",
    fullName: "Vikram Malhotra",
    phone: "+91 98765 43212",
    role: "CUSTOMER",
    address: "House 45, Pocket 2, Mayur Vihar Phase 1",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110091",
    lat: 28.608,
    lng: 77.294,
    createdAt: "2026-08-03T09:15:00Z",
    updatedAt: "2026-08-03T09:15:00Z",
  },
  {
    id: "cust_demo_4",
    email: "ananya.sen@example.com",
    fullName: "Ananya Sen",
    phone: "+91 98765 43213",
    role: "CUSTOMER",
    address: "Tower 4, Express Greens, Sector 137",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201305",
    lat: 28.513,
    lng: 77.406,
    createdAt: "2026-08-04T14:20:00Z",
    updatedAt: "2026-08-04T14:20:00Z",
  },
  {
    id: "cust_demo_5",
    email: "rohit.kapoor@example.com",
    fullName: "Rohit Kapoor",
    phone: "+91 98765 43214",
    role: "CUSTOMER",
    address: "Villa 8, Windsor Park, Indirapuram",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    postalCode: "201014",
    lat: 28.643,
    lng: 77.371,
    createdAt: "2026-08-05T16:00:00Z",
    updatedAt: "2026-08-05T16:00:00Z",
  },
  {
    id: "cust_demo_6",
    email: "meera.iyer@example.com",
    fullName: "Meera Iyer",
    phone: "+91 98765 43215",
    role: "CUSTOMER",
    address: "C-12, Sector 15A",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201301",
    lat: 28.586,
    lng: 77.311,
    createdAt: "2026-08-06T10:10:00Z",
    updatedAt: "2026-08-06T10:10:00Z",
  },
  {
    id: "cust_demo_7",
    email: "sanjay.gupta@example.com",
    fullName: "Sanjay Gupta",
    phone: "+91 98765 43216",
    role: "CUSTOMER",
    address: "Shop 4, Market Complex, Sector 18",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201301",
    lat: 28.571,
    lng: 77.322,
    createdAt: "2026-08-07T12:00:00Z",
    updatedAt: "2026-08-07T12:00:00Z",
  },
  {
    id: "cust_demo_8",
    email: "neha.bansal@example.com",
    fullName: "Neha Bansal",
    phone: "+91 98765 43217",
    role: "CUSTOMER",
    address: "D-90, Sector 50",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201301",
    lat: 28.572,
    lng: 77.362,
    createdAt: "2026-08-08T15:45:00Z",
    updatedAt: "2026-08-08T15:45:00Z",
  },
  {
    id: "cust_demo_9",
    email: "alok.tripathi@example.com",
    fullName: "Alok Tripathi",
    phone: "+91 98765 43218",
    role: "CUSTOMER",
    address: "Block B, Shipra Sun City, Indirapuram",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    postalCode: "201014",
    lat: 28.636,
    lng: 77.378,
    createdAt: "2026-08-09T08:30:00Z",
    updatedAt: "2026-08-09T08:30:00Z",
  },
  {
    id: "cust_demo_10",
    email: "deepa.menon@example.com",
    fullName: "Deepa Menon",
    phone: "+91 98765 43219",
    role: "CUSTOMER",
    address: "Flat 304, Mahagun Moderne, Sector 78",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "201301",
    lat: 28.566,
    lng: 77.388,
    createdAt: "2026-08-10T17:00:00Z",
    updatedAt: "2026-08-10T17:00:00Z",
  },
];

export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: "worker_demo_1",
    profile: {
      id: "worker_demo_1",
      email: "worker.demo@example.com",
      fullName: "Ramesh Kumar Verma",
      phone: "+91 98111 22334",
      role: "WORKER",
      address: "Shop 12, Cooperative Nagar, Sector 59",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      lat: 28.625,
      lng: 77.368,
      createdAt: "2026-07-15T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_noida_1",
    cooperativeName: "Noida Shramik Utthan Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "APPROVED",
    experienceYears: 8,
    serviceRadiusKm: 15,
    isAvailable: true,
    currentLat: 28.625,
    currentLng: 77.368,
    ratingAvg: 4.9,
    ratingCount: 38,
    completedServicesCount: 42,
    bio: "Master Plumber certified by National Skill Development Corporation (NSDC). 8+ years experience in high-pressure leak detection, sanitary installations, and emergency waterline fixes.",
    skills: [
      {
        id: "ws_1",
        workerId: "worker_demo_1",
        skillId: "sk_plumb_1",
        skillName: "Emergency Leak & Pipe Burst",
        serviceId: "srv_plumb_emergency",
        serviceName: "Emergency Leak & Pipe Burst Repair",
        isVerified: true,
        verifiedBy: "Sunita Deshmukh",
        verifiedAt: "2026-07-20T10:00:00Z",
      },
      {
        id: "ws_2",
        workerId: "worker_demo_1",
        skillId: "sk_plumb_2",
        skillName: "Sanitary & Tap Fitting",
        serviceId: "srv_plumb_standard",
        serviceName: "Tap, Shower & Sanitary Fitting",
        isVerified: true,
        verifiedBy: "Sunita Deshmukh",
        verifiedAt: "2026-07-20T10:00:00Z",
      },
    ],
    certifications: [
      {
        id: "cert_1",
        workerId: "worker_demo_1",
        title: "NSDC Level 4 Master Plumbing Technician",
        issuingBody: "Skill India / NSDC",
        issueDate: "2021-06-10",
        isVerified: true,
        certificationStatus: "APPROVED",
      },
      {
        id: "cert_2",
        workerId: "worker_demo_1",
        title: "Cooperative Safety & Hygiene Compliance",
        issuingBody: "Noida Shramik Utthan Labour Society",
        issueDate: "2023-01-15",
        isVerified: true,
        certificationStatus: "APPROVED",
      },
    ],
    availability: [
      { id: "av_1", workerId: "worker_demo_1", dayOfWeek: 1, startTime: "08:00", endTime: "20:00", isActive: true },
      { id: "av_2", workerId: "worker_demo_1", dayOfWeek: 2, startTime: "08:00", endTime: "20:00", isActive: true },
      { id: "av_3", workerId: "worker_demo_1", dayOfWeek: 3, startTime: "08:00", endTime: "20:00", isActive: true },
      { id: "av_4", workerId: "worker_demo_1", dayOfWeek: 4, startTime: "08:00", endTime: "20:00", isActive: true },
      { id: "av_5", workerId: "worker_demo_1", dayOfWeek: 5, startTime: "08:00", endTime: "20:00", isActive: true },
      { id: "av_6", workerId: "worker_demo_1", dayOfWeek: 6, startTime: "08:00", endTime: "20:00", isActive: true },
    ],
    welfare: [
      {
        id: "welf_1",
        workerId: "worker_demo_1",
        schemeName: "Pradhan Mantri Suraksha Bima (Cooperative Group)",
        policyNo: "COOP-PMSBY-2026-881",
        provider: "National Insurance Co. Ltd.",
        coverageAmount: 200000,
        validUntil: "2027-05-31",
        status: "ACTIVE",
      },
      {
        id: "welf_2",
        workerId: "worker_demo_1",
        schemeName: "Cooperative Workers Welfare Health Fund",
        policyNo: "NCF-HLTH-994",
        provider: "NCR Labour Federation Trust",
        coverageAmount: 100000,
        validUntil: "2027-03-31",
        status: "ACTIVE",
      },
    ],
    activeBookingsCount: 0,
  },
  {
    id: "worker_demo_2",
    profile: {
      id: "worker_demo_2",
      email: "rajesh.elec@example.com",
      fullName: "Rajesh Kumar Sharma",
      phone: "+91 98111 22335",
      role: "WORKER",
      address: "Street 4, Sector 63",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      lat: 28.629,
      lng: 77.375,
      createdAt: "2026-07-16T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_noida_1",
    cooperativeName: "Noida Shramik Utthan Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "APPROVED",
    experienceYears: 10,
    serviceRadiusKm: 20,
    isAvailable: true,
    currentLat: 28.629,
    currentLng: 77.375,
    ratingAvg: 4.8,
    ratingCount: 52,
    completedServicesCount: 65,
    bio: "ITI Certified Wireman with 10 years experience in commercial & domestic electrification, DB dressing, and emergency short circuit repair.",
    skills: [
      {
        id: "ws_3",
        workerId: "worker_demo_2",
        skillId: "sk_elec_1",
        skillName: "Emergency Short Circuit Fix",
        serviceId: "srv_elec_emergency",
        serviceName: "Emergency Power & Short Circuit Fix",
        isVerified: true,
        verifiedBy: "Sunita Deshmukh",
        verifiedAt: "2026-07-21T10:00:00Z",
      },
      {
        id: "ws_4",
        workerId: "worker_demo_2",
        skillId: "sk_elec_2",
        skillName: "Switchboard & Socket Installation",
        serviceId: "srv_elec_switchboard",
        serviceName: "Switchboard & Socket Installation",
        isVerified: true,
        verifiedBy: "Sunita Deshmukh",
        verifiedAt: "2026-07-21T10:00:00Z",
      },
    ],
    certifications: [
      {
        id: "cert_3",
        workerId: "worker_demo_2",
        title: "National Trade Certificate - Electrician / Wireman",
        issuingBody: "NCVT / ITI Noida",
        issueDate: "2016-07-12",
        isVerified: true,
        certificationStatus: "APPROVED",
      },
    ],
    availability: [
      { id: "av_7", workerId: "worker_demo_2", dayOfWeek: 1, startTime: "09:00", endTime: "21:00", isActive: true },
      { id: "av_8", workerId: "worker_demo_2", dayOfWeek: 2, startTime: "09:00", endTime: "21:00", isActive: true },
      { id: "av_9", workerId: "worker_demo_2", dayOfWeek: 3, startTime: "09:00", endTime: "21:00", isActive: true },
      { id: "av_10", workerId: "worker_demo_2", dayOfWeek: 4, startTime: "09:00", endTime: "21:00", isActive: true },
      { id: "av_11", workerId: "worker_demo_2", dayOfWeek: 5, startTime: "09:00", endTime: "21:00", isActive: true },
    ],
    welfare: [
      {
        id: "welf_3",
        workerId: "worker_demo_2",
        schemeName: "Cooperative Accident Group Insurance",
        policyNo: "CAGI-2026-119",
        provider: "United India Insurance",
        coverageAmount: 500000,
        validUntil: "2027-04-30",
        status: "ACTIVE",
      },
    ],
    activeBookingsCount: 0,
  },
  {
    id: "worker_demo_3",
    profile: {
      id: "worker_demo_3",
      email: "manoj.carp@example.com",
      fullName: "Manoj Vishwakarma",
      phone: "+91 98111 22336",
      role: "WORKER",
      address: "Gali 2, Sector 12",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      lat: 28.598,
      lng: 77.332,
      createdAt: "2026-07-17T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_noida_1",
    cooperativeName: "Noida Shramik Utthan Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "APPROVED",
    experienceYears: 12,
    serviceRadiusKm: 15,
    isAvailable: true,
    currentLat: 28.598,
    currentLng: 77.332,
    ratingAvg: 4.95,
    ratingCount: 29,
    completedServicesCount: 35,
    bio: "Skilled traditional and modern carpenter specializing in precision lock repairs, modular furniture assembling, and door frame restoration.",
    skills: [
      {
        id: "ws_5",
        workerId: "worker_demo_3",
        skillId: "sk_carp_1",
        skillName: "Door, Window & Lock Repair",
        serviceId: "srv_carp_repair",
        serviceName: "Door, Window & Lock Repair",
        isVerified: true,
        verifiedBy: "Sunita Deshmukh",
        verifiedAt: "2026-07-22T10:00:00Z",
      },
    ],
    certifications: [
      {
        id: "cert_4",
        workerId: "worker_demo_3",
        title: "Traditional Artisan Guild Recognition",
        issuingBody: "Vishwakarma Shramik Sangh",
        issueDate: "2018-03-20",
        isVerified: true,
        certificationStatus: "APPROVED",
      },
    ],
    availability: [
      { id: "av_12", workerId: "worker_demo_3", dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isActive: true },
      { id: "av_13", workerId: "worker_demo_3", dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isActive: true },
      { id: "av_14", workerId: "worker_demo_3", dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isActive: true },
      { id: "av_15", workerId: "worker_demo_3", dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isActive: true },
      { id: "av_16", workerId: "worker_demo_3", dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isActive: true },
    ],
    welfare: [],
    activeBookingsCount: 0,
  },
  {
    id: "worker_demo_4",
    profile: {
      id: "worker_demo_4",
      email: "sunil.paint@example.com",
      fullName: "Sunil Yadav",
      phone: "+91 98111 22337",
      role: "WORKER",
      address: "Village Khora, near Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      lat: 28.631,
      lng: 77.359,
      createdAt: "2026-07-18T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_ghaziabad_1",
    cooperativeName: "Ghaziabad Kaushal Vikas Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "COOPERATIVE_VERIFIED",
    experienceYears: 6,
    serviceRadiusKm: 12,
    isAvailable: true,
    currentLat: 28.631,
    currentLng: 77.359,
    ratingAvg: 4.7,
    ratingCount: 22,
    completedServicesCount: 28,
    bio: "Professional painter with extensive experience in waterproof base coating, putty smoothing, and luxury emulsion finishes.",
    skills: [
      {
        id: "ws_6",
        workerId: "worker_demo_4",
        skillId: "sk_paint_1",
        skillName: "Wall Touchup & Damp Repair",
        serviceId: "srv_paint_touchup",
        serviceName: "Wall Touchup & Damp Repair",
        isVerified: true,
        verifiedBy: "Mahesh Chandra",
        verifiedAt: "2026-07-25T10:00:00Z",
      },
    ],
    certifications: [],
    availability: [],
    welfare: [],
    activeBookingsCount: 0,
  },
  {
    id: "worker_demo_5",
    profile: {
      id: "worker_demo_5",
      email: "anita.clean@example.com",
      fullName: "Anita Devi",
      phone: "+91 98111 22338",
      role: "WORKER",
      address: "Labour Colony, Indirapuram",
      city: "Ghaziabad",
      state: "Uttar Pradesh",
      postalCode: "201014",
      lat: 28.641,
      lng: 77.373,
      createdAt: "2026-07-19T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_ghaziabad_1",
    cooperativeName: "Ghaziabad Kaushal Vikas Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "APPROVED",
    experienceYears: 5,
    serviceRadiusKm: 10,
    isAvailable: true,
    currentLat: 28.641,
    currentLng: 77.373,
    ratingAvg: 4.85,
    ratingCount: 31,
    completedServicesCount: 40,
    bio: "Trained sanitization expert in industrial deep cleaning chemicals, machine scrubbing, and hygiene management.",
    skills: [
      {
        id: "ws_7",
        workerId: "worker_demo_5",
        skillId: "sk_clean_1",
        skillName: "Full Home Deep Sanitization",
        serviceId: "srv_clean_deep",
        serviceName: "Full Home Deep Sanitization",
        isVerified: true,
        verifiedBy: "Mahesh Chandra",
        verifiedAt: "2026-07-26T10:00:00Z",
      },
    ],
    certifications: [],
    availability: [],
    welfare: [],
    activeBookingsCount: 0,
  },
  {
    id: "worker_demo_6",
    profile: {
      id: "worker_demo_6",
      email: "sarita.care@example.com",
      fullName: "Sarita Kumari",
      phone: "+91 98111 22339",
      role: "WORKER",
      address: "Sector 71, near Metro",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      lat: 28.589,
      lng: 77.376,
      createdAt: "2026-07-20T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_noida_1",
    cooperativeName: "Noida Shramik Utthan Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "APPROVED",
    experienceYears: 7,
    serviceRadiusKm: 15,
    isAvailable: true,
    currentLat: 28.589,
    currentLng: 77.376,
    ratingAvg: 5.0,
    ratingCount: 19,
    completedServicesCount: 24,
    bio: "Certified Geriatric Care Assistant. Experienced in empathetic senior support, mobility assistance, vitals tracking, and medication schedules.",
    skills: [
      {
        id: "ws_8",
        workerId: "worker_demo_6",
        skillId: "sk_care_1",
        skillName: "Elderly Assistance & Daily Care",
        serviceId: "srv_care_daily",
        serviceName: "Elderly Assistance & Daily Care (4-Hour)",
        isVerified: true,
        verifiedBy: "Sunita Deshmukh",
        verifiedAt: "2026-07-27T10:00:00Z",
      },
    ],
    certifications: [
      {
        id: "cert_5",
        workerId: "worker_demo_6",
        title: "Certificate in Home Health Aide & Geriatric Care",
        issuingBody: "Healthcare Sector Skill Council (HSSC)",
        issueDate: "2020-11-15",
        isVerified: true,
        certificationStatus: "APPROVED",
      },
    ],
    availability: [],
    welfare: [],
    activeBookingsCount: 0,
  },
  {
    id: "worker_demo_7",
    profile: {
      id: "worker_demo_7",
      email: "deepak.tech@example.com",
      fullName: "Deepak Chauhan",
      phone: "+91 98111 22340",
      role: "WORKER",
      address: "Sector 22",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      lat: 28.599,
      lng: 77.348,
      createdAt: "2026-07-21T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_noida_1",
    cooperativeName: "Noida Shramik Utthan Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "APPROVED",
    experienceYears: 9,
    serviceRadiusKm: 20,
    isAvailable: true,
    currentLat: 28.599,
    currentLng: 77.348,
    ratingAvg: 4.88,
    ratingCount: 44,
    completedServicesCount: 50,
    bio: "HVAC and appliance refrigeration specialist certified by Daikin/Voltas technical training center.",
    skills: [
      {
        id: "ws_9",
        workerId: "worker_demo_7",
        skillId: "sk_tech_1",
        skillName: "AC Jet Servicing & Gas Leak Check",
        serviceId: "srv_tech_ac",
        serviceName: "AC Jet Servicing & Gas Leak Check",
        isVerified: true,
        verifiedBy: "Sunita Deshmukh",
        verifiedAt: "2026-07-28T10:00:00Z",
      },
    ],
    certifications: [],
    availability: [],
    welfare: [],
    activeBookingsCount: 0,
  },
  {
    id: "worker_demo_8",
    profile: {
      id: "worker_demo_8",
      email: "virender.driver@example.com",
      fullName: "Virender Singh",
      phone: "+91 98111 22341",
      role: "WORKER",
      address: "Sector 45",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      lat: 28.558,
      lng: 77.351,
      createdAt: "2026-07-22T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_noida_1",
    cooperativeName: "Noida Shramik Utthan Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "COOPERATIVE_VERIFIED",
    experienceYears: 14,
    serviceRadiusKm: 25,
    isAvailable: true,
    currentLat: 28.558,
    currentLng: 77.351,
    ratingAvg: 4.75,
    ratingCount: 16,
    completedServicesCount: 20,
    bio: "Commercial Heavy/Light Vehicle driver with clean background record and cooperative verification.",
    skills: [],
    certifications: [],
    availability: [],
    welfare: [],
    activeBookingsCount: 0,
  },
  {
    id: "worker_demo_9",
    profile: {
      id: "worker_demo_9",
      email: "ramprasad.garden@example.com",
      fullName: "Ram Prasad Mali",
      phone: "+91 98111 22342",
      role: "WORKER",
      address: "Botanical Garden Area, Sector 38",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      lat: 28.564,
      lng: 77.334,
      createdAt: "2026-07-23T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_noida_1",
    cooperativeName: "Noida Shramik Utthan Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "DOCUMENT_PENDING",
    experienceYears: 15,
    serviceRadiusKm: 10,
    isAvailable: true,
    currentLat: 28.564,
    currentLng: 77.334,
    ratingAvg: 4.6,
    ratingCount: 12,
    completedServicesCount: 15,
    bio: "Expert gardener with 15+ years experience in ornamental plant pruning, bonsai grafting, and soil enrichment.",
    skills: [],
    certifications: [],
    availability: [],
    welfare: [],
    activeBookingsCount: 0,
  },
  {
    id: "worker_demo_10",
    profile: {
      id: "worker_demo_10",
      email: "sunita.bai@example.com",
      fullName: "Sunita Bai",
      phone: "+91 98111 22343",
      role: "WORKER",
      address: "Sector 11",
      city: "Noida",
      state: "Uttar Pradesh",
      postalCode: "201301",
      lat: 28.595,
      lng: 77.331,
      createdAt: "2026-07-24T09:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    },
    cooperativeId: "coop_ghaziabad_1",
    cooperativeName: "Ghaziabad Kaushal Vikas Labour Cooperative Society Ltd.",
    federationName: "National Capital Region Labour Cooperative Federation",
    verificationStatus: "UNVERIFIED",
    experienceYears: 4,
    serviceRadiusKm: 8,
    isAvailable: false,
    currentLat: 28.595,
    currentLng: 77.331,
    ratingAvg: 0,
    ratingCount: 0,
    completedServicesCount: 0,
    bio: "Newly enrolled cooperative member for domestic support and home prep assistance. Awaiting document verification.",
    skills: [],
    certifications: [],
    availability: [],
    welfare: [],
    activeBookingsCount: 0,
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bk_seed_101",
    bookingNumber: "SHY-260824-101",
    customerId: "cust_demo_1",
    customerName: "Aarav Sharma",
    customerPhone: "+91 98765 43210",
    customerAddress: "B-402, Green Valley Apartments, Sector 62, Noida",
    customerLat: 28.628,
    customerLng: 77.3649,
    serviceId: "srv_plumb_emergency",
    serviceName: "Emergency Leak & Pipe Burst Repair",
    categoryName: "Plumbing Services",
    workerId: "worker_demo_1",
    workerName: "Ramesh Kumar Verma",
    workerPhone: "+91 98111 22334",
    cooperativeName: "Noida Shramik Utthan Labour Cooperative Society Ltd.",
    status: "PAYMENT_COMPLETED",
    urgency: "EMERGENCY",
    scheduledDate: "2026-08-24",
    scheduledTime: "10:30 AM",
    description: "Burst main inlet pipe under kitchen sink with severe water gushing.",
    workerCompletionNotes: "Replaced damaged CPVC coupling with heavy-duty brass valve, pressure tested to 4.5 bar, no leakage detected.",
    totalAmount: 450,
    platformFee: 23,
    cooperativeFee: 32,
    workerPayoutAmount: 395,
    paymentStatus: "PAYMENT_COMPLETED",
    payoutStatus: "PAYOUT_COMPLETED",
    paymentMethod: "MOCK_UPI",
    transactionRef: "TXN_UPI_9928172901",
    invoiceNumber: "INV-20260824-8812",
    ratingId: "rat_101",
    createdAt: "2026-08-24T09:15:00Z",
    updatedAt: "2026-08-24T11:45:00Z",
  },
  {
    id: "bk_seed_102",
    bookingNumber: "SHY-260824-102",
    customerId: "cust_demo_2",
    customerName: "Priya Nair",
    customerPhone: "+91 98765 43211",
    customerAddress: "Flat 12A, Amrapali Platinum, Sector 119, Noida",
    customerLat: 28.585,
    customerLng: 77.391,
    serviceId: "srv_elec_switchboard",
    serviceName: "Switchboard & Socket Installation",
    categoryName: "Electrical Services",
    workerId: "worker_demo_2",
    workerName: "Rajesh Kumar Sharma",
    workerPhone: "+91 98111 22335",
    cooperativeName: "Noida Shramik Utthan Labour Cooperative Society Ltd.",
    status: "ACCEPTED",
    urgency: "NORMAL",
    scheduledDate: "2026-08-24",
    scheduledTime: "02:00 PM",
    description: "Install 2 new modular switchboards with surge protection in master bedroom.",
    totalAmount: 249,
    platformFee: 12,
    cooperativeFee: 17,
    workerPayoutAmount: 220,
    paymentStatus: "PAYMENT_PENDING",
    payoutStatus: "PAYOUT_PENDING",
    createdAt: "2026-08-24T08:00:00Z",
    updatedAt: "2026-08-24T08:45:00Z",
  },
  {
    id: "bk_seed_103",
    bookingNumber: "SHY-260824-103",
    customerId: "cust_demo_3",
    customerName: "Vikram Malhotra",
    customerPhone: "+91 98765 43212",
    customerAddress: "House 45, Pocket 2, Mayur Vihar Phase 1, New Delhi",
    customerLat: 28.608,
    customerLng: 77.294,
    serviceId: "srv_clean_deep",
    serviceName: "Full Home Deep Sanitization",
    categoryName: "Deep Cleaning & Sanitation",
    status: "REQUESTED",
    urgency: "NORMAL",
    scheduledDate: "2026-08-25",
    scheduledTime: "09:00 AM",
    description: "Post-renovation full 3BHK deep cleaning, floor buffing and window glass scrubbing.",
    totalAmount: 1499,
    platformFee: 75,
    cooperativeFee: 105,
    workerPayoutAmount: 1319,
    paymentStatus: "PAYMENT_PENDING",
    payoutStatus: "PAYOUT_PENDING",
    createdAt: "2026-08-24T11:00:00Z",
    updatedAt: "2026-08-24T11:00:00Z",
  },
];

export const INITIAL_RATINGS: Rating[] = [
  {
    id: "rat_101",
    bookingId: "bk_seed_101",
    customerId: "cust_demo_1",
    customerName: "Aarav Sharma",
    workerId: "worker_demo_1",
    rating: 5,
    skillRating: 5,
    punctualityRating: 5,
    politenessRating: 5,
    feedback: "Ramesh arrived within 25 minutes of the emergency booking! Extremely polite, showed his cooperative ID card, fixed the burst pipe quickly with proper brass parts. Incredible cooperative initiative!",
    createdAt: "2026-08-24T11:46:00Z",
  },
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: "disp_seed_1",
    bookingId: "bk_seed_101",
    bookingNumber: "SHY-260824-101",
    raisedBy: "cust_demo_1",
    raisedByName: "Aarav Sharma",
    raisedByRole: "CUSTOMER",
    reason: "Query regarding spare part pricing difference",
    description: "Service was great, but requesting clarification on the brass coupling receipt itemization.",
    status: "RESOLVED",
    resolutionAction: "REFUND_PARTIAL",
    adminNotes: "Reviewed receipt; society approved INR 50 goodwill concession. Member satisfied.",
    resolvedBy: "Sunita Deshmukh",
    resolvedAt: "2026-08-24T12:00:00Z",
    createdAt: "2026-08-24T11:50:00Z",
  },
];

export const INITIAL_DEMAND_INSIGHTS: DemandInsight[] = [
  {
    id: "ins_1",
    serviceCategory: "Plumbing Services",
    title: "Plumbing Surge in Sector 62 & 119",
    titleHi: "सेक्टर ६२ एवं ११९ में प्लंबिंग मांग में वृद्धि",
    description: "Plumbing service requests increased by 28% this week due to regional water supply pressure fluctuations.",
    descriptionHi: "पानी के दबाव में उतार-चढ़ाव के कारण इस सप्ताह प्लंबिंग अनुरोधों में २८% की वृद्धि दर्ज की गई।",
    trendPercentage: 28,
    trendType: "INCREASE",
    severity: "WARNING",
    suggestedAction: "Alert 4 standby verified plumbers from Noida Shramik Utthan Society.",
    suggestedActionHi: "नोएडा श्रमिक उत्थान समिति से ४ स्टैंडबाय सत्यापित प्लंबरों को सक्रिय करें।",
    affectedArea: "Sector 62, 119, Indirapuram",
  },
  {
    id: "ins_2",
    serviceCategory: "Electrical Services",
    title: "Peak Evening Electrical Demand",
    titleHi: "शाम ५ बजे से ८ बजे तक विद्युत मांग चरम पर",
    description: "65% of switchboard and power failure calls occur between 5:00 PM and 8:30 PM.",
    descriptionHi: "६५% स्विचबोर्ड एवं बिजली संबंधी कॉल शाम ५:०० से ८:३० के बीच प्राप्त होते हैं।",
    trendPercentage: 35,
    trendType: "INCREASE",
    severity: "INFO",
    suggestedAction: "Encourage cooperative electricians to schedule evening availability slots.",
    suggestedActionHi: "सहकारी इलेक्ट्रीशियनों को शाम के समय उपलब्ध रहने के लिए प्रेरित करें।",
    affectedArea: "Noida & Ghaziabad Districts",
  },
  {
    id: "ins_3",
    serviceCategory: "Elderly & Patient Care",
    title: "Caregiver Shortage in South Delhi Zone",
    titleHi: "दक्षिण दिल्ली क्षेत्र में देखभालकर्ताओं की आवश्यकता",
    description: "High demand for 4-hour senior assistance; only 2 verified caregivers currently available.",
    descriptionHi: "बुजुर्ग सहायता की बढ़ती मांग; वर्तमान में केवल २ सत्यापित देखभालकर्ता उपलब्ध हैं।",
    trendPercentage: 42,
    trendType: "INCREASE",
    severity: "URGENT",
    suggestedAction: "Fast-track onboarding and HSSC certification checks for pending applicants.",
    suggestedActionHi: "प्रतीक्षारत आवेदकों के प्रमाणन की जांच तेज करें और तत्काल ऑनबोर्ड करें।",
    affectedArea: "Mayur Vihar, Siri Fort, South Delhi",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud_1",
    actorId: "admin_demo_1",
    actorName: "Sunita Deshmukh",
    actorRole: "SOCIETY_ADMIN",
    action: "VERIFY_WORKER_SKILL",
    entityType: "WORKER_PROFILE",
    entityId: "worker_demo_1",
    details: "Verified Ramesh Kumar Verma for Emergency Plumbing and NSDC Level 4 credentials.",
    createdAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "aud_2",
    actorId: "admin_demo_1",
    actorName: "Sunita Deshmukh",
    actorRole: "SOCIETY_ADMIN",
    action: "APPROVE_WORKER_VERIFICATION",
    entityType: "WORKER_PROFILE",
    entityId: "worker_demo_2",
    details: "Approved Rajesh Kumar Sharma as FULLY_APPROVED Cooperative Electrician.",
    createdAt: "2026-07-21T10:00:00Z",
  },
  {
    id: "aud_3",
    actorId: "admin_demo_1",
    actorName: "Sunita Deshmukh",
    actorRole: "SOCIETY_ADMIN",
    action: "RESOLVE_DISPUTE",
    entityType: "DISPUTE",
    entityId: "disp_seed_1",
    details: "Resolved spare part inquiry for booking SHY-260824-101 with partial INR 50 adjustment.",
    createdAt: "2026-08-24T12:00:00Z",
  },
];

// Supabase-backed profile helpers
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

const LOCAL_STORAGE_ACTIVE_KEY = "sahyog_active_profiles_v1";

type Mode = "customer" | "worker" | "cooperative" | "federation";

const roleForMode = (mode: Mode) => {
  switch (mode) {
    case "customer":
      return "CUSTOMER";
    case "worker":
      return "WORKER";
    case "cooperative":
      return "SOCIETY_ADMIN"; // cooperative/admin mode
    case "federation":
      return "FEDERATION_ADMIN";
  }
};

function loadActiveMap(): Record<string, string | null> {
  try {
    if (typeof window === "undefined" || !window.localStorage) return {};
    const raw = window.localStorage.getItem(LOCAL_STORAGE_ACTIVE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function saveActiveMap(map: Record<string, string | null>) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(LOCAL_STORAGE_ACTIVE_KEY, JSON.stringify(map));
  } catch (e) {
    // ignore
  }
}

export async function fetchProfilesByMode(mode: Mode): Promise<Profile[] | WorkerProfile[]> {
  const role = roleForMode(mode);
  if (isSupabaseConfigured && supabase) {
    try {
      if (role === "WORKER") {
        const { data, error } = await supabase
          .from("profiles")
          .select(`*, workers(*)`)
          .eq("role", role);
        if (error) {
          console.error("Error fetching worker profiles:", error);
          return [];
        }
        // Map Postgres rows to WorkerProfile[] shape expected by the app
        const mapped = (data || []).map((row: any) => ({
          id: row.id,
          profile: {
            id: row.id,
            email: row.email,
            fullName: row.full_name || row.fullName || "",
            phone: row.phone,
            role: row.role,
            address: row.address,
            city: row.city,
            state: row.state,
            postalCode: row.postal_code || row.postalCode,
            lat: row.location?.coordinates?.[1] ?? row.lat ?? 28.6,
            lng: row.location?.coordinates?.[0] ?? row.lng ?? 77.3,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          },
          cooperativeId: row.workers?.[0]?.cooperative_id ?? null,
          cooperativeName: row.workers?.[0]?.cooperative_name ?? "Unassigned Cooperative",
          federationName: row.workers?.[0]?.federation_name ?? "Unassigned Federation",
          verificationStatus: row.workers?.[0]?.verification_status ?? "UNVERIFIED",
          experienceYears: row.workers?.[0]?.experience_years ?? 0,
          serviceRadiusKm: Number(row.workers?.[0]?.service_radius_km ?? 10),
          isAvailable: !!row.workers?.[0]?.is_available,
          currentLat: row.workers?.[0]?.current_location?.coordinates?.[1] ?? 28.6,
          currentLng: row.workers?.[0]?.current_location?.coordinates?.[0] ?? 77.3,
          ratingAvg: Number(row.workers?.[0]?.rating_avg ?? 0),
          ratingCount: row.workers?.[0]?.rating_count ?? 0,
          completedServicesCount: row.workers?.[0]?.completed_services_count ?? 0,
          bio: row.workers?.[0]?.bio ?? "",
          skills: Array.isArray(row.workers?.[0]?.skills) ? row.workers[0].skills : [],
          certifications: Array.isArray(row.workers?.[0]?.certifications) ? row.workers[0].certifications : [],
          availability: Array.isArray(row.workers?.[0]?.availability) ? row.workers[0].availability : [],
          welfare: Array.isArray(row.workers?.[0]?.welfare) ? row.workers[0].welfare : [],
          activeBookingsCount: Number(row.workers?.[0]?.active_bookings_count ?? 0),
        }));
        return mapped;
      } else {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", role);
        if (error) {
          console.error("Error fetching profiles:", error);
          return [];
        }

        const rows = data || [];
        const normalize = (row: any) => {
          const id = row.id || row.profile_id || row.user_id;
          const email = row.email || row.email_address || "";
          const fullName = row.full_name ?? row.fullName ?? row.name ?? "";
          const phone = row.phone ?? row.mobile ?? "";
          const roleField = row.role ?? row.user_role ?? role;
          const address = row.address ?? "";
          const city = row.city ?? "";
          const state = row.state ?? "";
          const postalCode = row.postal_code ?? row.postalCode ?? "";

          // location can come as PostGIS geometry (GeoJSON-like) or separate lat/lng columns
          let lat: number | undefined = undefined;
          let lng: number | undefined = undefined;
          try {
            const loc = row.location ?? row.current_location ?? row.location_geojson;
            if (loc) {
              // GeoJSON Point uses coordinates: [lng, lat]
              const coords = loc.coordinates ?? loc?.coordinates?.[0] ? loc.coordinates : null;
              if (Array.isArray(coords) && coords.length >= 2 && typeof coords[0] === "number") {
                lng = coords[0];
                lat = coords[1];
              } else if (Array.isArray(loc) && loc.length >= 2 && typeof loc[0] === "number") {
                // sometimes loc itself is an array
                lng = loc[0];
                lat = loc[1];
              }
            }
          } catch (e) {
            // ignore parsing issues
          }

          // Fallback to explicit lat/lng columns
          if (lat === undefined && lng === undefined) {
            if (typeof row.lat === "number" || typeof row.lat === "string") {
              lat = Number(row.lat);
            }
            if (typeof row.lng === "number" || typeof row.lng === "string") {
              lng = Number(row.lng);
            }
          }

          const createdAt = row.created_at ?? row.createdAt ?? new Date().toISOString();
          const updatedAt = row.updated_at ?? row.updatedAt ?? new Date().toISOString();

          return {
            id,
            email,
            fullName,
            phone,
            role: roleField,
            address,
            city,
            state,
            postalCode,
            lat: lat ?? 0,
            lng: lng ?? 0,
            createdAt,
            updatedAt,
          };
        };

        return rows.map(normalize);
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  // Fallback to demo data when Supabase not configured
  switch (mode) {
    case "customer":
      return INITIAL_CUSTOMERS;
    case "worker":
      return INITIAL_WORKERS;
    case "cooperative":
      // demo doesn't have society admins; return empty
      return [];
    case "federation":
      return [];
  }
}

export async function createProfileForMode(mode: Mode, payload: Partial<Profile> & { password?: string }): Promise<Profile | WorkerProfile | null> {
  const role = roleForMode(mode);

  if (isSupabaseConfigured && supabase) {
    try {
      // Use a server-side endpoint (service role) to create profiles safely.
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, payload }),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error("Profile create API error:", json);
        // fall through to fallback behavior below
      } else {
        const created = json.profile ?? json;
        if (!created) {
          console.warn("Profile create API returned no profile, falling back to local.");
        } else {
          // If server returned a WorkerProfile-shaped object when creating worker, return it directly
          if (role === "WORKER") {
            // server returns { profile: WorkerProfile }
            return created;
          }
          // else created is a Profile-like object
          return created;
        }
      }
    } catch (err) {
      console.error("Error calling profile create API:", err);
      // continue to fallback local creation
    }
  }

  // Fallback: return a local demo-style object (not persisted)
  const id = `local_${Date.now()}`;
  if (role === "WORKER") {
    const w: WorkerProfile = {
      id,
      profile: {
        id,
        email: payload.email || `${id}@local`,
        fullName: payload.fullName || "Local Worker",
        phone: payload.phone || "",
        role: "WORKER",
        address: payload.address || "",
        city: payload.city || "",
        state: payload.state || "",
        postalCode: payload.postalCode || "",
        lat: 28.6,
        lng: 77.3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      cooperativeId: "",
      cooperativeName: "Unassigned Cooperative",
      federationName: "Unassigned Federation",
      verificationStatus: "UNVERIFIED",
      experienceYears: 0,
      serviceRadiusKm: 10,
      isAvailable: true,
      currentLat: 28.6,
      currentLng: 77.3,
      ratingAvg: 0,
      ratingCount: 0,
      completedServicesCount: 0,
      bio: "",
      skills: [],
      certifications: [],
      availability: [],
      welfare: [],
      activeBookingsCount: 0,
    };
    return w;
  }

  const p: Profile = {
    id,
    email: payload.email || `${id}@local`,
    fullName: payload.fullName || "Local User",
    phone: payload.phone || "",
    role,
    address: payload.address || "",
    city: payload.city || "",
    state: payload.state || "",
    postalCode: payload.postalCode || "",
    lat: 28.6,
    lng: 77.3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return p;
}

export function getActiveProfileId(mode: Mode): string | null {
  const map = loadActiveMap();
  return map[mode] ?? null;
}

export function setActiveProfileId(mode: Mode, profileId: string | null) {
  const map = loadActiveMap();
  map[mode] = profileId;
  saveActiveMap(map);
}

export async function getActiveProfile(mode: Mode): Promise<Profile | WorkerProfile | null> {
  const id = getActiveProfileId(mode);
  if (!id) return null;
  const profiles = await fetchProfilesByMode(mode);
  const list = profiles || [];
  // @ts-ignore
  return list.find((p: any) => p.id === id) ?? null;
}

export async function logoutCurrent() {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Logout failed:", e);
    }
  }
  // clear active map locally
  saveActiveMap({});
}

export async function changePassword(newPassword: string) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error("Password change error:", error);
        return { error };
      }
      return { data };
    } catch (e) {
      console.error(e);
      return { error: e };
    }
  }
  // fallback
  return { data: null };
}

export default {
  fetchProfilesByMode,
  createProfileForMode,
  getActiveProfileId,
  setActiveProfileId,
  getActiveProfile,
  logoutCurrent,
  changePassword,
};
