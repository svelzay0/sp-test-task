/**
 * Composable для проксирования внешних изображений через IPX
 * Это предотвращает установку third-party cookies браузером
 */
export const useImageProxy = () => {
  /**
   * Преобразует внешний URL изображения в проксированный через IPX
   * @param imageUri - URL изображения (может быть внешним или локальным)
   * @returns Проксированный URL через /_ipx/ или исходный URL для локальных изображений
   */
  const getProxiedImageUrl = (imageUri: string): string => {
    if (!imageUri) return imageUri;

    // Если это уже локальный путь или относительный путь, возвращаем как есть
    if (imageUri.startsWith("/") || imageUri.startsWith("./")) {
      return imageUri;
    }

    // Если это data URI, возвращаем как есть
    if (imageUri.startsWith("data:")) {
      return imageUri;
    }

    try {
      const url = new URL(imageUri);
      
      // Проверяем, является ли это внешним доменом, который нужно проксировать
      const externalDomains = ["cdn.starpets.pw", "starpets.pw"];
      const isExternalDomain = externalDomains.some(domain => 
        url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      );

      if (isExternalDomain) {
        // Преобразуем внешний URL в формат IPX прокси
        // IPX поддерживает формат: /_ipx/https://cdn.starpets.pw/path/to/image.webp
        // Нужно закодировать URL для безопасной передачи
        const encodedUrl = encodeURIComponent(imageUri);
        return `/_ipx/${encodedUrl}`;
      }

      // Для других внешних доменов также проксируем
      const encodedUrl = encodeURIComponent(imageUri);
      return `/_ipx/${encodedUrl}`;
    } catch {
      // Если не удалось распарсить URL, возвращаем как есть
      return imageUri;
    }
  };

  return {
    getProxiedImageUrl,
  };
};

