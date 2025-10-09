<template>
  <v-container>
    <NuxtLink to="/">
      <v-btn>На главную</v-btn>
    </NuxtLink>

    <div v-if="!product">
      <v-row>
        <v-col cols="12" md="6">
          <v-carousel show-arrows="hover" hide-delimiters>
            <v-carousel-item
              v-for="(image, i) in product.images"
              :key="i"
              :src="image"
              :alt="`${product.title} image ${i + 1}`"
              cover
              class="cursor-pointer"
              @click="openGallery(i)"
            />
          </v-carousel>

          <ProductGallery
            v-if="product"
            v-model="isGalleryOpen"
            :title="product.title"
            :images="product.images"
            :initial-index="galleryStartIndex"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-card flat>
            <v-card-title class="text-h4 text-wrap font-weight-bold">
              {{ product.title }}
            </v-card-title>
            <v-card-subtitle class="text-h6">
              {{ product.brand }}
            </v-card-subtitle>

            <v-card-text>
              <div class="d-flex align-center my-2">
                <v-rating
                  :model-value="product.rating"
                  color="amber"
                  density="compact"
                  half-increments
                  readonly
                />
                <div class="text-grey ms-2">{{ product.rating }}</div>
              </div>

              <p class="text-body-1 my-4">{{ product.description }}</p>

              <div class="text-h5 font-weight-bold my-4">
                {{ product.price }} $
              </div>

              <div class="qr-code-box">
                <h3 class="text-subtitle-1">Поделиться:</h3>
                <ClientOnly>
                  <Qrcode v-if="pageUrl" :value="pageUrl" :size="150" />
                </ClientOnly>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-row v-else class="mt-4">
      <v-col cols="12" sm="6">
        <v-skeleton-loader type="ossein" height="300" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-skeleton-loader type="card-avatar, article" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute();
const productsStore = useProductsStore();
const id = Number(route.params.id);
const pageUrl = ref("");
const isGalleryOpen = ref(false);
const galleryStartIndex = ref(0);

function openGallery(index: number) {
  galleryStartIndex.value = index;
  isGalleryOpen.value = true;
}

onMounted(() => {
  pageUrl.value = window.location.href;
});

const { data: product, error } = await useAsyncData(
  `product-${id}`,
  () => productsStore.fetchProductById(id),
  { lazy: true }
);

if (error.value) {
  showError({
    statusCode: error.value?.statusCode,
    statusMessage: error.value?.statusMessage,
    fatal: true,
  });
}

useHead({
  title: product.value?.title ?? "Товар",
});
</script>
