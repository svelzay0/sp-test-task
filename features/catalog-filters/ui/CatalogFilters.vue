<template>
  <aside class="catalog-filters">
    <header class="catalog-filters__head">
      <h2>Фильтры</h2>
      <button type="button" class="reset-btn" @click="handleReset">
        Сбросить
      </button>
    </header>

    <div class="catalog-filters__group">
      <h3>Цена</h3>
      <div class="price-range">
        <div class="price-input-wrapper">
          <span class="price-symbol">$</span>
          <input
            v-model.number="priceFrom"
            type="number"
            class="price-input"
            placeholder="0.00"
            min="0"
            step="0.01"
            @input="handlePriceFromInput"
          />
        </div>
        <span class="price-separator">—</span>
        <div class="price-input-wrapper">
          <span class="price-symbol">$</span>
          <input
            v-model.number="priceTo"
            type="number"
            class="price-input"
            placeholder="∞"
            min="0"
            step="0.01"
            @input="handlePriceToInput"
          />
        </div>
      </div>
    </div>

    <div class="catalog-filters__group">
      <h3>Редкость</h3>
      <div class="rarity-row">
        <button
          v-for="option in rarityOptions"
          :key="option.value"
          type="button"
          class="rarity-chip"
          :style="{ background: option.color }"
          :class="{
            'rarity-chip--active': filters.rarities.includes(option.value),
          }"
          @click="filters.toggleRarity(option.value)"
        />
      </div>
    </div>

    <div class="catalog-filters__group">
      <h3>Свойства</h3>
      <hr />
      <div class="property-list">
        <label
          v-for="(option, index) in levelOptions"
          :key="index"
          class="property-item property-item--badge"
        >
          <div
            class="badge"
            :data-label="option.label.charAt(0).toUpperCase()"
          />
          <span>{{ option.label }}</span>
          <input
            type="checkbox"
            :checked="filters.levels.includes(option.value)"
            @change="filters.toggleLevel(option.value)"
          />
        </label>

        <label
          v-for="option in abilityOptions"
          :key="option.value"
          class="property-item property-item--badge"
        >
          <div
            class="badge"
            :data-label="option.label.charAt(0).toUpperCase()"
          />
          <span>{{ option.label }}</span>
          <input
            type="checkbox"
            :checked="filters.abilities.includes(option.value)"
            @change="filters.toggleAbility(option.value)"
          />
        </label>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import {
  RARITY_OPTIONS as rarityOptions,
  LEVEL_OPTIONS as levelOptions,
  ABILITY_OPTIONS as abilityOptions,
 
} from "~/shared/config/catalog";
import { useCatalogFiltersStore } from "~/features/catalog-filters/model/store";

const filters = useCatalogFiltersStore();
const { price: storePrice } = storeToRefs(filters);

const priceFrom = ref<number | undefined>(storePrice?.value?.min);
const priceTo = ref<number | undefined>(storePrice?.value?.max);

// Синхронизация с store при изменении
if (storePrice) {
  watch(storePrice, (newPrice) => {
    if (newPrice) {
      priceFrom.value = newPrice.min;
      priceTo.value = newPrice.max;
    } else {
      priceFrom.value = undefined;
      priceTo.value = undefined;
    }
  }, { deep: true });
}

const handlePriceFromInput = () => {
  filters.setPriceMin(priceFrom.value);
};

const handlePriceToInput = () => {
  filters.setPriceMax(priceTo.value);
};

const handleReset = () => {
  filters.reset();
  // Явно сбрасываем локальные значения
  priceFrom.value = undefined;
  priceTo.value = undefined;
};
</script>

<style scoped lang="scss">
.catalog-filters {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 24px;
  background: var(--color-bg-raised);
  border-right: 1px solid var(--color-border-light);
  height: fit-content;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.price-symbol {
  position: absolute;
  left: 12px;
  color: var(--color-text-primary);
  font-weight: 600;
  pointer-events: none;
  z-index: 1;
}

.price-input {
  width: 100%;
  padding: 10px 14px 10px 28px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-primary);
  font-size: 0.9rem;

  &::placeholder {
    color: var(--color-text-label);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
}

.price-separator {
  color: var(--color-text-label);
  font-weight: 600;
  flex-shrink: 0;
}

.catalog-filters__group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.catalog-filters__group h3 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-label);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.catalog-filters__head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-text-primary);
  }
}

.reset-btn {
  border: none;
  background: transparent;
  color: var(--color-text-label);
  font-weight: 600;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
  color: var(--color-text-note);
}

.rarity-row {
  display: flex;
  gap: 12px;
}

.rarity-chip {
  width: 40px;
  height: 20px;
  border-radius: 999px;
  border: 2px solid transparent;
  opacity: 0.5;

  &--active,
  &:hover {
    opacity: 1;
    border-color: var(--color-border);
  }
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.property-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--color-text-dark);

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }

  &--badge {
    justify-content: space-between;
    padding: 10px;
    border-radius: 12px;
    background: var(--color-surface-soft);
    border: 1px solid var(--color-border);

    input {
      margin-left: auto;
    }
  }
}

.badge {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--color-badge-blue);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--color-white);
  font-size: 0.85rem;
  position: relative;

  &::after {
    content: attr(data-label);
  }

  &[data-label="М"] {
    background: var(--color-badge-purple);
  }

  &[data-label="Н"] {
    background: var(--color-badge-green);
  }

  &[data-label="Ф"] {
    background: var(--color-badge-blue);
  }

  &[data-label="Р"] {
    background: var(--color-badge-red);
  }
}

.sort-control__select {
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 10px 14px;
  background: var(--color-bg-raised);
}

hr {
  display: none;
}

@media (max-width: 1024px) {
  .catalog-filters {
    padding: 20px 24px;
    border-right: none;
    height: auto;
  }
}
</style>
