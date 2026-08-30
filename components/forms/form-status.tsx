import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Shared submit feedback. There is no backend connected yet, so the
 * success state says what actually happened rather than claiming a
 * record was saved. See TODO_ENDPOINTS.md for the endpoints to wire.
 */
export function FormStatus({ state, successTitle, successBody }: { state: 'idle' | 'submitting' | 'success' | 'error'; successTitle: string; successBody: string }) {
  if (state === 'idle') return null;

  if (state === 'submitting') {
    return (
      <p className="flex items-center gap-3 border border-line px-4 py-3 text-sm text-mute" role="status">
        <Loader2 className="h-4 w-4 animate-spin text-gold" aria-hidden />
        Sending…
      </p>
    );
  }

  if (state === 'error') {
    return (
      <p className="flex items-start gap-3 border border-error/40 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>That did not go through. Check your connection and try again, or call us on 0701 381 197.</span>
      </p>
    );
  }

  return (
    <div className="border border-success/40 bg-success/5 p-5" role="status">
      <p className="flex items-center gap-3 font-display text-sm font-bold uppercase tracking-wide text-success">
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        {successTitle}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-mute">{successBody}</p>
    </div>
  );
}
