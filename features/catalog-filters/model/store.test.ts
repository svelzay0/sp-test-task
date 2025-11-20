import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCatalogFiltersStore } from "./store";

describe("useCatalogFiltersStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("builds payload with rarities, levels and properties for pets", () => {
    const filters = useCatalogFiltersStore();

    filters.types = ["pet"];
    filters.toggleRarity("common");
    filters.toggleLevel("neon");
    filters.toggleAbility("flyable");

    const payload = filters.requestPayload;
    expect(payload.filter.types).toHaveLength(1);

    const petFilter = payload.filter.types[0];
    expect(petFilter.rarities).toEqual(["common"]);
    expect(petFilter.levels).toEqual(["neon"]);
    expect(petFilter.properties).toEqual({
      missing: true,
      flyable: true,
      rideable: false,
    });
  });
});

