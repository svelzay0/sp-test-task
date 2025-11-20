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
        <LiveFeed class="catalog-live-feed" />
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="3"
                y1="5"
                x2="17"
                y2="5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <circle cx="15" cy="5" r="2" fill="currentColor" />
              <line
                x1="3"
                y1="10"
                x2="17"
                y2="10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <line
                x1="3"
                y1="15"
                x2="17"
                y2="15"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <circle cx="5" cy="15" r="2" fill="currentColor" />
            </svg>
          </button>
          <div class="search-input-wrapper">
            <svg
              class="search-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 14L11.1 11.1"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
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
                <svg
                  v-if="currentSortOption?.icon === 'star'"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2L9.8541 5.76393L14 6.52786L11 9.47214L11.7082 13.6361L8 11.7639L4.2918 13.6361L5 9.47214L2 6.52786L6.1459 5.76393L8 2Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else-if="currentSortOption?.icon === 'tag'"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4L8 2L14 4V12L8 14L2 12V4Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else-if="currentSortOption?.icon === 'arrow-up'"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 10L8 6L12 10"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else-if="currentSortOption?.icon === 'arrow-down'"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>{{ currentSortOption?.label || "Популярность" }}</span>
              <svg
                class="sort-chevron"
                :class="{ 'sort-chevron--up': isSortOpen }"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
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
                  <svg
                    v-if="option.icon === 'star'"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2L9.8541 5.76393L14 6.52786L11 9.47214L11.7082 13.6361L8 11.7639L4.2918 13.6361L5 9.47214L2 6.52786L6.1459 5.76393L8 2Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg
                    v-else-if="option.icon === 'tag'"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 4L8 2L14 4V12L8 14L2 12V4Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg
                    v-else-if="option.icon === 'arrow-up'"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 10L8 6L12 10"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg
                    v-else-if="option.icon === 'arrow-down'"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
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

      <div v-if="itemsQuery.isPending.value && !itemsQuery.isFetchingNextPage.value" class="grid">
        <div v-for="index in amount ?? 72" :key="index" class="skeleton-card" />
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
          <NuxtImg
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3V1M10 1L13 4M10 1L7 4M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
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
import { Teleport } from "vue";
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

const payload = computed(() => {
  const payloadValue = requestPayload?.value;
  if (!payloadValue || !payloadValue.filter || !payloadValue.filter.types) {
    // Возвращаем дефолтный payload если store еще не инициализирован
    return {
      filter: {
        types: [
          { type: "transport" },
          { type: "pet" },
          { type: "egg" },
          { type: "potion" },
        ],
      },
      page: 1,
      amount: 72,
      currency: "usd",
      sort: { popularity: "desc" },
    };
  }
  return structuredClone(payloadValue);
});

// SSR: загружаем первую страницу через useAsyncData (только на сервере, один раз)
const { fetchItems } = useItemsApi();
const initialPayload = computed(() => ({
  ...payload.value,
  page: 1,
}));

const { data: initialData } = await useAsyncData(
  "items-initial-ssr", // Статический ключ, чтобы не перезапускался при изменении фильтров
  () => fetchItems(initialPayload.value),
  {
    server: true,
    client: false, // Отключаем на клиенте, чтобы избежать двойных запросов
    default: () => null,
    watch: false, // Отключаем watch, чтобы не перезапускался при изменении payload
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
  () => itemsQuery?.data.value?.pages.flatMap((page: any) => page.items) ?? []
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

// Синхронизация с store при сбросе
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
  filters.setSort(value);
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
    ([entry]) => {
      if (
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
.catalog-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
}

.catalog-layout__filters {
  border-right: 1px solid var(--color-border);
  position: sticky;
  top: var(--header-lg-greater-height);
  align-self: start;
  overflow-y: auto;
  max-width: 320px;
}

.catalog-layout__content {
  padding: 20px 30px;
}

.catalog-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

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
  color: var(--color-text-label);
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
  height: 41px;
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
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .catalog-layout__content {
    padding: 24px;
  }

  .catalog-layout__filters.catalog-layout__filters {
    display: none;
  }
}
</style>
