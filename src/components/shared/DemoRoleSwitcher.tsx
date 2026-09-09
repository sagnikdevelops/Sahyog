"use client";

import React, { useState } from "react";
import { useAppState } from "@/lib/store/stateContext";
import { UserRole } from "@/types";
import { User, HardHat, Building2, Landmark, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function DemoRoleSwitcher() {
  const { currentRole, currentUser, authenticatedUser, switchDemoUser, resetToSeedData } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleRoleSelect = (role: UserRole, targetRoute: string) => {
    switchDemoUser(role);
    setIsOpen(false);
    router.push(targetRoute);
  };

  const roleConfigs = [
    {
      role: "CUSTOMER" as UserRole,
      label: "Customer",
      user: "Aarav Sharma",
      icon: User,
      route: "/customer",
      desc: "Browse, request & pay for services",
    },
    {
      role: "WORKER" as UserRole,
      label: "Cooperative Worker",
      user: "Ramesh Verma (Plumber)",
      icon: HardHat,
      route: "/worker",
      desc: "Manage jobs, travel & completion",
    },
    {
      role: "SOCIETY_ADMIN" as UserRole,
      label: "Society Admin",
      user: "Sunita Deshmukh",
      icon: Building2,
      route: "/admin",
      desc: "Verify workers, assign & monitor",
    },
    {
      role: "FEDERATION_ADMIN" as UserRole,
      label: "Federation Admin",
      user: "Dr. Rajeshwar Patil",
      icon: Landmark,
      route: "/admin/analytics",
      desc: "Federation KPIs, welfare & insights",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex max-w-[220px] items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-2 py-1.5 text-[10px] font-medium text-[#1F2937] shadow-sm transition-all hover:bg-[#F9FAF7] sm:gap-2 sm:px-3 sm:text-xs"
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#047857] animate-pulse" />
        <span className="hidden font-semibold text-[#142D52] sm:inline">Demo Mode:</span>
        <span className="truncate rounded bg-[#F9FAF7] px-1.5 py-0.5 text-[#4B5563] sm:px-2">
          {currentRole.replace("_", " ")}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#6B7280]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-lg border border-[#E5E7EB] bg-white shadow-xl p-3 z-50 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] mb-2">
            <div>
              <p className="text-xs font-bold text-[#142D52]">Hackathon Role Switcher</p>
              <p className="text-[11px] text-[#6B7280]">Current: {authenticatedUser?.fullName ?? currentUser.fullName}</p>
            </div>
            <button
              onClick={() => {
                if (confirm("Reset all state to initial demo seed data?")) {
                  resetToSeedData();
                  setIsOpen(false);
                  router.push("/");
                }
              }}
              title="Reset Demo Data"
              className="text-[#6B7280] hover:text-[#DC2626] p-1 rounded hover:bg-[#F9FAF7]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {roleConfigs.map((item) => {
              const Icon = item.icon;
              const isSelected = currentRole === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => handleRoleSelect(item.role, item.route)}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-md text-left transition-colors ${
                    isSelected
                      ? "bg-[#142D52] text-white"
                      : "hover:bg-[#F9FAF7] text-[#1F2937]"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${isSelected ? "bg-[#047857]" : "bg-[#F9FAF7]"}`}>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-[#34D399]" : "text-[#142D52]"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold truncate">{item.label}</p>
                      {isSelected && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1 border-white/40 text-white">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className={`text-[11px] truncate ${isSelected ? "text-[#34D399]" : "text-[#6B7280]"}`}>
                      {item.user}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}