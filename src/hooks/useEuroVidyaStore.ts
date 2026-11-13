import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CHECKLIST_ITEMS, CHECKLIST_PHASES } from '../data/checklist';
import { PUBLIC_UNIVERSITY_PROGRAMS } from '../data/programs';
import {
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  testFirestoreConnection,
} from '../lib/firebase';
import {
  BlockedAccountConfig,
  ConsultationBooking,
  DossierStoreState,
  StudentProfile,
} from '../types/eurovidya';
import { calculateBavarianGrade, evaluateProgramMatch } from '../utils/bavarianFormula';

const STORAGE_KEY = 'eurovidya_shortlist_v3';

export const DEFAULT_DOSSIER_STATE: DossierStoreState = {
  profile: {
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
  },
  shortlistedIds: [],
  likedItemIds: [],
  checklistState: {},
  blockedAccount: {
    eurPerYear: null,
    eurToInrRate: null,
    bufferPercent: null,
    apsFeeInr: null,
    visaFeeInr: null,
  },
  booking: null,
};

function sanitizeNullableNumber(val: unknown): number | null {
  return typeof val === 'number' && Number.isFinite(val) ? val : null;
}

function loadGuestState(): DossierStoreState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DOSSIER_STATE;
    const parsed = JSON.parse(raw) as Partial<DossierStoreState>;
    return {
      profile: { ...DEFAULT_DOSSIER_STATE.profile, ...(parsed.profile ?? {}) },
      shortlistedIds: Array.isArray(parsed.shortlistedIds) ? parsed.shortlistedIds : [],
      likedItemIds: Array.isArray(parsed.likedItemIds) ? parsed.likedItemIds : [],
      checklistState: parsed.checklistState ?? {},
      blockedAccount: { ...DEFAULT_DOSSIER_STATE.blockedAccount, ...(parsed.blockedAccount ?? {}) },
      booking: parsed.booking ?? null,
    };
  } catch {
    return DEFAULT_DOSSIER_STATE;
  }
}

function mapFirebaseAuthError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('auth/operation-not-allowed')) {
    return 'Email/Password sign-in is not yet enabled in your Firebase Console (Authentication → Sign-in method → Email/Password). You can enable it there or use Google Sign-In below.';
  }
  if (msg.includes('auth/email-already-in-use')) {
    return 'An account already exists with this email address. Please switch to Log In.';
  }
  if (
    msg.includes('auth/invalid-credential') ||
    msg.includes('auth/wrong-password') ||
    msg.includes('auth/user-not-found')
  ) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }
  if (msg.includes('auth/weak-password')) {
    return 'Please choose a password with at least 6 characters.';
  }
  if (msg.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (msg.includes('auth/popup-closed-by-user')) {
    return 'Sign-in window was closed before completing login.';
  }
  return msg;
}

export function useEuroVidyaStore() {
  const [state, setState] = useState<DossierStoreState>(() => loadGuestState());
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const skipNextCloudPush = useRef(false);

  useEffect(() => {
    void testFirestoreConnection();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);

      if (!firebaseUser) {
        setCloudSyncStatus('idle');
        return;
      }

      const dossierPath = `users/${firebaseUser.uid}/dossier/main`;
      setCloudSyncStatus('syncing');
      try {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid, 'dossier', 'main'));
        if (snap.exists()) {
          const data = snap.data();
          skipNextCloudPush.current = true;
          const rawBlocked = (data.blockedAccount ?? {}) as Partial<BlockedAccountConfig>;
          setState((prev) => ({
            ...prev,
            profile: {
              studentName:
                typeof data.studentName === 'string' && data.studentName
                  ? data.studentName
                  : prev.profile.studentName,
              targetDegree: data.targetDegree ?? prev.profile.targetDegree,
              targetField: data.targetField ?? prev.profile.targetField,
              gradingScale: data.gradingScale ?? prev.profile.gradingScale,
              maxScore: sanitizeNullableNumber(data.maxScore),
              minPassScore: sanitizeNullableNumber(data.minPassScore),
              obtainedScore: sanitizeNullableNumber(data.obtainedScore),
              degreeDuration:
                data.degreeDuration === 3 || data.degreeDuration === 4 ? data.degreeDuration : null,
              ieltsScore: sanitizeNullableNumber(data.ieltsScore),
              germanLevel: data.germanLevel ?? prev.profile.germanLevel,
              backlogs: sanitizeNullableNumber(data.backlogs),
              apsStatus: data.apsStatus ?? prev.profile.apsStatus,
            },
            shortlistedIds: Array.isArray(data.shortlistedIds)
              ? data.shortlistedIds
              : prev.shortlistedIds,
            likedItemIds: Array.isArray(data.likedItemIds) ? data.likedItemIds : prev.likedItemIds,
            checklistState: data.checklistState ?? prev.checklistState,
            blockedAccount: {
              eurPerYear: sanitizeNullableNumber(rawBlocked.eurPerYear),
              eurToInrRate: sanitizeNullableNumber(rawBlocked.eurToInrRate),
              bufferPercent: sanitizeNullableNumber(rawBlocked.bufferPercent),
              apsFeeInr: sanitizeNullableNumber(rawBlocked.apsFeeInr),
              visaFeeInr: sanitizeNullableNumber(rawBlocked.visaFeeInr),
            },
          }));
          setCloudSyncStatus('synced');
        } else {
          setCloudSyncStatus('synced');
        }
      } catch (err) {
        setCloudSyncStatus('error');
        handleFirestoreError(err, OperationType.GET, dossierPath);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady || !user) return;

    if (skipNextCloudPush.current) {
      skipNextCloudPush.current = false;
      return;
    }

    const timer = window.setTimeout(async () => {
      const dossierPath = `users/${user.uid}/dossier/main`;
      setCloudSyncStatus('syncing');
      try {
        await setDoc(doc(db, 'users', user.uid, 'dossier', 'main'), {
          ownerUid: user.uid,
          studentName: (state.profile.studentName || '').slice(0, 120),
          email: (user.email || '').slice(0, 160),
          targetDegree: state.profile.targetDegree,
          targetField: state.profile.targetField,
          gradingScale: state.profile.gradingScale,
          maxScore: sanitizeNullableNumber(state.profile.maxScore),
          minPassScore: sanitizeNullableNumber(state.profile.minPassScore),
          obtainedScore: sanitizeNullableNumber(state.profile.obtainedScore),
          degreeDuration: state.profile.degreeDuration ?? null,
          ieltsScore: sanitizeNullableNumber(state.profile.ieltsScore),
          germanLevel: state.profile.germanLevel,
          backlogs: sanitizeNullableNumber(state.profile.backlogs),
          apsStatus: state.profile.apsStatus,
          shortlistedIds: state.shortlistedIds.slice(0, 50),
          likedItemIds: state.likedItemIds.slice(0, 100),
          checklistState: state.checklistState,
          blockedAccount: {
            eurPerYear: sanitizeNullableNumber(state.blockedAccount.eurPerYear),
            eurToInrRate: sanitizeNullableNumber(state.blockedAccount.eurToInrRate),
            bufferPercent: sanitizeNullableNumber(state.blockedAccount.bufferPercent),
            apsFeeInr: sanitizeNullableNumber(state.blockedAccount.apsFeeInr),
            visaFeeInr: sanitizeNullableNumber(state.blockedAccount.visaFeeInr),
          },
          updatedAt: serverTimestamp(),
        });
        setCloudSyncStatus('synced');
      } catch (err) {
        setCloudSyncStatus('error');
        handleFirestoreError(err, OperationType.WRITE, dossierPath);
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [authReady, user, state]);

  const signUpWithEmail = useCallback(async (fullName: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (fullName.trim()) {
        await updateProfile(cred.user, { displayName: fullName.trim() });
      }
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, studentName: fullName.trim() || prev.profile.studentName },
      }));
      return { ok: true as const };
    } catch (err) {
      return { ok: false as const, error: mapFirebaseAuthError(err) };
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { ok: true as const };
    } catch (err) {
      return { ok: false as const, error: mapFirebaseAuthError(err) };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { ok: true as const };
    } catch (err) {
      return { ok: false as const, error: mapFirebaseAuthError(err) };
    }
  }, []);

  const logOut = useCallback(async () => {
    await signOut(auth);
  }, []);

  const updateProfileFields = (patch: Partial<StudentProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }));
  };

  const toggleShortlist = (programId: string) => {
    setState((prev) => {
      const exists = prev.shortlistedIds.includes(programId);
      return {
        ...prev,
        shortlistedIds: exists
          ? prev.shortlistedIds.filter((id) => id !== programId)
          : [...prev.shortlistedIds, programId],
      };
    });
  };

  const toggleLike = (itemId: string) => {
    setState((prev) => {
      const exists = prev.likedItemIds.includes(itemId);
      return {
        ...prev,
        likedItemIds: exists
          ? prev.likedItemIds.filter((id) => id !== itemId)
          : [...prev.likedItemIds, itemId],
      };
    });
  };

  const toggleChecklistItem = (itemId: string) => {
    setState((prev) => {
      const current = prev.checklistState[itemId] ?? { completed: false, note: '' };
      return {
        ...prev,
        checklistState: {
          ...prev.checklistState,
          [itemId]: { ...current, completed: !current.completed },
        },
      };
    });
  };

  const updateChecklistNote = (itemId: string, note: string) => {
    setState((prev) => {
      const current = prev.checklistState[itemId] ?? { completed: false, note: '' };
      return {
        ...prev,
        checklistState: {
          ...prev.checklistState,
          [itemId]: { ...current, note },
        },
      };
    });
  };

  const updateBlockedAccount = (patch: Partial<BlockedAccountConfig>) => {
    setState((prev) => ({
      ...prev,
      blockedAccount: { ...prev.blockedAccount, ...patch },
    }));
  };

  const submitConsultationInquiry = async (
    inquiryInput: Omit<ConsultationBooking, 'id' | 'submittedAt'>
  ): Promise<ConsultationBooking> => {
    const inquiryId = `EV-${Date.now().toString(36).toUpperCase()}`;
    const inquiryPath = `inquiries/${inquiryId}`;

    try {
      await setDoc(doc(db, 'inquiries', inquiryId), {
        userId: user?.uid ?? '',
        studentName: inquiryInput.parentOrStudentName.trim().slice(0, 120),
        applicantRole: inquiryInput.applicantRole,
        email: inquiryInput.email.trim().slice(0, 160),
        phone: inquiryInput.phone.trim().slice(0, 32),
        destinationCountry: inquiryInput.destinationCountry,
        targetIntake: inquiryInput.targetIntake.slice(0, 60),
        preferredCounselor: inquiryInput.preferredCounselor,
        message: inquiryInput.primaryQuestion.trim().slice(0, 1500),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, inquiryPath);
    }

    const savedBooking: ConsultationBooking = {
      ...inquiryInput,
      id: inquiryId,
      submittedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, booking: savedBooking }));
    return savedBooking;
  };

  const clearBooking = () => {
    setState((prev) => ({ ...prev, booking: null }));
  };

  const resetAllData = () => {
    setState(DEFAULT_DOSSIER_STATE);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage removal errors
    }
  };

  const downloadDossierMarkdown = () => {
    const grade = calculateBavarianGrade(state.profile);
    const shortlistedPrograms = PUBLIC_UNIVERSITY_PROGRAMS.filter((p) =>
      state.shortlistedIds.includes(p.id)
    );
    const completedCount = CHECKLIST_ITEMS.filter(
      (item) => state.checklistState[item.id]?.completed
    ).length;

    const eurPerYear = state.blockedAccount.eurPerYear ?? 0;
    const fxRate = state.blockedAccount.eurToInrRate ?? 0;
    const bufferPct = state.blockedAccount.bufferPercent ?? 0;
    const apsFee = state.blockedAccount.apsFeeInr ?? 0;
    const visaFee = state.blockedAccount.visaFeeInr ?? 0;

    const baseInr = eurPerYear * fxRate;
    const bufferInr = baseInr * (bufferPct / 100);
    const totalFinancialInr = baseInr + bufferInr + apsFee + visaFee;

    const lines: string[] = [
      '# EuroVidya Study Abroad — My Shortlist & Readiness Summary',
      `Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      `Advisory Contact: +91 6300018300 | info@eurovidya.com`,
      '',
      '## 1. Academic & German Grade Audit',
      `- Applicant: ${state.profile.studentName || user?.displayName || 'Not entered yet'}`,
      `- Target Track: ${state.profile.targetDegree || 'Not selected'} (${state.profile.targetField || 'Not selected'})`,
      `- Input Score: ${
        state.profile.obtainedScore !== null && state.profile.maxScore !== null && state.profile.minPassScore !== null
          ? `${state.profile.obtainedScore} / ${state.profile.maxScore} (Min Pass: ${state.profile.minPassScore})`
          : 'Not entered yet'
      }`,
      `- Converted German Grade: ${
        grade.isValid ? `${grade.roundedGrade.toFixed(1)} (${grade.classification})` : 'Pending valid input'
      }`,
      `- Degree Duration: ${
        state.profile.degreeDuration
          ? `${state.profile.degreeDuration}-Year Bachelor’s (${state.profile.degreeDuration === 4 ? '240 credits equivalent' : '180 credits equivalent'})`
          : 'Not selected'
      }`,
      `- English Proficiency: ${state.profile.ieltsScore !== null ? `IELTS ${state.profile.ieltsScore.toFixed(1)}` : 'Not entered'} | German Level: ${state.profile.germanLevel || 'Not selected'}`,
      `- APS Status: ${state.profile.apsStatus || 'Not selected'} | Backlogs: ${state.profile.backlogs ?? 'Not entered'}`,
      '',
      '## 2. Shortlisted European Public Programs',
    ];

    if (shortlistedPrograms.length === 0) {
      lines.push('- No programs shortlisted yet.');
    } else {
      shortlistedPrograms.forEach((prog, idx) => {
        const tier = evaluateProgramMatch(prog, grade.roundedGrade, grade.isValid);
        lines.push(
          `${idx + 1}. **${prog.university} (${prog.country}) — ${prog.programName}** (${prog.degreeAward}, ${prog.city})`,
          `   - Match Assessment: ${tier} | Historical Cutoff: ${prog.historicalCutoff ? prog.historicalCutoff.toFixed(1) : 'Open Admission (No Cutoff)'} | Channel: ${prog.applicationChannel}`,
          `   - Tuition: €${prog.tuitionPerSemesterEur}/sem + €${prog.semesterContributionEur}/sem contribution | Deadlines: Winter ${prog.winterDeadline} / Summer ${prog.summerDeadline}`
        );
      });
    }

    lines.push(
      '',
      `## 3. Liked Items (${state.likedItemIds.length})`,
      state.likedItemIds.length > 0
        ? state.likedItemIds.map((id) => `- ${id}`).join('\n')
        : '- No liked items recorded yet.',
      '',
      '## 4. Financial Subsistence Plan (Germany Blocked Account)',
      eurPerYear > 0 && fxRate > 0
        ? `- Annual Blocked Deposit: €${eurPerYear.toLocaleString('en-IN')} (€${Math.round(eurPerYear / 12)}/month)\n- Reference FX Rate: ₹${fxRate.toFixed(2)} / EUR + ${bufferPct}% wire buffer\n- Estimated Total Cash Outlay (Blocked Account + APS + VFS Visa): ₹${Math.round(totalFinancialInr).toLocaleString('en-IN')}`
        : '- Blocked Account figures not entered yet.',
      '',
      `## 5. Legal & Document Readiness (${completedCount} of ${CHECKLIST_ITEMS.length} Completed)`
    );

    CHECKLIST_PHASES.forEach((phase) => {
      lines.push(`### ${phase.title} (${phase.window})`);
      CHECKLIST_ITEMS.filter((i) => i.phase === phase.id).forEach((item) => {
        const itemState = state.checklistState[item.id];
        const mark = itemState?.completed ? '[x]' : '[ ]';
        const noteText = itemState?.note ? ` — Note: ${itemState.note}` : '';
        lines.push(`- ${mark} ${item.title}${noteText}`);
      });
    });

    if (state.booking) {
      lines.push(
        '',
        '## 6. Consultation Request',
        `- Reference: ${state.booking.id} | Contact: ${state.booking.parentOrStudentName} (${state.booking.applicantRole})`,
        `- Destination: ${state.booking.destinationCountry} | Target Intake: ${state.booking.targetIntake}`,
        `- Preferred Advisor: ${state.booking.preferredCounselor}`,
        `- Email: ${state.booking.email} | Phone: ${state.booking.phone}`,
        `- Focus: ${state.booking.primaryQuestion || 'General European Public University Audit'}`
      );
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (state.profile.studentName || 'student').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.href = url;
    link.download = `eurovidya-shortlist-${safeName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    state,
    user,
    authReady,
    cloudSyncStatus,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logOut,
    updateProfile: updateProfileFields,
    toggleShortlist,
    toggleLike,
    toggleChecklistItem,
    updateChecklistNote,
    updateBlockedAccount,
    submitConsultationInquiry,
    clearBooking,
    resetAllData,
    downloadDossierMarkdown,
  };
}
