// Technical constants and abbreviations (LDAP, PDF, SSO, etc.).
// Data: public/locales/.constants/consts.json
import { parseLocaleConstants } from "./parse-locale-constants";
import rawData from "../../../public/locales/.constants/consts.json";

const { get, keys } = parseLocaleConstants(rawData as Record<string, string>);

/** Get a constant name, optionally localized. */
export const getConstName = get;

/** Set of all constant key names (for tests). */
export const constKeys = keys;
