import type { ItemRarity } from "~/entities/item";

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: "var(--color-rarity-common)",
  uncommon: "var(--color-rarity-uncommon)",
  rare: "var(--color-rarity-rare)",
  ultra_rare: "var(--color-rarity-ultra)",
  legendary: "var(--color-rarity-legendary)",
} as const;

export const DEFAULT_RARITY_COLOR = "var(--color-rarity-default)";

