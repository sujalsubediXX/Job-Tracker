import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { StatusPill } from '../components/StatusPill';
import { JobTypeTag } from '../components/JobTypeTag';
import { Spinner } from '../components/Spinner';
import { ErrorBanner } from '../components/ErrorBanner';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { useApplicationQuery, useDeleteApplicationMutation } from '../hooks/useApplications';
import { useToast } from '../components/ToastProvider';
import { formatDate, formatDateTime } from '../lib/formatDate';
import { extractApiErrorMessage } from '../api/client';

export const ViewApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const applicationQuery = useApplicationQuery(id);
  const deleteMutation = useDeleteApplicationMutation();

  if (!id) return null;

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        showToast('Application deleted');
        navigate('/');
      },
      onError: (error) => {
        showToast(extractApiErrorMessage(error, 'Could not delete this application'), 'error');
        setConfirmingDelete(false);
      },
    });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to applications
        </Link>

        {applicationQuery.isLoading ? (
          <Spinner label="Loading application" />
        ) : applicationQuery.isError || !applicationQuery.data ? (
          <ErrorBanner message={extractApiErrorMessage(applicationQuery.error, 'Could not load this application')} onRetry={() => applicationQuery.refetch()} />
        ) : (
          <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">{applicationQuery.data.job_title}</h1>
                <p className="text-[var(--color-ink-muted)]">{applicationQuery.data.company_name}</p>
              </div>
              <StatusPill status={applicationQuery.data.status} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--color-line)] pt-5 text-sm">
              <div>
                <p className="text-[var(--color-ink-muted)]">Job type</p>
                <div className="mt-1"><JobTypeTag jobType={applicationQuery.data.job_type} /></div>
              </div>
              <div>
                <p className="text-[var(--color-ink-muted)]">Applied date</p>
                <p className="mt-1 font-medium text-[var(--color-ink)]">{formatDate(applicationQuery.data.applied_date)}</p>
              </div>
              <div>
                <p className="text-[var(--color-ink-muted)]">Created</p>
                <p className="mt-1 text-[var(--color-ink)]">{formatDateTime(applicationQuery.data.created_at)}</p>
              </div>
              <div>
                <p className="text-[var(--color-ink-muted)]">Last updated</p>
                <p className="mt-1 text-[var(--color-ink)]">{formatDateTime(applicationQuery.data.updated_at)}</p>
              </div>
            </div>

            {applicationQuery.data.notes && (
              <div className="mt-5 border-t border-[var(--color-line)] pt-5 text-sm">
                <p className="mb-1 text-[var(--color-ink-muted)]">Notes</p>
                <p className="whitespace-pre-wrap text-[var(--color-ink)]">{applicationQuery.data.notes}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2 border-t border-[var(--color-line)] pt-5">
              <button type="button" onClick={() => setConfirmingDelete(true)} className="rounded-md border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-stage-rejected)] hover:bg-[var(--color-stage-rejected-bg)]">
                Delete
              </button>
              <Link to={`/applications/${id}/edit`} className="rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-dark)]">
                Edit application
              </Link>
            </div>
          </div>
        )}
      </div>

      {confirmingDelete && applicationQuery.data && (
        <ConfirmDeleteDialog application={applicationQuery.data} isDeleting={deleteMutation.isPending} onConfirm={handleDelete} onCancel={() => setConfirmingDelete(false)} />
      )}
    </AppShell>
  );
};