import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Query parameter utilities
export function getQueryParam(param: string): string | null {
  if (typeof window === "undefined") return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function parseServicesFromQuery(): string[] {
  const services = getQueryParam("service");
  if (!services) return [];

  try {
    return decodeURIComponent(services).split(",").filter(Boolean);
  } catch {
    return [];
  }
}
