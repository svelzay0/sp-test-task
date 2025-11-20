import { defineStore } from "pinia";
import {
  type ItemLevel,
  type ItemProperty,
  type ItemRarity,
  type ItemSortKey,
  type ItemType,
  type ItemsRequestPayload,
  type MarketFilterType,
  type FilterPrice
} from "~/entities/item";

const DEFAULT_TYPES: ItemType[] = ["transport", "pet", "egg", "potion"];

type SortValue = ItemSortKey | `${ItemSortKey}-${"asc" | "desc"}`;

interface CatalogFiltersState {
  types: ItemType[];
  rarities: ItemRarity[];
  levels: ItemLevel[];
  abilities: ItemProperty[];
  sort: SortValue;
  page: number;
  amount: number;
  searchQuery: string;
  price: FilterPrice;
}

export const useCatalogFiltersStore = defineStore("catalogFilters", {
  state: (): CatalogFiltersState => ({
    types: [...DEFAULT_TYPES],
    rarities: [],
    levels: [],
    abilities: [],
    sort: "popularity",
    page: 1,
    amount: 72,
    searchQuery: "",
    price: {},
  }),

  getters: {
    requestPayload(state): ItemsRequestPayload {
      // Защита от undefined state
      if (!state || !state.types) {
        return {
          filter: {
            types: DEFAULT_TYPES.map((type) => ({ type })),
          },
          page: 1,
          amount: 72,
          currency: "usd",
          sort: { popularity: "desc" },
        };
      }

      const selectedTypes =
        (state.types && state.types.length > 0) ? state.types : [...DEFAULT_TYPES];

      if (!selectedTypes || !Array.isArray(selectedTypes)) {
        return {
          filter: {
            types: DEFAULT_TYPES.map((type) => ({ type })),
          },
          page: 1,
          amount: 72,
          currency: "usd",
          sort: { popularity: "desc" },
        };
      }

      const types: MarketFilterType[] = selectedTypes.map((type) => {
        const descriptor: MarketFilterType = { type };

        // Если выбрана хотя бы 1 редкость, добавляем rarities в каждый тип
        if (state.rarities && state.rarities.length > 0) {
          descriptor.rarities = [...state.rarities];
        }

        // Если выбрано хотя бы 1 свойство из default, neon, mega_neon, добавляем levels к типу pet
        if (type === "pet" && state.levels && state.levels.length > 0) {
          descriptor.levels = [...state.levels];
        }

        // Если выбрано flyable или rideable, добавляем properties к типу pet
        if (type === "pet" && state.abilities && state.abilities.length > 0) {
          const hasFlyable = state.abilities.includes("flyable");
          const hasRideable = state.abilities.includes("rideable");
          
          if (hasFlyable || hasRideable) {
            descriptor.properties = {
              missing: true,
              flyable: hasFlyable,
              rideable: hasRideable,
            };
          }
        }

        return descriptor;
      });

      // Парсим sort значение (может быть "price-asc", "price-desc", "popularity", "benefit")
      const sortValue = state.sort || "popularity";
      const [sortKey, sortDirection] = sortValue.includes("-")
        ? (sortValue.split("-") as [ItemSortKey, "asc" | "desc"])
        : [sortValue as ItemSortKey, "desc"];

      const filter: ItemsRequestPayload["filter"] = { types };

      if (state.searchQuery && state.searchQuery.trim()) {
        filter.name = state.searchQuery.trim();
      }

      const price: FilterPrice = {};
      if (state.price && state.price.min !== undefined && state.price.min !== null) {
        price.min = state.price.min;
      }
      if (state.price && state.price.max !== undefined && state.price.max !== null) {
        price.max = state.price.max;
      }
      if (Object.keys(price).length > 0) {
        filter.price = price;
      }

      const payload: ItemsRequestPayload = {
        filter,
        page: state.page,
        amount: state.amount,
        currency: "usd",
        sort: { [sortKey]: sortDirection },
      };

      return payload;
    },
  },

  actions: {
    toggleType(type: ItemType) {
      if (!this.types) {
        this.types = [...DEFAULT_TYPES];
      }
      if (this.types.includes(type)) {
        this.types = this.types.filter((current) => current !== type);
      } else {
        this.types.push(type);
      }
      this.resetPage();
    },

    toggleRarity(rarity: ItemRarity) {
      if (!this.rarities) {
        this.rarities = [];
      }
      if (this.rarities.includes(rarity)) {
        this.rarities = this.rarities.filter((item) => item !== rarity);
      } else {
        this.rarities.push(rarity);
      }
      this.resetPage();
    },

    toggleLevel(level: ItemLevel) {
      if (!this.levels) {
        this.levels = [];
      }
      if (this.levels.includes(level)) {
        this.levels = this.levels.filter((item) => item !== level);
      } else {
        this.levels.push(level);
      }
      this.resetPage();
    },

    toggleAbility(property: ItemProperty) {
      if (!this.abilities) {
        this.abilities = [];
      }
      if (this.abilities.includes(property)) {
        this.abilities = this.abilities.filter((item) => item !== property);
      } else {
        this.abilities.push(property);
      }
      this.resetPage();
    },

    setSort(sort: SortValue) {
      this.sort = sort;
      this.resetPage();
    },

    setAmount(amount: number) {
      this.amount = amount;
      this.resetPage();
    },

    nextPage() {
      this.page += 1;
    },

    resetPage() {
      this.page = 1;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
      this.resetPage();
    },

    setPriceMin(price: number | undefined) {
      if (!this.price) {
        this.price = {};
      }
      this.price.min = price;
      this.resetPage();
    },

    setPriceMax(price: number | undefined) {
      if (!this.price) {
        this.price = {};
      }
      this.price.max = price;
      this.resetPage();
    },

    reset() {
      this.types = [...DEFAULT_TYPES];
      this.rarities = [];
      this.levels = [];
      this.abilities = [];
      this.sort = "popularity";
      this.page = 1;
      this.amount = 72;
      this.searchQuery = "";
      this.price = {};
    },
  },
});

