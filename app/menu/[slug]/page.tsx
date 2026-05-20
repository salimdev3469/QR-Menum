"use client";

import { CSSProperties, use, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/format";
import { getLocalizedText } from "@/lib/localized";
import { isPromotionLive } from "@/lib/menu-features";
import { canUseWaiterCalls } from "@/lib/plan";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/use-locale";
import { listPublicCategories } from "@/services/category-service";
import { listPublicMenuItemsByRestaurant } from "@/services/menu-service";
import { listPublicPromotionsByRestaurant } from "@/services/promotion-service";
import { getRestaurantBySlug, listGallery } from "@/services/restaurant-service";
import { createWaiterCall } from "@/services/waiter-call-service";
import { Category, MenuItem, Promotion, Restaurant } from "@/types";

interface MenuPageProps {
  params: Promise<{ slug: string }>;
}

interface GalleryItemView {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalizedHex = hex.replace("#", "");
  if (normalizedHex.length !== 6) {
    return `rgba(5,150,105,${alpha})`;
  }

  const r = parseInt(normalizedHex.slice(0, 2), 16);
  const g = parseInt(normalizedHex.slice(2, 4), 16);
  const b = parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizeExternalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export default function PublicMenuPage({ params }: MenuPageProps) {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const { slug } = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [gallery, setGallery] = useState<GalleryItemView[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(1);
  const [waiterCalling, setWaiterCalling] = useState(false);
  const [waiterCallFeedback, setWaiterCallFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      return;
    }

    (async () => {
      setLoading(true);

      const restaurantDoc = await getRestaurantBySlug(slug);

      if (!restaurantDoc) {
        setRestaurant(null);
        setCategories([]);
        setItems([]);
        setPromotions([]);
        setGallery([]);
        setLoading(false);
        return;
      }

      const [categoryDocs, itemDocs, promotionDocs, galleryDocs] = await Promise.all([
        listPublicCategories(restaurantDoc.id),
        listPublicMenuItemsByRestaurant(restaurantDoc.id),
        listPublicPromotionsByRestaurant(restaurantDoc.id),
        listGallery(restaurantDoc.id),
      ]);

      setRestaurant(restaurantDoc);
      setCategories(categoryDocs);
      setItems(itemDocs);
      setPromotions(promotionDocs.filter((item) => isPromotionLive(item)));
      setGallery(
        galleryDocs
          .filter((item) => typeof item.imageUrl === "string" && item.imageUrl.trim().length > 0)
          .map((item) => ({
            id: item.id,
            imageUrl: item.imageUrl.trim(),
            sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : 0,
          })),
      );
      setSelectedCategoryId("");
      setLoading(false);
    })();
  }, [slug]);

  const tableQueryParam = searchParams.get("table");

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    const tableCount = restaurant.tableCount ?? 0;
    if (tableCount <= 0) {
      setSelectedTableNumber(1);
      return;
    }

    const parsedQueryTable = Number(tableQueryParam);
    if (
      Number.isInteger(parsedQueryTable)
      && parsedQueryTable >= 1
      && parsedQueryTable <= tableCount
    ) {
      setSelectedTableNumber(parsedQueryTable);
      return;
    }

    setSelectedTableNumber(1);
  }, [restaurant, tableQueryParam]);

  const filteredItems = useMemo(() => {
    if (!selectedCategoryId) {
      return items;
    }

    return items.filter((item) => item.categoryId === selectedCategoryId);
  }, [items, selectedCategoryId]);

  const selectedCategory = useMemo(() => {
    return categories.find((item) => item.id === selectedCategoryId) ?? null;
  }, [categories, selectedCategoryId]);

  const categoryItemCountMap = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      acc[item.categoryId] = (acc[item.categoryId] ?? 0) + 1;
      return acc;
    }, {});
  }, [items]);

  const allMenuSections = useMemo(() => {
    const sections = categories
      .map((category) => ({
        id: category.id,
        title: getLocalizedText(category.nameI18n, locale, category.name),
        items: items.filter((item) => item.categoryId === category.id),
      }))
      .filter((section) => section.items.length > 0);

    const categoryIds = new Set(categories.map((category) => category.id));
    const uncategorizedItems = items.filter((item) => !categoryIds.has(item.categoryId));

    if (uncategorizedItems.length > 0) {
      sections.push({
        id: "__uncategorized__",
        title: locale === "en" ? "Other" : "Diğer",
        items: uncategorizedItems,
      });
    }

    return sections;
  }, [categories, items, locale]);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      if (promotion.scope === "all") {
        return true;
      }

      if (promotion.scope === "category") {
        if (!selectedCategoryId) {
          return true;
        }
        return promotion.targetId === selectedCategoryId;
      }

      return filteredItems.some((item) => item.id === promotion.targetId);
    });
  }, [filteredItems, promotions, selectedCategoryId]);

  const isWaiterFeatureEnabled = canUseWaiterCalls(restaurant?.plan);

  const handleWaiterCall = async () => {
    if (!restaurant?.id || !isWaiterFeatureEnabled) {
      return;
    }

    if (selectedTableNumber < 1 || selectedTableNumber > restaurant.tableCount) {
      setWaiterCallFeedback({
        type: "error",
        message: "Lütfen geçerli bir masa seçin.",
      });
      return;
    }

    setWaiterCalling(true);
    setWaiterCallFeedback(null);

    try {
      await createWaiterCall(restaurant.id, selectedTableNumber);
      setWaiterCallFeedback({
        type: "success",
        message: `Masa ${selectedTableNumber} için garson çağrısı gönderildi.`,
      });
    } catch (error) {
      setWaiterCallFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Garson çağrısı gönderilemedi.",
      });
    } finally {
      setWaiterCalling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white shadow-lg backdrop-blur">
          <Spinner /> Menü yükleniyor...
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-lg">
          <p className="text-2xl font-extrabold tracking-tight text-white">{t("publicMenu", locale)}</p>
          <p className="mt-3 text-sm text-slate-200">{t("closedRestaurant", locale)}</p>
        </div>
      </div>
    );
  }

  const bannerImageUrl = restaurant.backgroundImageUrl || restaurant.logoUrl || "";
  const hasBannerImage = Boolean(bannerImageUrl);
  const design = restaurant.menuDesign;
  const isDarkTheme = design.backgroundStyle === "dark";
  const textColor = isDarkTheme ? "#e2e8f0" : design.textColor;
  const subtitleColor = isDarkTheme ? "#cbd5e1" : "#475569";
  const contentBackground = isDarkTheme
    ? "radial-gradient(circle at 10% 0%, #0b1220 0%, #111827 45%, #0f172a 100%)"
    : "radial-gradient(circle at 15% 0%, #f2fbf7 0%, #f4f7fb 45%, #edf2f8 100%)";
  const headerGradient = `linear-gradient(135deg, ${hexToRgba(design.primaryColor, 0.86)} 0%, ${hexToRgba(
    design.accentColor,
    0.75,
  )} 100%)`;
  const sectionCardStyle: CSSProperties = {
    backgroundColor: isDarkTheme ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.9)",
    borderColor: isDarkTheme ? "rgba(148, 163, 184, 0.3)" : "rgba(226, 232, 240, 1)",
  };
  const socialEntries = [
    { key: "instagram", label: "Instagram", url: normalizeExternalUrl(restaurant.socialLinks.instagram) },
    { key: "facebook", label: "Facebook", url: normalizeExternalUrl(restaurant.socialLinks.facebook) },
    { key: "x", label: "X", url: normalizeExternalUrl(restaurant.socialLinks.x) },
    { key: "youtube", label: "YouTube", url: normalizeExternalUrl(restaurant.socialLinks.youtube) },
    { key: "tiktok", label: "TikTok", url: normalizeExternalUrl(restaurant.socialLinks.tiktok) },
  ].filter((item) => item.url.length > 0);
  const renderMenuItemCard = (item: MenuItem) => {
    const localizedName = getLocalizedText(item.nameI18n, locale, item.name);
    const localizedDescription = getLocalizedText(
      item.descriptionI18n,
      locale,
      item.description,
    );
    const discountPriceValue =
      item.isDiscounted && item.discountPrice !== null ? item.discountPrice : null;
    const hasDiscount = discountPriceValue !== null;
    const availableVariations = (item.variations ?? []).filter((variation) => variation.isAvailable);

    return (
      <article
        key={item.id}
        className="menu-fade-in group rounded-3xl border p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        style={sectionCardStyle}
      >
        <div className="flex gap-3">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
            {item.imageUrls?.[0] ? (
              <img
                src={item.imageUrls[0]}
                alt={localizedName}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
                QR MENU
              </div>
            )}
            {!item.isAvailable ? (
              <span className="absolute bottom-2 left-2 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-bold text-white shadow-md">
                {t("currentlyUnavailable", locale)}
              </span>
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-lg font-bold tracking-tight" style={{ color: textColor }}>
                {localizedName}
              </h3>
              {hasDiscount ? (
                <Badge className="text-white" style={{ backgroundColor: design.accentColor }}>
                  %
                </Badge>
              ) : null}
            </div>

            <p className="mt-1 line-clamp-2 text-sm" style={{ color: subtitleColor }}>
              {localizedDescription}
            </p>

            {item.labels?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.labels.map((label) => (
                  <span
                    key={`${item.id}-label-${label}`}
                    className="rounded-full border px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      borderColor: hexToRgba(design.accentColor, 0.45),
                      color: design.accentColor,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-3">
              {hasDiscount ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-medium leading-none text-slate-400 line-through">
                    {formatPrice(item.price)}
                  </span>
                  <span
                    className="inline-flex h-11 items-center rounded-lg px-4 text-lg font-extrabold leading-none text-white shadow-md"
                    style={{ backgroundColor: design.primaryColor }}
                  >
                    {formatPrice(discountPriceValue)}
                  </span>
                </div>
              ) : (
                <span
                  className="rounded-lg px-2.5 py-1 text-base font-extrabold text-white shadow-md"
                  style={{ backgroundColor: design.primaryColor }}
                >
                  {formatPrice(item.price)}
                </span>
              )}
            </div>

            {availableVariations.length ? (
              <div className="mt-2 rounded-lg border p-2" style={{ borderColor: isDarkTheme ? "#334155" : "#e2e8f0" }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: subtitleColor }}>
                  Varyasyonlar
                </p>
                <div className="mt-1 space-y-1">
                  {availableVariations.map((variation) => (
                    <p key={variation.id} className="flex items-center justify-between text-xs" style={{ color: textColor }}>
                      <span>
                        {variation.name}
                        {variation.isDefault ? " • Varsayılan" : ""}
                      </span>
                      <span>{formatPrice(variation.price)}</span>
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {item.allergens?.length ? (
              <p className="mt-2 text-xs" style={{ color: subtitleColor }}>
                Alerjen: {item.allergens.join(", ")}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: contentBackground }}>
      <div className="relative overflow-hidden">
        <header className="relative isolate min-h-[22rem] w-full overflow-hidden bg-slate-950">
          {bannerImageUrl ? (
            <img
              src={bannerImageUrl}
              alt={restaurant.name}
              className="absolute inset-0 h-full w-full object-cover object-center brightness-110 saturate-110"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: headerGradient }} />
          )}

          <div
            className={`absolute inset-0 ${
              hasBannerImage
                ? "bg-gradient-to-b from-slate-950/20 via-slate-950/35 to-slate-950/55"
                : "bg-slate-950/35"
            }`}
          />

          <div className="relative mx-auto flex w-full max-w-6xl justify-end px-4 pt-5 sm:px-6 lg:px-8">
            <LanguageSwitcher className="h-10 rounded-xl border border-white/40 bg-white/90 px-3 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-900/20 backdrop-blur" />
          </div>

          <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
            <div className="menu-fade-in mx-auto max-w-4xl">
              <div className="flex flex-col items-center gap-4 text-center">
                {restaurant.logoUrl ? (
                  <img
                    src={restaurant.logoUrl}
                    alt={restaurant.name}
                    className="h-20 w-20 rounded-2xl border border-white/35 bg-white/95 object-cover shadow-lg"
                  />
                ) : null}
                <div className="min-w-0 text-white">
                  <h1 className="line-clamp-2 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    {getLocalizedText(restaurant.nameI18n, locale, restaurant.name)}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-100/95">
                    <span>{restaurant.phone}</span>
                    <span className="h-1 w-1 rounded-full bg-white/70" />
                    <span className="line-clamp-1">
                      {getLocalizedText(restaurant.addressI18n, locale, restaurant.address)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="relative mx-auto -mt-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {isWaiterFeatureEnabled ? (
              <div className="rounded-3xl border p-4 shadow-xl shadow-slate-900/10 backdrop-blur-sm" style={sectionCardStyle}>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-[11rem] flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: subtitleColor }}>
                      Servis
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold" style={{ color: textColor }}>
                      Garson Çağır
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: subtitleColor }}>
                      Masanız için anında çağrı gönderin.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedTableNumber}
                      onChange={(event) => setSelectedTableNumber(Number(event.target.value))}
                      className="h-11 rounded-xl border bg-white px-3 text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none"
                      style={{ borderColor: isDarkTheme ? "#334155" : "#d1d5db" }}
                      disabled={(restaurant.tableCount ?? 0) < 1 || waiterCalling}
                    >
                      {Array.from({ length: Math.max(restaurant.tableCount, 0) }, (_, index) => index + 1).map(
                        (tableNumber) => (
                          <option key={tableNumber} value={tableNumber}>
                            Masa {tableNumber}
                          </option>
                        ),
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={handleWaiterCall}
                      disabled={waiterCalling || restaurant.tableCount < 1}
                      className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ backgroundColor: design.accentColor }}
                    >
                      {waiterCalling ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner /> Gönderiliyor
                        </span>
                      ) : (
                        "Garson Çağır"
                      )}
                    </button>
                  </div>
                </div>

                {restaurant.tableCount < 1 ? (
                  <div className="mt-3">
                    <Alert variant="info">Bu işletme için masa sayısı tanımlanmadı.</Alert>
                  </div>
                ) : null}

                {waiterCallFeedback ? (
                  <div className="mt-3">
                    <Alert variant={waiterCallFeedback.type}>{waiterCallFeedback.message}</Alert>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="rounded-3xl border p-3 shadow-xl shadow-slate-900/10 backdrop-blur-sm md:p-4" style={sectionCardStyle}>
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId("")}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    selectedCategoryId
                      ? "border bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
                      : "text-white shadow-lg"
                  }`}
                  style={
                    selectedCategoryId
                      ? { borderColor: isDarkTheme ? "#334155" : "#e2e8f0" }
                      : { backgroundColor: design.primaryColor }
                  }
                >
                  {t("allMenu", locale)}
                </button>
                {categories.map((category) => {
                  const isActive = category.id === selectedCategoryId;
                  const categoryLabel = getLocalizedText(category.nameI18n, locale, category.name);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? "text-white shadow-lg"
                          : "border bg-white text-slate-700"
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: design.primaryColor }
                          : { borderColor: isDarkTheme ? "#334155" : "#e2e8f0" }
                      }
                    >
                      {categoryLabel}
                      <span className="ml-2 text-xs opacity-80">
                        ({categoryItemCountMap[category.id] ?? 0})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto mt-6 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {restaurant.showGalleryOnPublic && gallery.length > 0 ? (
          <section className="mb-5 rounded-2xl border p-4 shadow-sm" style={sectionCardStyle}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-base font-bold" style={{ color: textColor }}>
                Galeri
              </h3>
              <Badge className="px-3 py-1 text-white" style={{ backgroundColor: design.accentColor }}>
                {gallery.length}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image) => (
                <a
                  key={image.id}
                  href={image.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                >
                  <img
                    src={image.imageUrl}
                    alt={`Galeri ${image.sortOrder > 0 ? image.sortOrder : image.id}`}
                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {filteredPromotions.length > 0 ? (
          <section className="mb-5 grid gap-3">
            {filteredPromotions.map((promotion) => (
              <article
                key={promotion.id}
                className="rounded-2xl border p-4 shadow-sm backdrop-blur-sm"
                style={{
                  ...sectionCardStyle,
                  borderColor: hexToRgba(design.accentColor, 0.45),
                }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: design.accentColor }}>
                  Kampanya
                </p>
                <h3 className="mt-1 text-lg font-bold" style={{ color: textColor }}>
                  {getLocalizedText(promotion.titleI18n, locale, promotion.title)}
                </h3>
                <p className="mt-1 text-sm" style={{ color: subtitleColor }}>
                  {getLocalizedText(
                    promotion.descriptionI18n,
                    locale,
                    promotion.description,
                  )}
                </p>
              </article>
            ))}
          </section>
        ) : null}

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: subtitleColor }}>
              {t("publicMenu", locale)}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: textColor }}>
              {selectedCategory
                ? getLocalizedText(selectedCategory.nameI18n, locale, selectedCategory.name)
                : t("allMenu", locale)}
            </h2>
          </div>
          <Badge className="px-3 py-1.5 text-white" style={{ backgroundColor: design.primaryColor }}>
            {filteredItems.length}
          </Badge>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border p-5 text-sm shadow-sm" style={{ ...sectionCardStyle, color: subtitleColor }}>
            {t("noData", locale)}
          </div>
        ) : !selectedCategoryId ? (
          <div className="space-y-6">
            {allMenuSections.map((section) => (
              <section key={section.id}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: textColor }}>
                    {section.title}
                  </h3>
                  <Badge className="px-3 py-1 text-white" style={{ backgroundColor: design.primaryColor }}>
                    {section.items.length}
                  </Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.items.map((item) => renderMenuItemCard(item))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredItems.map((item) => renderMenuItemCard(item))}
          </div>
        )}

        {socialEntries.length > 0 ? (
          <section className="mt-8 rounded-2xl border p-4" style={sectionCardStyle}>
            <h3 className="text-base font-bold" style={{ color: textColor }}>
              Sosyal Medyada Bizi Takip Edin
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialEntries.map((entry) => (
                <a
                  key={entry.key}
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: design.accentColor }}
                >
                  {entry.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
