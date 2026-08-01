import { ApplicationStatus } from '../types/application';

const STYLES: Record<ApplicationStatus, string> = {
  Applied: 'text-[var(--color-stage-applied)] bg-[var(--color-stage-applied-bg)]',
  Interviewing: 'text-[var(--color-stage-interviewing)] bg-[var(--color-stage-interviewing-bg)]',
  Offer: 'text-[var(--color-stage-offer)] bg-[var(--color-stage-offer-bg)]',
  Rejected: 'text-[var(--color-stage-rejected)] bg-[var(--color-stage-rejected-bg)]',
};

export const StatusPill = ({ status }: { status: ApplicationStatus }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status]}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {status}
  </span>
);