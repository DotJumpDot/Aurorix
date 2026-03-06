/**
 * Format date to localized string
 */
export function formatDate(date: string | Date, locale: string = "en-US"): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date and time to localized string
 */
export function formatDateTime(date: string | Date, locale: string = "en-US"): string {
  const d = new Date(date);
  return d.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format time only
 */
export function formatTime(date: string | Date, locale: string = "en-US"): string {
  const d = new Date(date);
  return d.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date, locale: string = "en-US"): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffSecs) < 60) {
    return rtf.format(-diffSecs, "second");
  }
  if (Math.abs(diffMins) < 60) {
    return rtf.format(-diffMins, "minute");
  }
  if (Math.abs(diffHours) < 24) {
    return rtf.format(-diffHours, "hour");
  }
  if (Math.abs(diffDays) < 7) {
    return rtf.format(-diffDays, "day");
  }
  if (Math.abs(diffWeeks) < 4) {
    return rtf.format(-diffWeeks, "week");
  }
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(-diffMonths, "month");
  }
  return rtf.format(-diffYears, "year");
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: string | Date): boolean {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Get date string in "YYYY-MM-DD" format
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Parse various date string formats to Date object
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}
