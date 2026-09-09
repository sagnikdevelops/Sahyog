"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store/stateContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { initialsFromName } from "@/lib/auth/guest";
import { ChevronDown, LayoutDashboard, LogOut, UserRound, Sparkles, XCircle } from "lucide-react";

export default function ProfileMenu() {
  const { realUser, demoUser, currentUser, currentRole, isDemoMode, exitDemoMode, logout } = useAppState();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const activeUser = isDemoMode ? (demoUser || currentUser) : realUser;
  if (!activeUser) return null;

  const profileHref = currentRole === "WORKER" ? "/worker/profile" : "/customer/profile";
  const dashboardHref =
    currentRole === "WORKER"
      ? "/worker"
      : currentRole.includes("ADMIN")
      ? "/admin"
      : "/customer";

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setOpen((value) => !value)}
        className={`h-9 gap-2 px-2 text-xs border ${
          isDemoMode
            ? "border-[#34D399]/50 bg-[#34D399]/10 text-[#142D52] hover:bg-[#34D399]/20"
            : "border-[#E5E7EB] hover:bg-[#F9FAF7]"
        }`}
      >
        <Avatar className="h-7 w-7 border border-[#047857]/30">
          <AvatarImage src={activeUser.avatarUrl} alt={activeUser.fullName} />
          <AvatarFallback className="bg-[#142D52] text-[#34D399] text-[10px] font-bold">
            {initialsFromName(activeUser.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start text-left">
          <span className="hidden max-w-28 truncate sm:inline font-bold text-[11px] text-[#142D52]">
            {activeUser.fullName}
          </span>
          {isDemoMode && (
            <span className="text-[9px] text-[#047857] font-semibold tracking-wider uppercase">
              Demo ({currentRole})
            </span>
          )}
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-[#6B7280]" />
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="rounded-lg bg-[#F9FAF7] border border-[#E5E7EB] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]">
                {isDemoMode ? "Active Demo Profile" : "Signed-In Account"}
              </span>
              <Badge variant="outline" className="text-[9px] border-[#047857] text-[#047857]">
                {currentRole.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-sm font-bold text-[#142D52] truncate">{activeUser.fullName}</p>
            <p className="truncate text-xs text-[#6B7280]">{activeUser.email}</p>
          </div>

          {isDemoMode && realUser && (
            <div className="mt-2 rounded-lg border border-[#34D399]/40 bg-[#34D399]/10 p-2 text-[11px] text-[#142D52]">
              Real account: <strong>{realUser.fullName}</strong> is signed in.
            </div>
          )}

          <div className="mt-2 space-y-1">
            <Link
              href={profileHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs text-[#1F2937] hover:bg-[#F9FAF7] hover:text-[#047857] transition-colors"
            >
              <UserRound className="h-4 w-4 text-[#047857]" /> My Profile &amp; Settings
            </Link>
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs text-[#1F2937] hover:bg-[#F9FAF7] hover:text-[#047857] transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-[#047857]" /> View Portal Dashboard
            </Link>

            {isDemoMode && (
              <button
                onClick={() => {
                  setOpen(false);
                  exitDemoMode();
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-[#D97706] hover:bg-amber-50 transition-colors"
              >
                <XCircle className="h-4 w-4" /> Exit Demo Mode
              </button>
            )}

            {realUser && (
              <button
                onClick={() => {
                  setOpen(false);
                  setDeleteOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-[#DC2626] hover:bg-red-50 transition-colors"
              >
                Delete account
              </button>
            )}

            <button
              onClick={() => {
                setOpen(false);
                void logout();
              }}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-[#1F2937] hover:bg-[#F9FAF7] hover:text-[#047857] transition-colors border-t border-[#E5E7EB] mt-1 pt-2"
            >
              <LogOut className="h-4 w-4 text-[#6B7280]" /> {isDemoMode ? "Reset / Sign Out" : "Sign Out"}
            </button>
          </div>
        </div>
      )}
      <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  );
}
