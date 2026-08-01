import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-[var(--color-paper)]">
    <header className="border-b border-[var(--color-line)] bg-[var(--color-paper-raised)]">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="5" cy="12" r="3" fill="white" />
              <circle cx="12" cy="12" r="3" fill="var(--color-amber)" />
              <circle cx="19" cy="12" r="3" fill="white" fillOpacity="0.55" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--color-ink)]">Pipeline</span>
        </Link>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
  </div>
);