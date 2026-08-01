import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { StageRail } from '../components/StageRail';
import { SearchBar } from '../components/SearchBar';
import { ApplicationsTable } from '../components/ApplicationsTable';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';
import { Spinner } from '../components/Spinner';
import { ErrorBanner } from '../components/ErrorBanner';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { useApplicationsQuery, useDeleteApplicationMutation, useStatusCountsQuery } from '../hooks/useApplications';
import { useToast } from '../components/ToastProvider';
import { Application, ApplicationStatus } from '../types/application';
import { extractApiErrorMessage } from '../api/client';

const PAGE_SIZE = 10;

export const ApplicationListPage = () => {
  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Application | null>(null);
  const { showToast } = useToast();

  const query = useApplicationsQuery({ status, search, page, pageSize: PAGE_SIZE });
  const countsQuery = useStatusCountsQuery(search);
  const deleteMutation = useDeleteApplicationMutation();

  const totalCount = (countsQuery.data
    ? Object.values(countsQuery.data).reduce((sum, value) => sum + value, 0)
    : query.data?.meta.totalItems) ?? 0;

  const handleStatusChange = (next: ApplicationStatus | '') => {
    setStatus(next);
    setPage(1);
  };

  const handleSearchChange = (next: string) => {
    setSearch(next);
    setPage(1);
  };

  const handleClearFilters = () => {
    setStatus('');
    setSearch('');
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    deleteMutation.mutate(target.id, {
      onSuccess: () => {
        showToast(`Deleted ${target.job_title} at ${target.company_name}`);
        setPendingDelete(null);
      },
      onError: (error) => {
        showToast(extractApiErrorMessage(error, 'Could not delete this application'), 'error');
        setPendingDelete(null);
      },
    });
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Your applications</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">Track every role from first application to offer or rejection.</p>
        </div>

        <StageRail counts={countsQuery.data} activeStatus={status} onChange={handleStatusChange} totalCount={totalCount} isLoading={countsQuery.isLoading} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={search} onChange={handleSearchChange} />
          <Link to="/applications/new" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-dark)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add application
          </Link>
        </div>

        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] shadow-sm">
          {query.isLoading ? (
            <Spinner label="Loading applications" />
          ) : query.isError ? (
            <div className="p-4">
              <ErrorBanner message={extractApiErrorMessage(query.error, 'Could not load applications')} onRetry={() => query.refetch()} />
            </div>
          ) : query.data && query.data.data.length > 0 ? (
            <>
              <ApplicationsTable applications={query.data.data} onRequestDelete={setPendingDelete} pendingDeleteId={deleteMutation.isPending ? pendingDelete?.id : undefined} />
              <Pagination page={query.data.meta.page} totalPages={query.data.meta.totalPages} totalItems={query.data.meta.totalItems} pageSize={query.data.meta.pageSize} onPageChange={setPage} />
            </>
          ) : (
            <EmptyState hasFilters={Boolean(status || search)} onClearFilters={handleClearFilters} />
          )}
        </div>
      </div>

      {pendingDelete && (
        <ConfirmDeleteDialog application={pendingDelete} isDeleting={deleteMutation.isPending} onConfirm={handleConfirmDelete} onCancel={() => setPendingDelete(null)} />
      )}
    </AppShell>
  );
};