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
  Sparkles,
  Award,
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
    <div className="space-y-16 pb-16 bg-[#F9FAF7]">
      {/* 1. Hero Section with AI-Generated Cooperative Background Banner */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-[#142D52] py-20 sm:py-28 text-white">
        {/* Background Image with Enhanced Visibility */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 scale-100 transform duration-700"
          style={{
            backgroundImage: "url('/images/hero-cooperative-workers.jpg')",
          }}
        />
        {/* Semi-transparent dark overlay for text contrast and rich emerald accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#142D52]/80 via-[#142D52]/65 to-[#142D52]/95" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#142D52]/30 to-[#142D52]/80" />

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#34D399]/40 text-xs font-semibold text-[#34D399] shadow-lg animate-in fade-in duration-300">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            <span>{t("hero.badge")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-md">
            Work that Works for Everyone
          </h1>

          <p className="text-sm sm:text-base text-[#F9FAF7]/90 max-w-3xl mx-auto leading-relaxed font-normal">Skill. Trust. Together.</p>

          {/* Search Bar & Quick Emergency Trigger */}
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#047857]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                className="pl-10 h-12 bg-white text-xs text-[#142D52] placeholder:text-[#6B7280] shadow-xl border-[#E5E7EB] focus:ring-2 focus:ring-[#34D399]"
              />
            </div>
            <Link href="/customer/book">
              <Button className="h-12 px-7 bg-[#047857] text-white hover:bg-[#065F46] text-xs font-bold w-full sm:w-auto shadow-xl hover:scale-105 active:scale-95 transition-all">
                {t("hero.findWorkers")}
              </Button>
            </Link>
          </div>

          {/* Live Ticker Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-white/10 text-xs">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:border-[#34D399]/40 transition-all hover:-translate-y-1">
              <p className="text-xl font-extrabold text-[#34D399]">1,500+</p>
              <p className="text-white/80 text-[11px] mt-0.5">Verified Cooperative Tradespeople</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:border-[#34D399]/40 transition-all hover:-translate-y-1">
              <p className="text-xl font-extrabold text-[#34D399]">48+</p>
              <p className="text-white/80 text-[11px] mt-0.5">Registered Labour Societies</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:border-[#34D399]/40 transition-all hover:-translate-y-1">
              <p className="text-xl font-extrabold text-[#34D399]">12,000+</p>
              <p className="text-white/80 text-[11px] mt-0.5">Services Delivered</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:border-[#34D399]/40 transition-all hover:-translate-y-1">
              <p className="text-xl font-extrabold text-[#34D399]">88% Share</p>
              <p className="text-white/80 text-[11px] mt-0.5">Direct to Worker (No Middlemen)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Emergency Quick Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-[#DC2626]/5 border border-[#DC2626]/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-md">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#142D52]">Urgent Emergency Service Dispatch</h3>
                <span className="text-[10px] bg-[#DC2626] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  30 Min Target
                </span>
              </div>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Immediate electrical breakdown, burst waterline, blocked sewer or urgent senior care assistance.
              </p>
            </div>
          </div>

          <Link href="/customer/book?urgency=EMERGENCY">
            <Button variant="emergency" className="text-xs font-bold shrink-0 shadow-md hover:scale-105 active:scale-95 transition-all">
              <Flame className="w-4 h-4 mr-1.5 fill-white" />
              Request Emergency Help
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. Service Categories Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-[#047857] tracking-wider">Cooperative Service Catalog</span>
            <h2 className="text-2xl font-bold text-[#142D52] mt-1">Verified Trade Disciplines</h2>
          </div>
          <Link href="/services" className="text-xs font-semibold text-[#047857] hover:underline flex items-center gap-1">
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
      <section className="bg-white border-y border-[#E5E7EB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase text-[#047857] tracking-wider">
              The Cooperative Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142D52]">
              Simple for Customers. Dignified for Workers. Scalable for Federations.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 bg-[#F9FAF7] rounded-xl border border-[#E5E7EB] space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#142D52] text-[#34D399] flex items-center justify-center shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#142D52]">{t("pillars.customer.title")}</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {t("pillars.customer.desc")}
              </p>
              <ul className="text-xs text-[#6B7280] space-y-2 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" /> Transparent government-approved trade rates
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" /> Verified cooperative ID and trade badge
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" /> PostGIS algorithm matching nearby workers
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-[#F9FAF7] rounded-xl border border-[#E5E7EB] space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#047857] text-white flex items-center justify-center shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#142D52]">{t("pillars.worker.title")}</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {t("pillars.worker.desc")}
              </p>
              <ul className="text-xs text-[#6B7280] space-y-2 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" /> 88% direct payout to worker bank accounts
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" /> Covered by Group Insurance &amp; Welfare Fund
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" /> Verifiable digital skills ledger and history
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-[#F9FAF7] rounded-xl border border-[#E5E7EB] space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-[#142D52] text-[#34D399] flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#142D52]">{t("pillars.coop.title")}</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {t("pillars.coop.desc")}
              </p>
              <ul className="text-xs text-[#6B7280] space-y-2 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" /> Unified management &amp; dispute arbitration
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" /> Live GIS operations and spatial dispatch radar
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" /> Predictive heuristics tracking regional demand surges
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works: 4 Simple Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase text-[#047857] tracking-wider">Simple Workflow</span>
          <h2 className="text-2xl font-bold text-[#142D52]">How Sahyog Works For You</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Discover Service",
              desc: "Choose from certified trade categories and specify visit time or 30-min emergency dispatch.",
            },
            {
              step: "02",
              title: "PostGIS Geo-Matching",
              desc: "System algorithmically ranks certified nearby cooperative workers by skill, proximity, and rating.",
            },
            {
              step: "03",
              title: "Verified Service Delivery",
              desc: "Track technician travel, start of service, and completed work with photos and transparent notes.",
            },
            {
              step: "04",
              title: "Direct Digital Settlement",
              desc: "Zero commission extraction. Settle digitally after inspection and rate your cooperative professional.",
            },
          ].map((item) => (
            <div key={item.step} className="p-6 bg-white rounded-xl border border-[#E5E7EB] space-y-2.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <span className="text-3xl font-black text-[#34D399] block">{item.step}</span>
              <h3 className="font-bold text-sm text-[#142D52]">{item.title}</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}