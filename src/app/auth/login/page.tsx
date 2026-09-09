"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { useI18n } from "@/lib/i18n";
import { UserRole } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SahyogLogo } from "@/components/shared/Logo";
import { User, HardHat, Building2, Landmark, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { switchDemoUser, loginAccount } = useAppState();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoLogin = (role: UserRole, targetUrl: string) => {
    switchDemoUser(role);
    router.push(targetUrl);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await loginAccount(email, password);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    router.push(result.targetUrl ?? "/customer");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F9FAF7]">
      <Card className="w-full max-w-md border-[#E5E7EB] bg-white shadow-md">
        <CardHeader className="text-center space-y-2 border-b border-[#E5E7EB] pb-6">
          <div className="flex justify-center mx-auto">
            <SahyogLogo size="lg" />
          </div>
          <CardTitle className="text-xl font-bold text-[#142D52]">{t("auth.loginTitle")}</CardTitle>
          <p className="text-xs text-[#6B7280]">{t("auth.loginSubtitle")}</p>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleEmailSignIn} className="space-y-3" noValidate>
            <div>
              <Label htmlFor="login-email" className="text-xs font-semibold text-[#142D52]">
                {t("auth.email")}
              </Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 text-xs border-[#E5E7EB] focus:ring-[#047857]"
              />
            </div>
            <div>
              <Label htmlFor="login-password" className="text-xs font-semibold text-[#142D52]">
                {t("auth.password")}
              </Label>
              <div className="relative mt-1">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-xs pr-10 border-[#E5E7EB] focus:ring-[#047857]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-[#142D52]"
                  aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error ? <p className="text-xs text-red-700">{error}</p> : null}
            <p className="text-[11px] text-[#6B7280]">Sign in with your real Supabase account. Demo personas are available below as a separate simulation.</p>
            <Button type="submit" disabled={submitting} className="w-full text-xs bg-[#047857] text-white hover:bg-[#065F46] shadow-sm">
              {submitting ? "Signing in…" : t("auth.signIn")}
            </Button>
          </form>

          <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
            <p className="text-[11px] font-bold uppercase text-[#6B7280] text-center">
              {t("auth.demoAccounts")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("CUSTOMER", "/customer")}
                className="text-xs justify-start gap-1.5 border-[#E5E7EB] text-[#142D52] hover:bg-[#F9FAF7]"
              >
                <User className="w-3.5 h-3.5 text-[#047857]" /> Customer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("WORKER", "/worker")}
                className="text-xs justify-start gap-1.5 border-[#E5E7EB] text-[#142D52] hover:bg-[#F9FAF7]"
              >
                <HardHat className="w-3.5 h-3.5 text-[#047857]" /> Worker
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("SOCIETY_ADMIN", "/admin")}
                className="text-xs justify-start gap-1.5 border-[#E5E7EB] text-[#142D52] hover:bg-[#F9FAF7]"
              >
                <Building2 className="w-3.5 h-3.5 text-[#047857]" /> Society Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin("FEDERATION_ADMIN", "/admin/analytics")}
                className="text-xs justify-start gap-1.5 border-[#E5E7EB] text-[#142D52] hover:bg-[#F9FAF7]"
              >
                <Landmark className="w-3.5 h-3.5 text-[#047857]" /> Federation Admin
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-[#F9FAF7] border-t border-[#E5E7EB] text-center justify-center text-xs text-[#6B7280]">
          <span>{t("auth.noAccount")} </span>
          <Link href="/auth/register" className="font-semibold text-[#047857] hover:underline ml-1">
            {t("auth.registerMember")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
