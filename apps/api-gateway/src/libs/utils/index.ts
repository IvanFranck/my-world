export function buildUrlQuery(
  filters: Record<string, string | undefined>,
): string {
  const urlParams = new URLSearchParams();
  const keys = Object.keys(filters);
  keys.forEach((key) => {
    if (filters[key]) {
      urlParams.set(key, filters[key]);
    }
  });

  return urlParams.toString();
}
