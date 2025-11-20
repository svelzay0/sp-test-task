import { ofetch } from "ofetch";
import type { FetchOptions } from "ofetch";

export const useApi = () => {
  const config = useRuntimeConfig();

  // Для внешних API используем marketApiBase
  const externalApiInstance = ofetch.create({
    baseURL: config.public.marketApiBase as string,
    onRequest({ options }) {
      const headers = new Headers(options.headers);
      // Можно добавить дополнительные заголовки при необходимости
      options.headers = headers;
    },
    async onResponseError({ response }) {
      // eslint-disable-next-line no-console
      console.error(
        `[External API Error] ${response.status}: ${response.statusText}`,
        response._data,
      );
    },
  });

  // Для внутренних роутов Nuxt используем $fetch (работает и в SSR, и на клиенте)
  // В серверных роутах можно использовать useRequestFetch, но $fetch тоже работает
  const internalFetch = $fetch;

  return {
    // Методы для внешнего API
    external: {
      get: <T>(url: string, options?: FetchOptions<"json">) =>
        externalApiInstance<T>(url, { ...options, method: "GET" }),

      post: <T, D extends Record<string, unknown>>(
        url: string,
        data: D,
        options?: FetchOptions<"json">,
      ) =>
        externalApiInstance<T>(url, { ...options, method: "POST", body: data }),

      put: <T, D extends Record<string, unknown>>(
        url: string,
        data: D,
        options?: FetchOptions<"json">,
      ) =>
        externalApiInstance<T>(url, { ...options, method: "PUT", body: data }),

      patch: <T, D extends Record<string, unknown>>(
        url: string,
        data: Partial<D>,
        options?: FetchOptions<"json">,
      ) =>
        externalApiInstance<T>(url, {
          ...options,
          method: "PATCH",
          body: data,
        }),

      delete: <T>(url: string, options?: FetchOptions<"json">) =>
        externalApiInstance<T>(url, { ...options, method: "DELETE" }),
    },

    // Методы для внутренних роутов Nuxt (SSR-safe)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: <T>(url: string, options?: any) =>
      internalFetch<T>(url, { ...options, method: "GET" }),

    post: <T, D extends Record<string, unknown>>(
      url: string,
      data: D,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options?: any,
    ) =>
      internalFetch<T>(url, {
        ...options,
        method: "POST",
        body: data,
      }),

    put: <T, D extends Record<string, unknown>>(
      url: string,
      data: D,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options?: any,
    ) =>
      internalFetch<T>(url, { ...options, method: "PUT", body: data }),

    patch: <T, D extends Record<string, unknown>>(
      url: string,
      data: Partial<D>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options?: any,
    ) =>
      internalFetch<T>(url, {
        ...options,
        method: "PATCH",
        body: data,
      }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete: <T>(url: string, options?: any) =>
      internalFetch<T>(url, { ...options, method: "DELETE" }),
  };
};

