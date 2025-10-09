<template>
  <v-card class="mx-auto pa-4" height="100%" hover>
    <v-img height="200" :src="product.thumbnail" :alt="product.title" cover />

    <v-card-title class="text-wrap">
      {{ product.title }}
    </v-card-title>

    <v-card-subtitle>
      {{ product.brand }}
    </v-card-subtitle>

    <v-card-text>
      <p class="font-weight-bold text-h6">{{ product.price }} $</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Product } from "~/entities";

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
});
</script>
