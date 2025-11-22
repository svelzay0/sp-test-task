<template>
  <div class="live-feed">
    <div class="live-feed__list">
      <article class="live-feed-stats-card">
        <div class="live-feed-stats-card__illustration">
          <img
            src="/assets/icons/stats-illustration.svg"
            alt="Statistics illustration"
            width="120"
            height="120"
          />
        </div>
        <div class="live-feed-stats-card__content">
          <p class="live-feed-stats-card__label">Сделок за все время</p>
          <div class="live-feed-stats-card__value">
            <img
              src="/assets/icons/star.svg"
              alt="Star icon"
              width="16"
              height="16"
            />
            <img
              src="/assets/icons/star.svg"
              alt="Star icon"
              width="16"
              height="16"
            />
            <strong>4 513</strong>
          </div>
          <div class="live-feed-stats-card__online">
            <span class="live-feed-stats-card__dot"></span>
            <span>3 415 в сети</span>
          </div>
        </div>
      </article>

      <transition name="collapse">
        <transition-group
          v-if="!props.isCollapsed"
          name="feed"
          tag="div"
          class="live-feed__entries"
          appear
        >
          <article
            v-for="(entry, index) in entries"
            :key="entry.id"
            class="live-feed-card"
            :class="`live-feed-card--color-${index % 5}`"
          >
            <div class="live-feed-card__background">
              <img
                class="live-feed-card__waves"
                src="/assets/icons/waves-background.svg"
                alt="Waves background"
                width="200"
                height="200"
              />
            </div>

            <div class="live-feed-card__graph">
              <svg
                viewBox="0 0 200 100"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  :d="generateGraphPath(index)"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div class="live-feed-card__content">
              <div class="live-feed-card__info">
                <strong class="live-feed-card__price">
                  {{ formatCurrency(entry.price, "usd") }}
                </strong>
                <p class="live-feed-card__name">{{ entry.name }}</p>
              </div>

              <div class="live-feed-card__illustration">
                <NuxtImg
                  :src="getProxiedUrl(entry.imageUri)"
                  :alt="entry.name"
                  width="80"
                  height="80"
                  loading="lazy"
                />
              </div>
            </div>
          </article>
        </transition-group>
      </transition>
    </div>

    <p v-if="!entries.length && !props.isCollapsed" class="live-feed__empty">
      Здесь появятся ваши покупки
    </p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useLiveFeedStore } from "~/features/live-feed/model/store";
import { formatCurrency } from "~/shared/lib/currency";
import { useImageProxy } from "~/shared/lib/useImageProxy";

interface Props {
  isCollapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false,
});

const feedStore = useLiveFeedStore();
const { entries } = storeToRefs(feedStore);
const { getProxiedImageUrl } = useImageProxy();

const getProxiedUrl = (imageUri: string) => getProxiedImageUrl(imageUri);

const generateGraphPath = (index: number): string => {
  const steps = 20;
  const amplitude = 15 + (index % 3) * 8;
  const frequency = 1.5 + (index % 2) * 0.5;
  const baseY = 30;
  const path: string[] = [];
  
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 200;
    const y = baseY + Math.sin((i / steps) * Math.PI * frequency) * amplitude;
    if (i === 0) {
      path.push(`M ${x},${y}`);
    } else {
      path.push(`L ${x},${y}`);
    }
  }
  
  return path.join(' ');
};
</script>

<style scoped lang="scss">
.live-feed {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.live-feed__list {
  display: flex;
  flex-direction: row;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-surface-soft);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;
    
    &:hover {
      background: var(--color-text-label);
    }
  }
}

.live-feed__entries {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.live-feed-stats-card {
  position: relative;
  padding: 16px;
  border-radius: 16px;
  background: var(--color-bg-raised);
  border: 1px solid var(--color-border-light);
  min-height: 120px;
  min-width: 280px;
  width: 280px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
}

.live-feed-stats-card__illustration {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.live-feed-stats-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.live-feed-stats-card__label {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-label);
  line-height: 1.2;
}

.live-feed-stats-card__value {
  display: flex;
  align-items: center;
  gap: 6px;
  
  strong {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1.2;
  }
  
  svg {
    flex-shrink: 0;
  }
}

.live-feed-stats-card__online {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--color-text-label);
  
  .live-feed-stats-card__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
  }
}

.live-feed-card {
  position: relative;
  padding: 16px;
  border-radius: 16px;
  background: var(--color-bg-raised);
  border: 1px solid var(--color-border-light);
  min-height: 120px;
  min-width: 200px;
  width: 200px;
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;

  &--color-0 .live-feed-card__graph {
    color: #3b82f6;
  }

  &--color-1 .live-feed-card__graph {
    color: #22c55e;
  }

  &--color-2 .live-feed-card__graph {
    color: #ef4444;
  }

  &--color-3 .live-feed-card__graph {
    color: #f97316;
  }

  &--color-4 .live-feed-card__graph {
    color: #a855f7;
  }
}

.live-feed-card__background {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  z-index: 0;
}

.live-feed-card__waves {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.live-feed-card__graph {
  position: absolute;
  left: -16px;
  right: -16px;
  bottom: 0;
  height: 50px;
  z-index: 1;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.live-feed-card__content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  min-height: 88px;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

.live-feed-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.live-feed-card__price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.live-feed-card__name {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-label);
  text-transform: capitalize;
}

.live-feed-card__illustration {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }
}

.live-feed__empty {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
  text-align: center;
}

.feed-enter-active {
  transition: all 0.4s ease-out;
}

.feed-leave-active {
  transition: all 0.3s ease-in;
}

.feed-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.feed-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.feed-move {
  transition: transform 0.4s ease;
}


.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 200px;
  opacity: 1;
  margin-bottom: 16px;
}

@media (max-width: 1024px) {
  .live-feed {
    padding: 16px;
    gap: 12px;
  }

  .live-feed-stats-card {
    min-width: 240px;
    width: 240px;
    padding: 12px;
    gap: 12px;
    min-height: 100px;
  }

  .live-feed-stats-card__illustration {
    width: 80px;
    height: 80px;
    
    img {
      width: 80px;
      height: 80px;
    }
  }

  .live-feed-stats-card__value {
    strong {
      font-size: 1.25rem;
    }
  }

  .live-feed-card {
    min-width: 160px;
    width: 160px;
    padding: 12px;
  }
  
  .live-feed-card__graph {
    left: -12px;
    right: -12px;
  }
  
  .live-feed-card__illustration {
    width: 60px;
    height: 60px;
  }
}
</style>

