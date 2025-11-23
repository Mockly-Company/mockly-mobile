import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * tailwindCSS 합성 유틸리티
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
