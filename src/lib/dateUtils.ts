import { differenceInMinutes, format as dateFnsFormat } from "date-fns";

/**
 * Safely parse a date from various input formats.
 * Handles undefined, null, invalid strings, and numeric timestamps.
 * Gmail's internalDate is a reliable Unix timestamp in milliseconds.
 */
export function safeParseDate(dateInput: string | number | undefined | null): Date | null {
  if (dateInput === undefined || dateInput === null || dateInput === '') {
    return null;
  }

  try {
    // Handle numeric timestamps (Gmail's internalDate is milliseconds)
    if (typeof dateInput === 'number') {
      const date = new Date(dateInput);
      return isNaN(date.getTime()) ? null : date;
    }

    // Handle string timestamps (numeric strings from API)
    if (/^\d+$/.test(String(dateInput))) {
      const timestamp = Number(dateInput);
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? null : date;
    }

    // Handle standard date strings
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Format a date to relative time (e.g., "Just now", "2h ago", "Yesterday")
 * Returns empty string if date is invalid.
 */
export function formatSafeRelativeTime(dateInput: string | number | undefined | null): string {
  const date = safeParseDate(dateInput);
  if (!date) return '';

  try {
    const now = new Date();
    const diffMins = differenceInMinutes(now, date);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    const diffDays = Math.floor(diffHours / 24);

    // This week - show day name
    if (diffDays < 7) {
      return dateFnsFormat(date, "EEE"); // Mon, Tue, etc.
    }

    // Same year - show "Jan 5"
    if (date.getFullYear() === now.getFullYear()) {
      return dateFnsFormat(date, "MMM d");
    }

    // Previous year - show "Jan 5, 2024"
    return dateFnsFormat(date, "MMM d, yyyy");
  } catch {
    return '';
  }
}

/**
 * Format a date in a standard format for display.
 * Returns fallback text if date is invalid.
 */
export function formatSafeDate(
  dateInput: string | number | undefined | null,
  formatStr: string = "PPpp",
  fallback: string = "Date unavailable"
): string {
  const date = safeParseDate(dateInput);
  if (!date) return fallback;

  try {
    return dateFnsFormat(date, formatStr);
  } catch {
    return fallback;
  }
}
