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
import { WaiterCall } from "@/types";

function waiterCallsCollection(restaurantId: string) {
  return collection(firestoreDb, "restaurants", restaurantId, "waiterCalls");
}

function normalizeWaiterCall(callId: string, raw: Partial<WaiterCall>): WaiterCall {
  return {
    id: callId,
    tableNumber:
      typeof raw.tableNumber === "number" && Number.isFinite(raw.tableNumber)
        ? Math.max(1, Math.floor(raw.tableNumber))
        : 1,
    isActive: raw.isActive === true,
    requestedAt: raw.requestedAt ?? null,
    resolvedAt: raw.resolvedAt ?? null,
    updatedAt: raw.updatedAt ?? null,
  };
}

export async function createWaiterCall(restaurantId: string, tableNumber: number): Promise<void> {
  const normalizedTableNumber = Math.floor(tableNumber);

  if (!Number.isFinite(normalizedTableNumber) || normalizedTableNumber < 1) {
    throw new Error("Geçerli bir masa numarası seçin.");
  }

  const waiterCallRef = doc(waiterCallsCollection(restaurantId));

  await setDoc(waiterCallRef, {
    id: waiterCallRef.id,
    tableNumber: normalizedTableNumber,
    isActive: true,
    requestedAt: serverTimestamp(),
    resolvedAt: null,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeActiveWaiterCalls(
  restaurantId: string,
  onChange: (calls: WaiterCall[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const callsQuery = query(waiterCallsCollection(restaurantId), where("isActive", "==", true));

  return onSnapshot(
    callsQuery,
    (snapshot) => {
      onChange(
        snapshot.docs.map((item) =>
          normalizeWaiterCall(item.id, item.data() as Partial<WaiterCall>),
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

export async function resolveWaiterCall(restaurantId: string, callId: string): Promise<void> {
  const waiterCallRef = doc(waiterCallsCollection(restaurantId), callId);

  await updateDoc(waiterCallRef, {
    isActive: false,
    resolvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function resolveWaiterCalls(restaurantId: string, callIds: string[]): Promise<void> {
  const uniqueIds = Array.from(new Set(callIds.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return;
  }

  if (uniqueIds.length === 1) {
    await resolveWaiterCall(restaurantId, uniqueIds[0]);
    return;
  }

  const batch = writeBatch(firestoreDb);

  uniqueIds.forEach((callId) => {
    const waiterCallRef = doc(waiterCallsCollection(restaurantId), callId);
    batch.update(waiterCallRef, {
      isActive: false,
      resolvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}
