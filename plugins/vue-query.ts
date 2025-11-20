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
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
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

