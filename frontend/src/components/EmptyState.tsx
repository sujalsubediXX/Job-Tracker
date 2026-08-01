import { Link } from 'react-router-dom';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const EmptyState = ({ hasFilters, onClearFilters }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M3 11h18" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      </svg>
    </div>
    {hasFilters ? (
      <>
        <p className="font-display text-base font-semibold text-[var(--color-ink)]">No applications match these filters</p>
        <p className="max-w-sm text-sm text-[var(--color-ink-muted)]">
          Try a different search term, or clear the stage filter to see everything in your pipeline.
        </p>
        <button type="button" onClick={onClearFilters} className="mt-1 rounded-md border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper)]">
          Clear filters
        </button>
      </>
    ) : (
      <>
        <p className="font-display text-base font-semibold text-[var(--color-ink)]">Your pipeline is empty</p>
        <p className="max-w-sm text-sm text-[var(--color-ink-muted)]">
          Add the first job you've applied to and start tracking it through every stage.
        </p>
        <Link to="/applications/new" className="mt-1 rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-dark)]">
          Add your first application
        </Link>
      </>
    )}
  </div>
);