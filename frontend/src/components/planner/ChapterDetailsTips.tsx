import { chapterDetailTips } from '../../data/chapterDetailTips';

export function ChapterDetailsTips() {
  return (
    <div className="rounded-[1.5rem] bg-rose-50/80 p-5 text-sm text-rose-900/80">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">Helpful prompts</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {chapterDetailTips.map((item) => (
          <div key={item.label} className="rounded-[1.25rem] bg-white/85 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-rose-950/80">{item.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
