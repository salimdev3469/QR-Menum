"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SortableList } from "@/components/dashboard/sortable-list";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { categorySchema } from "@/lib/validators";
import { useAuth } from "@/hooks/use-auth";
import {
  archiveCategory,
  createCategory,
  deleteCategoryPermanent,
  listCategories,
  reorderCategories,
  restoreCategory,
  updateCategory,
} from "@/services/category-service";
import { Category } from "@/types";

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const { restaurant } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      sortOrder: 1,
      isActive: true,
    },
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      sortOrder: 1,
      isActive: true,
    },
  });

  const load = async () => {
    if (!restaurant?.id) {
      return;
    }

    setLoading(true);
    const list = await listCategories(restaurant.id);
    setCategories(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant?.id]);

  const activeCategories = useMemo(
    () => categories.filter((item) => !item.isArchived),
    [categories],
  );

  const archivedCategories = useMemo(
    () => categories.filter((item) => item.isArchived),
    [categories],
  );

  const onCreate = createForm.handleSubmit(async (values) => {
    if (!restaurant?.id) {
      return;
    }

    try {
      await createCategory(restaurant.id, values);
      createForm.reset({ name: "", sortOrder: activeCategories.length + 2, isActive: true });
      await load();
      setFeedback({ type: "success", message: "Kategori eklendi." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Kategori eklenemedi.",
      });
    }
  });

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    editForm.reset({
      name: category.name,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
  };

  const onEdit = editForm.handleSubmit(async (values) => {
    if (!restaurant?.id || !editingId) {
      return;
    }

    try {
      await updateCategory(restaurant.id, editingId, values);
      setEditingId(null);
      await load();
      setFeedback({ type: "success", message: "Kategori güncellendi." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Kategori güncellenemedi.",
      });
    }
  });

  const handleArchive = async (categoryId: string) => {
    if (!restaurant?.id) {
      return;
    }

    await archiveCategory(restaurant.id, categoryId);
    await load();
    setFeedback({ type: "success", message: "Kategori arşivlendi." });
  };

  const handleRestore = async (categoryId: string) => {
    if (!restaurant?.id) {
      return;
    }

    await restoreCategory(restaurant.id, categoryId);
    await load();
    setFeedback({ type: "success", message: "Kategori arşivden çıkarıldı." });
  };

  const handleDelete = async (categoryId: string) => {
    if (!restaurant?.id) {
      return;
    }

    try {
      await deleteCategoryPermanent(restaurant.id, categoryId);
      await load();
      setFeedback({ type: "success", message: "Kategori kalıcı olarak silindi." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Kategori silinemedi.",
      });
    }
  };

  const handleReorder = async (ids: string[]) => {
    if (!restaurant?.id) {
      return;
    }

    await reorderCategories(restaurant.id, ids);
    await load();
  };

  if (!restaurant) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold text-slate-900">Kategori Yönetimi</h1>
        <p className="mt-1 text-sm text-slate-600">Kategori ekle, düzenle, arşivle veya kalıcı sil.</p>

        <form className="mt-4 grid gap-3 md:grid-cols-4" onSubmit={onCreate}>
          <div className="md:col-span-2">
            <Label>Kategori adı</Label>
            <Input {...createForm.register("name")} />
            {createForm.formState.errors.name ? (
              <p className="mt-1 text-xs text-rose-600">{createForm.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div>
            <Label>Sıra</Label>
            <Input type="number" {...createForm.register("sortOrder", { valueAsNumber: true })} />
          </div>
          <div className="flex items-end gap-2 pb-1">
            <input type="checkbox" className="h-4 w-4" {...createForm.register("isActive")} />
            <Label className="mb-0">Aktif</Label>
          </div>
          <div className="md:col-span-4">
            <Button type="submit" disabled={createForm.formState.isSubmitting}>
              {createForm.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Ekleniyor
                </span>
              ) : (
                "Kategori Ekle"
              )}
            </Button>
          </div>
        </form>

        {feedback ? (
          <div className="mt-3">
            <Alert variant={feedback.type}>{feedback.message}</Alert>
          </div>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Aktif Kategoriler</h2>
        <p className="mt-1 text-sm text-slate-600">Sürükle-bırak ile sıralayabilir veya sıra değerini düzenleyebilirsiniz.</p>

        {loading ? (
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
            <Spinner /> Kategoriler yükleniyor...
          </div>
        ) : activeCategories.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Henüz kategori yok.</p>
        ) : (
          <div className="mt-4 space-y-3">
            <SortableList
              items={activeCategories.map((item) => ({
                id: item.id,
                label: item.name,
                rightText: `#${item.sortOrder}`,
              }))}
              onReorder={handleReorder}
            />

            <div className="space-y-2">
              {activeCategories.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  {editingId === item.id ? (
                    <form className="grid gap-2 md:grid-cols-4" onSubmit={onEdit}>
                      <Input {...editForm.register("name")} />
                      <Input type="number" {...editForm.register("sortOrder", { valueAsNumber: true })} />
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input type="checkbox" {...editForm.register("isActive")} /> Aktif
                      </label>
                      <div className="flex gap-2">
                        <Button type="submit" className="h-9">
                          Kaydet
                        </Button>
                        <Button type="button" className="h-9" variant="secondary" onClick={() => setEditingId(null)}>
                          İptal
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          Sıra: {item.sortOrder} • Durum: {item.isActive ? "Aktif" : "Pasif"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="secondary" className="h-8 px-3" onClick={() => startEdit(item)}>
                          Düzenle
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 px-3 text-amber-700"
                          onClick={() => handleArchive(item.id)}
                        >
                          Arşivle
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 px-3 text-rose-700"
                          onClick={() => handleDelete(item.id)}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Arşivlenmiş Kategoriler</h2>

        {archivedCategories.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Arşivde kategori yok.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {archivedCategories.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
              >
                <p className="text-sm font-medium text-slate-800">{item.name}</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-3"
                    onClick={() => handleRestore(item.id)}
                  >
                    Geri Al
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    className="h-8 px-3"
                    onClick={() => handleDelete(item.id)}
                  >
                    Kalıcı Sil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
