"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { toUserFriendlyError } from "@/lib/firebase-error";
import { loginSchema } from "@/lib/validators";
import { loginWithBusinessCode } from "@/services/auth-service";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitLocked, setSubmitLocked] = useState(false);

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
      setError(toUserFriendlyError(submitError, "Giriş yapılamadı."));
    } finally {
      setSubmitLocked(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 px-4 py-10">
      <BrandLogoLink className="mx-auto" />
      <Card className="w-full">
        <h1 className="text-2xl font-bold text-slate-900">Giriş Yap</h1>
        <p className="mt-1 text-sm text-slate-600">Email, şifre ve işletme kodu ile giriş yapın.</p>

        <form className="mt-6 space-y-4" method="post" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="space-y-4" disabled={isPending}>
            <div>
              <Label>E-posta</Label>
              <Input type="email" {...register("email")} />
              {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
            </div>
            <div>
              <Label>Şifre</Label>
              <Input type="password" {...register("password")} />
              {errors.password ? (
                <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
              ) : null}
            </div>
            <div>
              <Label>İşletme Kodu</Label>
              <Input {...register("businessCode")} />
              {errors.businessCode ? (
                <p className="mt-1 text-xs text-rose-600">{errors.businessCode.message}</p>
              ) : null}
            </div>

            {error ? <Alert variant="error">{error}</Alert> : null}

            <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Giriş yapılıyor
                </span>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </fieldset>

          <p className="text-sm text-slate-600">
            Hesabın yok mu?{" "}
            <Link
              href="/register"
              className={`font-semibold text-emerald-700 hover:underline ${
                isPending ? "pointer-events-none opacity-70" : ""
              }`}
              aria-disabled={isPending}
            >
              Kayıt ol
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
