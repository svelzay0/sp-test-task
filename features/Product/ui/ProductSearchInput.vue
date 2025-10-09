<template>
  <v-text-field
    :model-value="searchQuery"
    label="Поиск по названию..."
    variant="solo"
    prepend-inner-icon="mdi-magnify"
    clearable
    hide-details
    @update:model-value="onInput"
    @click:clear="onClear"
  />
</template>

<script setup lang="ts">
// Определяем props и emits для v-model и события поиска
const props = defineProps<{
  searchQuery: string;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'search'): void;
}>();

let debounceTimer: NodeJS.Timeout;

function onInput(value: string | null) {
  const newValue = value || '';
  emit('update:searchQuery', newValue);

  // Debounce logic
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search');
  }, 500); // Задержка в 500 мс
}

function onClear() {
  emit('update:searchQuery', '');
  emit('search');
}
</script>