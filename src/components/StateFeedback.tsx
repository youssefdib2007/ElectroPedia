import { AlertTriangle, Home, Loader2, RotateCcw, SearchX } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';

export function LoadingState({ message }: { message?: string }) {
  const { t } = useI18n();
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center flex flex-col items-center justify-center gap-3"
    >
      <Loader2
        className="w-7 h-7 text-[#2563EB] dark:text-[#00BFFF] animate-spin"
        aria-hidden="true"
      />
      <p className="font-display text-base font-bold text-slate-900 dark:text-white">
        {message ?? t.states.loadingTitle}
      </p>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        {t.states.loadingSubtitle}
      </p>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { t } = useI18n();
  return (
    <div
      data-testid="empty-state"
      className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center flex flex-col items-center"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4">
        <SearchX className="w-6 h-6" aria-hidden="true" />
      </div>
      <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
        {title ?? t.encyclopedia.emptyTitle}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md">
        {subtitle ?? t.encyclopedia.emptySubtitle}
      </p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>{actionLabel ?? t.encyclopedia.resetFilters}</span>
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export function ErrorState({
  title,
  subtitle,
  onRetry,
  onGoHome,
}: ErrorStateProps) {
  const { t } = useI18n();
  return (
    <div
      role="alert"
      data-testid="error-state"
      className="bg-white dark:bg-[#1E293B] border border-rose-200 dark:border-rose-900/50 rounded-xl p-10 text-center flex flex-col items-center"
    >
      <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center text-[#EF4444] mb-4">
        <AlertTriangle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
        {title ?? t.states.errorTitle}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md">
        {subtitle ?? t.states.errorSubtitle}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>{t.states.retryBtn}</span>
          </button>
        )}
        {onGoHome && (
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>{t.states.homeBtn}</span>
          </button>
        )}
      </div>
    </div>
  );
}

interface BoundaryProps {
  children: ReactNode;
  onResetHome?: () => void;
}

interface BoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Error handled gracefully by ErrorState UI
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16">
          <ErrorState
            onRetry={() => this.setState({ hasError: false })}
            onGoHome={() => {
              this.setState({ hasError: false });
              this.props.onResetHome?.();
            }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
