import React from "react";
import { Handshake, ShieldCheck, HeartHandshake, Scale, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">
          About Sahyog Cooperative Marketplace
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
          Connecting Cooperative Skills with Everyday Needs
        </h1>
        <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
          Sahyog is a democratic, cooperative-owned digital platform engineered to organize, mobilize, and dignify skilled workforce across India's Labour Cooperative Federations.
        </p>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#E5E5E5] p-6 space-y-3 bg-[#F8F8F8]">
          <div className="w-10 h-10 rounded-md bg-[#111111] text-white flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#111111]">Zero Exploitation</h3>
          <p className="text-xs text-[#525252] leading-relaxed">
            Unlike commercial gig platforms that deduct up to 30% commissions, Sahyog allocates 88% directly to the worker and 7% to the member welfare and accident fund.
          </p>
        </Card>

        <Card className="border-[#E5E5E5] p-6 space-y-3 bg-[#F8F8F8]">
          <div className="w-10 h-10 rounded-md bg-[#16A34A] text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#111111]">Guaranteed Verification</h3>
          <p className="text-xs text-[#525252] leading-relaxed">
            Every technician is vetted by registered Labour Cooperative Societies, with certifications audited against NSDC and ITI trade standards.
          </p>
        </Card>

        <Card className="border-[#E5E5E5] p-6 space-y-3 bg-[#F8F8F8]">
          <div className="w-10 h-10 rounded-md bg-[#111111] text-white flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#111111]">Social Security & Welfare</h3>
          <p className="text-xs text-[#525252] leading-relaxed">
            Cooperative earnings automatically enroll workers in group accident coverage (Pradhan Mantri Suraksha Bima) and cooperative healthcare programs.
          </p>
        </Card>
      </div>

      {/* Fee Breakdown Table */}
      <div className="p-6 bg-white rounded-lg border border-[#E5E5E5] space-y-4">
        <h2 className="text-lg font-bold text-[#111111]">Cooperative Economic Architecture</h2>
        <p className="text-xs text-[#525252]">
          Sahyog operates under cooperative transparency by-laws. The total customer payment is distributed as follows:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-[#F8F8F8] rounded-md border border-[#E5E5E5]">
            <p className="text-2xl font-bold text-[#111111]">88%</p>
            <p className="font-semibold text-xs text-[#111111] mt-1">Direct Worker Compensation</p>
            <p className="text-[11px] text-[#737373] mt-0.5">Paid straight to worker bank account or cooperative ledger.</p>
          </div>
          <div className="p-4 bg-[#F8F8F8] rounded-md border border-[#E5E5E5]">
            <p className="text-2xl font-bold text-[#16A34A]">7%</p>
            <p className="font-semibold text-xs text-[#111111] mt-1">Cooperative Welfare Fund</p>
            <p className="text-[11px] text-[#737373] mt-0.5">Funds group insurance, maternity support, and skill tool grants.</p>
          </div>
          <div className="p-4 bg-[#F8F8F8] rounded-md border border-[#E5E5E5]">
            <p className="text-2xl font-bold text-[#525252]">5%</p>
            <p className="font-semibold text-xs text-[#111111] mt-1">Digital Infrastructure</p>
            <p className="text-[11px] text-[#737373] mt-0.5">Server maintenance, PostGIS mapping and SMS/app notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}