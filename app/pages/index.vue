<template>
  <v-container>
    <h1 class="text-h4 my-4">Каталог товаров</h1>

    <v-row>
      <v-col cols="12" md="8">
        <ProductSearchInput
          v-model:search-query="searchQuery"
          @search="productsStore.applyFilters"
        />
      </v-col>
      <v-col cols="12" md="4">
        <CategorySelect
          v-model="selectedCategory"
          :categories="categories"
          @apply="productsStore.applyFilters()"
        />
      </v-col>
    </v-row>

    <v-row v-if="loading && !filteredProducts.length" class="mt-4">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="card-avatar, article" />
      </v-col>
    </v-row>

    <v-row
      v-else-if="!filteredProducts.length && searchQuery"
      class="py-8 text-center"
    >
      <v-col>
        <v-card class="mx-auto pa-4" height="100%" hover>
          <v-card-text>
            <p class="font-weight-bold text-h6">Товар отсутствует</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="mt-4">
      <v-col
        v-for="product in filteredProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <NuxtLink :to="`/products/${product.id}`" class="no-underline">
          <ProductCard :product="product" />
        </NuxtLink>
      </v-col>
    </v-row>

    <v-row
      v-if="loading && filteredProducts.length > 0"
      class="py-8 text-center"
    >
      <v-col>
        <v-progress-circular indeterminate color="primary" :size="64" />
      </v-col>
    </v-row>

    <div
      v-if="!loading && hasMoreProducts"
      v-intersect="onIntersect"
      class="pa-4"
      hydrate-on-visible
    />
    <!-- тут избавляемся от ошибок гидратации вместо ClientOnly (сервер обращается к IntersectionObserver) -->
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const productsStore = useProductsStore();

const {
  filteredProducts,
  categories,
  loading,
  searchQuery,
  selectedCategory,
  hasMoreProducts,
} = storeToRefs(productsStore);

onMounted(() => {
  productsStore.fetchCategories();
  if (!filteredProducts.value.length) {
    productsStore.applyFilters();
  }
});

const onIntersect = (isIntersecting: boolean) => {
  if (isIntersecting) {
    productsStore.loadMoreProducts();
  }
};
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}
</style>
