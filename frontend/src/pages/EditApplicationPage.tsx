import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ApplicationForm } from '../components/ApplicationForm';
import { Spinner } from '../components/Spinner';
import { ErrorBanner } from '../components/ErrorBanner';
import { useApplicationQuery, useUpdateApplicationMutation } from '../hooks/useApplications';
import { useToast } from '../components/ToastProvider';
import { ApplicationFormValues } from '../types/application';
import { extractApiErrorMessage } from '../api/client';

export const EditApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const applicationQuery = useApplicationQuery(id);
  const updateMutation = useUpdateApplicationMutation();

  if (!id) return null;

  const handleSubmit = (values: ApplicationFormValues) => {
    updateMutation.mutate({ id, values }, {
      onSuccess: (application) => {
        showToast(`Updated ${application.job_title} at ${application.company_name}`);
        navigate('/');
      },
      onError: (error) => {
        showToast(extractApiErrorMessage(error, 'Could not update this application'), 'error');
      },
    });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Edit application</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">Update the details of this application.</p>
        </div>
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5 shadow-sm sm:p-6">
          {applicationQuery.isLoading ? (
            <Spinner label="Loading application" />
          ) : applicationQuery.isError || !applicationQuery.data ? (
            <ErrorBanner message={extractApiErrorMessage(applicationQuery.error, 'Could not load this application')} onRetry={() => applicationQuery.refetch()} />
          ) : (
            <ApplicationForm
              defaultValues={{
                company_name: applicationQuery.data.company_name,
                job_title: applicationQuery.data.job_title,
                job_type: applicationQuery.data.job_type,
                status: applicationQuery.data.status,
                applied_date: applicationQuery.data.applied_date,
                notes: applicationQuery.data.notes ?? '',
              }}
              onSubmit={handleSubmit}
              isSubmitting={updateMutation.isPending}
              submitLabel="Save changes"
              onCancel={() => navigate('/')}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
};