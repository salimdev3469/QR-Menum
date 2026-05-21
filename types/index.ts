import { Timestamp } from "firebase/firestore";

export type SupportedLocale = "tr" | "en" | "ru" | "ar";
export type RestaurantPlan = "starter" | "growth" | "premium";

export type FirestoreDate = Timestamp | Date | string | null;

export type LocalizedTextMap = Record<SupportedLocale, string>;

export type PromotionScope = "all" | "category" | "menuItem";

export interface MenuDesign {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundStyle: "dark" | "light";
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  x: string;
  youtube: string;
  tiktok: string;
}

export interface MenuItemVariation {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
  isAvailable: boolean;
  sortOrder: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessCode: string;
  restaurantId: string;
  role: "owner" | "admin";
  createdAt: FirestoreDate;
}

export interface Restaurant {
  id: string;
  ownerUserId: string;
  name: string;
  managerName: string;
  phone: string;
  address: string;
  slug: string;
  backgroundImageUrl: string;
  isActive: boolean;
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
  nameI18n: LocalizedTextMap;
  addressI18n: LocalizedTextMap;
  menuDesign: MenuDesign;
  socialLinks: SocialLinks;
  showGalleryOnPublic: boolean;
  initialPlan: RestaurantPlan;
  plan: RestaurantPlan;
  tableCount: number;
}

export interface WaiterCall {
  id: string;
  tableNumber: number;
  isActive: boolean;
  requestedAt: FirestoreDate;
  resolvedAt: FirestoreDate;
  updatedAt: FirestoreDate;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: FirestoreDate;
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
  isArchived: boolean;
  archivedAt: FirestoreDate;
  nameI18n: LocalizedTextMap;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  isDiscounted: boolean;
  isAvailable: boolean;
  sortOrder: number;
  imageUrls: string[];
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
  isArchived: boolean;
  archivedAt: FirestoreDate;
  nameI18n: LocalizedTextMap;
  descriptionI18n: LocalizedTextMap;
  labels: string[];
  allergens: string[];
  variations: MenuItemVariation[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  scope: PromotionScope;
  targetId: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  isArchived: boolean;
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
  titleI18n: LocalizedTextMap;
  descriptionI18n: LocalizedTextMap;
}

export interface StandOrder {
  id: string;
  customerName: string;
  businessName: string;
  email: string;
  phone: string;
  tableCount: number;
  unitPrice: number;
  totalPrice: number;
  designType: "preset" | "upload";
  designPreset: string | null;
  designUploadUrl: string;
  note: string;
  status:
    | "new"
    | "contacted"
    | "in_production"
    | "shipped"
    | "completed"
    | "cancelled";
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
}

export interface SystemOrder {
  id: string;
  customerName: string;
  businessName: string;
  email: string;
  phone: string;
  planName: "Starter" | "Growth" | "Premium";
  billingCycle: "monthly" | "annual";
  note: string;
  source: "pricing_page" | "manual";
  status: "new" | "contacted" | "won" | "lost";
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
}

export interface UploadResult {
  downloadURL: string;
  fullPath: string;
}

export interface AuthContextState {
  loading: boolean;
  userProfile: UserProfile | null;
  restaurant: Restaurant | null;
}

export interface DashboardStats {
  categoryCount: number;
  menuItemCount: number;
  archivedCategoryCount: number;
  archivedMenuItemCount: number;
  promotionCount: number;
}
