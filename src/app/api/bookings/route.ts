import { NextResponse } from "next/server";
import { INITIAL_BOOKINGS } from "@/lib/store/demoStore";

export async function GET() {
  return NextResponse.json({ success: true, bookings: INITIAL_BOOKINGS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Booking registered in Sahyog Cooperative engine",
      booking: {
        id: `bk_${Date.now()}`,
        ...body,
        status: "ASSIGNED",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid booking request" }, { status: 400 });
  }
}