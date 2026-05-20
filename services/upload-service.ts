import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { compressImageClient } from "@/lib/image";
import { IMAGE_LIMITS } from "@/lib/constants";
import { firebaseAuth, firebaseStorage } from "@/lib/firebase/client";
import { UploadResult } from "@/types";

async function ensureFreshAuthToken(): Promise<void> {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error("İşlem için önce giriş yapmalısınız.");
  }

  await currentUser.getIdToken(true);
}

interface UploadFileOptions {
  requireAuth?: boolean;
}

async function uploadFile(path: string, file: File, options?: UploadFileOptions): Promise<UploadResult> {
  const requireAuth = options?.requireAuth !== false;

  if (requireAuth) {
    await ensureFreshAuthToken();
  }

  const compressed = await compressImageClient(file);

  if (compressed.size > IMAGE_LIMITS.MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(
      `Görsel sıkıştırma sonrası ${IMAGE_LIMITS.MAX_SIZE_MB}MB sınırını aşıyor. Lütfen daha küçük bir görsel seçin.`,
    );
  }

  const fileRef = ref(firebaseStorage, path);
  try {
    await uploadBytes(fileRef, compressed, { contentType: "image/webp" });
  } catch (error) {
    const typedError = error as {
      code?: string;
      message?: string;
      serverResponse?: string;
    } | null;
    const firebaseCode = typedError?.code;
    const serverResponse = typedError?.serverResponse;
    const rawMessage = typedError?.message;

    if (firebaseCode === "storage/unauthorized") {
      const debugDetails =
        process.env.NODE_ENV !== "production"
          ? ` [storageCode=${firebaseCode ?? "unknown"} message=${rawMessage ?? "none"} serverResponse=${serverResponse ?? "none"}]`
          : "";
      throw new Error(
        `Storage yetkisi reddedildi. Lütfen çıkış yapıp tekrar giriş yapın. Sorun devam ederse App Check (Storage enforcement) ve proje faturalandırmasını kontrol edin.${debugDetails}`,
      );
    }

    throw error;
  }

  const downloadURL = await getDownloadURL(fileRef);

  return {
    downloadURL,
    fullPath: fileRef.fullPath,
  };
}

export async function uploadLogo(restaurantId: string, file: File) {
  return uploadFile(`restaurants/${restaurantId}/logo/logo.webp`, file);
}

export async function uploadBackground(restaurantId: string, file: File) {
  return uploadFile(`restaurants/${restaurantId}/background/background.webp`, file);
}

export async function uploadGalleryImage(restaurantId: string, imageId: string, file: File) {
  return uploadFile(`restaurants/${restaurantId}/gallery/${imageId}.webp`, file);
}

export async function uploadMenuItemImage(
  restaurantId: string,
  menuItemId: string,
  imageId: string,
  file: File,
) {
  return uploadFile(
    `restaurants/${restaurantId}/menu-items/${menuItemId}/${imageId}.webp`,
    file,
  );
}

export async function uploadStandOrderDesign(orderId: string, file: File) {
  return uploadFile(`stand-orders/${orderId}/design.webp`, file, { requireAuth: false });
}

export async function deleteFileByPath(path: string) {
  await ensureFreshAuthToken();
  const fileRef = ref(firebaseStorage, path);
  await deleteObject(fileRef);
}

export async function deleteFileByUrl(downloadUrl: string) {
  await ensureFreshAuthToken();
  const fileRef = ref(firebaseStorage, downloadUrl);
  await deleteObject(fileRef);
}

export async function deleteFilesByUrls(downloadUrls: string[]) {
  await Promise.allSettled(downloadUrls.map((item) => deleteFileByUrl(item)));
}
