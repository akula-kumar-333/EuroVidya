import { CalendarClock, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { INTAKE_MILESTONES } from '../data/timeline';
import { IntakeMilestone } from '../types/eurovidya';
import { LikeButton } from './LikeButton';

interface TimelineScreenProps {
  likedItemIds: string[];
  onToggleLike: (itemId: string) => void;
  committedSearch: string;
  onClearGlobalSearch: () => void;
}

export function TimelineScreen({
  likedItemIds,
  onToggleLike,
  committedSearch,
  onClearGlobalSearch,
}: TimelineScreenProps) {
  const [selectedIntake, setSelectedIntake] = useState<IntakeMilestone['intake']>('Winter Intake (October Start)');

  const activeQuery = committedSearch.trim().toLowerCase();

  const filteredMilestones = useMemo(() => {
    return INTAKE_MILESTONES.filter((m) => {
      if (!activeQuery && m.intake !== selectedIntake) return false;
      if (activeQuery) {
        const text = `${m.intake} ${m.timingWindow} ${m.title} ${m.description} ${m.actionTip}`.toLowerCase();
        return text.includes(activeQuery);
      }
      return true;
    });
  }, [activeQuery, selectedIntake]);

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D9E2E8]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
            12-Month Application Roadmap
          </p>
          <h1 className="mt-1.5 font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#173B57] text-balance">
            Intake Timeline &amp; Deadline Planner
          </h1>
          <p className="mt-2 text-base text-[#2D3741] max-w-3xl">
            Step-by-step planning milestones for Germany &amp; European public universities across both major semester
            intakes—covering IELTS/GRE, APS India, Uni-Assist VPD, Blocked Account funding, and VFS visa biometrics.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-[#EAF2F5] rounded border border-[#D9E2E8] shrink-0">
          {(['Winter Intake (October Start)', 'Summer Intake (April Start)'] as const).map((intake) => (
            <button
              key={intake}
              type="button"
              onClick={() => setSelectedIntake(intake)}
              className={`px-3.5 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedIntake === intake
                  ? 'bg-white text-[#173B57] shadow-xs'
                  : 'text-[#667784] hover:text-[#173B57]'
              }`}
            >
              {intake}
            </button>
          ))}
        </div>
      </div>

      {activeQuery && (
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#2D3741]">
            Showing timeline milestones matching <strong className="text-[#173B57]">"{committedSearch}"</strong> (
            <span className="font-mono text-xs tabular-nums">{filteredMilestones.length}</span> matches)
          </p>
          <button
            type="button"
            onClick={onClearGlobalSearch}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#167C80] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Search
          </button>
        </div>
      )}

      {filteredMilestones.length === 0 ? (
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#173B57]">No results found</p>
          <p className="text-sm text-[#667784] max-w-md mx-auto">
            No intake milestones matched "{committedSearch}". Reset search to view the full 12-month timeline.
          </p>
          <button
            type="button"
            onClick={onClearGlobalSearch}
            className="mt-2 px-4 py-2 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMilestones.map((item, idx) => (
            <article
              key={item.id}
              className="bg-white border border-[#D9E2E8] rounded-lg p-6 flex flex-col justify-between space-y-4 shadow-[0_1px_3px_rgba(23,59,87,0.04)]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#167C80]">
                      Step 0{idx + 1} · {item.timingWindow}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-semibold text-[#173B57]">{item.title}</h2>
                  </div>
                  <CalendarClock className="w-5 h-5 text-[#B88728] shrink-0 mt-0.5" />
                </div>

                <p className="text-sm leading-relaxed text-[#2D3741]">{item.description}</p>

                <div className="p-3.5 rounded bg-[#F7F9FA] border border-[#D9E2E8] text-xs text-[#2D3741]">
                  <strong className="text-[#173B57]">Advisor Tip:</strong> {item.actionTip}
                </div>
              </div>

              <div className="pt-3 border-t border-[#D9E2E8] flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-[#667784]">{item.intake}</span>
                <LikeButton
                  liked={likedItemIds.includes(item.id)}
                  onToggle={() => onToggleLike(item.id)}
                  label={item.title}
                  compact
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
