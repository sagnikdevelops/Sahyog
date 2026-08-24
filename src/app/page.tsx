"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { SERVICE_CATEGORIES, SERVICES } from "@/constants";
import { ServiceCard } from "@/components/customer/ServiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Handshake,
  ShieldCheck,
  Flame,
  Search,
  Users,
  Building2,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = SERVICE_CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameHi.includes(searchQuery) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative border-b border-[#E5E5E5] bg-[#F8F8F8] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-xs font-semibold text-[#111111] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>{t("hero.badge")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] max-w-3xl mx-auto leading-tight">
            {t("hero.title")}
          </h1>

          <p className="text-sm sm:text-base text-[#525252] max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Search Bar & Quick Emergency Trigger */}
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#737373]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                className="pl-10 h-11 bg-white text-xs shadow-sm border-[#D4D4D4]"
              />
            </div>
            <Link href="/customer/book">
              <Button className="h-11 px-6 bg-[#111111] text-white hover:bg-[#262626] text-xs font-bold w-full sm:w-auto">
                {t("hero.findWorkers")}
              </Button>
            </Link>
          </div>

          {/* Live Ticker Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-[#E5E5E5]/80 text-xs">
            <div className="p-3 bg-white rounded-lg border border-[#E5E5E5]">
              <p className="text-lg font-extrabold text-[#111111]">1,500+</p>
              <p className="text-[#737373] text-[11px]">Verified Cooperative Workers</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E5E5E5]">
              <p className="text-lg font-extrabold text-[#111111]">48+</p>
              <p className="text-[#737373] text-[11px]">Registered Labour Societies</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E5E5E5]">
              <p className="text-lg font-extrabold text-[#111111]">12,000+</p>
              <p className="text-[#737373] text-[11px]">Services Delivered</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E5E5E5]">
              <p className="text-lg font-extrabold text-[#16A34A]">88% Share</p>
              <p className="text-[#737373] text-[11px]">Direct to Worker (No Middlemen)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Emergency Quick Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-xl bg-[#DC2626]/5 border border-[#DC2626]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#111111]">Urgent Emergency Service Dispatch</h3>
                <span className="text-[10px] bg-[#DC2626] text-white px-2 py-0.5 rounded font-bold uppercase">
                  30 Min Target
                </span>
              </div>
              <p className="text-xs text-[#525252] mt-0.5">
                Immediate electrical breakdown, burst waterline, blocked sewer or urgent senior care assistance.
              </p>
            </div>
          </div>

          <Link href="/customer/book?urgency=EMERGENCY">
            <Button variant="emergency" className="text-xs font-bold shrink-0">
              <Flame className="w-4 h-4 mr-1.5 fill-white" />
              Request Emergency Help
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. Service Categories Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E5E5] pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-[#737373] tracking-wider">Service Catalog</span>
            <h2 className="text-2xl font-bold text-[#111111] mt-1">Cooperative Skill Trades</h2>
          </div>
          <Link href="/services" className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
            Browse all services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => (
            <ServiceCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 4. Three Pillars: Why Sahyog */}
      <section className="bg-[#F8F8F8] border-y border-[#E5E5E5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase text-[#737373] tracking-wider">
              Cooperative Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
              Simple for Customers. Simpler for Workers. Powerful for Cooperatives.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 bg-white rounded-lg border border-[#E5E5E5] space-y-3">
              <div className="w-10 h-10 rounded-md bg-[#111111] text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">{t("pillars.customer.title")}</h3>
              <p className="text-xs text-[#525252] leading-relaxed">
                {t("pillars.customer.desc")}
              </p>
              <ul className="text-xs text-[#737373] space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Transparent standard pricing
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Verified cooperative membership
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> PostGIS nearby technician matching
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-white rounded-lg border border-[#E5E5E5] space-y-3">
              <div className="w-10 h-10 rounded-md bg-[#16A34A] text-white flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">{t("pillars.worker.title")}</h3>
              <p className="text-xs text-[#525252] leading-relaxed">
                {t("pillars.worker.desc")}
              </p>
              <ul className="text-xs text-[#737373] space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> 88% direct payout to worker
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Pradhan Mantri Bima & health fund
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Digital verifiable work history
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-white rounded-lg border border-[#E5E5E5] space-y-3">
              <div className="w-10 h-10 rounded-md bg-[#111111] text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">{t("pillars.coop.title")}</h3>
              <p className="text-xs text-[#525252] leading-relaxed">
                {t("pillars.coop.desc")}
              </p>
              <ul className="text-xs text-[#737373] space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Centralized administrative control
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> GIS workforce live operations map
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> AI-ready demand surge insights
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works: 4 Simple Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase text-[#737373] tracking-wider">Simple Workflow</span>
          <h2 className="text-2xl font-bold text-[#111111]">How Sahyog Connects You</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Discover Service",
              desc: "Choose from 10 certified trades and specify scheduled or emergency visit.",
            },
            {
              step: "02",
              title: "PostGIS Matching",
              desc: "System algorithmically ranks verified nearby cooperative workers (40% skill + 30% proximity).",
            },
            {
              step: "03",
              title: "Service Delivery",
              desc: "Track worker travel, start of service, and completed work with notes & photos.",
            },
            {
              step: "04",
              title: "Pay & Rate",
              desc: "Zero commission extraction. Settle digitally and rate your cooperative professional.",
            },
          ].map((item) => (
            <div key={item.step} className="p-5 bg-white rounded-lg border border-[#E5E5E5] space-y-2">
              <span className="text-2xl font-black text-[#D4D4D4]">{item.step}</span>
              <h3 className="font-bold text-sm text-[#111111]">{item.title}</h3>
              <p className="text-xs text-[#525252] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}