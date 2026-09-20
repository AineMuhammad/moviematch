// A small curated set of common TMDB watch-region codes, not the full ISO country list.
export const ROOM_REGIONS = [
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'IN', label: 'India' },
  { code: 'JP', label: 'Japan' },
] as const;

export const DEFAULT_ROOM_REGION = 'US';
