"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { useI18n } from "@/lib/i18n";
import { demoRegistrationSchema } from "@/schemas";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SahyogLogo } from "@/components/shared/Logo";
import { User, HardHat, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type RegisterRole = "CUSTOMER" | "WORKER";

export default function RegisterPage() {
  const router = useRouter();
  const { registerAccount } = useAppState();
  const { t } = useI18n();

  const [role, setRole] = useState<RegisterRole>("CUSTOMER");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  const formValues = { fullName, phone, email, password, confirmPassword, role };
  const validation = useMemo(() => demoRegistrationSchema.safeParse(formValues), [formValues]);
  
  const fieldErrors = validation.success ? {} : validation.error.flatten().fieldErrors;
  const showErrors = !validation.success && (submitted || fullName.length + email.length + password.length + confirmPassword.length > 0);
  const isValid = validation.success;

  const errorMessage = (field: keyof typeof fieldErrors) => {
    const key = fieldErrors[field]?.[0];
    return key ? t(key) : undefined;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validation.success) return;

    setSubmitting(true);
    setSubmitError(null);
    const registration = await registerAccount({
      fullName: validation.data.fullName,
      phone: validation.data.phone,
      email: validation.data.email,
      password: validation.data.password,
      role: validation.data.role,
    });
    setSubmitting(false);
    if (registration.error) { setSubmitError(registration.error); return; }
    setSuccess(true);
    setNeedsEmailConfirmation(Boolean(registration.needsEmailConfirmation));
    if (!registration.needsEmailConfirmation) window.setTimeout(() => router.push(registration.profile?.role === "WORKER" ? "/worker" : "/customer"), 700);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F9FAF7]">
      <Card className="w-full max-w-lg border-[#E5E7EB] bg-white shadow-md">
        <CardHeader className="text-center space-y-2 border-b border-[#E5E7EB] pb-6">
          <div className="flex justify-center mx-auto">
            <SahyogLogo size="lg" />
          </div>
          <CardTitle className="text-xl font-bold text-[#142D52]">{t("auth.registerTitle")}</CardTitle>
          <p className="text-xs text-[#6B7280]">{t("auth.registerSubtitle")}</p>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {success ? (
            <div
              className="flex flex-col items-center gap-2 py-8 text-center"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 className="w-10 h-10 text-[#047857]" aria-hidden="true" />
              <p className="text-sm font-semibold text-[#142D52]">{needsEmailConfirmation ? "Check your email to confirm your account before signing in." : t("auth.registerSuccess")}</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-xs" noValidate>
              <div>
                <Label className="font-semibold text-[#142D52]">{t("auth.roleLabel")}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5" role="group" aria-label={t("auth.roleLabel")}>
                  <button
                    type="button"
                    onClick={() => setRole("CUSTOMER")}
                    aria-pressed={role === "CUSTOMER"}
                    className={`p-3 rounded-lg border flex items-center gap-2 font-semibold transition-all ${
                      role === "CUSTOMER"
                        ? "border-[#047857] bg-[#047857]/5 ring-1 ring-[#047857] text-[#047857]"
                        : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAF7]"
                    }`}
                  >
                    <User className="w-4 h-4" aria-hidden="true" /> {t("auth.roleCustomer")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("WORKER")}
                    aria-pressed={role === "WORKER"}
                    className={`p-3 rounded-lg border flex items-center gap-2 font-semibold transition-all ${
                      role === "WORKER"
                        ? "border-[#047857] bg-[#047857]/5 ring-1 ring-[#047857] text-[#047857]"
                        : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAF7]"
                    }`}
                  >
                    <HardHat className="w-4 h-4" aria-hidden="true" /> {t("auth.roleWorker")}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="register-full-name" className="font-semibold text-[#142D52]">
                    {t("auth.fullName")}
                  </Label>
                  <Input
                    id="register-full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Verma"
                    className="mt-1 border-[#E5E7EB] focus:ring-[#047857]"
                    aria-invalid={showErrors && !!errorMessage("fullName")}
                    aria-describedby={showErrors && errorMessage("fullName") ? "fullName-error" : undefined}
                  />
                  {showErrors && errorMessage("fullName") && (
                    <p id="fullName-error" className="mt-1 text-[11px] text-[#DC2626]">
                      {errorMessage("fullName")}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="register-email" className="font-semibold text-[#142D52]">
                    {t("auth.email")}
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 border-[#E5E7EB] focus:ring-[#047857]"
                    aria-invalid={showErrors && !!errorMessage("email")}
                    aria-describedby={showErrors && errorMessage("email") ? "email-error" : undefined}
                  />
                  {showErrors && errorMessage("email") && (
                    <p id="email-error" className="mt-1 text-[11px] text-[#DC2626]">
                      {errorMessage("email")}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="register-password" className="font-semibold text-[#142D52]">
                    {t("auth.password")}
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pr-10 border-[#E5E7EB] focus:ring-[#047857]"
                      aria-invalid={showErrors && !!errorMessage("password")}
                      aria-describedby={showErrors && errorMessage("password") ? "password-error" : undefined}
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
                  {showErrors && errorMessage("password") && (
                    <p id="password-error" className="mt-1 text-[11px] text-[#DC2626]">
                      {errorMessage("password")}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="register-confirm-password" className="font-semibold text-[#142D52]">
                    {t("auth.confirmPassword")}
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pr-10 border-[#E5E7EB] focus:ring-[#047857]"
                      aria-invalid={showErrors && !!errorMessage("confirmPassword")}
                      aria-describedby={
                        showErrors && errorMessage("confirmPassword") ? "confirmPassword-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-[#142D52]"
                      aria-label={showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {showErrors && errorMessage("confirmPassword") && (
                    <p id="confirmPassword-error" className="mt-1 text-[11px] text-[#DC2626]">
                      {errorMessage("confirmPassword")}
                    </p>
                  )}
                </div>
              </div>

              {submitError ? <p className="text-xs text-red-700">{submitError}</p> : null}
              <p className="text-[11px] text-[#6B7280]">Your password is handled only by Supabase Auth and is never stored by Sahyog.</p>

              <Button
                type="submit"
                disabled={!isValid || submitting}
                className="w-full text-xs bg-[#047857] text-white hover:bg-[#065F46] shadow-sm mt-2"
              >
                {submitting ? "Creating account…" : t("auth.register")}
              </Button>
            </form>
          )}
        </CardContent>

        {!success && (
          <CardFooter className="p-4 bg-[#F9FAF7] border-t border-[#E5E7EB] text-center justify-center text-xs text-[#6B7280]">
            <span>{t("auth.hasAccount")} </span>
            <Link href="/auth/login" className="font-semibold text-[#047857] hover:underline ml-1">
              {t("auth.signInLink")}
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
