import { defineStore } from "pinia";
import type { Item } from "~/entities/item";

export interface LiveFeedEntry {
  id: string;
  name: string;
  price: number;
  imageUri: string;
  timestamp: number;
}

const MAX_FEED_LENGTH = 20;

export const useLiveFeedStore = defineStore("liveFeed", {
  state: () => ({
    entries: [] as LiveFeedEntry[],
  }),
  actions: {
    addItems(items: Item[]) {
      const timestamp = Date.now();
      const newEntries = items.map((item) => ({
        id: `${item.id}-${timestamp}-${Math.random().toString(36).slice(2, 7)}`,
        name: item.name,
        price: item.price,
        imageUri: item.imageUri,
        timestamp,
      }));

      this.entries = [...newEntries, ...this.entries].slice(0, MAX_FEED_LENGTH);
    },
  },
});

