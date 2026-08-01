interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, totalItems, pageSize, onPageChange }: PaginationProps) => {
  if (totalItems === 0) return null;

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--color-line)] px-4 py-3 text-sm text-[var(--color-ink-muted)] sm:flex-row">
      <span>
        Showing <span className="font-medium text-[var(--color-ink)]">{rangeStart}</span>–
        <span className="font-medium text-[var(--color-ink)]">{rangeEnd}</span> of{' '}
        <span className="font-medium text-[var(--color-ink)]">{totalItems}</span>
      </span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="rounded-md border border-[var(--color-line)] px-3 py-1.5 font-medium text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-[var(--color-paper)]">
          Previous
        </button>
        <span className="px-1 tabular-nums">Page {page} of {totalPages}</span>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="rounded-md border border-[var(--color-line)] px-3 py-1.5 font-medium text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-[var(--color-paper)]">
          Next
        </button>
      </div>
    </div>
  );
};