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
  const value = priceFrom.value;
  // Убираем пустые строки, NaN и undefined
  if (value === undefined || value === null || value === "" || Number.isNaN(value)) {
    filters.setPriceMin(undefined);
  } else {
    filters.setPriceMin(value);
  }
};

const handlePriceToInput = () => {
  const value = priceTo.value;
  // Убираем пустые строки, NaN и undefined
  if (value === undefined || value === null || value === "" || Number.isNaN(value)) {
    filters.setPriceMax(undefined);
  } else {
    filters.setPriceMax(value);
  }
};

const handleReset = () => {
  filters.reset();
  // Явно сбрасываем локальные значения
  priceFrom.value = undefined;
  priceTo.value = undefined;
};
</script>

