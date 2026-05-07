// Shared slug generator: transliterates Mongolian Cyrillic to Latin
// so URLs are always safe ASCII. If result is empty, returns a safe fallback.

const CYRILLIC_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'ye', 'ё': 'yo',
  'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'i', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'ө': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
  'у': 'u', 'ү': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
  'щ': 'sch', 'ъ': '', 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
}

export function transliterate(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map(ch => (ch in CYRILLIC_MAP ? CYRILLIC_MAP[ch] : ch))
    .join('')
}

/**
 * Generate a URL-safe slug.
 * - Transliterates Mongolian Cyrillic → Latin
 * - Lowercases, replaces whitespace with `-`
 * - Strips anything that isn't [a-z0-9-]
 * - If addTimestamp is true, appends Date.now() for uniqueness
 * - Always returns a non-empty string
 */
export function generateSlug(name: string, addTimestamp: boolean = false): string {
  const transliterated = transliterate(name || '')
  let slug = transliterated
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!slug) slug = 'item-' + Date.now().toString(36)
  if (addTimestamp) slug = `${slug}-${Date.now()}`
  return slug
}
