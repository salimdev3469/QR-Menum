const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

export function slugifyTr(value: string): string {
  const normalized = value
    .split("")
    .map((char) => TURKISH_CHAR_MAP[char] ?? char)
    .join("")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
  sourceName: string,
  slugExists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const baseSlug = slugifyTr(sourceName) || `mekan-${Date.now()}`;

  if (!(await slugExists(baseSlug))) {
    return baseSlug;
  }

  let index = 2;
  while (index <= 9999) {
    const candidate = `${baseSlug}-${index}`;
    if (!(await slugExists(candidate))) {
      return candidate;
    }
    index += 1;
  }

  return `${baseSlug}-${Date.now()}`;
}
