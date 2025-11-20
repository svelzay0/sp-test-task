import type { ItemsRequestPayload, ItemsResponse } from "~/entities/item";
import { useApi } from "~/shared/api/useApi";

export const useItemsApi = () => {
  const api = useApi();

  // Используем внутренний роут Nuxt для SSR
  const fetchItems = (payload: ItemsRequestPayload) =>
    api.post<ItemsResponse, ItemsRequestPayload>("/api/items", payload);

  return {
    fetchItems,
  };
};