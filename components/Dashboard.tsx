
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Zap, Recycle, Leaf, TrendingUp, Download, Info, Sparkles, 
  ChevronRight, DollarSign, Target, FileText, BarChart3,
  Newspaper, ExternalLink, Globe, AlertCircle
} from 'lucide-react';
import { OnboardingData, SustainabilityResult, NewsArticle } from '../types';
import { getSmartAuditStream } from '../services/geminiService';
import { fetchSustainabilityNews } from '../services/newsService';
import { BASELINE_KWH, BASELINE_WASTE } from '../constants';
import PricingModal from './PricingModal';

interface DashboardProps {
  data: OnboardingData;
  results: SustainabilityResult;
}

const Dashboard: React.FC<DashboardProps> = ({ data, results }) => {
  const [isAuditLoading, setIsAuditLoading] = useState(false);
  const [smartAudit, setSmartAudit] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadNews = async () => {
      try {
        setIsLoadingNews(true);
        const articles = await fetchSustainabilityNews();
        if (isMounted) {
          setNews(articles);
          setNewsError(false);
        }
      } catch (err) {
        if (isMounted) {
          setNewsError(true);
          // newsService already handles fallback to mock, so we only get here on extreme errors
        }
      } finally {
        if (isMounted) setIsLoadingNews(false);
      }
    };
    loadNews();
    return () => { isMounted = false; };
  }, []);

  const handleSmartAudit = async () => {
    setIsAuditLoading(true);
    setSmartAudit("");
    await getSmartAuditStream(data, (text) => {
      setSmartAudit(text);
      setIsAuditLoading(false);
    });
  };

  const benchmarkData = [
    { 
      name: 'Energy (kWh)', 
      Yours: data.monthlyKWh, 
      Industry: BASELINE_KWH[data.industry] || 5000 
    },
    { 
      name: 'Waste (kg)', 
      Yours: data.wasteVolume, 
      Industry: BASELINE_WASTE[data.industry] || 1000 
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-950 text-slate-50">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">Compliance Active</div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {data.companyName} <span className="text-slate-500 font-light text-2xl">| Audit 2026</span>
            </h1>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={() => setShowPricing(true)}
              className="px-6 py-3 glass rounded-xl font-semibold hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Data
            </button>
            <button 
              onClick={() => setShowPricing(true)}
              className="px-6 py-3 bg-emerald-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-lg emerald-glow flex items-center gap-2"
            >
              Get Certified
            </button>
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 glass rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-900" />
                <circle
                  cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={452.39}
                  strokeDashoffset={452.39 - (452.39 * results.score) / 100}
                  className="text-emerald-500 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black">{results.score}</span>
                <span className="text-xs text-slate-500 font-bold uppercase">ESG Score</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 glass rounded-3xl p-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-500"/> Industry Comparison</h3>
                <span className="text-xs text-slate-500">Lower is better for resources</span>
             </div>
             {/* Chart Fix: Defining width and height explicitly to prevent calculation warnings */}
             <div className="w-full min-h-[300px] h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#f8fafc' }}
                      itemStyle={{ fontSize: '12px' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                    <Bar dataKey="Yours" fill="#10b981" radius={[6, 6, 0, 0]} barSize={50} />
                    <Bar dataKey="Industry" fill="#334155" radius={[6, 6, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="glass rounded-3xl p-8 bg-gradient-to-br from-emerald-500/20 to-transparent border-emerald-500/20">
            <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-tighter mb-1">Projected Tax Credit</h3>
            <div className="text-4xl font-black mb-4">
              ${results.estimatedTaxOffset.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-bold">Eligible</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Deadline</span>
                <span className="text-slate-200">Dec 31, 2026</span>
              </div>
            </div>
            <button onClick={() => setShowPricing(true)} className="w-full mt-6 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold transition-all border border-emerald-500/20">
              Claim Incentive
            </button>
          </div>
        </div>

        {/* Audit & Plan Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl p-8 min-h-[450px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg"><Sparkles className="w-5 h-5 text-blue-500"/></div>
                <div>
                  <h3 className="font-bold text-xl">Smart Audit Analysis</h3>
                  <p className="text-xs text-slate-500">Live AI Strategic Intelligence</p>
                </div>
              </div>
              {!smartAudit && (
                <button 
                  onClick={handleSmartAudit}
                  disabled={isAuditLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2"
                >
                  {isAuditLoading ? 'Connecting...' : 'Run Analysis'}
                </button>
              )}
            </div>

            <div className="flex-grow">
              {isAuditLoading && !smartAudit ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-slate-400 animate-pulse font-medium uppercase tracking-widest text-xs">Securing 2026 Regulation Context...</p>
                </div>
              ) : smartAudit ? (
                <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                    {smartAudit}
                  </div>
                  {isAuditLoading && <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1 align-middle"/>}
                </div>
              ) : (
                <div className="h-full border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-10 text-center group hover:border-blue-500/20 transition-all">
                  <FileText className="w-16 h-16 text-slate-800 mb-4 group-hover:text-blue-500/20 transition-colors" />
                  <h4 className="text-slate-400 font-bold mb-2">Detailed Strategic Report</h4>
                  <p className="text-slate-500 text-sm max-w-sm">Connect with our AI engine to receive a prioritized impact analysis of your operations.</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-3xl p-8">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500"/> ESG Action Plan
            </h3>
            <div className="space-y-4">
              {results.recommendations.map((rec, i) => (
                <div key={i} className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all cursor-default">
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Recommendation 0{i+1}</div>
                  <p className="text-sm text-slate-200 font-medium leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-500 leading-relaxed italic">
              "Actionable items are calibrated for {data.industry} standards in the {data.location} region."
            </div>
          </div>
        </div>

        {/* Live Market Intelligence Row */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Newspaper className="w-5 h-5 text-emerald-500"/>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xl">Live Market Intelligence</h3>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Market Open</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Real-time global ESG policy updates</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
            {isLoadingNews ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-slate-800 rounded"></div>
                    <div className="h-6 w-full bg-slate-800 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                  </div>
                  <div className="h-4 w-20 bg-slate-800 rounded self-end"></div>
                </div>
              ))
            ) : (newsError || news.length === 0) ? (
              <div className="col-span-1 md:col-span-3 glass rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-red-500/20">
                <AlertCircle className="w-10 h-10 text-red-500/50" />
                <div>
                  <h4 className="text-slate-300 font-bold">Market news temporarily unavailable</h4>
                  <p className="text-slate-500 text-sm">Please check back in a few moments for live regulatory updates.</p>
                </div>
              </div>
            ) : (
              news.map((article, i) => (
                <article key={i} className="glass rounded-2xl p-6 hover:bg-white/5 transition-all group flex flex-col justify-between h-52 border border-white/5 hover:border-emerald-500/30">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{article.source.name}</span>
                      <span className="text-[10px] text-slate-500">{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h4 className="font-bold text-slate-100 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-tight">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors self-end group/link mt-4"
                  >
                    Read More
                    <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
};

export default Dashboard;
