<template>
  <div class="page-shell">
    <MainHeader />
    <main class="page-shell__main">
      <slot />
    </main>
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import MainHeader from "~/widgets/header/ui/MainHeader.vue";
import CartDrawer from "~/features/cart/ui/CartDrawer.vue";
import { useUserStore } from "~/entities/user";

const userStore = useUserStore();

await callOnce(() => userStore.fetchProfile());
</script>
