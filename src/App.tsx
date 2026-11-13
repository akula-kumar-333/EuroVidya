import { useMemo, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { BriefingModal } from './components/BriefingModal';
import { ChecklistScreen } from './components/ChecklistScreen';
import { ContactScreen } from './components/ContactScreen';
import { CourseExplorerScreen } from './components/CourseExplorerScreen';
import { DossierModal } from './components/DossierModal';
import { GradeCalculatorScreen } from './components/GradeCalculatorScreen';
import { LivingWorkScreen } from './components/LivingWorkScreen';
import { OverviewScreen } from './components/OverviewScreen';
import { PrintableDossier } from './components/PrintableDossier';
import { ScholarshipsScreen } from './components/ScholarshipsScreen';
import { TimelineScreen } from './components/TimelineScreen';
import { TopNav } from './components/TopNav';
import { TuitionFreeScreen } from './components/TuitionFreeScreen';
import { CHECKLIST_ITEMS } from './data/checklist';
import { useEuroVidyaStore } from './hooks/useEuroVidyaStore';
import { ScreenId, StudyCountry } from './types/eurovidya';
import { calculateBavarianGrade } from './utils/bavarianFormula';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [filterEligibleOnNavigate, setFilterEligibleOnNavigate] = useState(false);
  const [countryFilterOnNavigate, setCountryFilterOnNavigate] = useState<StudyCountry | 'All'>('All');
  const [dossierOpen, setDossierOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const [searchDraft, setSearchDraft] = useState('');
  const [committedSearch, setCommittedSearch] = useState('');

  const {
    state,
    user,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logOut,
    updateProfile,
    toggleShortlist,
    toggleLike,
    toggleChecklistItem,
    updateChecklistNote,
    updateBlockedAccount,
    submitConsultationInquiry,
    clearBooking,
    resetAllData,
    downloadDossierMarkdown,
  } = useEuroVidyaStore();

  const gradeResult = useMemo(() => calculateBavarianGrade(state.profile), [state.profile]);

  const checklistCompletedCount = useMemo(
    () => CHECKLIST_ITEMS.filter((item) => state.checklistState[item.id]?.completed).length,
    [state.checklistState]
  );

  const handleNavigate = (screen: ScreenId) => {
    if (screen !== 'courses') {
      setFilterEligibleOnNavigate(false);
      setCountryFilterOnNavigate('All');
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCountryInExplorer = (country: StudyCountry) => {
    setCountryFilterOnNavigate(country);
    setFilterEligibleOnNavigate(false);
    setActiveScreen('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreMatchingCourses = () => {
    setCountryFilterOnNavigate('All');
    setFilterEligibleOnNavigate(true);
    setActiveScreen('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query: string) => {
    setCommittedSearch(query);
    if (query && (activeScreen === 'calculator' || activeScreen === 'living' || activeScreen === 'contact')) {
      setCountryFilterOnNavigate('All');
      setFilterEligibleOnNavigate(false);
      setActiveScreen('overview');
    }
  };

  const handleClearSearch = () => {
    setSearchDraft('');
    setCommittedSearch('');
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FA] text-[#2D3741]">
      <TopNav
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        shortlistCount={state.shortlistedIds.length}
        likedCount={state.likedItemIds.length}
        onOpenDossier={() => setDossierOpen(true)}
        user={user}
        studentName={state.profile.studentName}
        onOpenAuth={() => setAuthOpen(true)}
        onLogOut={() => void logOut()}
        searchDraft={searchDraft}
        committedSearch={committedSearch}
        onSearchDraftChange={setSearchDraft}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
      />

      <main className="no-print flex-1">
        {activeScreen === 'overview' && (
          <OverviewScreen
            onNavigate={handleNavigate}
            onSelectCountryInExplorer={handleSelectCountryInExplorer}
            onOpenBriefing={() => setBriefingOpen(true)}
            booking={state.booking}
            computedGrade={gradeResult.roundedGrade}
            isGradeValid={gradeResult.isValid}
            shortlistCount={state.shortlistedIds.length}
            shortlistedIds={state.shortlistedIds}
            onToggleShortlist={toggleShortlist}
            likedItemIds={state.likedItemIds}
            onToggleLike={toggleLike}
            checklistCompleted={checklistCompletedCount}
            checklistTotal={CHECKLIST_ITEMS.length}
            committedSearch={committedSearch}
            onClearSearch={handleClearSearch}
          />
        )}

        {activeScreen === 'tuition-free' && (
          <TuitionFreeScreen
            likedItemIds={state.likedItemIds}
            onToggleLike={toggleLike}
            onExploreCourses={() => handleNavigate('courses')}
            committedSearch={committedSearch}
            onClearGlobalSearch={handleClearSearch}
          />
        )}

        {activeScreen === 'calculator' && (
          <GradeCalculatorScreen
            profile={state.profile}
            result={gradeResult}
            onUpdateProfile={updateProfile}
            onExploreMatchingCourses={handleExploreMatchingCourses}
          />
        )}

        {activeScreen === 'courses' && (
          <CourseExplorerScreen
            profile={state.profile}
            gradeResult={gradeResult}
            shortlistedIds={state.shortlistedIds}
            likedItemIds={state.likedItemIds}
            onToggleShortlist={toggleShortlist}
            onToggleLike={toggleLike}
            initialEligibleOnly={filterEligibleOnNavigate}
            initialCountryFilter={countryFilterOnNavigate}
            committedSearch={committedSearch}
            onClearGlobalSearch={handleClearSearch}
          />
        )}

        {activeScreen === 'scholarships' && (
          <ScholarshipsScreen
            likedItemIds={state.likedItemIds}
            onToggleLike={toggleLike}
            committedSearch={committedSearch}
            onClearGlobalSearch={handleClearSearch}
          />
        )}

        {activeScreen === 'living' && <LivingWorkScreen />}

        {activeScreen === 'timeline' && (
          <TimelineScreen
            likedItemIds={state.likedItemIds}
            onToggleLike={toggleLike}
            committedSearch={committedSearch}
            onClearGlobalSearch={handleClearSearch}
          />
        )}

        {activeScreen === 'checklist' && (
          <ChecklistScreen
            checklistState={state.checklistState}
            likedItemIds={state.likedItemIds}
            blockedAccount={state.blockedAccount}
            onToggleItem={toggleChecklistItem}
            onToggleLike={toggleLike}
            onUpdateNote={updateChecklistNote}
            onUpdateBlockedAccount={updateBlockedAccount}
            onOpenDossier={() => setDossierOpen(true)}
            committedSearch={committedSearch}
            onClearSearch={handleClearSearch}
          />
        )}

        {activeScreen === 'contact' && <ContactScreen onSubmitInquiry={submitConsultationInquiry} />}
      </main>

      {/* Institutional Footer with Rectangular Logo & Interactive Redirects */}
      <footer className="no-print border-t border-[#D9E2E8] bg-white">
        <div className="max-w-[1360px] mx-auto px-5 md:px-8 py-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-xs text-[#667784]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src="/assets/aistudio/EuroVidya_Logo_Rectangular.jpg_d240e456.jpeg"
              alt="EuroVidya — Your Gateway to European Education"
              className="h-9 w-auto object-contain self-start"
            />
            <div className="space-y-0.5">
              <p className="font-medium text-[#173B57]">European Public &amp; State-Recognized University Advisory</p>
              <p>
                Call:{' '}
                <a href="tel:+916300018300" className="text-[#167C80] font-semibold hover:underline">
                  +91 6300018300
                </a>{' '}
                · Info:{' '}
                <a href="mailto:info@eurovidya.com" className="text-[#167C80] font-semibold hover:underline">
                  info@eurovidya.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              type="button"
              onClick={() => handleNavigate('tuition-free')}
              className="hover:text-[#173B57] cursor-pointer"
            >
              Tuition-Free Germany
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('calculator')}
              className="hover:text-[#173B57] cursor-pointer"
            >
              Grade Audit
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('courses')}
              className="hover:text-[#173B57] cursor-pointer"
            >
              Course Explorer
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('scholarships')}
              className="hover:text-[#173B57] cursor-pointer"
            >
              Scholarships
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('living')}
              className="hover:text-[#173B57] cursor-pointer"
            >
              Living &amp; Work
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('timeline')}
              className="hover:text-[#173B57] cursor-pointer"
            >
              Intake Timeline
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('checklist')}
              className="hover:text-[#173B57] cursor-pointer"
            >
              APS &amp; Blocked Account
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('contact')}
              className="text-[#167C80] font-semibold hover:underline cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>

      {dossierOpen && (
        <DossierModal
          isOpen={dossierOpen}
          onClose={() => setDossierOpen(false)}
          state={state}
          gradeResult={gradeResult}
          onRemoveShortlist={toggleShortlist}
          onDownloadMarkdown={downloadDossierMarkdown}
          onPrintPdf={handlePrintPdf}
          onResetAll={resetAllData}
          isSignedIn={Boolean(user)}
        />
      )}

      {briefingOpen && (
        <BriefingModal
          isOpen={briefingOpen}
          onClose={() => setBriefingOpen(false)}
          onSaveBooking={submitConsultationInquiry}
          onClearBooking={clearBooking}
        />
      )}

      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSignInEmail={signInWithEmail}
          onSignUpEmail={signUpWithEmail}
          onSignInGoogle={signInWithGoogle}
        />
      )}

      <PrintableDossier state={state} gradeResult={gradeResult} />
    </div>
  );
}
