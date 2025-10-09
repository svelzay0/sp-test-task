export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductStoreState {
  products: Product[];
  categories: Category[];
  selectedCategory: Category | null;
  searchQuery: string;
  loading: boolean;
  error: Error | null;
  limit: number;
  skip: number;
  total: number;
}