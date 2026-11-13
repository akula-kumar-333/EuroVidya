import { User } from 'firebase/auth';
import { ChevronDown, LogOut, Menu, Search, UserCheck, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ScreenId } from '../types/eurovidya';

interface TopNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  shortlistCount: number;
  likedCount: number;
  onOpenDossier: () => void;
  user: User | null;
  studentName: string;
  onOpenAuth: () => void;
  onLogOut: () => void;
  searchDraft: string;
  committedSearch: string;
  onSearchDraftChange: (val: string) => void;
  onSearchSubmit: (query: string) => void;
  onClearSearch: () => void;
}

const PRIMARY_NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'tuition-free', label: 'Tuition-Free Germany' },
  { id: 'calculator', label: 'Grade Audit' },
  { id: 'courses', label: 'Course Explorer' },
  { id: 'checklist', label: 'APS & Visa' },
  { id: 'contact', label: 'Contact Us' },
];

const PLANNING_NAV_ITEMS: { id: ScreenId; label: string; description: string }[] = [
  {
    id: 'scholarships',
    label: 'Scholarships & Financial Aid',
    description: 'DAAD, Germany Merit, Charpak, Ireland & NL grants',
  },
  {
    id: 'living',
    label: 'Living Costs & Part-Time Work',
    description: 'Monthly expense planner & 2026 €13.90/hr wage rules',
  },
  {
    id: 'timeline',
    label: 'Intake Timeline & Deadlines',
    description: 'Winter (October) & Summer (April) 12-month roadmap',
  },
];

export function TopNav({
  activeScreen,
  onNavigate,
  shortlistCount,
  likedCount,
  onOpenDossier,
  user,
  studentName,
  onOpenAuth,
  onLogOut,
  searchDraft,
  committedSearch,
  onSearchDraftChange,
  onSearchSubmit,
  onClearSearch,
}: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [plannerMenuOpen, setPlannerMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPlannerMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelect = (screen: ScreenId) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
    setPlannerMenuOpen(false);
  };

  const handleSearchFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchDraft.trim());
  };

  const welcomeName = user?.displayName || studentName || user?.email?.split('@')[0] || 'Student';
  const isPlanningActive = PLANNING_NAV_ITEMS.some((i) => i.id === activeScreen);

  return (
    <div className="no-print">
      {/* Main Sticky Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#D9E2E8]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Official Rectangular EuroVidya Logo */}
          <button
            type="button"
            onClick={() => handleSelect('overview')}
            className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#167C80] rounded cursor-pointer"
          >
            <img
              src="/assets/aistudio/EuroVidya_Logo_Rectangular.jpg_d240e456.jpeg"
              alt="EuroVidya — Your Gateway to European Education"
              className="h-10 md:h-11 w-auto object-contain"
            />
          </button>

          {/* Zone 2: Single-Line Navigation + Planning Dropdown */}
          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-5">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#167C80] ${
                    isActive ? 'text-[#173B57] font-semibold' : 'text-[#667784] hover:text-[#173B57]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[19px] h-[2px] bg-[#167C80]"
                    />
                  )}
                </button>
              );
            })}

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setPlannerMenuOpen((prev) => !prev)}
                aria-expanded={plannerMenuOpen}
                className={`relative py-1 inline-flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isPlanningActive ? 'text-[#173B57] font-semibold' : 'text-[#667784] hover:text-[#173B57]'
                }`}
              >
                Planning Guides
                <ChevronDown className="w-3.5 h-3.5" />
                {isPlanningActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[19px] h-[2px] bg-[#167C80]"
                  />
                )}
              </button>

              {plannerMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-[#D9E2E8] rounded-lg shadow-[0_10px_28px_rgba(23,59,87,0.12)] py-2 z-40">
                  {PLANNING_NAV_ITEMS.map((sub) => {
                    const isSubActive = activeScreen === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSelect(sub.id)}
                        className={`w-full text-left px-4 py-2.5 transition-colors cursor-pointer ${
                          isSubActive ? 'bg-[#EAF2F5]' : 'hover:bg-[#F7F9FA]'
                        }`}
                      >
                        <p className={`text-xs font-semibold ${isSubActive ? 'text-[#167C80]' : 'text-[#173B57]'}`}>
                          {sub.label}
                        </p>
                        <p className="text-[11px] text-[#667784] mt-0.5">{sub.description}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Focused Header Button (My Shortlist) + Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenDossier}
              className="px-4 py-2 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded transition-colors whitespace-nowrap shrink-0 tabular-nums cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#167C80]"
            >
              My Shortlist ({shortlistCount})
            </button>

            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-[#173B57] border border-[#D9E2E8] rounded hover:bg-[#EAF2F5] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="lg:hidden border-t border-[#D9E2E8] bg-white px-5 py-3 flex flex-col gap-1"
          >
            {[...PRIMARY_NAV_ITEMS, ...PLANNING_NAV_ITEMS].map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#EAF2F5] text-[#173B57] font-semibold'
                      : 'text-[#2D3741] hover:bg-[#F7F9FA]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {/* Top Workspace Search & Account Bar */}
      <div className="bg-[#EAF2F5] border-b border-[#D9E2E8]">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Enter-to-Filter Search Bar */}
          <form onSubmit={handleSearchFormSubmit} className="flex-1 max-w-2xl flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#667784] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchDraft}
                onChange={(e) => onSearchDraftChange(e.target.value)}
                placeholder="Search universities, tuition-free states, DAAD FAQs, scholarships, or APS/Visa and press Enter..."
                aria-label="Search across EuroVidya content and press Enter"
                className="w-full pl-10 pr-9 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] placeholder:text-[#667784] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
              />
              {(searchDraft || committedSearch) && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#667784] hover:text-[#173B57] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#173B57] hover:bg-[#00253E] text-white text-sm font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* User Authentication & Personalized Welcome */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 text-sm">
            {user ? (
              <>
                <div className="inline-flex items-center gap-2 text-[#173B57] font-medium">
                  <UserCheck className="w-4 h-4 text-[#167C80] shrink-0" />
                  <span>
                    Welcome back, <strong className="font-semibold">{welcomeName}</strong>
                  </span>
                  <span className="text-xs text-[#667784] tabular-nums">· {likedCount} Liked</span>
                </div>
                <button
                  type="button"
                  onClick={onLogOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D9E2E8] hover:bg-[#F7F9FA] text-xs font-semibold text-[#173B57] rounded transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#667784] hidden sm:inline tabular-nums">
                  {likedCount} Liked · Guest Mode
                </span>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-white border-[1.5px] border-[#173B57] text-[#173B57] hover:bg-[#173B57]/[0.04] text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Sign In / Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
