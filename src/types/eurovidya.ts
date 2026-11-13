export type ScreenId =
  | 'overview'
  | 'tuition-free'
  | 'calculator'
  | 'courses'
  | 'scholarships'
  | 'living'
  | 'timeline'
  | 'checklist'
  | 'contact';

export type StudyCountry = 'Germany' | 'France' | 'Ireland' | 'Netherlands' | 'Austria';

export type GradingScale = 'cgpa10' | 'gpa4' | 'percentage';

export type DegreeDuration = 3 | 4;

export type GermanLanguageLevel = 'None' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface EuropeanDestination {
  id: string;
  country: StudyCountry;
  tagline: string;
  tuitionSummary: string;
  financialProof: string;
  postStudyVisa: string;
  partTimeWork: string;
  keyPortal: string;
  officialSourceLabel: string;
  imageUrl: string;
  highlights: string[];
}

export interface DaadFaqItem {
  id: string;
  category: 'Admissions' | 'APS Verification' | 'Blocked Account' | 'Work & Stay-Back';
  question: string;
  answer: string;
  officialReference: string;
}

export interface TuitionFreeUniversity {
  id: string;
  name: string;
  city: string;
  state: string;
  institutionType: 'Technical University (TU9)' | 'Applied Sciences (UAS)' | 'Public Research University';
  tuitionStatus: 'Tuition-Free (€0 Tuition)' | 'Non-EU Fee Exception';
  semesterFeeRange: string;
  applicationChannel: string;
  englishProgramsHighlight: string;
  notes: string;
}

export interface ScholarshipProgram {
  id: string;
  name: string;
  provider: string;
  country: StudyCountry | 'Europe-Wide';
  degreeLevel: 'Masters' | 'Bachelors & Masters' | 'Masters & PhD';
  fundingSummary: string;
  eligibility: string;
  typicalDeadline: string;
  notes: string;
}

export interface IntakeMilestone {
  id: string;
  intake: 'Winter Intake (October Start)' | 'Summer Intake (April Start)';
  timingWindow: string;
  title: string;
  description: string;
  actionTip: string;
}

export interface StudentProfile {
  studentName: string;
  targetDegree: 'Bachelors' | 'Masters' | '';
  targetField:
    | 'Computer Science & AI'
    | 'Engineering & Mobility'
    | 'Management & Economics'
    | 'Natural Sciences'
    | '';
  gradingScale: GradingScale | '';
  maxScore: number | null;
  minPassScore: number | null;
  obtainedScore: number | null;
  degreeDuration: DegreeDuration | null;
  ieltsScore: number | null;
  germanLevel: GermanLanguageLevel | '';
  backlogs: number | null;
  apsStatus: 'Not Started' | 'Applied' | 'Verified' | '';
}

export interface BavarianCalculationResult {
  isEmpty: boolean;
  isValid: boolean;
  errorMessage?: string;
  exactGrade: number;
  roundedGrade: number;
  classification: 'Very Good' | 'Good' | 'Satisfactory' | 'Sufficient' | 'Below Passing' | 'Pending Input';
  classificationEnglish: string;
  ectsNote: string;
  hasEctsGapRisk: boolean;
  apsAdvisory: string;
}

export type UniversityGroup = 'TU9' | 'UAS7' | 'Public Research' | 'European Public';

export type AdmissionType = 'Open Admission (No Cutoff)' | 'Grade-Cutoff Admission' | 'Selective / Portfolio';

export interface UniversityProgram {
  id: string;
  country: StudyCountry;
  university: string;
  shortName: string;
  group: UniversityGroup;
  city: string;
  state: string;
  programName: string;
  degreeLevel: 'Bachelors' | 'Masters';
  degreeAward: string;
  field: 'Computer Science & AI' | 'Engineering & Mobility' | 'Management & Economics' | 'Natural Sciences';
  language: 'English' | 'German' | 'Bilingual';
  admissionType: AdmissionType;
  historicalCutoff: number | null;
  ectsRequired: number;
  tuitionPerSemesterEur: number;
  semesterContributionEur: number;
  tuitionNote: string;
  applicationChannel: string;
  winterDeadline: string;
  summerDeadline: string;
  englishRequirement: string;
  germanRequirement: string;
  notes: string;
}

export type ChecklistPhaseId = 'aps' | 'uniassist' | 'blocked-account' | 'visa';

export interface ChecklistItemDef {
  id: string;
  phase: ChecklistPhaseId;
  title: string;
  detail: string;
  leadTime: string;
  mandatoryFor: string;
}

export interface ChecklistItemState {
  completed: boolean;
  note: string;
}

export interface BlockedAccountConfig {
  eurPerYear: number | null;
  eurToInrRate: number | null;
  bufferPercent: number | null;
  apsFeeInr: number | null;
  visaFeeInr: number | null;
}

export interface ConsultationBooking {
  id: string;
  parentOrStudentName: string;
  applicantRole: 'Student' | 'Parent / Guardian' | 'Both Attending' | '';
  email: string;
  phone: string;
  destinationCountry: StudyCountry | 'Multiple European Countries' | '';
  targetIntake: string;
  preferredCounselor:
    | 'General Advisory (info@eurovidya.com)'
    | 'Kumar Swamy (kumarswamy@eurovidya.com)'
    | 'Sanjay (sanjay@eurovidya.com)'
    | '';
  primaryQuestion: string;
  submittedAt: string;
}

export interface DossierStoreState {
  profile: StudentProfile;
  shortlistedIds: string[];
  likedItemIds: string[];
  checklistState: Record<string, ChecklistItemState>;
  blockedAccount: BlockedAccountConfig;
  booking: ConsultationBooking | null;
}
