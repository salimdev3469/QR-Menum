"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import { canUsePromotions } from "@/lib/plan";
import { promotionSchema } from "@/lib/validators";
import { useAuth } from "@/hooks/use-auth";
import { listCategories } from "@/services/category-service";
import { listMenuItems } from "@/services/menu-service";
import {
  createPromotion,
  deletePromotionPermanent,
  listPromotions,
  setPromotionActiveState,
  updatePromotion,
} from "@/services/promotion-service";
import { Category, MenuItem, Promotion } from "@/types";

type PromotionFormValues = z.infer<typeof promotionSchema>;

const defaultValues: PromotionFormValues = {
  title: "",
  description: "",
  scope: "all",
  targetId: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
};

export default function PromotionsPage() {
  const { restaurant } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
  });
  const isPromotionFeatureEnabled = canUsePromotions(restaurant?.plan);

  const scope = form.watch("scope");

  const categoryLabelMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});
  }, [categories]);

  const menuItemLabelMap = useMemo(() => {
    return menuItems.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});
  }, [menuItems]);

  const load = async () => {
    if (!restaurant?.id) {
      return;
    }

    if (!isPromotionFeatureEnabled) {
      setPromotions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const [categoryList, itemList, promotionList] = await Promise.all([
      listCategories(restaurant.id),
      listMenuItems(restaurant.id),
      listPromotions(restaurant.id),
    ]);

    setCategories(categoryList.filter((item) => !item.isArchived));
    setMenuItems(itemList.filter((item) => !item.isArchived));
    setPromotions(promotionList.filter((item) => !item.isArchived));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant?.id, isPromotionFeatureEnabled]);

  const resetForm = () => {
    form.reset(defaultValues);
    setEditingId(null);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!restaurant?.id || !isPromotionFeatureEnabled) {
      return;
    }

    setFeedback(null);

    try {
      if (editingId) {
        await updatePromotion(restaurant.id, editingId, {
          ...values,
          targetId: values.scope === "all" ? null : values.targetId,
        });
      } else {
        await createPromotion(restaurant.id, {
          ...values,
          targetId: values.scope === "all" ? null : values.targetId,
        });
      }

      await load();
      resetForm();
      setFeedback({
        type: "success",
        message: editingId ? "Promosyon güncellendi." : "Promosyon eklendi.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Promosyon kaydedilemedi.",
      });
    }
  });

  const startEdit = (promotion: Promotion) => {
    setEditingId(promotion.id);
    form.reset({
      title: promotion.title,
      description: promotion.description,
      scope: promotion.scope,
      targetId: promotion.targetId ?? "",
      startsAt: promotion.startsAt ?? "",
      endsAt: promotion.endsAt ?? "",
      isActive: promotion.isActive,
    });
  };

  const handleToggleActive = async (promotion: Promotion) => {
    if (!restaurant?.id || !isPromotionFeatureEnabled) {
      return;
    }

    try {
      await setPromotionActiveState(restaurant.id, promotion.id, !promotion.isActive);
      await load();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Durum güncellenemedi.",
      });
    }
  };

  const handleDelete = async (promotionId: string) => {
    if (!restaurant?.id || !isPromotionFeatureEnabled) {
      return;
    }

    const confirmed = window.confirm("Bu promosyon kalıcı olarak silinsin mi?");
    if (!confirmed) {
      return;
    }

    try {
      await deletePromotionPermanent(restaurant.id, promotionId);
      if (editingId === promotionId) {
        resetForm();
      }
      await load();
      setFeedback({ type: "success", message: "Promosyon silindi." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Promosyon silinemedi.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold text-slate-900">Promosyon ve Kampanya Yönetimi</h1>
        <p className="mt-1 text-sm text-slate-600">
          Zaman aralığına göre kampanya çıkarabilir, kategori veya ürün bazında gösterebilirsiniz.
        </p>

        {!isPromotionFeatureEnabled ? (
          <div className="mt-4 space-y-3">
            <Alert variant="info">
              Promosyon yönetimi yalnızca Premium pakette aktiftir.
            </Alert>
            <Link
              href="/purchase?plan=Premium"
              className="inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Premium Talebi Oluştur
            </Link>
          </div>
        ) : null}

        {isPromotionFeatureEnabled ? (
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
          <div>
            <Label>Başlık</Label>
            <Input {...form.register("title")} />
            {form.formState.errors.title ? (
              <p className="mt-1 text-xs text-rose-600">{form.formState.errors.title.message}</p>
            ) : null}
          </div>
          <div>
            <Label>Hedef</Label>
            <Select {...form.register("scope")}>
              <option value="all">Tüm Menü</option>
              <option value="category">Kategori Bazlı</option>
              <option value="menuItem">Ürün Bazlı</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Açıklama</Label>
            <Textarea {...form.register("description")} />
            {form.formState.errors.description ? (
              <p className="mt-1 text-xs text-rose-600">{form.formState.errors.description.message}</p>
            ) : null}
          </div>

          {scope === "category" ? (
            <div>
              <Label>Kategori Seç</Label>
              <Select {...form.register("targetId")}>
                <option value="">Kategori seçin</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
              {form.formState.errors.targetId ? (
                <p className="mt-1 text-xs text-rose-600">{form.formState.errors.targetId.message}</p>
              ) : null}
            </div>
          ) : null}

          {scope === "menuItem" ? (
            <div>
              <Label>Ürün Seç</Label>
              <Select {...form.register("targetId")}>
                <option value="">Ürün seçin</option>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
              {form.formState.errors.targetId ? (
                <p className="mt-1 text-xs text-rose-600">{form.formState.errors.targetId.message}</p>
              ) : null}
            </div>
          ) : null}

          <div>
            <Label>Başlangıç</Label>
            <Input type="datetime-local" {...form.register("startsAt")} />
          </div>
          <div>
            <Label>Bitiş</Label>
            <Input type="datetime-local" {...form.register("endsAt")} />
            {form.formState.errors.endsAt ? (
              <p className="mt-1 text-xs text-rose-600">{form.formState.errors.endsAt.message}</p>
            ) : null}
          </div>
          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" {...form.register("isActive")} /> Promosyon aktif
            </label>
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Kaydediliyor
                </span>
              ) : editingId ? (
                "Promosyonu Güncelle"
              ) : (
                "Promosyon Ekle"
              )}
            </Button>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Düzenlemeyi İptal Et
              </Button>
            ) : null}
          </div>
          </form>
        ) : null}

        {feedback ? (
          <div className="mt-3">
            <Alert variant={feedback.type}>{feedback.message}</Alert>
          </div>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Tanımlı Promosyonlar</h2>

        {!isPromotionFeatureEnabled ? (
          <p className="mt-3 text-sm text-slate-500">Bu modül mevcut paketinizde kapalı.</p>
        ) : loading ? (
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
            <Spinner /> Promosyonlar yükleniyor...
          </div>
        ) : promotions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Henüz promosyon yok.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {promotions.map((promotion) => (
              <article
                key={promotion.id}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{promotion.title}</p>
                    <p className="text-xs text-slate-500">{promotion.description}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Hedef:{" "}
                      {promotion.scope === "all"
                        ? "Tüm Menü"
                        : promotion.scope === "category"
                          ? `Kategori - ${categoryLabelMap[promotion.targetId ?? ""] ?? "-"}`
                          : `Ürün - ${menuItemLabelMap[promotion.targetId ?? ""] ?? "-"}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      Zaman: {promotion.startsAt ? formatDate(promotion.startsAt) : "Hemen"} -{" "}
                      {promotion.endsAt ? formatDate(promotion.endsAt) : "Süresiz"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-8 px-3"
                      onClick={() => startEdit(promotion)}
                    >
                      Düzenle
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-3 text-slate-700"
                      onClick={() => handleToggleActive(promotion)}
                    >
                      {promotion.isActive ? "Pasife Al" : "Aktifleştir"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-3 text-rose-700"
                      onClick={() => handleDelete(promotion.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
