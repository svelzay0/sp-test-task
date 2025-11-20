import type { Ref } from "vue";
export type ItemType = "transport" | "pet" | "egg" | "potion";
export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "ultra_rare"
  | "legendary";
export type ItemLevel = "default" | "neon" | "mega_neon";
export type ItemProperty = "flyable" | "rideable";

export type ItemSortKey = "price" | "popularity" | "benefit";
export type ItemSortDirection = "asc" | "desc";

export interface Item {
  id: number;
  goodId: string;
  name: string;
  type: ItemType;
  realName: string;
  imageId: string;
  imageUri: string;
  subtype: string | null;
  age: string | null;
  rare: ItemRarity;
  pumping: ItemLevel;
  flyable: boolean;
  rideable: boolean;
  price: number;
  avgPrice: number;
}

export interface MarketFilterType {
  type: ItemType;
  rarities?: ItemRarity[];
  levels?: ItemLevel[];
  properties?: {
    missing: boolean;
    flyable?: boolean;
    rideable?: boolean;
  };
}

export interface FilterPrice {
    min?: number
    max?: number
  }

export interface ItemsRequestPayload {
  filter: {
    types: MarketFilterType[];
    name?: string;
    price?: FilterPrice;
  };
  page: number;
  amount: number;
  currency: string;
  sort: Partial<Record<ItemSortKey, "desc" | "asc">>;
}

export interface ItemsResponse {
  status: boolean;
  items: Item[];
  count: number;
  currency: string;
}

export type ItemsPage<TItem = Item> = {
  items: TItem[];
  count: number;
  [key: string]: unknown;
};

/** vue-query в `data` */
export type InfinitePages<TItem = Item> = {
  pages: ItemsPage<TItem>[];
  pageParams?: unknown[];
};

/**
 * Обёртка, возвращаемая стором поверх useInfiniteQuery.
 * Generic TItem позволяет типизировать содержимое items.
 */
export type ItemsQueryWrapper<TItem = Item> = {
  data: Ref<InfinitePages<TItem> | undefined>;
  error: Ref<Error | null>;
  isPending: Ref<boolean>;
  isFetchingNextPage: Ref<boolean>;
  hasNextPage: Ref<boolean>;
  fetchNextPage: () => Promise<unknown>;
  refetch: () => Promise<unknown>;
};
