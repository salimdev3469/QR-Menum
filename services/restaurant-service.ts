import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { emptyLocalizedMap } from "@/lib/localized";
import { normalizePlan } from "@/lib/plan";
import { normalizeMenuDesign, normalizeSocialLinks } from "@/lib/menu-features";
import { generateUniqueSlug } from "@/lib/slug";
import { firestoreDb } from "@/lib/firebase/client";
import {
  DashboardStats,
  GalleryImage,
  MenuDesign,
  Restaurant,
  RestaurantPlan,
  SocialLinks,
} from "@/types";
import { translatePublicFields } from "@/services/translation-service";

interface CreateRestaurantInput {
  restaurantId: string;
  ownerUserId: string;
  name: string;
  managerName: string;
  phone: string;
  address: string;
}

interface UpdateRestaurantInput {
  name: string;
  managerName: string;
  phone: string;
  address: string;
  isActive: boolean;
  tableCount: number;
  menuDesign: MenuDesign;
  socialLinks: SocialLinks;
}

function normalizeTableCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(500, Math.floor(value)));
}

function normalizeRestaurant(restaurantId: string, raw: Partial<Restaurant>): Restaurant {
  return {
    id: restaurantId,
    ownerUserId: raw.ownerUserId ?? "",
    name: raw.name ?? "",
    managerName: raw.managerName ?? "",
    phone: raw.phone ?? "",
    address: raw.address ?? "",
    slug: raw.slug ?? "",
    logoUrl: raw.logoUrl ?? "",
    backgroundImageUrl: raw.backgroundImageUrl ?? "",
    isActive: raw.isActive !== false,
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? null,
    nameI18n: raw.nameI18n ?? emptyLocalizedMap(),
    addressI18n: raw.addressI18n ?? emptyLocalizedMap(),
    menuDesign: normalizeMenuDesign(raw.menuDesign),
    socialLinks: normalizeSocialLinks(raw.socialLinks),
    showGalleryOnPublic: raw.showGalleryOnPublic === true,
    initialPlan: normalizePlan(raw.initialPlan),
    plan: normalizePlan(raw.plan),
    tableCount: normalizeTableCount(raw.tableCount),
  };
}

async function slugExists(slug: string, excludeRestaurantId?: string): Promise<boolean> {
  const restaurantsRef = collection(firestoreDb, "restaurants");
  const snapshot = await getDocs(
    query(
      restaurantsRef,
      where("slug", "==", slug),
      where("isActive", "==", true),
      limit(1),
    ),
  );

  if (snapshot.empty) {
    return false;
  }

  if (!excludeRestaurantId) {
    return true;
  }

  const [docSnap] = snapshot.docs;
  return docSnap.id !== excludeRestaurantId;
}

export async function createRestaurant(input: CreateRestaurantInput): Promise<Restaurant> {
  const restaurantsRef = collection(firestoreDb, "restaurants");
  const restaurantRef = doc(restaurantsRef, input.restaurantId);

  const slug = await generateUniqueSlug(input.name, (candidate) => slugExists(candidate));

  const translations = await translatePublicFields({
    name: input.name,
    address: input.address,
  });

  const restaurantData = {
    id: restaurantRef.id,
    ownerUserId: input.ownerUserId,
    name: input.name,
    managerName: input.managerName,
    phone: input.phone,
    address: input.address,
    slug,
    logoUrl: "",
    backgroundImageUrl: "",
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    nameI18n: translations.name ?? emptyLocalizedMap(),
    addressI18n: translations.address ?? emptyLocalizedMap(),
    menuDesign: normalizeMenuDesign(undefined),
    socialLinks: normalizeSocialLinks(undefined),
    showGalleryOnPublic: false,
    initialPlan: "starter" as RestaurantPlan,
    plan: "starter" as RestaurantPlan,
    tableCount: 0,
  };

  await setDoc(restaurantRef, restaurantData);

  const createdRestaurant = await getRestaurantById(restaurantRef.id);
  if (createdRestaurant) {
    return createdRestaurant;
  }

  return normalizeRestaurant(restaurantRef.id, {
    ...restaurantData,
    createdAt: null,
    updatedAt: null,
  });
}

export async function getRestaurantById(restaurantId: string): Promise<Restaurant | null> {
  const restaurantRef = doc(firestoreDb, "restaurants", restaurantId);
  const snapshot = await getDoc(restaurantRef);

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeRestaurant(snapshot.id, snapshot.data() as Partial<Restaurant>);
}

export async function getRestaurantByOwnerId(ownerUserId: string): Promise<Restaurant | null> {
  const restaurantsRef = collection(firestoreDb, "restaurants");
  const snapshot = await getDocs(
    query(restaurantsRef, where("ownerUserId", "==", ownerUserId), limit(1)),
  );

  if (snapshot.empty) {
    return null;
  }

  const restaurant = snapshot.docs[0];
  return normalizeRestaurant(restaurant.id, restaurant.data() as Partial<Restaurant>);
}

export async function updateRestaurant(
  restaurantId: string,
  input: UpdateRestaurantInput,
): Promise<void> {
  const restaurantRef = doc(firestoreDb, "restaurants", restaurantId);
  const current = await getDoc(restaurantRef);

  if (!current.exists()) {
    throw new Error("İşletme bulunamadı.");
  }

  const currentData = normalizeRestaurant(restaurantId, current.data() as Partial<Restaurant>);
  const shouldRefreshSlug = currentData.name.trim() !== input.name.trim();

  const slug = shouldRefreshSlug
    ? await generateUniqueSlug(input.name, (candidate) => slugExists(candidate, restaurantId))
    : currentData.slug;

  const translations = await translatePublicFields({
    name: input.name,
    address: input.address,
  });

  await updateDoc(restaurantRef, {
    name: input.name,
    managerName: input.managerName,
    phone: input.phone,
    address: input.address,
    slug,
    isActive: input.isActive,
    updatedAt: serverTimestamp(),
    nameI18n: translations.name ?? currentData.nameI18n,
    addressI18n: translations.address ?? currentData.addressI18n,
    menuDesign: normalizeMenuDesign(input.menuDesign),
    socialLinks: normalizeSocialLinks(input.socialLinks),
    tableCount: normalizeTableCount(input.tableCount),
  });
}

export async function updateRestaurantPlanByAdmin(
  restaurantId: string,
  plan: RestaurantPlan,
): Promise<void> {
  const restaurantRef = doc(firestoreDb, "restaurants", restaurantId);

  await updateDoc(restaurantRef, {
    plan: normalizePlan(plan),
    updatedAt: serverTimestamp(),
  });
}

export async function updateRestaurantImageUrls(
  restaurantId: string,
  payload: Partial<Pick<Restaurant, "logoUrl" | "backgroundImageUrl">>,
): Promise<void> {
  const restaurantRef = doc(firestoreDb, "restaurants", restaurantId);

  await updateDoc(restaurantRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function updateRestaurantGalleryVisibility(
  restaurantId: string,
  showGalleryOnPublic: boolean,
): Promise<void> {
  const restaurantRef = doc(firestoreDb, "restaurants", restaurantId);
  await updateDoc(restaurantRef, {
    showGalleryOnPublic,
    updatedAt: serverTimestamp(),
  });
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const restaurantsRef = collection(firestoreDb, "restaurants");
  const snapshot = await getDocs(
    query(
      restaurantsRef,
      where("slug", "==", slug),
      where("isActive", "==", true),
      limit(1),
    ),
  );

  if (snapshot.empty) {
    return null;
  }

  const docSnap = snapshot.docs[0];
  return normalizeRestaurant(docSnap.id, docSnap.data() as Partial<Restaurant>);
}

export async function getDashboardStats(restaurantId: string): Promise<DashboardStats> {
  const categoriesRef = collection(firestoreDb, "restaurants", restaurantId, "categories");
  const menuItemsRef = collection(firestoreDb, "restaurants", restaurantId, "menuItems");
  const promotionsRef = collection(firestoreDb, "restaurants", restaurantId, "promotions");

  const [
    categoriesSnapshot,
    archivedCategoriesSnapshot,
    menuItemsSnapshot,
    archivedMenuItemsSnapshot,
    promotionsSnapshot,
  ] = await Promise.all([
    getDocs(query(categoriesRef, where("isArchived", "==", false))),
    getDocs(query(categoriesRef, where("isArchived", "==", true))),
    getDocs(query(menuItemsRef, where("isArchived", "==", false))),
    getDocs(query(menuItemsRef, where("isArchived", "==", true))),
    getDocs(query(promotionsRef, where("isArchived", "==", false))),
  ]);

  return {
    categoryCount: categoriesSnapshot.size,
    archivedCategoryCount: archivedCategoriesSnapshot.size,
    menuItemCount: menuItemsSnapshot.size,
    archivedMenuItemCount: archivedMenuItemsSnapshot.size,
    promotionCount: promotionsSnapshot.size,
  };
}

export async function listGallery(restaurantId: string): Promise<GalleryImage[]> {
  const galleryRef = collection(firestoreDb, "restaurants", restaurantId, "gallery");
  const snapshot = await getDocs(query(galleryRef, orderBy("sortOrder", "asc")));

  return snapshot.docs.map((item) => {
    const raw = item.data() as Partial<GalleryImage>;
    return {
      id: item.id,
      imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : "",
      sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : 0,
      createdAt: raw.createdAt ?? null,
    };
  });
}

export async function addGalleryImage(
  restaurantId: string,
  imageUrl: string,
  sortOrder: number,
  imageId?: string,
): Promise<string> {
  const galleryRef = collection(firestoreDb, "restaurants", restaurantId, "gallery");
  const imageRef = imageId ? doc(galleryRef, imageId) : doc(galleryRef);

  await setDoc(imageRef, {
    id: imageRef.id,
    imageUrl,
    sortOrder,
    createdAt: serverTimestamp(),
  });

  return imageRef.id;
}

export async function deleteGalleryImage(restaurantId: string, imageId: string): Promise<void> {
  const imageRef = doc(firestoreDb, "restaurants", restaurantId, "gallery", imageId);
  await deleteDoc(imageRef);
}

export async function reorderGalleryImages(
  restaurantId: string,
  imageIds: string[],
): Promise<void> {
  const batch = writeBatch(firestoreDb);

  imageIds.forEach((id, index) => {
    const imageRef = doc(firestoreDb, "restaurants", restaurantId, "gallery", id);
    batch.update(imageRef, {
      sortOrder: index + 1,
    });
  });

  await batch.commit();
}
