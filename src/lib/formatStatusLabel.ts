/** e.g. `cancelled` → `Cancelled`, `in_progress` → `In progress` */
export function formatStatusLabel(status: string): string {
  const label = status.replace(/_/g, " ").trim();
  if (!label) return "";
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}
