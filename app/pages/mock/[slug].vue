<template>
  <section class="mock-page glass-panel">
    <h1>{{ prettyTitle }}</h1>
    <p>Это заглушка страницы «{{ prettyTitle }}».</p>
    <NuxtLink to="/">Вернуться в маркет</NuxtLink>
  </section>
</template>

<script setup lang="ts">
const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const route = useRoute();

const prettyTitle = computed(() => {
  const value = route.params.slug;
  if (Array.isArray(value)) {
    return value.map(capitalize).join(" / ");
  }
  return capitalize(value as string);
});

definePageMeta({
  layout: "default",
});

useHead({
  title: () => `${prettyTitle.value} - StarPets`,
  meta: [
    {
      name: "description",
      content: () => `Страница «${prettyTitle.value}» на StarPets`,
    },
    {
      property: "og:title",
      content: () => `${prettyTitle.value} - StarPets`,
    },
    {
      property: "og:description",
      content: () => `Страница «${prettyTitle.value}» на StarPets`,
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
});
</script>

<style scoped lang="scss">
.mock-page {
  padding: 48px;
  text-align: center;
  margin-top: 32px;

  a {
    display: inline-block;
    margin-top: 16px;
    color: var(--color-primary-strong);
  }
}
</style>

