import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Scale, Award, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service | Sahyog Cooperative Digital Marketplace",
  description: "Terms of service, fair wage standards, and cooperative marketplace guidelines.",
};

export default function TermsOfServicePage() {
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
              <span>Fair Wage & Cooperative Standards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#142D52]">Terms of Service</h1>
            <p className="text-sm text-[#6B7280]">
              By using Sahyog, you engage with cooperative societies committed to fair worker wages, verified quality standards, and transparent community governance.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#142D52] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#047857]" /> 1. Fair Pricing & Direct Worker Share
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Every booking made through Sahyog adheres to standardized transparent rates determined by regional labour societies. <strong>At least 88% of every service payment</strong> goes directly to the executing skilled worker, with 7% reserved for society emergency funds and 5% for platform maintenance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#142D52] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#047857]" /> 2. Verified Workforce Quality Guarantee
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              All assigned service professionals are verified members of registered labour cooperatives with background checks, trade skill validation, and peer society endorsements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#142D52] flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#047857]" /> 3. Fair Dispute Resolution
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              In the event of an incomplete or unsatisfactory service, customers and workers have access to democratic dispute mediation overseen by cooperative supervisors, guaranteeing prompt refunds, re-service, or fair settlement.
            </p>
          </section>

          <div className="pt-6 border-t border-[#E5E7EB] text-xs text-[#6B7280] flex justify-between items-center">
            <span>Sahyog Cooperative Federation Bylaws</span>
            <Link href="/privacy" className="text-[#047857] hover:underline font-medium">View Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
