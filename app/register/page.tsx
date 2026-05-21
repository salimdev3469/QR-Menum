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
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/hooks/use-locale";
import { toUserFriendlyError } from "@/lib/firebase-error";
import { registerSchema } from "@/lib/validators";
import { registerBusiness } from "@/services/auth-service";

type RegisterFormValues = z.infer<typeof registerSchema>;
type RegisterLocale = "tr" | "en";

const REGISTER_COPY = {
  tr: {
    submitErrorFallback: "Kayıt sırasında hata oluştu.",
    title: "Mekan Hesabı Oluştur",
    description: "İşletme bilgilerinizi girin, paneliniz otomatik oluşturulsun.",
    name: "Ad Soyad",
    email: "E-posta",
    phone: "Telefon",
    businessCode: "İşletme Kodu",
    businessCodePlaceholder: "4-20 karakter",
    password: "Şifre",
    confirmPassword: "Şifre Tekrar",
    restaurantName: "İşletme Adı",
    managerName: "Yetkili Adı",
    restaurantPhone: "İşletme Telefonu",
    address: "Adres",
    submitting: "Kaydediliyor",
    submit: "Kayıt Ol",
    hasAccount: "Zaten hesabım var, giriş yap",
  },
  en: {
    submitErrorFallback: "Registration failed.",
    title: "Create Venue Account",
    description: "Enter your business details and your dashboard will be created automatically.",
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    businessCode: "Business Code",
    businessCodePlaceholder: "4-20 characters",
    password: "Password",
    confirmPassword: "Confirm Password",
    restaurantName: "Business Name",
    managerName: "Manager Name",
    restaurantPhone: "Business Phone",
    address: "Address",
    submitting: "Saving",
    submit: "Register",
    hasAccount: "I already have an account, login",
  },
} as const;

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [submitLocked, setSubmitLocked] = useState(false);
  const registerLocale: RegisterLocale = locale === "tr" ? "tr" : "en";
  const copy = REGISTER_COPY[registerLocale];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      businessCode: "",
      restaurantName: "",
      managerName: "",
      restaurantPhone: "",
      address: "",
    },
  });

  const isPending = isSubmitting || submitLocked;

  const onSubmit = async (values: RegisterFormValues) => {
    if (submitLocked) {
      return;
    }

    setSubmitLocked(true);
    setError(null);

    try {
      await registerBusiness(values);
      router.push("/dashboard");
    } catch (submitError) {
      setError(toUserFriendlyError(submitError, copy.submitErrorFallback));
    } finally {
      setSubmitLocked(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-5 px-4 py-10">
      <BrandLogoLink className="mx-auto" />
      <Card className="w-full">
        <h1 className="text-2xl font-bold text-slate-900">{copy.title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {copy.description}
        </p>

        <form className="mt-6" method="post" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="grid gap-4 border-0 p-0 md:grid-cols-2" disabled={isPending}>
            <div>
              <Label>{copy.name}</Label>
              <Input {...register("name")} />
              {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
            </div>
            <div>
              <Label>{copy.email}</Label>
              <Input type="email" {...register("email")} />
              {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
            </div>
            <div>
              <Label>{copy.phone}</Label>
              <Input {...register("phone")} />
              {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p> : null}
            </div>
            <div>
              <Label>{copy.businessCode}</Label>
              <Input {...register("businessCode")} placeholder={copy.businessCodePlaceholder} />
              {errors.businessCode ? (
                <p className="mt-1 text-xs text-rose-600">{errors.businessCode.message}</p>
              ) : null}
            </div>
            <div>
              <Label>{copy.password}</Label>
              <Input type="password" {...register("password")} />
              {errors.password ? (
                <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
              ) : null}
            </div>
            <div>
              <Label>{copy.confirmPassword}</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword ? (
                <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword.message}</p>
              ) : null}
            </div>
            <div>
              <Label>{copy.restaurantName}</Label>
              <Input {...register("restaurantName")} />
              {errors.restaurantName ? (
                <p className="mt-1 text-xs text-rose-600">{errors.restaurantName.message}</p>
              ) : null}
            </div>
            <div>
              <Label>{copy.managerName}</Label>
              <Input {...register("managerName")} />
              {errors.managerName ? (
                <p className="mt-1 text-xs text-rose-600">{errors.managerName.message}</p>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <Label>{copy.restaurantPhone}</Label>
              <Input {...register("restaurantPhone")} />
              {errors.restaurantPhone ? (
                <p className="mt-1 text-xs text-rose-600">{errors.restaurantPhone.message}</p>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <Label>{copy.address}</Label>
              <Textarea {...register("address")} />
              {errors.address ? (
                <p className="mt-1 text-xs text-rose-600">{errors.address.message}</p>
              ) : null}
            </div>

            {error ? (
              <div className="md:col-span-2">
                <Alert variant="error">{error}</Alert>
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner /> {copy.submitting}
                  </span>
                ) : (
                  copy.submit
                )}
              </Button>
              <Link
                href="/login"
                className={`text-sm font-semibold text-emerald-700 hover:underline ${
                  isPending ? "pointer-events-none opacity-70" : ""
                }`}
                aria-disabled={isPending}
              >
                {copy.hasAccount}
              </Link>
            </div>
          </fieldset>
        </form>
      </Card>
    </div>
  );
}
