import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SERVICE_OPTIONS } from "./validations/onboarding-schema";

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
  if (typeof window === "undefined") return [];
  const urlParams = new URLSearchParams(window.location.search);
  const servicesFromQuery = urlParams.getAll("service"); // Multiple services can be selected

  if (servicesFromQuery.length === 0) return [];

  try {
    const allServices = servicesFromQuery.flatMap((service) =>
      decodeURIComponent(service)
        .split(",")
        .map((s) => s.trim())
    );
    return allServices.filter(
      (service) =>
        service &&
        SERVICE_OPTIONS.includes(service as (typeof SERVICE_OPTIONS)[number])
    );
  } catch {
    return [];
  }
}
