
import React, { useState, useMemo } from 'react';
import { 
  Building2, ArrowRight, ArrowLeft, CheckCircle2, 
  Leaf, Info, Factory, Briefcase, ShoppingBag, Truck, HardHat, Cpu, Zap, DollarSign,
  Recycle, TrendingUp
} from 'lucide-react';
import { OnboardingData, Industry, BusinessSize, Location, FleetType } from './types';
import { calculateSustainability } from './services/calculationEngine';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: '',
    industry: Industry.Technology,
    size: BusinessSize.SME,
    location: Location.EU,
    monthlyKWh: 5000,
    wasteVolume: 200,
    fleetType: FleetType.Hybrid,
    sustainableMaterials: 50,
    annualRevenue: 1000000,
    taxBracket: 21,
  });

  const results = useMemo(() => calculateSustainability(formData), [formData]);

  const industryIcons: Record<Industry, React.ReactNode> = {
    [Industry.Manufacturing]: <Factory className="w-6 h-6" />,
    [Industry.Technology]: <Cpu className="w-6 h-6" />,
    [Industry.Retail]: <ShoppingBag className="w-6 h-6" />,
    [Industry.Logistics]: <Truck className="w-6 h-6" />,
    [Industry.Construction]: <HardHat className="w-6 h-6" />,
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isFinished) {
    return <Dashboard data={formData} results={results} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[160px]" />
      </div>

      <div className="w-full max-w-3xl glass rounded-[40px] p-8 md:p-12 shadow-2xl border-white/5 relative overflow-hidden">
        {/* Step Preview Floating Card */}
        {step > 1 && (
          <div className="absolute top-8 right-12 hidden md:flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-right">
              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Score</div>
              <div className="text-2xl font-black">{results.score}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Est. Offset</div>
              <div className="text-2xl font-black">${results.estimatedTaxOffset.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Leaf className="text-slate-950 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">EcoVerify <span className="text-emerald-500">2026</span></h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Step {step} of 3 • {step === 1 ? 'Identity' : step === 2 ? 'Operations' : 'Financials'}</p>
          </div>
        </div>

        {/* Form Steps */}
        <div className="min-h-[400px]">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div>
                <h2 className="text-4xl font-black mb-3">Tell us about <br/> your business.</h2>
                <p className="text-slate-400">We tailor our 2026 ESG models to your specific industry constraints.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder="e.g. Nexus Logistics"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Industry Sector</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.values(Industry).map(ind => (
                      <button
                        key={ind}
                        onClick={() => updateField('industry', ind)}
                        className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                          formData.industry === ind 
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/10' 
                            : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                        }`}
                      >
                        {industryIcons[ind]}
                        <span className="text-[10px] font-bold uppercase">{ind}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div>
                <h2 className="text-4xl font-black mb-3">Usage & Impact.</h2>
                <p className="text-slate-400">Drag to adjust. See your 2026 compliance score update in real-time.</p>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-500"/>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Energy Usage</label>
                    </div>
                    <span className="text-2xl font-black">{formData.monthlyKWh.toLocaleString()} <span className="text-xs text-slate-500 font-medium">kWh/mo</span></span>
                  </div>
                  <input 
                    type="range" min="0" max="50000" step="500" value={formData.monthlyKWh}
                    onChange={(e) => updateField('monthlyKWh', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <Recycle className="w-4 h-4 text-blue-500"/>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Waste Volume</label>
                    </div>
                    <span className="text-2xl font-black">{formData.wasteVolume.toLocaleString()} <span className="text-xs text-slate-500 font-medium">kg/mo</span></span>
                  </div>
                  <input 
                    type="range" min="0" max="10000" step="100" value={formData.wasteVolume}
                    onChange={(e) => updateField('wasteVolume', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Fleet Status</label>
                    <div className="flex flex-col gap-2">
                      {Object.values(FleetType).map(type => (
                        <button
                          key={type}
                          onClick={() => updateField('fleetType', type)}
                          className={`px-4 py-3 rounded-xl border text-left text-sm font-bold transition-all ${
                            formData.fleetType === type 
                              ? 'bg-white/10 border-white/20 text-white' 
                              : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-emerald-500/5 rounded-3xl p-6 border border-emerald-500/10 flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-black text-emerald-500 mb-1">{results.score}%</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time ESG Score</div>
                    <p className="text-[10px] text-slate-600 mt-2">Adjust sliders to optimize your ranking</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div>
                <h2 className="text-4xl font-black mb-3">Financials.</h2>
                <p className="text-slate-400">Final data points to calculate your 2026 tax offset eligibility.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Annual Revenue</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="number" value={formData.annualRevenue}
                        onChange={(e) => updateField('annualRevenue', parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-6 py-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Tax Bracket (%)</label>
                    <input 
                      type="number" value={formData.taxBracket}
                      onChange={(e) => updateField('taxBracket', parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white/20 rounded-2xl"><TrendingUp className="w-6 h-6"/></div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Projected Savings</div>
                        <div className="text-4xl font-black">${results.estimatedTaxOffset.toLocaleString()}</div>
                      </div>
                   </div>
                   <p className="text-sm font-medium opacity-90 leading-relaxed">
                     Based on your current data, you are eligible for the <strong>Level 2 Green Incentive</strong>. 
                     Completing the audit will provide the documentation needed for official filing.
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 mt-12 pt-8 border-t border-white/5">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="flex-1 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-all"
            >
              Back
            </button>
          )}
          <button 
            onClick={step === 3 ? () => setIsFinished(true) : nextStep}
            disabled={step === 1 && !formData.companyName}
            className="flex-[2] py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {step === 3 ? 'Generate Final Report' : 'Continue'}
            {step === 3 ? <CheckCircle2 className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
