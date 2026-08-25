import { NextResponse } from "next/server";
import { INITIAL_WORKERS } from "@/lib/store/demoStore";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  return NextResponse.json({ success: true, workers: INITIAL_WORKERS });
}

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Server missing Supabase configuration" }, { status: 500 });
    }

    const body = await req.json();
    const { mode, payload } = body || {};
    const role = (() => {
      switch (mode) {
        case "customer":
          return "CUSTOMER";
        case "worker":
          return "WORKER";
        case "cooperative":
          return "SOCIETY_ADMIN";
        case "federation":
          return "FEDERATION_ADMIN";
        default:
          return "CUSTOMER";
      }
    })();

    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Missing payload or email" }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const insertProfile = {
      email: payload.email,
      full_name: payload.fullName || payload.full_name || payload.email?.split("@")?.[0] || "",
      phone: payload.phone || null,
      role,
      address: payload.address || null,
      city: payload.city || null,
      state: payload.state || null,
      postal_code: payload.postalCode || null,
    };

    const { data: profData, error: profError } = await supabaseAdmin
      .from("profiles")
      .insert(insertProfile)
      .select()
      .single();

    if (profError) {
      return NextResponse.json({ error: profError }, { status: 400 });
    }

    if (role === "WORKER") {
      // create minimal workers row
      const { error: wError } = await supabaseAdmin.from("workers").insert({ id: profData.id }).select();
      if (wError) {
        // not fatal; return profile but include worker insert warning
        return NextResponse.json({ profile: profData, warning: wError }, { status: 200 });
      }
      // build a WorkerProfile-shaped response
      const workerProfile = {
        id: profData.id,
        profile: {
          id: profData.id,
          email: profData.email,
          fullName: profData.full_name || "Worker",
          phone: profData.phone || "",
          role: profData.role,
          address: profData.address || "",
          city: profData.city || "",
          state: profData.state || "",
          postalCode: profData.postal_code || "",
          lat: 28.6,
          lng: 77.3,
          createdAt: profData.created_at,
          updatedAt: profData.updated_at,
        },
        cooperativeId: null,
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

      return NextResponse.json({ profile: workerProfile }, { status: 200 });
    }

    // return Profile shape
    const profile = {
      id: profData.id,
      email: profData.email,
      fullName: profData.full_name,
      phone: profData.phone,
      role: profData.role,
      address: profData.address,
      city: profData.city,
      state: profData.state,
      postalCode: profData.postal_code,
      lat: undefined,
      lng: undefined,
      createdAt: profData.created_at,
      updatedAt: profData.updated_at,
    };

    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    console.error("Server error creating profile:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
