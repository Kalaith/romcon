type SummaryFieldProps = {
  label: string;
  value?: string | null;
};

export function SummaryField({ label, value }: SummaryFieldProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">{label}</p>
      <p className="text-sm leading-6 text-rose-950/85">{value}</p>
    </div>
  );
}
