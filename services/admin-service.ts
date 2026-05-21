import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { firestoreDb } from "@/lib/firebase/client";
import { normalizePlan } from "@/lib/plan";
import { FirestoreDate, RestaurantPlan, StandOrder, SystemOrder, UserProfile } from "@/types";

export interface AdminOverview {
  customerCount: number;
  activeRestaurantCount: number;
  totalRestaurantCount: number;
  menuItemCount: number;
  standOrderCount: number;
  newStandOrderCount: number;
  systemOrderCount: number;
  newSystemOrderCount: number;
}

export interface AdminCustomerRecord {
  profile: UserProfile;
  restaurantName: string;
  restaurantInitialPlan: RestaurantPlan;
  restaurantPlan: RestaurantPlan;
  restaurantCreatedAt: FirestoreDate;
  restaurantIsActive: boolean;
  tableCount: number;
}

function normalizeUser(userId: string, raw: Partial<UserProfile>): UserProfile {
  return {
    id: userId,
    name: raw.name ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    businessCode: raw.businessCode ?? "",
    restaurantId: raw.restaurantId ?? userId,
    role: raw.role ?? "owner",
    createdAt: raw.createdAt ?? null,
  };
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const [
    usersSnapshotResult,
    activeRestaurantsSnapshotResult,
    restaurantsSnapshotResult,
    menuItemsSnapshotResult,
    standOrdersSnapshotResult,
    newStandOrdersSnapshotResult,
    systemOrdersSnapshotResult,
    newSystemOrdersSnapshotResult,
  ] = await Promise.allSettled([
    getDocs(collection(firestoreDb, "users")),
    getDocs(query(collection(firestoreDb, "restaurants"), where("isActive", "==", true))),
    getDocs(collection(firestoreDb, "restaurants")),
    getDocs(query(collectionGroup(firestoreDb, "menuItems"), where("isArchived", "==", false))),
    getDocs(collection(firestoreDb, "standOrders")),
    getDocs(query(collection(firestoreDb, "standOrders"), where("status", "==", "new"))),
    getDocs(collection(firestoreDb, "systemOrders")),
    getDocs(query(collection(firestoreDb, "systemOrders"), where("status", "==", "new"))),
  ]);

  if (usersSnapshotResult.status === "rejected") {
    console.error("[AdminOverview] users query failed:", usersSnapshotResult.reason);
  }
  if (activeRestaurantsSnapshotResult.status === "rejected") {
    console.error("[AdminOverview] active restaurants query failed:", activeRestaurantsSnapshotResult.reason);
  }
  if (restaurantsSnapshotResult.status === "rejected") {
    console.error("[AdminOverview] restaurants query failed:", restaurantsSnapshotResult.reason);
  }
  if (menuItemsSnapshotResult.status === "rejected") {
    console.error("[AdminOverview] menuItems query failed:", menuItemsSnapshotResult.reason);
  }
  if (standOrdersSnapshotResult.status === "rejected") {
    console.error("[AdminOverview] standOrders query failed:", standOrdersSnapshotResult.reason);
  }
  if (newStandOrdersSnapshotResult.status === "rejected") {
    console.error("[AdminOverview] new standOrders query failed:", newStandOrdersSnapshotResult.reason);
  }
  if (systemOrdersSnapshotResult.status === "rejected") {
    console.error("[AdminOverview] systemOrders query failed:", systemOrdersSnapshotResult.reason);
  }
  if (newSystemOrdersSnapshotResult.status === "rejected") {
    console.error("[AdminOverview] new systemOrders query failed:", newSystemOrdersSnapshotResult.reason);
  }

  const usersSnapshot = usersSnapshotResult.status === "fulfilled" ? usersSnapshotResult.value : null;
  const activeRestaurantsSnapshot = activeRestaurantsSnapshotResult.status === "fulfilled"
    ? activeRestaurantsSnapshotResult.value
    : null;
  const restaurantsSnapshot = restaurantsSnapshotResult.status === "fulfilled"
    ? restaurantsSnapshotResult.value
    : null;
  const menuItemsSnapshot = menuItemsSnapshotResult.status === "fulfilled"
    ? menuItemsSnapshotResult.value
    : null;
  const standOrdersSnapshot = standOrdersSnapshotResult.status === "fulfilled"
    ? standOrdersSnapshotResult.value
    : null;
  const newStandOrdersSnapshot = newStandOrdersSnapshotResult.status === "fulfilled"
    ? newStandOrdersSnapshotResult.value
    : null;
  const systemOrdersSnapshot = systemOrdersSnapshotResult.status === "fulfilled"
    ? systemOrdersSnapshotResult.value
    : null;
  const newSystemOrdersSnapshot = newSystemOrdersSnapshotResult.status === "fulfilled"
    ? newSystemOrdersSnapshotResult.value
    : null;

  const customerCount = usersSnapshot
    ? usersSnapshot.docs.reduce((acc, docSnap) => {
      const user = normalizeUser(docSnap.id, docSnap.data() as Partial<UserProfile>);
      return user.role === "admin" ? acc : acc + 1;
    }, 0)
    : 0;

  return {
    customerCount,
    activeRestaurantCount: activeRestaurantsSnapshot?.size ?? 0,
    totalRestaurantCount: restaurantsSnapshot?.size ?? 0,
    menuItemCount: menuItemsSnapshot?.size ?? 0,
    standOrderCount: standOrdersSnapshot?.size ?? 0,
    newStandOrderCount: newStandOrdersSnapshot?.size ?? 0,
    systemOrderCount: systemOrdersSnapshot?.size ?? 0,
    newSystemOrderCount: newSystemOrdersSnapshot?.size ?? 0,
  };
}

export async function listAdminCustomers(): Promise<AdminCustomerRecord[]> {
  const [usersSnapshot, restaurantsSnapshot] = await Promise.all([
    getDocs(collection(firestoreDb, "users")),
    getDocs(collection(firestoreDb, "restaurants")),
  ]);

  const restaurantMap = restaurantsSnapshot.docs.reduce<
    Record<
      string,
      {
        name: string;
        initialPlan: RestaurantPlan;
        plan: RestaurantPlan;
        isActive: boolean;
        tableCount: number;
        createdAt: FirestoreDate;
      }
    >
  >((acc, docSnap) => {
    const raw = docSnap.data() as {
      name?: unknown;
      initialPlan?: unknown;
      plan?: unknown;
      isActive?: unknown;
      tableCount?: unknown;
      createdAt?: unknown;
    };
    const rawCreatedAt = raw.createdAt;

    acc[docSnap.id] = {
      name: typeof raw.name === "string" ? raw.name : "",
      initialPlan: normalizePlan(raw.initialPlan),
      plan: normalizePlan(raw.plan),
      isActive: raw.isActive !== false,
      tableCount:
        typeof raw.tableCount === "number" && Number.isFinite(raw.tableCount)
          ? Math.max(0, Math.floor(raw.tableCount))
          : 0,
      createdAt:
        typeof rawCreatedAt === "string"
        || rawCreatedAt instanceof Date
        || (typeof rawCreatedAt === "object" && rawCreatedAt !== null && "toDate" in rawCreatedAt)
          ? (rawCreatedAt as FirestoreDate)
          : null,
    };

    return acc;
  }, {});

  return usersSnapshot.docs
    .map((item) => normalizeUser(item.id, item.data() as Partial<UserProfile>))
    .filter((item) => item.role !== "admin")
    .map((profile) => {
      const restaurant = restaurantMap[profile.restaurantId];

      return {
        profile,
        restaurantName: restaurant?.name ?? "",
        restaurantInitialPlan: restaurant?.initialPlan ?? "starter",
        restaurantPlan: restaurant?.plan ?? "starter",
        restaurantCreatedAt: restaurant?.createdAt ?? null,
        restaurantIsActive: restaurant?.isActive ?? false,
        tableCount: restaurant?.tableCount ?? 0,
      } satisfies AdminCustomerRecord;
    })
    .sort((a, b) => {
      const aTime = typeof a.profile.createdAt === "object" && a.profile.createdAt && "toDate" in a.profile.createdAt
        ? a.profile.createdAt.toDate().getTime()
        : 0;
      const bTime = typeof b.profile.createdAt === "object" && b.profile.createdAt && "toDate" in b.profile.createdAt
        ? b.profile.createdAt.toDate().getTime()
        : 0;
      return bTime - aTime;
    });
}

export async function updateCustomerRestaurantPlan(
  restaurantId: string,
  plan: RestaurantPlan,
): Promise<void> {
  const restaurantRef = doc(firestoreDb, "restaurants", restaurantId);
  const normalizedPlan = normalizePlan(plan);

  await updateDoc(restaurantRef, {
    plan: normalizedPlan,
    updatedAt: serverTimestamp(),
  });

  if (normalizedPlan === "premium") {
    return;
  }

  const promotionsRef = collection(firestoreDb, "restaurants", restaurantId, "promotions");
  const activePromotionsSnapshot = await getDocs(
    query(
      promotionsRef,
      where("isArchived", "==", false),
      where("isActive", "==", true),
    ),
  );

  if (activePromotionsSnapshot.empty) {
    return;
  }

  const batch = writeBatch(firestoreDb);
  activePromotionsSnapshot.docs.forEach((promotionDoc) => {
    batch.update(promotionDoc.ref, {
      isActive: false,
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

export async function listRecentStandOrders(limit = 5): Promise<StandOrder[]> {
  const snapshot = await getDocs(collection(firestoreDb, "standOrders"));
  const sorted = snapshot.docs
    .map((item) => item.data() as StandOrder)
    .sort((a, b) => {
      const aTime = typeof a.createdAt === "object" && a.createdAt && "toDate" in a.createdAt
        ? a.createdAt.toDate().getTime()
        : 0;
      const bTime = typeof b.createdAt === "object" && b.createdAt && "toDate" in b.createdAt
        ? b.createdAt.toDate().getTime()
        : 0;
      return bTime - aTime;
    });

  return sorted.slice(0, limit);
}

export async function listRecentSystemOrders(limit = 5): Promise<SystemOrder[]> {
  const snapshot = await getDocs(collection(firestoreDb, "systemOrders"));
  const sorted = snapshot.docs
    .map((item) => item.data() as SystemOrder)
    .sort((a, b) => {
      const aTime = typeof a.createdAt === "object" && a.createdAt && "toDate" in a.createdAt
        ? a.createdAt.toDate().getTime()
        : 0;
      const bTime = typeof b.createdAt === "object" && b.createdAt && "toDate" in b.createdAt
        ? b.createdAt.toDate().getTime()
        : 0;
      return bTime - aTime;
    });

  return sorted.slice(0, limit);
}
