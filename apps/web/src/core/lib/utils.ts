import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildUrlQuery<T extends object>(filters: T): string {
  const urlParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      urlParams.set(key, value.toString());
    }
  });

  return urlParams.toString();
}
