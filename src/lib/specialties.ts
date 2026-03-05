export const SPECIALTY_LABELS: Record<string, string> = {
  WEDDINGS_EVENTS: 'افراح ومناسبات',
  COMMERCIAL_EVENTS: 'ايفنتات تجارية',
  GOVERNMENT_SHOWS: 'عروض حكومية',
  COMMERCIAL_MODEL_UGC_PRODUCTS: 'تصوير تجاري كمودل للملابس وتصوير منتجات UGC',
  CINEMATIC: 'تصوير سينمائي',
  MOBILE: 'تصوير جوال',
}

export const SPECIALTY_KEYS = Object.keys(SPECIALTY_LABELS)

export function parseSpecialties(json: string): string[] {
  try {
    return JSON.parse(json) as string[]
  } catch {
    return []
  }
}
