import type { BeatAuditResult } from '../../types';

type BeatAuditPanelProps = {
  audit: BeatAuditResult | null;
  isAuditing: boolean;
  disabled?: boolean;
  onRunAudit: () => void;
};

const severityStyles: Record<string, string> = {
  high: 'bg-rose-600 text-white',
  medium: 'bg-amber-500 text-white',
  low: 'bg-stone-400 text-white',
};

export function BeatAuditPanel({ audit, isAuditing, disabled = false, onRunAudit }: BeatAuditPanelProps) {
  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Formula Audit</p>
          <h3 className="font-display text-2xl text-stone-950">Stress-test the beats</h3>
          <p className="mt-1 text-sm text-stone-600">
            Checks the plan against the romance Formula: a reasonable first refusal, a telegraphed blow-up no conversation could fix, and a finale where love wins.
          </p>
        </div>
        <button
          className="shrink-0 rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled || isAuditing}
          onClick={onRunAudit}
          type="button"
        >
          {isAuditing ? 'Auditing beats...' : 'Run Beat Audit'}
        </button>
      </div>

      {audit ? (
        <div className="mt-5 space-y-4">
          <div
            className={`rounded-[1.5rem] border p-4 text-sm ${
              audit.verdict === 'pass' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-950'
            }`}
          >
            <p className="font-semibold">{audit.verdict === 'pass' ? 'Pass: the plan holds up against the Formula.' : 'Needs attention before drafting.'}</p>
            {audit.overall_note ? <p className="mt-1">{audit.overall_note}</p> : null}
          </div>

          {audit.flags.length > 0 ? (
            <div className="space-y-3">
              {audit.flags.map((flag, index) => (
                <article key={`audit-flag-${index}`} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${severityStyles[flag.severity.toLowerCase()] ?? severityStyles.low}`}>
                      {flag.severity}
                    </span>
                    {flag.beat ? (
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-rose-800">{flag.beat}</span>
                    ) : null}
                    {flag.chapter_reference ? <span className="text-xs font-semibold text-stone-500">{flag.chapter_reference}</span> : null}
                  </div>
                  <p className="mt-2 text-sm text-stone-800">{flag.issue}</p>
                  {flag.suggested_fix ? (
                    <p className="mt-2 text-sm text-stone-600">
                      <strong>Suggested fix:</strong> {flag.suggested_fix}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
