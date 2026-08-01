import { Link } from 'react-router-dom';
import { Application } from '../types/application';
import { StatusPill } from './StatusPill';
import { JobTypeTag } from './JobTypeTag';
import { formatDate } from '../lib/formatDate';

interface ApplicationsTableProps {
  applications: Application[];
  onRequestDelete: (application: Application) => void;
  pendingDeleteId?: string;
}

const ActionButtons = ({ application, onRequestDelete, isDeleting }: { application: Application; onRequestDelete: (application: Application) => void; isDeleting: boolean }) => (
  <div className="flex items-center gap-1">
    <Link to={`/applications/${application.id}`} aria-label={`View ${application.job_title} at ${application.company_name}`} className="rounded-md p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </Link>
    <Link to={`/applications/${application.id}/edit`} aria-label={`Edit ${application.job_title} at ${application.company_name}`} className="rounded-md p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
      </svg>
    </Link>
    <button type="button" onClick={() => onRequestDelete(application)} disabled={isDeleting} aria-label={`Delete ${application.job_title} at ${application.company_name}`} className="rounded-md p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-stage-rejected-bg)] hover:text-[var(--color-stage-rejected)] disabled:opacity-40">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
      </svg>
    </button>
  </div>
);

export const ApplicationsTable = ({ applications, onRequestDelete, pendingDeleteId }: ApplicationsTableProps) => (
  <>
    <table className="hidden w-full text-left text-sm sm:table">
      <thead>
        <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
          <th className="px-4 py-3 font-medium">Company</th>
          <th className="px-4 py-3 font-medium">Role</th>
          <th className="px-4 py-3 font-medium">Type</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium">Applied</th>
          <th className="px-4 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((application) => (
          <tr key={application.id} className={`border-b border-[var(--color-line)] transition-opacity last:border-0 hover:bg-[var(--color-paper)]/60 ${pendingDeleteId === application.id ? 'opacity-40' : ''}`}>
            <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{application.company_name}</td>
            <td className="px-4 py-3 text-[var(--color-ink)]">{application.job_title}</td>
            <td className="px-4 py-3"><JobTypeTag jobType={application.job_type} /></td>
            <td className="px-4 py-3"><StatusPill status={application.status} /></td>
            <td className="px-4 py-3 text-[var(--color-ink-muted)]">{formatDate(application.applied_date)}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end">
                <ActionButtons application={application} onRequestDelete={onRequestDelete} isDeleting={pendingDeleteId === application.id} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="flex flex-col divide-y divide-[var(--color-line)] sm:hidden">
      {applications.map((application) => (
        <div key={application.id} className={`flex flex-col gap-2 px-4 py-4 transition-opacity ${pendingDeleteId === application.id ? 'opacity-40' : ''}`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-[var(--color-ink)]">{application.job_title}</p>
              <p className="text-sm text-[var(--color-ink-muted)]">{application.company_name}</p>
            </div>
            <ActionButtons application={application} onRequestDelete={onRequestDelete} isDeleting={pendingDeleteId === application.id} />
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={application.status} />
            <JobTypeTag jobType={application.job_type} />
          </div>
          <p className="text-xs text-[var(--color-ink-muted)]">Applied {formatDate(application.applied_date)}</p>
        </div>
      ))}
    </div>
  </>
);