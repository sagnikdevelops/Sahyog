import { NextResponse } from "next/server";
import { INITIAL_WORKERS } from "@/lib/store/demoStore";

export async function GET() {
  return NextResponse.json({ success: true, workers: INITIAL_WORKERS });
}