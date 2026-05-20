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
import { toUserFriendlyError } from "@/lib/firebase-error";
import { registerSchema } from "@/lib/validators";
import { registerBusiness } from "@/services/auth-service";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitLocked, setSubmitLocked] = useState(false);

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
      setError(toUserFriendlyError(submitError, "Kayıt sırasında hata oluştu."));
    } finally {
      setSubmitLocked(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-5 px-4 py-10">
      <BrandLogoLink className="mx-auto" />
      <Card className="w-full">
        <h1 className="text-2xl font-bold text-slate-900">Mekan Hesabı Oluştur</h1>
        <p className="mt-1 text-sm text-slate-600">
          İşletme bilgilerinizi girin, paneliniz otomatik oluşturulsun.
        </p>

        <form className="mt-6" method="post" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="grid gap-4 border-0 p-0 md:grid-cols-2" disabled={isPending}>
            <div>
              <Label>Ad Soyad</Label>
              <Input {...register("name")} />
              {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
            </div>
            <div>
              <Label>E-posta</Label>
              <Input type="email" {...register("email")} />
              {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
            </div>
            <div>
              <Label>Telefon</Label>
              <Input {...register("phone")} />
              {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p> : null}
            </div>
            <div>
              <Label>İşletme Kodu</Label>
              <Input {...register("businessCode")} placeholder="4-20 karakter" />
              {errors.businessCode ? (
                <p className="mt-1 text-xs text-rose-600">{errors.businessCode.message}</p>
              ) : null}
            </div>
            <div>
              <Label>Şifre</Label>
              <Input type="password" {...register("password")} />
              {errors.password ? (
                <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
              ) : null}
            </div>
            <div>
              <Label>Şifre Tekrar</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword ? (
                <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword.message}</p>
              ) : null}
            </div>
            <div>
              <Label>İşletme Adı</Label>
              <Input {...register("restaurantName")} />
              {errors.restaurantName ? (
                <p className="mt-1 text-xs text-rose-600">{errors.restaurantName.message}</p>
              ) : null}
            </div>
            <div>
              <Label>Yetkili Adı</Label>
              <Input {...register("managerName")} />
              {errors.managerName ? (
                <p className="mt-1 text-xs text-rose-600">{errors.managerName.message}</p>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <Label>İşletme Telefonu</Label>
              <Input {...register("restaurantPhone")} />
              {errors.restaurantPhone ? (
                <p className="mt-1 text-xs text-rose-600">{errors.restaurantPhone.message}</p>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <Label>Adres</Label>
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
                    <Spinner /> Kaydediliyor
                  </span>
                ) : (
                  "Kayıt Ol"
                )}
              </Button>
              <Link
                href="/login"
                className={`text-sm font-semibold text-emerald-700 hover:underline ${
                  isPending ? "pointer-events-none opacity-70" : ""
                }`}
                aria-disabled={isPending}
              >
                Zaten hesabım var, giriş yap
              </Link>
            </div>
          </fieldset>
        </form>
      </Card>
    </div>
  );
}
