type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
};

export function FormField({ label, value, onChange, textarea = false }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">{label}</span>
      {textarea ? (
        <textarea
          className="min-h-24 w-full rounded-[1.25rem] border border-rose-200 bg-white px-4 py-3 text-sm text-rose-950"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="w-full rounded-[1.25rem] border border-rose-200 bg-white px-4 py-3 text-sm text-rose-950"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
