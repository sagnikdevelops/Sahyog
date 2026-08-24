"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVICE_CATEGORIES } from "@/constants";
import { Handshake, User, HardHat, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { switchDemoUser } = useAppState();
  const [role, setRole] = useState<"CUSTOMER" | "WORKER">("CUSTOMER");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Noida");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "WORKER") {
      switchDemoUser("WORKER");
      router.push("/worker/profile");
    } else {
      switchDemoUser("CUSTOMER");
      router.push("/customer");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg border-[#E5E5E5] shadow-lg">
        <CardHeader className="text-center space-y-2 border-b border-[#E5E5E5] pb-6">
          <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center mx-auto shadow-sm">
            <Handshake className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold text-[#111111]">Join Sahyog Cooperative Network</CardTitle>
          <p className="text-xs text-[#737373]">
            Register as a Customer or Skilled Labour Cooperative Member
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Role Select */}
            <div>
              <label className="font-semibold block mb-1.5">I am registering as:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`p-3 rounded-lg border flex items-center gap-2 font-semibold transition-all ${
                    role === "CUSTOMER"
                      ? "border-[#111111] bg-[#F8F8F8] ring-1 ring-[#111111] text-[#111111]"
                      : "border-[#E5E5E5] text-[#737373] hover:bg-[#F8F8F8]"
                  }`}
                >
                  <User className="w-4 h-4" /> Customer / Household
                </button>
                <button
                  type="button"
                  onClick={() => setRole("WORKER")}
                  className={`p-3 rounded-lg border flex items-center gap-2 font-semibold transition-all ${
                    role === "WORKER"
                      ? "border-[#111111] bg-[#F8F8F8] ring-1 ring-[#111111] text-[#111111]"
                      : "border-[#E5E5E5] text-[#737373] hover:bg-[#F8F8F8]"
                  }`}
                >
                  <HardHat className="w-4 h-4" /> Skilled Technician
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Full Name</label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Verma"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Mobile Phone (with OTP verification)</label>
                <Input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Email Address</label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">District / City</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Noida / Delhi NCR"
                />
              </div>
            </div>

            <Button type="submit" className="w-full text-xs bg-[#111111] text-white hover:bg-[#262626] mt-2">
              Complete Cooperative Registration
            </Button>
          </form>
        </CardContent>

        <CardFooter className="p-4 bg-[#F8F8F8] border-t border-[#E5E5E5] text-center justify-center text-xs text-[#737373]">
          <span>Already registered? </span>
          <Link href="/auth/login" className="font-semibold text-[#111111] hover:underline ml-1">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}