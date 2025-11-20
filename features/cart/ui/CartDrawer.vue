<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="cart.isOpen" class="cart-overlay" @click.self="cart.close()">
        <aside class="cart-drawer glass-panel">
          <header class="cart-drawer__head">
            <div class="cart-drawer__head-left">
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
              <div>
                <p class="eyebrow">Корзина</p>
                <h3>{{ cart.totalCount }} {{ cart.totalCount === 1 ? 'предмет' : cart.totalCount < 5 ? 'предмета' : 'предметов' }} в корзине</h3>
              </div>
            </div>
            <button type="button" class="close-btn" @click="cart.close()">
              ✕
            </button>
          </header>

          <div class="cart-drawer__list" v-if="cart.entries.length">
            <article
              v-for="entry in cart.entries"
              :key="entry.item.id"
              class="cart-line"
            >
              <span 
                class="cart-line__badge" 
                :style="{ background: getRarityColor(entry.item.rare) }" 
              />
              <NuxtImg
                :src="entry.item.imageUri"
                :alt="entry.item.name"
                width="80"
                height="80"
                loading="lazy"
                class="cart-line__image"
              />
              <div class="cart-line__body">
                <p class="cart-line__subtitle">{{ entry.item.type }}</p>
                <strong class="cart-line__title">
                  {{ entry.item.name }}{{ entry.quantity > 1 ? ` (${entry.quantity})` : '' }}
                </strong>
                <div class="cart-line__badges">
                  <span
                    v-if="entry.item.pumping === 'mega_neon'"
                    class="cart-badge cart-badge--purple"
                  >
                    M
                  </span>
                  <span
                    v-if="entry.item.pumping === 'neon'"
                    class="cart-badge cart-badge--green"
                  >
                    N
                  </span>
                  <span
                    v-if="entry.item.flyable"
                    class="cart-badge cart-badge--blue"
                  >
                    F
                  </span>
                  <span
                    v-if="entry.item.rideable"
                    class="cart-badge cart-badge--red"
                  >
                    R
                  </span>
                </div>
              </div>

              <div class="cart-line__price">
                {{ formatMoney(entry.item.price * entry.quantity) }}
              </div>

              <button
                type="button"
                class="cart-line__remove"
                aria-label="Удалить"
                @click="cart.remove(entry.item.id)"
              >
                ✕
              </button>
            </article>
          </div>

          <p v-else class="cart-empty">
            Корзина пуста. Добавьте предметы из списка.
          </p>

          <footer class="cart-drawer__footer">
            <div class="summary">
              <span>Сумма покупки</span>
              <strong>{{ formatMoney(cart.totalPrice) }}</strong>
            </div>
            <button
              type="button"
              class="primary-btn"
              :disabled="!cart.canPurchase()"
              @click="handlePurchase"
            >
              Купить
            </button>
            <button
              v-if="cart.entries.length"
              type="button"
              class="clear-btn"
              @click="cart.clear()"
            >
              Очистить корзину
            </button>
            <p v-if="errorMessage" class="error">
              {{ errorMessage }}
            </p>
          </footer>
        </aside>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useCartStore } from "~/features/cart/model/store";
import { useUserStore } from "~/entities/user";
import { formatCurrency } from "~/shared/lib/currency";

const cart = useCartStore();
const userStore = useUserStore();
const { currency } = storeToRefs(userStore);

const errorMessage = ref("");

const formatMoney = (value: number) => formatCurrency(value, currency.value);

const getRarityColor = (rarity: string) => {
  const map: Record<string, string> = {
    common: "var(--color-rarity-common)",
    uncommon: "var(--color-rarity-uncommon)",
    rare: "var(--color-rarity-rare)",
    ultra_rare: "var(--color-rarity-ultra)",
    legendary: "var(--color-rarity-legendary)",
  };
  return map[rarity] ?? "var(--color-rarity-default)";
};

const handlePurchase = () => {
  errorMessage.value = "";
  try {
    cart.purchase();
    cart.close();
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Что-то пошло не так";
  }
};
</script>

<style scoped lang="scss">
.cart-overlay {
  position: fixed;
  inset: 0;
  top: 96px;
  display: flex;
  justify-content: flex-end;
  z-index: 90;
}

.cart-drawer {
  width: min(420px, 100%);
  height: min-content;
  padding: 24px;
  display: flex;
  flex-direction: column;
  margin: 0 12px;
  gap: 24px;
  background: var(--color-bg-raised);
  color: var(--color-text-primary);
}

.cart-drawer__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.cart-drawer__head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
}

.cart-drawer__head-left > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-height: 0;
  max-height: 44px;
}

.cart-drawer__head h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.cart-drawer__head .eyebrow {
  margin: 0;
  line-height: 1.2;
}

.close-btn {
  border-radius: 999px;
  width: 40px;
  height: 40px;
  color: var(--color-text-primary);
}

.cart-drawer__list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
}

.cart-line {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-raised);
  position: relative;
  overflow: hidden;
}

.cart-line__badge {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  z-index: 1;
}

.cart-line__image {
  border-radius: 12px;
  object-fit: contain;
  width: 80px;
  height: 80px;
}

.cart-line__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cart-line__subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-label);
  text-transform: capitalize;
}

.cart-line__title {
  display: block;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.cart-line__badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.cart-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--color-white);
  font-size: 0.75rem;

  &--purple {
    background: var(--color-badge-purple);
  }

  &--green {
    background: var(--color-badge-green);
  }

  &--blue {
    background: var(--color-badge-blue);
  }

  &--red {
    background: var(--color-badge-red);
  }
}

.cart-line__price {
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text-primary);
  text-align: right;
}

.cart-line__remove {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--color-surface-soft);
  color: var(--color-text-label);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-surface-muted);
    color: var(--color-text-primary);
  }
}

.cart-empty {
  margin: 0;
  color: var(--color-muted);
}

.cart-drawer__footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  padding: 14px 24px;
  background: linear-gradient(
    135deg,
    var(--color-gradient-start),
    var(--color-gradient-end)
  );
  color: var(--color-white);
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: opacity var(--transition-base);

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    background: var(--color-disabled-bg);
    color: var(--color-disabled-text);
    cursor: not-allowed;
  }
}

.clear-btn {
  margin-top: 8px;
  padding: 12px;
  border: none;
  background: transparent;
  color: var(--color-text-label);
  font-size: 0.9rem;
  cursor: pointer;
  text-align: center;
  transition: color var(--transition-base);

  &:hover {
    color: var(--color-text-primary);
  }
}

.error {
  color: var(--color-danger);
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
