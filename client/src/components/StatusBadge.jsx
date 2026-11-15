const STATUS_STYLES = {
  available:
    "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300",
  approved:
    "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300",
  completed:
    "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  confirmed:
    "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  requested:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  rejected:
    "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  cancelled:
    "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  expired:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  claimed:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  active:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
};

function formatStatus(status) {
  return status
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ status, label, className = "" }) {
  const normalizedStatus = status?.toLowerCase() || "pending";
  const statusLabel = label || formatStatus(normalizedStatus);
  const statusClass =
    STATUS_STYLES[normalizedStatus] || STATUS_STYLES.pending;

  return (
    <span
      aria-label={`Status: ${statusLabel}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusClass} ${className}`}
      role="status"
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel}
    </span>
  );
}

export default StatusBadge;