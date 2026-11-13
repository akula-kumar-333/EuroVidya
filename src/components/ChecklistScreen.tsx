import { Check, ChevronDown, ChevronUp, FileText, Landmark, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { CHECKLIST_ITEMS, CHECKLIST_PHASES } from '../data/checklist';
import { BlockedAccountConfig, ChecklistItemState } from '../types/eurovidya';
import { LikeButton } from './LikeButton';

interface ChecklistScreenProps {
  checklistState: Record<string, ChecklistItemState>;
  likedItemIds: string[];
  blockedAccount: BlockedAccountConfig;
  onToggleItem: (itemId: string) => void;
  onToggleLike: (itemId: string) => void;
  onUpdateNote: (itemId: string, note: string) => void;
  onUpdateBlockedAccount: (patch: Partial<BlockedAccountConfig>) => void;
  onOpenDossier: () => void;
  committedSearch: string;
  onClearSearch: () => void;
}

export function ChecklistScreen({
  checklistState,
  likedItemIds,
  blockedAccount,
  onToggleItem,
  onToggleLike,
  onUpdateNote,
  onUpdateBlockedAccount,
  onOpenDossier,
  committedSearch,
  onClearSearch,
}: ChecklistScreenProps) {
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const completedCount = CHECKLIST_ITEMS.filter((item) => checklistState[item.id]?.completed).length;
  const progressPct = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  const normalizedQuery = committedSearch.trim().toLowerCase();
  const filteredItems = CHECKLIST_ITEMS.filter((item) => {
    if (!normalizedQuery) return true;
    const phaseMeta = CHECKLIST_PHASES.find((p) => p.id === item.phase);
    const haystack = `${item.title} ${item.detail} ${item.mandatoryFor} ${phaseMeta?.title ?? ''}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const parseNullableNumber = (raw: string): number | null => {
    if (!raw.trim()) return null;
    const n = parseFloat(raw);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  const eurPerYear = blockedAccount.eurPerYear;
  const fxRate = blockedAccount.eurToInrRate;
  const bufferPct = blockedAccount.bufferPercent ?? 0;
  const apsFee = blockedAccount.apsFeeInr ?? 0;
  const visaFee = blockedAccount.visaFeeInr ?? 0;

  const hasCostEstimate = eurPerYear !== null && fxRate !== null;
  const monthlyEur = eurPerYear !== null ? Math.round(eurPerYear / 12) : null;
  const baseDepositInr = hasCostEstimate ? eurPerYear * fxRate : 0;
  const fxBufferInr = baseDepositInr * (bufferPct / 100);
  const totalOutlayInr = baseDepositInr + fxBufferInr + apsFee + visaFee;

  const toggleNoteEditor = (itemId: string) => {
    setExpandedNotes((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleLoadOfficialMandate = () => {
    onUpdateBlockedAccount({
      eurPerYear: 11904,
      eurToInrRate: 91.5,
      bufferPercent: 2.0,
      apsFeeInr: 18000,
      visaFeeInr: 7200,
    });
  };

  const handleClearEstimator = () => {
    onUpdateBlockedAccount({
      eurPerYear: null,
      eurToInrRate: null,
      bufferPercent: null,
      apsFeeInr: null,
      visaFeeInr: null,
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12 space-y-8">
      {/* Header & Overall Readiness Meter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D9E2E8]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
            Documentation &amp; Financial Compliance
          </p>
          <h1 className="mt-1.5 font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#173B57] text-balance">
            APS, Blocked Account &amp; VFS Visa Checklist
          </h1>
          <p className="mt-2 text-base text-[#2D3741] max-w-2xl">
            Step-wise legal checklist for Indian applicants. Updated to the official German Federal Foreign Office
            €11,904/year (€992/month) Blocked Account mandate.
          </p>
        </div>

        <div className="bg-white border border-[#D9E2E8] rounded-lg p-4 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-semibold text-[#173B57]">
            <span>Readiness Completion</span>
            <span className="font-mono tabular-nums">
              {completedCount}/{CHECKLIST_ITEMS.length} ({progressPct}%)
            </span>
          </div>
          <div className="mt-2 h-2 bg-[#EAF2F5] rounded overflow-hidden">
            <div className="h-full bg-[#167C80] transition-all duration-200" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {normalizedQuery && (
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#2D3741]">
            Showing checklist steps matching <strong className="text-[#173B57]">"{committedSearch}"</strong> (
            <span className="font-mono text-xs tabular-nums">{filteredItems.length}</span> matches)
          </p>
          <button
            type="button"
            onClick={onClearSearch}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#167C80] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Search
          </button>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#173B57]">No results found</p>
          <p className="text-sm text-[#667784] max-w-md mx-auto">
            No APS, Uni-Assist, Blocked Account, or Visa checklist items matched "{committedSearch}".
          </p>
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-2 px-4 py-2 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: 4-Phase Checklist */}
          <div className="lg:col-span-7 space-y-6">
            {CHECKLIST_PHASES.map((phase) => {
              const phaseItems = filteredItems.filter((item) => item.phase === phase.id);
              if (phaseItems.length === 0) return null;
              const phaseDone = phaseItems.filter((item) => checklistState[item.id]?.completed).length;

              return (
                <section
                  key={phase.id}
                  className="bg-white border border-[#D9E2E8] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(23,59,87,0.05)]"
                >
                  <div className="bg-[#EAF2F5] px-5 py-4 border-b border-[#D9E2E8] flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="font-display text-base font-semibold text-[#173B57]">{phase.title}</h2>
                      <p className="text-xs text-[#667784] mt-0.5">{phase.subtitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-semibold text-[#173B57] tabular-nums">
                        {phaseDone}/{phaseItems.length} Done
                      </span>
                      <p className="text-[11px] text-[#667784]">{phase.window}</p>
                    </div>
                  </div>

                  <div className="divide-y divide-[#D9E2E8]">
                    {phaseItems.map((item) => {
                      const state = checklistState[item.id] ?? { completed: false, note: '' };
                      const isNoteOpen = Boolean(expandedNotes[item.id] || state.note);
                      const isLiked = likedItemIds.includes(item.id);

                      return (
                        <div key={item.id} className="p-4 md:p-5">
                          <div className="flex items-start gap-3.5">
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={state.completed}
                              onClick={() => onToggleItem(item.id)}
                              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                state.completed
                                  ? 'bg-[#167C80] border-[#167C80] text-white'
                                  : 'bg-white border-[#73777E] hover:border-[#167C80]'
                              }`}
                            >
                              {state.completed && <Check className="w-3.5 h-3.5" />}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => onToggleItem(item.id)}
                                  className={`text-left text-sm font-semibold transition-colors cursor-pointer ${
                                    state.completed ? 'text-[#667784] line-through' : 'text-[#173B57]'
                                  }`}
                                >
                                  {item.title}
                                </button>
                                <span className="font-mono text-[11px] text-[#667784] tabular-nums shrink-0">
                                  {item.leadTime} · {item.mandatoryFor}
                                </span>
                              </div>

                              <p className="mt-1 text-xs leading-relaxed text-[#2D3741]">{item.detail}</p>

                              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                <button
                                  type="button"
                                  onClick={() => toggleNoteEditor(item.id)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-[#167C80] hover:underline cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  {state.note ? 'Edit Note' : 'Add Readiness Note'}
                                  {isNoteOpen ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                <LikeButton
                                  liked={isLiked}
                                  onToggle={() => onToggleLike(item.id)}
                                  label={item.title}
                                  compact
                                />
                              </div>

                              {isNoteOpen && (
                                <div className="mt-2.5">
                                  <input
                                    type="text"
                                    value={state.note}
                                    onChange={(e) => onUpdateNote(item.id, e.target.value)}
                                    placeholder="Record receipt number, date filed, or pending registrar sign-off..."
                                    className="w-full px-3 py-2 bg-[#F7F9FA] border border-[#D9E2E8] rounded text-xs text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:bg-white"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Right 5 Columns: Empty-by-default Blocked Account EUR <-> INR Financial Estimator */}
          <aside className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="bg-white border border-[#D9E2E8] border-t-[3px] border-t-[#173B57] rounded-lg p-6 shadow-[0_1px_3px_rgba(23,59,87,0.05)]">
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#D9E2E8]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
                    Financial Planning Calculator
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-[#173B57]">
                    Blocked Account Cost Estimator
                  </h2>
                </div>
                <Landmark className="w-5 h-5 text-[#173B57] shrink-0" />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadOfficialMandate}
                  className="px-2.5 py-1.5 bg-[#E6F2F1] hover:bg-[#D5EBE9] text-[#173B57] text-[11px] font-semibold rounded cursor-pointer"
                >
                  Load Official €11,904 Mandate
                </button>
                <button
                  type="button"
                  onClick={handleClearEstimator}
                  className="px-2.5 py-1.5 border border-[#D9E2E8] bg-white hover:bg-[#F7F9FA] text-[#667784] text-[11px] font-medium rounded cursor-pointer"
                >
                  Clear Fields
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="eurPerYear" className="block text-xs font-semibold text-[#173B57] mb-1">
                    Annual German Blocked Deposit (EUR)
                  </label>
                  <input
                    id="eurPerYear"
                    type="number"
                    step="12"
                    value={blockedAccount.eurPerYear ?? ''}
                    placeholder="e.g. 11904 (official mandate)"
                    onChange={(e) => onUpdateBlockedAccount({ eurPerYear: parseNullableNumber(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
                  />
                  <p className="mt-1 text-[11px] text-[#667784] tabular-nums">
                    Official Mandate: €11,904/year (€992/month).
                    {monthlyEur !== null ? ` Your entry: €${monthlyEur}/month.` : ''}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="eurToInr" className="block text-xs font-semibold text-[#173B57] mb-1">
                      FX Rate (INR / €1)
                    </label>
                    <input
                      id="eurToInr"
                      type="number"
                      step="0.5"
                      value={blockedAccount.eurToInrRate ?? ''}
                      placeholder="e.g. 91.5"
                      onChange={(e) => onUpdateBlockedAccount({ eurToInrRate: parseNullableNumber(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
                    />
                  </div>
                  <div>
                    <label htmlFor="bufferPct" className="block text-xs font-semibold text-[#173B57] mb-1">
                      Wire &amp; Provider Buffer (%)
                    </label>
                    <input
                      id="bufferPct"
                      type="number"
                      step="0.5"
                      min="0"
                      max="10"
                      value={blockedAccount.bufferPercent ?? ''}
                      placeholder="e.g. 2.0"
                      onChange={(e) => onUpdateBlockedAccount({ bufferPercent: parseNullableNumber(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="apsFeeInr" className="block text-xs font-semibold text-[#173B57] mb-1">
                      APS India Fee (INR)
                    </label>
                    <input
                      id="apsFeeInr"
                      type="number"
                      step="100"
                      value={blockedAccount.apsFeeInr ?? ''}
                      placeholder="e.g. 18000"
                      onChange={(e) => onUpdateBlockedAccount({ apsFeeInr: parseNullableNumber(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
                    />
                  </div>
                  <div>
                    <label htmlFor="visaFeeInr" className="block text-xs font-semibold text-[#173B57] mb-1">
                      VFS Visa Fee (INR)
                    </label>
                    <input
                      id="visaFeeInr"
                      type="number"
                      step="100"
                      value={blockedAccount.visaFeeInr ?? ''}
                      placeholder="e.g. 7200"
                      onChange={(e) => onUpdateBlockedAccount({ visaFeeInr: parseNullableNumber(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
                    />
                  </div>
                </div>

                {hasCostEstimate ? (
                  <div className="mt-4 pt-4 border-t border-[#D9E2E8] space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#667784]">
                        Blocked Deposit (€{eurPerYear.toLocaleString('en-IN')})
                      </span>
                      <span className="font-mono font-medium text-[#2D3741] tabular-nums">
                        ₹{Math.round(baseDepositInr).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667784]">Provider Setup &amp; FX Buffer ({bufferPct}%)</span>
                      <span className="font-mono font-medium text-[#2D3741] tabular-nums">
                        ₹{Math.round(fxBufferInr).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667784]">APS India + VFS Visa Fees</span>
                      <span className="font-mono font-medium text-[#2D3741] tabular-nums">
                        ₹{Math.round(apsFee + visaFee).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#D9E2E8] flex items-baseline justify-between">
                      <span className="font-display font-semibold text-[#173B57]">Total Upfront Outlay</span>
                      <span className="font-mono text-xl font-semibold text-[#167C80] tabular-nums">
                        ₹{Math.round(totalOutlayInr).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded bg-[#F7F9FA] border border-dashed border-[#D9E2E8] text-xs text-center text-[#667784]">
                    Enter your Blocked Deposit (EUR) and FX Rate above—or click “Load Official €11,904 Mandate”—to see
                    your INR outlay.
                  </div>
                )}

                <div className="p-3.5 rounded bg-[#EAF2F5] border border-[#D9E2E8] text-xs leading-relaxed text-[#2D3741]">
                  <strong>Parent Safeguard Note:</strong> Blocked funds remain 100% owned by the student and disburse
                  monthly ({monthlyEur !== null ? `€${monthlyEur}/mo` : '€992/mo'}) into a German bank account for rent,
                  health insurance, and living costs.
                </div>

                <button
                  type="button"
                  onClick={onOpenDossier}
                  className="w-full px-4 py-2.5 bg-[#173B57] hover:bg-[#00253E] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
                >
                  Review &amp; Export My Shortlist
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
