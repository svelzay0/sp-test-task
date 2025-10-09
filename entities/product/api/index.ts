import type { ProductsApiResponse, Product } from "~/entities";

export async function fetchProductsApi(
  skip = 0,
  limit = 12,
  category?: string,
  q?: string
): Promise<ProductsApiResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("skip", String(skip));
  if (q) params.set("q", q);
  const base = useRuntimeConfig().public.dummyJsonBase;

  if (category) {
    // DummyJSON: /products/category/{category}
    const url = `/products/category/${encodeURIComponent(
      category
    )}?${params.toString()}`;
    return await $fetch<ProductsApiResponse>(base + url);
  }

  const url = `/products?${params.toString()}`;
  return await $fetch<ProductsApiResponse>(base + url);
}

export async function fetchCategoriesApi(): Promise<string[]> {
  const base = useRuntimeConfig().public.dummyJsonBase;
  const data = await $fetch<{ categories: string[] }>(
    base + "/products/categories"
  );
  return data.categories;
}

export async function fetchProductById(id: number): Promise<Product> {
  const base = useRuntimeConfig().public.dummyJsonBase;
  return await $fetch<Product>(base + `/products/${id}`);
}
