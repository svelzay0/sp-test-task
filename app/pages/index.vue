<template>
  <div class="catalog-page">
    <CatalogSection />
  </div>
</template>

<script setup lang="ts">
import CatalogSection from "~/widgets/catalog/ui/CatalogSection.vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Каталог товаров - StarPets",
  meta: [
    {
      name: "description",
      content:
        "Лучшие предложения маркетплейса StarPets. Найдено множество предметов на любой вкус и цвет.",
    },
    {
      property: "og:title",
      content: "Каталог товаров - StarPets",
    },
    {
      property: "og:description",
      content:
        "Лучшие предложения маркетплейса StarPets. Найдено множество предметов на любой вкус и цвет.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
});
</script>

<style scoped lang="scss">
.catalog-page {
  display: flex;
  flex-direction: column;
}
</style>
