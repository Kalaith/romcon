type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
};

export function FormField({ label, value, onChange, textarea = false }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-rose-600">{label}</span>
      {textarea ? (
        <textarea
          className="min-h-24 w-full rounded-[1.25rem] border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="w-full rounded-[1.25rem] border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
