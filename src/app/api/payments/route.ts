import { NextResponse } from "next/server";
import { processSimulatedPayment } from "@/lib/payments/mockPaymentEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = processSimulatedPayment(body);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Payment simulation failed" }, { status: 400 });
  }
}