"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/store/stateContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { initialsFromName } from "@/lib/auth/guest";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";

export default function ProfileMenu() {
  const { realUser, demoUser, isDemoMode, logout } = useAppState();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!realUser) return null;
  const profileHref = realUser.role === "WORKER" ? "/worker/profile" : "/customer/profile";
  const dashboardHref = realUser.role === "WORKER" ? "/worker" : realUser.role.includes("ADMIN") ? "/admin" : "/customer";

  return (
    <div className="relative">
      <Button variant="ghost" onClick={() => setOpen((value) => !value)} className="h-9 gap-2 px-2 text-xs">
        <Avatar className="h-7 w-7">
          <AvatarImage src={realUser.avatarUrl} alt={realUser.fullName} />
          <AvatarFallback>{initialsFromName(realUser.fullName)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate sm:inline">{realUser.fullName}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-[#E5E5E5] bg-white p-2 shadow-xl">
          <div className="rounded-lg bg-[#F8F8F8] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#737373]">Real account</p>
            <p className="mt-1 text-sm font-semibold text-[#111111]">{realUser.fullName}</p>
            <p className="truncate text-xs text-[#737373]">{realUser.email}</p>
            <p className="mt-1 text-[11px] font-medium text-[#525252]">{realUser.role.replace("_", " ")}</p>
          </div>
          {isDemoMode && demoUser ? (
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800">Demo mode active</p>
              <p className="text-xs text-amber-900">Viewing {demoUser.fullName}; your real account remains signed in.</p>
            </div>
          ) : null}
          <div className="mt-2 space-y-1">
            <Link href={profileHref} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-[#F8F8F8]">
              <UserRound className="h-4 w-4" /> Profile
            </Link>
            <Link href={dashboardHref} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-[#F8F8F8]">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <button onClick={() => { setOpen(false); setDeleteOpen(true); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-[#B91C1C] hover:bg-red-50">
              Delete account
            </button>
            <button onClick={() => void logout()} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs hover:bg-[#F8F8F8]">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      ) : null}
      <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  );
}
