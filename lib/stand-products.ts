import { MarketingLocale } from "@/lib/request-locale";

export type StandModel = "stand" | "sticker" | "button";

export interface StandProductItem {
  id: StandModel;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export interface StandProductCard extends StandProductItem {
  priceLabel: string;
}

const STAND_PRODUCTS_BASE: Array<{
  id: StandModel;
  imageSrc: string;
  title: Record<MarketingLocale, string>;
  imageAlt: Record<MarketingLocale, string>;
  fixedPriceLabel?: string;
}> = [
  {
    id: "stand",
    imageSrc: "/qr_stand.png",
    title: {
      tr: "Klasik Stant",
      en: "Classic Stand",
    },
    imageAlt: {
      tr: "Klasik QR stant ürün görseli",
      en: "Classic QR stand product image",
    },
  },
  {
    id: "sticker",
    imageSrc: "/sticker.png",
    title: {
      tr: "Sticker",
      en: "Sticker",
    },
    imageAlt: {
      tr: "Sticker QR ürün görseli",
      en: "Sticker QR product image",
    },
    fixedPriceLabel: "40 TL",
  },
  {
    id: "button",
    imageSrc: "/butonlu.png",
    title: {
      tr: "Butonlu",
      en: "Button Model",
    },
    imageAlt: {
      tr: "Butonlu QR ürün görseli",
      en: "Button QR product image",
    },
    fixedPriceLabel: "160 TL",
  },
];

export function getStandModelLabel(model: StandModel, locale: MarketingLocale): string {
  const match = STAND_PRODUCTS_BASE.find((item) => item.id === model);
  return match ? match.title[locale] : STAND_PRODUCTS_BASE[0].title[locale];
}

export function getStandProductItems(locale: MarketingLocale): StandProductItem[] {
  return STAND_PRODUCTS_BASE.map((item) => ({
    id: item.id,
    title: item.title[locale],
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt[locale],
  }));
}

export function getStandProductCards(locale: MarketingLocale, standPriceLabel: string): StandProductCard[] {
  return STAND_PRODUCTS_BASE.map((item) => ({
    id: item.id,
    title: item.title[locale],
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt[locale],
    priceLabel: item.fixedPriceLabel ?? standPriceLabel,
  }));
}
