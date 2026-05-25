import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { firestoreDb } from "@/lib/firebase/client";
import { TableOrder, TableOrderItem } from "@/types";

interface CreateTableOrderItemInput {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface CreateTableOrderInput {
  restaurantId: string;
  tableNumber: number;
  floorNumber: number;
  note?: string;
  items: CreateTableOrderItemInput[];
}

function tableOrdersCollection(restaurantId: string) {
  return collection(firestoreDb, "restaurants", restaurantId, "tableOrders");
}

function normalizeOrderItem(raw: Partial<TableOrderItem>): TableOrderItem | null {
  const quantity = typeof raw.quantity === "number" ? Math.max(1, Math.floor(raw.quantity)) : 0;
  const unitPrice = typeof raw.unitPrice === "number" && Number.isFinite(raw.unitPrice)
    ? Math.max(0, raw.unitPrice)
    : 0;
  const menuItemId = typeof raw.menuItemId === "string" ? raw.menuItemId.trim() : "";
  const name = typeof raw.name === "string" ? raw.name.trim() : "";

  if (!menuItemId || !name || quantity < 1) {
    return null;
  }

  return {
    menuItemId,
    name,
    unitPrice,
    quantity,
    totalPrice: unitPrice * quantity,
  };
}

function normalizeTableOrder(orderId: string, raw: Partial<TableOrder>): TableOrder {
  const normalizedItems = Array.isArray(raw.items)
    ? raw.items
      .map((item) => normalizeOrderItem(item))
      .filter((item): item is TableOrderItem => item !== null)
    : [];
  const itemCount = normalizedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = normalizedItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return {
    id: orderId,
    tableNumber:
      typeof raw.tableNumber === "number" && Number.isFinite(raw.tableNumber)
        ? Math.max(1, Math.floor(raw.tableNumber))
        : 1,
    floorNumber:
      typeof raw.floorNumber === "number" && Number.isFinite(raw.floorNumber)
        ? Math.max(1, Math.floor(raw.floorNumber))
        : 1,
    note: typeof raw.note === "string" ? raw.note : "",
    items: normalizedItems,
    itemCount,
    totalAmount,
    status: raw.status === "closed" ? "closed" : "open",
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? null,
    resolvedAt: raw.resolvedAt ?? null,
  };
}

export async function createTableOrder(input: CreateTableOrderInput): Promise<string> {
  const tableNumber = Math.floor(input.tableNumber);
  const floorNumber = Math.floor(input.floorNumber);

  if (!Number.isFinite(tableNumber) || tableNumber < 1) {
    throw new Error("Geçerli bir masa seçin.");
  }

  if (!Number.isFinite(floorNumber) || floorNumber < 1) {
    throw new Error("Geçerli bir kat seçin.");
  }

  const normalizedItems = input.items
    .map((item) =>
      normalizeOrderItem({
        menuItemId: item.menuItemId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      }))
    .filter((item): item is TableOrderItem => item !== null);

  if (normalizedItems.length === 0) {
    throw new Error("Sipariş için en az bir ürün seçin.");
  }

  const itemCount = normalizedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = normalizedItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const orderRef = doc(tableOrdersCollection(input.restaurantId));
  const note = input.note?.trim() ?? "";

  await setDoc(orderRef, {
    id: orderRef.id,
    tableNumber,
    floorNumber,
    note: note.slice(0, 500),
    items: normalizedItems,
    itemCount,
    totalAmount,
    status: "open",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    resolvedAt: null,
  });

  return orderRef.id;
}

export function subscribeOpenTableOrders(
  restaurantId: string,
  onChange: (orders: TableOrder[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const ordersQuery = query(tableOrdersCollection(restaurantId), where("status", "==", "open"));

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      onChange(
        snapshot.docs.map((item) =>
          normalizeTableOrder(item.id, item.data() as Partial<TableOrder>),
        ),
      );
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
}

export async function resolveTableOrder(restaurantId: string, orderId: string): Promise<void> {
  const orderRef = doc(tableOrdersCollection(restaurantId), orderId);

  await updateDoc(orderRef, {
    status: "closed",
    resolvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function resolveTableOrders(restaurantId: string, orderIds: string[]): Promise<void> {
  const uniqueIds = Array.from(new Set(orderIds.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return;
  }

  if (uniqueIds.length === 1) {
    await resolveTableOrder(restaurantId, uniqueIds[0]);
    return;
  }

  const batch = writeBatch(firestoreDb);

  uniqueIds.forEach((orderId) => {
    const orderRef = doc(tableOrdersCollection(restaurantId), orderId);
    batch.update(orderRef, {
      status: "closed",
      resolvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}
