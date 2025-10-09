<template>
  <v-select
    :model-value="modelValue"
    :items="categories"
    item-title="name"
    label="Категория"
    variant="solo"
    return-object
    clearable
    hide-details
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import type { Category } from '~/entities';

defineProps<{
  modelValue: Category | null;
  categories: Category[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Category | null): void;
  (e: 'apply'): void;
}>();

function onUpdate(value: Category | null) {
  emit('update:modelValue', value);
  emit('apply');
}
</script>