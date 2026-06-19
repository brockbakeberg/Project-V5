import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Download, Info, Sparkles, CheckCircle, ExternalLink } from 'lucide-react';
import type { Prospect, ProductCategory } from '../types';
import type { Research } from '../lib/analyzeCompany';
import { PORTFOLIO, SOLUTION_LINKS } from '../lib/portfolio';

type Setting = 'shelf' | 'storefront' | 'salesfloor' | 'mailbox' | 'desk' | 'warehouse';
import { PostcardMockup, SelfMailerMockup, LetterMockup } from './mockups/DirectMail';
import { LabelMockup, ShrinkSleeveMockup, CartonMockup } from './mockups/Packaging';
import { InStoreMockup, TradeBannerMockup, WindowClingMockup } from './mockups/Signage';
import { BrochureMockup, SellSheetMockup, CatalogMockup } from './mockups/CommercialPrint';
import { NewLocationKitMockup, RebrandKitMockup, CampaignPackMockup } from './mockups/Fulfillment';
import { StatementMockup, EmployeeCommsMockup, TaxDocMockup } from './mockups/CustomerComms';

interface Props {
  prospect: Prospect;
  category: ProductCategory;
  research?: Research | null;
  onBack: () => void;
  onChangeCategory: () => void;
}

interface TemplateInfo {
  id: string;
  label: string;
  description: string;
  tip: string;
  Component: React.ComponentType<import('./mockups/types').BrandProps>;
  proof?: string;
  setting?: Setting;
  ai?: boolean;
}

const CATEGORY_TEMPLATES: Record<ProductCategory, TemplateInfo[]> = {
  'direct-mail': [
    {
      id: 'postcard',
      label: 'Postcard',
      description: '6"×4" high-impact direct mail piece with personalization and QR code.',
      tip: 'Best for: New customer acquisition, promo offers, event invites. Case study: BrandsMart USA raised direct mail ROI with Taylor\'s data-driven segmentation.',
      Component: PostcardMockup,
    },
    {
      id: 'self-mailer',
      label: 'Self-Mailer',
      description: 'Tri-fold self-mailer — no envelope needed. Designed to stop the scroll.',
      tip: 'Best for: Multi-offer campaigns, product launches. Taylor\'s Marketing Advantage Program (MAP) delivers deep segmentation and analytics.',
      Component: SelfMailerMockup,
    },
    {
      id: 'letter',
      label: 'Personalized Letter',
      description: 'Professional 1:1 letter with branded letterhead and personalized body copy.',
      tip: 'Best for: High-value B2B outreach, financial services. Taylor manages mailing lists and package tracking with Zero Defects commitment.',
      Component: LetterMockup,
    },
  ],
  'packaging-labels': [
    {
      id: 'label',
      label: 'Product Label',
      description: 'Pressure-sensitive label with barcode and brand-consistent design.',
      tip: 'Best for: Retail, F&B, industrial. Case study: Toro saved $25K/yr switching to Taylor\'s Grafilm IML — reduced scrap rate and shorter cycle times.',
      Component: LabelMockup,
    },
    {
      id: 'shrink',
      label: 'Shrink Sleeve',
      description: '360-degree graphic sleeve for bottles and containers.',
      tip: 'Best for: Beverages, CPG. Shrink sleeves eliminate the need for custom-printed containers — 360-degree marketing on any shape.',
      Component: ShrinkSleeveMockup,
    },
    {
      id: 'carton',
      label: 'Folding Carton',
      description: 'Branded paperboard carton for retail packaging.',
      tip: 'Best for: Consumer goods, food. Case study: Alien Gear cut costs 61% switching from clamshells to Taylor flexible pouches — 84% less plastic.',
      Component: CartonMockup,
    },
  ],
  'signage': [
    {
      id: 'instore',
      label: 'In-Store Sign',
      description: 'Large-format in-store sign with brand photography and CTA.',
      tip: 'Best for: Retail, franchise rollouts. Case study: Paris Baguette — Taylor & Bolster created 30\'x6\' local murals + AR experiences across 60+ cafes.',
      Component: InStoreMockup,
    },
    {
      id: 'banner',
      label: 'Trade Show Banner',
      description: 'Retractable trade show banner with brand hierarchy and messaging.',
      tip: 'Best for: Events, conferences. Case study: UNIQLO pop-up — Bolster designed immersive booth, Taylor managed fabrication and installation.',
      Component: TradeBannerMockup,
    },
    {
      id: 'window',
      label: 'Window Cling',
      description: 'Branded window cling for storefront visibility and promotion.',
      tip: 'Best for: Retail, new openings. Case study: TUMI — Taylor crafted holiday window displays, top 50 stores became nationwide rollout on time.',
      Component: WindowClingMockup,
    },
  ],
  'commercial-print': [
    {
      id: 'brochure',
      label: 'Tri-Fold Brochure',
      description: 'Three-panel marketing brochure with brand story and key benefits.',
      tip: 'Best for: Sales enablement, trade shows. Case study: Rifle Paper Co. — Taylor has been their G7-certified print partner for nearly a decade.',
      Component: BrochureMockup,
    },
    {
      id: 'sellsheet',
      label: 'Sell Sheet',
      description: 'Single-page sell sheet highlighting key stats and value propositions.',
      tip: 'Best for: Product launches, sales calls. Taylor offers offset & digital under one roof for any run size.',
      Component: SellSheetMockup,
    },
    {
      id: 'catalog',
      label: 'Product Catalog',
      description: 'Professionally printed product catalog for the full brand story.',
      tip: 'Best for: CPG, B2B. Case study: WNBA Championship book — Taylor\'s nimble plan accelerated production to meet tight deadlines.',
      Component: CatalogMockup,
    },
  ],
  'fulfillment-kits': [
    {
      id: 'newlocation',
      label: 'New Location Kit',
      description: 'Complete grand opening kit assembled and shipped to every new location.',
      tip: 'Best for: Franchise rollouts, new store opens. Case study: Taylor fulfilled 988,335 POS kits for a financial services giant in under 90 days.',
      Component: NewLocationKitMockup,
    },
    {
      id: 'rebrand',
      label: 'Rebrand Rollout Kit',
      description: 'Coordinated rebrand package with updated materials across all touchpoints.',
      tip: 'Best for: Corporate rebrands, M&A. Taylor manages signage, stationery, direct mail, and POP displays as one coordinated rollout.',
      Component: RebrandKitMockup,
    },
    {
      id: 'campaign',
      label: 'Campaign Launch Pack',
      description: 'Omnichannel campaign kit with print, digital, and fulfillment components.',
      tip: 'Best for: Seasonal campaigns, launches. 188 distinct kit versions created for one credit card issuer — Zero Defects commitment.',
      Component: CampaignPackMockup,
    },
  ],
  'customer-comms': [
    {
      id: 'statement',
      label: 'Account Statement',
      description: 'HIPAA/PCI-compliant branded account statement with secure delivery.',
      tip: 'Best for: Financial services, insurance. Case study: Taylor streamlined statement printing for a global credit card company with lighter-weight paper.',
      Component: StatementMockup,
    },
    {
      id: 'employee',
      label: 'Employee Comms',
      description: 'Onboarding packet and benefits communications with brand identity.',
      tip: 'Best for: HR departments, new hires. Case study: Venture HCM — Taylor\'s outsourced CCM slashed rising overhead for paychecks and tax forms.',
      Component: EmployeeCommsMockup,
    },
    {
      id: 'taxdoc',
      label: 'Tax Document',
      description: 'W-2 and 1099 forms with employer branding and compliance certifications.',
      tip: 'Best for: Payroll, HR tech. HIPAA, PCI, SOC 2 compliant — secure print and digital delivery through a single omnichannel platform.',
      Component: TaxDocMockup,
    },
  ],
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'direct-mail': 'Direct Mail',
  'packaging-labels': 'Packaging & Labels',
  'signage': 'Signage & Graphics',
  'commercial-print': 'Commercial Print',
  'fulfillment-kits': 'Fulfillment & Kitting',
  'customer-comms': 'Customer Communications',
};

// Where each category's product gets staged when generating a photoreal image.
const CATEGORY_SETTING: Record<ProductCategory, Setting> = {
  'direct-mail': 'mailbox',
  'packaging-labels': 'shelf',
  'signage': 'salesfloor',
  'commercial-print': 'desk',
  'fulfillment-kits': 'warehouse',
  'customer-comms': 'desk',
};

export default function MockupViewer({ prospect, category, research, onBack, onChangeCategory }: Props) {
  const baseTemplates = CATEGORY_TEMPLATES[category];
  // If the AI recommended products for this category, build the template list
  // from them (mapped onto the matching vector component); else use the defaults.
  const aiProducts = (research?.products || []).filter((p) => p.category === category);
  const templates: TemplateInfo[] = aiProducts.length
    ? aiProducts.map((p) => {
        const base = baseTemplates.find((b) => b.id === p.template) || baseTemplates[0];
        return {
          id: `${p.template}-${p.title}`,
          label: p.title || base.label,
          description: p.subtitle || base.description,
          tip: p.why || base.tip,
          proof: p.proof || '',
          setting: (p.setting as Setting) || CATEGORY_SETTING[category],
          ai: true,
          Component: base.Component,
        };
      })
    : baseTemplates;

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Keep the selection valid if the template list changes.
  useEffect(() => { setSelectedIdx(0); }, [category, aiProducts.length]);

  // Clean up the entered name for display (e.g. "target" -> "Target").
  const cleanName = (prospect.company_name || '')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Your Company';
  const industryTagline = (() => {
    const i = (prospect.industry || '').toLowerCase();
    if (/food|beverage|cpg|consumer|grocery/.test(i)) return 'Quality on every shelf';
    if (/financ|bank|insur|fintech|credit union/.test(i)) return 'Banking made personal';
    if (/health|medical|pharma|hospital|clinic|dental/.test(i)) return 'Care you can count on';
    if (/tech|software|saas|app|platform/.test(i)) return 'Innovation, delivered';
    if (/restaurant|hospitality|hotel|cafe|coffee/.test(i)) return 'Made fresh, every day';
    return 'Your brand, everywhere';
  })();

  const brandProps = {
    companyName: cleanName,
    logoDataUrl: prospect.logo_data_url,
    primaryColor: prospect.primary_color,
    secondaryColor: prospect.secondary_color,
    tagline: industryTagline,
    animated,
  };

  const selected = templates[selectedIdx] || templates[0];
  const { Component } = selected;

  const toggleAnim = useCallback(() => {
    setAnimated((a) => !a);
    setAnimKey((k) => k + 1);
  }, []);

  const handleSelect = useCallback((idx: number) => {
    setSelectedIdx(idx);
    setAnimKey((k) => k + 1);
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{prospect.company_name}</span>
          {' / '}
          <button onClick={onChangeCategory} className="hover:text-taylor-600 transition-colors">
            {CATEGORY_LABELS[category]}
          </button>
          {' / '}
          <span className="text-gray-800 font-medium">{selected.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            {selected.ai ? (<><Sparkles className="w-3.5 h-3.5 text-taylor-600" /> Recommended for {prospect.company_name}</>) : 'Templates'}
          </div>
          {templates.map((t, i) => (
            <button
              key={t.id}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                i === selectedIdx
                  ? 'border-taylor-400 bg-taylor-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className={`font-semibold text-sm mb-0.5 flex items-center gap-1.5 ${i === selectedIdx ? 'text-taylor-700' : 'text-gray-800'}`}>
                {t.ai && <Sparkles className="w-3 h-3 text-taylor-500 flex-shrink-0" />}
                {t.label}
              </div>
              <div className="text-[11px] text-gray-500 leading-relaxed">{t.description}</div>
            </button>
          ))}

          <div className="pt-2">
            <button
              onClick={onChangeCategory}
              className="w-full py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:border-taylor-400 hover:text-taylor-600 transition-colors"
            >
              Browse other categories →
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{selected.label}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{CATEGORY_LABELS[category]}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAnim}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    animated
                      ? 'bg-taylor-700 text-white shadow-md shadow-taylor-700/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {animated ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {animated ? 'Pause Anim' : 'Animate'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>

            <div
              key={animKey}
              className="relative flex items-center justify-center py-10 px-4 rounded-xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #f8fafc, #eef2ff)', minHeight: '380px' }}
            >
              <Component {...brandProps} />
            </div>
          </div>

          {selected.ai ? (
            <div className="bg-taylor-50 rounded-xl border border-taylor-100 p-4 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-taylor-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-taylor-900 mb-0.5">Why this fits {prospect.company_name}</div>
                <div className="text-sm text-taylor-800">{selected.tip}</div>
                {selected.proof && (
                  <div className="mt-2 pt-2 border-t border-taylor-100 text-xs text-taylor-700"><span className="font-semibold">Taylor has done this before: </span>{selected.proof}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-800 mb-0.5">Sales Tip</div>
                <div className="text-sm text-amber-700">{selected.tip}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-xl font-bold text-taylor-700">40+</div>
              <div className="text-xs text-gray-500 mt-0.5">Production Sites</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-xl font-bold text-taylor-700">99.3%</div>
              <div className="text-xs text-gray-500 mt-0.5">Order Accuracy</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-xl font-bold text-taylor-700">27M</div>
              <div className="text-xs text-gray-500 mt-0.5">Kits Per Year</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-xl font-bold text-taylor-700">1 Day</div>
              <div className="text-xs text-gray-500 mt-0.5">Ship to Most Markets</div>
            </div>
          </div>

          {PORTFOLIO[category] && PORTFOLIO[category].length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <h4 className="font-bold text-gray-900">Real Taylor work in {CATEGORY_LABELS[category]}</h4>
              </div>
              <p className="text-xs text-gray-500 mb-4">Actual projects Taylor has delivered — click any example to view this solution on Taylor.com.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {PORTFOLIO[category].map((item, i) => (
                  <a
                    key={i}
                    href={SOLUTION_LINKS[category] || 'https://www.taylor.com/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:shadow-lg hover:border-taylor-300 transition-all"
                  >
                    <div className="relative">
                      <img src={item.src} alt={item.label} className="w-full h-56 sm:h-64 object-cover group-hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-white/90 text-[11px] font-semibold text-taylor-700 shadow">Real Taylor project</div>
                    </div>
                    <div className="p-4">
                      <div className="text-base font-semibold text-gray-800">{item.label}</div>
                      <div className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.caption}</div>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-taylor-700">View on Taylor.com <ExternalLink className="w-3 h-3" /></div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
