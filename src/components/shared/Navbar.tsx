"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationCenter } from "./NotificationCenter";
import { SahyogLogo } from "./Logo";
import ProfileMenu from "./ProfileMenu";
import { Button } from "@/components/ui/button";
import {
  Flame,
  User,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export function Navbar() {
  const { currentRole, isAuthenticated, isDemoMode } = useAppState();
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 transition-all duration-200 ${isScrolled ? "shadow-md bg-white/98" : "shadow-sm"}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-6 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-0">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Brand Logo & Tagline */}
          <Link href="/" className="group flex min-w-0 items-center gap-2.5">
            <SahyogLogo size="lg" showText={true} priority={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 4).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#047857]/10 text-[#047857] font-semibold"
                      : "text-[#4B5563] hover:text-[#142D52] hover:bg-[#F9FAF7]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:gap-3">
          {/* Emergency Quick Action */}
          <Link href="/customer/book?urgency=EMERGENCY" className="hidden sm:inline-flex">
            <Button
              variant="emergency"
              size="sm"
              className="items-center gap-1.5 text-[10px] shadow-sm sm:text-xs"
            >
              <Flame className="h-3.5 w-3.5 fill-white" />
              {t("nav.emergencyService")}
            </Button>
          </Link>

          {/* Notification Center */}
          <NotificationCenter />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {isAuthenticated || isDemoMode ? <ProfileMenu /> : <>
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="text-[10px] sm:text-xs border-[#E5E7EB] text-[#142D52] hover:bg-[#F9FAF7]">
                {t("nav.login")}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="ghost" size="sm" className="text-[10px] sm:text-xs text-[#047857] hover:bg-[#047857]/10">
                {t("nav.register")}
              </Button>
            </Link>
          </>}

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
            <Button variant="default" size="sm" className="text-[10px] sm:text-xs">
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
            className="rounded-md p-2 text-[#4B5563] hover:text-[#142D52] lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-[#142D52]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E5E7EB] bg-white p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium rounded-md bg-[#F9FAF7] text-[#1F2937] hover:bg-[#047857]/10 hover:text-[#047857]"
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
          <div className="grid grid-cols-2 gap-2">
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full text-xs">
                {t("nav.login")}
              </Button>
            </Link>
            <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full text-xs">
                {t("nav.register")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
