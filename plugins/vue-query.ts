import {
  QueryClient,
  VueQueryPlugin,
  dehydrate,
  hydrate,
} from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 минут
        gcTime: 1000 * 60 * 30, // 30 минут (ранее cacheTime)
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Не перезапрашивать при монтировании, если данные свежие
        refetchOnReconnect: false, // Не перезапрашивать при восстановлении соединения
        retry: 1,
      },
    },
  });

  if (import.meta.server) {
    nuxtApp.hook("app:rendered", () => {
      nuxtApp.payload.state.vueQuery = dehydrate(queryClient);
    });
  }

  if (import.meta.client && nuxtApp.payload?.state?.vueQuery) {
    hydrate(queryClient, nuxtApp.payload.state.vueQuery);
  }

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  return {
    provide: {
      queryClient,
    },
  };
});