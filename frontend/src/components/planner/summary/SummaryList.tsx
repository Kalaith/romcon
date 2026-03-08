type SummaryListProps = {
  items: string[];
};

export function SummaryList({ items }: SummaryListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-rose-800/65">Nothing added yet.</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-rose-950/85">
      {items.map((item) => (
        <li key={item} className="rounded-[1.25rem] bg-white/80 px-4 py-3">
          {item}
        </li>
      ))}
    </ul>
  );
}
