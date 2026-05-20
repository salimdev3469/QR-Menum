import { EMPTY_LOCALIZED_TEXT_MAP, SUPPORTED_LOCALES } from "@/lib/constants";
import { LocalizedTextMap } from "@/types";

interface TranslationResponse {
  translatedFields: Record<string, LocalizedTextMap>;
}

function fallbackTranslation(fields: Record<string, string>): Record<string, LocalizedTextMap> {
  return Object.entries(fields).reduce<Record<string, LocalizedTextMap>>((acc, [field, text]) => {
    acc[field] = {
      ...EMPTY_LOCALIZED_TEXT_MAP,
      tr: text,
      en: text,
      ru: text,
      ar: text,
    };
    return acc;
  }, {});
}

export async function translatePublicFields(
  fields: Record<string, string>,
): Promise<Record<string, LocalizedTextMap>> {
  if (Object.keys(fields).length === 0) {
    return {};
  }

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, locales: SUPPORTED_LOCALES }),
    });

    if (!response.ok) {
      return fallbackTranslation(fields);
    }

    const data = (await response.json()) as TranslationResponse;

    if (!data?.translatedFields) {
      return fallbackTranslation(fields);
    }

    return data.translatedFields;
  } catch {
    return fallbackTranslation(fields);
  }
}
