import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { firestoreDb } from "@/lib/firebase/client";
import { SystemOrder } from "@/types";

interface CreateSystemOrderInput {
  orderId?: string;
  customerName: string;
  businessName: string;
  email: string;
  phone: string;
  planName: "Starter" | "Growth" | "Premium";
  billingCycle: "monthly" | "annual";
  note?: string;
  source?: "pricing_page" | "manual";
}

function systemOrdersCollection() {
  return collection(firestoreDb, "systemOrders");
}

function normalizeSystemOrder(orderId: string, raw: Partial<SystemOrder>): SystemOrder {
  return {
    id: orderId,
    customerName: raw.customerName ?? "",
    businessName: raw.businessName ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    planName:
      raw.planName === "Growth" || raw.planName === "Premium"
        ? raw.planName
        : "Starter",
    billingCycle: raw.billingCycle === "annual" ? "annual" : "monthly",
    note: raw.note ?? "",
    source: raw.source ?? "pricing_page",
    status: raw.status ?? "new",
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? null,
  };
}

export async function createSystemOrder(input: CreateSystemOrderInput): Promise<string> {
  const orderRef = input.orderId
    ? doc(systemOrdersCollection(), input.orderId)
    : doc(systemOrdersCollection());

  await setDoc(orderRef, {
    id: orderRef.id,
    customerName: input.customerName.trim(),
    businessName: input.businessName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    planName: input.planName,
    billingCycle: input.billingCycle,
    note: input.note?.trim() ?? "",
    source: input.source ?? "pricing_page",
    status: "new",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return orderRef.id;
}

export async function listSystemOrders(): Promise<SystemOrder[]> {
  const snapshot = await getDocs(query(systemOrdersCollection(), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) =>
    normalizeSystemOrder(item.id, item.data() as Partial<SystemOrder>),
  );
}

export async function updateSystemOrderStatus(
  orderId: string,
  status: SystemOrder["status"],
): Promise<void> {
  const orderRef = doc(systemOrdersCollection(), orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}
