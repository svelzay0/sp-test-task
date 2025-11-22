<template>
  <div
    ref="dropdownRef"
    class="sort-dropdown"
    :class="{ 'sort-dropdown--open': isOpen }"
  >
    <button
      type="button"
      class="sort-dropdown__trigger"
      @click="toggleDropdown"
    >
      <div
        class="sort-icon"
        :class="`sort-icon--${currentOption?.icon || 'star'}`"
      >
        <img
          v-if="currentOption?.icon === 'star'"
          src="/assets/icons/star-icon.svg"
          alt="Star"
          width="16"
          height="16"
        />
        <img
          v-else-if="currentOption?.icon === 'tag'"
          src="/assets/icons/tag-icon.svg"
          alt="Tag"
          width="16"
          height="16"
        />
        <img
          v-else-if="currentOption?.icon === 'arrow-up'"
          src="/assets/icons/arrow-up-icon.svg"
          alt="Arrow up"
          width="16"
          height="16"
        />
        <img
          v-else-if="currentOption?.icon === 'arrow-down'"
          src="/assets/icons/arrow-down-icon.svg"
          alt="Arrow down"
          width="16"
          height="16"
        />
      </div>
      <span>{{ currentOption?.label || "Популярность" }}</span>
      <img
        class="sort-chevron"
        :class="{ 'sort-chevron--up': isOpen }"
        src="/assets/icons/chevron-down-icon.svg"
        alt="Chevron"
        width="12"
        height="12"
      />
    </button>
    <div v-if="isOpen" class="sort-dropdown__menu">
      <button
        v-for="option in sortOptions"
        :key="option.value"
        type="button"
        class="sort-option"
        :class="{ 'sort-option--active': currentSort === option.value }"
        @click="handleSelectSort(option.value)"
      >
        <div
          class="sort-option__icon"
          :class="`sort-option__icon--${option.icon}`"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { SORT_OPTIONS, type SortOption } from "~/shared/config/sort";
import { useCatalogFiltersStore } from "~/features/catalog-filters/model/store";

interface Props {
  currentSort: string;
}

interface Emits {
  (e: "update:currentSort", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filters = useCatalogFiltersStore();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const currentOption = computed((): SortOption | undefined => {
  return SORT_OPTIONS.find((opt) => opt.value === props.currentSort);
});

const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value;
};

const handleSelectSort = (value: string): void => {
  filters.setSort(value as Parameters<typeof filters.setSort>[0]);
  emit("update:currentSort", value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent): void => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.sort-dropdown {
  position: relative;
  flex-shrink: 0;

  &--open {
    .sort-dropdown__menu {
      display: block;
    }
  }
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

  &--star {
    background: #3b82f6;
  }

  &--tag {
    background: #f97316;
  }

  &--arrow-up {
    background: #22c55e;
  }

  &--arrow-down {
    background: #ef4444;
  }
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

    &--star {
      background: #3b82f6;
    }

    &--tag {
      background: #f97316;
    }

    &--arrow-up {
      background: #22c55e;
    }

    &--arrow-down {
      background: #ef4444;
    }
  }
}
</style>

