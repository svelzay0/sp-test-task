export default defineEventHandler((event) => {
  // Middleware для установки дополнительных security headers
  // и предотвращения third-party cookies
  
  const url = event.node.req.url;
  
  // Для изображений через IPX - убеждаемся, что не передаются cookies
  // IPX проксирует внешние изображения через наш сервер,
  // что предотвращает установку third-party cookies браузером
  if (url?.startsWith("/_ipx/")) {
    event.node.res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    // Не устанавливаем Cross-Origin-Embedder-Policy, так как это может сломать загрузку ресурсов
  }
  
  // Для API endpoints - CORS заголовки (если нужно)
  if (url?.startsWith("/api/")) {
    // В production можно ограничить origin
    const origin = event.node.req.headers.origin;
    if (origin) {
      event.node.res.setHeader("Access-Control-Allow-Origin", origin);
      event.node.res.setHeader("Access-Control-Allow-Credentials", "false"); // Не передаем cookies
    }
  }
});

