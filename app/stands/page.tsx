"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { STAND_UNIT_PRICE } from "@/lib/stand-pricing";
import { Textarea } from "@/components/ui/textarea";
import { standOrderSchema } from "@/lib/validators";
import { createStandOrder } from "@/services/stand-order-service";
import { uploadStandOrderDesign } from "@/services/upload-service";

const designPresets = [
  "Minimal Beyaz",
  "Siyah Premium",
  "Ahşap Efekt",
  "Marka Renkli",
];

type StandOrderValues = z.infer<typeof standOrderSchema>;

export default function StandsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StandOrderValues>({
    resolver: zodResolver(standOrderSchema),
    defaultValues: {
      customerName: "",
      businessName: "",
      email: "",
      phone: "",
      tableCount: 10,
      designType: "preset",
      designPreset: designPresets[0],
      note: "",
    },
  });

  const tableCount = watch("tableCount") || 0;
  const designType = watch("designType");
  const totalPrice = useMemo(() => Math.max(0, tableCount) * STAND_UNIT_PRICE, [tableCount]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
  };

  const onSubmit = handleSubmit(async (values) => {
    setFeedback(null);

    if (values.designType === "upload" && !file) {
      setFeedback({ type: "error", message: "Yüklemeli tasarım için bir görsel seçmelisiniz." });
      return;
    }

    try {
      const orderId = crypto.randomUUID();
      let designUploadUrl = "";

      if (values.designType === "upload" && file) {
        const uploaded = await uploadStandOrderDesign(orderId, file);
        designUploadUrl = uploaded.downloadURL;
      }

      await createStandOrder({
        orderId,
        customerName: values.customerName,
        businessName: values.businessName,
        email: values.email,
        phone: values.phone,
        tableCount: values.tableCount,
        designType: values.designType,
        designPreset: values.designType === "preset" ? values.designPreset : null,
        designUploadUrl,
        note: values.note,
      });

      reset({
        customerName: "",
        businessName: "",
        email: "",
        phone: "",
        tableCount: 10,
        designType: "preset",
        designPreset: designPresets[0],
        note: "",
      });
      setFile(null);
      setFeedback({
        type: "success",
        message: "Stant siparişiniz alındı. Ekibimiz kısa sürede sizinle iletişime geçecek.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Sipariş gönderilemedi.",
      });
    }
  });

  return (
    <MarketingPageShell>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h1 className="text-2xl font-bold text-slate-900">QR Menüm Stant Siparişi</h1>
          <p className="mt-1 text-sm text-slate-600">
            Stant başı fiyat ₺{STAND_UNIT_PRICE}. Masa sayınızı girin, tasarımı seçin veya kendi görselinizi yükleyin.
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
              <Label>Masa Sayısı</Label>
              <Input type="number" {...register("tableCount", { valueAsNumber: true })} />
              {errors.tableCount ? (
                <p className="mt-1 text-xs text-rose-600">{errors.tableCount.message}</p>
              ) : null}
            </div>
            <div>
              <Label>Tasarım Türü</Label>
              <Select {...register("designType")}>
                <option value="preset">Hazır Tasarım Seç</option>
                <option value="upload">Kendi Tasarımımı Yükle</option>
              </Select>
            </div>

            {designType === "preset" ? (
              <div className="md:col-span-2">
                <Label>Hazır Tasarım</Label>
                <Select {...register("designPreset")}>
                  {designPresets.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </Select>
                {errors.designPreset ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.designPreset.message}</p>
                ) : null}
              </div>
            ) : (
              <div className="md:col-span-2">
                <Label>Tasarım Dosyası</Label>
                <FileInput accept="image/*" onChange={handleFileChange} />
                <p className="mt-1 text-xs text-slate-500">Görseliniz otomatik sıkıştırılarak yüklenir.</p>
                {file ? <p className="mt-1 text-xs text-slate-500">Seçilen: {file.name}</p> : null}
              </div>
            )}

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
                    <Spinner /> Sipariş gönderiliyor
                  </span>
                ) : (
                  "Siparişi Gönder"
                )}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="h-fit space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <Image
              src="/qr_stand.png"
              alt="QR menü stand örneği"
              width={1122}
              height={1402}
              className="h-auto w-full object-cover"
            />
          </div>

          <h2 className="text-lg font-bold text-slate-900">Sipariş Özeti</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Birim fiyat:</span> ₺{STAND_UNIT_PRICE}
            </p>
            <p>
              <span className="font-semibold">Masa sayısı:</span> {tableCount}
            </p>
            <p className="text-base">
              <span className="font-semibold">Toplam:</span>{" "}
              <span className="font-bold text-slate-900">₺{totalPrice.toLocaleString("tr-TR")}</span>
            </p>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Sipariş admin paneline düşer; üretim ve kargo durumunu ekip tarafı takip eder.
          </p>
        </Card>
      </div>
    </MarketingPageShell>
  );
}
