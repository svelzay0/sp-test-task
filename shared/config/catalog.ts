import type {
  ItemLevel,
  ItemProperty,
  ItemRarity,
  ItemType,
} from "~/entities/item";

export interface OptionDescriptor<T extends string> {
  value: T;
  label: string;
  helper?: string;
  color?: string;
  icon?: string;
}

export const ITEM_TYPE_OPTIONS: OptionDescriptor<ItemType>[] = [
  { value: "transport", label: "Транспорт" },
  { value: "pet", label: "Питомцы" },
  { value: "egg", label: "Яйца" },
  { value: "potion", label: "Зелья" },
];

export const RARITY_OPTIONS: OptionDescriptor<ItemRarity>[] = [
  { value: "common", label: "Common", color: "var(--color-rarity-common)" },
  { value: "uncommon", label: "Uncommon", color: "var(--color-rarity-uncommon)" },
  { value: "rare", label: "Rare", color: "var(--color-rarity-rare)" },
  { value: "ultra_rare", label: "Ultra", color: "var(--color-rarity-ultra)" },
  { value: "legendary", label: "Legend", color: "var(--color-rarity-legendary)" },
];

export const LEVEL_OPTIONS: OptionDescriptor<ItemLevel>[] = [
  { value: "default", label: "Обычный" },
  { value: "neon", label: "Неон" },
  { value: "mega_neon", label: "Мега-неон" },
];

export const ABILITY_OPTIONS: OptionDescriptor<ItemProperty>[] = [
  { value: "flyable", label: "Флай" },
  { value: "rideable", label: "Райд" },
];

export { SORT_OPTIONS, type SortOption } from "./sort";

