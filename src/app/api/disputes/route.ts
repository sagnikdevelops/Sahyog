import { NextResponse } from "next/server";
import { INITIAL_DISPUTES } from "@/lib/store/demoStore";

export async function GET() {
  return NextResponse.json({ success: true, disputes: INITIAL_DISPUTES });
}