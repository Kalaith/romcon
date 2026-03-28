type PlannerListProps = {
  items: string[];
  emptyText: string;
};

export function PlannerList({ items, emptyText }: PlannerListProps) {
  if (items.length === 0) {
    return <p className="mt-3 text-sm text-stone-600">{emptyText}</p>;
  }

  return (
    <ul className="mt-3 space-y-2 text-sm text-stone-700">
      {items.map((item) => (
        <li key={item} className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  );
}
