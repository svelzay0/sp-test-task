// https://nuxt.com/docs/api/configuration/nuxt-config
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["vuetify-nuxt-module", "@pinia/nuxt", "nuxt-qrcode"],

  runtimeConfig: {
    public: {
      dummyJsonBase: "https://dummyjson.com",
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
      { path: "~/entities/", pathPrefix: false, ignore: ["**/model/**"] },
      { path: "~/features/", pathPrefix: false, ignore: ["**/model/**"] },
    ],
  },

  imports: {
    dirs: [
      "~/shared/lib",
      "composables",
      "~/entities/**/*/model",
      "~/features/**/*/model",
    ],
  },
});
