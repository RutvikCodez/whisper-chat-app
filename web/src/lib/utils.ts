const MS_MINUTE = 60_000;
const MS_HOUR = 3_600_000;
const MS_DAY = 86_400_000;
const MS_WEEK = 604_800_000;
export function formatTime(date: Date | string | null | undefined) {
  if (!date) return "";

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();

  const diff = now.getTime() - d.getTime();

  if (diff < 0)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
   if (diff < MS_MINUTE) return "now";
  if (diff < MS_HOUR) return `${Math.floor(diff / MS_MINUTE)}m`;
  if (diff < MS_DAY)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diff < MS_WEEK) return d.toLocaleDateString([], { weekday: "short" });

  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
