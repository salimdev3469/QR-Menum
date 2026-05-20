"use client";

import { useEffect, useRef } from "react";

import { DEFAULT_LOCALE } from "@/lib/constants";
import { getStaticUiTranslation } from "@/lib/ui-static-translations";
import { useLocale } from "@/hooks/use-locale";
import { SupportedLocale } from "@/types";

type TranslatableAttr = "placeholder" | "title" | "aria-label";

type TranslationCache = Partial<Record<SupportedLocale, Record<string, string>>>;

type TextTarget = {
  type: "text";
  node: Text;
  source: string;
  leading: string;
  trailing: string;
};

type AttrTarget = {
  type: "attr";
  element: Element;
  attr: TranslatableAttr;
  source: string;
};

type Target = TextTarget | AttrTarget;

const CACHE_KEY = "qr-ui-translation-cache-v2";
const ATTRIBUTES: TranslatableAttr[] = ["placeholder", "title", "aria-label"];
const BATCH_SIZE = 30;

const textSourceMap = new WeakMap<Text, string>();
const attrSourceMap = new WeakMap<Element, Partial<Record<TranslatableAttr, string>>>();

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function shouldTranslate(value: string): boolean {
  const text = value.trim();

  if (text.length < 2) {
    return false;
  }

  if (/^https?:\/\//i.test(text) || /^www\./i.test(text)) {
    return false;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(text)) {
    return false;
  }

  if (/^[\d\s.,:;()\[\]{}%+-]+$/.test(text)) {
    return false;
  }

  return true;
}

function splitEdgeWhitespace(raw: string): { core: string; leading: string; trailing: string } {
  const match = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);

  if (!match) {
    return { core: raw.trim(), leading: "", trailing: "" };
  }

  return {
    leading: match[1] ?? "",
    core: (match[2] ?? "").trim(),
    trailing: match[3] ?? "",
  };
}

function readCache(): TranslationCache {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as TranslationCache;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function writeCache(cache: TranslationCache): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore storage errors
  }
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function fetchTranslations(
  sourceTexts: string[],
  locale: SupportedLocale,
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};

  if (sourceTexts.length === 0 || locale === DEFAULT_LOCALE) {
    return result;
  }

  const fields = sourceTexts.reduce<Record<string, string>>((acc, text, index) => {
    acc[`f${index}`] = text;
    return acc;
  }, {});

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields, locales: [locale] }),
  });

  if (!response.ok) {
    return result;
  }

  const data = (await response.json()) as {
    translatedFields?: Record<string, Partial<Record<SupportedLocale, string>>>;
  };

  for (const [fieldKey, localizedMap] of Object.entries(data.translatedFields ?? {})) {
    const textIndex = Number(fieldKey.replace(/^f/, ""));
    if (!Number.isInteger(textIndex) || textIndex < 0 || textIndex >= sourceTexts.length) {
      continue;
    }

    const source = sourceTexts[textIndex];
    const translated = localizedMap[locale]?.trim();
    if (translated) {
      result[source] = translated;
    }
  }

  return result;
}

function collectTargets(root: ParentNode): Target[] {
  const targets: Target[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    const textNode = current as Text;
    const parent = textNode.parentElement;

    if (
      parent
      && !parent.closest("script, style, noscript, textarea, [data-no-auto-translate]")
    ) {
      const source = textSourceMap.get(textNode) ?? textNode.textContent ?? "";
      if (!textSourceMap.has(textNode)) {
        textSourceMap.set(textNode, source);
      }

      const { core, leading, trailing } = splitEdgeWhitespace(source);

      if (core && shouldTranslate(core)) {
        targets.push({
          type: "text",
          node: textNode,
          source: core,
          leading,
          trailing,
        });
      }
    }

    current = walker.nextNode();
  }

  const elements = root.querySelectorAll("input, textarea, button, a, img, [title], [aria-label]");

  for (const element of elements) {
    if (element.closest("[data-no-auto-translate]")) {
      continue;
    }

    for (const attr of ATTRIBUTES) {
      const rawAttrValue = element.getAttribute(attr);
      if (!rawAttrValue) {
        continue;
      }

      const cacheForElement = attrSourceMap.get(element) ?? {};
      if (!(attr in cacheForElement)) {
        cacheForElement[attr] = rawAttrValue;
        attrSourceMap.set(element, cacheForElement);
      }

      const source = cacheForElement[attr] ?? rawAttrValue;
      const normalized = normalizeText(source);
      if (!normalized || !shouldTranslate(normalized)) {
        continue;
      }

      targets.push({
        type: "attr",
        element,
        attr,
        source: normalized,
      });
    }
  }

  return targets;
}

function applyTranslations(targets: Target[], translations: Record<string, string>, locale: SupportedLocale): void {
  for (const target of targets) {
    if (locale === DEFAULT_LOCALE) {
      if (target.type === "text") {
        const nextText = `${target.leading}${target.source}${target.trailing}`;
        if (target.node.textContent !== nextText) {
          target.node.textContent = nextText;
        }
      } else {
        const currentValue = target.element.getAttribute(target.attr);
        if (currentValue !== target.source) {
          target.element.setAttribute(target.attr, target.source);
        }
      }
      continue;
    }

    const translated = translations[target.source];
    if (!translated) {
      continue;
    }

    if (target.type === "text") {
      const nextText = `${target.leading}${translated}${target.trailing}`;
      if (target.node.textContent !== nextText) {
        target.node.textContent = nextText;
      }
    } else {
      const currentValue = target.element.getAttribute(target.attr);
      if (currentValue !== translated) {
        target.element.setAttribute(target.attr, translated);
      }
    }
  }
}

export function UiTranslatorProvider() {
  const { locale } = useLocale();
  const processingRef = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    let cancelled = false;
    let mutationTimer: ReturnType<typeof setTimeout> | null = null;

    const translateDom = async () => {
      if (processingRef.current || cancelled) {
        return;
      }

      processingRef.current = true;

      try {
        const targets = collectTargets(document.body);

        if (targets.length === 0) {
          return;
        }

        const uniqueSources = Array.from(new Set(targets.map((target) => target.source)));

        if (locale === DEFAULT_LOCALE) {
          applyTranslations(targets, {}, locale);
          return;
        }

        const cache = readCache();
        const localeCache = cache[locale] ?? {};
        const translations: Record<string, string> = {};
        const missing: string[] = [];

        for (const source of uniqueSources) {
          const staticTranslation = getStaticUiTranslation(source, locale);
          if (staticTranslation) {
            translations[source] = staticTranslation;
            continue;
          }

          const cached = localeCache[source];
          if (cached) {
            translations[source] = cached;
            continue;
          }

          missing.push(source);
        }

        if (missing.length > 0) {
          for (const chunk of chunkArray(missing, BATCH_SIZE)) {
            if (cancelled) {
              break;
            }

            try {
              const chunkResult = await fetchTranslations(chunk, locale);
              for (const [source, translated] of Object.entries(chunkResult)) {
                if (translated) {
                  translations[source] = translated;
                  localeCache[source] = translated;
                }
              }
            } catch {
              // ignore network errors and keep untranslated text
            }
          }

          cache[locale] = localeCache;
          writeCache(cache);
        }

        applyTranslations(targets, translations, locale);
      } finally {
        processingRef.current = false;
      }
    };

    const scheduleTranslate = () => {
      if (mutationTimer) {
        clearTimeout(mutationTimer);
      }

      mutationTimer = setTimeout(() => {
        void translateDom();
      }, 80);
    };

    const observer = new MutationObserver(() => {
      scheduleTranslate();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRIBUTES,
    });

    void translateDom();

    return () => {
      cancelled = true;
      if (mutationTimer) {
        clearTimeout(mutationTimer);
      }
      observer.disconnect();
    };
  }, [locale]);

  return null;
}
