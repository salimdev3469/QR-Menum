import {
  MenuDesign,
  MenuItemVariation,
  Promotion,
  SocialLinks,
} from "@/types";

export const PRESET_PRODUCT_LABELS = [
  "Şef Özel",
  "Sezonluk",
  "Yeni",
  "Fırsat",
  "Favori",
] as const;

export const PRESET_ALLERGENS = [
  "Gluten",
  "Yumurta",
  "Süt Ürünleri",
  "Yer Fıstığı",
  "Soya",
  "Kabuklu Deniz Ürünleri",
  "Sert Kabuklu Kuruyemiş",
  "Balık",
] as const;

export const DEFAULT_MENU_DESIGN: MenuDesign = {
  primaryColor: "#059669",
  accentColor: "#0ea5e9",
  textColor: "#0f172a",
  backgroundStyle: "light",
};

export function emptySocialLinks(): SocialLinks {
  return {
    instagram: "",
    facebook: "",
    x: "",
    youtube: "",
    tiktok: "",
  };
}

export function normalizeStringList(values: unknown, max = 20): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean)
    .slice(0, max);
}

export function normalizeVariationList(values: unknown): MenuItemVariation[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const normalized = values
    .map((value, index) => {
      const raw = value as Partial<MenuItemVariation>;
      const name = typeof raw.name === "string" ? raw.name.trim() : "";
      const price = typeof raw.price === "number" && Number.isFinite(raw.price) ? raw.price : 0;

      if (!name) {
        return null;
      }

      return {
        id: typeof raw.id === "string" && raw.id.length > 0 ? raw.id : crypto.randomUUID(),
        name,
        price: Math.max(0, price),
        isDefault: Boolean(raw.isDefault),
        isAvailable: raw.isAvailable !== false,
        sortOrder:
          typeof raw.sortOrder === "number" && Number.isFinite(raw.sortOrder)
            ? Math.max(1, Math.floor(raw.sortOrder))
            : index + 1,
      } satisfies MenuItemVariation;
    })
    .filter((item): item is MenuItemVariation => item !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({ ...item, sortOrder: index + 1 }));

  if (normalized.length > 0 && !normalized.some((item) => item.isDefault)) {
    normalized[0].isDefault = true;
  }

  if (normalized.length > 1) {
    const firstDefaultIndex = normalized.findIndex((item) => item.isDefault);
    normalized.forEach((item, index) => {
      if (index !== firstDefaultIndex) {
        item.isDefault = false;
      }
    });
  }

  return normalized;
}

export function normalizeMenuDesign(value: unknown): MenuDesign {
  const raw = (value ?? {}) as Partial<MenuDesign>;

  return {
    primaryColor: typeof raw.primaryColor === "string" ? raw.primaryColor : DEFAULT_MENU_DESIGN.primaryColor,
    accentColor: typeof raw.accentColor === "string" ? raw.accentColor : DEFAULT_MENU_DESIGN.accentColor,
    textColor: typeof raw.textColor === "string" ? raw.textColor : DEFAULT_MENU_DESIGN.textColor,
    backgroundStyle: raw.backgroundStyle === "dark" ? "dark" : "light",
  };
}

export function normalizeSocialLinks(value: unknown): SocialLinks {
  const raw = (value ?? {}) as Partial<SocialLinks>;
  const empty = emptySocialLinks();

  return {
    instagram: typeof raw.instagram === "string" ? raw.instagram : empty.instagram,
    facebook: typeof raw.facebook === "string" ? raw.facebook : empty.facebook,
    x: typeof raw.x === "string" ? raw.x : empty.x,
    youtube: typeof raw.youtube === "string" ? raw.youtube : empty.youtube,
    tiktok: typeof raw.tiktok === "string" ? raw.tiktok : empty.tiktok,
  };
}

export function isPromotionLive(promotion: Promotion, now = new Date()): boolean {
  if (!promotion.isActive || promotion.isArchived) {
    return false;
  }

  const nowTimestamp = now.getTime();
  const startTimestamp = promotion.startsAt ? new Date(promotion.startsAt).getTime() : null;
  const endTimestamp = promotion.endsAt ? new Date(promotion.endsAt).getTime() : null;

  const startsValid = startTimestamp === null || !Number.isNaN(startTimestamp);
  const endsValid = endTimestamp === null || !Number.isNaN(endTimestamp);

  if (!startsValid || !endsValid) {
    return true;
  }

  if (startTimestamp !== null && nowTimestamp < startTimestamp) {
    return false;
  }

  if (endTimestamp !== null && nowTimestamp > endTimestamp) {
    return false;
  }

  return true;
}
