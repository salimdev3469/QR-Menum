"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { SortableList } from "@/components/dashboard/sortable-list";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { IMAGE_LIMITS } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { PRESET_ALLERGENS, PRESET_PRODUCT_LABELS } from "@/lib/menu-features";
import { canUseVariations } from "@/lib/plan";
import { menuItemSchema } from "@/lib/validators";
import { useAuth } from "@/hooks/use-auth";
import { listCategories } from "@/services/category-service";
import {
  archiveMenuItem,
  createMenuItem,
  deleteMenuItemPermanent,
  listMenuItems,
  reorderMenuItems,
  restoreMenuItem,
  updateMenuItem,
} from "@/services/menu-service";
import { deleteFilesByUrls, uploadMenuItemImage } from "@/services/upload-service";
import { Category, MenuItem } from "@/types";

type MenuItemFormValues = z.infer<typeof menuItemSchema>;
type TokenField = "labels" | "allergens";
type VariationArrayController = { replace: (value: MenuItemFormValues["variations"]) => void };

const defaultMenuItemValues: MenuItemFormValues = {
  categoryId: "",
  name: "",
  description: "",
  price: 0,
  discountPrice: null,
  isDiscounted: false,
  isAvailable: true,
  sortOrder: 1,
  labels: [],
  allergens: [],
  variations: [],
};

function variationDraft(isFirst: boolean, sortOrder: number) {
  return {
    id: crypto.randomUUID(),
    name: "",
    price: 0,
    isDefault: isFirst,
    isAvailable: true,
    sortOrder,
  };
}

export default function MenuPage() {
  const { restaurant, userProfile, firebaseUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createFiles, setCreateFiles] = useState<File[]>([]);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
  const [initialEditImageUrls, setInitialEditImageUrls] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [createLabelInput, setCreateLabelInput] = useState("");
  const [createAllergenInput, setCreateAllergenInput] = useState("");
  const [editLabelInput, setEditLabelInput] = useState("");
  const [editAllergenInput, setEditAllergenInput] = useState("");

  const createForm = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: defaultMenuItemValues,
  });

  const editForm = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: defaultMenuItemValues,
  });

  const createVariationFields = useFieldArray({
    control: createForm.control,
    name: "variations",
  });

  const editVariationFields = useFieldArray({
    control: editForm.control,
    name: "variations",
  });

  const load = async () => {
    if (!restaurant?.id) {
      return;
    }

    setLoading(true);

    const [categoriesList, menuList] = await Promise.all([
      listCategories(restaurant.id),
      listMenuItems(restaurant.id),
    ]);

    const activeCategories = categoriesList.filter((item) => !item.isArchived);
    setCategories(activeCategories);
    setMenuItems(menuList);

    if (activeCategories.length > 0 && !createForm.getValues("categoryId")) {
      createForm.setValue("categoryId", activeCategories[0].id);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant?.id]);

  const activeItems = useMemo(
    () => menuItems.filter((item) => !item.isArchived),
    [menuItems],
  );

  const archivedItems = useMemo(
    () => menuItems.filter((item) => item.isArchived),
    [menuItems],
  );
  const isVariationFeatureEnabled = canUseVariations(restaurant?.plan);

  const categoryLabelMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});
  }, [categories]);

  const filteredActiveItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return activeItems.filter((item) => {
      const categoryMatch =
        categoryFilter === "all" ? true : item.categoryId === categoryFilter;
      const textMatch =
        normalizedSearch.length === 0
          ? true
          : item.name.toLowerCase().includes(normalizedSearch) ||
            item.description.toLowerCase().includes(normalizedSearch);

      return categoryMatch && textMatch;
    });
  }, [activeItems, categoryFilter, searchTerm]);

  const isFilteringActiveItems = useMemo(
    () => searchTerm.trim().length > 0 || categoryFilter !== "all",
    [categoryFilter, searchTerm],
  );

  const resetEditingState = () => {
    setEditingId(null);
    setEditFiles([]);
    setEditImageUrls([]);
    setInitialEditImageUrls([]);
    setEditLabelInput("");
    setEditAllergenInput("");
    editForm.reset(defaultMenuItemValues);
  };

  const buildStorageDebugSuffix = () => {
    if (process.env.NODE_ENV === "production") {
      return "";
    }

    return ` [debug authUid=${firebaseUser?.uid ?? "null"} restaurantId=${restaurant?.id ?? "null"} profileRestaurantId=${userProfile?.restaurantId ?? "null"} ownerUserId=${restaurant?.ownerUserId ?? "null"}]`;
  };

  const handleCreateFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCreateFiles(Array.from(event.target.files ?? []));
  };

  const handleEditFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditFiles(Array.from(event.target.files ?? []));
  };

  const toggleToken = (
    form: typeof createForm | typeof editForm,
    field: TokenField,
    value: string,
    max: number,
  ) => {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }

    const current = form.getValues(field);
    const exists = current.includes(normalized);
    const next = exists
      ? current.filter((item) => item !== normalized)
      : [...current, normalized].slice(0, max);

    form.setValue(field, next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const addCustomToken = (
    form: typeof createForm | typeof editForm,
    field: TokenField,
    rawValue: string,
    setter: (value: string) => void,
    max: number,
  ) => {
    const value = rawValue.trim();
    if (!value) {
      return;
    }

    const current = form.getValues(field);
    if (!current.includes(value) && current.length < max) {
      form.setValue(field, [...current, value], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    setter("");
  };

  const markDefaultVariation = (
    form: typeof createForm | typeof editForm,
    index: number,
    fields: VariationArrayController,
  ) => {
    const values = form.getValues("variations").map((item, itemIndex) => ({
      ...item,
      isDefault: itemIndex === index,
      sortOrder: itemIndex + 1,
    }));
    form.setValue("variations", values, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    fields.replace(values);
  };

  const removeVariation = (
    form: typeof createForm | typeof editForm,
    fields: VariationArrayController,
    index: number,
  ) => {
    const current = form.getValues("variations");
    const removedDefault = current[index]?.isDefault;
    const next = current
      .filter((_, itemIndex) => itemIndex !== index)
      .map((item, itemIndex) => ({ ...item, sortOrder: itemIndex + 1 }));

    if (removedDefault && next.length > 0) {
      next[0].isDefault = true;
    }

    form.setValue("variations", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    fields.replace(next);
  };

  const onCreate = createForm.handleSubmit(async (values) => {
    if (!restaurant?.id) {
      return;
    }

    if (createFiles.length > IMAGE_LIMITS.MAX_PRODUCT_IMAGES) {
      setFeedback({
        type: "error",
        message: `Bir ürün için en fazla ${IMAGE_LIMITS.MAX_PRODUCT_IMAGES} görsel yükleyebilirsiniz.`,
      });
      return;
    }

    if (categories.length === 0) {
      setFeedback({
        type: "error",
        message: "Ürün eklemek için önce en az bir kategori oluşturmalısınız.",
      });
      return;
    }

    const menuItemId = crypto.randomUUID();
    const imageUrls: string[] = [];

    try {
      const normalizedDiscountPrice = values.isDiscounted
        ? (values.discountPrice ?? null)
        : null;

      for (const file of createFiles) {
        const imageId = crypto.randomUUID();
        const uploadResult = await uploadMenuItemImage(restaurant.id, menuItemId, imageId, file);
        imageUrls.push(uploadResult.downloadURL);
      }

      await createMenuItem(
        restaurant.id,
        {
          ...values,
          discountPrice: normalizedDiscountPrice,
          variations: isVariationFeatureEnabled ? values.variations : [],
          imageUrls,
        },
        menuItemId,
      );

      createForm.reset({
        ...defaultMenuItemValues,
        categoryId: categories[0]?.id ?? "",
        sortOrder: activeItems.length + 2,
      });
      createVariationFields.replace([]);
      setCreateFiles([]);
      setCreateLabelInput("");
      setCreateAllergenInput("");
      await load();
      setFeedback({ type: "success", message: "Ürün eklendi." });
    } catch (error) {
      await deleteFilesByUrls(imageUrls);
      const message = error instanceof Error ? error.message : "Ürün eklenemedi.";
      setFeedback({
        type: "error",
        message: message.includes("Storage yetkisi reddedildi")
          ? `${message}${buildStorageDebugSuffix()}`
          : message,
      });
    }
  });

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditFiles([]);
    setEditImageUrls(item.imageUrls ?? []);
    setInitialEditImageUrls(item.imageUrls ?? []);
    setEditLabelInput("");
    setEditAllergenInput("");
    const nextValues: MenuItemFormValues = {
      categoryId: item.categoryId,
      name: item.name,
      description: item.description,
      price: item.price,
      discountPrice: item.discountPrice,
      isDiscounted: item.isDiscounted,
      isAvailable: item.isAvailable,
      sortOrder: item.sortOrder,
      labels: item.labels ?? [],
      allergens: item.allergens ?? [],
      variations: (item.variations ?? []).map((variation, index) => ({
        ...variation,
        sortOrder: index + 1,
      })),
    };
    editForm.reset(nextValues);
    editVariationFields.replace(nextValues.variations);
  };

  const onEdit = editForm.handleSubmit(async (values) => {
    if (!restaurant?.id || !editingId) {
      return;
    }

    if (editImageUrls.length + editFiles.length > IMAGE_LIMITS.MAX_PRODUCT_IMAGES) {
      setFeedback({
        type: "error",
        message: `Bir ürün için en fazla ${IMAGE_LIMITS.MAX_PRODUCT_IMAGES} görsel olabilir.`,
      });
      return;
    }

    const newlyUploadedUrls: string[] = [];
    const existingItem = menuItems.find((item) => item.id === editingId);

    try {
      const uploadedUrls = [...editImageUrls];
      const normalizedDiscountPrice = values.isDiscounted
        ? (values.discountPrice ?? null)
        : null;
      const removedImageUrls = initialEditImageUrls.filter(
        (url) => !editImageUrls.includes(url),
      );

      for (const file of editFiles) {
        const imageId = crypto.randomUUID();
        const uploadResult = await uploadMenuItemImage(restaurant.id, editingId, imageId, file);
        newlyUploadedUrls.push(uploadResult.downloadURL);
        uploadedUrls.push(uploadResult.downloadURL);
      }

      await updateMenuItem(restaurant.id, editingId, {
        ...values,
        discountPrice: normalizedDiscountPrice,
        variations: isVariationFeatureEnabled ? values.variations : (existingItem?.variations ?? []),
        imageUrls: uploadedUrls,
      });
      await deleteFilesByUrls(removedImageUrls);

      resetEditingState();
      await load();
      setFeedback({ type: "success", message: "Ürün güncellendi." });
    } catch (error) {
      await deleteFilesByUrls(newlyUploadedUrls);
      const message = error instanceof Error ? error.message : "Ürün güncellenemedi.";
      setFeedback({
        type: "error",
        message: message.includes("Storage yetkisi reddedildi")
          ? `${message}${buildStorageDebugSuffix()}`
          : message,
      });
    }
  });

  const handleArchive = async (id: string) => {
    if (!restaurant?.id) {
      return;
    }

    const confirmed = window.confirm("Bu ürünü arşive taşımak istiyor musunuz?");
    if (!confirmed) {
      return;
    }

    try {
      await archiveMenuItem(restaurant.id, id);
      await load();
      setFeedback({ type: "success", message: "Ürün arşivlendi." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Ürün arşivlenemedi.",
      });
    }
  };

  const handleRestore = async (id: string) => {
    if (!restaurant?.id) {
      return;
    }

    try {
      await restoreMenuItem(restaurant.id, id);
      await load();
      setFeedback({ type: "success", message: "Ürün arşivden çıkarıldı." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Ürün arşivden çıkarılamadı.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!restaurant?.id) {
      return;
    }

    const targetItem = menuItems.find((item) => item.id === id);
    const confirmed = window.confirm(
      "Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMenuItemPermanent(restaurant.id, id);
      await deleteFilesByUrls(targetItem?.imageUrls ?? []);
      await load();
      setFeedback({ type: "success", message: "Ürün kalıcı olarak silindi." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Ürün silinemedi.",
      });
    }
  };

  const handleReorder = async (ids: string[]) => {
    if (!restaurant?.id) {
      return;
    }

    try {
      await reorderMenuItems(restaurant.id, ids);
      await load();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Sıralama güncellenemedi.",
      });
    }
  };

  if (!restaurant) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-xl font-bold text-slate-900">Ürün Yönetimi</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ürün ekle, varyasyon/alergen/etiket yönet, indirim tanımla ve sıralamayı düzenle.
        </p>
        {!isVariationFeatureEnabled ? (
          <div className="mt-3">
            <Alert variant="info">
              Ürün varyasyonları yalnızca Growth ve Premium paketlerde düzenlenebilir.
            </Alert>
          </div>
        ) : null}

        {categories.length === 0 ? (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Ürün eklemek için önce kategori oluşturmalısınız.{" "}
            <Link href="/dashboard/categories" className="font-semibold underline">
              Kategori sayfasına git
            </Link>
          </div>
        ) : null}

        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onCreate}>
          <div>
            <Label>Kategori</Label>
            <Select {...createForm.register("categoryId")}>
              <option value="">Kategori seçin</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            {createForm.formState.errors.categoryId ? (
              <p className="mt-1 text-xs text-rose-600">{createForm.formState.errors.categoryId.message}</p>
            ) : null}
          </div>
          <div>
            <Label>Ürün adı</Label>
            <Input {...createForm.register("name")} />
            {createForm.formState.errors.name ? (
              <p className="mt-1 text-xs text-rose-600">{createForm.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="md:col-span-2">
            <Label>Açıklama</Label>
            <Textarea {...createForm.register("description")} />
            {createForm.formState.errors.description ? (
              <p className="mt-1 text-xs text-rose-600">{createForm.formState.errors.description.message}</p>
            ) : null}
          </div>
          <div>
            <Label>Fiyat</Label>
            <Input type="number" step="0.01" {...createForm.register("price", { valueAsNumber: true })} />
            {createForm.formState.errors.price ? (
              <p className="mt-1 text-xs text-rose-600">{createForm.formState.errors.price.message}</p>
            ) : null}
          </div>
          <div>
            <Label>İndirimli fiyat</Label>
            <Input
              type="number"
              step="0.01"
              {...createForm.register("discountPrice", {
                setValueAs: (value) => (value === "" ? null : Number(value)),
              })}
            />
            {createForm.formState.errors.discountPrice ? (
              <p className="mt-1 text-xs text-rose-600">{createForm.formState.errors.discountPrice.message}</p>
            ) : null}
          </div>
          <div>
            <Label>Sıra</Label>
            <Input type="number" {...createForm.register("sortOrder", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" {...createForm.register("isDiscounted")} /> İndirim aktif
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" {...createForm.register("isAvailable")} /> Ürün mevcut
            </label>
          </div>

          {isVariationFeatureEnabled ? (
            <div className="md:col-span-2 rounded-xl border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label className="mb-0">Ürün Varyasyonları</Label>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-8 px-3"
                  onClick={() =>
                    createVariationFields.append(
                      variationDraft(
                        createVariationFields.fields.length === 0,
                        createVariationFields.fields.length + 1,
                      ),
                    )
                  }
                >
                  Varyasyon Ekle
                </Button>
              </div>

              <div className="space-y-2">
                {createVariationFields.fields.map((field, index) => (
                  <div key={field.id} className="grid gap-2 rounded-lg border border-slate-200 p-2 md:grid-cols-5">
                    <Input
                      placeholder="Örn. Büyük Boy"
                      {...createForm.register(`variations.${index}.name`)}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Fiyat"
                      {...createForm.register(`variations.${index}.price`, {
                        valueAsNumber: true,
                      })}
                    />
                    <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={createForm.watch(`variations.${index}.isDefault`)}
                        onChange={() => markDefaultVariation(createForm, index, createVariationFields)}
                      />
                      Varsayılan
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                      <input type="checkbox" {...createForm.register(`variations.${index}.isAvailable`)} />
                      Aktif
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-3 text-rose-700"
                      onClick={() => removeVariation(createForm, createVariationFields, index)}
                    >
                      Sil
                    </Button>
                  </div>
                ))}
              </div>
              {createForm.formState.errors.variations ? (
                <p className="mt-1 text-xs text-rose-600">
                  {createForm.formState.errors.variations.message}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="md:col-span-2 rounded-xl border border-slate-200 p-3">
            <Label>Ürün Etiketleri</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESET_PRODUCT_LABELS.map((label) => {
                const selected = createForm.watch("labels").includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      selected
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                    onClick={() => toggleToken(createForm, "labels", label, 8)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Özel etiket ekle"
                value={createLabelInput}
                onChange={(event) => setCreateLabelInput(event.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  addCustomToken(createForm, "labels", createLabelInput, setCreateLabelInput, 8)
                }
              >
                Ekle
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-200 p-3">
            <Label>Alerjen Uyarıları</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESET_ALLERGENS.map((label) => {
                const selected = createForm.watch("allergens").includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      selected
                        ? "border-rose-200 bg-rose-100 text-rose-700"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                    onClick={() => toggleToken(createForm, "allergens", label, 16)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Özel alerjen ekle"
                value={createAllergenInput}
                onChange={(event) => setCreateAllergenInput(event.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  addCustomToken(
                    createForm,
                    "allergens",
                    createAllergenInput,
                    setCreateAllergenInput,
                    16,
                  )
                }
              >
                Ekle
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <Label>Ürün fotoğrafları (max {IMAGE_LIMITS.MAX_PRODUCT_IMAGES})</Label>
            <FileInput accept="image/*" multiple onChange={handleCreateFileChange} />
            {createFiles.length > 0 ? (
              <p className="mt-1 text-xs text-slate-500">
                Seçilen dosya sayısı: {createFiles.length}
              </p>
            ) : null}
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={createForm.formState.isSubmitting || categories.length === 0}
            >
              {createForm.formState.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Ekleniyor
                </span>
              ) : (
                "Ürün Ekle"
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
        <h2 className="text-lg font-semibold text-slate-900">Aktif Ürünler</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <Input
            placeholder="Ürün adı veya açıklamada ara..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">Tüm kategoriler</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
            <Spinner /> Ürünler yükleniyor...
          </div>
        ) : activeItems.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Henüz ürün yok.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {isFilteringActiveItems ? (
              <p className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600">
                Arama veya filtre aktifken sürükle-bırak sıralama pasif. Sıralama için filtreyi temizleyin.
              </p>
            ) : (
              <SortableList
                items={activeItems.map((item) => ({
                  id: item.id,
                  label: item.name,
                  rightText: `#${item.sortOrder}`,
                }))}
                onReorder={handleReorder}
              />
            )}

            {filteredActiveItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
                {editingId === item.id ? (
                  <form className="grid gap-2 md:grid-cols-2" onSubmit={onEdit}>
                    <Select {...editForm.register("categoryId")}>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                    <Input {...editForm.register("name")} />
                    <Textarea className="md:col-span-2" {...editForm.register("description")} />
                    <Input type="number" step="0.01" {...editForm.register("price", { valueAsNumber: true })} />
                    <Input
                      type="number"
                      step="0.01"
                      {...editForm.register("discountPrice", {
                        setValueAs: (value) => (value === "" ? null : Number(value)),
                      })}
                    />
                    <Input type="number" {...editForm.register("sortOrder", { valueAsNumber: true })} />
                    <div className="space-y-1">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input type="checkbox" {...editForm.register("isDiscounted")} /> İndirim aktif
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input type="checkbox" {...editForm.register("isAvailable")} /> Ürün mevcut
                      </label>
                    </div>

                    {isVariationFeatureEnabled ? (
                      <div className="md:col-span-2 rounded-xl border border-slate-200 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <Label className="mb-0">Ürün Varyasyonları</Label>
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-8 px-3"
                            onClick={() =>
                              editVariationFields.append(
                                variationDraft(
                                  editVariationFields.fields.length === 0,
                                  editVariationFields.fields.length + 1,
                                ),
                              )
                            }
                          >
                            Varyasyon Ekle
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {editVariationFields.fields.map((field, index) => (
                            <div key={field.id} className="grid gap-2 rounded-lg border border-slate-200 p-2 md:grid-cols-5">
                              <Input
                                placeholder="Örn. Büyük Boy"
                                {...editForm.register(`variations.${index}.name`)}
                              />
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Fiyat"
                                {...editForm.register(`variations.${index}.price`, {
                                  valueAsNumber: true,
                                })}
                              />
                              <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={editForm.watch(`variations.${index}.isDefault`)}
                                  onChange={() => markDefaultVariation(editForm, index, editVariationFields)}
                                />
                                Varsayılan
                              </label>
                              <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                                <input type="checkbox" {...editForm.register(`variations.${index}.isAvailable`)} />
                                Aktif
                              </label>
                              <Button
                                type="button"
                                variant="ghost"
                                className="h-8 px-3 text-rose-700"
                                onClick={() => removeVariation(editForm, editVariationFields, index)}
                              >
                                Sil
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="md:col-span-2 rounded-xl border border-slate-200 p-3">
                      <Label>Ürün Etiketleri</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {PRESET_PRODUCT_LABELS.map((label) => {
                          const selected = editForm.watch("labels").includes(label);
                          return (
                            <button
                              key={label}
                              type="button"
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                selected
                                  ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                  : "border-slate-200 bg-white text-slate-600"
                              }`}
                              onClick={() => toggleToken(editForm, "labels", label, 8)}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Input
                          placeholder="Özel etiket ekle"
                          value={editLabelInput}
                          onChange={(event) => setEditLabelInput(event.target.value)}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            addCustomToken(editForm, "labels", editLabelInput, setEditLabelInput, 8)
                          }
                        >
                          Ekle
                        </Button>
                      </div>
                    </div>

                    <div className="md:col-span-2 rounded-xl border border-slate-200 p-3">
                      <Label>Alerjen Uyarıları</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {PRESET_ALLERGENS.map((label) => {
                          const selected = editForm.watch("allergens").includes(label);
                          return (
                            <button
                              key={label}
                              type="button"
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                selected
                                  ? "border-rose-200 bg-rose-100 text-rose-700"
                                  : "border-slate-200 bg-white text-slate-600"
                              }`}
                              onClick={() => toggleToken(editForm, "allergens", label, 16)}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Input
                          placeholder="Özel alerjen ekle"
                          value={editAllergenInput}
                          onChange={(event) => setEditAllergenInput(event.target.value)}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            addCustomToken(
                              editForm,
                              "allergens",
                              editAllergenInput,
                              setEditAllergenInput,
                              16,
                            )
                          }
                        >
                          Ekle
                        </Button>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <FileInput accept="image/*" multiple onChange={handleEditFileChange} />
                      {editFiles.length > 0 ? (
                        <p className="text-xs text-slate-500">
                          Yeni seçilen dosya sayısı: {editFiles.length}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        {editImageUrls.map((url) => (
                          <div key={url} className="relative">
                            <img src={url} alt="Ürün görseli" className="h-16 w-16 rounded-md object-cover" />
                            <button
                              type="button"
                              className="absolute -right-1 -top-1 rounded-full bg-white px-1 text-xs text-rose-700"
                              onClick={() =>
                                setEditImageUrls((prev) => prev.filter((imageUrl) => imageUrl !== url))
                              }
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button type="submit">Kaydet</Button>
                      <Button type="button" variant="secondary" onClick={resetEditingState}>
                        İptal
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">Kategori: {categoryLabelMap[item.categoryId] ?? "-"}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.isAvailable ? <Badge>Mevcut</Badge> : <Badge className="bg-rose-100 text-rose-700">Pasif</Badge>}
                        {item.isDiscounted ? <Badge className="bg-amber-100 text-amber-700">İndirimli</Badge> : null}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{item.description}</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.isDiscounted && item.discountPrice !== null ? (
                        <>
                          <span className="mr-2 text-slate-400 line-through">{formatPrice(item.price)}</span>
                          <span className="text-emerald-700">{formatPrice(item.discountPrice)}</span>
                        </>
                      ) : (
                        formatPrice(item.price)
                      )}
                    </p>

                    {item.labels?.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.labels.map((label) => (
                          <Badge key={`${item.id}-label-${label}`} className="bg-emerald-100 text-emerald-700">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {item.allergens?.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.allergens.map((allergen) => (
                          <Badge key={`${item.id}-allergen-${allergen}`} className="bg-rose-100 text-rose-700">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {item.variations?.length ? (
                      <div className="rounded-lg border border-slate-200 p-2">
                        <p className="text-xs font-semibold text-slate-700">Varyasyonlar</p>
                        <div className="mt-1 space-y-1">
                          {item.variations.map((variation) => (
                            <p key={variation.id} className="text-xs text-slate-600">
                              {variation.name} - {formatPrice(variation.price)}
                              {variation.isDefault ? " (Varsayılan)" : ""}
                              {!variation.isAvailable ? " (Pasif)" : ""}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      {item.imageUrls?.map((url) => (
                        <img key={url} src={url} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button type="button" variant="secondary" className="h-8 px-3" onClick={() => startEdit(item)}>
                        Düzenle
                      </Button>
                      <Button type="button" variant="ghost" className="h-8 px-3 text-amber-700" onClick={() => handleArchive(item.id)}>
                        Arşivle
                      </Button>
                      <Button type="button" variant="ghost" className="h-8 px-3 text-rose-700" onClick={() => handleDelete(item.id)}>
                        Sil
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Arşivlenmiş Ürünler</h2>

        {archivedItems.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Arşivde ürün yok.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {archivedItems.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">{formatPrice(item.price)}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" className="h-8 px-3" onClick={() => handleRestore(item.id)}>
                    Geri Al
                  </Button>
                  <Button type="button" variant="danger" className="h-8 px-3" onClick={() => handleDelete(item.id)}>
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
