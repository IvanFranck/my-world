import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title?: string): string {
  if (!title) {
    return "";
  }
  return title
    .toLowerCase()
    .normalize("NFD") // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9]+/g, "-") // Remplacer les non-alphanumériques par des tirets
    .replace(/(^-|-$)/g, ""); // Enlever les tirets en début/fin
}
