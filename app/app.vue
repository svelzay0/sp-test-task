<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtErrorBoundary>
      <template #error="{ error }">
        <div class="error-page">
          <p style="color: red">
            An error occurred: {{ error?.message ?? String(error) }}
          </p>
        </div>
      </template>

      <NuxtPage />
    </NuxtErrorBoundary>
  </NuxtLayout>
</template>

<script lang="ts" setup>
useHead({
  title: "Каталог товаров",
  meta: [
    { name: "description", content: "Каталог товаров на любой вкус и цвет" },
  ],
});
</script>
