<template>
  <div class="empty-state">
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
      @click="handleReset"
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
</template>

<script setup lang="ts">
import { useCatalogFiltersStore } from "~/features/catalog-filters/model/store";

const filters = useCatalogFiltersStore();

const handleReset = (): void => {
  filters.reset();
};
</script>

<style scoped lang="scss">
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
</style>

