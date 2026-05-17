export function formatMinutes(minutes) {
  if (!Number.isFinite(minutes)) return "unknown";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export function shortDate(dateTime) {
  if (!dateTime) return "unknown";
  return dateTime.replace("T", " ");
}
