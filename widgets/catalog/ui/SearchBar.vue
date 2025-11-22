<template>
  <div class="search-input-wrapper">
    <img
      class="search-icon"
      src="/assets/icons/search-icon.svg"
      alt="Search"
      width="16"
      height="16"
    />
    <input
      :value="modelValue"
      type="text"
      class="search-input"
      placeholder="Быстрый поиск"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";

interface Props {
  modelValue: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "search", value: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  
  emit("update:modelValue", value);
  
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    emit("search", value);
  }, 500);
};

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<style scoped lang="scss">
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
</style>

