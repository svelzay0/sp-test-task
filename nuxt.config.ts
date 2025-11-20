import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-11-18",
  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@nuxt/image"],

  image: {
    formats: ["webp", "avif"],
    domains: [],
    provider: "ipx",
    ipx: {
      sharp: {},
    },
    // Исключаем SVG из обработки - они будут загружаться напрямую
    quality: 80,
  },

  plugins: ["~/plugins/vue-query"],

  css: ["~/app/assets/styles/main.scss"],

  runtimeConfig: {
    public: {
      marketApiBase: "https://market.apineural.com/api/store",
    },
  },

  typescript: {
    strict: true,
  },

  alias: {
    "~": join(__dirname, "."),
    "@": join(__dirname, "app"),
  },

  components: {
    dirs: [
      {
        path: "~/entities/",
        pathPrefix: false,
        ignore: ["**/model/**", "**/types/**"],
      },
      {
        path: "~/features/",
        pathPrefix: false,
        ignore: ["**/model/**", "**/types/**"],
      },
      {
        path: "~/widgets/",
        pathPrefix: false,
        ignore: ["**/model/**", "**/types/**"],
      },
    ],
  },

  imports: {
    dirs: [
      "~/shared/lib",
      "composables",
      "~/entities/**/*/model",
      "~/features/**/*/model",
      "~/widgets/**/*/model",
    ],
  },
});
