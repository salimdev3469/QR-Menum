import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { normalizeVariationList, normalizeStringList } from "@/lib/menu-features";
import { firestoreDb } from "@/lib/firebase/client";
import { MenuItem, MenuItemVariation } from "@/types";
import { translatePublicFields } from "@/services/translation-service";

interface MenuItemInput {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  isDiscounted: boolean;
  isAvailable: boolean;
  sortOrder: number;
  imageUrls: string[];
  labels: string[];
  allergens: string[];
  variations: MenuItemVariation[];
}

function menuItemsCollection(restaurantId: string) {
  return collection(firestoreDb, "restaurants", restaurantId, "menuItems");
}

function normalizeMenuItem(itemId: string, raw: Partial<MenuItem>): MenuItem {
  return {
    id: itemId,
    categoryId: raw.categoryId ?? "",
    name: raw.name ?? "",
    description: raw.description ?? "",
    price: typeof raw.price === "number" ? raw.price : 0,
    discountPrice: typeof raw.discountPrice === "number" ? raw.discountPrice : null,
    isDiscounted: raw.isDiscounted === true,
    isAvailable: raw.isAvailable !== false,
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : 1,
    imageUrls: Array.isArray(raw.imageUrls) ? raw.imageUrls : [],
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? null,
    isArchived: raw.isArchived === true,
    archivedAt: raw.archivedAt ?? null,
    nameI18n: raw.nameI18n ?? { tr: raw.name ?? "", en: raw.name ?? "", ru: raw.name ?? "", ar: raw.name ?? "" },
    descriptionI18n:
      raw.descriptionI18n ??
      {
        tr: raw.description ?? "",
        en: raw.description ?? "",
        ru: raw.description ?? "",
        ar: raw.description ?? "",
      },
    labels: normalizeStringList(raw.labels, 8),
    allergens: normalizeStringList(raw.allergens, 16),
    variations: normalizeVariationList(raw.variations),
  };
}

export async function listMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const snapshot = await getDocs(
    query(menuItemsCollection(restaurantId), orderBy("sortOrder", "asc")),
  );

  return snapshot.docs.map((item) =>
    normalizeMenuItem(item.id, item.data() as Partial<MenuItem>),
  );
}

export async function createMenuItem(
  restaurantId: string,
  payload: MenuItemInput,
  menuItemId?: string,
) {
  const menuItemRef = menuItemId
    ? doc(menuItemsCollection(restaurantId), menuItemId)
    : doc(menuItemsCollection(restaurantId), crypto.randomUUID());
  const translations = await translatePublicFields({
    name: payload.name,
    description: payload.description,
  });

  await setDoc(menuItemRef, {
    id: menuItemRef.id,
    categoryId: payload.categoryId,
    name: payload.name,
    description: payload.description,
    price: payload.price,
    discountPrice: payload.discountPrice,
    isDiscounted: payload.isDiscounted,
    isAvailable: payload.isAvailable,
    sortOrder: payload.sortOrder,
    imageUrls: payload.imageUrls,
    labels: normalizeStringList(payload.labels, 8),
    allergens: normalizeStringList(payload.allergens, 16),
    variations: normalizeVariationList(payload.variations),
    isArchived: false,
    archivedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    nameI18n: translations.name,
    descriptionI18n: translations.description,
  });

  return menuItemRef.id;
}

export async function updateMenuItem(
  restaurantId: string,
  menuItemId: string,
  payload: MenuItemInput,
) {
  const menuItemRef = doc(menuItemsCollection(restaurantId), menuItemId);

  const translations = await translatePublicFields({
    name: payload.name,
    description: payload.description,
  });

  await updateDoc(menuItemRef, {
    categoryId: payload.categoryId,
    name: payload.name,
    description: payload.description,
    price: payload.price,
    discountPrice: payload.discountPrice,
    isDiscounted: payload.isDiscounted,
    isAvailable: payload.isAvailable,
    sortOrder: payload.sortOrder,
    imageUrls: payload.imageUrls,
    labels: normalizeStringList(payload.labels, 8),
    allergens: normalizeStringList(payload.allergens, 16),
    variations: normalizeVariationList(payload.variations),
    updatedAt: serverTimestamp(),
    nameI18n: translations.name,
    descriptionI18n: translations.description,
  });
}

export async function archiveMenuItem(restaurantId: string, menuItemId: string) {
  const menuItemRef = doc(menuItemsCollection(restaurantId), menuItemId);

  await updateDoc(menuItemRef, {
    isArchived: true,
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function restoreMenuItem(restaurantId: string, menuItemId: string) {
  const menuItemRef = doc(menuItemsCollection(restaurantId), menuItemId);

  await updateDoc(menuItemRef, {
    isArchived: false,
    archivedAt: null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMenuItemPermanent(restaurantId: string, menuItemId: string) {
  await deleteDoc(doc(menuItemsCollection(restaurantId), menuItemId));
}

export async function reorderMenuItems(restaurantId: string, ids: string[]): Promise<void> {
  const batch = writeBatch(firestoreDb);

  ids.forEach((id, index) => {
    const itemRef = doc(menuItemsCollection(restaurantId), id);
    batch.update(itemRef, {
      sortOrder: index + 1,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

export async function listPublicMenuItemsByRestaurant(
  restaurantId: string,
): Promise<MenuItem[]> {
  const snapshot = await getDocs(
    query(
      menuItemsCollection(restaurantId),
      where("isArchived", "==", false),
      orderBy("sortOrder", "asc"),
    ),
  );

  return snapshot.docs.map((item) =>
    normalizeMenuItem(item.id, item.data() as Partial<MenuItem>),
  );
}
