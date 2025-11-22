<template>
  <section class="catalog-layout">
    <ClientOnly>
      <Teleport to="body">
        <transition name="drawer">
          <div
            v-if="isFiltersOpen && isMobile"
            class="filters-overlay"
            @click.self="closeFilters"
          >
            <aside class="catalog-filters-drawer">
              <header class="catalog-filters-drawer__head">
                <h2>Фильтры</h2>
                <button type="button" class="close-btn" @click="closeFilters">
                  ✕
                </button>
              </header>
              <LazyCatalogFilters />
            </aside>
          </div>
        </transition>
      </Teleport>
    </ClientOnly>

    <LazyCatalogFilters class="catalog-layout__filters" />

    <div class="catalog-layout__content">
      <section class="catalog-hero glass-panel">
        <div class="catalog-hero__wrapper">
          <LiveFeed class="catalog-live-feed" />
        </div>
      </section>

      <div class="catalog-filters__group">
        <TypePills :filter-types="filterTypes" />

        <div class="search-sort-row">
          <ClientOnly>
            <button
              v-if="isMobile"
              type="button"
              class="filters-toggle-btn"
              @click="openFilters"
            >
              <img
                src="/assets/icons/filter-icon.svg"
                alt="Filters"
                width="20"
                height="20"
              />
            </button>
          </ClientOnly>

          <SearchBar
            :model-value="searchQuery"
            @update:model-value="searchQuery = $event"
            @search="handleSearch"
          />

          <SortDropdown
            :current-sort="currentSort"
            @update:current-sort="currentSort = $event"
          />
        </div>

        <FiltersToolbar
          :total-items="totalItems"
          :filter-types="filterTypes"
          :type-options-length="typeOptions.length"
        />
      </div>

      <SkeletonGrid
        v-if="itemsQuery.isPending.value && !itemsQuery.isFetchingNextPage.value && showSkeleton"
        :amount="amount ?? DEFAULT_ITEMS_PER_PAGE"
      />

      <ErrorState
        v-else-if="itemsQuery?.error?.value"
        @refetch="refetch"
      />

      <ItemsGrid
        v-else
        :items="items"
      />

      <EmptyState
        v-if="!items.length && !itemsQuery?.isPending?.value"
      />

      <div
        v-if="itemsQuery?.hasNextPage?.value"
        ref="loadMoreTrigger"
        class="load-more-sentinel"
      />
      <p v-if="itemsQuery?.isFetchingNextPage?.value" class="state">
        Загружаем ещё...
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useIntersectionObserver, useWindowSize } from "@vueuse/core";
import { useCatalogFiltersStore } from "~/features/catalog-filters/model/store";
import { ITEM_TYPE_OPTIONS as typeOptions } from "~/shared/config/catalog";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_CURRENCY } from "~/shared/config/filters";
import { useItemsStore } from "~/entities/item/model/store";
import { useItemsApi } from "~/entities/item";
import type { Item, ItemType, ItemsRequestPayload } from "~/entities/item";
import LiveFeed from "~/features/live-feed/ui/LiveFeed.vue";
import TypePills from "./TypePills.vue";
import SearchBar from "./SearchBar.vue";
import SortDropdown from "./SortDropdown.vue";
import FiltersToolbar from "./FiltersToolbar.vue";
import ItemsGrid from "./ItemsGrid.vue";
import EmptyState from "./EmptyState.vue";
import ErrorState from "./ErrorState.vue";
import SkeletonGrid from "./SkeletonGrid.vue";

const LazyCatalogFilters = defineAsyncComponent(
  () => import("~/features/catalog-filters/ui/CatalogFilters.vue")
);

const filters = useCatalogFiltersStore();
const {
  requestPayload,
  amount,
  searchQuery: storeSearchQuery,
  types: filterTypes,
} = storeToRefs(filters);

const isClient = import.meta.client;
const { width } = useWindowSize();

const showSkeleton = computed(() => isClient);
const isMobile = computed(() => {
  if (!isClient) return false;
  return (width?.value ?? 1920) <= 1024;
});

const isFiltersOpen = ref(false);

const openFilters = (): void => {
  isFiltersOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeFilters = (): void => {
  isFiltersOpen.value = false;
  document.body.style.overflow = "";
};

const payload = computed((): ItemsRequestPayload => {
  const payloadValue = requestPayload?.value;
  if (!payloadValue || !payloadValue.filter || !payloadValue.filter.types) {
    const defaultTypes: ItemType[] = ["transport", "pet", "egg", "potion"];
    return {
      filter: {
        types: defaultTypes.map((type) => ({ type })),
      },
      page: 1,
      amount: DEFAULT_ITEMS_PER_PAGE,
      currency: DEFAULT_CURRENCY,
      sort: { popularity: "desc" as const },
    };
  }
  return structuredClone(payloadValue) as ItemsRequestPayload;
});

const { fetchItems } = useItemsApi();
const initialPayload = computed(() => ({
  ...payload.value,
  page: 1,
}));

const { data: initialData } = await useAsyncData(
  "items-initial-ssr",
  () => fetchItems(initialPayload.value),
  {
    server: true,
    default: () => null,
    getCachedData: () => {
      // Используем данные из Vue Query кеша, если они есть
      if (import.meta.client) {
        const nuxtApp = useNuxtApp();
        const queryClient = nuxtApp.$queryClient;
        if (queryClient) {
          const stablePayload = JSON.stringify(initialPayload.value);
          const cached = queryClient.getQueryData(["market-items", stablePayload]);
          if (cached) {
            return cached.pages?.[0] || null;
          }
        }
      }
      return undefined;
    },
  }
);

const itemsStore = useItemsStore();
const itemsQuery = itemsStore.initItemsQuery(payload);

if (import.meta.server && initialData.value) {
  const nuxtApp = useNuxtApp();
  const queryClient = nuxtApp.$queryClient;
  if (queryClient) {
    const stablePayload = JSON.stringify(payload.value);
    queryClient.setQueryData(
      ["market-items", stablePayload],
      {
        pages: [initialData.value],
        pageParams: [1],
      }
    );
  }
}

const items = computed(
  (): Item[] => itemsQuery?.data.value?.pages.flatMap((page) => page.items as Item[]) ?? []
);

const totalItems = computed(
  () => itemsQuery?.data.value?.pages?.[0]?.count ?? 0
);

const currentSort = computed({
  get: () => filters?.sort ?? "popularity",
  set: (value: string) => {
    filters?.setSort(value as Parameters<typeof filters.setSort>[0]);
  },
});

const searchQuery = ref(storeSearchQuery?.value ?? "");

watch(
  storeSearchQuery,
  (newValue: string | undefined) => {
    searchQuery.value = newValue ?? "";
  },
  { immediate: true }
);

const handleSearch = (value: string): void => {
  filters.setSearchQuery(value);
};

const loadMoreTrigger = ref<HTMLElement | null>(null);

if (import.meta.client && itemsQuery) {
  useIntersectionObserver(
    loadMoreTrigger,
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (
        entry &&
        entry.isIntersecting &&
        itemsQuery?.hasNextPage?.value &&
        !itemsQuery?.isFetchingNextPage?.value
      ) {
        itemsQuery.fetchNextPage();
      }
    },
    { rootMargin: "0px" }
  );
}

const refetch = (): void => {
  itemsQuery?.refetch();
};

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped lang="scss">
@use "~/app/assets/styles/_vars" as *;

.catalog-layout {
  &__content {
    padding: 20px 30px;

    @include media-1024 {
      padding: 24px;
    }
  }

  &__filters {
    // Стили для фильтров
  }
}

.catalog-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  box-sizing: border-box;
  max-width: calc(100vw - 60px);
  overflow-x: auto;

  @include media-1024 {
    max-width: calc(100vw - 48px);
  }

  h2 {
    margin: 6px 0 0;
  }
}

.catalog-filters__group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.search-sort-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filters-toggle-btn {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-primary);
  cursor: pointer;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-surface-soft);
  }

  @include media-1024 {
    display: none;
  }
}

.load-more-sentinel {
  height: 1px;
}

.state {
  text-align: center;
  color: var(--color-muted);
}

.filters-overlay {
  position: fixed;
  inset: 0;
  top: var(--header-lg-greater-height);
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
}

.catalog-filters-drawer {
  width: min(400px, 85vw);
  height: 100%;
  background: var(--color-bg-raised);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-border-light);
    position: sticky;
    top: 0;
    background: var(--color-bg-raised);
    z-index: 1;

    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--color-text-primary);
    }
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;

  .catalog-filters-drawer {
    transition: transform 0.3s ease;
  }
}

.drawer-enter-from .catalog-filters-drawer,
.drawer-leave-to .catalog-filters-drawer {
  transform: translateX(-100%);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
</style>
                                                                    
