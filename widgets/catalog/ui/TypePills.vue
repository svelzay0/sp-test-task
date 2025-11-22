<template>
  <div class="pill-grid">
    <button
      v-for="option in typeOptions"
      :key="option.value"
      type="button"
      class="pill"
      :class="{ 'pill--active': filterTypes?.includes(option.value) }"
      @click="handleToggleType(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ItemType } from "~/entities/item";
import { ITEM_TYPE_OPTIONS as typeOptions } from "~/shared/config/catalog";
import { useCatalogFiltersStore } from "~/features/catalog-filters/model/store";

interface Props {
  filterTypes?: ItemType[];
}

defineProps<Props>();

const filters = useCatalogFiltersStore();

const handleToggleType = (type: ItemType): void => {
  filters.toggleType(type);
};
</script>

<style scoped lang="scss">
.pill-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-surface-soft);
  }

  &--active {
    background: var(--color-accent-soft);
    border-color: var(--color-primary);
    color: var(--color-accent-strong);
  }
}
</style>

