import { ArrowRight, CheckCircle2, Info, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TUITION_FREE_UNIVERSITIES } from '../data/tuitionFreeUniversities';
import { TuitionFreeUniversity } from '../types/eurovidya';
import { LikeButton } from './LikeButton';

interface TuitionFreeScreenProps {
  likedItemIds: string[];
  onToggleLike: (itemId: string) => void;
  onExploreCourses: () => void;
  committedSearch: string;
  onClearGlobalSearch: () => void;
}

export function TuitionFreeScreen({
  likedItemIds,
  onToggleLike,
  onExploreCourses,
  committedSearch,
  onClearGlobalSearch,
}: TuitionFreeScreenProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | TuitionFreeUniversity['institutionType']>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | TuitionFreeUniversity['tuitionStatus']>('Tuition-Free (€0 Tuition)');

  const allStates = useMemo(() => {
    const unique = Array.from(new Set(TUITION_FREE_UNIVERSITIES.map((u) => u.state))).sort();
    return ['All', ...unique];
  }, []);

  const activeQuery = (committedSearch || localSearch).trim().toLowerCase();

  const filteredUniversities = useMemo(() => {
    return TUITION_FREE_UNIVERSITIES.filter((uni) => {
      if (stateFilter !== 'All' && uni.state !== stateFilter) return false;
      if (typeFilter !== 'All' && uni.institutionType !== typeFilter) return false;
      if (statusFilter !== 'All' && uni.tuitionStatus !== statusFilter) return false;
      if (activeQuery) {
        const text =
          `${uni.name} ${uni.city} ${uni.state} ${uni.institutionType} ${uni.englishProgramsHighlight} ${uni.notes}`.toLowerCase();
        if (!text.includes(activeQuery)) return false;
      }
      return true;
    });
  }, [activeQuery, stateFilter, typeFilter, statusFilter]);

  const resetFilters = () => {
    setLocalSearch('');
    setStateFilter('All');
    setTypeFilter('All');
    setStatusFilter('All');
    onClearGlobalSearch();
  };

  const tuitionFreeCount = TUITION_FREE_UNIVERSITIES.filter(
    (u) => u.tuitionStatus === 'Tuition-Free (€0 Tuition)'
  ).length;

  return (
    <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D9E2E8]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
            Official Federal State Guide
          </p>
          <h1 className="mt-1.5 font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#173B57] text-balance">
            Tuition-Free Public Universities in Germany
          </h1>
          <p className="mt-2 text-base text-[#2D3741] max-w-3xl">
            In 15 of Germany’s 16 federal states, state-funded public universities charge{' '}
            <strong className="text-[#173B57]">€0 tuition fees</strong> for consecutive Bachelor’s and Master’s degrees.
            Students pay only a semester student services &amp; transit contribution (€72–€415/semester).
          </p>
        </div>

        <button
          type="button"
          onClick={onExploreCourses}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Open Course Explorer
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Transparency Banner: Free States vs Exceptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#D9E2E8] border-t-[3px] border-t-[#167C80] rounded-lg p-5 flex items-start gap-3.5">
          <CheckCircle2 className="w-5 h-5 text-[#167C80] shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <h2 className="font-display font-semibold text-[#173B57]">
              15 Tuition-Free Federal States ({tuitionFreeCount} Featured Public Universities)
            </h2>
            <p className="text-xs leading-relaxed text-[#2D3741]">
              North Rhine-Westphalia, Bavaria (except TU Munich), Berlin, Brandenburg, Hesse, Lower Saxony, Saxony,
              Thuringia, Saxony-Anhalt, Hamburg, Bremen, Schleswig-Holstein, Saarland, Rhineland-Palatinate, and
              Mecklenburg-Vorpommern charge zero state tuition.
            </p>
          </div>
        </div>

        <div className="bg-[#FDF8ED] border border-[#E8B45B]/60 rounded-lg p-5 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-[#B88728] shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <h2 className="font-display font-semibold text-[#173B57]">Official Non-EU Tuition Exceptions</h2>
            <p className="text-xs leading-relaxed text-[#2D3741]">
              Public universities in <strong>Baden-Württemberg</strong> (KIT, Stuttgart, Mannheim, Heidelberg, Tübingen)
              charge €1,500/semester to non-EU students, and <strong>TU Munich (TUM)</strong> charges non-EU program fees
              unless waived by merit scholarship. Toggle the status filter below to inspect both.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#D9E2E8] rounded-lg p-4 md:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#667784] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search university, city, federal state, or subject..."
              aria-label="Filter tuition-free German universities"
              className="w-full pl-10 pr-3.5 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
            />
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter by federal state"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
            >
              {allStates.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All German Federal States' : st}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter by institution type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
              className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
            >
              <option value="All">All Public Institution Types</option>
              <option value="Technical University (TU9)">Technical University (TU9)</option>
              <option value="Public Research University">Public Research University</option>
              <option value="Applied Sciences (UAS)">Applied Sciences (UAS)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filter by tuition status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
            >
              <option value="Tuition-Free (€0 Tuition)">€0 Tuition Only</option>
              <option value="All">Include Exceptions</option>
              <option value="Non-EU Fee Exception">Fee Exceptions Only</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#667784] pt-2 border-t border-[#D9E2E8]">
          <span className="tabular-nums">
            Showing <strong className="text-[#173B57]">{filteredUniversities.length}</strong> of{' '}
            {TUITION_FREE_UNIVERSITIES.length} German public universities
            {committedSearch ? ` · Top search: "${committedSearch}"` : ''}
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

      {/* Results */}
      {filteredUniversities.length === 0 ? (
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#173B57]">No results found</p>
          <p className="text-sm text-[#667784] max-w-md mx-auto">
            No German public universities matched your current search or state filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
          >
            Show All German Public Universities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUniversities.map((uni) => {
            const isFree = uni.tuitionStatus === 'Tuition-Free (€0 Tuition)';
            return (
              <article
                key={uni.id}
                className="bg-white border border-[#D9E2E8] rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-[0_1px_3px_rgba(23,59,87,0.04)]"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#167C80]">
                        {uni.state} · {uni.city}
                      </p>
                      <h3 className="mt-1 font-display text-base font-semibold text-[#173B57]">{uni.name}</h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 ${
                        isFree ? 'bg-[#E6F2F1] text-[#167C80]' : 'bg-[#FDF8ED] text-[#B88728]'
                      }`}
                    >
                      {isFree ? '€0 Tuition' : 'Fee Exception'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-[#2D3741] border-t border-[#D9E2E8] pt-3">
                    <p>
                      <strong className="text-[#173B57]">Type:</strong> {uni.institutionType}
                    </p>
                    <p className="tabular-nums">
                      <strong className="text-[#173B57]">Semester Fee:</strong> {uni.semesterFeeRange}
                    </p>
                    <p>
                      <strong className="text-[#173B57]">Apply Via:</strong> {uni.applicationChannel}
                    </p>
                    <p>
                      <strong className="text-[#173B57]">English Strengths:</strong> {uni.englishProgramsHighlight}
                    </p>
                  </div>

                  <p className="text-xs text-[#667784] leading-relaxed">{uni.notes}</p>
                </div>

                <div className="pt-3 border-t border-[#D9E2E8] flex items-center justify-between gap-2">
                  <LikeButton
                    liked={likedItemIds.includes(uni.id)}
                    onToggle={() => onToggleLike(uni.id)}
                    label={uni.name}
                    compact
                  />
                  <button
                    type="button"
                    onClick={onExploreCourses}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#167C80] hover:underline cursor-pointer"
                  >
                    Compare Courses <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
