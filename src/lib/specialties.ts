export const SPECIALTY_LABELS: Record<string, string> = {
  WEDDINGS_EVENTS: 'افراح ومناسبات',
  COMMERCIAL_EVENTS: 'ايفنتات تجارية',
  GOVERNMENT_SHOWS: 'عروض حكومية',
  COMMERCIAL_MODEL_UGC_PRODUCTS: 'تصوير تجاري كمودل للملابس وتصوير منتجات UGC',
  CINEMATIC: 'تصوير سينمائي',
  MOBILE: 'تصوير جوال',
}

export const SPECIALTY_KEYS = Object.keys(SPECIALTY_LABELS)

/**
 * Safely parse a JSON-encoded specialties string from the database.
 * Returns [] for any invalid, null, or non-array value so a single
 * bad row never crashes the browse page.
 *
 * Edge cases handled:
 *   null / undefined     → []
 *   ""                   → [] (JSON.parse("") throws → catch)
 *   "null"               → [] (JSON.parse("null") === null, not an array)
 *   "42" / "true"        → [] (not an array)
 *   "[]"                 → []
 *   '["WEDDINGS_EVENTS"]'→ ["WEDDINGS_EVENTS"]
 */
export function parseSpecialties(json: string | null | undefined): string[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
