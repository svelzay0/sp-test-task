<template>
  <div class="action-item cart-block" @click="cart.toggle()">
    <div class="cart-icon-wrapper">
      <button type="button" class="btn-orange btn-square">
        <img
          class="flag"
          src="/assets/icons/cart.svg"
          width="24"
          height="24"
          alt="Cart"
          aria-hidden="true"
        />
      </button>
      <div v-if="cart.totalCount" class="badge">
        {{ cart.totalCount }}
      </div>
    </div>

    <div class="info-col summary">
      <div class="label">К покупке</div>
      <div class="value">
        {{ formatPrice(cart.totalPrice || 0) }}
      </div>
    </div>

    <button type="button" class="btn-collapse">
      <img
        src="/assets/icons/chevron-down-gray.svg"
        alt="Chevron down"
        width="24"
        height="24"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "~/features/cart/model/store";

const cart = useCartStore();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};
</script>

<style scoped lang="scss">
.cart-block {
  display: flex;
  align-items: center;
  background-color: var(--color-cart);
  gap: 16px;
  padding-left: 16px;
  height: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: "Inter", sans-serif;

  &:hover {
    background-color: var(--color-rarity-default);
  }
}

.cart-icon-wrapper {
  position: relative;

  .badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: var(--color-bg);
    color: var(--color-muted);
    font-size: 11px;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
}

.btn-collapse {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  margin-left: auto;

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: translateY(-2px);
  }
}

.summary {
  min-width: 91px;
  .label {
    text-align: end;
  }
  .value {
    text-align: end;
  }
  @media (max-width: 1024px) {
    display: none;
  }
}
</style>
