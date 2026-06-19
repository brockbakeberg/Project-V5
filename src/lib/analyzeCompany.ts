import type { Prospect } from '../types';

export interface ResearchProduct {
  category: string;
  template: string;
  title: string;
  subtitle: string;
  setting: string;
  why: string;
  proof: string;
}

export interface ResearchCategory {
  id: string;
  fit: 'high' | 'medium' | 'low';
  reason: string;
}

export interface Research {
  summary: string;
  description?: string;   // richer narrative for the top of the category page
  triggers?: string[];    // likely buying triggers / events to watch for
  positioning?: string;
  categories: ResearchCategory[];
  products: ResearchProduct[];
  source?: 'ai' | 'builtin';
}

const CATEGORY_IDS = ['direct-mail', 'packaging-labels', 'signage', 'commercial-print', 'fulfillment-kits', 'customer-comms'];

const SEED: Record<string, { template: string; setting: string; title: (c: string) => string; subtitle: string; why: (c: string) => string; proof: string }> = {
  'packaging-labels': { template: 'label', setting: 'shelf', title: (c) => `${c} Product Label Program`, subtitle: 'Pressure-sensitive labels, consistent across every SKU', why: (c) => `Keep ${c}'s look identical on every product and substrate, with less scrap and faster changeovers.`, proof: 'Toro saved ~$25K/yr switching to Taylor in-mold labels.' },
  'signage': { template: 'instore', setting: 'salesfloor', title: (c) => `${c} In-Store Signage`, subtitle: 'Large-format signage and displays for every location', why: (c) => `Roll out on-brand signage across all ${c} locations on schedule, with nationwide installation.`, proof: 'Paris Baguette: Taylor produced large-format murals + AR across 60+ cafes.' },
  'direct-mail': { template: 'postcard', setting: 'mailbox', title: (c) => `${c} Acquisition Mailer`, subtitle: 'Data-driven direct mail that drives response', why: (c) => `Reach the right households for ${c} with segmented, personalized mail that lifts ROI.`, proof: 'BrandsMart USA lifted direct-mail ROI with Taylor data-driven segmentation.' },
  'commercial-print': { template: 'brochure', setting: 'desk', title: (c) => `${c} Brand Brochure`, subtitle: 'High-impact print that tells the brand story', why: (c) => `Give ${c}'s sales team polished, on-brand print — offset and digital under one roof.`, proof: 'Rifle Paper Co. has been a Taylor G7-certified print partner for ~a decade.' },
  'fulfillment-kits': { template: 'newlocation', setting: 'warehouse', title: (c) => `${c} New-Location Kit`, subtitle: 'Assembled, warehoused, and shipped on demand', why: (c) => `Every ${c} opening or campaign kitted accurately and shipped on time, at any scale.`, proof: 'Taylor fulfilled 988,335 POS kits for a financial-services giant in under 90 days.' },
  'customer-comms': { template: 'statement', setting: 'desk', title: (c) => `${c} Customer Statements`, subtitle: 'Compliant, branded statements and documents', why: (c) => `Deliver ${c}'s regulated documents securely — HIPAA, PCI, and SOC 2 compliant.`, proof: 'Venture HCM outsourced paychecks and tax forms to Taylor to cut overhead.' },
};

// Industry brief: context narrative + the buying triggers a rep should listen for.
const INDUSTRY_BRIEF: Record<string, { context: (c: string) => string; triggers: string[] }> = {
  food: {
    context: (c) => `${c} competes on shelf presence and brand consistency. In consumer goods, packaging, labels, and in-store signage are where shoppers decide — exactly where Taylor adds the most value, from prime labels to retail displays and fulfillment.`,
    triggers: ['New product launch or SKU expansion (needs new packaging + labels)', 'Rebrand or packaging refresh', 'Retail/grocery rollout or new shelf placement', 'Seasonal or promotional campaigns', 'Sustainability push toward eco-friendly packaging'],
  },
  finance: {
    context: (c) => `${c} operates in a regulated, trust-driven market. Secure customer communications, compliant statements, and data-driven acquisition mail are core, recurring needs that Taylor specializes in for banks, credit unions, and insurers.`,
    triggers: ['New branch openings or branch refresh (signage)', 'Customer acquisition or loyalty campaigns', 'Regulatory/compliance changes to statements', 'New rates or products needing direct mail', 'Mergers/acquisitions requiring rebranded communications'],
  },
  health: {
    context: (c) => `${c} needs accuracy, compliance, and patient trust above all. Secure patient communications, clinical forms, wayfinding signage, and cold-chain labeling are established Taylor strengths in healthcare.`,
    triggers: ['New facility or clinic openings (signage + wayfinding)', 'Patient communication / statement programs', 'Compliance or labeling requirement changes', 'Enrollment or health-awareness campaigns', 'Onboarding kits for new patients or staff'],
  },
  tech: {
    context: (c) => `${c} is brand- and growth-focused. Polished sales collateral, strong trade-show presence, and onboarding/welcome kits help a scaling tech company look credible and stand out.`,
    triggers: ['Funding round or rapid headcount growth', 'Conference / trade-show season', 'Product launch or rebrand', 'New office openings', 'Customer onboarding / welcome-kit programs'],
  },
  restaurant: {
    context: (c) => `${c} competes on experience and consistency across locations. Menu and signage systems, branded packaging, and local campaigns drive traffic and keep the brand cohesive across every site.`,
    triggers: ['New location or franchise openings', 'Menu refresh or limited-time offer (LTO)', 'Seasonal promotions and events', 'Rebrand or remodel', 'Loyalty or direct-mail campaigns'],
  },
  retail: {
    context: (c) => `${c} has to win at every customer touchpoint — storefront, shelf, and mailbox. On-brand signage, packaging, and data-driven direct mail are the highest-impact places to start with Taylor.`,
    triggers: ['Store openings, remodels, or seasonal resets', 'Promotional and holiday campaigns', 'Rebrand or new brand guidelines', 'Omnichannel or loyalty initiatives', 'New product lines that need packaging'],
  },
};

function industryKey(industry: string): keyof typeof INDUSTRY_BRIEF {
  const i = (industry || '').toLowerCase();
  if (/food|beverage|cpg|consumer|grocery/.test(i)) return 'food';
  if (/financ|bank|insur|fintech|credit union/.test(i)) return 'finance';
  if (/health|medical|pharma|hospital|clinic|dental/.test(i)) return 'health';
  if (/tech|software|saas|app|platform/.test(i)) return 'tech';
  if (/restaurant|hospitality|hotel|food service|cafe|coffee/.test(i)) return 'restaurant';
  return 'retail';
}

function fitsForIndustry(industry: string): Record<string, 'high' | 'medium' | 'low'> {
  const f = (high: string[], med: string[]): Record<string, 'high' | 'medium' | 'low'> => {
    const out: Record<string, 'high' | 'medium' | 'low'> = {};
    for (const id of CATEGORY_IDS) out[id] = high.includes(id) ? 'high' : med.includes(id) ? 'medium' : 'low';
    return out;
  };
  switch (industryKey(industry)) {
    case 'food': return f(['packaging-labels', 'signage', 'direct-mail'], ['commercial-print', 'fulfillment-kits']);
    case 'finance': return f(['customer-comms', 'direct-mail'], ['commercial-print', 'fulfillment-kits']);
    case 'health': return f(['customer-comms', 'commercial-print'], ['signage', 'direct-mail', 'fulfillment-kits']);
    case 'tech': return f(['commercial-print', 'fulfillment-kits'], ['direct-mail', 'signage', 'customer-comms']);
    case 'restaurant': return f(['signage', 'packaging-labels'], ['direct-mail', 'commercial-print', 'fulfillment-kits']);
    default: return f(['signage', 'packaging-labels', 'direct-mail'], ['commercial-print', 'fulfillment-kits']);
  }
}

function reasonFor(id: string, fit: string, company: string): string {
  if (fit === 'low') return `Likely a lower priority for ${company} — keep as a cross-sell.`;
  const map: Record<string, string> = {
    'packaging-labels': `${company} ships physical product, so consistent labels/packaging matter.`,
    'signage': `${company} has customer-facing spaces that need on-brand signage.`,
    'direct-mail': `${company} can grow with targeted, data-driven mail.`,
    'commercial-print': `${company}'s marketing and sales need polished print collateral.`,
    'fulfillment-kits': `${company} has locations/campaigns that need kitting and fulfillment.`,
    'customer-comms': `${company} sends statements/documents that must be compliant and branded.`,
  };
  return map[id] || `A solid fit for ${company}.`;
}

export function localResearch(prospect: Prospect): Research {
  const company = prospect.company_name || 'this company';
  const brief = INDUSTRY_BRIEF[industryKey(prospect.industry)];
  const fits = fitsForIndustry(prospect.industry);
  const categories: ResearchCategory[] = CATEGORY_IDS.map((id) => ({ id, fit: fits[id], reason: reasonFor(id, fits[id], company) }));
  const products: ResearchProduct[] = CATEGORY_IDS
    .filter((id) => fits[id] !== 'low')
    .slice(0, 6)
    .map((id) => {
      const s = SEED[id];
      return { category: id, template: s.template, title: s.title(company), subtitle: s.subtitle, setting: s.setting, why: s.why(company), proof: s.proof };
    });
  let description = brief.context(company);
  if (prospect.notes?.trim()) description += ` Rep notes: ${prospect.notes.trim()}`;
  return {
    summary: (prospect.notes?.trim() || `${company} — ${prospect.industry || 'business'}`).slice(0, 240),
    description,
    triggers: brief.triggers,
    positioning: `${prospect.industry || 'Business'} • tailored Taylor recommendations`,
    categories,
    products,
    source: 'builtin',
  };
}

export async function analyzeCompany(prospect: Prospect): Promise<Research> {
  return localResearch(prospect);
}
