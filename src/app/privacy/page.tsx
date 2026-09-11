import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | Sahyog Cooperative Digital Marketplace",
  description: "Privacy policy and data protection principles of Sahyog Labour Cooperative Federation.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F9FAF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs border-[#E5E7EB] text-[#142D52] hover:bg-white gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Button>
          </Link>
          <span className="text-xs text-[#6B7280]">Last Updated: September 2026</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 shadow-sm space-y-6">
          <div className="border-b border-[#E5E7EB] pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Cooperative Member Data Protection Charter</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#142D52]">Privacy Policy</h1>
            <p className="text-sm text-[#6B7280]">
              Sahyog is operated for and by verified labour cooperatives. Your privacy and personal data rights are foundational to our cooperative model.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#142D52] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#047857]" /> 1. Data We Collect
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              We collect information required strictly to facilitate legitimate service matching, worker safety, and fair dispute resolution:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-[#4B5563] pl-2">
              <li><strong>Customer Information:</strong> Name, phone number, address/geolocation for job dispatch, service requirements, and payment transaction metadata.</li>
              <li><strong>Worker Information:</strong> Name, contact details, cooperative society affiliation, verification documentation, trade skills, ratings, and attendance logs.</li>
              <li><strong>Transactional Data:</strong> Booking histories, dispute records, and digital payment confirmations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#142D52] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#047857]" /> 2. Zero Commercial Data Selling
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Unlike commercial gig platforms, Sahyog operates under cooperative bylaws. We <strong>never sell, lease, or monetize</strong> member or customer data with third-party advertisers or data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#142D52] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#047857]" /> 3. Data Retention & Your Rights
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              You have the right to inspect, correct, or request the deletion of your account profile at any time through your Profile settings or by contacting your regional cooperative federation desk at <span className="font-semibold text-[#142D52]">support@sahyogcoop.in</span>.
            </p>
          </section>

          <div className="pt-6 border-t border-[#E5E7EB] text-xs text-[#6B7280] flex justify-between items-center">
            <span>National Labour Cooperative Federation of India</span>
            <Link href="/terms" className="text-[#047857] hover:underline font-medium">View Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
