<template>
  <div class="state state--error">
    <p>Не удалось загрузить товары. Попробуйте ещё раз.</p>
    <button type="button" class="ghost-btn" @click="handleRefetch">
      Повторить
    </button>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: "refetch"): void;
}

const emit = defineEmits<Emits>();

const handleRefetch = (): void => {
  emit("refetch");
};
</script>

<style scoped lang="scss">
.state {
  text-align: center;
  color: var(--color-muted);

  &--error {
    color: var(--color-danger);
  }
}

.ghost-btn {
  border-radius: 12px;
  padding: 12px 18px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-raised);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-surface-soft);
  }
}
</style>

