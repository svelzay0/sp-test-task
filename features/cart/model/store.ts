import { defineStore } from "pinia";
import type { Item } from "~/entities/item";
import { useUserStore } from "~/entities/user";
import { useLiveFeedStore } from "~/features/live-feed/model/store";

export interface CartEntry {
  item: Item;
  quantity: number;
}

interface CartState {
  entries: CartEntry[];
  isOpen: boolean;
}

export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    entries: [],
    isOpen: false,
  }),

  getters: {
    totalCount: (state) =>
      state.entries.reduce((acc, entry) => acc + entry.quantity, 0),
    totalPrice: (state) =>
      Number(
        state.entries
          .reduce((acc, entry) => acc + entry.item.price * entry.quantity, 0)
          .toFixed(2),
      ),
  },

  actions: {
    add(item: Item) {
      const match = this.entries.find((entry) => entry.item.id === item.id);

      if (match) {
        match.quantity += 1;
        return;
      }

      this.entries.unshift({
        item,
        quantity: 1,
      });
    },

    decrement(itemId: Item["id"]) {
      const match = this.entries.find((entry) => entry.item.id === itemId);
      if (!match) {
        return;
      }

      match.quantity -= 1;
      if (match.quantity <= 0) {
        this.entries = this.entries.filter(
          (entry) => entry.item.id !== itemId,
        );
      }
    },

    remove(itemId: Item["id"]) {
      this.entries = this.entries.filter((entry) => entry.item.id !== itemId);
    },

    clear() {
      this.entries = [];
    },

    toggle() {
      this.isOpen = !this.isOpen;
    },

    open() {
      this.isOpen = true;
    },

    close() {
      this.isOpen = false;
    },

    canPurchase() {
      const userStore = useUserStore();
      return userStore.balance >= this.totalPrice && this.totalPrice > 0;
    },

    purchase() {
      const userStore = useUserStore();
      const liveFeedStore = useLiveFeedStore();
      const total = this.totalPrice;

      if (total === 0) {
        throw new Error("Корзина пуста");
      }

      if (!userStore.profile) {
        throw new Error("Профиль пользователя не загружен");
      }

      if (userStore.profile.balance < total) {
        throw new Error("Недостаточно средств");
      }

      const purchasedItems = this.entries.map((entry) => entry.item);
      userStore.profile.balance = Number(
        (userStore.profile.balance - total).toFixed(2),
      );

      this.clear();
      liveFeedStore.addItems(purchasedItems);
      return total;
    },
  },
});

