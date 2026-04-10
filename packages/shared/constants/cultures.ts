// Language display names in their native script.
// These are locale-independent — the same for all UI languages.
// Data lives in cultures.json to avoid non-ASCII in .ts files.
import cultureNames from "./cultures.json";

export const getCultureLabel = (code: string): string =>
  (cultureNames as Record<string, string>)[code] ?? code;

export default cultureNames;
