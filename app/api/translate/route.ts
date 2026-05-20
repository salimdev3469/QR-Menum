import { NextRequest, NextResponse } from "next/server";

import { SUPPORTED_LOCALES } from "@/lib/constants";
import { getGeminiClient } from "@/lib/firebase/server";
import { LocalizedTextMap } from "@/types";

export const runtime = "nodejs";

function fallbackTranslations(fields: Record<string, string>): Record<string, LocalizedTextMap> {
  return Object.entries(fields).reduce<Record<string, LocalizedTextMap>>((acc, [key, value]) => {
    acc[key] = {
      tr: value,
      en: value,
      ru: value,
      ar: value,
    };

    return acc;
  }, {});
}

function parseModelJson(output: string): unknown {
  const fenced = output.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return JSON.parse(fenced[1]);
  }

  return JSON.parse(output);
}

export async function POST(request: NextRequest) {
  let fields: Record<string, string> = {};

  try {
    const body = (await request.json()) as {
      fields?: Record<string, string>;
      locales?: string[];
    };

    fields = body.fields ?? {};

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ translatedFields: {} });
    }

    const client = getGeminiClient();

    if (!client) {
      return NextResponse.json({ translatedFields: fallbackTranslations(fields) });
    }

    const prompt = `
You are a translation engine.
Translate each field value into Turkish (tr), English (en), Russian (ru), and Arabic (ar).
Return JSON only in this shape:
{
  "translatedFields": {
    "fieldName": {
      "tr": "...",
      "en": "...",
      "ru": "...",
      "ar": "..."
    }
  }
}
Do not include markdown or explanations.
Source fields:\n${JSON.stringify(fields)}
`.trim();

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      return NextResponse.json({ translatedFields: fallbackTranslations(fields) });
    }

    const parsed = parseModelJson(text) as {
      translatedFields?: Record<string, Partial<LocalizedTextMap>>;
    };

    const translatedFields = Object.entries(fields).reduce<Record<string, LocalizedTextMap>>(
      (acc, [field, sourceText]) => {
        const modelValue = parsed.translatedFields?.[field] ?? {};

        acc[field] = {
          tr: modelValue.tr?.trim() || sourceText,
          en: modelValue.en?.trim() || sourceText,
          ru: modelValue.ru?.trim() || sourceText,
          ar: modelValue.ar?.trim() || sourceText,
        };

        return acc;
      },
      {},
    );

    for (const field of Object.keys(translatedFields)) {
      for (const locale of SUPPORTED_LOCALES) {
        if (!translatedFields[field][locale]) {
          translatedFields[field][locale] = fields[field];
        }
      }
    }

    return NextResponse.json({ translatedFields });
  } catch {
    return NextResponse.json({
      translatedFields: fallbackTranslations(fields),
    });
  }
}
