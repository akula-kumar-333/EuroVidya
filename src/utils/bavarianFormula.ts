import { BavarianCalculationResult, GradingScale, StudentProfile, UniversityProgram } from '../types/eurovidya';

export const SCALE_PRESETS: Record<
  GradingScale,
  { label: string; placeholderMax: string; placeholderMin: string; placeholderObtained: string; step: number; unit: string }
> = {
  cgpa10: {
    label: '10-Point CGPA (e.g., IIT / NIT / VTU / Anna Univ.)',
    placeholderMax: 'e.g. 10',
    placeholderMin: 'e.g. 4.0 or 5.0',
    placeholderObtained: 'e.g. 8.2',
    step: 0.1,
    unit: 'CGPA',
  },
  gpa4: {
    label: '4-Point GPA Scale',
    placeholderMax: 'e.g. 4.0',
    placeholderMin: 'e.g. 2.0',
    placeholderObtained: 'e.g. 3.3',
    step: 0.05,
    unit: 'GPA',
  },
  percentage: {
    label: 'Percentage Scale (0–100%)',
    placeholderMax: 'e.g. 100',
    placeholderMin: 'e.g. 40 or 50',
    placeholderObtained: 'e.g. 78',
    step: 0.5,
    unit: '%',
  },
};

/**
 * Modified Bavarian Formula used by Uni-Assist and German public universities:
 * German Grade = 1 + 3 * ((Max Scale - Obtained Score) / (Max Scale - Minimum Passing Score))
 */
export function calculateBavarianGrade(profile: StudentProfile): BavarianCalculationResult {
  const { maxScore, minPassScore, obtainedScore, degreeDuration, targetDegree, backlogs, apsStatus } = profile;

  if (maxScore === null || minPassScore === null || obtainedScore === null) {
    return {
      isEmpty: true,
      isValid: false,
      exactGrade: 0,
      roundedGrade: 0,
      classification: 'Pending Input',
      classificationEnglish: 'Enter your obtained score, maximum scale, and minimum passing mark to calculate.',
      ectsNote: '',
      hasEctsGapRisk: false,
      apsAdvisory: '',
    };
  }

  if (Number.isNaN(maxScore) || Number.isNaN(minPassScore) || Number.isNaN(obtainedScore)) {
    return {
      isEmpty: false,
      isValid: false,
      errorMessage: 'Please enter valid numbers in all three grade fields.',
      exactGrade: 0,
      roundedGrade: 0,
      classification: 'Below Passing',
      classificationEnglish: 'Incomplete numeric input',
      ectsNote: '',
      hasEctsGapRisk: false,
      apsAdvisory: '',
    };
  }

  if (maxScore <= minPassScore) {
    return {
      isEmpty: false,
      isValid: false,
      errorMessage: 'Maximum scale score must be higher than the minimum passing score.',
      exactGrade: 0,
      roundedGrade: 0,
      classification: 'Below Passing',
      classificationEnglish: 'Invalid scale bounds',
      ectsNote: '',
      hasEctsGapRisk: false,
      apsAdvisory: '',
    };
  }

  if (obtainedScore > maxScore) {
    return {
      isEmpty: false,
      isValid: false,
      errorMessage: `Obtained score (${obtainedScore}) cannot exceed the maximum scale (${maxScore}).`,
      exactGrade: 0,
      roundedGrade: 0,
      classification: 'Below Passing',
      classificationEnglish: 'Invalid score',
      ectsNote: '',
      hasEctsGapRisk: false,
      apsAdvisory: '',
    };
  }

  if (obtainedScore < minPassScore) {
    return {
      isEmpty: false,
      isValid: false,
      errorMessage: `Obtained score (${obtainedScore}) is below your university's passing score (${minPassScore}).`,
      exactGrade: 4.5,
      roundedGrade: 4.5,
      classification: 'Below Passing',
      classificationEnglish: 'Below passing threshold (not eligible for admission)',
      ectsNote: 'Verified passing degree completion is mandatory before APS and university applications.',
      hasEctsGapRisk: true,
      apsAdvisory: 'APS India does not certify incomplete or failed degree transcripts.',
    };
  }

  const rawGrade = 1 + 3 * ((maxScore - obtainedScore) / (maxScore - minPassScore));
  const exactGrade = Math.max(1.0, Math.min(4.0, Number(rawGrade.toFixed(2))));
  const roundedGrade = Math.max(1.0, Math.min(4.0, Math.round(rawGrade * 10) / 10));

  let classification: BavarianCalculationResult['classification'] = 'Sufficient';
  let classificationEnglish = 'Sufficient (Focus on Open-Admission & Applied Sciences programs)';

  if (roundedGrade <= 1.5) {
    classification = 'Very Good';
    classificationEnglish = 'Very Good (Competitive for Top Technical Universities & Grade-Cutoff Programs)';
  } else if (roundedGrade <= 2.5) {
    classification = 'Good';
    classificationEnglish = 'Good (Strong Fit for Most German Public Universities)';
  } else if (roundedGrade <= 3.5) {
    classification = 'Satisfactory';
    classificationEnglish = 'Satisfactory (Target Open-Admission & Applied Sciences Programs)';
  }

  const hasEctsGapRisk = targetDegree === 'Masters' && degreeDuration === 3;
  const ectsNote =
    degreeDuration === null || !targetDegree
      ? 'Select your target degree and Indian degree duration to verify European Credit (ECTS) parity.'
      : hasEctsGapRisk
      ? 'A 3-year Indian Bachelor’s (approx. 180 credits) meets standard Master’s entry at select public universities, but many TU9 engineering Master’s programs require 210–240 credits or a 4-year B.Tech/B.E. Verify subject credit parity before paying application fees.'
      : targetDegree === 'Masters'
      ? 'A 4-year Indian engineering/honours degree typically equates to 240 European Credits (ECTS), satisfying standard German Master’s credit depth without bridge courses.'
      : 'For German Bachelor’s admission, 1 year of recognized Indian university study OR passing JEE Advanced / a Preparatory Foundation Course is typically required alongside Class 12 marks.';

  const backlogCount = backlogs ?? 0;
  const apsAdvisory =
    apsStatus === 'Verified'
      ? 'APS Certificate verified. Bundle the digital certificate PDF and registration number with your university and visa filings.'
      : backlogCount > 4
      ? 'Cleared backlogs do not automatically disqualify APS, but ensure every updated supplementary transcript is included before filing APS India.'
      : 'Apply for APS India 45–60 days ahead of university portals; VFS Global requires an active APS certificate for all Indian student visa filings.';

  return {
    isEmpty: false,
    isValid: true,
    exactGrade,
    roundedGrade,
    classification,
    classificationEnglish,
    ectsNote,
    hasEctsGapRisk,
    apsAdvisory,
  };
}

export type CutoffMatchTier = 'Open Admission' | 'Safe' | 'Target' | 'Reach';

export function evaluateProgramMatch(
  program: UniversityProgram,
  germanGrade: number,
  isGradeValid: boolean
): CutoffMatchTier {
  if (program.admissionType === 'Open Admission (No Cutoff)' || program.historicalCutoff === null) {
    return 'Open Admission';
  }
  if (!isGradeValid) {
    return 'Target';
  }
  const delta = program.historicalCutoff - germanGrade;
  if (delta >= 0.3) return 'Safe';
  if (delta >= -0.1) return 'Target';
  return 'Reach';
}
