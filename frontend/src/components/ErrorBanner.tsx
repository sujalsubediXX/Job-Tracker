export const ErrorBanner = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--color-stage-rejected)]/25 bg-[var(--color-stage-rejected-bg)] px-4 py-3 text-sm text-[var(--color-stage-rejected)]">
    <span>{message}</span>
    {onRetry && (
      <button type="button" onClick={onRetry} className="shrink-0 rounded-md border border-current px-3 py-1 text-xs font-semibold hover:bg-white/40">
        Try again
      </button>
    )}
  </div>
);