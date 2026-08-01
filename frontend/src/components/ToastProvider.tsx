import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type ToastVariant = 'success' | 'error';

interface ToastMessage {
  id: number;
  variant: ToastVariant;
  text: string;
}

interface ToastContextValue {
  showToast: (text: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, variant: ToastVariant = 'success') => {
    const id = nextId++;
    setToasts((current) => [...current, { id, variant, text }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-2" role="region" aria-label="Notifications">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg transition-all ${
              toast.variant === 'success'
                ? 'border-[var(--color-stage-offer)]/20 bg-[var(--color-stage-offer-bg)] text-[var(--color-stage-offer)]'
                : 'border-[var(--color-stage-rejected)]/20 bg-[var(--color-stage-rejected-bg)] text-[var(--color-stage-rejected)]'
            }`}
          >
            <span className="font-medium">{toast.text}</span>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification" className="shrink-0 opacity-60 hover:opacity-100">
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};