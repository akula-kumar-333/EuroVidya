import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Globe2,
  HelpCircle,
  Mail,
  Phone,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { DAAD_FAQS } from '../data/daadFaq';
import { EUROPEAN_DESTINATIONS } from '../data/destinations';
import { PUBLIC_UNIVERSITY_PROGRAMS } from '../data/programs';
import { ConsultationBooking, DaadFaqItem, ScreenId, StudyCountry } from '../types/eurovidya';
import { LikeButton } from './LikeButton';

interface OverviewScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectCountryInExplorer: (country: StudyCountry) => void;
  onOpenBriefing: () => void;
  booking: ConsultationBooking | null;
  computedGrade: number;
  isGradeValid: boolean;
  shortlistCount: number;
  shortlistedIds: string[];
  onToggleShortlist: (programId: string) => void;
  likedItemIds: string[];
  onToggleLike: (itemId: string) => void;
  checklistCompleted: number;
  checklistTotal: number;
  committedSearch: string;
  onClearSearch: () => void;
}

const SCOPE_COMMITMENTS = [
  'Modified Bavarian Formula GPA conversion & semester-wise credit auditing',
  'Module handbook mapping against TU9, UAS7, and European credit mandates',
  'Uni-Assist Preliminary Review (VPD), Campus France, Studielink & Irish ILEP verification',
  'APS India DigiLocker & university verification readiness pre-check',
  'Blocked Account (€11,904/yr) & statutory European health insurance setup guidance',
];

const REALITY_BOUNDS = [
  'We do not guarantee public university admission without qualifying grade cutoffs',
  'We do not accept private university commissions or steer students to unaccredited colleges',
  'We do not fabricate internships, work experience, or financial affidavits',
  'We do not submit applications without student & parent sign-off on every deadline',
  'We do not bypass APS India, Campus France, or VFS Global legal documentation rules',
];

const FAQ_CATEGORIES: ('All' | DaadFaqItem['category'])[] = [
  'All',
  'Admissions',
  'APS Verification',
  'Blocked Account',
  'Work & Stay-Back',
];

export function OverviewScreen({
  onNavigate,
  onSelectCountryInExplorer,
  onOpenBriefing,
  booking,
  computedGrade,
  isGradeValid,
  shortlistCount,
  shortlistedIds,
  onToggleShortlist,
  likedItemIds,
  onToggleLike,
  checklistCompleted,
  checklistTotal,
  committedSearch,
  onClearSearch,
}: OverviewScreenProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [briefingImgFailed, setBriefingImgFailed] = useState(false);
  const [faqCategory, setFaqCategory] = useState<'All' | DaadFaqItem['category']>('All');
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({ 'faq-tuition-free': true });

  const normalizedQuery = committedSearch.trim().toLowerCase();

  const matchingDestinations = EUROPEAN_DESTINATIONS.filter((dest) => {
    if (!normalizedQuery) return true;
    const text =
      `${dest.country} ${dest.tagline} ${dest.tuitionSummary} ${dest.financialProof} ${dest.postStudyVisa} ${dest.keyPortal} ${dest.highlights.join(' ')}`.toLowerCase();
    return text.includes(normalizedQuery);
  });

  const matchingPrograms = normalizedQuery
    ? PUBLIC_UNIVERSITY_PROGRAMS.filter((prog) => {
        const text = `${prog.country} ${prog.university} ${prog.programName} ${prog.city} ${prog.field} ${prog.group}`.toLowerCase();
        return text.includes(normalizedQuery);
      })
    : [];

  const matchingFaqs = DAAD_FAQS.filter((faq) => {
    if (!normalizedQuery && faqCategory !== 'All' && faq.category !== faqCategory) return false;
    if (!normalizedQuery) return true;
    const text = `${faq.category} ${faq.question} ${faq.answer} ${faq.officialReference}`.toLowerCase();
    return text.includes(normalizedQuery);
  });

  const advisoryTools = [
    {
      id: 'tool-tuition-free',
      screen: 'tuition-free' as ScreenId,
      kicker: '01. Zero-Tuition Directory',
      meta: '15 Free States',
      title: 'Tuition-Free Public Universities in Germany',
      description:
        'Browse Germany’s complete state-funded public university list across all 15 tuition-free states plus transparent Baden-Württemberg & TUM fee notes.',
      cta: 'View Free Universities',
    },
    {
      id: 'tool-grade-audit',
      screen: 'calculator' as ScreenId,
      kicker: '02. Academic Audit',
      meta: isGradeValid ? `Grade ${computedGrade.toFixed(1)}` : 'German Scale',
      title: 'German Grade & Credit Eligibility',
      description:
        'Convert 10-point CGPA, 4-point GPA, or Indian percentages using your university’s exact passing mark and verify 3-year vs. 4-year credit parity.',
      cta: 'Open Calculator',
    },
    {
      id: 'tool-course-explorer',
      screen: 'courses' as ScreenId,
      kicker: '03. European Matrix',
      meta: `${PUBLIC_UNIVERSITY_PROGRAMS.length} Public Tracks`,
      title: 'Germany & European Course Explorer',
      description:
        'Compare TU9, UAS7, French, Irish, Dutch, and Austrian public programs by tuition, historical cutoffs, and real-time Safe / Target / Reach fit.',
      cta: 'Browse Programs',
    },
    {
      id: 'tool-aps-visa',
      screen: 'checklist' as ScreenId,
      kicker: '04. Legal Readiness',
      meta: `${checklistCompleted}/${checklistTotal} Verified`,
      title: 'APS, Blocked Account & Visa Tracker',
      description:
        'Track mandatory APS India documents, European portal deadlines, €11,904 Blocked Account INR estimates, and VFS Type-D visa biometrics.',
      cta: 'Open Checklist',
    },
    {
      id: 'tool-scholarships',
      screen: 'scholarships' as ScreenId,
      kicker: '05. Merit Funding',
      meta: '10 Official Grants',
      title: 'Scholarships & Financial Aid Directory',
      description:
        'Explore DAAD Study Scholarships, Germany Merit Scholarships, Charpak, Eiffel, Ireland GOI-IES, and Netherlands NL Scholarship opportunities.',
      cta: 'Explore Scholarships',
    },
    {
      id: 'tool-living-timeline',
      screen: 'living' as ScreenId,
      kicker: '06. Budget & Part-Time Work',
      meta: '2026 €13.90/hr Rule',
      title: 'Living Costs & Part-Time Work Estimator',
      description:
        'Plan monthly European rent, groceries, health insurance, and legal student part-time work income alongside Winter & Summer intake timelines.',
      cta: 'Estimate Monthly Budget',
    },
  ];

  const matchingTools = advisoryTools.filter((tool) => {
    if (!normalizedQuery) return true;
    return `${tool.kicker} ${tool.title} ${tool.description}`.toLowerCase().includes(normalizedQuery);
  });

  const hasAnySearchMatch =
    matchingDestinations.length > 0 ||
    matchingTools.length > 0 ||
    matchingPrograms.length > 0 ||
    matchingFaqs.length > 0;

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Search Feedback Banner */}
      {normalizedQuery && (
        <section className="max-w-[1200px] mx-auto px-5 md:px-8 pt-6">
          <div className="bg-white border border-[#D9E2E8] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#2D3741]">
              Search results for <strong className="text-[#173B57]">"{committedSearch}"</strong>:{' '}
              <span className="font-mono text-xs text-[#667784] tabular-nums">
                {matchingDestinations.length} countries · {matchingPrograms.length} programs ·{' '}
                {matchingFaqs.length} FAQs · {matchingTools.length} tools
              </span>
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
        </section>
      )}

      {normalizedQuery && !hasAnySearchMatch ? (
        <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-12">
          <div className="bg-white border border-[#D9E2E8] rounded-lg p-12 text-center space-y-3">
            <p className="font-display text-xl font-semibold text-[#173B57]">No results found</p>
            <p className="text-sm text-[#667784] max-w-md mx-auto">
              No European study destinations, universities, FAQs, or advisory tools matched "{committedSearch}". Try
              searching for Germany, France, Ireland, APS, Blocked Account, or DAAD.
            </p>
            <button
              type="button"
              onClick={onClearSearch}
              className="mt-2 px-4 py-2 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Matching University Programs when Top Search is active */}
          {normalizedQuery && matchingPrograms.length > 0 && (
            <section className="max-w-[1200px] mx-auto px-5 md:px-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-display text-xl font-semibold text-[#173B57]">
                  Matching Public University Programs ({matchingPrograms.length})
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className="text-xs font-semibold text-[#167C80] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  Open Full Matrix <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchingPrograms.map((prog) => {
                  const isShortlisted = shortlistedIds.includes(prog.id);
                  return (
                    <div
                      key={prog.id}
                      className="bg-white border border-[#D9E2E8] rounded-lg p-5 flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#167C80]">
                          {prog.country} · {prog.city} · {prog.group}
                        </p>
                        <h3 className="mt-1 font-display text-base font-semibold text-[#173B57]">
                          {prog.programName} ({prog.degreeAward})
                        </h3>
                        <p className="text-xs text-[#667784] mt-0.5">{prog.university}</p>
                        <p className="mt-2.5 text-xs text-[#2D3741] font-mono tabular-nums">
                          Tuition: €{prog.tuitionPerSemesterEur.toLocaleString('en-IN')}/sem · Cutoff:{' '}
                          {prog.historicalCutoff ? prog.historicalCutoff.toFixed(1) : 'Open Admission'}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-[#D9E2E8] flex items-center justify-between gap-2">
                        <LikeButton
                          liked={likedItemIds.includes(prog.id)}
                          onToggle={() => onToggleLike(prog.id)}
                          label={prog.programName}
                          compact
                        />
                        <button
                          type="button"
                          onClick={() => onToggleShortlist(prog.id)}
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
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Hero Section */}
          {!normalizedQuery && (
            <section className="max-w-[1200px] mx-auto px-5 md:px-8 pt-8 md:pt-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-6 flex flex-col justify-between bg-white border border-[#D9E2E8] rounded-lg p-7 md:p-10 shadow-[0_1px_3px_rgba(23,59,87,0.05)]">
                  <div className="space-y-5">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
                      Your Gateway to European Education
                    </p>
                    <h1 className="font-display text-[2rem] md:text-[2.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-[#173B57] text-balance">
                      Transparent Admission Pathways to Public Universities Across Europe
                    </h1>
                    <p className="text-base md:text-[1.0625rem] leading-relaxed text-[#2D3741] max-w-xl">
                      Built for Indian students and parents who prefer verifiable admission math over sales promises.
                      Explore Germany’s tuition-free public universities alongside France, Ireland, Netherlands, and
                      Austria with official tuition, visa, and stay-back facts.
                    </p>
                  </div>

                  <div className="pt-8 mt-8 border-t border-[#D9E2E8] flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate('tuition-free')}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#167C80] hover:bg-[#00696D] text-white text-[15px] font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Tuition-Free Germany List
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('calculator')}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border-[1.5px] border-[#173B57] text-[#173B57] hover:bg-[#173B57]/[0.04] text-[15px] font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Run Grade Audit
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 relative rounded-lg overflow-hidden border border-[#D9E2E8] bg-[#EAF2F5] min-h-[280px] lg:min-h-full">
                  {!heroImgFailed ? (
                    <img
                      src="/src/assets/images/hero_german_campus_1794557508753.jpg"
                      alt="Modern European public technical university campus plaza and engineering library"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full lg:h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#EAF2F5] to-[#D9E3F1]">
                      <Building2 className="w-10 h-10 text-[#173B57] mb-3" />
                      <p className="font-display font-semibold text-[#173B57]">
                        European Public University Campus
                      </p>
                      <p className="text-sm text-[#667784] mt-1">Germany · France · Ireland · Netherlands · Austria</p>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#00253E]/85 via-[#00253E]/45 to-transparent p-5 md:p-6">
                    <p className="text-xs font-medium text-white/90">
                      Germany · France · Ireland · Netherlands · Austria · Official 2025/2026 Guidelines
                    </p>
                  </div>
                </div>
              </div>

              {/* Full-Width 4-Column Benchmarks Strip */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-[#D9E2E8] rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-[#D9E2E8]">
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#667784]">Germany Tuition</p>
                  <p className="mt-1.5 font-mono text-2xl font-semibold text-[#173B57] tabular-nums">€0 / Sem</p>
                  <p className="mt-1 text-xs text-[#667784]">15 of 16 federal states (exc. Baden-Württemberg)</p>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#667784]">
                    Blocked Account (2025/26)
                  </p>
                  <p className="mt-1.5 font-mono text-2xl font-semibold text-[#173B57] tabular-nums">€11,904 / yr</p>
                  <p className="mt-1 text-xs text-[#667784]">€992/month German Federal Foreign Office rule</p>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#667784]">2026 Min Student Wage</p>
                  <p className="mt-1.5 font-mono text-2xl font-semibold text-[#173B57] tabular-nums">€13.90 / hr</p>
                  <p className="mt-1 text-xs text-[#667784]">140 full days/yr · 18-mo post-study visa</p>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#667784]">My Shortlist</p>
                  <p className="mt-1.5 font-mono text-2xl font-semibold text-[#167C80] tabular-nums">
                    {isGradeValid ? `${computedGrade.toFixed(1)} DE` : 'Audit Ready'}
                  </p>
                  <p className="mt-1 text-xs text-[#667784] tabular-nums">
                    {shortlistCount} shortlisted · {likedItemIds.length} liked
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* European Study Destinations Grid with Like Button */}
          {matchingDestinations.length > 0 && (
            <section className="max-w-[1200px] mx-auto px-5 md:px-8 pt-2">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#167C80]">
                    Official Country Guides (2025/2026)
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl md:text-3xl font-semibold tracking-tight text-[#173B57]">
                    Germany &amp; Top European Study Destinations
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className="text-sm font-semibold text-[#167C80] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  Compare All {PUBLIC_UNIVERSITY_PROGRAMS.length} Programs <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingDestinations.map((dest) => {
                  const isLiked = likedItemIds.includes(dest.id);
                  return (
                    <article
                      key={dest.id}
                      className="bg-white border border-[#D9E2E8] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(23,59,87,0.05)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-44 bg-[#EAF2F5] overflow-hidden relative">
                          <img
                            src={dest.imageUrl}
                            alt={`${dest.country} higher education campus`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#00253E]/85 via-[#00253E]/35 to-transparent px-4 py-3 flex items-center justify-between">
                            <span className="font-display text-lg font-bold text-white">{dest.country}</span>
                            <span className="text-[11px] font-medium text-white/90">{dest.officialSourceLabel}</span>
                          </div>
                        </div>

                        <div className="p-5 space-y-3.5">
                          <p className="text-sm leading-relaxed text-[#2D3741]">{dest.tagline}</p>

                          <div className="space-y-2 text-xs border-t border-[#D9E2E8] pt-3">
                            <div>
                              <span className="font-semibold text-[#173B57]">Tuition: </span>
                              <span className="text-[#2D3741]">{dest.tuitionSummary}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-[#173B57]">Financial Proof: </span>
                              <span className="text-[#2D3741]">{dest.financialProof}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-[#173B57]">Stay-Back: </span>
                              <span className="text-[#167C80] font-medium">{dest.postStudyVisa}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-[#173B57]">Work Rights: </span>
                              <span className="text-[#2D3741]">{dest.partTimeWork}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 bg-[#F7F9FA] border-t border-[#D9E2E8] flex items-center justify-between gap-2">
                        <LikeButton
                          liked={isLiked}
                          onToggle={() => onToggleLike(dest.id)}
                          label={dest.country}
                          compact
                        />
                        <button
                          type="button"
                          onClick={() => onSelectCountryInExplorer(dest.country)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#167C80] hover:underline cursor-pointer"
                        >
                          View {dest.country} Courses <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* Official DAAD & APS India FAQ Section */}
          {matchingFaqs.length > 0 && (
            <section id="daad-faq" className="max-w-[1200px] mx-auto px-5 md:px-8">
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
                    Sourced from Official DAAD, APS India &amp; German Foreign Office Guidelines
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl md:text-3xl font-semibold tracking-tight text-[#173B57]">
                    Frequently Asked Questions: Admissions, APS &amp; Blocked Account
                  </h2>
                </div>

                {!normalizedQuery && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {FAQ_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFaqCategory(cat)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors whitespace-nowrap cursor-pointer ${
                          faqCategory === cat
                            ? 'bg-[#173B57] border-[#173B57] text-white'
                            : 'bg-white border-[#D9E2E8] text-[#2D3741] hover:bg-[#EAF2F5]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-[#D9E2E8] rounded-lg divide-y divide-[#D9E2E8] shadow-[0_1px_3px_rgba(23,59,87,0.05)]">
                {matchingFaqs.map((faq) => {
                  const isOpen = Boolean(openFaqIds[faq.id] || normalizedQuery);
                  const isLiked = likedItemIds.includes(faq.id);
                  return (
                    <div key={faq.id} className="p-5 md:p-6">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left flex items-start justify-between gap-4 cursor-pointer"
                      >
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#167C80] inline-flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            {faq.category}
                          </span>
                          <h3 className="font-display text-base md:text-lg font-semibold text-[#173B57]">
                            {faq.question}
                          </h3>
                        </div>
                        <span className="p-1.5 rounded border border-[#D9E2E8] text-[#667784] shrink-0 mt-1">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-[#D9E2E8]/70 space-y-3">
                          <p className="text-sm leading-relaxed text-[#2D3741]">{faq.answer}</p>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs font-medium text-[#667784]">
                              Official Source: {faq.officialReference}
                            </span>
                            <LikeButton
                              liked={isLiked}
                              onToggle={() => onToggleLike(faq.id)}
                              label={faq.question}
                              compact
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Interactive Workspace Entry Points */}
          {matchingTools.length > 0 && (
            <section className="max-w-[1200px] mx-auto px-5 md:px-8">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#167C80]">Advisory Workspace</p>
                <h2 className="mt-1.5 font-display text-2xl md:text-3xl font-semibold tracking-tight text-[#173B57]">
                  Interactive Planning Tools for Students &amp; Parents
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-white border border-[#D9E2E8] hover:border-[#167C80] rounded-lg p-6 transition-all hover:shadow-[0_4px_12px_rgba(23,59,87,0.08)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#667784] mb-3">
                        <span className="font-semibold text-[#173B57]">{tool.kicker}</span>
                        <span className="font-mono tabular-nums">{tool.meta}</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-[#173B57]">{tool.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#2D3741]">{tool.description}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#D9E2E8] flex items-center justify-between gap-2">
                      <LikeButton
                        liked={likedItemIds.includes(tool.id)}
                        onToggle={() => onToggleLike(tool.id)}
                        label={tool.title}
                        compact
                      />
                      <button
                        type="button"
                        onClick={() => onNavigate(tool.screen)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#167C80] hover:underline cursor-pointer"
                      >
                        {tool.cta} <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Explicit Boundary Cards + Parent Consultation */}
          {!normalizedQuery && (
            <>
              <section className="max-w-[1200px] mx-auto px-5 md:px-8">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">Advisory Charter</p>
                  <h2 className="mt-1.5 font-display text-2xl md:text-3xl font-semibold tracking-tight text-[#173B57]">
                    What We Guarantee vs. What We Do Not
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-[#D9E2E8] border-t-[3px] border-t-[#167C80] rounded-lg p-7">
                    <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#D9E2E8]">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#167C80]">
                          Scope of Commitment
                        </p>
                        <h3 className="mt-1 font-display text-xl font-semibold text-[#173B57]">
                          Verifiable Advisory Deliverables
                        </h3>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-[#167C80] shrink-0" />
                    </div>
                    <ul className="mt-5 space-y-4">
                      {SCOPE_COMMITMENTS.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-0.5 w-5 h-5 rounded bg-[#E6F2F1] text-[#167C80] flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-[15px] leading-relaxed text-[#2D3741]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#F7F9FA] border border-[#D9E2E8] border-t-[3px] border-t-[#667784] rounded-lg p-7">
                    <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#D9E2E8]">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#667784]">Reality Bounds</p>
                        <h3 className="mt-1 font-display text-xl font-semibold text-[#173B57]">
                          Explicit Institutional Boundaries
                        </h3>
                      </div>
                      <FileCheck2 className="w-6 h-6 text-[#667784] shrink-0" />
                    </div>
                    <ul className="mt-5 space-y-4">
                      {REALITY_BOUNDS.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-0.5 w-5 h-5 rounded border border-[#D9E2E8] bg-white text-[#667784] flex items-center justify-center shrink-0">
                            <X className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-[15px] leading-relaxed text-[#2D3741]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Parent Briefing & Direct Contact Strip */}
              <section className="max-w-[1200px] mx-auto px-5 md:px-8 pb-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-[#D9E2E8] rounded-lg overflow-hidden">
                  <div className="lg:col-span-5 bg-[#D9E3F1] min-h-[240px]">
                    {!briefingImgFailed ? (
                      <img
                        src="/src/assets/images/advisory_parent_briefing_1794557508147.jpg"
                        alt="Indian student and parents reviewing European university admission documents with advisor"
                        referrerPolicy="no-referrer"
                        onError={() => setBriefingImgFailed(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-[#173B57]">
                        Parent &amp; Student Consultation Session
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-7 p-7 md:p-9 flex flex-col justify-between space-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
                        Family Decision Briefing &amp; Direct Support
                      </p>
                      <h2 className="mt-1.5 font-display text-2xl font-semibold text-[#173B57]">
                        Speak Directly With EuroVidya Advisors
                      </h2>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#2D3741]">
                        Parents and students are welcome to connect directly with our advisory team in Hyderabad &amp;
                        across India for transparent guidance on European public universities, APS India, and visa
                        finances.
                      </p>

                      {booking && (
                        <div className="mt-4 p-3 rounded bg-[#E6F2F1] border border-[#167C80]/30 text-xs text-[#173B57]">
                          <strong>Latest Inquiry ({booking.id}):</strong> {booking.parentOrStudentName} ·{' '}
                          {booking.destinationCountry} · {booking.targetIntake}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#D9E2E8] flex flex-wrap items-center gap-3">
                      <a
                        href="tel:+916300018300"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#167C80] hover:bg-[#00696D] text-white text-xs font-semibold rounded transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call +91 6300018300
                      </a>
                      <a
                        href="mailto:info@eurovidya.com?subject=EuroVidya%20Consultation%20Inquiry"
                        className="inline-flex items-center gap-2 px-4 py-2.5 border-[1.5px] border-[#173B57] text-[#173B57] hover:bg-[#173B57]/[0.04] text-xs font-semibold rounded transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email info@eurovidya.com
                      </a>
                      <button
                        type="button"
                        onClick={onOpenBriefing}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EAF2F5] hover:bg-[#D9E3F1] text-[#173B57] text-xs font-semibold rounded transition-colors cursor-pointer"
                      >
                        <Globe2 className="w-3.5 h-3.5" />
                        Open Consultation Form
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
