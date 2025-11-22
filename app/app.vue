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
  htmlAttrs: {
    lang: "ru",
  },
  title: "Каталог товаров",
  meta: [
    { name: "description", content: "Каталог товаров на любой вкус и цвет" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "format-detection", content: "telephone=no" },
    // Security meta tags
    { "http-equiv": "X-Content-Type-Options", content: "nosniff" },
    { "http-equiv": "X-Frame-Options", content: "SAMEORIGIN" },
    { "http-equiv": "X-XSS-Protection", content: "1; mode=block" },
    { "http-equiv": "Referrer-Policy", content: "strict-origin-when-cross-origin" },
    // SEO
    { name: "robots", content: "index, follow" },
    { name: "theme-color", content: "#1a1a1a" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Каталог товаров" },
    { property: "og:description", content: "Каталог товаров на любой вкус и цвет" },
  ],
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  ],
});
</script>
