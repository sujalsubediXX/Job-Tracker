import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { APPLICATION_STATUSES, ApplicationFormValues, JOB_TYPES } from '../types/application';
import { applicationFormSchema } from './applicationFormSchema';

interface ApplicationFormProps {
  defaultValues: ApplicationFormValues;
  onSubmit: (values: ApplicationFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
}

const fieldClasses = 'w-full rounded-lg border bg-[var(--color-paper-raised)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)]';
const labelClasses = 'mb-1.5 block text-sm font-medium text-[var(--color-ink)]';

export const ApplicationForm = ({ defaultValues, onSubmit, isSubmitting, submitLabel, onCancel }: ApplicationFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="company_name" className={labelClasses}>
          Company name <span className="text-[var(--color-stage-rejected)]">*</span>
        </label>
        <input id="company_name" type="text" autoFocus {...register('company_name')} aria-invalid={Boolean(errors.company_name)}
          className={`${fieldClasses} ${errors.company_name ? 'border-[var(--color-stage-rejected)]' : 'border-[var(--color-line)]'}`}
          placeholder="e.g. Acme Corp" />
        {errors.company_name && <p className="mt-1 text-sm text-[var(--color-stage-rejected)]">{errors.company_name.message}</p>}
      </div>

      <div>
        <label htmlFor="job_title" className={labelClasses}>
          Job title <span className="text-[var(--color-stage-rejected)]">*</span>
        </label>
        <input id="job_title" type="text" {...register('job_title')} aria-invalid={Boolean(errors.job_title)}
          className={`${fieldClasses} ${errors.job_title ? 'border-[var(--color-stage-rejected)]' : 'border-[var(--color-line)]'}`}
          placeholder="e.g. Frontend Engineer" />
        {errors.job_title && <p className="mt-1 text-sm text-[var(--color-stage-rejected)]">{errors.job_title.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="job_type" className={labelClasses}>
            Job type <span className="text-[var(--color-stage-rejected)]">*</span>
          </label>
          <select id="job_type" {...register('job_type')} className={`${fieldClasses} border-[var(--color-line)]`}>
            {JOB_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className={labelClasses}>
            Status <span className="text-[var(--color-stage-rejected)]">*</span>
          </label>
          <select id="status" {...register('status')} className={`${fieldClasses} border-[var(--color-line)]`}>
            {APPLICATION_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="applied_date" className={labelClasses}>
          Applied date <span className="text-[var(--color-stage-rejected)]">*</span>
        </label>
        <input id="applied_date" type="date" {...register('applied_date')} aria-invalid={Boolean(errors.applied_date)}
          className={`${fieldClasses} ${errors.applied_date ? 'border-[var(--color-stage-rejected)]' : 'border-[var(--color-line)]'}`} />
        {errors.applied_date && <p className="mt-1 text-sm text-[var(--color-stage-rejected)]">{errors.applied_date.message}</p>}
      </div>

      <div>
        <label htmlFor="notes" className={labelClasses}>Notes</label>
        <textarea id="notes" rows={4} {...register('notes')} className={`${fieldClasses} border-[var(--color-line)] resize-none`}
          placeholder="Recruiter contact, referral, interview prep, anything worth remembering later" />
        {errors.notes && <p className="mt-1 text-sm text-[var(--color-stage-rejected)]">{errors.notes.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-md border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper)] disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-dark)] disabled:opacity-60">
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
};