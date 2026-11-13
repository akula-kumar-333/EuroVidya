import { AlertTriangle, ArrowRight, CheckCircle2, Info, RotateCcw } from 'lucide-react';
import { BavarianCalculationResult, GradingScale, StudentProfile } from '../types/eurovidya';
import { SCALE_PRESETS } from '../utils/bavarianFormula';

interface GradeCalculatorScreenProps {
  profile: StudentProfile;
  result: BavarianCalculationResult;
  onUpdateProfile: (patch: Partial<StudentProfile>) => void;
  onExploreMatchingCourses: () => void;
}

const GERMAN_LEVELS: Exclude<StudentProfile['germanLevel'], ''>[] = ['None', 'A1', 'A2', 'B1', 'B2', 'C1'];
const TARGET_FIELDS: Exclude<StudentProfile['targetField'], ''>[] = [
  'Computer Science & AI',
  'Engineering & Mobility',
  'Management & Economics',
  'Natural Sciences',
];

export function GradeCalculatorScreen({
  profile,
  result,
  onUpdateProfile,
  onExploreMatchingCourses,
}: GradeCalculatorScreenProps) {
  const handleScaleChange = (scale: GradingScale) => {
    onUpdateProfile({ gradingScale: scale });
  };

  const handleClearFields = () => {
    onUpdateProfile({
      studentName: '',
      targetDegree: '',
      targetField: '',
      gradingScale: '',
      maxScore: null,
      minPassScore: null,
      obtainedScore: null,
      degreeDuration: null,
      ieltsScore: null,
      germanLevel: '',
      backlogs: null,
      apsStatus: '',
    });
  };

  const parseNullableFloat = (raw: string): number | null => {
    if (!raw.trim()) return null;
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : null;
  };

  const parseNullableInt = (raw: string): number | null => {
    if (!raw.trim()) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  const currentPreset = profile.gradingScale ? SCALE_PRESETS[profile.gradingScale] : SCALE_PRESETS.cgpa10;

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12 space-y-8">
      {/* Screen Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D9E2E8]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
            Academic Equivalence Calculator
          </p>
          <h1 className="mt-1.5 font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#173B57] text-balance">
            German Grade &amp; Eligibility Audit
          </h1>
          <p className="mt-2 text-base text-[#2D3741] max-w-2xl">
            Enter your exact marks below to convert Indian CGPA, GPA, or percentage into the official German grading
            scale used by Uni-Assist and German public universities.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearFields}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#D9E2E8] bg-white hover:bg-[#EAF2F5] text-sm font-medium text-[#173B57] rounded transition-colors self-start md:self-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Clear All Fields
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Audit Form (Completely empty by default) */}
        <div className="lg:col-span-7 bg-white border border-[#D9E2E8] rounded-lg p-6 md:p-8 space-y-7 shadow-[0_1px_3px_rgba(23,59,87,0.05)]">
          {/* Applicant Identity & Target Track */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="studentName" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Student Full Name (for My Shortlist)
              </label>
              <input
                id="studentName"
                type="text"
                value={profile.studentName}
                onChange={(e) => onUpdateProfile({ studentName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
              />
            </div>

            <div>
              <label htmlFor="targetField" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Primary Discipline Track
              </label>
              <select
                id="targetField"
                value={profile.targetField}
                onChange={(e) => onUpdateProfile({ targetField: e.target.value as StudentProfile['targetField'] })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
              >
                <option value="">Select study discipline...</option>
                {TARGET_FIELDS.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Degree & Indian Duration */}
          <div className="pt-5 border-t border-[#D9E2E8] grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <span className="block text-xs font-semibold text-[#173B57] mb-2">Target European Degree</span>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#EAF2F5] rounded">
                {(['Masters', 'Bachelors'] as const).map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => onUpdateProfile({ targetDegree: deg })}
                    className={`py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
                      profile.targetDegree === deg
                        ? 'bg-white text-[#173B57] shadow-xs'
                        : 'text-[#667784] hover:text-[#173B57]'
                    }`}
                  >
                    {deg === 'Masters' ? 'Master’s (M.Sc.)' : 'Bachelor’s (B.Sc.)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#173B57] mb-2">
                Prior Indian Degree Duration
              </span>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#EAF2F5] rounded">
                {([4, 3] as const).map((yrs) => (
                  <button
                    key={yrs}
                    type="button"
                    onClick={() => onUpdateProfile({ degreeDuration: yrs })}
                    className={`py-2 text-xs font-semibold rounded transition-colors cursor-pointer tabular-nums ${
                      profile.degreeDuration === yrs
                        ? 'bg-white text-[#173B57] shadow-xs'
                        : 'text-[#667784] hover:text-[#173B57]'
                    }`}
                  >
                    {yrs}-Year ({yrs === 4 ? '240 Credits' : '180 Credits'})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Indian Grading Scale Selector */}
          <div className="pt-5 border-t border-[#D9E2E8]">
            <span className="block text-xs font-semibold text-[#173B57] mb-2">Your University Grading Scale</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['cgpa10', 'gpa4', 'percentage'] as GradingScale[]).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => handleScaleChange(scale)}
                  className={`px-3 py-2.5 text-left rounded border text-xs font-medium transition-colors cursor-pointer ${
                    profile.gradingScale === scale
                      ? 'bg-[#E6F2F1] border-[#167C80] text-[#173B57] font-semibold'
                      : 'bg-white border-[#D9E2E8] text-[#2D3741] hover:bg-[#F7F9FA]'
                  }`}
                >
                  {scale === 'cgpa10' && '10-Point CGPA'}
                  {scale === 'gpa4' && '4-Point GPA'}
                  {scale === 'percentage' && 'Percentage (0–100%)'}
                </button>
              ))}
            </div>
          </div>

          {/* Numeric Inputs for Bavarian Formula */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="obtainedScore" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Obtained Score
              </label>
              <input
                id="obtainedScore"
                type="number"
                step={currentPreset.step}
                value={profile.obtainedScore ?? ''}
                placeholder={currentPreset.placeholderObtained}
                onChange={(e) => onUpdateProfile({ obtainedScore: parseNullableFloat(e.target.value) })}
                className={`w-full px-3.5 py-2.5 bg-white border rounded font-mono text-sm tabular-nums focus:outline-none ${
                  !result.isEmpty && !result.isValid
                    ? 'border-[#BA1A1A] focus:ring-[3px] focus:ring-[#BA1A1A]/15'
                    : 'border-[#D9E2E8] focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15'
                }`}
              />
            </div>

            <div>
              <label htmlFor="maxScore" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Maximum Scale Score
              </label>
              <input
                id="maxScore"
                type="number"
                step={currentPreset.step}
                value={profile.maxScore ?? ''}
                placeholder={currentPreset.placeholderMax}
                onChange={(e) => onUpdateProfile({ maxScore: parseNullableFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
              />
            </div>

            <div>
              <label htmlFor="minPassScore" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Minimum Passing Mark
              </label>
              <input
                id="minPassScore"
                type="number"
                step={currentPreset.step}
                value={profile.minPassScore ?? ''}
                placeholder={currentPreset.placeholderMin}
                onChange={(e) => onUpdateProfile({ minPassScore: parseNullableFloat(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
              />
              <p className="mt-1 text-[11px] text-[#667784]">Check transcript back page (typically 4.0, 5.0, or 40).</p>
            </div>
          </div>

          {!result.isEmpty && !result.isValid && result.errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded bg-[#FFDAD6]/45 border border-[#BA1A1A]/40 text-xs font-medium text-[#93000A] flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{result.errorMessage}</span>
            </div>
          )}

          {/* Language, Backlogs & APS */}
          <div className="pt-5 border-t border-[#D9E2E8] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="ieltsScore" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                IELTS Academic Score
              </label>
              <input
                id="ieltsScore"
                type="number"
                step="0.5"
                min="4.0"
                max="9.0"
                value={profile.ieltsScore ?? ''}
                placeholder="e.g. 6.5"
                onChange={(e) => onUpdateProfile({ ieltsScore: parseNullableFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
              />
            </div>

            <div>
              <label htmlFor="germanLevel" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                German Language Level
              </label>
              <select
                id="germanLevel"
                value={profile.germanLevel}
                onChange={(e) =>
                  onUpdateProfile({ germanLevel: e.target.value as StudentProfile['germanLevel'] })
                }
                className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
              >
                <option value="">Select level...</option>
                {GERMAN_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="backlogs" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Cleared Backlogs
              </label>
              <input
                id="backlogs"
                type="number"
                min="0"
                max="30"
                value={profile.backlogs ?? ''}
                placeholder="e.g. 0"
                onChange={(e) => onUpdateProfile({ backlogs: parseNullableInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
              />
            </div>

            <div>
              <label htmlFor="apsStatus" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                APS India Status
              </label>
              <select
                id="apsStatus"
                value={profile.apsStatus}
                onChange={(e) =>
                  onUpdateProfile({ apsStatus: e.target.value as StudentProfile['apsStatus'] })
                }
                className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
              >
                <option value="">Select status...</option>
                <option value="Not Started">Not Started</option>
                <option value="Applied">Applied</option>
                <option value="Verified">Verified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Live Bavarian Verdict Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-[#D9E2E8] border-t-[3px] border-t-[#167C80] rounded-lg p-6 md:p-7 shadow-[0_1px_3px_rgba(23,59,87,0.05)]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#167C80]">
                Estimated German Grade
              </p>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-[#E6F2F1] text-[#167C80]">
                {result.isEmpty ? 'Awaiting Input' : result.isValid ? result.classification : 'Check Bounds'}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-5xl font-semibold text-[#173B57] tabular-nums">
                {result.isValid ? result.roundedGrade.toFixed(1) : '—'}
              </span>
              {result.isValid && (
                <span className="font-mono text-sm text-[#667784] tabular-nums">
                  (Exact: {result.exactGrade.toFixed(2)} · Scale 1.0 Best – 4.0 Pass)
                </span>
              )}
            </div>

            <p className="mt-2 text-sm font-medium text-[#2D3741]">
              {result.isEmpty
                ? 'Enter your obtained score, maximum scale, and minimum passing mark on the left to calculate.'
                : result.isValid
                ? result.classificationEnglish
                : 'Correct the numeric score bounds to compute.'}
            </p>

            {/* Formula Readout */}
            <div className="mt-5 p-3.5 rounded bg-[#EAF2F5] border border-[#D9E2E8]">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#173B57]">
                Official German Conversion Formula
              </p>
              <p className="mt-1 font-mono text-xs text-[#2D3741] tabular-nums">
                German Grade = 1 + 3 × [({profile.maxScore ?? 'Max'} − {profile.obtainedScore ?? 'Score'}) / (
                {profile.maxScore ?? 'Max'} − {profile.minPassScore ?? 'MinPass'})]
              </p>
            </div>

            {/* Credit & APS Diagnostics */}
            {result.isValid && (
              <div className="mt-5 space-y-3">
                <div
                  className={`p-3.5 rounded border text-xs leading-relaxed flex items-start gap-2.5 ${
                    result.hasEctsGapRisk
                      ? 'bg-[#FDF8ED] border-[#E8B45B]/60 text-[#5F4100]'
                      : 'bg-[#F7F9FA] border-[#D9E2E8] text-[#2D3741]'
                  }`}
                >
                  {result.hasEctsGapRisk ? (
                    <AlertTriangle className="w-4 h-4 text-[#B88728] shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#167C80] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-[#173B57]">Credit &amp; Degree Parity</p>
                    <p className="mt-0.5">{result.ectsNote}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded border border-[#D9E2E8] bg-[#F7F9FA] text-xs leading-relaxed text-[#2D3741] flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#173B57] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#173B57]">APS India Verification Status</p>
                    <p className="mt-0.5">{result.apsAdvisory}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onExploreMatchingCourses}
              disabled={!result.isValid}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#167C80] hover:bg-[#00696D] disabled:opacity-50 text-white text-sm font-semibold rounded transition-colors cursor-pointer"
            >
              Filter Eligible Public Programs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
