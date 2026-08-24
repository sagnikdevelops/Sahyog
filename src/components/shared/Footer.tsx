import React from "react";
import Link from "next/link";
import { Handshake, ShieldCheck, HeartHandshake, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E5E5] bg-[#F8F8F8] text-[#525252] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#111111] flex items-center justify-center text-white">
                <Handshake className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-[#111111]">Sahyog</span>
            </div>
            <p className="text-xs text-[#737373] leading-relaxed">
              Connecting Cooperative Skills with Everyday Needs. A cooperative-owned digital service marketplace empowering skilled labour societies.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#16A34A] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Cooperative Verified Workforce</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-[#111111] mb-3">Service Sectors</h4>
            <ul className="space-y-2 text-[#737373]">
              <li><Link href="/services#electrical" className="hover:text-[#111111]">Electrical Services</Link></li>
              <li><Link href="/services#plumbing" className="hover:text-[#111111]">Plumbing & Drainage</Link></li>
              <li><Link href="/services#carpentry" className="hover:text-[#111111]">Carpentry & Furniture</Link></li>
              <li><Link href="/services#cleaning" className="hover:text-[#111111]">Deep Cleaning & Sanitization</Link></li>
              <li><Link href="/services#caregiving" className="hover:text-[#111111]">Elderly & Patient Care</Link></li>
            </ul>
          </div>

          {/* Col 3: Cooperative Ecosystem */}
          <div>
            <h4 className="font-bold text-[#111111] mb-3">Cooperative Ecosystem</h4>
            <ul className="space-y-2 text-[#737373]">
              <li><Link href="/cooperatives" className="hover:text-[#111111]">Labour Cooperative Federations</Link></li>
              <li><Link href="/cooperatives" className="hover:text-[#111111]">Member Societies Directory</Link></li>
              <li><Link href="/worker" className="hover:text-[#111111]">Worker Welfare & Insurance</Link></li>
              <li><Link href="/admin" className="hover:text-[#111111]">Cooperative Admin Portal</Link></li>
              <li><Link href="/about" className="hover:text-[#111111]">Fair Wage Standards</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div>
            <h4 className="font-bold text-[#111111] mb-3">Help & Regional Desks</h4>
            <div className="space-y-2 text-[#737373]">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#111111]" />
                NCR Federation Bhawan, Sector 62, Noida
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#111111]" />
                +91 11 2649 8871 (Toll-free Support)
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#111111]" />
                support@sahyogcoop.in
              </p>
              <div className="pt-2">
                <span className="inline-block bg-[#111111] text-white px-2 py-1 rounded text-[10px] font-medium">
                  Zero Commission Extraction • 88% Direct Worker Share
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5E5E5] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[#A3A3A3] text-[11px]">
          <p>© 2026 Sahyog Cooperative Digital Marketplace. Built for National Labour Cooperative Federation.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cooperative By-Laws</span>
          </div>
        </div>
      </div>
    </footer>
  );
}