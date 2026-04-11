// Brand and product names that are constant across all languages.
// These never need translation — they are always the same string.
import brandNames from "./brand-names.json";

export const getBrandName = (key: string): string =>
  (brandNames as Record<string, string>)[key] ?? key;

export default brandNames;
