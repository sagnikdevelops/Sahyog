"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { UserRole } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Handshake, User, HardHat, Building2, Landmark, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { switchDemoUser } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDemoLogin = (role: UserRole, targetUrl: string) => {
    switchDemoUser(role);
    router.push(targetUrl);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-[#E5E5E5] shadow-lg">
        <CardHeader className="text-center space-y-2 border-b border-[#E5E5E5] pb-6">
          <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center mx-auto shadow-sm">
            <Handshake className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold text-[#111111]">Sign In to Sahyog</CardTitle>
          <p className="text-xs text-[#737373]">
            Cooperative Digital Service Marketplace
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#111111] block mb-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#111111] block mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="text-xs"
              />
            </div>
            <Button
              onClick={() => handleDemoLogin("CUSTOMER", "/customer")}
              className="w-full text-xs bg-[#111111] text-white hover:bg-[#262626]"
            >
              Sign In
            </Button>
          </div>

          {/* 1-Click Hackathon Role Login */}
          <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
            <p className="text-[11px] font-bold uppercase text-[#737373] text-center">
              Quick 1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("CUSTOMER", "/customer")}
                className="text-xs justify-start gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Customer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("WORKER", "/worker")}
                className="text-xs justify-start gap-1.5"
              >
                <HardHat className="w-3.5 h-3.5" /> Worker
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("SOCIETY_ADMIN", "/admin")}
                className="text-xs justify-start gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" /> Society Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("FEDERATION_ADMIN", "/admin/analytics")}
                className="text-xs justify-start gap-1.5"
              >
                <Landmark className="w-3.5 h-3.5" /> Federation Admin
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-[#F8F8F8] border-t border-[#E5E5E5] text-center justify-center text-xs text-[#737373]">
          <span>Don't have an account? </span>
          <Link href="/auth/register" className="font-semibold text-[#111111] hover:underline ml-1">
            Register as Member
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}