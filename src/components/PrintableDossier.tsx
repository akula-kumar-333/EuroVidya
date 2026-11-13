import { CHECKLIST_ITEMS, CHECKLIST_PHASES } from '../data/checklist';
import { PUBLIC_UNIVERSITY_PROGRAMS } from '../data/programs';
import { BavarianCalculationResult, DossierStoreState } from '../types/eurovidya';
import { evaluateProgramMatch } from '../utils/bavarianFormula';

interface PrintableDossierProps {
  state: DossierStoreState;
  gradeResult: BavarianCalculationResult;
}

export function PrintableDossier({ state, gradeResult }: PrintableDossierProps) {
  const shortlisted = PUBLIC_UNIVERSITY_PROGRAMS.filter((p) => state.shortlistedIds.includes(p.id));
  const eurPerYear = state.blockedAccount.eurPerYear;
  const fxRate = state.blockedAccount.eurToInrRate;
  const bufferPct = state.blockedAccount.bufferPercent ?? 0;
  const apsFee = state.blockedAccount.apsFeeInr ?? 0;
  const visaFee = state.blockedAccount.visaFeeInr ?? 0;
  const hasFinancialEstimate = eurPerYear !== null && fxRate !== null;
  const baseDepositInr = hasFinancialEstimate ? eurPerYear * fxRate : 0;
  const totalOutlayInr = baseDepositInr * (1 + bufferPct / 100) + apsFee + visaFee;

  return (
    <div className="hidden print-only bg-white text-[#121d26] p-2 space-y-6">
      <div className="border-b-2 border-[#173B57] pb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/aistudio/EuroVidya_Logo_Square.jpg_ce32e512.jpeg"
            alt="EuroVidya Study Abroad"
            className="w-16 h-16 object-contain"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#167C80]">
              EuroVidya Study Abroad — My Shortlist &amp; Readiness Summary
            </p>
            <h1 className="text-2xl font-bold text-[#173B57] mt-1">
              {state.profile.studentName || 'Student Readiness Brief'}
            </h1>
            <p className="text-xs text-[#667784] mt-0.5">
              Target: {state.profile.targetDegree || 'Degree Unset'} in{' '}
              {state.profile.targetField || 'Discipline Unset'} · +91 6300018300 · info@eurovidya.com
            </p>
          </div>
        </div>
        <p className="font-mono text-xs text-[#667784] shrink-0">
          Generated {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Section 1: Grade Audit */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#173B57]">
          1. German Grade &amp; Prerequisite Audit
        </h2>
        <div className="grid grid-cols-3 gap-4 border border-[#D9E2E8] p-3 text-xs">
          <div>
            <p className="text-[#667784]">Converted German Grade</p>
            <p className="font-mono text-lg font-bold text-[#173B57] tabular-nums">
              {gradeResult.isValid ? `${gradeResult.roundedGrade.toFixed(1)} (${gradeResult.classification})` : 'Pending'}
            </p>
          </div>
          <div>
            <p className="text-[#667784]">Input Academic Score</p>
            <p className="font-mono font-semibold tabular-nums">
              {state.profile.obtainedScore !== null && state.profile.maxScore !== null
                ? `${state.profile.obtainedScore} / ${state.profile.maxScore} (Min Pass: ${state.profile.minPassScore ?? '—'})`
                : 'Not entered'}
            </p>
          </div>
          <div>
            <p className="text-[#667784]">Degree &amp; Language</p>
            <p className="font-semibold">
              {state.profile.degreeDuration ? `${state.profile.degreeDuration}-Yr` : 'Duration unset'} ·{' '}
              {state.profile.ieltsScore !== null ? `IELTS ${state.profile.ieltsScore.toFixed(1)}` : 'IELTS unset'} ·
              German: {state.profile.germanLevel || 'Unset'}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Shortlisted Public Universities */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#173B57]">
          2. Shortlisted European Public Programs ({shortlisted.length})
        </h2>
        <table className="w-full border-collapse border border-[#D9E2E8] text-xs">
          <thead>
            <tr className="bg-[#EAF2F5] text-left">
              <th className="p-2 border border-[#D9E2E8]">University &amp; Country</th>
              <th className="p-2 border border-[#D9E2E8]">Program</th>
              <th className="p-2 border border-[#D9E2E8]">Hist. Cutoff</th>
              <th className="p-2 border border-[#D9E2E8]">Fit</th>
              <th className="p-2 border border-[#D9E2E8]">Channel &amp; Winter Deadline</th>
            </tr>
          </thead>
          <tbody>
            {shortlisted.map((p) => (
              <tr key={p.id}>
                <td className="p-2 border border-[#D9E2E8] font-semibold">
                  {p.shortName} ({p.country})
                </td>
                <td className="p-2 border border-[#D9E2E8]">
                  {p.programName} ({p.degreeAward})
                </td>
                <td className="p-2 border border-[#D9E2E8] font-mono tabular-nums">
                  {p.historicalCutoff ? p.historicalCutoff.toFixed(1) : 'Open Admission'}
                </td>
                <td className="p-2 border border-[#D9E2E8] font-semibold">
                  {evaluateProgramMatch(p, gradeResult.roundedGrade, gradeResult.isValid)}
                </td>
                <td className="p-2 border border-[#D9E2E8]">
                  {p.applicationChannel} · {p.winterDeadline}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section 3: Blocked Account */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#173B57]">
          3. Statutory Financial Subsistence Plan (Germany Blocked Account)
        </h2>
        <p className="text-xs border border-[#D9E2E8] p-3 font-mono tabular-nums">
          {hasFinancialEstimate
            ? `Annual Blocked Account: €${eurPerYear.toLocaleString('en-IN')} (€${Math.round(eurPerYear / 12)}/mo) · Reference FX: ₹${fxRate.toFixed(2)}/EUR · Estimated Total Outlay (incl. ${bufferPct}% buffer, APS & Visa): ₹${Math.round(totalOutlayInr).toLocaleString('en-IN')}`
            : 'Blocked Account figures not entered yet.'}
        </p>
      </section>

      {/* Section 4: Checklist Status */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#173B57]">
          4. APS &amp; Visa Checklist Readiness
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {CHECKLIST_PHASES.map((phase) => (
            <div key={phase.id} className="border border-[#D9E2E8] p-2.5 space-y-1">
              <p className="font-bold text-[#173B57]">{phase.title}</p>
              {CHECKLIST_ITEMS.filter((i) => i.phase === phase.id).map((item) => {
                const st = state.checklistState[item.id];
                return (
                  <p key={item.id} className="text-[11px]">
                    [{st?.completed ? 'X' : ' '}] {item.title}
                    {st?.note ? ` — ${st.note}` : ''}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
