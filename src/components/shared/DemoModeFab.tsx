"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { UserRole } from "@/types";
import { User, HardHat, Building2, Landmark, RefreshCw, ChevronDown, Theater } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DemoModeFab() {
  const { isDemoMode, demoRole, currentRole, realUser, workers, switchDemoUser, switchDemoWorker, exitDemoMode, resetToSeedData } = useAppState();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const activeRole = isDemoMode ? currentRole : null;

  const handleRoleSelect = (role: UserRole, targetRoute: string) => {
    switchDemoUser(role);
    setOpen(false);
    router.push(targetRoute);
  };

  const roleConfigs = [
    { role: "CUSTOMER" as UserRole, label: "Customer", user: "Aarav Sharma", icon: User, route: "/customer" },
    { role: "WORKER" as UserRole, label: "Worker", user: "Ramesh Verma", icon: HardHat, route: "/worker" },
    { role: "SOCIETY_ADMIN" as UserRole, label: "Society Admin", user: "Sunita Deshmukh", icon: Building2, route: "/admin" },
    { role: "FEDERATION_ADMIN" as UserRole, label: "Federation Admin", user: "Dr. Rajeshwar Patil", icon: Landmark, route: "/admin/analytics" },
  ];

  return (
    <div className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 mb-14 sm:mb-0">
      <div className="pointer-events-auto relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-[#142D52] bg-[#142D52] px-3 py-2 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-[#047857]"
        >
          <Theater className="h-4 w-4 text-[#34D399]" />
          Demo Mode
          {isDemoMode ? <span className="rounded-full bg-[#34D399]/30 text-[#34D399] px-1.5 py-0.5 text-[10px]">ON</span> : null}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {open ? (
          <div className="absolute bottom-12 right-0 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-xl">
            <div className="mb-2 flex items-start justify-between border-b border-[#E5E7EB] pb-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#142D52]">Demo Mode</p>
                {realUser ? (
                  <p className="text-[11px] text-[#4B5563]">Real account stays signed in: {realUser.fullName}</p>
                ) : (
                  <p className="text-[11px] text-[#6B7280]">Temporary simulation only</p>
                )}
              </div>
              <button
                onClick={() => {
                  if (confirm("Reset demo seed data? Your real account is not deleted.")) {
                    resetToSeedData();
                    setOpen(false);
                    router.push("/");
                  }
                }}
                className="rounded p-1 text-[#6B7280] hover:bg-[#F9FAF7]"
                title="Reset demo data"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {roleConfigs.map((item) => {
                const Icon = item.icon;
                const selected = isDemoMode && activeRole === item.role;
                return (
                  <button
                    key={item.role}
                    onClick={() => handleRoleSelect(item.role, item.route)}
                    className={`flex w-full items-center gap-2 rounded-md p-2 text-left ${selected ? "bg-[#142D52] text-white" : "hover:bg-[#F9FAF7] text-[#1F2937]"}`}
                  >
                    <Icon className={`h-4 w-4 ${selected ? "text-[#34D399]" : "text-[#142D52]"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className={`truncate text-[11px] ${selected ? "text-[#34D399]" : "text-[#6B7280]"}`}>{item.user}</p>
                    </div>
                    {selected ? <Badge variant="outline" className="border-white/40 text-[10px] text-white">Active</Badge> : null}
                  </button>
                );
              })}
            </div>
            {isDemoMode ? (
              <div className="mt-2 border-t border-[#E5E7EB] pt-2">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
                  Worker Profiles
                </p>
                <div className="max-h-36 space-y-1 overflow-y-auto">
                  {workers.map((worker) => (
                    <button
                      key={worker.id}
                      onClick={() => {
                        switchDemoWorker(worker.id);
                        setOpen(false);
                        router.push("/worker");
                      }}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-[#1F2937] hover:bg-[#F9FAF7]"
                    >
                      <span className="truncate">{worker.profile.fullName}</span>
                      <span className="ml-2 shrink-0 text-[10px] text-[#6B7280]">Open dashboard</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {isDemoMode ? (
              <button
                className="mt-2 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#1F2937] hover:bg-[#F9FAF7]"
                onClick={() => {
                  exitDemoMode();
                  setOpen(false);
                  router.push(realUser ? (realUser.role === "WORKER" ? "/worker" : "/customer") : "/");
                }}
              >
                Exit demo — return to {realUser ? realUser.fullName : "signed-out home"}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
