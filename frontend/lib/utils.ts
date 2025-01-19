import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { ApiResponse } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function normalizeString(str: string): string {
  // Remove extra whitespace and convert to lowercase
  return str.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Compares two strings, ignoring case and extra whitespace */
export function compareStringsLossy(str1: string, str2: string): boolean {
  return normalizeString(str1) === normalizeString(str2);
}
export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  const data: ApiResponse<T> = await res.json();

  return data;
}

export const getAbsoluteUrl = (path: string) => {
  let baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_APP_URL;

  return `${baseUrl}${path}`;
};
