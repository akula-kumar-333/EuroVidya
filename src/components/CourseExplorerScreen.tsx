import { ArrowUpDown, Bookmark, BookmarkCheck, ExternalLink, RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PUBLIC_UNIVERSITY_PROGRAMS } from '../data/programs';
import {
  AdmissionType,
  BavarianCalculationResult,
  StudentProfile,
  StudyCountry,
  UniversityProgram,
} from '../types/eurovidya';
import { CutoffMatchTier, evaluateProgramMatch } from '../utils/bavarianFormula';
import { LikeButton } from './LikeButton';

interface CourseExplorerScreenProps {
  profile: StudentProfile;
  gradeResult: BavarianCalculationResult;
  shortlistedIds: string[];
  likedItemIds: string[];
  onToggleShortlist: (programId: string) => void;
  onToggleLike: (itemId: string) => void;
  initialEligibleOnly?: boolean;
  initialCountryFilter?: StudyCountry | 'All';
  committedSearch: string;
  onClearGlobalSearch: () => void;
}

type SortKey = 'university' | 'cutoff' | 'tuition';

const TIER_STYLES: Record<CutoffMatchTier, string> = {
  'Open Admission': 'bg-[#EAF2F5] text-[#173B57]',
  Safe: 'bg-[#E6F2F1] text-[#167C80]',
  Target: 'bg-[#FDF8ED] text-[#B88728]',
  Reach: 'bg-[#FFDAD6]/50 text-[#93000A]',
};

const COUNTRIES: ('All' | StudyCountry)[] = ['All', 'Germany', 'France', 'Ireland', 'Netherlands', 'Austria'];

export function CourseExplorerScreen({
  profile,
  gradeResult,
  shortlistedIds,
  likedItemIds,
  onToggleShortlist,
  onToggleLike,
  initialEligibleOnly = false,
  initialCountryFilter = 'All',
  committedSearch,
  onClearGlobalSearch,
}: CourseExplorerScreenProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<'All' | StudyCountry>(initialCountryFilter);
  const [degreeFilter, setDegreeFilter] = useState<'All' | 'Masters' | 'Bachelors'>('All');
  const [languageFilter, setLanguageFilter] = useState<'All' | 'English' | 'Bilingual'>('All');
  const [admissionFilter, setAdmissionFilter] = useState<'All' | AdmissionType>('All');
  const [eligibleOnly, setEligibleOnly] = useState(initialEligibleOnly);
  const [likedOnly, setLikedOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('tuition');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<UniversityProgram | null>(null);

  useEffect(() => {
    setCountryFilter(initialCountryFilter);
  }, [initialCountryFilter]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const resetFilters = () => {
    setLocalSearch('');
    setCountryFilter('All');
    setDegreeFilter('All');
    setLanguageFilter('All');
    setAdmissionFilter('All');
    setEligibleOnly(false);
    setLikedOnly(false);
    onClearGlobalSearch();
  };

  const activeQuery = (committedSearch || localSearch).trim().toLowerCase();

  const filteredPrograms = useMemo(() => {
    return PUBLIC_UNIVERSITY_PROGRAMS.filter((prog) => {
      if (countryFilter !== 'All' && prog.country !== countryFilter) return false;
      if (degreeFilter !== 'All' && prog.degreeLevel !== degreeFilter) return false;
      if (languageFilter !== 'All' && prog.language !== languageFilter) return false;
      if (admissionFilter !== 'All' && prog.admissionType !== admissionFilter) return false;
      if (likedOnly && !likedItemIds.includes(prog.id)) return false;

      if (eligibleOnly && gradeResult.isValid) {
        const tier = evaluateProgramMatch(prog, gradeResult.roundedGrade, gradeResult.isValid);
        if (tier === 'Reach') return false;
      }

      if (activeQuery) {
        const haystack =
          `${prog.country} ${prog.university} ${prog.programName} ${prog.city} ${prog.state} ${prog.field} ${prog.group}`.toLowerCase();
        if (!haystack.includes(activeQuery)) return false;
      }

      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'university') {
        cmp = a.university.localeCompare(b.university);
      } else if (sortKey === 'tuition') {
        cmp = a.tuitionPerSemesterEur - b.tuitionPerSemesterEur;
      } else {
        const aCut = a.historicalCutoff ?? 4.0;
        const bCut = b.historicalCutoff ?? 4.0;
        cmp = aCut - bCut;
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [
    activeQuery,
    countryFilter,
    degreeFilter,
    languageFilter,
    admissionFilter,
    likedOnly,
    likedItemIds,
    eligibleOnly,
    gradeResult,
    sortKey,
    sortAsc,
  ]);

  return (
    <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-8 md:py-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D9E2E8]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
            European Public University Matrix
          </p>
          <h1 className="mt-1.5 font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#173B57] text-balance">
            European Course &amp; Grade Cutoff Explorer
          </h1>
          <p className="mt-2 text-base text-[#2D3741] max-w-3xl">
            Compare tuition fees, historical German grade cutoffs, credit minimums, and application portals across{' '}
            {PUBLIC_UNIVERSITY_PROGRAMS.length} public university programs in Germany, France, Ireland, Netherlands,
            and Austria.
          </p>
        </div>

        <div className="bg-white border border-[#D9E2E8] rounded px-4 py-2.5 text-xs text-[#2D3741] shrink-0">
          <span className="text-[#667784]">Active Grade Audit: </span>
          <span className="font-mono font-semibold text-[#173B57] tabular-nums">
            {gradeResult.isValid ? `${gradeResult.roundedGrade.toFixed(1)} (${gradeResult.classification})` : 'Not Computed'}
          </span>
        </div>
      </div>

      {/* Country Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {COUNTRIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCountryFilter(c)}
            className={`px-3.5 py-2 rounded text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              countryFilter === c
                ? 'bg-[#173B57] border-[#173B57] text-white'
                : 'bg-white border-[#D9E2E8] text-[#2D3741] hover:bg-[#EAF2F5]'
            }`}
          >
            {c === 'All' ? 'All European Destinations' : c}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#D9E2E8] rounded-lg p-4 md:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#667784] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Refine by university, program, city..."
              aria-label="Filter programs by keyword"
              className="w-full pl-10 pr-3.5 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
            />
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filter by degree level"
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value as typeof degreeFilter)}
              className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
            >
              <option value="All">All Degrees</option>
              <option value="Masters">Master’s</option>
              <option value="Bachelors">Bachelor’s</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filter by instruction language"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value as typeof languageFilter)}
              className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
            >
              <option value="All">All Languages</option>
              <option value="English">English Only</option>
              <option value="Bilingual">Bilingual (EN/DE)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filter by admission type"
              value={admissionFilter}
              onChange={(e) => setAdmissionFilter(e.target.value as typeof admissionFilter)}
              className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
            >
              <option value="All">All Admission Types</option>
              <option value="Open Admission (No Cutoff)">Open Admission (No Cutoff)</option>
              <option value="Grade-Cutoff Admission">Grade-Cutoff Admission</option>
              <option value="Selective / Portfolio">Selective / Portfolio</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEligibleOnly((prev) => !prev)}
              className={`flex-1 px-2.5 py-2 rounded border text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                eligibleOnly
                  ? 'bg-[#167C80] border-[#167C80] text-white'
                  : 'bg-[#F7F9FA] border-[#D9E2E8] text-[#173B57] hover:bg-[#EAF2F5]'
              }`}
            >
              Eligible Fit
            </button>
            <button
              type="button"
              onClick={() => setLikedOnly((prev) => !prev)}
              className={`flex-1 px-2.5 py-2 rounded border text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                likedOnly
                  ? 'bg-[#FDF2F2] border-[#DC2626]/50 text-[#B91C1C]'
                  : 'bg-[#F7F9FA] border-[#D9E2E8] text-[#173B57] hover:bg-[#EAF2F5]'
              }`}
            >
              Liked Only
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#667784] pt-2 border-t border-[#D9E2E8]">
          <span className="tabular-nums">
            Showing <strong className="text-[#173B57]">{filteredPrograms.length}</strong> of{' '}
            {PUBLIC_UNIVERSITY_PROGRAMS.length} European programs
            {committedSearch ? ` · Top search: "${committedSearch}"` : ''}
            {profile.targetDegree ? ` · Target: ${profile.targetDegree}` : ''}
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-[#167C80] hover:underline font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Course Matrix Table */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#173B57]">No results found</p>
          <p className="text-sm text-[#667784] max-w-md mx-auto">
            No European programs matched your current search or filters. Clear your filters to view all{' '}
            {PUBLIC_UNIVERSITY_PROGRAMS.length} public programs.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#D9E2E8] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(23,59,87,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#EAF2F5] border-b border-[#D9E2E8] text-[13px] font-semibold uppercase tracking-[0.02em] text-[#173B57]">
                  <th className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('university')}
                      className="inline-flex items-center gap-1 hover:text-[#167C80] cursor-pointer"
                    >
                      University &amp; Country
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="py-3 px-4">Program &amp; Channel</th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('cutoff')}
                      className="inline-flex items-center gap-1 hover:text-[#167C80] cursor-pointer"
                    >
                      Hist. Cutoff
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('tuition')}
                      className="inline-flex items-center gap-1 hover:text-[#167C80] cursor-pointer"
                    >
                      Tuition / Sem
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="py-3 px-4">Grade Fit</th>
                  <th className="py-3 px-4 text-right">Like &amp; Shortlist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2E8] text-sm">
                {filteredPrograms.map((prog) => {
                  const tier = evaluateProgramMatch(prog, gradeResult.roundedGrade, gradeResult.isValid);
                  const isShortlisted = shortlistedIds.includes(prog.id);
                  const isLiked = likedItemIds.includes(prog.id);

                  return (
                    <tr
                      key={prog.id}
                      onClick={() => setSelectedProgram(prog)}
                      className="h-12 hover:bg-[#F7F9FA] transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 align-middle">
                        <p className="font-semibold text-[#173B57]">{prog.shortName}</p>
                        <p className="text-xs text-[#667784]">
                          {prog.country} · {prog.city} · {prog.group}
                        </p>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <p className="font-medium text-[#2D3741]">
                          {prog.programName}{' '}
                          <span className="font-mono text-xs text-[#667784]">({prog.degreeAward})</span>
                        </p>
                        <p className="text-xs text-[#667784]">
                          {prog.language} · {prog.applicationChannel} · Winter {prog.winterDeadline}
                        </p>
                      </td>
                      <td className="py-3 px-4 align-middle text-right font-mono text-xs font-semibold text-[#173B57] tabular-nums whitespace-nowrap">
                        {prog.historicalCutoff ? prog.historicalCutoff.toFixed(1) : 'Open Admission'}
                      </td>
                      <td className="py-3 px-4 align-middle text-right font-mono text-xs text-[#173B57] tabular-nums whitespace-nowrap">
                        €{prog.tuitionPerSemesterEur.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 align-middle whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${TIER_STYLES[tier]}`}>
                          {tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-middle text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <LikeButton
                            liked={isLiked}
                            onToggle={() => onToggleLike(prog.id)}
                            label={prog.programName}
                            compact
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleShortlist(prog.id);
                            }}
                            aria-label={isShortlisted ? 'Remove from My Shortlist' : 'Add to My Shortlist'}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                              isShortlisted
                                ? 'bg-[#E6F2F1] border-[#167C80] text-[#167C80]'
                                : 'bg-white border-[#D9E2E8] text-[#173B57] hover:bg-[#EAF2F5]'
                            }`}
                          >
                            {isShortlisted ? (
                              <>
                                <BookmarkCheck className="w-3.5 h-3.5" />
                                Saved
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3.5 h-3.5" />
                                Shortlist
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Program Details Slide-Over Drawer */}
      {selectedProgram && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProgram.university} program details`}
          className="fixed inset-0 z-40 flex justify-end bg-[#00253E]/35 backdrop-blur-[1px]"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full border-l border-[#D9E2E8] shadow-[0_12px_32px_rgba(23,59,87,0.12)] overflow-y-auto p-6 md:p-8 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D9E2E8]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#167C80]">
                    {selectedProgram.country} · {selectedProgram.city}, {selectedProgram.state}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold text-[#173B57]">
                    {selectedProgram.programName} ({selectedProgram.degreeAward})
                  </h2>
                  <p className="text-sm text-[#667784] mt-0.5">{selectedProgram.university}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  aria-label="Close program details"
                  className="p-2 rounded border border-[#D9E2E8] text-[#667784] hover:text-[#173B57] hover:bg-[#F7F9FA] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded bg-[#EAF2F5] border border-[#D9E2E8]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667784]">Admission Type</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-[#173B57] tabular-nums">
                    {selectedProgram.historicalCutoff
                      ? `Cutoff ~${selectedProgram.historicalCutoff.toFixed(1)}`
                      : 'Open Admission (Subject Check)'}
                  </p>
                </div>
                <div className="p-3.5 rounded bg-[#EAF2F5] border border-[#D9E2E8]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667784]">Application Channel</p>
                  <p className="mt-1 text-sm font-semibold text-[#173B57]">{selectedProgram.applicationChannel}</p>
                </div>
                <div className="p-3.5 rounded bg-[#F7F9FA] border border-[#D9E2E8]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667784]">Winter Deadline</p>
                  <p className="mt-1 font-mono text-xs font-semibold text-[#2D3741] tabular-nums">
                    {selectedProgram.winterDeadline}
                  </p>
                </div>
                <div className="p-3.5 rounded bg-[#F7F9FA] border border-[#D9E2E8]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667784]">Summer Deadline</p>
                  <p className="mt-1 font-mono text-xs font-semibold text-[#2D3741] tabular-nums">
                    {selectedProgram.summerDeadline}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-[#2D3741]">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B57]">
                    Tuition &amp; Semester Contribution
                  </h3>
                  <p className="mt-1 leading-relaxed">{selectedProgram.tuitionNote}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#173B57]">Language Prerequisites</h3>
                  <p className="mt-1">
                    <strong>English:</strong> {selectedProgram.englishRequirement}
                  </p>
                  <p className="mt-0.5">
                    <strong>Local Language:</strong> {selectedProgram.germanRequirement}
                  </p>
                </div>

                <div className="p-4 rounded bg-[#FDF8ED] border border-[#E8B45B]/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#B88728]">
                    EuroVidya Candid Audit Note
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#2D3741]">{selectedProgram.notes}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#D9E2E8] flex items-center gap-3">
              <LikeButton
                liked={likedItemIds.includes(selectedProgram.id)}
                onToggle={() => onToggleLike(selectedProgram.id)}
                label={selectedProgram.programName}
              />
              <button
                type="button"
                onClick={() => onToggleShortlist(selectedProgram.id)}
                className={`flex-1 px-4 py-2.5 rounded text-sm font-semibold transition-colors cursor-pointer ${
                  shortlistedIds.includes(selectedProgram.id)
                    ? 'bg-[#E6F2F1] border border-[#167C80] text-[#167C80]'
                    : 'bg-[#167C80] hover:bg-[#00696D] text-white'
                }`}
              >
                {shortlistedIds.includes(selectedProgram.id) ? 'Saved in My Shortlist' : 'Add to My Shortlist'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="inline-flex items-center gap-1 px-4 py-2.5 border border-[#D9E2E8] rounded text-sm font-medium text-[#173B57] hover:bg-[#F7F9FA] cursor-pointer"
              >
                Done <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
