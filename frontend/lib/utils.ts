import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function normalizeString(str: string): string {
  // Remove extra whitespace and convert to lowercase
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Compares two strings, ignoring case and extra whitespace */
export function compareStringsLossy(str1: string, str2: string): boolean {
  return normalizeString(str1) === normalizeString(str2);
}
