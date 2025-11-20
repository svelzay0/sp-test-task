<template>
  <div class="error-page">
    <div class="error-page__container glass-panel">
      <div class="error-page__content">
        <h1 class="error-page__title">{{ statusCode }}</h1>
        <p class="error-page__message">{{ message }}</p>
        <div class="error-page__actions">
          <NuxtLink to="/" class="primary-btn">Вернуться на главную</NuxtLink>
          <button type="button" class="ghost-btn" @click="handleError">
            Попробовать снова
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
  };
}>();

const statusCode = computed(() => props.error?.statusCode ?? 500);
const message = computed(
  () =>
    props.error?.statusMessage ??
    props.error?.message ??
    "Произошла непредвиденная ошибка",
);

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-bg);
}

.error-page__container {
  max-width: 500px;
  width: 100%;
  padding: 48px 32px;
  text-align: center;
}

.error-page__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.error-page__title {
  margin: 0;
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.error-page__message {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-muted);
}

.error-page__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}

.primary-btn {
  border-radius: 12px;
  padding: 12px 24px;
  background: linear-gradient(
    135deg,
    var(--color-gradient-start),
    var(--color-gradient-end)
  );
  color: var(--color-white);
  font-weight: 600;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-chip-primary);
  }
}

.ghost-btn {
  border-radius: 12px;
  padding: 12px 24px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-base);

  &:hover {
    background: var(--color-chip-ghost-bg);
  }
}

@media (max-width: 768px) {
  .error-page__title {
    font-size: 3rem;
  }

  .error-page__container {
    padding: 32px 24px;
  }
}
</style>

