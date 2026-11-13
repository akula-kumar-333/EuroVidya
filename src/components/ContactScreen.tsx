import { CheckCircle2, Loader2, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ConsultationBooking, StudyCountry } from '../types/eurovidya';

interface ContactScreenProps {
  onSubmitInquiry: (
    inquiry: Omit<ConsultationBooking, 'id' | 'submittedAt'>
  ) => Promise<ConsultationBooking>;
}

export function ContactScreen({ onSubmitInquiry }: ContactScreenProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<ConsultationBooking['applicantRole']>('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<StudyCountry | 'Multiple European Countries' | ''>('');
  const [intake, setIntake] = useState('');
  const [counselor, setCounselor] = useState<ConsultationBooking['preferredCounselor']>('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<ConsultationBooking | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (cleanName.length < 2) {
      setError('Please enter your full name so our advisors know whom to address.');
      return;
    }
    if (!role) {
      setError('Please select who will attend the consultation.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (cleanPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile or WhatsApp number.');
      return;
    }
    if (!country) {
      setError('Please select your target European country.');
      return;
    }
    if (!intake) {
      setError('Please select your preferred semester intake.');
      return;
    }
    if (!counselor) {
      setError('Please select your preferred EuroVidya advisor.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const saved = await onSubmitInquiry({
        parentOrStudentName: cleanName,
        applicantRole: role,
        email: cleanEmail,
        phone: cleanPhone,
        destinationCountry: country,
        targetIntake: intake,
        preferredCounselor: counselor,
        primaryQuestion: message.trim(),
      });
      setSubmittedRecord(saved);
      setName('');
      setRole('');
      setEmail('');
      setPhone('');
      setCountry('');
      setIntake('');
      setCounselor('');
      setMessage('');
    } catch {
      setError('Unable to send your consultation request right now. Please email info@eurovidya.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-[#D9E2E8]">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
          Direct Student &amp; Parent Advisory
        </p>
        <h1 className="mt-1.5 font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#173B57] text-balance">
          Contact EuroVidya &amp; Book a Consultation
        </h1>
        <p className="mt-2 text-base text-[#2D3741] max-w-2xl">
          Reach our counselors directly by phone, WhatsApp, or email, or fill out the empty consultation form below for
          a structured academic and visa review.
        </p>
      </div>

      {/* Interactive Direct Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Call & WhatsApp Card */}
        <div className="bg-white border border-[#D9E2E8] border-t-[3px] border-t-[#167C80] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#167C80]">Phone &amp; WhatsApp Desk</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-[#173B57]">Speak With Our Team</h2>
            <p className="mt-1.5 font-mono text-base font-semibold text-[#2D3741] tabular-nums">+91 6300018300</p>
            <p className="mt-1 text-xs text-[#667784]">Mon–Sat · 10:00 AM to 7:00 PM IST</p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="tel:+916300018300"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#167C80] hover:bg-[#00696D] text-white text-xs font-semibold rounded transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Call +91 6300018300
            </a>
            <a
              href="https://wa.me/916300018300?text=Hello%20EuroVidya%20team%2C%20I%20would%20like%20guidance%20on%20studying%20in%20Europe."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#173B57] text-[#173B57] hover:bg-[#173B57]/[0.04] text-xs font-semibold rounded transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* General Information Email */}
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#667784]">General Information</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-[#173B57]">Admissions Desk</h2>
            <p className="mt-1.5 font-mono text-sm font-medium text-[#167C80] break-all">info@eurovidya.com</p>
            <p className="mt-1.5 text-xs text-[#667784] leading-relaxed">
              For APS checklists, blocked account queries, document reviews, and general European intakes.
            </p>
          </div>
          <a
            href="mailto:info@eurovidya.com?subject=EuroVidya%20European%20Education%20Inquiry"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#173B57] hover:bg-[#00253E] text-white text-xs font-semibold rounded transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Email info@eurovidya.com
          </a>
        </div>

        {/* Advisor: Kumar Swamy */}
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#B88728]">Senior Advisor</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-[#173B57]">Kumar Swamy</h2>
            <p className="mt-1.5 font-mono text-sm font-medium text-[#167C80] break-all">
              kumarswamy@eurovidya.com
            </p>
            <p className="mt-1.5 text-xs text-[#667784] leading-relaxed">
              Specializes in German technical &amp; applied sciences admissions, grade conversion, and credit audits.
            </p>
          </div>
          <a
            href="mailto:kumarswamy@eurovidya.com?subject=Academic%20Consultation%20Request%20-%20Kumar%20Swamy"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-[1.5px] border-[#173B57] text-[#173B57] hover:bg-[#173B57]/[0.04] text-xs font-semibold rounded transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Email Kumar Swamy
          </a>
        </div>

        {/* Advisor: Sanjay */}
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#B88728]">Senior Advisor</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-[#173B57]">Sanjay</h2>
            <p className="mt-1.5 font-mono text-sm font-medium text-[#167C80] break-all">sanjay@eurovidya.com</p>
            <p className="mt-1.5 text-xs text-[#667784] leading-relaxed">
              Specializes in European destinations (France, Ireland, Netherlands, Austria), visas, and parent briefings.
            </p>
          </div>
          <a
            href="mailto:sanjay@eurovidya.com?subject=European%20Study%20Consultation%20-%20Sanjay"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-[1.5px] border-[#173B57] text-[#173B57] hover:bg-[#173B57]/[0.04] text-xs font-semibold rounded transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Email Sanjay
          </a>
        </div>
      </div>

      {/* Consultation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white border border-[#D9E2E8] rounded-lg p-6 md:p-8 shadow-[0_1px_3px_rgba(23,59,87,0.05)]">
          <div className="pb-5 border-b border-[#D9E2E8]">
            <h2 className="font-display text-xl font-semibold text-[#173B57]">Student Consultation Form</h2>
            <p className="mt-1 text-sm text-[#667784]">
              Enter your academic details and target European country below. Your request is saved securely for our
              counseling team.
            </p>
          </div>

          {submittedRecord ? (
            <div className="mt-6 space-y-5">
              <div className="p-5 rounded-lg bg-[#E6F2F1] border border-[#167C80]/30 flex items-start gap-3.5">
                <CheckCircle2 className="w-6 h-6 text-[#167C80] shrink-0 mt-0.5" />
                <div className="space-y-1.5 text-sm text-[#173B57]">
                  <p className="font-semibold text-base">Thank you! Your consultation request has been received.</p>
                  <p className="text-xs text-[#2D3741]">
                    Reference ID: <span className="font-mono font-semibold">{submittedRecord.id}</span> · Destination:{' '}
                    <strong>{submittedRecord.destinationCountry}</strong> · Advisor:{' '}
                    <strong>{submittedRecord.preferredCounselor}</strong>
                  </p>
                  <p className="text-xs text-[#2D3741]">
                    Need an urgent answer? Call{' '}
                    <a href="tel:+916300018300" className="text-[#167C80] font-semibold underline">
                      +91 6300018300
                    </a>{' '}
                    or email{' '}
                    <a href="mailto:info@eurovidya.com" className="text-[#167C80] font-semibold underline">
                      info@eurovidya.com
                    </a>
                    .
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSubmittedRecord(null)}
                className="px-4 py-2 border border-[#D9E2E8] rounded text-sm font-semibold text-[#173B57] hover:bg-[#EAF2F5] cursor-pointer"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                    Student or Parent Full Name
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
                  />
                </div>

                <div>
                  <label htmlFor="contactRole" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                    Who Is Attending the Consultation?
                  </label>
                  <select
                    id="contactRole"
                    value={role}
                    onChange={(e) => setRole(e.target.value as ConsultationBooking['applicantRole'])}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
                  >
                    <option value="">Select attendees...</option>
                    <option value="Both Attending">Student &amp; Parents Together</option>
                    <option value="Student">Student Only</option>
                    <option value="Parent / Guardian">Parent / Guardian Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                    Mobile / WhatsApp Number
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="contactCountry" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                    Target Country
                  </label>
                  <select
                    id="contactCountry"
                    value={country}
                    onChange={(e) => setCountry(e.target.value as StudyCountry | 'Multiple European Countries' | '')}
                    className="w-full px-3 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
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
                  <label htmlFor="contactIntake" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                    Preferred Intake
                  </label>
                  <select
                    id="contactIntake"
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
                  >
                    <option value="">Select intake...</option>
                    <option value="Winter 2027 (October)">Winter 2027 (October)</option>
                    <option value="Summer 2027 (April)">Summer 2027 (April)</option>
                    <option value="Winter 2028 (October)">Winter 2028 (October)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contactAdvisor" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                    Preferred Advisor
                  </label>
                  <select
                    id="contactAdvisor"
                    value={counselor}
                    onChange={(e) => setCounselor(e.target.value as ConsultationBooking['preferredCounselor'])}
                    className="w-full px-3 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80]"
                  >
                    <option value="">Select advisor...</option>
                    <option value="General Advisory (info@eurovidya.com)">General Advisory (info@eurovidya.com)</option>
                    <option value="Kumar Swamy (kumarswamy@eurovidya.com)">Kumar Swamy (kumarswamy@eurovidya.com)</option>
                    <option value="Sanjay (sanjay@eurovidya.com)">Sanjay (sanjay@eurovidya.com)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contactMessage" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                  Your Academic Profile &amp; Questions
                </label>
                <textarea
                  id="contactMessage"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your degree, CGPA/percentage, IELTS/German score, and any questions about admissions, APS, or Blocked Accounts..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded text-sm text-[#2D3741] focus:outline-none focus:border-[#167C80] focus:ring-[3px] focus:ring-[#167C80]/15"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs font-medium text-[#BA1A1A]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#167C80] hover:bg-[#00696D] disabled:opacity-60 text-white text-sm font-semibold rounded transition-colors cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Consultation Request
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Clear What Happens Next */}
        <aside className="lg:col-span-4 bg-[#EAF2F5] border border-[#D9E2E8] rounded-lg p-6 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#167C80]">What Happens Next</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-[#173B57]">
              How Our Counselors Review Your Inquiry
            </h3>
          </div>

          <ol className="space-y-4 text-sm text-[#2D3741]">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-white border border-[#D9E2E8] font-mono text-xs font-semibold text-[#173B57] flex items-center justify-center shrink-0">
                01
              </span>
              <span>
                <strong>Academic Parity Check:</strong> We verify your Indian degree duration, German grade, and
                subject credits before recommending programs.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-white border border-[#D9E2E8] font-mono text-xs font-semibold text-[#173B57] flex items-center justify-center shrink-0">
                02
              </span>
              <span>
                <strong>Transparent Cost Breakdown:</strong> You receive exact semester fees and living proof mandates
                (such as Germany’s €11,904/yr Blocked Account).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-white border border-[#D9E2E8] font-mono text-xs font-semibold text-[#173B57] flex items-center justify-center shrink-0">
                03
              </span>
              <span>
                <strong>Joint Family Call:</strong> Parents are welcome to join every call to clarify visa rules and
                part-time work rights.
              </span>
            </li>
          </ol>
        </aside>
      </div>
    </div>
  );
}
