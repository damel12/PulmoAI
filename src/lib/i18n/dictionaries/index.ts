import type { Locale } from "../config";
import { en } from "./en";
import { kk } from "./kk";
import { type Dict, ru } from "./ru";

export type { Dict };

// Словари маленькие, поэтому все три лежат в одном бандле: клиент переключает язык без загрузки.
const DICTS: Record<Locale, Dict> = { ru, kk, en };

export function getDict(locale: Locale): Dict {
  return DICTS[locale];
}
