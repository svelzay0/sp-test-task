<template>
  <div class="toolbar-actions">
    <span class="eyebrow">Найдено {{ totalItems }} предметов</span>
    <div
      v-if="filterTypes && filterTypes.length < typeOptionsLength"
      class="active-filters"
    >
      <button
        v-for="type in filterTypes"
        :key="type"
        type="button"
        class="toolbar-chip ghost"
        @click="handleToggleType(type)"
      >
        {{ getTypeLabel(type) }} ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItemType } from "~/entities/item";
import { ITEM_TYPE_OPTIONS } from "~/shared/config/catalog";
import { useCatalogFiltersStore } from "~/features/catalog-filters/model/store";

interface Props {
  totalItems: number;
  filterTypes?: ItemType[];
  typeOptionsLength: number;
}

defineProps<Props>();

const filters = useCatalogFiltersStore();

const getTypeLabel = (type: ItemType): string => {
  return ITEM_TYPE_OPTIONS.find((o) => o.value === type)?.label || type;
};

const handleToggleType = (type: ItemType): void => {
  filters.toggleType(type);
};
</script>

<style scoped lang="scss">
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

.toolbar-chip {
  border-radius: 8px;
  padding: 8px 18px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-note);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-surface-soft);
  }
}

.eyebrow {
  font-size: 0.9rem;
  color: var(--color-text-label);
}
</style>

