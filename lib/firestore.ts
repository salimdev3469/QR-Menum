import { CollectionReference, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export function toTypedDoc<T>(doc: QueryDocumentSnapshot<DocumentData>): T {
  return {
    id: doc.id,
    ...doc.data(),
  } as T;
}

export function withId<T extends object>(id: string, data: T): T & { id: string } {
  return {
    id,
    ...data,
  };
}

export function typedCollection<T>(ref: CollectionReference<DocumentData>) {
  return ref as CollectionReference<T & DocumentData>;
}
