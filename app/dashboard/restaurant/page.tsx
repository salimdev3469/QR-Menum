"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { IMAGE_LIMITS } from "@/lib/constants";
import { buildFloorTableModules } from "@/lib/floor";
import { canUseBrandDesign, getPlanLabel } from "@/lib/plan";
import { restaurantSchema } from "@/lib/validators";
import { useAuth } from "@/hooks/use-auth";
import {
  addGalleryImage,
  deleteGalleryImage,
  listGallery,
  updateRestaurant,
  updateRestaurantGalleryVisibility,
  updateRestaurantImageUrls,
} from "@/services/restaurant-service";
import {
  deleteFileByPath,
  deleteFileByUrl,
  uploadBackground,
  uploadGalleryImage,
} from "@/services/upload-service";

interface GalleryView {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

const defaultValues: RestaurantFormValues = {
  name: "",
  managerName: "",
  phone: "",
  address: "",
  isActive: true,
  plan: "starter",
  tableCount: 0,
  floorCount: 1,
  floorTableCounts: [0],
  menuDesign: {
    primaryColor: "#059669",
    accentColor: "#0ea5e9",
    textColor: "#0f172a",
    backgroundStyle: "light",
  },
  socialLinks: {
    instagram: "",
    facebook: "",
    x: "",
    youtube: "",
    tiktok: "",
  },
};

export default function RestaurantPage() {
  const { restaurant, userProfile, firebaseUser, refreshSession } = useAuth();
  const [profileFeedback, setProfileFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [mediaFeedback, setMediaFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [galleryFeedback, setGalleryFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [removingBackground, setRemovingBackground] = useState(false);
  const [showGalleryOnPublic, setShowGalleryOnPublic] = useState(false);
  const [savingGalleryVisibility, setSavingGalleryVisibility] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [gallery, setGallery] = useState<GalleryView[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    reset({
      name: restaurant.name,
      managerName: restaurant.managerName,
      phone: restaurant.phone,
      address: restaurant.address,
      isActive: restaurant.isActive,
      plan: restaurant.plan,
      tableCount: restaurant.tableCount,
      floorCount: restaurant.floorCount,
      floorTableCounts: restaurant.floorTableCounts,
      menuDesign: restaurant.menuDesign,
      socialLinks: restaurant.socialLinks,
    });
  }, [restaurant, reset]);

  const canUploadGallery = useMemo(() => {
    return gallery.length < IMAGE_LIMITS.MAX_GALLERY_IMAGES;
  }, [gallery.length]);
  const isBrandDesignEnabled = canUseBrandDesign(restaurant?.plan);
  const watchedTableCount = watch("tableCount") || 0;
  const watchedFloorCount = watch("floorCount") || 1;
  const watchedFloorTableCountsRaw = watch("floorTableCounts");
  const watchedFloorTableCounts = useMemo(
    () => (Array.isArray(watchedFloorTableCountsRaw) ? watchedFloorTableCountsRaw : []),
    [watchedFloorTableCountsRaw],
  );
  const normalizedFloorCount = Math.max(1, Math.min(20, Math.floor(watchedFloorCount)));

  useEffect(() => {
    const normalizedCounts = Array.from({ length: normalizedFloorCount }, (_, index) => {
      const rawCount = watchedFloorTableCounts[index];
      if (typeof rawCount !== "number" || !Number.isFinite(rawCount)) {
        return 0;
      }

      return Math.max(0, Math.min(500, Math.floor(rawCount)));
    });

    const requiresFloorCountNormalization = watchedFloorCount !== normalizedFloorCount;
    const requiresFloorTableNormalization = normalizedCounts.some(
      (count, index) => count !== (watchedFloorTableCounts[index] ?? 0),
    ) || watchedFloorTableCounts.length !== normalizedCounts.length;

    if (requiresFloorCountNormalization) {
      setValue("floorCount", normalizedFloorCount, { shouldValidate: true });
    }

    if (requiresFloorTableNormalization) {
      setValue("floorTableCounts", normalizedCounts, { shouldValidate: true });
    }

    const totalTables = normalizedCounts.reduce((sum, count) => sum + count, 0);
    if (watchedTableCount !== totalTables) {
      setValue("tableCount", totalTables, { shouldValidate: true });
    }
  }, [
    normalizedFloorCount,
    setValue,
    watchedFloorCount,
    watchedFloorTableCounts,
    watchedTableCount,
  ]);

  const totalTableCount = useMemo(
    () => watchedFloorTableCounts.reduce((sum, count) => sum + (Number.isFinite(count) ? count : 0), 0),
    [watchedFloorTableCounts],
  );

  const floorModules = useMemo(
    () => buildFloorTableModules(totalTableCount, normalizedFloorCount, watchedFloorTableCounts),
    [normalizedFloorCount, totalTableCount, watchedFloorTableCounts],
  );

  useEffect(() => {
    if (!restaurant?.id) {
      return;
    }

    (async () => {
      const galleryItems = await listGallery(restaurant.id);
      setGallery(galleryItems as GalleryView[]);
    })();
  }, [restaurant?.id]);

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    setShowGalleryOnPublic(restaurant.showGalleryOnPublic === true);
  }, [restaurant]);

  const onSubmit = async (values: RestaurantFormValues) => {
    if (!restaurant?.id) {
      return;
    }

    setProfileFeedback(null);

    try {
      const payload = isBrandDesignEnabled
        ? values
        : {
          ...values,
          menuDesign: restaurant.menuDesign,
        };

      await updateRestaurant(restaurant.id, payload);
      await refreshSession();
      setProfileFeedback({ type: "success", message: "İşletme bilgileri güncellendi." });
    } catch (error) {
      setProfileFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Güncelleme başarısız.",
      });
    }
  };

  const buildStorageDebugSuffix = () => {
    if (process.env.NODE_ENV === "production") {
      return "";
    }

    return ` [debug authUid=${firebaseUser?.uid ?? "null"} restaurantId=${restaurant?.id ?? "null"} profileRestaurantId=${userProfile?.restaurantId ?? "null"} ownerUserId=${restaurant?.ownerUserId ?? "null"}]`;
  };

  const handleBackgroundUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!restaurant?.id || !event.target.files?.[0]) {
      return;
    }

    setUploadingBackground(true);
    setMediaFeedback(null);

    try {
      const result = await uploadBackground(restaurant.id, event.target.files[0]);
      await updateRestaurantImageUrls(restaurant.id, { backgroundImageUrl: result.downloadURL });
      await refreshSession();
      setMediaFeedback({ type: "success", message: "Arka plan görseli güncellendi." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Arka plan yükleme başarısız.";
      setMediaFeedback({
        type: "error",
        message: message.includes("Storage yetkisi reddedildi")
          ? `${message}${buildStorageDebugSuffix()}`
          : message,
      });
    } finally {
      setUploadingBackground(false);
      event.target.value = "";
    }
  };

  const handleDeleteBackground = async () => {
    if (!restaurant?.id || !restaurant.backgroundImageUrl) {
      return;
    }

    setRemovingBackground(true);
    setMediaFeedback(null);

    try {
      try {
        await deleteFileByUrl(restaurant.backgroundImageUrl);
      } catch (error) {
        const errorCode = (error as { code?: string } | null)?.code;
        if (errorCode !== "storage/object-not-found") {
          throw error;
        }
      }

      await updateRestaurantImageUrls(restaurant.id, { backgroundImageUrl: "" });
      await refreshSession();
      setMediaFeedback({ type: "success", message: "Arka plan görseli silindi." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Arka plan görseli silinemedi.";
      setMediaFeedback({
        type: "error",
        message: message.includes("Storage yetkisi reddedildi")
          ? `${message}${buildStorageDebugSuffix()}`
          : message,
      });
    } finally {
      setRemovingBackground(false);
    }
  };

  const handleSaveGalleryVisibility = async () => {
    if (!restaurant?.id) {
      return;
    }

    setSavingGalleryVisibility(true);
    setGalleryFeedback(null);

    try {
      await updateRestaurantGalleryVisibility(restaurant.id, showGalleryOnPublic);
      await refreshSession();
      setGalleryFeedback({
        type: "success",
        message: showGalleryOnPublic
          ? "Galeri public menüde görünür olarak ayarlandı."
          : "Galeri public menüde gizlendi.",
      });
    } catch (error) {
      setGalleryFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Galeri görünürlük ayarı kaydedilemedi.",
      });
    } finally {
      setSavingGalleryVisibility(false);
    }
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!restaurant?.id || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const selected = Array.from(event.target.files);

    if (selected.length + gallery.length > IMAGE_LIMITS.MAX_GALLERY_IMAGES) {
      setGalleryFeedback({
        type: "error",
        message: `Galeri en fazla ${IMAGE_LIMITS.MAX_GALLERY_IMAGES} görsel alabilir.`,
      });
      return;
    }

    setUploadingGallery(true);
    setGalleryFeedback(null);

    try {
      let nextSortOrder = gallery.length + 1;

      for (const file of selected) {
        const imageId = crypto.randomUUID();
        const uploadResult = await uploadGalleryImage(restaurant.id, imageId, file);
        await addGalleryImage(restaurant.id, uploadResult.downloadURL, nextSortOrder, imageId);
        nextSortOrder += 1;
      }

      const galleryItems = await listGallery(restaurant.id);
      setGallery(galleryItems as GalleryView[]);
      setGalleryFeedback({ type: "success", message: "Galeri görselleri güncellendi." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Galeri yükleme başarısız.";
      setGalleryFeedback({
        type: "error",
        message: message.includes("Storage yetkisi reddedildi")
          ? `${message}${buildStorageDebugSuffix()}`
          : message,
      });
    } finally {
      setUploadingGallery(false);
      event.target.value = "";
    }
  };

  const handleDeleteGallery = async (imageId: string) => {
    if (!restaurant?.id) {
      return;
    }

    try {
      await deleteGalleryImage(restaurant.id, imageId);
      await deleteFileByPath(`restaurants/${restaurant.id}/gallery/${imageId}.webp`);
      const galleryItems = await listGallery(restaurant.id);
      setGallery(galleryItems as GalleryView[]);
      setGalleryFeedback({ type: "success", message: "Galeri görseli silindi." });
    } catch (error) {
      setGalleryFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Galeri görseli silinemedi.",
      });
    }
  };

  if (!restaurant) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold text-slate-900">İşletme Profili</h1>
        <p className="mt-1 text-sm text-slate-600">
          İşletme adını güncellediğinizde public slug otomatik yenilenir.
        </p>

        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>İşletme Adı</Label>
            <Input {...register("name")} />
            {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
          </div>
          <div>
            <Label>Yetkili</Label>
            <Input {...register("managerName")} />
            {errors.managerName ? (
              <p className="mt-1 text-xs text-rose-600">{errors.managerName.message}</p>
            ) : null}
          </div>
          <div>
            <Label>Telefon</Label>
            <Input {...register("phone")} />
            {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p> : null}
          </div>
          <div>
            <Label>Paket</Label>
            <Input value={getPlanLabel(restaurant.plan)} disabled readOnly />
            <p className="mt-1 text-xs text-slate-500">
              Paket değişikliği yalnızca admin panelinden yapılır.
            </p>
          </div>
          <div>
            <Label>Masa Sayısı (Toplam)</Label>
            <Input type="number" min={0} max={500} {...register("tableCount", { valueAsNumber: true })} readOnly />
            <p className="mt-1 text-xs text-slate-500">Toplam, kat dağılımına göre otomatik hesaplanır.</p>
            {errors.tableCount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.tableCount.message}</p>
            ) : null}
          </div>
          <div>
            <Label>Kat Sayısı</Label>
            <Input type="number" min={1} max={20} {...register("floorCount", { valueAsNumber: true })} />
            {errors.floorCount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.floorCount.message}</p>
            ) : null}
          </div>
          <div className="flex items-end gap-2 pb-1">
            <input id="isActive" type="checkbox" className="h-4 w-4" {...register("isActive")} />
            <Label className="mb-0" htmlFor="isActive">
              İşletme aktif
            </Label>
          </div>
          <div className="md:col-span-2">
            <Label>Adres</Label>
            <Textarea {...register("address")} />
            {errors.address ? <p className="mt-1 text-xs text-rose-600">{errors.address.message}</p> : null}
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-200 p-3">
            <h2 className="text-sm font-semibold text-slate-900">Kat Modülü</h2>
            <p className="mt-1 text-xs text-slate-500">
              Her kat için masa adedini ayrı belirleyin.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {Array.from({ length: normalizedFloorCount }, (_, index) => (
                <div key={`floor-count-${index + 1}`}>
                  <Label>Kat {index + 1} Masa Adedi</Label>
                  <Input
                    type="number"
                    min={0}
                    max={500}
                    {...register(`floorTableCounts.${index}` as const, { valueAsNumber: true })}
                  />
                </div>
              ))}
            </div>
            {errors.floorTableCounts ? (
              <p className="mt-2 text-xs text-rose-600">
                {errors.floorTableCounts.message}
              </p>
            ) : null}
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {floorModules.map((module) => (
                <div key={module.floorNumber} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <p className="text-xs font-semibold text-slate-600">Kat {module.floorNumber}</p>
                  <p className="mt-1 text-sm text-slate-800">
                    {module.tableCount > 0
                      ? `Masa ${module.startTableNumber}-${module.endTableNumber}`
                      : "Masa yok"}
                  </p>
                  <p className="text-xs text-slate-500">Toplam: {module.tableCount}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-200 p-3">
            <h2 className="text-sm font-semibold text-slate-900">Menü Tasarımı (Marka Uyumlu)</h2>
            <p className="mt-1 text-xs text-slate-500">
              Public menüde kullanılacak renk ve görünüm ayarlarını belirleyin.
            </p>
            {!isBrandDesignEnabled ? (
              <div className="mt-3">
                <Alert variant="info">
                  Marka uyumlu tasarım alanı Growth ve Premium paketlerde düzenlenebilir.
                </Alert>
              </div>
            ) : null}
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <Label>Ana Renk</Label>
                <Input
                  type="color"
                  className="h-10 p-1"
                  {...register("menuDesign.primaryColor")}
                  disabled={!isBrandDesignEnabled}
                />
              </div>
              <div>
                <Label>Vurgu Rengi</Label>
                <Input
                  type="color"
                  className="h-10 p-1"
                  {...register("menuDesign.accentColor")}
                  disabled={!isBrandDesignEnabled}
                />
              </div>
              <div>
                <Label>Metin Rengi</Label>
                <Input
                  type="color"
                  className="h-10 p-1"
                  {...register("menuDesign.textColor")}
                  disabled={!isBrandDesignEnabled}
                />
              </div>
              <div>
                <Label>Arka Plan Stili</Label>
                <Select {...register("menuDesign.backgroundStyle")} disabled={!isBrandDesignEnabled}>
                  <option value="light">Açık</option>
                  <option value="dark">Koyu</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-200 p-3">
            <h2 className="text-sm font-semibold text-slate-900">Sosyal Medya Etkileşimi</h2>
            <p className="mt-1 text-xs text-slate-500">
              Public menüde görünmesini istediğiniz sosyal medya linklerini ekleyin.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <Label>Instagram</Label>
                <Input placeholder="https://instagram.com/..." {...register("socialLinks.instagram")} />
              </div>
              <div>
                <Label>Facebook</Label>
                <Input placeholder="https://facebook.com/..." {...register("socialLinks.facebook")} />
              </div>
              <div>
                <Label>X (Twitter)</Label>
                <Input placeholder="https://x.com/..." {...register("socialLinks.x")} />
              </div>
              <div>
                <Label>YouTube</Label>
                <Input placeholder="https://youtube.com/..." {...register("socialLinks.youtube")} />
              </div>
              <div className="md:col-span-2">
                <Label>TikTok</Label>
                <Input placeholder="https://tiktok.com/..." {...register("socialLinks.tiktok")} />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 text-xs text-slate-500">
            Yeni slug önizleme: <span className="font-semibold">{watch("name")}</span>
          </div>

          {profileFeedback ? (
            <div className="md:col-span-2">
              <Alert variant={profileFeedback.type}>{profileFeedback.message}</Alert>
            </div>
          ) : null}

          <div className="md:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
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
        <h2 className="text-lg font-semibold text-slate-900">Arka Plan</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Arka Plan Yükle</Label>
            <FileInput accept="image/*" onChange={handleBackgroundUpload} />
            {uploadingBackground ? <p className="text-sm text-slate-500">Arka plan yükleniyor...</p> : null}
            {restaurant.backgroundImageUrl ? (
              <>
                <img
                  src={restaurant.backgroundImageUrl}
                  alt="Arka plan"
                  className="h-24 w-full rounded-xl border border-slate-200 object-cover"
                />
                <Button
                  type="button"
                  variant="danger"
                  className="h-9"
                  onClick={handleDeleteBackground}
                  disabled={uploadingBackground || removingBackground}
                >
                  {removingBackground ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner /> Siliniyor
                    </span>
                  ) : (
                    "Arka Planı Sil"
                  )}
                </Button>
              </>
            ) : null}
          </div>
        </div>

        {mediaFeedback ? (
          <div className="mt-3">
            <Alert variant={mediaFeedback.type}>{mediaFeedback.message}</Alert>
          </div>
        ) : null}
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Galeri Görselleri</h2>
            <p className="text-sm text-slate-600">
              Maksimum {IMAGE_LIMITS.MAX_GALLERY_IMAGES} görsel yükleyebilirsiniz.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <input
                id="showGalleryOnPublic"
                type="checkbox"
                className="h-4 w-4"
                checked={showGalleryOnPublic}
                onChange={(event) => setShowGalleryOnPublic(event.target.checked)}
              />
              <Label className="mb-0" htmlFor="showGalleryOnPublic">
                Public menüde galeriyi göster
              </Label>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Kapalıysa yüklenen galeri görselleri public menüde görüntülenmez.
            </p>
            <div className="mt-3">
              <Button
                type="button"
                variant="secondary"
                className="h-9"
                onClick={handleSaveGalleryVisibility}
                disabled={savingGalleryVisibility || showGalleryOnPublic === restaurant.showGalleryOnPublic}
              >
                {savingGalleryVisibility ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner /> Kaydediliyor
                  </span>
                ) : (
                  "Görünürlük Ayarını Kaydet"
                )}
              </Button>
            </div>
          </div>

          <FileInput
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            className={!canUploadGallery ? "opacity-60" : ""}
          />
          {uploadingGallery ? <p className="text-sm text-slate-500">Galeri yükleniyor...</p> : null}
          {galleryFeedback ? <Alert variant={galleryFeedback.type}>{galleryFeedback.message}</Alert> : null}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-2">
                <img
                  src={item.imageUrl}
                  alt="Galeri görseli"
                  className="h-28 w-full rounded-lg object-cover"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">#{item.sortOrder}</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-rose-600 hover:underline"
                    onClick={() => handleDeleteGallery(item.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
