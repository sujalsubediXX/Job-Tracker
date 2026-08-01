import { JobType } from '../types/application';

export const JobTypeTag = ({ jobType }: { jobType: JobType }) => (
  <span className="inline-flex items-center rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-2 py-0.5 text-xs font-medium text-[var(--color-ink-muted)]">
    {jobType}
  </span>
);