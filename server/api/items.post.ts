import { createError, readBody } from "h3";
import type { ItemsRequestPayload, ItemsResponse } from "~/entities/item";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = (await readBody<ItemsRequestPayload>(event)) ?? {
    filter: { types: [{ type: "pet" }] },
    page: 1,
    amount: 24,
    currency: "usd",
    sort: { price: "desc" },
  };

  try {
    const apiUrl = `${config.public.marketApiBase}/items/all`;
    const response = await $fetch<ItemsResponse>(apiUrl, {
      method: "POST",
      body,
    });
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[items]", error);
    throw createError({
      statusCode: 502,
      statusMessage: "Не удалось получить товары",
    });
  }
});

