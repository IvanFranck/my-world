type QueryValue = string | number | undefined;
export function buildUrlQuery<T extends Record<string, QueryValue>>(
  filters: T,
): string {
  const urlParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      urlParams.set(key, value.toString());
    }
  });

  return urlParams.toString();
}
