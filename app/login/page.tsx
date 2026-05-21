"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { BrandLogoLink } from "@/components/ui/brand-logo-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { toUserFriendlyError } from "@/lib/firebase-error";
import { loginSchema } from "@/lib/validators";
import { loginWithBusinessCode } from "@/services/auth-service";

type LoginFormValues = z.infer<typeof loginSchema>;
type LoginLocale = "tr" | "en";

const LOGIN_COPY = {
  tr: {
    submitErrorFallback: "Giriş yapılamadı.",
    sessionFound: "Oturum bulundu, panele yönlendiriliyor...",
    checkingSession: "Oturum doğrulanıyor...",
    title: "Giriş Yap",
    description: "Email, şifre ve işletme kodu ile giriş yapın.",
    email: "E-posta",
    password: "Şifre",
    businessCode: "İşletme Kodu",
    submitting: "Giriş yapılıyor",
    submit: "Giriş Yap",
    noAccount: "Hesabın yok mu?",
    register: "Kayıt ol",
  },
  en: {
    submitErrorFallback: "Login failed.",
    sessionFound: "Session found, redirecting to dashboard...",
    checkingSession: "Checking session...",
    title: "Login",
    description: "Sign in with email, password, and business code.",
    email: "Email",
    password: "Password",
    businessCode: "Business Code",
    submitting: "Signing in",
    submit: "Login",
    noAccount: "Don't have an account?",
    register: "Register",
  },
} as const;

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { loading, firebaseUser, userProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitLocked, setSubmitLocked] = useState(false);
  const loginLocale: LoginLocale = locale === "tr" ? "tr" : "en";
  const copy = LOGIN_COPY[loginLocale];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      businessCode: "",
    },
  });

  const isPending = isSubmitting || submitLocked;
  const isCheckingSession = loading || Boolean(firebaseUser);

  useEffect(() => {
    if (loading || !firebaseUser) {
      return;
    }

    router.replace(userProfile?.role === "admin" ? "/admin" : "/dashboard");
  }, [firebaseUser, loading, router, userProfile?.role]);

  const onSubmit = async (values: LoginFormValues) => {
    if (submitLocked) {
      return;
    }

    setSubmitLocked(true);
    setError(null);

    try {
      const profile = await loginWithBusinessCode(values.email, values.password, values.businessCode);
      router.push(profile.role === "admin" ? "/admin" : "/dashboard");
    } catch (submitError) {
      setError(toUserFriendlyError(submitError, copy.submitErrorFallback));
    } finally {
      setSubmitLocked(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow">
          <Spinner />
          {firebaseUser ? copy.sessionFound : copy.checkingSession}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 px-4 py-10">
      <BrandLogoLink className="mx-auto" />
      <Card className="w-full">
        <h1 className="text-2xl font-bold text-slate-900">{copy.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{copy.description}</p>

        <form className="mt-6 space-y-4" method="post" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="space-y-4" disabled={isPending}>
            <div>
              <Label>{copy.email}</Label>
              <Input type="email" {...register("email")} />
              {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
            </div>
            <div>
              <Label>{copy.password}</Label>
              <Input type="password" {...register("password")} />
              {errors.password ? (
                <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
              ) : null}
            </div>
            <div>
              <Label>{copy.businessCode}</Label>
              <Input {...register("businessCode")} />
              {errors.businessCode ? (
                <p className="mt-1 text-xs text-rose-600">{errors.businessCode.message}</p>
              ) : null}
            </div>

            {error ? <Alert variant="error">{error}</Alert> : null}

            <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> {copy.submitting}
                </span>
              ) : (
                copy.submit
              )}
            </Button>
          </fieldset>

          <p className="text-sm text-slate-600">
            {copy.noAccount}{" "}
            <Link
              href="/register"
              className={`font-semibold text-emerald-700 hover:underline ${
                isPending ? "pointer-events-none opacity-70" : ""
              }`}
              aria-disabled={isPending}
            >
              {copy.register}
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
