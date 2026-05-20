const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "E-posta veya şifre hatalı.",
  "auth/invalid-login-credentials": "E-posta veya şifre hatalı.",
  "auth/user-not-found": "Bu e-posta ile kayıtlı bir kullanıcı bulunamadı.",
  "auth/wrong-password": "Şifre hatalı.",
  "auth/invalid-email": "Geçerli bir e-posta adresi girin.",
  "auth/email-already-in-use": "Bu e-posta adresi zaten kullanımda.",
  "auth/weak-password": "Şifre çok zayıf. Daha güçlü bir şifre deneyin.",
  "auth/user-disabled": "Bu kullanıcı hesabı devre dışı bırakılmış.",
  "auth/too-many-requests": "Çok fazla başarısız deneme var. Lütfen biraz sonra tekrar deneyin.",
  "auth/network-request-failed": "Ağ bağlantısı sorunu. İnternetinizi kontrol edip tekrar deneyin.",
  "auth/operation-not-allowed": "Bu giriş yöntemi şu anda aktif değil.",
  "auth/missing-password": "Şifre alanı boş bırakılamaz.",
  "auth/missing-email": "E-posta alanı boş bırakılamaz.",
  "permission-denied": "Bu işlem için yetkiniz yok.",
  "firestore/permission-denied": "Bu işlem için yetkiniz yok.",
  "storage/unauthorized": "Dosya yükleme yetkisi bulunamadı.",
  "failed-precondition": "İşlem şu anda gerçekleştirilemiyor. Lütfen ayarları kontrol edin.",
};

function readErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const code = (error as { code?: string }).code;
  if (typeof code === "string" && code.length > 0) {
    return code;
  }

  const message = (error as { message?: string }).message;
  if (typeof message === "string") {
    const authCodeMatch = message.match(/\((auth\/[a-z-]+)\)/i);
    if (authCodeMatch?.[1]) {
      return authCodeMatch[1];
    }
  }

  return null;
}

function looksLikeRawFirebaseMessage(message: string): boolean {
  return (
    message.includes("Firebase: Error") ||
    message.includes("auth/") ||
    message.includes("permission-denied")
  );
}

export function toUserFriendlyError(
  error: unknown,
  fallbackMessage = "İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.",
): string {
  const code = readErrorCode(error);

  if (code && FIREBASE_ERROR_MESSAGES[code]) {
    return FIREBASE_ERROR_MESSAGES[code];
  }

  if (error instanceof Error) {
    if (looksLikeRawFirebaseMessage(error.message)) {
      return fallbackMessage;
    }

    return error.message;
  }

  return fallbackMessage;
}
