import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import { useInfiniteQuery } from "@tanstack/vue-query";

import type {
  ItemsRequestPayload,
  Item,
  InfinitePages,
  ItemsQueryWrapper,
} from "~/entities/item/types";
import { useItemsApi } from "~/entities/item";

export const useItemsStore = defineStore("items", () => {
  function initItemsQuery<TItem = Item>(
    payload: Ref<ItemsRequestPayload>
  ): ItemsQueryWrapper<TItem> {
    const { fetchItems } = useItemsApi();

    const stablePayload = computed(() => {
      const value = payload.value;
      return JSON.stringify(value);
    });

    const q = useInfiniteQuery({
      queryKey: computed(() => ["market-items", stablePayload.value]),
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) =>
        fetchItems({ ...payload.value, page: pageParam }),
      getNextPageParam: (lastPage, pages) => {
        if (lastPage?.items?.length < payload.value.amount) return undefined;
        return pages.length + 1;
      },
      placeholderData: (previous) => previous,
      staleTime: 1000 * 30,
    });

    const defaultData = ref<InfinitePages<TItem> | undefined>(undefined);
    const defaultError = ref<Error | null>(null);
    const defaultIsPending = ref(true);
    const defaultIsFetchingNextPage = ref(false);
    const defaultHasNextPage = ref(false);
    const defaultFetchNextPage = () => Promise.resolve();
    const defaultRefetch = () => Promise.resolve();

    const wrapper: ItemsQueryWrapper<TItem> = {
      data: (q?.data as unknown as Ref<InfinitePages<TItem> | undefined>) || defaultData,
      error: (q?.error as unknown as Ref<Error | null>) || defaultError,
      isPending: q?.isLoading || q?.isFetching 
        ? computed(() => !!(q.isLoading?.value || q.isFetching?.value))
        : defaultIsPending,
      isFetchingNextPage: q?.isFetchingNextPage || defaultIsFetchingNextPage,
      hasNextPage: q?.hasNextPage 
        ? computed(() => !!q.hasNextPage?.value)
        : defaultHasNextPage,
      fetchNextPage: q?.fetchNextPage || defaultFetchNextPage,
      refetch: q?.refetch || defaultRefetch,
    };

    return wrapper;
  }

  return {
    initItemsQuery,
  };
});
