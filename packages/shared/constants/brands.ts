// Brand and product names (ONLYOFFICE, DocSpace, providers, storage services).
// Data: public/locales/.constants/brands.json
import { parseLocaleConstants } from "./parse-locale-constants";
import rawData from "../../../public/locales/.constants/brands.json";

const { get, keys } = parseLocaleConstants(rawData as Record<string, string>);

/** Get a brand name, optionally localized. */
export const getBrandName = get;

/** Set of all brand key names (for tests). */
export const brandKeys = keys;
