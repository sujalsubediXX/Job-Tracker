import { useEffect, useRef } from 'react';
import { Application } from '../types/application';

interface ConfirmDeleteDialogProps {
  application: Application;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteDialog = ({ application, isDeleting, onConfirm, onCancel }: ConfirmDeleteDialogProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-xl bg-[var(--color-paper-raised)] p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <h2 id="delete-dialog-title" className="font-display text-lg font-semibold text-[var(--color-ink)]">
          Delete this application?
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          This removes <span className="font-medium text-[var(--color-ink)]">{application.job_title}</span> at{' '}
          <span className="font-medium text-[var(--color-ink)]">{application.company_name}</span> permanently. This can't be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button ref={cancelButtonRef} type="button" onClick={onCancel} disabled={isDeleting} className="rounded-md border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper)] disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isDeleting} className="rounded-md bg-[var(--color-stage-rejected)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {isDeleting ? 'Deleting…' : 'Delete application'}
          </button>
        </div>
      </div>
    </div>
  );
};