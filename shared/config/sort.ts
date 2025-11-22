export interface SortOption {
  value: string;
  label: string;
  icon: "star" | "tag" | "arrow-up" | "arrow-down";
  color: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "popularity", label: "Популярность", icon: "star", color: "#3b82f6" },
  { value: "benefit", label: "Выгода", icon: "tag", color: "#f97316" },
  { value: "price-asc", label: "Цена", icon: "arrow-up", color: "#22c55e" },
  { value: "price-desc", label: "Цена", icon: "arrow-down", color: "#ef4444" },
] as const;

