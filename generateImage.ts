import { useState, useEffect, useCallback } from 'react';
import { Zap, Clock, ChevronRight, Plus, Building2, Trash2, Loader2, Sparkles } from 'lucide-react';
import ProspectSetup from './components/ProspectSetup';
import ProductSelector from './components/ProductSelector';
import MockupViewer from './components/MockupViewer';
import { supabase } from './lib/supabase';
import { analyzeCompany, type Research } from './lib/analyzeCompany';
import type { Prospect, ProductCategory, AppStep } from './types';

const DEFAULT_PROSPECT: Prospect = {
  company_name: '',
  contact_name: '',
  website_url: '',
  logo_data_url: '',
  primary_color: '#1e3a8a',
  secondary_color: '#3b82f6',
  industry: 'Retail',
  notes: '',
};

const STEP_LABELS: Record<AppStep, string> = {
  setup: 'Prospect Info',
  select: 'Select Product',
  mockups: 'View Mockups',
  history: '',
};

function StepBar({ step }: { step: AppStep }) {
  const steps: AppStep[] = ['setup', 'select', 'mockups'];
  const idx = steps.indexOf(step);
  if (step === 'history') return null;
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            i < idx ? 'bg-green-100 text-green-700' :
            i === idx ? 'bg-taylor-700 text-white shadow-md shadow-taylor-700/20' :
            'bg-gray-100 text-gray-400'
          }`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: i <= idx ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
              {i < idx ? '✓' : i + 1}
            </span>
            {STEP_LABELS[s]}
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

function RecentProspects({ onSelect, onNew }: { onSelect: (p: Prospect) => void; onNew: () => void }) {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data) setProspects(data as Prospect[]);
        setLoading(false);
      });
  }, []);

  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('prospects').delete().eq('id', id);
    setProspects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0,1,2].map(i => (
        <div key={i} className="h-24 rounded-xl shimmer" />
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" /> Recent Prospects
        </h3>
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-taylor-700 text-white text-sm font-semibold hover:bg-taylor-800 transition-colors shadow-md shadow-taylor-700/20"
        >
          <Plus className="w-4 h-4" /> New Prospect
        </button>
      </div>
      {prospects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <div className="text-gray-600 font-medium mb-1">No prospects yet</div>
          <div className="text-gray-400 text-sm mb-4">Start by adding your first prospect.</div>
          <button
            onClick={onNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-taylor-700 text-white text-sm font-semibold hover:bg-taylor-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create First Prospect
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prospects.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="group text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-taylor-300 hover:shadow-md transition-all relative"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: p.primary_color }}
                >
                  {p.logo_data_url ? (
                    <img src={p.logo_data_url} alt={p.company_name} className="w-full h-full object-contain p-1 brightness-0 invert" />
                  ) : (
                    <Building2 className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-sm truncate">{p.company_name}</div>
                  <div className="text-xs text-gray-400">{p.industry}</div>
                  {p.contact_name && <div className="text-xs text-gray-400 truncate">{p.contact_name}</div>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: p.primary_color }} />
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: p.secondary_color }} />
                <div className="ml-auto text-xs text-gray-300 group-hover:text-taylor-500 transition-colors">
                  View mockups →
                </div>
              </div>
              <button
                onClick={(e) => p.id && handleDelete(p.id, e)}
                className="absolute top-2 right-2 w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState<AppStep>('history');
  const [prospect, setProspect] = useState<Prospect>(DEFAULT_PROSPECT);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [research, setResearch] = useState<Research | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Research the prospect (free AI). Returns null on failure -> app falls back
  // to its normal non-AI behavior, so this can never break the flow.
  const runAnalysis = useCallback(async (p: Prospect) => {
    setProspect(p);
    setResearch(null);
    setAnalyzing(true);
    const r = await analyzeCompany(p);
    setResearch(r);
    setAnalyzing(false);
    setStep('select');
  }, []);

  const handleProspectComplete = useCallback(async (p: Prospect) => {
    let saved = p;
    if (p.id) {
      await supabase.from('prospects').update({
        company_name: p.company_name,
        contact_name: p.contact_name,
        website_url: p.website_url,
        logo_data_url: p.logo_data_url,
        primary_color: p.primary_color,
        secondary_color: p.secondary_color,
        industry: p.industry,
        notes: p.notes,
      }).eq('id', p.id);
    } else {
      const { data } = await supabase.from('prospects').insert({
        company_name: p.company_name,
        contact_name: p.contact_name,
        website_url: p.website_url,
        logo_data_url: p.logo_data_url,
        primary_color: p.primary_color,
        secondary_color: p.secondary_color,
        industry: p.industry,
        notes: p.notes,
      }).select().maybeSingle();
      if (data) saved = { ...p, id: (data as Prospect).id };
    }
    await runAnalysis(saved);
  }, [runAnalysis]);

  const handleCategorySelect = useCallback((cat: ProductCategory) => {
    setCategory(cat);
    setStep('mockups');
  }, []);

  const handleHistorySelect = useCallback((p: Prospect) => {
    runAnalysis(p);
  }, [runAnalysis]);

  const handleNew = useCallback(() => {
    setProspect(DEFAULT_PROSPECT);
    setResearch(null);
    setStep('setup');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'mockups') {
      setStep('select');
    } else if (step === 'select') {
      setStep('setup');
    } else if (step === 'setup') {
      setRefreshKey((k) => k + 1);
      setStep('history');
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-taylor-950 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => { setRefreshKey(k => k + 1); setStep('history'); }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-taylor-400 to-taylor-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-none">Taylor Corporation</div>
                <div className="text-taylor-400 text-[10px] leading-none mt-0.5">Prospect Mockup Tool</div>
              </div>
            </button>

            <div className="flex items-center gap-4">
              {step !== 'history' && (
                <>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                    <div className="w-2 h-2 rounded-full" style={{ background: prospect.primary_color }} />
                    <span className="text-white/70 text-xs truncate max-w-[120px]">{prospect.company_name || 'New Prospect'}</span>
                  </div>
                  <button
                    onClick={handleBack}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    ← Back
                  </button>
                </>
              )}
              {step === 'history' && (
                <button
                  onClick={handleNew}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4" /> New Prospect
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {analyzing ? (
          <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-taylor-50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-taylor-700 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1.5">Researching {prospect.company_name || 'your prospect'}</h2>
            <p className="text-sm text-gray-500 mb-6">Reading their site and matching Taylor's track record — a few seconds.</p>
            <div className="inline-flex items-center gap-2 text-sm text-taylor-700"><Sparkles className="w-4 h-4" /> Building tailored product ideas…</div>
          </div>
        ) : (
        <>
        {step !== 'history' && <StepBar step={step} />}

        {step === 'history' && (
          <div key={refreshKey} className="animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Prospect Mockup Generator</h1>
              <p className="text-gray-500 max-w-xl mx-auto">
                Enter a prospect's website — AI researches their brand, recommends the Taylor products they'd actually buy, and renders on-brand mockups for your pitch.
              </p>
            </div>
            <RecentProspects key={refreshKey} onSelect={handleHistorySelect} onNew={handleNew} />
          </div>
        )}

        {step === 'setup' && (
          <ProspectSetup
            initial={prospect}
            onComplete={handleProspectComplete}
          />
        )}

        {step === 'select' && (
          <ProductSelector
            companyName={prospect.company_name}
            research={research}
            logo={prospect.logo_data_url}
            onSelect={handleCategorySelect}
          />
        )}

        {step === 'mockups' && category && (
          <MockupViewer
            prospect={prospect}
            category={category}
            research={research}
            onBack={() => setStep('select')}
            onChangeCategory={() => setStep('select')}
          />
        )}
        </>
        )}
      </main>

      <footer className="mt-16 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-taylor-700 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-gray-500">Taylor Corporation Internal Tool</span>
          </div>
          <div className="text-xs text-gray-400">
            A Global Printing Company — Print | Marketing | Packaging | Fulfillment
          </div>
        </div>
      </footer>
    </div>
  );
}
