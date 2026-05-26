import { z } from "zod";

const hexColorRegex = /^#([0-9a-fA-F]{6})$/;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ad soyad en az 2 karakter olmalı."),
    email: z.email("Geçerli bir e-posta girin."),
    phone: z.string().min(7, "Telefon numarası geçersiz."),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
    confirmPassword: z.string().min(6, "Şifre tekrarı gerekli."),
    businessCode: z.string().min(4, "İşletme kodu en az 4 karakter olmalı.").max(20),
    restaurantName: z.string().min(2, "İşletme adı en az 2 karakter olmalı."),
    managerName: z.string().min(2, "Yetkili adı en az 2 karakter olmalı."),
    restaurantPhone: z.string().min(7, "İşletme telefonu geçersiz."),
    address: z.string().min(5, "Adres en az 5 karakter olmalı."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler eşleşmiyor.",
  });

export const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
  businessCode: z.string().min(4, "İşletme kodu en az 4 karakter olmalı.").max(20),
});

export const restaurantSchema = z
  .object({
    name: z.string().min(2),
    managerName: z.string().min(2),
    phone: z.string().min(7),
    address: z.string().min(5),
    isActive: z.boolean(),
    plan: z.enum(["starter", "growth", "premium"]),
    tableCount: z.number().int().min(0).max(500),
    floorCount: z.number().int().min(1).max(20),
    floorTableCounts: z.array(z.number().int().min(0).max(500)).min(1).max(20),
    menuDesign: z.object({
      primaryColor: z.string().regex(hexColorRegex, "Renk #RRGGBB formatında olmalı."),
      accentColor: z.string().regex(hexColorRegex, "Renk #RRGGBB formatında olmalı."),
      textColor: z.string().regex(hexColorRegex, "Renk #RRGGBB formatında olmalı."),
      backgroundStyle: z.enum(["dark", "light"]),
    }),
    socialLinks: z.object({
      instagram: z.string().trim().max(200),
      facebook: z.string().trim().max(200),
      x: z.string().trim().max(200),
      youtube: z.string().trim().max(200),
      tiktok: z.string().trim().max(200),
    }),
  })
  .superRefine((values, context) => {
    if (values.floorTableCounts.length !== values.floorCount) {
      context.addIssue({
        code: "custom",
        path: ["floorTableCounts"],
        message: "Kat dağılımı kat sayısı ile eşleşmeli.",
      });
    }

    const total = values.floorTableCounts.reduce((sum, count) => sum + count, 0);

    if (total !== values.tableCount) {
      context.addIssue({
        code: "custom",
        path: ["tableCount"],
        message: "Toplam masa sayısı kat dağılımı ile eşleşmeli.",
      });
    }
  });

export const categorySchema = z.object({
  name: z.string().min(2),
  sortOrder: z.number().int().min(1),
  isActive: z.boolean(),
});

export const menuItemSchema = z
  .object({
    categoryId: z.string().min(1, "Kategori seçilmeli."),
    name: z.string().min(2, "Ürün adı en az 2 karakter olmalı."),
    description: z.string().min(2, "Açıklama en az 2 karakter olmalı."),
    price: z.number().min(0, "Fiyat negatif olamaz."),
    discountPrice: z.number().nullable().optional(),
    isDiscounted: z.boolean(),
    isAvailable: z.boolean(),
    sortOrder: z.number().int().min(1),
    labels: z.array(z.string().trim().min(1).max(32)).max(8),
    allergens: z.array(z.string().trim().min(1).max(50)).max(16),
    variations: z
      .array(
        z.object({
          id: z.string().min(1),
          name: z.string().trim().min(1, "Varyasyon adı zorunlu."),
          price: z.number().min(0, "Varyasyon fiyatı negatif olamaz."),
          isDefault: z.boolean(),
          isAvailable: z.boolean(),
          sortOrder: z.number().int().min(1),
        }),
      )
      .max(12),
  })
  .refine(
    (data) => {
      if (!data.isDiscounted) {
        return true;
      }

      return data.discountPrice !== null && data.discountPrice !== undefined;
    },
    {
      path: ["discountPrice"],
      message: "İndirim aktifse indirimli fiyat girilmeli.",
    },
  )
  .refine(
    (data) => {
      if (data.variations.length === 0) {
        return true;
      }

      return data.variations.some((item) => item.isDefault);
    },
    {
      path: ["variations"],
      message: "En az bir varsayılan varyasyon seçin.",
    },
  )
  .refine(
    (data) => {
      if (data.variations.length === 0) {
        return true;
      }

      return data.variations.filter((item) => item.isDefault).length <= 1;
    },
    {
      path: ["variations"],
      message: "Sadece bir varsayılan varyasyon olabilir.",
    },
  );

export const businessCodeUpdateSchema = z.object({
  businessCode: z.string().min(4, "İşletme kodu en az 4 karakter olmalı.").max(20),
});

export const standOrderSchema = z
  .object({
    customerName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı."),
    businessName: z.string().trim().min(2, "İşletme adı en az 2 karakter olmalı."),
    email: z.email("Geçerli bir e-posta girin."),
    phone: z.string().trim().min(7, "Telefon numarası geçersiz."),
    tableCount: z.number().int().min(1, "En az 1 masa olmalı."),
    standModel: z.enum(["stand", "sticker", "button"]),
    designType: z.enum(["preset", "upload"]),
    designPreset: z.string().trim(),
    note: z.string().trim().max(500).optional(),
  })
  .refine(
    (data) => {
      if (data.designType === "upload") {
        return true;
      }

      return data.designPreset.length > 0;
    },
    {
      path: ["designPreset"],
      message: "Hazır tasarım seçmelisiniz.",
    },
  );

export const systemOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı."),
  businessName: z.string().trim().min(2, "İşletme adı en az 2 karakter olmalı."),
  email: z.email("Geçerli bir e-posta girin."),
  phone: z.string().trim().min(7, "Telefon numarası geçersiz."),
  planName: z.enum(["Starter", "Growth", "Premium"]),
  billingCycle: z.enum(["monthly", "annual"]),
  note: z.string().trim().max(500).optional(),
});

export const promotionSchema = z
  .object({
    title: z.string().trim().min(2, "Başlık en az 2 karakter olmalı.").max(80),
    description: z.string().trim().min(2, "Açıklama en az 2 karakter olmalı.").max(240),
    scope: z.enum(["all", "category", "menuItem"]),
    targetId: z.string().trim(),
    startsAt: z.string().trim(),
    endsAt: z.string().trim(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.scope === "all") {
        return true;
      }

      return data.targetId.length > 0;
    },
    {
      path: ["targetId"],
      message: "Kategori veya ürün seçmelisiniz.",
    },
  )
  .refine(
    (data) => {
      if (!data.startsAt || !data.endsAt) {
        return true;
      }

      return new Date(data.startsAt).getTime() <= new Date(data.endsAt).getTime();
    },
    {
      path: ["endsAt"],
      message: "Bitiş tarihi başlangıçtan önce olamaz.",
    },
  );
