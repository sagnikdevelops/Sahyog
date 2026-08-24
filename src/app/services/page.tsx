"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SERVICE_CATEGORIES, SERVICES } from "@/constants";
import { useI18n } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Flame, Clock, ShieldCheck, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  const { language } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const filteredServices = SERVICES.filter((s) => {
    const matchesCategory = activeCategory === "ALL" || s.categoryId === activeCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nameHi.includes(search) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-[#E5E5E5] pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs">Sahyog Marketplace</Badge>
          <span className="text-xs text-[#737373]">10 Cooperative Service Trades</span>
        </div>
        <h1 className="text-3xl font-bold text-[#111111]">Certified Cooperative Services</h1>
        <p className="text-xs sm:text-sm text-[#525252] max-w-2xl">
          All services are delivered exclusively by trained, insured, and verified members of registered Labour Cooperative Federations and Societies.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeCategory === "ALL"
                ? "bg-[#111111] text-white border-[#111111]"
                : "bg-white text-[#525252] border-[#E5E5E5] hover:bg-[#F8F8F8]"
            }`}
          >
            All Trades ({SERVICES.length})
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeCategory === cat.id
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-[#525252] border-[#E5E5E5] hover:bg-[#F8F8F8]"
              }`}
            >
              {language === "hi" ? cat.nameHi : cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#737373]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <Card key={srv.id} className="border-[#E5E5E5] flex flex-col justify-between hover:border-[#111111] transition-all">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#737373] bg-[#F8F8F8] px-2 py-0.5 rounded border border-[#E5E5E5]">
                  {srv.categoryName}
                </span>
                {srv.isEmergencyEligible && (
                  <Badge variant="destructive" className="gap-1 text-[10px]">
                    <Flame className="w-3 h-3 fill-white" /> Emergency Ready
                  </Badge>
                )}
              </div>
              <CardTitle className="text-sm font-bold text-[#111111] mt-2">
                {language === "hi" ? srv.nameHi : srv.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3 text-xs flex-1">
              <p className="text-[#525252] leading-relaxed">
                {language === "hi" ? srv.descriptionHi : srv.description}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-[#737373] pt-2 border-t border-[#E5E5E5]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#111111]" /> ~{srv.estimatedDurationMins} mins
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#16A34A]" /> Cooperative Assured
                </span>
              </div>
            </CardContent>

            <CardFooter className="p-4 bg-[#F8F8F8] border-t border-[#E5E5E5] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#737373] uppercase block">Base Price</span>
                <span className="text-base font-bold text-[#111111]">{formatCurrency(srv.basePrice)}</span>
              </div>
              <Link href={`/customer/book?service=${srv.id}&category=${srv.categoryId}`}>
                <Button size="sm" className="text-xs bg-[#111111] text-white hover:bg-[#262626] gap-1">
                  Book Now <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}