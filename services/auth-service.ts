import {
  createUserWithEmailAndPassword,
  User,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { firebaseAuth, firestoreDb } from "@/lib/firebase/client";
import { toUserFriendlyError } from "@/lib/firebase-error";
import { createRestaurant } from "@/services/restaurant-service";
import { UserProfile } from "@/types";

interface RegisterBusinessInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessCode: string;
  restaurantName: string;
  managerName: string;
  restaurantPhone: string;
  address: string;
}

const FIRESTORE_WRITE_RETRY_COUNT = 3;

function isPermissionDeniedError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = (error as { code?: string }).code;
  return code === "permission-denied";
}

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function runWithFirestoreWriteRetry(
  user: User,
  operation: () => Promise<void>,
): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt < FIRESTORE_WRITE_RETRY_COUNT; attempt += 1) {
    try {
      await operation();
      return;
    } catch (error) {
      lastError = error;

      if (!isPermissionDeniedError(error) || attempt === FIRESTORE_WRITE_RETRY_COUNT - 1) {
        throw error;
      }

      await user.getIdToken(true);
      await wait(300 * (attempt + 1));
    }
  }

  if (isPermissionDeniedError(lastError)) {
    throw new Error(
      "Firestore yetki hatası. Rules deploy edildiğini ve doğru Firebase projesine bağlı olduğunuzu kontrol edin.",
    );
  }

  throw lastError;
}

export async function registerBusiness(input: RegisterBusinessInput): Promise<void> {
  let credential: Awaited<ReturnType<typeof createUserWithEmailAndPassword>>;

  try {
    credential = await createUserWithEmailAndPassword(firebaseAuth, input.email, input.password);
  } catch (error) {
    throw new Error(
      toUserFriendlyError(error, "Kayıt başlatılamadı. Bilgilerinizi kontrol edip tekrar deneyin."),
    );
  }

  try {
    await credential.user.getIdToken(true);

    const userId = credential.user.uid;
    const restaurantId = userId;

    await runWithFirestoreWriteRetry(credential.user, async () => {
      await createRestaurant({
        restaurantId,
        ownerUserId: userId,
        name: input.restaurantName,
        managerName: input.managerName,
        phone: input.restaurantPhone,
        address: input.address,
      });
    });

    const userDocRef = doc(firestoreDb, "users", userId);

    await runWithFirestoreWriteRetry(credential.user, async () => {
      await setDoc(userDocRef, {
        id: userId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        businessCode: input.businessCode,
        restaurantId,
        role: "owner",
        createdAt: serverTimestamp(),
      });
    });
  } catch (error) {
    try {
      await credential.user.delete();
    } catch {
      // ignore rollback failure
    }

    throw new Error(
      toUserFriendlyError(error, "Kayıt tamamlanamadı. Lütfen tekrar deneyin."),
    );
  }
}

export async function loginWithBusinessCode(
  email: string,
  password: string,
  businessCode: string,
): Promise<UserProfile> {
  let credential: Awaited<ReturnType<typeof signInWithEmailAndPassword>>;

  try {
    credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  } catch (error) {
    throw new Error(
      toUserFriendlyError(error, "Giriş bilgileri doğrulanamadı. Lütfen tekrar deneyin."),
    );
  }

  try {
    const profileRef = doc(firestoreDb, "users", credential.user.uid);
    const profileSnapshot = await getDoc(profileRef);

    if (!profileSnapshot.exists()) {
      await signOut(firebaseAuth);
      throw new Error("Kullanıcı profili bulunamadı.");
    }

    const profile = profileSnapshot.data() as Partial<UserProfile>;

    if ((profile.businessCode ?? "").trim() !== businessCode.trim()) {
      await signOut(firebaseAuth);
      throw new Error("İşletme kodu hatalı.");
    }

    return {
      id: profile.id ?? credential.user.uid,
      name: profile.name ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      businessCode: profile.businessCode ?? "",
      restaurantId: profile.restaurantId ?? credential.user.uid,
      role: profile.role ?? "owner",
      createdAt: profile.createdAt ?? null,
    };
  } catch (error) {
    throw new Error(
      toUserFriendlyError(error, "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin."),
    );
  }
}

export async function logout(): Promise<void> {
  await signOut(firebaseAuth);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const profileRef = doc(firestoreDb, "users", userId);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    return null;
  }

  const profile = snapshot.data() as Partial<UserProfile>;

  return {
    id: profile.id ?? userId,
    name: profile.name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    businessCode: profile.businessCode ?? "",
    restaurantId: profile.restaurantId ?? userId,
    role: profile.role ?? "owner",
    createdAt: profile.createdAt ?? null,
  };
}

export async function updateBusinessCode(userId: string, businessCode: string): Promise<void> {
  const profileRef = doc(firestoreDb, "users", userId);
  await updateDoc(profileRef, { businessCode });
}
