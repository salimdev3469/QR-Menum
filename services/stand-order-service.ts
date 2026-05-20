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
import { STAND_UNIT_PRICE } from "@/lib/stand-pricing";
import { StandOrder } from "@/types";

interface CreateStandOrderInput {
  orderId?: string;
  customerName: string;
  businessName: string;
  email: string;
  phone: string;
  tableCount: number;
  designType: "preset" | "upload";
  designPreset: string | null;
  designUploadUrl: string;
  note?: string;
}

function standOrdersCollection() {
  return collection(firestoreDb, "standOrders");
}

function normalizeStandOrder(orderId: string, raw: Partial<StandOrder>): StandOrder {
  return {
    id: orderId,
    customerName: raw.customerName ?? "",
    businessName: raw.businessName ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    tableCount: typeof raw.tableCount === "number" ? raw.tableCount : 1,
    unitPrice: typeof raw.unitPrice === "number" ? raw.unitPrice : STAND_UNIT_PRICE,
    totalPrice: typeof raw.totalPrice === "number" ? raw.totalPrice : STAND_UNIT_PRICE,
    designType: raw.designType === "upload" ? "upload" : "preset",
    designPreset: raw.designPreset ?? null,
    designUploadUrl: raw.designUploadUrl ?? "",
    note: raw.note ?? "",
    status: raw.status ?? "new",
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? null,
  };
}

export async function createStandOrder(input: CreateStandOrderInput): Promise<string> {
  const orderRef = input.orderId
    ? doc(standOrdersCollection(), input.orderId)
    : doc(standOrdersCollection());
  const tableCount = Math.max(1, Math.floor(input.tableCount));
  const totalPrice = tableCount * STAND_UNIT_PRICE;

  await setDoc(orderRef, {
    id: orderRef.id,
    customerName: input.customerName.trim(),
    businessName: input.businessName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    tableCount,
    unitPrice: STAND_UNIT_PRICE,
    totalPrice,
    designType: input.designType,
    designPreset: input.designType === "preset" ? input.designPreset ?? null : null,
    designUploadUrl: input.designUploadUrl,
    note: input.note?.trim() ?? "",
    status: "new",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return orderRef.id;
}

export async function listStandOrders(): Promise<StandOrder[]> {
  const snapshot = await getDocs(query(standOrdersCollection(), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) =>
    normalizeStandOrder(item.id, item.data() as Partial<StandOrder>),
  );
}

export async function updateStandOrderStatus(
  orderId: string,
  status: StandOrder["status"],
): Promise<void> {
  const orderRef = doc(standOrdersCollection(), orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}
