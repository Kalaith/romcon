type StringListEditorProps = {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
};

export function StringListEditor({ label, items, onChange }: StringListEditorProps) {
  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, currentIndex) => (currentIndex === index ? value : item)));
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, currentIndex) => currentIndex !== index));
  };

  const addItem = () => {
    onChange([...items, '']);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">{label}</span>
        <button className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-700" onClick={addItem}>
          Add line
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <textarea
              className="min-h-20 w-full rounded-[1.25rem] border border-rose-200 bg-white px-4 py-3 text-sm text-rose-950"
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
            />
            <button className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-rose-700" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
        ))}
        {items.length === 0 ? <p className="text-sm text-rose-800/70">No items yet.</p> : null}
      </div>
    </div>
  );
}
