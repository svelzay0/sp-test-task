import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import type { Item } from "../../../entities/item";
import { useCartStore } from "./store";
import { useUserStore } from "../../../entities/user/model/store";

const createMockItem = (overrides: Partial<Item> = {}) => {
  return {
    id: 1,
    goodId: "mock-1",
    name: "Ледяной дракон",
    type: "pet",
    realName: "Ice Dragon",
    imageId: "img-1",
    imageUri: "https://example.com/item.png",
    subtype: null,
    age: "reborn",
    rare: "legendary",
    pumping: "default",
    flyable: true,
    rideable: false,
    price: 500,
    avgPrice: 550,
    ...overrides,
  } satisfies Item;
};

describe("useCartStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("decreases user balance and clears cart on successful purchase", () => {
    const cartStore = useCartStore();
    const userStore = useUserStore();

    userStore.profile = {
      id: "user-1",
      name: "Star Queen",
      balance: 1000,
      currency: "usd",
      avatar: "https://example.com/avatar.png",
    };

    const item = createMockItem();
    cartStore.add(item);

    expect(cartStore.totalPrice).toBe(item.price);
    expect(cartStore.canPurchase()).toBe(true);

    const total = cartStore.purchase();

    expect(total).toBe(item.price);
    expect(cartStore.entries).toHaveLength(0);
    expect(userStore.balance).toBe(500);
  });

  it("throws when balance is insufficient", () => {
    const cartStore = useCartStore();
    const userStore = useUserStore();
    userStore.profile = {
      id: "user-1",
      name: "Star Queen",
      balance: 200,
      currency: "usd",
      avatar: "https://example.com/avatar.png",
    };

    cartStore.add(createMockItem({ price: 500 }));

    expect(cartStore.canPurchase()).toBe(false);
    expect(() => cartStore.purchase()).toThrowError("Недостаточно средств");
  });
});

