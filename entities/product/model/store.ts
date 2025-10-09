import { defineStore } from "pinia";
import type {
  Product,
  Category,
  ProductsApiResponse,
  ProductStoreState,
} from "~/entities";

export const useProductsStore = defineStore("products", {
  state: (): ProductStoreState => ({
    products: [],
    categories: [],
    selectedCategory: null,
    searchQuery: "",
    loading: false,
    error: null,
    limit: 20,
    skip: 0, // Смещение для пагинации
    total: 0, // Общее количество товаров
  }),

  getters: {
    filteredProducts(state): Product[] {
      let products = state.products;
      // Фильтрация по категории (если выбрана)
      if (state.selectedCategory) {
        products = products.filter(
          (p) => p.category === state.selectedCategory?.slug
        );
      }
      return products;
    },
    hasMoreProducts(state): boolean {
      return state.products.length < state.total;
    },
  },

  actions: {
    async fetchCategories() {
      if (this.categories.length) return; // Не загружаем, если уже есть
      try {
        this.loading = true;
        const data = await $fetch<Category[]>(
          "https://dummyjson.com/products/categories"
        );
        this.categories = data;
      } catch (e) {
        this.error = e as Error;
      } finally {
        this.loading = false;
      }
    },
    async fetchProducts(loadMore = false) {
      this.loading = true;
      this.error = null;
      try {
        let url = `https://dummyjson.com/products/search?limit=${this.limit}&skip=${this.skip}&q=${this.searchQuery}`;
        if (this.selectedCategory) {
          url = `https://dummyjson.com/products/category/${this.selectedCategory.slug}?limit=${this.limit}&skip=${this.skip}&q=${this.searchQuery}`;
        }
        const data = await $fetch<ProductsApiResponse>(url);
        loadMore
          ? (this.products = [...this.products, ...data.products])
          : (this.products = data.products);
        this.total = data.total;
      } catch (e) {
        this.error = e as Error;
      } finally {
        this.loading = false;
      }
    },
    async applyFilters() {
      this.skip = 0; // Сбрасываем пагинацию
      await this.fetchProducts(false); // Загружаем с новыми параметрами
    },
    // Загрузка следующей "страницы" для бесконечного скролла
    async loadMoreProducts() {
      if (!this.hasMoreProducts || this.loading) return; // Предотвращаем лишние запросы
      this.skip += this.limit; // Увеличиваем смещение
      await this.fetchProducts(true); // Загружаем и добавляем товары
    },
    async fetchProductById(id: number) {
      return await $fetch<Product>(`https://dummyjson.com/products/${id}`);
    },
  },
});
