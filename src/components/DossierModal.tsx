import { Download, Heart, Printer, RotateCcw, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { CHECKLIST_ITEMS } from '../data/checklist';
import { PUBLIC_UNIVERSITY_PROGRAMS } from '../data/programs';
import { BavarianCalculationResult, DossierStoreState } from '../types/eurovidya';
import { evaluateProgramMatch } from '../utils/bavarianFormula';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: DossierStoreState;
  gradeResult: BavarianCalculationResult;
  onRemoveShortlist: (id: string) => void;
  onDownloadMarkdown: () => void;
  onPrintPdf: () => void;
  onResetAll: () => void;
  isSignedIn: boolean;
}

export function DossierModal({
  isOpen,
  onClose,
  state,
  gradeResult,
  onRemoveShortlist,
  onDownloadMarkdown,
  onPrintPdf,
  onResetAll,
  isSignedIn,
}: DossierModalProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const shortlisted = PUBLIC_UNIVERSITY_PROGRAMS.filter((p) => state.shortlistedIds.includes(p.id));
  const completedItems = CHECKLIST_ITEMS.filter((item) => state.checklistState[item.id]?.completed).length;

  const eurPerYear = state.blockedAccount.eurPerYear;
  const fxRate = state.blockedAccount.eurToInrRate;
  const bufferPct = state.blockedAccount.bufferPercent ?? 0;
  const apsFee = state.blockedAccount.apsFeeInr ?? 0;
  const visaFee = state.blockedAccount.visaFeeInr ?? 0;

  const hasFinancialEstimate = eurPerYear !== null && fxRate !== null;
  const baseDepositInr = hasFinancialEstimate ? eurPerYear * fxRate : 0;
  const totalOutlayInr = baseDepositInr * (1 + bufferPct / 100) + apsFee + visaFee;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="My Shortlist and Readiness Summary"
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00253E]/45 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] bg-white border border-[#D9E2E8] rounded-xl shadow-[0_12px_32px_rgba(23,59,87,0.12)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Official Square EuroVidya Logo */}
        <div className="px-6 py-4 border-b border-[#D9E2E8] bg-[#EAF2F5] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/EuroVidya_Logo_Square.jpg_ce32e512.jpeg"
              alt="EuroVidya Study Abroad Logo"
              className="w-12 h-12 object-contain rounded border border-[#D9E2E8] bg-white p-1 shrink-0"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#167C80]">
                {isSignedIn ? 'Cloud-Synced Student Record' : 'Local Student Readiness Record'}
              </p>
              <h2 className="mt-0.5 font-display text-xl font-semibold text-[#173B57]">
                My Shortlist — {state.profile.studentName || 'Student Profile'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortlist modal"
            className="p-2 rounded bg-white border border-[#D9E2E8] text-[#667784] hover:text-[#173B57] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 3-Column Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-[#D9E2E8] bg-[#F7F9FA]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#667784]">German Grade Audit</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[#173B57] tabular-nums">
                {gradeResult.isValid ? gradeResult.roundedGrade.toFixed(1) : 'Not Computed'}
              </p>
              <p className="mt-0.5 text-xs text-[#667784]">
                {gradeResult.isValid ? gradeResult.classification : 'Enter marks in Grade Audit'} ·{' '}
                {state.profile.degreeDuration ? `${state.profile.degreeDuration}-Yr Degree` : 'Degree unset'}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#D9E2E8] bg-[#F7F9FA]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#667784]">Checklist &amp; Likes</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[#167C80] tabular-nums">
                {completedItems}/{CHECKLIST_ITEMS.length}
              </p>
              <p className="mt-0.5 text-xs text-[#667784] inline-flex items-center gap-1">
                <Heart className="w-3 h-3 text-[#DC2626] fill-[#DC2626]" />
                {state.likedItemIds.length} liked items · APS: {state.profile.apsStatus || 'Unset'}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-[#D9E2E8] bg-[#F7F9FA]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#667784]">
                Blocked Account &amp; Visa Outlay
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[#173B57] tabular-nums">
                {hasFinancialEstimate ? `₹${Math.round(totalOutlayInr).toLocaleString('en-IN')}` : 'Not Computed'}
              </p>
              <p className="mt-0.5 text-xs text-[#667784] tabular-nums">
                {hasFinancialEstimate
                  ? `€${eurPerYear.toLocaleString('en-IN')} @ ₹${fxRate}`
                  : 'Enter figures in APS & Visa'}
              </p>
            </div>
          </div>

          {/* Shortlisted Universities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#173B57] mb-3">
              Shortlisted European Public Programs ({shortlisted.length})
            </h3>
            {shortlisted.length === 0 ? (
              <div className="p-5 rounded border border-dashed border-[#D9E2E8] text-center text-sm text-[#667784]">
                No programs shortlisted yet. Use the Course Explorer to save European university targets.
              </div>
            ) : (
              <div className="border border-[#D9E2E8] rounded-lg divide-y divide-[#D9E2E8]">
                {shortlisted.map((prog) => {
                  const tier = evaluateProgramMatch(prog, gradeResult.roundedGrade, gradeResult.isValid);
                  return (
                    <div key={prog.id} className="p-3.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#173B57]">
                          {prog.university} ({prog.country}) — {prog.programName} ({prog.degreeAward})
                        </p>
                        <p className="text-xs text-[#667784] mt-0.5 tabular-nums">
                          Fit: <strong>{tier}</strong> · Historical Cutoff:{' '}
                          {prog.historicalCutoff ? prog.historicalCutoff.toFixed(1) : 'Open Admission'} ·{' '}
                          {prog.applicationChannel} · Winter {prog.winterDeadline}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveShortlist(prog.id)}
                        aria-label={`Remove ${prog.programName} from shortlist`}
                        className="p-1.5 text-[#667784] hover:text-[#BA1A1A] rounded hover:bg-[#FFDAD6]/30 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Consultation Booking Summary */}
          {state.booking && (
            <div className="p-4 rounded-lg bg-[#E6F2F1] border border-[#167C80]/30 text-xs text-[#173B57] space-y-1">
              <p className="font-bold uppercase tracking-wider text-[#167C80]">Saved Consultation Request</p>
              <p>
                <strong>{state.booking.parentOrStudentName}</strong> ({state.booking.applicantRole}) ·{' '}
                {state.booking.destinationCountry} · {state.booking.email} · {state.booking.phone}
              </p>
              <p className="text-[#2D3741]">
                Advisor: {state.booking.preferredCounselor} · Intake: {state.booking.targetIntake}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#D9E2E8] bg-[#F7F9FA] flex flex-wrap items-center justify-between gap-3">
          <div>
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#667784] hover:text-[#BA1A1A] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Saved Data
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#93000A] font-medium">Reset shortlist?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetAll();
                    setConfirmReset(false);
                  }}
                  className="px-2.5 py-1 bg-[#BA1A1A] text-white rounded font-semibold cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 border border-[#D9E2E8] bg-white rounded text-[#2D3741] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onPrintPdf}
              className="inline-flex items-center gap-2 px-4 py-2 border-[1.5px] border-[#173B57] text-[#173B57] hover:bg-[#173B57]/[0.04] text-sm font-semibold rounded transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onDownloadMarkdown}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Summary (.md)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
