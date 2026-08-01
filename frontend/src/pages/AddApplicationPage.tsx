import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ApplicationForm } from '../components/ApplicationForm';
import { useCreateApplicationMutation } from '../hooks/useApplications';
import { useToast } from '../components/ToastProvider';
import { ApplicationFormValues } from '../types/application';
import { extractApiErrorMessage } from '../api/client';

const DEFAULT_VALUES: ApplicationFormValues = {
  company_name: '',
  job_title: '',
  job_type: 'Full-time',
  status: 'Applied',
  applied_date: new Date().toISOString().slice(0, 10),
  notes: '',
};

export const AddApplicationPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const createMutation = useCreateApplicationMutation();

  const handleSubmit = (values: ApplicationFormValues) => {
    createMutation.mutate(values, {
      onSuccess: (application) => {
        showToast(`Added ${application.job_title} at ${application.company_name}`);
        navigate('/');
      },
      onError: (error) => {
        showToast(extractApiErrorMessage(error, 'Could not create this application'), 'error');
      },
    });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Add application</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">Log a new role you've applied to.</p>
        </div>
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5 shadow-sm sm:p-6">
          <ApplicationForm defaultValues={DEFAULT_VALUES} onSubmit={handleSubmit} isSubmitting={createMutation.isPending} submitLabel="Add application" onCancel={() => navigate('/')} />
        </div>
      </div>
    </AppShell>
  );
};