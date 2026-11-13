import { Award, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SCHOLARSHIP_PROGRAMS } from '../data/scholarships';
import { StudyCountry } from '../types/eurovidya';
import { LikeButton } from './LikeButton';

interface ScholarshipsScreenProps {
  likedItemIds: string[];
  onToggleLike: (itemId: string) => void;
  committedSearch: string;
  onClearGlobalSearch: () => void;
}

const COUNTRY_OPTIONS: ('All' | StudyCountry)[] = ['All', 'Germany', 'France', 'Ireland', 'Netherlands', 'Austria'];

export function ScholarshipsScreen({
  likedItemIds,
  onToggleLike,
  committedSearch,
  onClearGlobalSearch,
}: ScholarshipsScreenProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<'All' | StudyCountry>('All');
  const [degreeFilter, setDegreeFilter] = useState<'All' | 'Masters' | 'Bachelors & Masters' | 'Masters & PhD'>('All');

  const activeQuery = (committedSearch || localSearch).trim().toLowerCase();

  const filtered = useMemo(() => {
    return SCHOLARSHIP_PROGRAMS.filter((sch) => {
      if (countryFilter !== 'All' && sch.country !== countryFilter) return false;
      if (degreeFilter !== 'All' && sch.degreeLevel !== degreeFilter) return false;
      if (activeQuery) {
        const text =
          `${sch.name} ${sch.provider} ${sch.country} ${sch.fundingSummary} ${sch.eligibility} ${sch.notes}`.toLowerCase();
        if (!text.includes(activeQuery)) return false;
      }
      return true;
    });
  }, [activeQuery, countryFilter, degreeFilter]);

  const resetFilters = () => {
    setLocalSearch('');
    setCountryFilter('All');
    setDegreeFilter('All');
    onClearGlobalSearch();
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12 space-y-8">
      <div className="pb-6 border-b border-[#D9E2E8]">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
          Official Merit &amp; Government Grants
        </p>
        <h1 className="mt-1.5 font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#173B57] text-balance">
          European Scholarships &amp; Financial Aid Directory
        </h1>
        <p className="mt-2 text-base text-[#2D3741] max-w-3xl">
          Verified funding fellowships from DAAD, German federal merit boards, Campus France, Higher Education Authority
          Ireland, Nuffic, and OeAD Austria.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#D9E2E8] rounded-lg p-4 md:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#667784] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search scholarship name, DAAD, Eiffel, Charpak, or eligibility..."
              aria-label="Search scholarships"
              className="w-full pl-10 pr-3.5 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
            />
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter scholarships by country"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value as typeof countryFilter)}
              className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All European Countries' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter scholarships by degree level"
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value as typeof degreeFilter)}
              className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
            >
              <option value="All">All Degree Levels</option>
              <option value="Masters">Master’s Only</option>
              <option value="Bachelors & Masters">Bachelor’s &amp; Master’s</option>
              <option value="Masters & PhD">Master’s &amp; PhD</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#667784] pt-2 border-t border-[#D9E2E8]">
          <span className="tabular-nums">
            Showing <strong className="text-[#173B57]">{filtered.length}</strong> of {SCHOLARSHIP_PROGRAMS.length}{' '}
            official scholarships
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

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#173B57]">No results found</p>
          <p className="text-sm text-[#667784] max-w-md mx-auto">
            No European scholarships matched your search criteria. Clear filters to view all official grants.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
          >
            Show All Scholarships
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((sch) => (
            <article
              key={sch.id}
              className="bg-white border border-[#D9E2E8] border-t-[3px] border-t-[#167C80] rounded-lg p-6 flex flex-col justify-between space-y-4 shadow-[0_1px_3px_rgba(23,59,87,0.05)]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#167C80]">
                      {sch.country} · {sch.degreeLevel}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-semibold text-[#173B57]">{sch.name}</h2>
                    <p className="text-xs text-[#667784] mt-0.5">{sch.provider}</p>
                  </div>
                  <Award className="w-5 h-5 text-[#B88728] shrink-0 mt-1" />
                </div>

                <div className="p-3.5 rounded bg-[#EAF2F5] border border-[#D9E2E8] text-xs text-[#173B57]">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-[#667784] block">
                    Funding Benefit
                  </span>
                  <span className="mt-0.5 block font-semibold">{sch.fundingSummary}</span>
                </div>

                <div className="text-xs space-y-2 text-[#2D3741]">
                  <p>
                    <strong className="text-[#173B57]">Eligibility:</strong> {sch.eligibility}
                  </p>
                  <p>
                    <strong className="text-[#173B57]">Typical Window:</strong> {sch.typicalDeadline}
                  </p>
                  <p className="text-[#667784] leading-relaxed">{sch.notes}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D9E2E8] flex items-center justify-between gap-3">
                <LikeButton
                  liked={likedItemIds.includes(sch.id)}
                  onToggle={() => onToggleLike(sch.id)}
                  label={sch.name}
                  compact
                />
                <span className="font-mono text-[11px] text-[#667784]">Verify exact call on provider portal</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
