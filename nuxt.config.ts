import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-11-18",
  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@nuxt/image"],

  image: {
    format: ["webp", "avif"],
    domains: ["cdn.starpets.pw", "starpets.pw"],
    provider: "ipx",
    ipx: {
      // Проксируем внешние изображения через наш сервер для избежания third-party cookies
      http: {
        domains: ["cdn.starpets.pw", "starpets.pw"],
      },
    },
    quality: 80,
    // Отключаем cookies для внешних изображений
    modifiers: {
      format: "webp",
    },
  },

  plugins: ["~/plugins/vue-query"],

  css: ["~/app/assets/styles/main.scss"],

  runtimeConfig: {
    public: {
      marketApiBase: process.env.MARKET_API_BASE || "https://market.apineural.com/api/store",
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

  nitro: {
    routeRules: {
      // Security headers для всех страниц
      "/**": {
        headers: {
          // Предотвращаем MIME type sniffing
          "X-Content-Type-Options": "nosniff",
          // Предотвращаем XSS атаки
          "X-XSS-Protection": "1; mode=block",
          // Предотвращаем clickjacking
          "X-Frame-Options": "SAMEORIGIN",
          // Контроль referrer информации (предотвращает утечку информации через referrer)
          "Referrer-Policy": "strict-origin-when-cross-origin",
          // Permissions Policy (бывший Feature-Policy) - отключаем ненужные API
          "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
          // Content Security Policy
          // В dev режиме разрешаем unsafe-inline и unsafe-eval для Nuxt devtools
          // В production эти директивы должны быть удалены
          "Content-Security-Policy": process.env.NODE_ENV === "production"
            ? [
                "default-src 'self'",
                "script-src 'self'",
                "style-src 'self' 'unsafe-inline'", // unsafe-inline необходим для inline стилей Vue
                "img-src 'self' data: https: cdn.starpets.pw starpets.pw",
                "font-src 'self' data:",
                "connect-src 'self' https://market.apineural.com",
                "frame-ancestors 'self'",
                "base-uri 'self'",
                "form-action 'self'",
                "frame-src 'none'",
                "object-src 'none'",
                "upgrade-insecure-requests",
              ].join("; ")
            : [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Для Nuxt devtools
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: https: cdn.starpets.pw starpets.pw",
                "font-src 'self' data:",
                "connect-src 'self' https://market.apineural.com ws: wss:", // WebSocket для HMR
                "frame-ancestors 'self'",
                "base-uri 'self'",
                "form-action 'self'",
                "frame-src 'none'",
                "object-src 'none'",
              ].join("; "),
        },
      },
      // Кеширование статических ресурсов
      "/_nuxt/**": {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      },
      "/assets/**": {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      },
      // Изображения через IPX - не передаем cookies
      "/_ipx/**": {
        headers: {
          "Cache-Control": "public, max-age=86400", // 1 день для изображений
          "Cross-Origin-Resource-Policy": "cross-origin",
        },
      },
    },
  },
});
