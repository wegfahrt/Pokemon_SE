import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// This utility function combines class names and merges them intelligently.
// It uses clsx to handle conditional class names and tailwind-merge to resolve conflicts.
// It allows you to pass any number of class names as arguments and returns a single string with the merged class names.
/**
 * Combines class names and merges them intelligently.
 * @param inputs - The class names to combine.
 * @returns The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}