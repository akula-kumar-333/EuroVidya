import { Briefcase, Calculator, RotateCcw, Wallet } from 'lucide-react';
import { useState } from 'react';

export function LivingWorkScreen() {
  const [rentEur, setRentEur] = useState('');
  const [foodEur, setFoodEur] = useState('');
  const [insuranceEur, setInsuranceEur] = useState('');
  const [transitMiscEur, setTransitMiscEur] = useState('');
  const [fxRate, setFxRate] = useState('');
  const [hourlyWageEur, setHourlyWageEur] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');

  const parseVal = (v: string): number | null => {
    if (!v.trim()) return null;
    const n = parseFloat(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  const nRent = parseVal(rentEur);
  const nFood = parseVal(foodEur);
  const nIns = parseVal(insuranceEur);
  const nMisc = parseVal(transitMiscEur);
  const nFx = parseVal(fxRate);
  const nWage = parseVal(hourlyWageEur);
  const nHours = parseVal(hoursPerWeek);

  const hasMonthlyExpense = nRent !== null || nFood !== null || nIns !== null || nMisc !== null;
  const totalMonthlyExpenseEur = (nRent ?? 0) + (nFood ?? 0) + (nIns ?? 0) + (nMisc ?? 0);

  const hasIncome = nWage !== null && nHours !== null;
  const monthlyGrossWorkEur = hasIncome ? nWage * nHours * 4.33 : 0;
  const netMonthlyGapEur = hasMonthlyExpense ? totalMonthlyExpenseEur - monthlyGrossWorkEur : 0;

  const handleClear = () => {
    setRentEur('');
    setFoodEur('');
    setInsuranceEur('');
    setTransitMiscEur('');
    setFxRate('');
    setHourlyWageEur('');
    setHoursPerWeek('');
  };

  const handleLoadGermanyBenchmark = () => {
    setRentEur('450');
    setFoodEur('260');
    setInsuranceEur('125');
    setTransitMiscEur('120');
    setFxRate('91.5');
    setHourlyWageEur('13.90');
    setHoursPerWeek('15');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D9E2E8]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">
            Student Budget &amp; Income Planner
          </p>
          <h1 className="mt-1.5 font-display text-2xl md:text-4xl font-semibold tracking-tight text-[#173B57] text-balance">
            Living Costs &amp; Part-Time Work Estimator
          </h1>
          <p className="mt-2 text-base text-[#2D3741] max-w-3xl">
            Enter your expected monthly student expenses and part-time working hours to estimate how much of your
            monthly budget can be offset legally while studying in Germany or Europe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleLoadGermanyBenchmark}
            className="px-3.5 py-2 border border-[#167C80] bg-[#E6F2F1] hover:bg-[#D5EBE9] text-xs font-semibold text-[#173B57] rounded transition-colors cursor-pointer"
          >
            Fill 2026 Germany Reference
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#D9E2E8] bg-white hover:bg-[#EAF2F5] text-xs font-medium text-[#173B57] rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Fields
          </button>
        </div>
      </div>

      {/* Official Statutory Facts Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#167C80]">Germany 2026 Minimum Wage</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold text-[#173B57] tabular-nums">€13.90 / hour</p>
          <p className="mt-1 text-xs text-[#667784]">
            Statutory German minimum wage effective January 2026 (rises to €14.60 in 2027).
          </p>
        </div>
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#167C80]">Tax-Free Mini-Job Cap</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold text-[#173B57] tabular-nums">€603 / month</p>
          <p className="mt-1 text-xs text-[#667784]">
            Monthly earnings up to €603 (2026 limit) are exempt from regular student income tax.
          </p>
        </div>
        <div className="bg-white border border-[#D9E2E8] rounded-lg p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#167C80]">Student Work Allowance</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold text-[#173B57] tabular-nums">140 Full Days</p>
          <p className="mt-1 text-xs text-[#667784]">
            Or 280 half days per calendar year (up to 20 hours/week during lecture semesters).
          </p>
        </div>
      </div>

      {/* Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-[#D9E2E8] rounded-lg p-6 md:p-8 space-y-6 shadow-[0_1px_3px_rgba(23,59,87,0.05)]">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#173B57] flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#167C80]" />
              Monthly Living Expenses (EUR)
            </h2>
            <p className="text-xs text-[#667784] mt-1">
              All fields start empty so you can enter your own target city rent and food estimates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rentEur" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Student Accommodation / Rent (EUR/mo)
              </label>
              <input
                id="rentEur"
                type="number"
                min="0"
                step="10"
                value={rentEur}
                onChange={(e) => setRentEur(e.target.value)}
                placeholder="e.g. 380–650"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
              />
            </div>

            <div>
              <label htmlFor="foodEur" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Groceries &amp; Campus Meals (EUR/mo)
              </label>
              <input
                id="foodEur"
                type="number"
                min="0"
                step="10"
                value={foodEur}
                onChange={(e) => setFoodEur(e.target.value)}
                placeholder="e.g. 220–300"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
              />
            </div>

            <div>
              <label htmlFor="insuranceEur" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Statutory Student Health Insurance (EUR/mo)
              </label>
              <input
                id="insuranceEur"
                type="number"
                min="0"
                step="5"
                value={insuranceEur}
                onChange={(e) => setInsuranceEur(e.target.value)}
                placeholder="e.g. 125"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
              />
            </div>

            <div>
              <label htmlFor="transitMiscEur" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Phone, Internet, Books &amp; Misc (EUR/mo)
              </label>
              <input
                id="transitMiscEur"
                type="number"
                min="0"
                step="10"
                value={transitMiscEur}
                onChange={(e) => setTransitMiscEur(e.target.value)}
                placeholder="e.g. 100–150"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
              />
            </div>
          </div>

          <div className="pt-5 border-t border-[#D9E2E8] space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#173B57] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#167C80]" />
              Part-Time Student Earnings &amp; Exchange Rate
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="hourlyWageEur" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                  Hourly Wage (EUR/hr)
                </label>
                <input
                  id="hourlyWageEur"
                  type="number"
                  min="0"
                  step="0.1"
                  value={hourlyWageEur}
                  onChange={(e) => setHourlyWageEur(e.target.value)}
                  placeholder="e.g. 13.90"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
                />
              </div>

              <div>
                <label htmlFor="hoursPerWeek" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                  Hours / Week (Max 20)
                </label>
                <input
                  id="hoursPerWeek"
                  type="number"
                  min="0"
                  max="20"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  placeholder="e.g. 10–20"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
                />
              </div>

              <div>
                <label htmlFor="livingFxRate" className="block text-xs font-semibold text-[#173B57] mb-1.5">
                  INR per €1 (Optional)
                </label>
                <input
                  id="livingFxRate"
                  type="number"
                  min="1"
                  step="0.5"
                  value={fxRate}
                  onChange={(e) => setFxRate(e.target.value)}
                  placeholder="e.g. 91.5"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E2E8] rounded font-mono text-sm tabular-nums focus:outline-none focus:border-[#167C80]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Output Panel */}
        <aside className="lg:col-span-5 bg-white border border-[#D9E2E8] border-t-[3px] border-t-[#173B57] rounded-lg p-6 space-y-5 shadow-[0_1px_3px_rgba(23,59,87,0.05)]">
          <div className="flex items-center justify-between border-b border-[#D9E2E8] pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#B88728]">Monthly Cash Flow</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-[#173B57]">
                Estimated Living &amp; Work Balance
              </h2>
            </div>
            <Calculator className="w-5 h-5 text-[#173B57] shrink-0" />
          </div>

          {!hasMonthlyExpense && !hasIncome ? (
            <div className="p-6 rounded bg-[#F7F9FA] border border-dashed border-[#D9E2E8] text-center space-y-2">
              <p className="text-sm font-semibold text-[#173B57]">Enter Your Monthly Estimates</p>
              <p className="text-xs text-[#667784] leading-relaxed">
                Type your expected rent, food, insurance, or part-time hours on the left to compute your monthly EUR and
                INR cash flow, or click “Fill 2026 Germany Reference” above.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-baseline">
                <span className="text-[#667784]">Total Monthly Expenses</span>
                <span className="font-mono text-lg font-semibold text-[#173B57] tabular-nums">
                  €{Math.round(totalMonthlyExpenseEur).toLocaleString('en-IN')} / mo
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-[#667784]">Estimated Part-Time Gross Income</span>
                <span className="font-mono text-lg font-semibold text-[#167C80] tabular-nums">
                  €{Math.round(monthlyGrossWorkEur).toLocaleString('en-IN')} / mo
                </span>
              </div>

              <div className="pt-4 border-t border-[#D9E2E8] flex justify-between items-baseline">
                <span className="font-display font-semibold text-[#173B57]">
                  {netMonthlyGapEur <= 0 ? 'Estimated Monthly Surplus' : 'Monthly Funding Needed from Blocked Account'}
                </span>
                <span
                  className={`font-mono text-2xl font-semibold tabular-nums ${
                    netMonthlyGapEur <= 0 ? 'text-[#167C80]' : 'text-[#173B57]'
                  }`}
                >
                  €{Math.abs(Math.round(netMonthlyGapEur)).toLocaleString('en-IN')}
                </span>
              </div>

              {nFx !== null && (
                <div className="p-3.5 rounded bg-[#EAF2F5] border border-[#D9E2E8] text-xs space-y-1 tabular-nums">
                  <p className="font-semibold text-[#173B57]">INR Equivalent (@ ₹{nFx.toFixed(2)} / €1)</p>
                  <p className="text-[#2D3741]">
                    Monthly Expenses: ₹{Math.round(totalMonthlyExpenseEur * nFx).toLocaleString('en-IN')} · Monthly
                    Part-Time Income: ₹{Math.round(monthlyGrossWorkEur * nFx).toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              <p className="text-xs text-[#667784] leading-relaxed">
                Note: Even if you plan to work part-time after arrival, German embassies always require the full €11,904
                annual Blocked Account upfront before issuing your initial student visa.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
