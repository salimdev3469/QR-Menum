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

import { firestoreDb } from "@/lib/firebase/client";
import { Category } from "@/types";
import { translatePublicFields } from "@/services/translation-service";

interface CategoryInput {
  name: string;
  sortOrder: number;
  isActive: boolean;
}

function categoriesCollection(restaurantId: string) {
  return collection(firestoreDb, "restaurants", restaurantId, "categories");
}

function menuItemsCollection(restaurantId: string) {
  return collection(firestoreDb, "restaurants", restaurantId, "menuItems");
}

export async function listCategories(restaurantId: string): Promise<Category[]> {
  const snapshot = await getDocs(
    query(categoriesCollection(restaurantId), orderBy("sortOrder", "asc")),
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Category[];
}

export async function listPublicCategories(restaurantId: string): Promise<Category[]> {
  const snapshot = await getDocs(
    query(
      categoriesCollection(restaurantId),
      where("isArchived", "==", false),
      where("isActive", "==", true),
      orderBy("sortOrder", "asc"),
    ),
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Category[];
}

export async function createCategory(restaurantId: string, payload: CategoryInput) {
  const categoryRef = doc(categoriesCollection(restaurantId));
  const translations = await translatePublicFields({ name: payload.name });

  await setDoc(categoryRef, {
    id: categoryRef.id,
    name: payload.name,
    sortOrder: payload.sortOrder,
    isActive: payload.isActive,
    isArchived: false,
    archivedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    nameI18n: translations.name,
  });
}

export async function updateCategory(
  restaurantId: string,
  categoryId: string,
  payload: CategoryInput,
) {
  const categoryRef = doc(categoriesCollection(restaurantId), categoryId);
  const translations = await translatePublicFields({ name: payload.name });

  await updateDoc(categoryRef, {
    name: payload.name,
    sortOrder: payload.sortOrder,
    isActive: payload.isActive,
    updatedAt: serverTimestamp(),
    nameI18n: translations.name,
  });
}

export async function archiveCategory(restaurantId: string, categoryId: string) {
  const categoryRef = doc(categoriesCollection(restaurantId), categoryId);

  await updateDoc(categoryRef, {
    isArchived: true,
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function restoreCategory(restaurantId: string, categoryId: string) {
  const categoryRef = doc(categoriesCollection(restaurantId), categoryId);

  await updateDoc(categoryRef, {
    isArchived: false,
    archivedAt: null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategoryPermanent(restaurantId: string, categoryId: string) {
  const itemsSnapshot = await getDocs(
    query(
      menuItemsCollection(restaurantId),
      where("categoryId", "==", categoryId),
      where("isArchived", "==", false),
    ),
  );

  if (!itemsSnapshot.empty) {
    throw new Error("Bu kategoriye bağlı aktif ürünler var. Önce ürünleri taşıyın veya arşivleyin.");
  }

  const categoryRef = doc(categoriesCollection(restaurantId), categoryId);
  await deleteDoc(categoryRef);
}

export async function reorderCategories(restaurantId: string, ids: string[]): Promise<void> {
  const batch = writeBatch(firestoreDb);

  ids.forEach((id, index) => {
    const categoryRef = doc(categoriesCollection(restaurantId), id);
    batch.update(categoryRef, {
      sortOrder: index + 1,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}
