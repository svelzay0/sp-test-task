<template>
  <article class="item-card glass-panel">
    <span class="item-card__badge" :style="{ background: rarityColor }" />

    <div class="item-card__media">
      <NuxtImg
        :src="item.imageUri"
        :alt="item.name"
        width="128"
        height="128"
        loading="lazy"
      />
    </div>

    <div class="item-card__body">
      <p class="item-card__meta">
        {{ metaInfo }}
      </p>
    </div>

    <footer class="item-card__footer">
      <div>
        <h4>{{ item.name }}</h4>
        <strong>{{ formattedPrice }}</strong>
      </div>
      <button type="button" class="btn-orange btn-square item-card__add-btn">
        <img
          class="flag"
          src="/assets/icons/cart.svg"
          width="24"
          height="24"
          alt="Cart"
          aria-hidden="true"
          @click="handleAdd"
        />
      </button>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Item } from "~/entities/item";
import { formatCurrency } from "~/shared/lib/currency";
import { useCartStore } from "~/features/cart/model/store";
import { useUserStore } from "~/entities/user";

const props = defineProps<{
  item: Item;
}>();

const userStore = useUserStore();
const cartStore = useCartStore();

const formattedPrice = computed(() =>
  formatCurrency(props.item.price, userStore.currency)
);

const metaInfo = computed(
  () =>
    `${props.item.type}
    ${props.item.pumping ? `· ${props.item.pumping}` : ""}
    ${props.item.age ? `· ${props.item.age}` : ""}`
);

const rarityColor = computed(() => {
  const map: Record<string, string> = {
    common: "var(--color-rarity-common)",
    uncommon: "var(--color-rarity-uncommon)",
    rare: "var(--color-rarity-rare)",
    ultra_rare: "var(--color-rarity-ultra)",
    legendary: "var(--color-rarity-legendary)",
  };

  return map[props.item.rare] ?? "var(--color-rarity-default)";
});

const handleAdd = () => {
  cartStore.add(props.item);
};
</script>

<style scoped lang="scss">
.item-card {
  position: relative;
  padding: 12px;
  display: flex;
  flex-direction: column;
  text-align: left;
  border-radius: 18px;
  background: var(--color-card);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-base),
    box-shadow var(--transition-base);
  max-height: 176px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-card-hover);

    .item-card__add-btn {
      opacity: 1;
      visibility: visible;
    }
  }
}

.item-card__badge {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  border-radius: 0 0 999px 999px;
  background: var(--color-rarity-overlay);
  z-index: 1;
}

.item-card__media {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  flex-shrink: 0;
  height: 78px;

  img {
    border-radius: 12px;
    object-fit: contain;
    width: 100%;
    height: 100%;
    max-width: 78px;
    max-height: 78px;
  }
}

.item-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

}

.item-card__meta {
  margin: 0;
  color: var(--color-muted);
  text-transform: capitalize;
  font-size: 0.75rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  flex-shrink: 0;

  > div {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
  }

  h4 {
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-text-primary);
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.primary-btn {
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  background: linear-gradient(
    135deg,
    var(--color-gradient-start),
    var(--color-gradient-end)
  );
  color: var(--color-white);
  font-weight: 600;
}

.item-card__add-btn {
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-base), visibility var(--transition-base);
}
</style>
