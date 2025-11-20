<template>
  <div class="main-header-shell">
    <header class="main-header">
      <div class="main-header__inner">
        <div class="main-header__content">
          <div class="main-header__brand">
            <NuxtLink class="main-header__logo" to="/">
              <img
                :src="logoSrc"
                alt="StarPets"
                :width="logoWidth"
                :height="logoHeight"
              />
            </NuxtLink>

            <nav class="main-header__nav">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="nav-link"
                active-class="is-active"
              >
                <span>{{ link.label }}</span>
                <div class="nav-link__line" />
              </NuxtLink>
            </nav>
          </div>

          <div class="main-header__actions">
            <div v-if="profile" class="action-item balance-block">
              <div class="info-col text-right">
                <div class="value">
                  {{ formatCurrency(profile.balance, profile.currency) }}
                </div>
                <div class="label">Ваш баланс</div>
              </div>
              <button class="btn-orange btn-square">
                <img
                  src="/assets/icons/plus-icon.svg"
                  alt="Plus"
                  width="24"
                  height="24"
                />
              </button>
            </div>

            <div v-if="profile" class="action-item profile-block">
              <button type="button" class="chip chip--flag">
                <img
                  class="flag"
                  src="/assets/icons/country-russia.svg"
                  alt="Россия"
                  width="34"
                  height="34"
                  aria-hidden="true"
                />
              </button>

              <div class="info-col">
                <div class="value">{{ profile.name }}</div>
                <div class="label text-end">Профиль</div>
              </div>

              <div class="avatar-wrapper">
                <NuxtImg
                  class="avatar-img"
                  :src="profile.avatar"
                  :alt="profile.name"
                />
              </div>
            </div>

            <CartButton />
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useWindowSize } from "@vueuse/core";
import CartButton from "~/features/cart/ui/CartButton.vue";
import { useUserStore } from "~/entities/user";
import { formatCurrency } from "~/shared/lib/currency";

const navLinks = [
  { label: "Маркет", to: "/" },
  { label: "Предметы", to: "/mock/items" },
  { label: "Продажа", to: "/mock/sell" },
  { label: "R$", to: "/mock/rbx" },
  { label: "Помощь", to: "/mock/help" },
];

const userStore = useUserStore();
const { profile } = storeToRefs(userStore);

const { width } = useWindowSize();
const isMobile = computed(() => (width.value ?? 1920) < 1024);

const logoSrc = computed(() => (isMobile.value ? "/logo-mob.svg" : "/logo.svg"));
const logoWidth = computed(() => (isMobile.value ? 33 : 201));
const logoHeight = computed(() => (isMobile.value ? 25 : 40));
</script>

<style scoped lang="scss">
.main-header-shell {
  position: relative;
  z-index: 302;
}

.main-header {
  height: var(--header-lg-greater-height);
}

.main-header__inner {
  align-items: center;
  background: var(--alias-modal-background-primary);
  box-shadow: var(--shadow-header);
  display: flex;
  justify-content: center;
  min-height: var(--header-lg-greater-height);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: inherit;
  z-index: 302;
}

.main-header__content {
  width: 100%;
  height: inherit;
  padding: 0 0 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-header__brand {
  display: flex;
  align-items: center;
  gap: 48px;
  height: inherit;
}

.main-header__logo img {
  display: block;
}

.main-header__nav {
  display: flex;
  gap: 36px;
  height: 100%;

  @media (max-width: 1440px) {
    display: none;
  }
}

.nav-link {
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  gap: 26px;
  min-width: 40px;
  font-weight: 600;
  color: var(--color-muted);
  transition: color var(--transition-base);

  &__line {
    width: 26px;
    height: 3px;
    border-radius: 999px;
    background: transparent;
    transition: background var(--transition-base);
  }

  &.is-active,
  &:hover {
    color: var(--color-text-strong);

    .nav-link__line {
      min-width: 40px;
      background: var(--color-primary);
    }
  }
}

.main-header__actions {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.chip {
  border-radius: 8px;
  padding: 10px 16px;
  min-height: 46px;
  min-width: 46px;
  background: var(--color-bg-raised);
  color: var(--color-text-strong);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;

  &--flag {
    padding: 6px;
    background: var(--color-chip-ghost-bg);
  }

  &--primary {
    background: linear-gradient(
      135deg,
      var(--color-gradient-start),
      var(--color-gradient-end)
    );
    color: var(--color-white);
    border: none;
    box-shadow: var(--shadow-chip-primary);
  }

  &--ghost {
    background: var(--color-chip-ghost-bg);
  }

  &.is-muted {
    color: var(--color-chip-muted);
  }
}

.flag {
  display: block;
  width: 34px;
  height: 34px;
}

.user-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  border-radius: 999px;
  border: 1px solid var(--color-chip-border);
  background: var(--color-chip-ghost-bg);

  img {
    border-radius: 999px;
  }

  strong {
    display: block;
    font-size: 0.9rem;
    color: var(--color-text-strong);
  }

  p {
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-muted);
  }
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-block {
  gap: 16px;
  .avatar-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    padding: 2px;
    border: 2px solid var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 1024px) {
      display: none;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
}

@media (max-width: 768px) {
  .main-header__content {
    gap: 16px;
  }

  .main-header__actions {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
