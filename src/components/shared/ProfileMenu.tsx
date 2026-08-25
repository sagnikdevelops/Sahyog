"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppState } from "@/lib/store/stateContext";
import { fetchProfilesByMode, setActiveProfileId } from "@/lib/store/demoStore";

export default function ProfileMenu() {
  const { currentUser, currentRole, authenticatedUser, switchDemoUser, logout, changePassword } = useAppState();
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const mode = (() => {
    if (currentRole === "CUSTOMER") return "customer";
    if (currentRole === "WORKER") return "worker";
    if (currentRole === "SOCIETY_ADMIN") return "cooperative";
    if (currentRole === "FEDERATION_ADMIN") return "federation";
    return "customer";
  })();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchProfilesByMode(mode as any)
      .then((list: any) => setProfiles(list || []))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, [open, mode]);

  const handleSwitch = (profile: any) => {
    const id = profile.id || profile.profile?.id;
    setActiveProfileId(mode as any, id);
    // refresh via switchDemoUser
    switchDemoUser(currentRole);
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const handleChangePassword = async () => {
    const pw = prompt("Enter your new password (will call Supabase); if using demo, this will be a no-op.");
    if (!pw) return;
    await changePassword(pw);
    alert("Password change requested. If using Supabase this will update your password.");
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button variant="ghost" onClick={() => setOpen(!open)} className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>{(currentUser.fullName || "").split(" ").map(s=>s[0]).slice(0,2).join("")}</AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline">{currentUser.fullName}</span>
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white p-3 shadow-lg z-50">
          <div className="mb-2">
            <p className="text-sm font-semibold">Profile</p>
                <p className="text-xs text-muted-foreground">{authenticatedUser?.email ?? currentUser.email}</p>
          </div>

          <div className="mb-2">
            <p className="text-xs font-medium">Switch {currentRole.replace("_", " ")}</p>
            {loading ? (
              <p className="text-xs text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-auto mt-2">
                {profiles.length === 0 && <p className="text-xs text-muted-foreground">No saved profiles</p>}
                {profiles.map((p) => (
                  <div key={p.id || p.profile?.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{p.fullName || p.profile?.fullName}</p>
                      <p className="text-xs text-muted-foreground">{p.email || p.profile?.email}</p>
                    </div>
                    <div>
                      <Button size="sm" onClick={() => handleSwitch(p)}>
                        Switch
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <Button variant="outline" onClick={handleChangePassword} className="flex-1">
              Change password
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="flex-1">
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
