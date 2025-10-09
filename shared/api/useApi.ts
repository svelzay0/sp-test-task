import { ofetch } from "ofetch";
import type { FetchOptions } from "ofetch";
import type { ApiResponseWrapper, ApiListPayload } from "~/shared/types/api";

function isApiListPayload<T>(payload: unknown): payload is ApiListPayload<T> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "list" in payload &&
    Array.isArray((payload as ApiListPayload<T>).list)
  );
}

export const useApi = () => {
  const config = useRuntimeConfig();
  const apiInstance = ofetch.create({
    baseURL: config.public.apiBaseUrl as string,
    onRequest({ request, options }) {
      const headers = new Headers(options.headers);
      if (config.public.basicAuth) {
        headers.set(
          "Authorization",
          `Basic ${config.public.basicAuth as string}`
        );
      }

      options.headers = headers;
    },

    async onResponse({ request, response, options }) {
      const apiResponse = response._data as ApiResponseWrapper<unknown>;
      if (!apiResponse.status) {
        throw new Error(
          apiResponse.message || "Произошла ошибка при выполнении запроса к API"
        );
      }

      const resultPayload = apiResponse.result;
      if (isApiListPayload(resultPayload)) {
        response._data = resultPayload.list;
      } else {
        response._data = resultPayload;
      }
    },

    async onResponseError({ request, response, options }) {
      console.error(
        `[API Error] ${response.status}: ${response.statusText}`,
        response._data
      );
    },
  });

  return {
    get: <T>(url: string, options?: FetchOptions<"json">) =>
      apiInstance<T>(url, { ...options, method: "GET" }),

    post: <T, D extends Record<string, any>>(
      url: string,
      data: D,
      options?: FetchOptions<"json">
    ) => apiInstance<T>(url, { ...options, method: "POST", body: data }),

    put: <T, D extends Record<string, any>>(
      url: string,
      data: D,
      options?: FetchOptions<"json">
    ) => apiInstance<T>(url, { ...options, method: "PUT", body: data }),

    patch: <T, D extends Record<string, any>>(
      url: string,
      data: Partial<D>,
      options?: FetchOptions<"json">
    ) => apiInstance<T>(url, { ...options, method: "PATCH", body: data }),

    delete: <T>(url: string, options?: FetchOptions<"json">) =>
      apiInstance<T>(url, { ...options, method: "DELETE" }),
  };
};
