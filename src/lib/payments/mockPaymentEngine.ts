// Sahyog - Payment & Invoicing Engine
import { Payment, PaymentMethod, PaymentStatus, Payout, PayoutStatus } from "@/types";
import { COMMISSION_RATES } from "@/constants";
import { generateInvoiceNumber, generateTransactionRef } from "@/lib/utils";

export interface ProcessPaymentParams {
  bookingId: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  cooperativeId: string;
  cooperativeName: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
}

export function processSimulatedPayment(params: ProcessPaymentParams): {
  payment: Payment;
  payout: Payout;
} {
  const {
    bookingId,
    bookingNumber,
    customerId,
    customerName,
    workerId,
    workerName,
    cooperativeId,
    cooperativeName,
    totalAmount,
    paymentMethod,
  } = params;

  // Split calculations
  const platformFee = Math.round((totalAmount * COMMISSION_RATES.platformFeePercent) / 100);
  const cooperativeFee = Math.round((totalAmount * COMMISSION_RATES.cooperativeFeePercent) / 100);
  const workerShare = totalAmount - platformFee - cooperativeFee;

  const transactionRef = generateTransactionRef();
  const invoiceNumber = generateInvoiceNumber();

  const payment: Payment = {
    id: `pay_${Date.now()}`,
    bookingId,
    bookingNumber,
    customerId,
    customerName,
    amount: totalAmount,
    platformFee,
    cooperativeFee,
    workerShare,
    paymentMethod,
    status: "PAYMENT_COMPLETED" as PaymentStatus,
    transactionRef,
    invoiceNumber,
    createdAt: new Date().toISOString(),
  };

  const payout: Payout = {
    id: `payout_${Date.now()}`,
    paymentId: payment.id,
    bookingId,
    workerId,
    workerName,
    cooperativeId,
    cooperativeName,
    amount: workerShare,
    status: "PAYOUT_COMPLETED" as PayoutStatus,
    transactionRef: `PO_${transactionRef}`,
    processedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  return { payment, payout };
}