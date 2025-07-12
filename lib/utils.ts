import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats job type by replacing underscores with spaces and capitalizing properly
 * @param jobType - The job type string (e.g., "part_time", "full_time")
 * @returns Formatted job type (e.g., "Part Time", "Full Time")
 * 
 * Examples:
 * - "part_time" → "Part Time"
 * - "full_time" → "Full Time"
 * - "contract" → "Contract"
 * - "remote" → "Remote"
 * - "hybrid" → "Hybrid"
 */
export function formatJobType(jobType: string): string {
  if (!jobType) return jobType
  
  // Replace underscores with spaces and capitalize each word
  return jobType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
