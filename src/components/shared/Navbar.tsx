"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { DemoRoleSwitcher } from "./DemoRoleSwitcher";
import { NotificationCenter } from "./NotificationCenter";
import { Button } from "@/components/ui/button";
import {
  Handshake,
  Flame,
  User,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export function Navbar() {
  const { currentRole, currentUser } = useAppState();
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/cooperatives", label: t("nav.cooperatives") },
    { href: "/about", label: t("nav.about") },
    { href: "/customer", label: t("nav.customerPortal") },
    { href: "/worker", label: t("nav.workerPortal") },
    { href: "/admin", label: t("nav.adminPortal") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#111111] flex items-center justify-center text-white shadow-sm group-hover:bg-[#262626] transition-colors">
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#111111]">
                  Sahyog
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#F3F3F3] text-[#525252] px-1.5 py-0.5 rounded border border-[#E5E5E5]">
                  Cooperative
                </span>
              </div>
              <span className="text-[10px] text-[#737373] hidden sm:inline-block">
                Connecting Cooperative Skills with Everyday Needs
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 4).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-[#F3F3F3] text-[#111111] font-semibold"
                      : "text-[#525252] hover:text-[#111111] hover:bg-[#F8F8F8]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Quick Action */}
          <Link href="/customer/book?urgency=EMERGENCY">
            <Button
              variant="emergency"
              size="sm"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-white" />
              {t("nav.emergencyService")}
            </Button>
          </Link>

          {/* Demo Role Switcher */}
          <DemoRoleSwitcher />

          {/* Notification Center */}
          <NotificationCenter />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Portal Switcher Button */}
          <Link
            href={
              currentRole === "WORKER"
                ? "/worker"
                : currentRole === "SOCIETY_ADMIN" || currentRole === "FEDERATION_ADMIN"
                ? "/admin"
                : "/customer"
            }
          >
            <Button variant="default" size="sm" className="text-xs">
              {currentRole === "WORKER"
                ? "Worker App"
                : currentRole === "SOCIETY_ADMIN" || currentRole === "FEDERATION_ADMIN"
                ? "Admin App"
                : "Book Service"}
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-[#525252] hover:text-[#111111]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#111111]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E5E5E5] bg-white p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium rounded-md bg-[#F8F8F8] text-[#171717] hover:bg-[#F3F3F3]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/customer/book?urgency=EMERGENCY"
            onClick={() => setMobileMenuOpen(false)}
            className="block"
          >
            <Button variant="emergency" className="w-full text-xs">
              <Flame className="w-3.5 h-3.5 fill-white mr-1" />
              Book Emergency Service Now
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}