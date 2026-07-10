import { useState } from 'react';
import { getAllowedHeatLevels } from '../../constants/heatLevels';
import type { ShortScript } from '../../types';

type ShortsWorkspaceProps = {
  shorts: ShortScript[];
  isGenerating: boolean;
  isGuestUser: boolean;
  writerProfile: string | null;
  message: string | null;
  error: string | null;
  onGenerateShort: (input: { brief: string; setting: string; trope: string; extraDirection: string; heatLevel: string }) => Promise<void>;
  onDeleteShort: (shortId: number) => Promise<void>;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

function buildCopyText(short: ShortScript): string {
  const lines = [
    `${short.title}`,
    short.logline ? `Logline: ${short.logline}` : '',
    '',
    `HOOK: ${short.hook}`,
    '',
    ...short.segments.map((segment) => {
      const caption = segment.on_screen_text ? ` (ON SCREEN: ${segment.on_screen_text})` : '';
      return `[${segment.time_range}] ${segment.beat.toUpperCase()}\n${segment.narration}${caption}`;
    }),
    '',
    `CTA: ${short.call_to_action}`,
  ];
  return lines.filter((line, index) => line !== '' || index > 0).join('\n');
}

function buildJsonPackage(short: ShortScript, writerProfile: string | null): string {
  return JSON.stringify(
    {
      meta: {
        app: 'RomCon',
        exported_at: new Date().toISOString(),
        short_id: short.id ?? null,
        title: short.title,
        heat_level: short.heat_level,
        estimated_duration_seconds: short.estimated_duration_seconds,
        word_count: short.word_count,
      },
      ai_short_video_package: {
        instruction:
          'Use this package to produce a roughly two minute romance YouTube Short. Preserve the hook, beat order, narration, segment timing, on-screen captions, and call to action.',
        writer_profile: writerProfile ?? '',
        title: short.title,
        logline: short.logline,
        trope: short.trope,
        brief: short.brief,
        setting: short.setting,
        heat_level: short.heat_level,
        hook: short.hook,
        segments: short.segments,
        call_to_action: short.call_to_action,
        estimated_duration_seconds: short.estimated_duration_seconds,
        word_count: short.word_count,
      },
    },
    null,
    2
  );
}

export function ShortsWorkspace({ shorts, isGenerating, isGuestUser, writerProfile, message, error, onGenerateShort, onDeleteShort }: ShortsWorkspaceProps) {
  const [brief, setBrief] = useState('');
  const [setting, setSetting] = useState('');
  const [trope, setTrope] = useState('');
  const [extraDirection, setExtraDirection] = useState('');
  const [heatLevel, setHeatLevel] = useState('sweet');
  const [copied, setCopied] = useState<{ id: number; kind: 'script' | 'json' } | null>(null);

  const heatOptions = getAllowedHeatLevels(isGuestUser);
  const canGenerate = brief.trim() !== '' || trope.trim() !== '' || extraDirection.trim() !== '';

  const copyShort = async (short: ShortScript, kind: 'script' | 'json') => {
    const text = kind === 'json' ? buildJsonPackage(short, writerProfile) : buildCopyText(short);
    await navigator.clipboard.writeText(text);
    if (short.id) {
      setCopied({ id: short.id, kind });
      window.setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(190,24,93,0.10),rgba(255,255,255,0.92))] p-6 shadow-[0_18px_70px_rgba(128,60,73,0.10)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">Shorts Studio</p>
        <h2 className="mt-2 font-display text-4xl text-rose-950">Bite-sized romance for YouTube Shorts</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-rose-900/75">
          One complete arc, condensed hard: hook, meet-cute, the wall, stuck together, the spark, the blow-up, love wins. Roughly two minutes of narration with
          on-screen captions, ready to record. Shorts live here on their own, separate from your novella plans: paste in whatever seed you like.
        </p>
        {message ? <p className="mt-4 text-sm text-rose-700">{message}</p> : null}
        {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
      </div>

      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">New Short</p>
        <h3 className="mt-2 font-display text-2xl text-stone-950">Give it a seed</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">
          A one-line idea is enough. If you want to condense one of your full stories, copy its concept brief into the seed box.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-semibold text-stone-900" htmlFor="shorts-brief">Story seed</label>
            <textarea
              id="shorts-brief"
              className="mt-2 min-h-24 w-full rounded-[1.25rem] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none focus:border-rose-400"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              placeholder="Example: a wedding planner is hired by the ex who left her at the altar."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-stone-900" htmlFor="shorts-setting">Setting</label>
              <input
                id="shorts-setting"
                className="mt-2 w-full rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none focus:border-rose-400"
                value={setting}
                onChange={(event) => setSetting(event.target.value)}
                placeholder="Example: small coastal town in winter"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-900" htmlFor="shorts-trope">Main trope</label>
              <input
                id="shorts-trope"
                className="mt-2 w-full rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none focus:border-rose-400"
                value={trope}
                onChange={(event) => setTrope(event.target.value)}
                placeholder="Example: enemies to lovers"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-900" htmlFor="shorts-heat">Heat level</label>
              <select
                id="shorts-heat"
                className="mt-2 w-full rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none focus:border-rose-400"
                value={heatLevel}
                onChange={(event) => setHeatLevel(event.target.value)}
              >
                {heatOptions.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-stone-900" htmlFor="shorts-direction">Extra direction (optional)</label>
            <textarea
              id="shorts-direction"
              className="mt-2 min-h-20 w-full rounded-[1.25rem] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-950 outline-none focus:border-rose-400"
              value={extraDirection}
              onChange={(event) => setExtraDirection(event.target.value)}
              placeholder="Example: make the hook a question, end on a cliffhanger vote for part two."
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-stone-600">Target: about 300-340 narrated words, roughly two minutes on screen.</p>
          <button
            className="rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300"
            disabled={isGenerating || !canGenerate}
            onClick={() => void onGenerateShort({ brief, setting, trope, extraDirection, heatLevel })}
            type="button"
          >
            {isGenerating ? 'Condensing the whole romance...' : 'Generate short script'}
          </button>
        </div>
      </div>

      {shorts.length === 0 ? (
        <section className="rounded-[1.5rem] border border-dashed border-rose-200 bg-white/70 p-6 text-sm text-rose-800/75">
          No shorts yet. Generate one above; every finished script is saved to your shorts library and stays available across all your stories.
        </section>
      ) : (
        shorts.map((short) => (
          <article key={short.id ?? short.created_at} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-3 border-b border-stone-200 pb-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">Short Script</p>
                <h3 className="mt-2 font-display text-2xl text-stone-950">{short.title || 'Untitled Short'}</h3>
                {short.logline ? <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">{short.logline}</p> : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {short.trope ? <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">{short.trope}</span> : null}
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">~{formatDuration(short.estimated_duration_seconds)}</span>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{short.word_count} words</span>
              </div>
            </div>

            <div className="mt-5 rounded-[1.25rem] bg-rose-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">Hook</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-rose-950">{short.hook}</p>
            </div>

            <div className="mt-4 space-y-3">
              {short.segments.map((segment, segmentIndex) => (
                <div key={segmentIndex} className="rounded-[1.25rem] border border-stone-200 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">{segment.time_range}</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">{segment.beat}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-800">{segment.narration}</p>
                  {segment.on_screen_text ? (
                    <p className="mt-2 text-xs font-semibold text-stone-500">ON SCREEN: {segment.on_screen_text}</p>
                  ) : null}
                </div>
              ))}
            </div>

            {short.call_to_action ? (
              <div className="mt-4 rounded-[1.25rem] bg-stone-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Call to action</p>
                <p className="mt-1 text-sm leading-6 text-stone-800">{short.call_to_action}</p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800"
                onClick={() => void copyShort(short, 'script')}
                type="button"
              >
                {copied !== null && copied.id === short.id && copied.kind === 'script' ? 'Copied!' : 'Copy script'}
              </button>
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800"
                onClick={() => void copyShort(short, 'json')}
                type="button"
              >
                {copied !== null && copied.id === short.id && copied.kind === 'json' ? 'Copied!' : 'Copy JSON'}
              </button>
              {short.id ? (
                <button
                  className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800"
                  onClick={() => void onDeleteShort(short.id as number)}
                  type="button"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </article>
        ))
      )}
    </section>
  );
}
