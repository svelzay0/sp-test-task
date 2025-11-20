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
        <div class="pill-grid">
          <button
            v-for="option in typeOptions"
            :key="option.value"
            type="button"
            class="pill"
            :class="{ 'pill--active': filterTypes?.includes(option.value) }"
            @click="filters.toggleType(option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="search-sort-row">
          <button
            v-if="isMobile && isClient"
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
          <div class="search-input-wrapper">
            <img
              class="search-icon"
              src="/assets/icons/search-icon.svg"
              alt="Search"
              width="16"
              height="16"
            />
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Быстрый поиск"
              @input="handleSearchInput"
            />
          </div>

          <div
            ref="sortDropdownRef"
            class="sort-dropdown"
            :class="{ 'sort-dropdown--open': isSortOpen }"
          >
            <button
              type="button"
              class="sort-dropdown__trigger"
              @click="toggleSortDropdown"
            >
              <div
                class="sort-icon"
                :style="{ background: currentSortOption?.color || '#3b82f6' }"
              >
                <img
                  v-if="currentSortOption?.icon === 'star'"
                  src="/assets/icons/star-icon.svg"
                  alt="Star"
                  width="16"
                  height="16"
                />
                <img
                  v-else-if="currentSortOption?.icon === 'tag'"
                  src="/assets/icons/tag-icon.svg"
                  alt="Tag"
                  width="16"
                  height="16"
                />
                <img
                  v-else-if="currentSortOption?.icon === 'arrow-up'"
                  src="/assets/icons/arrow-up-icon.svg"
                  alt="Arrow up"
                  width="16"
                  height="16"
                />
                <img
                  v-else-if="currentSortOption?.icon === 'arrow-down'"
                  src="/assets/icons/arrow-down-icon.svg"
                  alt="Arrow down"
                  width="16"
                  height="16"
                />
              </div>
              <span>{{ currentSortOption?.label || "Популярность" }}</span>
              <img
                class="sort-chevron"
                :class="{ 'sort-chevron--up': isSortOpen }"
                src="/assets/icons/chevron-down-icon.svg"
                alt="Chevron"
                width="12"
                height="12"
              />
            </button>
            <div v-if="isSortOpen" class="sort-dropdown__menu">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                type="button"
                class="sort-option"
                :class="{ 'sort-option--active': currentSort === option.value }"
                @click="selectSort(option.value)"
              >
                <div
                  class="sort-option__icon"
                  :style="{ background: option.color }"
                >
                  <img
                    v-if="option.icon === 'star'"
                    src="/assets/icons/star-icon.svg"
                    alt="Star"
                    width="16"
                    height="16"
                  />
                  <img
                    v-else-if="option.icon === 'tag'"
                    src="/assets/icons/tag-icon.svg"
                    alt="Tag"
                    width="16"
                    height="16"
                  />
                  <img
                    v-else-if="option.icon === 'arrow-up'"
                    src="/assets/icons/arrow-up-icon.svg"
                    alt="Arrow up"
                    width="16"
                    height="16"
                  />
                  <img
                    v-else-if="option.icon === 'arrow-down'"
                    src="/assets/icons/arrow-down-icon.svg"
                    alt="Arrow down"
                    width="16"
                    height="16"
                  />
                </div>
                <span>{{ option.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="toolbar-actions">
          <span class="eyebrow">Найдено {{ totalItems }} предметов</span>
          <div
            v-if="filterTypes && filterTypes.length < typeOptions.length"
            class="active-filters"
          >
            <button
              v-for="type in filterTypes"
              :key="type"
              type="button"
              class="toolbar-chip ghost"
              @click="filters.toggleType(type)"
            >
              {{ typeOptions.find((o) => o.value === type)?.label }} ×
            </button>
          </div>
        </div>
      </div>

      <div v-if="itemsQuery.isPending.value && !itemsQuery.isFetchingNextPage.value && showSkeleton" class="grid">
        <div v-for="index in (amount ?? 72)" :key="index" class="skeleton-card" />
      </div>

      <div v-else-if="itemsQuery?.error?.value" class="state state--error">
        <p>Не удалось загрузить товары. Попробуйте ещё раз.</p>
        <button type="button" class="ghost-btn" @click="refetch">
          Повторить
        </button>
      </div>

      <div v-else class="grid">
        <LazyItemCard v-for="item in items" :key="item.id" :item="item" />
      </div>

      <div
        v-if="!items.length && !itemsQuery?.isPending?.value"
        class="empty-state"
      >
        <div class="empty-state__illustration">
          <img
            src="/assets/icons/empty-state-dinosaur.svg"
            alt="Empty state illustration"
            width="200"
            height="200"
          />
        </div>
        <h3 class="empty-state__title">Кажется такого у нас нет... 🙁</h3>
        <p class="empty-state__subtitle">
          Попробуйте изменить настройки фильтров или отредактировать поисковой
          запрос!
        </p>
        <button
          type="button"
          class="empty-state__button"
          @click="filters.reset()"
        >
          <img
            src="/assets/icons/reset-icon.svg"
            alt="Reset"
            width="20"
            height="20"
          />
          Сбросить фильтры!
        </button>
      </div>

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
import {
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
} from "vue";
import { storeToRefs } from "pinia";
import { useIntersectionObserver, useWindowSize } from "@vueuse/core";
const LazyCatalogFilters = defineAsyncComponent(
  () => import("~/features/catalog-filters/ui/CatalogFilters.vue")
);
const LazyItemCard = defineAsyncComponent(
  () => import("~/entities/item/ui/ItemCard.vue")
);
import { useCatalogFiltersStore } from "~/features/catalog-filters/model/store";
import {
  ITEM_TYPE_OPTIONS as typeOptions,
  SORT_OPTIONS as sortOptions,
} from "~/shared/config/catalog";
import { useItemsStore } from "~/entities/item/model/store";
import { useItemsApi } from "~/entities/item";
import type { Item, ItemType, ItemsRequestPayload } from "~/entities/item";
import LiveFeed from "~/features/live-feed/ui/LiveFeed.vue";

const filters = useCatalogFiltersStore();
const {
  requestPayload,
  amount,
  searchQuery: storeSearchQuery,
  types: filterTypes,
} = storeToRefs(filters);

const isClient = import.meta.client;
const { width } = useWindowSize();

// Показываем skeleton только на клиенте, чтобы избежать несоответствия гидратации
const showSkeleton = computed(() => isClient);
// На сервере всегда false, чтобы избежать проблем с гидратацией
const isMobile = computed(() => {
  if (!isClient) return false;
  return (width?.value ?? 1920) <= 1024;
});
const isFiltersOpen = ref(false);

const openFilters = () => {
  isFiltersOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeFilters = () => {
  isFiltersOpen.value = false;
  document.body.style.overflow = "";
};

const payload = computed((): ItemsRequestPayload => {
  const payloadValue = requestPayload?.value;
  if (!payloadValue || !payloadValue.filter || !payloadValue.filter.types) {
    // Возвращаем дефолтный payload если store еще не инициализирован
    const defaultTypes: ItemType[] = ["transport", "pet", "egg", "potion"];
    return {
      filter: {
        types: defaultTypes.map((type) => ({ type })),
      },
      page: 1,
      amount: 72,
      currency: "usd",
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
  }
);

const itemsStore = useItemsStore();
const itemsQuery = itemsStore.initItemsQuery(payload);

// Если есть начальные данные с SSR, добавляем их в query
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
  set: (value) => filters?.setSort(value),
});

const searchQuery = ref(storeSearchQuery?.value ?? "");
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  storeSearchQuery,
  (newValue) => {
    searchQuery.value = newValue ?? "";
  },
  { immediate: true }
);

const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    filters.setSearchQuery(searchQuery.value);
  }, 500);
};

const isSortOpen = ref(false);
const sortDropdownRef = ref<HTMLElement | null>(null);

const toggleSortDropdown = () => {
  isSortOpen.value = !isSortOpen.value;
};

const selectSort = (value: string) => {
  filters.setSort(value as Parameters<typeof filters.setSort>[0]);
  isSortOpen.value = false;
};

const currentSortOption = computed(() => {
  const sortValue = currentSort?.value ?? "popularity";
  return sortOptions.find((opt) => opt.value === sortValue);
});

const handleClickOutside = (event: MouseEvent) => {
  if (
    sortDropdownRef.value &&
    !sortDropdownRef.value.contains(event.target as Node)
  ) {
    isSortOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  document.body.style.overflow = "";
});

const loadMoreTrigger = ref<HTMLElement | null>(null);

if (import.meta.client && itemsQuery) {
  useIntersectionObserver(
    loadMoreTrigger,
    (entries) => {
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

const refetch = () => itemsQuery?.refetch();
</script>

<style scoped lang="scss">
.catalog-layout__content {
  padding: 20px 30px;
}

.catalog-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  box-sizing: border-box;
  max-width: calc(100vw - 60px);
  overflow-x: auto;  

   @media (max-width: 1024px) {
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
  display: none;
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

  @media (max-width: 1024px) {
    display: flex;
  }
}

.search-input-wrapper {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  max-width: 400px;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 36px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-primary);
  font-size: 0.9rem;
  box-sizing: border-box;

  &::placeholder {
    color: var(--color-text-label);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.sort-dropdown {
  position: relative;
  flex-shrink: 0;
}

.sort-dropdown__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;

  &:hover {
    background: var(--color-surface-soft);
  }
}

.sort-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sort-chevron {
  margin-left: auto;
  color: var(--color-text-label);
  transition: transform var(--transition-base);

  &--up {
    transform: rotate(180deg);
  }
}

.sort-dropdown__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: var(--color-bg-raised);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  z-index: 100;
  overflow: hidden;
}

.sort-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-base);

  &:hover {
    background: var(--color-surface-soft);
  }

  &--active {
    background: var(--color-accent-soft);
    color: var(--color-accent-strong);
    font-weight: 600;
  }

  &__icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-height: 41px;
}

.active-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.catalog-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.toolbar-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-chip {
  border-radius: 8px;
  padding: 8px 18px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-note);
  font-weight: 600;

  &.is-active {
    background: var(--color-accent-soft);
    border-color: var(--color-primary);
    color: var(--color-accent-strong);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
  gap: 16px;
}

.load-more-sentinel {
  height: 1px;
}

.skeleton-card {
  height: 176px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    110deg,
    var(--color-skeleton-light) 8%,
    var(--color-skeleton-mid) 18%,
    var(--color-skeleton-light) 33%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

.state {
  text-align: center;
  color: var(--color-muted);

  &--error {
    color: var(--color-danger);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-state__illustration {
  margin-bottom: 24px;
  opacity: 0.9;
}

.empty-state__title {
  margin: 0 0 12px;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.empty-state__subtitle {
  margin: 0 0 32px;
  font-size: 1rem;
  color: var(--color-text-label);
  max-width: 500px;
  line-height: 1.5;
}

.empty-state__button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(
    135deg,
    var(--color-gradient-start),
    var(--color-gradient-end)
  );
  color: var(--color-white);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity var(--transition-base);

  &:hover {
    opacity: 0.9;
  }
}

.ghost-btn {
  border-radius: 12px;
  padding: 12px 18px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-primary);
}

@keyframes shimmer {
  100% {
    background-position: -200% 0;
  }
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
}

.catalog-filters-drawer__head {
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

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active .catalog-filters-drawer,
.drawer-leave-active .catalog-filters-drawer {
  transition: transform 0.3s ease;
}

.drawer-enter-from .catalog-filters-drawer,
.drawer-leave-to .catalog-filters-drawer {
  transform: translateX(-100%);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .catalog-layout__content {
    padding: 24px;
  }
}
</style>
