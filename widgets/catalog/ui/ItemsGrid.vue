<template>
  <div class="grid">
    <LazyItemCard v-for="item in items" :key="item.id" :item="item" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import type { Item } from "~/entities/item";

interface Props {
  items: Item[];
}

defineProps<Props>();

const LazyItemCard = defineAsyncComponent(
  () => import("~/entities/item/ui/ItemCard.vue")
);
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
  gap: 16px;
}
</style>

