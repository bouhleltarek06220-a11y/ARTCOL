import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne des classes Tailwind de façon conditionnelle et sans conflit. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
