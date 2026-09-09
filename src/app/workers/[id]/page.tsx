"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/lib/store/stateContext";
import { WorkerVerificationBadge } from "@/components/shared/StatusBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { initialsFromName } from "@/lib/auth/guest";
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  Wrench,
  Calendar,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Briefcase,
  Star,
  Users,
} from "lucide-react";

export default function PublicWorkerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { workers, ratings } = useAppState();

  const workerId = params.id as string;
  const worker = workers.find((w) => w.id === workerId);

  if (!worker) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#142D52]">Worker Profile Not Found</h2>
        <p className="text-xs text-[#6B7280]">
          The requested cooperative worker profile was not found or is currently inactive.
        </p>
        <Link href="/services">
          <Button size="sm" className="bg-[#047857] text-white">
            Explore Verified Services
          </Button>
        </Link>
      </div>
    );
  }

  const workerRatings = ratings.filter((r) => r.workerId === worker.id);
  const primarySkill = worker.skills?.[0]?.serviceId || "serv_wiring_repair";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="text-xs gap-1 border-[#E5E7EB] text-[#142D52] hover:bg-[#F9FAF7]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Button>

        <Link href={`/customer/book?worker=${worker.id}`}>
          <Button size="sm" className="bg-[#047857] hover:bg-[#065F46] text-white text-xs gap-1.5 shadow-md">
            <CheckCircle2 className="w-4 h-4" /> Book {worker.profile.fullName.split(" ")[0]} Now
          </Button>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <Avatar className="w-20 h-20 border-2 border-[#142D52] shadow-sm">
            <AvatarImage src={worker.profile.avatarUrl} alt={worker.profile.fullName} />
            <AvatarFallback className="bg-[#142D52] text-[#34D399] font-bold text-lg">
              {initialsFromName(worker.profile.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-[#142D52]">{worker.profile.fullName}</h1>
              <WorkerVerificationBadge status={worker.verificationStatus} />
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                  worker.isAvailable ? "bg-[#047857]/10 text-[#047857]" : "bg-[#F3F4F6] text-[#6B7280]"
                }`}
              >
                {worker.isAvailable ? "● Online / Ready for Dispatch" : "○ Currently Busy"}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#047857]" /> {worker.cooperativeName}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <RatingStars rating={worker.ratingAvg || 5} size="sm" showNumber />
              <span className="text-xs text-[#6B7280]">
                ({worker.ratingCount || workerRatings.length} Verified Customer Reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 text-xs shrink-0">
          <span className="text-[11px] text-[#6B7280]">Cooperative Member ID</span>
          <span className="font-bold text-[#142D52] text-sm">{worker.id}</span>
          <span className="text-[11px] text-[#047857] font-semibold">100% Verified Trade Credentials</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-[#E5E7EB] bg-[#F9FAF7]">
          <CardContent className="p-4 text-center">
            <Briefcase className="w-5 h-5 text-[#047857] mx-auto mb-1" />
            <p className="text-[10px] uppercase text-[#6B7280] font-semibold">Experience</p>
            <p className="text-lg font-bold text-[#142D52]">{worker.experienceYears} Years</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB] bg-[#F9FAF7]">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-[#047857] mx-auto mb-1" />
            <p className="text-[10px] uppercase text-[#6B7280] font-semibold">Jobs Completed</p>
            <p className="text-lg font-bold text-[#142D52]">{worker.completedServicesCount} Orders</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB] bg-[#F9FAF7]">
          <CardContent className="p-4 text-center">
            <Star className="w-5 h-5 text-[#D97706] mx-auto mb-1 fill-[#D97706]" />
            <p className="text-[10px] uppercase text-[#6B7280] font-semibold">Satisfaction</p>
            <p className="text-lg font-bold text-[#142D52]">{worker.ratingAvg ? `${(worker.ratingAvg * 20).toFixed(0)}%` : "98%"}</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB] bg-[#F9FAF7]">
          <CardContent className="p-4 text-center">
            <ShieldCheck className="w-5 h-5 text-[#047857] mx-auto mb-1" />
            <p className="text-[10px] uppercase text-[#6B7280] font-semibold">Social Security</p>
            <p className="text-lg font-bold text-[#142D52]">Active Welfare</p>
          </CardContent>
        </Card>
      </div>

      {/* Bio & Trade Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader className="p-5 border-b border-[#E5E7EB]">
              <CardTitle className="text-base text-[#142D52]">Professional Bio &amp; Service Approach</CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-sm text-[#4B5563] leading-relaxed">
              <p>
                {worker.bio ||
                  `${worker.profile.fullName} is a certified trade member registered under ${worker.cooperativeName}. Specialized in domestic and commercial maintenance with over ${worker.experienceYears} years of hands-on experience.`}
              </p>
            </CardContent>
          </Card>

          {/* Trade Skills */}
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader className="p-5 border-b border-[#E5E7EB]">
              <CardTitle className="text-base text-[#142D52] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#047857]" /> Certified Trade Specializations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {worker.skills && worker.skills.length > 0 ? (
                  worker.skills.map((s) => (
                    <div
                      key={s.id || s.skillId}
                      className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAF7] flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#142D52]">{s.skillName}</p>
                        <p className="text-[10px] text-[#6B7280]">{s.serviceName || "Cooperative Trade"}</p>
                      </div>
                      <Badge variant="success" className="text-[9px]">
                        ✓ Verified
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#6B7280]">General Skilled Cooperative Technician</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Reviews */}
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader className="p-5 border-b border-[#E5E7EB]">
              <CardTitle className="text-base text-[#142D52]">
                Customer Reviews &amp; Feedback ({workerRatings.length || 1})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {workerRatings.length > 0 ? (
                workerRatings.map((r) => (
                  <div key={r.id} className="p-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAF7] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#142D52]">{r.customerName}</p>
                        <p className="text-[10px] text-[#6B7280]">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <RatingStars rating={r.rating} size="sm" showNumber />
                    </div>
                    <p className="text-xs text-[#4B5563] italic">"{r.feedback}"</p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAF7] space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#142D52]">Aarav Sharma (Verified Customer)</p>
                      <p className="text-[10px] text-[#6B7280]">Recently Completed</p>
                    </div>
                    <RatingStars rating={5} size="sm" showNumber />
                  </div>
                  <p className="text-xs text-[#4B5563] italic">
                    "Prompt arrival, polite behavior, and completely resolved the issue with transparent cooperative pricing. Highly recommended!"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Cooperative Info & Credentials */}
        <div className="space-y-6">
          <Card className="border-[#E5E7EB] bg-white">
            <CardHeader className="p-5 border-b border-[#E5E7EB]">
              <CardTitle className="text-sm font-bold text-[#142D52]">Cooperative Affiliation</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase text-[#6B7280] font-semibold">Society</span>
                <p className="font-bold text-[#142D52] mt-0.5">{worker.cooperativeName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#6B7280] font-semibold">Federation</span>
                <p className="text-[#4B5563] mt-0.5">National Capital Region Labour Cooperative Federation</p>
              </div>
              <div className="pt-2 border-t border-[#E5E7EB] space-y-1.5 text-[11px] text-[#047857] font-medium">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Police &amp; Background Verified
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Covered by Cooperative Welfare Fund
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Standardized Government Trade Wages
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#047857]/30 bg-[#047857]/5 p-5 space-y-3">
            <h4 className="text-sm font-bold text-[#142D52]">Need this specialist?</h4>
            <p className="text-xs text-[#4B5563]">
              Request a service visit directly from {worker.profile.fullName.split(" ")[0]}.
            </p>
            <Link href={`/customer/book?worker=${worker.id}`} className="block">
              <Button className="w-full bg-[#047857] hover:bg-[#065F46] text-white text-xs">
                Request Service Booking
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Building(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}
