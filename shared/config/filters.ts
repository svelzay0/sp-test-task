import type { ItemType } from "~/entities/item";

export const DEFAULT_TYPES: ItemType[] = ["transport", "pet", "egg", "potion"] as const;

export const DEFAULT_ITEMS_PER_PAGE = 72;
export const DEFAULT_CURRENCY = "usd";
export const DEFAULT_SORT = "popularity" as const;

