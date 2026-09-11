"use client";
import React from "react";
import Link from "next/link";
import { SahyogLogo } from "./Logo";
import { ShieldCheck, HeartHandshake, MapPin, Phone, Mail } from "lucide-react";

import { useAppState } from "@/lib/store/stateContext";

export function Footer() {
  const { currentUser, currentRole } = useAppState();
  const isSuperOrFederationAdmin =
    currentRole === "SUPER_ADMIN" ||
    currentRole === "FEDERATION_ADMIN" ||
    currentUser?.role === "SUPER_ADMIN" ||
    currentUser?.role === "FEDERATION_ADMIN";

  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F9FAF7] text-[#4B5563] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <SahyogLogo size="md" showText={true} />
              <span className="text-base font-bold text-[#142D52]">Sahyog</span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Connecting Cooperative Skills with Everyday Needs. A cooperative-owned digital service marketplace empowering skilled labour societies.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#047857] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
              <span>100% Cooperative Verified Workforce</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-[#142D52] mb-3">Service Sectors</h4>
            <ul className="space-y-2 text-[#4B5563]">
              <li><Link href="/services#electrical" className="hover:text-[#047857] transition-colors">Electrical Services</Link></li>
              <li><Link href="/services#plumbing" className="hover:text-[#047857] transition-colors">Plumbing & Drainage</Link></li>
              <li><Link href="/services#carpentry" className="hover:text-[#047857] transition-colors">Carpentry & Furniture</Link></li>
              <li><Link href="/services#cleaning" className="hover:text-[#047857] transition-colors">Deep Cleaning & Sanitization</Link></li>
              <li><Link href="/services#caregiving" className="hover:text-[#047857] transition-colors">Elderly & Patient Care</Link></li>
            </ul>
          </div>

          {/* Col 3: Cooperative Ecosystem */}
          <div>
            <h4 className="font-bold text-[#142D52] mb-3">Cooperative Ecosystem</h4>
            <ul className="space-y-2 text-[#4B5563]">
              <li><Link href="/cooperatives" className="hover:text-[#047857] transition-colors">Labour Cooperative Federations</Link></li>
              {isSuperOrFederationAdmin ? (
                <>
                  <li><Link href="/cooperatives" className="hover:text-[#047857] transition-colors">Member Societies Directory</Link></li>
                  <li><Link href="/worker" className="hover:text-[#047857] transition-colors">Worker Welfare & Insurance</Link></li>
                  <li><Link href="/admin" className="hover:text-[#047857] transition-colors">Cooperative Admin Portal</Link></li>
                </>
              ) : null}
              <li><Link href="/about" className="hover:text-[#047857] transition-colors">Fair Wage Standards</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div>
            <h4 className="font-bold text-[#142D52] mb-3">Help & Regional Desks</h4>
            <div className="space-y-2 text-[#4B5563]">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#047857]" />
                NCR Federation Bhawan, Sector 62, Noida
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#047857]" />
                +91 11 2649 8871 (Toll-free Support)
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#047857]" />
                support@sahyogcoop.in
              </p>
              <div className="pt-2">
                <span className="inline-block bg-[#142D52] text-white px-2 py-1 rounded text-[10px] font-medium">
                  Zero Commission Extraction • 88% Direct Worker Share
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[#6B7280] text-[11px]">
          <p>© 2026 Sahyog Cooperative Digital Marketplace. Built for National Labour Cooperative Federation.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/privacy" className="hover:text-[#047857] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#047857] transition-colors">Terms of Service</Link>
            <Link href="/terms" className="hover:text-[#047857] transition-colors">Cooperative By-Laws</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}