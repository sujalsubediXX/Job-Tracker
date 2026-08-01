import { ApplicationStatus, APPLICATION_STATUSES, StatusCounts } from '../types/application';

const STAGE_ACTIVE_STYLES: Record<ApplicationStatus, string> = {
  Applied: 'bg-[var(--color-stage-applied)] text-white',
  Interviewing: 'bg-[var(--color-stage-interviewing)] text-white',
  Offer: 'bg-[var(--color-stage-offer)] text-white',
  Rejected: 'bg-[var(--color-stage-rejected)] text-white',
};

interface StageRailProps {
  counts: StatusCounts | undefined;
  activeStatus: ApplicationStatus | '';
  onChange: (status: ApplicationStatus | '') => void;
  totalCount: number;
  isLoading: boolean;
}

export const StageRail = ({ counts, activeStatus, onChange, totalCount, isLoading }: StageRailProps) => {
  return (
    <div role="group" aria-label="Filter applications by hiring stage" className="flex items-stretch overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] shadow-sm">
      <button
        type="button"
        onClick={() => onChange('')}
        aria-pressed={activeStatus === ''}
        className={`flex flex-1 flex-col items-center gap-0.5 border-r border-[var(--color-line)] px-3 py-3 transition-colors sm:px-5 ${
          activeStatus === '' ? 'bg-[var(--color-brand)] text-white' : 'text-[var(--color-ink)] hover:bg-[var(--color-brand-light)]'
        }`}
      >
        <span className="font-display text-lg font-semibold tabular-nums sm:text-xl">{isLoading ? '–' : totalCount}</span>
        <span className="text-[11px] font-medium uppercase tracking-wide opacity-80">All</span>
      </button>

      {APPLICATION_STATUSES.map((status, index) => {
        const isActive = activeStatus === status;
        const count = counts?.[status] ?? 0;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(isActive ? '' : status)}
            aria-pressed={isActive}
            className={`flex flex-1 flex-col items-center gap-0.5 px-3 py-3 transition-colors sm:px-5 ${
              index < APPLICATION_STATUSES.length - 1 ? 'border-r border-[var(--color-line)]' : ''
            } ${isActive ? STAGE_ACTIVE_STYLES[status] : 'text-[var(--color-ink)] hover:bg-[var(--color-paper)]'}`}
          >
            <span className="font-display text-lg font-semibold tabular-nums sm:text-xl">{isLoading ? '–' : count}</span>
            <span className="text-[11px] font-medium uppercase tracking-wide opacity-80">{status}</span>
          </button>
        );
      })}
    </div>
  );
};