import { CheckCircle2, Loader2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ConsultationBooking, StudyCountry } from '../types/eurovidya';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBooking: (
    booking: Omit<ConsultationBooking, 'id' | 'submittedAt'>
  ) => Promise<ConsultationBooking>;
  onClearBooking: () => void;
}

export function BriefingModal({
  isOpen,
  onClose,
  onSaveBooking,
  onClearBooking,
}: BriefingModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<ConsultationBooking['applicantRole']>('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<StudyCountry | 'Multiple European Countries' | ''>('');
  const [intake, setIntake] = useState('');
  const [counselor, setCounselor] = useState<ConsultationBooking['preferredCounselor']>('');
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState<ConsultationBooking | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (cleanName.length < 2) {
      setError('Please enter the student or parent full name.');
      return;
    }
    if (!role) {
      setError('Please select who is attending the consultation.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address for consultation confirmation.');
      return;
    }
    if (cleanPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit Indian or international contact number.');
      return;
    }
    if (!country) {
      setError('Please select your destination country.');
      return;
    }
    if (!intake) {
      setError('Please select your target semester intake.');
      return;
    }
    if (!counselor) {
      setError('Please select your preferred advisor.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const saved = await onSaveBooking({
        parentOrStudentName: cleanName,
        applicantRole: role,
        email: cleanEmail,
        phone: cleanPhone,
        destinationCountry: country,
        targetIntake: intake,
        preferredCounselor: counselor,
        primaryQuestion: question.trim(),
      });
      setJustSubmitted(saved);
    } catch {
      setError('Could not submit request right now. Please call +91 6300018300 or email info@eurovidya.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Schedule Parent and Student Briefing"
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00253E]/45 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-[#D9E2E8] rounded-xl shadow-[0_12px_32px_rgba(23,59,87,0.12)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#D9E2E8] bg-[#EAF2F5] flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
              35-Minute Candid Assessment
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-[#173B57]">
              Parent &amp; Student Academic Briefing
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close briefing dialog"
            className="p-2 rounded bg-white border border-[#D9E2E8] text-[#667784] hover:text-[#173B57] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {justSubmitted ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-lg bg-[#E6F2F1] border border-[#167C80]/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#167C80] shrink-0 mt-0.5" />
              <div className="text-sm text-[#173B57]">
                <p className="font-semibold">Consultation Request Submitted</p>
                <p className="mt-1 text-xs text-[#2D3741]">
                  Reference ID <span className="font-mono font-semibold">{justSubmitted.id}</span> has been saved for{' '}
                  {justSubmitted.destinationCountry} ({justSubmitted.targetIntake}).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setJustSubmitted(null);
                  onClearBooking();
                }}
                className="text-xs font-medium text-[#667784] hover:text-[#BA1A1A] cursor-pointer"
              >
                Clear Local Receipt
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#167C80] hover:bg-[#00696D] text-white text-sm font-semibold rounded cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="briefingName" className="block text-xs font-semibold text-[#173B57] mb-1">
                  Full Name
                </label>
                <input
                  id="briefingName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter parent or student name"
                  className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
                />
              </div>
              <div>
                <label htmlFor="briefingRole" className="block text-xs font-semibold text-[#173B57] mb-1">
                  Attendees
                </label>
                <select
                  id="briefingRole"
                  value={role}
                  onChange={(e) => setRole(e.target.value as ConsultationBooking['applicantRole'])}
                  className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
                >
                  <option value="">Select attendees...</option>
                  <option value="Both Attending">Student &amp; Parents Attending</option>
                  <option value="Parent / Guardian">Parent / Guardian Only</option>
                  <option value="Student">Student Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="briefingEmail" className="block text-xs font-semibold text-[#173B57] mb-1">
                  Email Address
                </label>
                <input
                  id="briefingEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
                />
              </div>
              <div>
                <label htmlFor="briefingPhone" className="block text-xs font-semibold text-[#173B57] mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  id="briefingPhone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded font-mono text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="briefingCountry" className="block text-xs font-semibold text-[#173B57] mb-1">
                  Destination Country
                </label>
                <select
                  id="briefingCountry"
                  value={country}
                  onChange={(e) => setCountry(e.target.value as StudyCountry | 'Multiple European Countries' | '')}
                  className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
                >
                  <option value="">Select country...</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Austria">Austria</option>
                  <option value="Multiple European Countries">Multiple European Countries</option>
                </select>
              </div>
              <div>
                <label htmlFor="briefingIntake" className="block text-xs font-semibold text-[#173B57] mb-1">
                  Target Semester Intake
                </label>
                <select
                  id="briefingIntake"
                  value={intake}
                  onChange={(e) => setIntake(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
                >
                  <option value="">Select intake...</option>
                  <option value="Winter 2027 (Oct)">Winter Semester 2027 (Oct)</option>
                  <option value="Summer 2027 (Apr)">Summer Semester 2027 (Apr)</option>
                  <option value="Winter 2028 (Oct)">Winter Semester 2028 (Oct)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="briefingAdvisor" className="block text-xs font-semibold text-[#173B57] mb-1">
                Preferred Advisor
              </label>
              <select
                id="briefingAdvisor"
                value={counselor}
                onChange={(e) => setCounselor(e.target.value as ConsultationBooking['preferredCounselor'])}
                className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
              >
                <option value="">Select advisor...</option>
                <option value="General Advisory (info@eurovidya.com)">General Advisory (info@eurovidya.com)</option>
                <option value="Kumar Swamy (kumarswamy@eurovidya.com)">Kumar Swamy (kumarswamy@eurovidya.com)</option>
                <option value="Sanjay (sanjay@eurovidya.com)">Sanjay (sanjay@eurovidya.com)</option>
              </select>
            </div>

            <div>
              <label htmlFor="briefingQuestion" className="block text-xs font-semibold text-[#173B57] mb-1">
                Specific Eligibility or Financial Question (Optional)
              </label>
              <textarea
                id="briefingQuestion"
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. 3-year Bachelor credit eligibility, €11,904 Blocked Account remittance, or Irish visa rules..."
                className="w-full px-3 py-2 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs font-medium text-[#BA1A1A]">
                {error}
              </p>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#D9E2E8] rounded text-sm font-medium text-[#2D3741] hover:bg-[#F7F9FA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#167C80] hover:bg-[#00696D] disabled:opacity-60 text-white text-sm font-semibold rounded transition-colors cursor-pointer"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Briefing Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
