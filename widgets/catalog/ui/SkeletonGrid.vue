<template>
  <div class="grid">
    <div
      v-for="index in amount"
      :key="index"
      class="skeleton-card"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  amount: number;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
  gap: 16px;
}

.skeleton-card {
  height: 176px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    110deg,
    var(--color-skeleton-light) 8%,
    var(--color-skeleton-mid) 18%,
    var(--color-skeleton-light) 33%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  100% {
    background-position: -200% 0;
  }
}
</style>

