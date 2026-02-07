
import React from 'react';
import { Check, X, Shield, Zap, Award } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl glass rounded-3xl overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock Your <span className="text-emerald-500">Official Certification</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-12">
            Go beyond estimation. Get a verified sustainability certificate recognized by EU/US tax authorities for 2026 compliance.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col">
              <div className="mb-6">
                <span className="text-slate-400 font-medium uppercase tracking-wider text-xs">Self Service</span>
                <h3 className="text-2xl font-bold mt-1">Estimator</h3>
                <div className="text-4xl font-bold mt-4">$0 <span className="text-lg text-slate-500 font-normal">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-emerald-500" /> Basic Score Calculation
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-emerald-500" /> Public Recommendations
                </li>
                <li className="flex items-center gap-3 text-slate-500 line-through">
                  Official PDF Certificate
                </li>
                <li className="flex items-center gap-3 text-slate-500 line-through">
                  Tax Credit Verification
                </li>
              </ul>
              <button 
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl border border-slate-700 font-medium text-slate-300 hover:bg-slate-800 transition-all"
              >
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col relative emerald-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full uppercase tracking-widest">
                Recommended
              </div>
              <div className="mb-6">
                <span className="text-emerald-400 font-medium uppercase tracking-wider text-xs">Full Compliance</span>
                <h3 className="text-2xl font-bold mt-1">Verified Pro</h3>
                <div className="text-4xl font-bold mt-4">$299 <span className="text-lg text-slate-400 font-normal">/audit</span></div>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-slate-100">
                  <Check className="w-5 h-5 text-emerald-500" /> Full Smart Audit Report
                </li>
                <li className="flex items-center gap-3 text-slate-100">
                  <Check className="w-5 h-5 text-emerald-500" /> Official EcoVerify Certificate
                </li>
                <li className="flex items-center gap-3 text-slate-100">
                  <Check className="w-5 h-5 text-emerald-500" /> Verified Tax Documentation
                </li>
                <li className="flex items-center gap-3 text-slate-100">
                  <Check className="w-5 h-5 text-emerald-500" /> 1-on-1 ESG Consultation
                </li>
              </ul>
              <button className="w-full py-4 px-6 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all transform hover:scale-[1.02] shadow-lg">
                Unlock Now
              </button>
            </div>
          </div>
          
          <p className="mt-12 text-slate-500 text-sm">
            Note: Stripe API integration for EcoVerify 2026 requires a production environment. 
            Connect your <code>STRIPE_SECRET_KEY</code> in the dashboard settings to go live.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
