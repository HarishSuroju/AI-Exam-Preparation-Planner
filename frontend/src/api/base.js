const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";

export function apiUrl(path) {
  if (!rawBaseUrl) {
    return path;
  }

  const normalizedBase = rawBaseUrl.endsWith("/")
    ? rawBaseUrl.slice(0, -1)
    : rawBaseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}
