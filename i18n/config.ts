export type Locale = (typeof locales)[number];

export const locales = ["tr", "en", "de"] as const;
export const defaultLocale: Locale = "tr";
