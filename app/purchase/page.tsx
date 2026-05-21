"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/hooks/use-locale";
import { formatMarketPriceFromTry, SYSTEM_PLAN_PRICES_TRY } from "@/lib/market-pricing";
import { systemOrderSchema } from "@/lib/validators";
import { createSystemOrder } from "@/services/system-order-service";

type SystemOrderValues = z.infer<typeof systemOrderSchema>;

export default function PurchasePage() {
  const { pricingCurrency, isInternationalVisitor } = useLocale();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SystemOrderValues>({
    resolver: zodResolver(systemOrderSchema),
    defaultValues: {
      customerName: "",
      businessName: "",
      email: "",
      phone: "",
      planName: "Growth",
      billingCycle: "monthly",
      note: "",
    },
  });

  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get("plan");
    if (plan === "Starter" || plan === "Growth" || plan === "Premium") {
      setValue("planName", plan, { shouldValidate: true });
    }
  }, [setValue]);

  const planName = useWatch({ control, name: "planName" }) ?? "Growth";
  const billingCycle = useWatch({ control, name: "billingCycle" }) ?? "monthly";
  const amountTry = useMemo(() => SYSTEM_PLAN_PRICES_TRY[planName][billingCycle], [billingCycle, planName]);
  const amountLabel = formatMarketPriceFromTry(amountTry, pricingCurrency);

  const onSubmit = handleSubmit(async (values) => {
    setFeedback(null);

    try {
      await createSystemOrder({
        ...values,
        source: "pricing_page",
      });

      reset({
        customerName: "",
        businessName: "",
        email: "",
        phone: "",
        planName: values.planName,
        billingCycle: values.billingCycle,
        note: "",
      });

      setFeedback({
        type: "success",
        message: "Talebiniz alındı. Satış ekibimiz kısa sürede sizinle iletişime geçecek.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Talep gönderilemedi.",
      });
    }
  });

  return (
    <MarketingPageShell>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h1 className="text-2xl font-bold text-slate-900">QR Menüm Sistemi Satın Alımı</h1>
          <p className="mt-1 text-sm text-slate-600">
            Plan seçiminizi yapın, satış ekibimiz sözleşme ve kurulum için sizinle iletişime geçsin.
          </p>

          <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
            <div>
              <Label>Ad Soyad</Label>
              <Input {...register("customerName")} />
              {errors.customerName ? (
                <p className="mt-1 text-xs text-rose-600">{errors.customerName.message}</p>
              ) : null}
            </div>
            <div>
              <Label>İşletme Adı</Label>
              <Input {...register("businessName")} />
              {errors.businessName ? (
                <p className="mt-1 text-xs text-rose-600">{errors.businessName.message}</p>
              ) : null}
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
              <Label>Plan</Label>
              <Controller
                name="planName"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <option value="Starter">Starter</option>
                    <option value="Growth">Growth</option>
                    <option value="Premium">Premium</option>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label>Ödeme Dönemi</Label>
              <Controller
                name="billingCycle"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <option value="monthly">Aylık</option>
                    <option value="annual">Yıllık</option>
                  </Select>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Not (opsiyonel)</Label>
              <Textarea {...register("note")} />
            </div>

            {feedback ? (
              <div className="md:col-span-2">
                <Alert variant={feedback.type}>{feedback.message}</Alert>
              </div>
            ) : null}

            <div className="md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner /> Talep gönderiliyor
                  </span>
                ) : (
                  "Satın Alım Talebi Gönder"
                )}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="h-fit">
          <h2 className="text-lg font-bold text-slate-900">Plan Özeti</h2>
          <p className="mt-2 text-sm text-slate-700">
            <span className="font-semibold">Seçili plan:</span> {planName}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            <span className="font-semibold">Dönem:</span> {billingCycle === "annual" ? "Yıllık" : "Aylık"}
          </p>
          <p className="mt-2 text-base text-slate-900">
            <span className="font-semibold">Tutar:</span>{" "}
            <span className="font-bold">{amountLabel}</span>
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Bu form bir satın alım talebi oluşturur; nihai sözleşme ve ödeme satış ekibi üzerinden ilerler.
          </p>
          {isInternationalVisitor ? (
            <p className="mt-2 text-xs text-slate-500">
              Uluslararası görüntüde USD fiyatlar referans TRY/USD kuruna göre gösterilir.
            </p>
          ) : null}
        </Card>
      </div>
    </MarketingPageShell>
  );
}
