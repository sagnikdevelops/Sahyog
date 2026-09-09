"use client";

import React from "react";
import Link from "next/link";
import { ServiceCategory } from "@/types";
import { useI18n } from "@/lib/i18n";
import {
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Sparkles,
  Home,
  HeartHandshake,
  Flower2,
  Car,
  Cpu,
  ArrowRight,
} from "lucide-react";

interface ServiceCardProps {
  category: ServiceCategory;
  isEmergency?: boolean;
}

export function ServiceCard({ category, isEmergency = false }: ServiceCardProps) {
  const { language } = useI18n();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap": return <Zap className="w-5 h-5" />;
      case "Wrench": return <Wrench className="w-5 h-5" />;
      case "Hammer": return <Hammer className="w-5 h-5" />;
      case "Paintbrush": return <Paintbrush className="w-5 h-5" />;
      case "Sparkles": return <Sparkles className="w-5 h-5" />;
      case "Home": return <Home className="w-5 h-5" />;
      case "HeartHandshake": return <HeartHandshake className="w-5 h-5" />;
      case "Flower2": return <Flower2 className="w-5 h-5" />;
      case "Car": return <Car className="w-5 h-5" />;
      case "Cpu": return <Cpu className="w-5 h-5" />;
      default: return <Wrench className="w-5 h-5" />;
    }
  };

  const title = language === "hi" ? category.nameHi : category.name;
  const desc = language === "hi" ? category.descriptionHi : category.description;

  return (
    <Link
      href={`/customer/book?category=${category.id}${isEmergency ? "&urgency=EMERGENCY" : ""}`}
      className="group block p-5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#047857] hover:shadow-md transition-all relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-md bg-[#047857]/10 text-[#047857] flex items-center justify-center group-hover:bg-[#047857] group-hover:text-white transition-colors">
          {getIcon(category.iconName)}
        </div>
        <span className="text-[11px] font-medium text-[#4B5563] bg-[#F9FAF7] px-2 py-0.5 rounded border border-[#E5E7EB]">
          {category.servicesCount} Services
        </span>
      </div>

      <h3 className="text-sm font-bold text-[#142D52] mt-3 group-hover:text-[#047857] transition-colors">
        {title}
      </h3>
      <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
        {desc}
      </p>

      <div className="mt-4 flex items-center text-xs font-semibold text-[#142D52] group-hover:text-[#047857] group-hover:translate-x-0.5 transition-all">
        <span>Book Verified Provider</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </div>
    </Link>
  );
}