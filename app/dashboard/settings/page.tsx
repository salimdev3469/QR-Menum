"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { businessCodeUpdateSchema } from "@/lib/validators";
import { updateBusinessCode } from "@/services/auth-service";
import { updateRestaurant } from "@/services/restaurant-service";

const businessInfoUpdateSchema = z.object({
  name: z.string().trim().min(2, "İşletme adı en az 2 karakter olmalı."),
  managerName: z.string().trim().min(2, "Yetkili adı en az 2 karakter olmalı."),
  phone: z.string().trim().min(7, "Telefon numarası geçersiz."),
  address: z.string().trim().min(5, "Adres en az 5 karakter olmalı."),
});

type BusinessCodeValues = z.infer<typeof businessCodeUpdateSchema>;
type BusinessInfoValues = z.infer<typeof businessInfoUpdateSchema>;

export default function SettingsPage() {
  const { firebaseUser, userProfile, restaurant, refreshSession } = useAuth();
  const [businessCodeFeedback, setBusinessCodeFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [businessInfoFeedback, setBusinessInfoFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register: registerBusinessCode,
    handleSubmit: handleBusinessCodeSubmit,
    reset: resetBusinessCode,
    formState: { errors: businessCodeErrors, isSubmitting: isBusinessCodeSubmitting },
  } = useForm<BusinessCodeValues>({
    resolver: zodResolver(businessCodeUpdateSchema),
    defaultValues: {
      businessCode: "",
    },
  });

  const {
    register: registerBusinessInfo,
    handleSubmit: handleBusinessInfoSubmit,
    reset: resetBusinessInfo,
    formState: { errors: businessInfoErrors, isSubmitting: isBusinessInfoSubmitting },
  } = useForm<BusinessInfoValues>({
    resolver: zodResolver(businessInfoUpdateSchema),
    defaultValues: {
      name: "",
      managerName: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!userProfile) {
      return;
    }

    resetBusinessCode({ businessCode: userProfile.businessCode });
  }, [resetBusinessCode, userProfile]);

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    resetBusinessInfo({
      name: restaurant.name,
      managerName: restaurant.managerName,
      phone: restaurant.phone,
      address: restaurant.address,
    });
  }, [resetBusinessInfo, restaurant]);

  const onBusinessCodeSubmit = handleBusinessCodeSubmit(async (values) => {
    if (!firebaseUser) {
      return;
    }

    setBusinessCodeFeedback(null);

    try {
      await updateBusinessCode(firebaseUser.uid, values.businessCode);
      await refreshSession();
      setBusinessCodeFeedback({ type: "success", message: "İşletme kodu güncellendi." });
    } catch (error) {
      setBusinessCodeFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "İşletme kodu güncellenemedi.",
      });
    }
  });

  const onBusinessInfoSubmit = handleBusinessInfoSubmit(async (values) => {
    if (!restaurant?.id) {
      setBusinessInfoFeedback({
        type: "error",
        message: "İşletme kaydı bulunamadı.",
      });
      return;
    }

    setBusinessInfoFeedback(null);

    try {
      await updateRestaurant(restaurant.id, {
        name: values.name,
        managerName: values.managerName,
        phone: values.phone,
        address: values.address,
        isActive: restaurant.isActive,
        tableCount: restaurant.tableCount,
        menuDesign: restaurant.menuDesign,
        socialLinks: restaurant.socialLinks,
      });
      await refreshSession();
      setBusinessInfoFeedback({
        type: "success",
        message: "İşletme bilgileri güncellendi.",
      });
    } catch (error) {
      setBusinessInfoFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "İşletme bilgileri güncellenemedi.",
      });
    }
  });

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold text-slate-900">İşletme Bilgileri</h1>
        <p className="mt-1 text-sm text-slate-600">
          İşletme adını güncellediğinizde public menü slug&apos;ı otomatik yenilenir.
        </p>

        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onBusinessInfoSubmit}>
          <div>
            <Label>İşletme Adı</Label>
            <Input {...registerBusinessInfo("name")} />
            {businessInfoErrors.name ? (
              <p className="mt-1 text-xs text-rose-600">{businessInfoErrors.name.message}</p>
            ) : null}
          </div>
          <div>
            <Label>Yetkili</Label>
            <Input {...registerBusinessInfo("managerName")} />
            {businessInfoErrors.managerName ? (
              <p className="mt-1 text-xs text-rose-600">{businessInfoErrors.managerName.message}</p>
            ) : null}
          </div>
          <div>
            <Label>Telefon</Label>
            <Input {...registerBusinessInfo("phone")} />
            {businessInfoErrors.phone ? (
              <p className="mt-1 text-xs text-rose-600">{businessInfoErrors.phone.message}</p>
            ) : null}
          </div>
          <div className="md:col-span-2">
            <Label>Adres</Label>
            <Textarea {...registerBusinessInfo("address")} />
            {businessInfoErrors.address ? (
              <p className="mt-1 text-xs text-rose-600">{businessInfoErrors.address.message}</p>
            ) : null}
          </div>

          <div className="md:col-span-2 space-y-3">
            {!restaurant ? (
              <Alert variant="info">İşletme kaydı yüklenemediği için güncelleme yapılamıyor.</Alert>
            ) : null}

            {businessInfoFeedback ? (
              <Alert variant={businessInfoFeedback.type}>{businessInfoFeedback.message}</Alert>
            ) : null}

            <Button type="submit" disabled={isBusinessInfoSubmitting || !restaurant}>
              {isBusinessInfoSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Kaydediliyor
                </span>
              ) : (
                "Bilgileri Güncelle"
              )}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-slate-900">Temel Ayarlar</h2>
        <p className="mt-1 text-sm text-slate-600">
          Girişte kullanılan işletme kodunu buradan güncelleyebilirsiniz.
        </p>

        <form className="mt-4 max-w-md space-y-3" onSubmit={onBusinessCodeSubmit}>
          <div>
            <Label>İşletme Kodu</Label>
            <Input {...registerBusinessCode("businessCode")} />
            {businessCodeErrors.businessCode ? (
              <p className="mt-1 text-xs text-rose-600">{businessCodeErrors.businessCode.message}</p>
            ) : null}
          </div>

          {businessCodeFeedback ? <Alert variant={businessCodeFeedback.type}>{businessCodeFeedback.message}</Alert> : null}

          <Button type="submit" disabled={isBusinessCodeSubmitting}>
            {isBusinessCodeSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Kaydediliyor
              </span>
            ) : (
              "Kodu Güncelle"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
