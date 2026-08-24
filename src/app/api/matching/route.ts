import { NextResponse } from "next/server";
import { INITIAL_WORKERS } from "@/lib/store/demoStore";
import { rankMatchingWorkers } from "@/lib/matching/deterministicScorer";

export async function POST(request: Request) {
  try {
    const criteria = await request.json();
    const ranked = rankMatchingWorkers(INITIAL_WORKERS, criteria);
    return NextResponse.json({ success: true, candidates: ranked });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Matching calculation failed" }, { status: 400 });
  }
}