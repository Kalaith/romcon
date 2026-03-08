type PlannerListProps = {
  items: string[];
  emptyText: string;
};

export function PlannerList({ items, emptyText }: PlannerListProps) {
  if (items.length === 0) {
    return <p className="mt-3 text-sm text-rose-800/70">{emptyText}</p>;
  }

  return (
    <ul className="mt-3 space-y-2 text-sm text-rose-900/80">
      {items.map((item) => (
        <li key={item} className="rounded-xl bg-white/70 px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  );
}
