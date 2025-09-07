export function formatDateTime(
  date: Date | string,
  locale: string = "th-TH",
  options: Intl.DateTimeFormatOptions = {}
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale, { 
    timeZone: "Asia/Bangkok", 
    ...options 
  });
}
