import { DaadFaqItem } from '../types/eurovidya';

export const DAAD_FAQS: DaadFaqItem[] = [
  {
    id: 'faq-tuition-free',
    category: 'Admissions',
    question: 'Are public universities in Germany really tuition-free for international and Indian students?',
    answer:
      'Yes. In 15 of Germany’s 16 federal states, public universities charge €0 tuition fees for consecutive Bachelor’s and Master’s degree programs regardless of nationality. Students pay only a mandatory semester student contribution (typically €72 to €365 per semester), which usually covers student union services and a regional public transit ticket. Only two official exceptions apply: public universities in the state of Baden-Württemberg charge €1,500 per semester to non-EU students, and Technical University of Munich (TUM) charges non-EU tuition fees unless a merit waiver is granted.',
    officialReference: 'DAAD Official Tuition Fee Guidelines & German Rectors’ Conference (HRK)',
  },
  {
    id: 'faq-aps-mandatory',
    category: 'APS Verification',
    question: 'Is the APS India certificate mandatory before applying to universities or a German student visa?',
    answer:
      'Yes. According to APS India and the German Embassy in New Delhi, all Indian applicants holding Indian school or university qualifications must obtain an Academic Evaluation Centre (APS) certificate before applying for a German National Student Visa (Type D). Many German public universities and Uni-Assist also ask for the APS certificate during admission or enrollment. Note that an APS certificate verifies the authenticity of your academic documents—it does not replace a university admission letter.',
    officialReference: 'APS India (aps-india.de) & German Federal Foreign Office',
  },
  {
    id: 'faq-aps-timeline',
    category: 'APS Verification',
    question: 'When should I apply for APS India, and how long does verification take?',
    answer:
      'Submit your APS India application at least 8 to 10 weeks before your earliest university or visa deadline. Official processing typically takes 45 to 60 days after document receipt and ₹18,000 fee confirmation. Ensure your university registrar or department professor’s official institutional email address is available and your Class 10, Class 12, and university marksheets are verifiable via DigiLocker or official board portals.',
    officialReference: 'APS India Processing Advisory',
  },
  {
    id: 'faq-blocked-account-amount',
    category: 'Blocked Account',
    question: 'How much money must be deposited into a German Blocked Account for a student visa?',
    answer:
      'The German Federal Foreign Office requires proof of financial subsistence equal to €11,904 per academic year (€992 per month for 12 months) for student visa applications. This statutory amount is linked to Germany’s federal student financial aid benchmark. You can only withdraw up to €992 per month after opening a German bank account and registering your address in Germany. Regulated digital providers accepted by German embassies include Expatrio, Fintiba, and Coracle.',
    officialReference: 'German Federal Foreign Office (Auswärtiges Amt) 2025/2026',
  },
  {
    id: 'faq-education-loan',
    category: 'Blocked Account',
    question: 'Can an Indian education loan sanction letter replace the Blocked Account at VFS Global?',
    answer:
      'No. A standard Indian bank education loan sanction letter alone is not accepted in place of a Blocked Account at VFS Global India. However, you can use your disbursed Indian education loan funds to wire the €11,904 statutory deposit directly into a BaFin-regulated German Blocked Account provider under RBI Liberalised Remittance Scheme (LRS) education codes, after which your provider issues the Official Blocking Confirmation PDF required for your visa.',
    officialReference: 'German Missions in India — National Visa Checklist',
  },
  {
    id: 'faq-german-language',
    category: 'Admissions',
    question: 'Do I need to know the German language to study an English-taught degree in Germany?',
    answer:
      'For strictly English-taught Master’s and Bachelor’s programs, German language proficiency is usually not required for university admission or your student visa—a valid IELTS Academic or TOEFL iBT score is sufficient. However, DAAD strongly recommends learning A1 or A2 German before arrival because everyday housing contracts, city registration, part-time mini-jobs, and internships rely heavily on basic German.',
    officialReference: 'DAAD International Programmes Database',
  },
  {
    id: 'faq-open-vs-cutoff',
    category: 'Admissions',
    question: 'What is the difference between Open Admission (No Cutoff) and Grade-Cutoff programs?',
    answer:
      'Open Admission programs do not impose a fixed grade cutoff or seat cap, meaning every applicant who fulfills all subject-credit (ECTS), degree, and language prerequisites is eligible for admission. Grade-Cutoff programs have limited seats and rank applicants primarily by their converted German GPA using the Modified Bavarian Formula (where 1.0 is the highest possible score and 4.0 is the lowest passing grade).',
    officialReference: 'DAAD Admission & Selection Guide',
  },
  {
    id: 'faq-part-time-stayback',
    category: 'Work & Stay-Back',
    question: 'How many hours can international students work part-time in Germany, and what happens after graduation?',
    answer:
      'Non-EU international students holding a German student residence permit may work up to 140 full days or 280 half days per calendar year—or up to 20 hours per week during academic lecture periods. From January 2026, Germany’s statutory minimum wage is €13.90 per hour (and the tax-free mini-job threshold is €603 per month). After graduating from a recognized German university, you qualify for an 18-month Job Seeker Residence Permit to find full-time employment in your field.',
    officialReference: 'Make it in Germany & Federal Ministry of Labour (BMAS)',
  },
];
