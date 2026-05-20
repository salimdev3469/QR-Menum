import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { emptyLocalizedMap } from "@/lib/localized";
import { isPromotionLive } from "@/lib/menu-features";
import { firestoreDb } from "@/lib/firebase/client";
import { Promotion, PromotionScope } from "@/types";
import { translatePublicFields } from "@/services/translation-service";

interface PromotionInput {
  title: string;
  description: string;
  scope: PromotionScope;
  targetId: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

function promotionsCollection(restaurantId: string) {
  return collection(firestoreDb, "restaurants", restaurantId, "promotions");
}

function normalizePromotion(id: string, raw: Partial<Promotion>): Promotion {
  return {
    id,
    title: raw.title ?? "",
    description: raw.description ?? "",
    scope: raw.scope ?? "all",
    targetId: raw.targetId ?? null,
    startsAt: raw.startsAt ?? "",
    endsAt: raw.endsAt ?? "",
    isActive: raw.isActive === true,
    isArchived: raw.isArchived === true,
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? null,
    titleI18n: raw.titleI18n ?? emptyLocalizedMap(),
    descriptionI18n: raw.descriptionI18n ?? emptyLocalizedMap(),
  };
}

export async function listPromotions(restaurantId: string): Promise<Promotion[]> {
  const snapshot = await getDocs(promotionsCollection(restaurantId));
  return snapshot.docs
    .map((item) => normalizePromotion(item.id, item.data() as Partial<Promotion>))
    .sort((a, b) => {
      const aTime = a.startsAt ? new Date(a.startsAt).getTime() : 0;
      const bTime = b.startsAt ? new Date(b.startsAt).getTime() : 0;
      return bTime - aTime;
    });
}

export async function createPromotion(
  restaurantId: string,
  input: PromotionInput,
): Promise<string> {
  const promotionRef = doc(promotionsCollection(restaurantId));
  const translations = await translatePublicFields({
    title: input.title,
    description: input.description,
  });

  await setDoc(promotionRef, {
    id: promotionRef.id,
    title: input.title,
    description: input.description,
    scope: input.scope,
    targetId: input.scope === "all" ? null : input.targetId,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    isActive: input.isActive,
    isArchived: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    titleI18n: translations.title ?? emptyLocalizedMap(),
    descriptionI18n: translations.description ?? emptyLocalizedMap(),
  });

  return promotionRef.id;
}

export async function updatePromotion(
  restaurantId: string,
  promotionId: string,
  input: PromotionInput,
): Promise<void> {
  const promotionRef = doc(promotionsCollection(restaurantId), promotionId);
  const translations = await translatePublicFields({
    title: input.title,
    description: input.description,
  });

  await updateDoc(promotionRef, {
    title: input.title,
    description: input.description,
    scope: input.scope,
    targetId: input.scope === "all" ? null : input.targetId,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    isActive: input.isActive,
    updatedAt: serverTimestamp(),
    titleI18n: translations.title ?? emptyLocalizedMap(),
    descriptionI18n: translations.description ?? emptyLocalizedMap(),
  });
}

export async function setPromotionActiveState(
  restaurantId: string,
  promotionId: string,
  isActive: boolean,
): Promise<void> {
  const promotionRef = doc(promotionsCollection(restaurantId), promotionId);

  await updateDoc(promotionRef, {
    isActive,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePromotionPermanent(
  restaurantId: string,
  promotionId: string,
): Promise<void> {
  const promotionRef = doc(promotionsCollection(restaurantId), promotionId);
  await deleteDoc(promotionRef);
}

export async function listPublicPromotionsByRestaurant(
  restaurantId: string,
): Promise<Promotion[]> {
  const snapshot = await getDocs(
    query(
      promotionsCollection(restaurantId),
      where("isArchived", "==", false),
      where("isActive", "==", true),
    ),
  );

  return snapshot.docs
    .map((item) => normalizePromotion(item.id, item.data() as Partial<Promotion>))
    .filter((item) => isPromotionLive(item));
}
