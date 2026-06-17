import type { Prospect } from '../types';

export interface ResearchProduct { category: string; template: string; title: string; subtitle: string; setting: string; why: string; proof: string; }
export interface ResearchCategory { id: string; fit: 'high' | 'medium' | 'low'; reason: string; }
export interface Research { summary: string; positioning?: string; categories: ResearchCategory[]; products: ResearchProduct[]; source?: 'ai' | 'builtin'; }

const CATEGORY_IDS = ['direct-mail', 'packaging-labels', 'signage', 'commercial-print', 'fulfillment-kits', 'customer-comms'];

const SEED: Record<string, { template: string; setting: string; title: (c: string) => string; subtitle: string; why: (c: string) => string; proof: string }> = {
  'packaging-labels': { template: 'label', setting: 'shelf', title: (c) => `${c} Product Label Program`, subtitle: 'Pressure-sensitive labels, consistent across every SKU', why: (c) => `Keep ${c}'s look identical on every product, with less scrap and faster changeovers.`, proof: 'Toro saved ~$25K/yr switching to Taylor Grafilm in-mold labels.' },
  'signage': { template: 'instore', setting: 'salesfloor', title: (c) => `${c} In-Store Signage`, subtitle: 'Large-format signage and displays for every location', why: (c) => `Roll out on-brand signage across all ${c} locations on schedule.`, proof: 'Paris Baguette: Taylor produced large-format murals across 60+ cafes.' },
  'direct-mail': { template: 'postcard', setting: 'mailbox', title: (c) => `${c} Acquisition Mailer`, subtitle: 'Data-driven direct mail that drives response', why: (c) => `Reach the right households for ${c} with segmented, personalized mail.`, proof: 'BrandsMart USA lifted direct-mail ROI with Taylor data-driven segmentation.' },
  'commercial-print': { template: 'brochure', setting: 'desk', title: (c) => `${c} Brand Brochure`, subtitle: 'High-impact print that tells the brand story', why: (c) => `Give ${c}'s team polished, on-brand print — offset and digital under one roof.`, proof: 'Rifle Paper Co. has been a Taylor G7-certified print partner for ~a decade.' },
  'fulfillment-kits': { template: 'newlocation', setting: 'warehouse', title: (c) => `${c} New-Location Kit`, subtitle: 'Assembled, warehoused, and shipped on demand', why: (c) => `Every ${c} opening or campaign kitted accurately and shipped on time.`, proof: 'Taylor fulfilled 988,335 POS kits for a financial-services giant in under 90 days.' },
  'customer-comms': { template: 'statement', setting: 'desk', title: (c) => `${c} Customer Statements`, subtitle: 'Compliant, branded statements and documents', why: (c) => `Deliver ${c}'s regulated documents securely — HIPAA, PCI, SOC 2 compliant.`, proof: 'Venture HCM outsourced paychecks and tax forms to Taylor to cut overhead.' },
};

function fitsForIndustry(industry: string): Record<string, 'high' | 'medium' | 'low'> {
  const i = (industry || '').toLowerCase();
  const f = (high: string[], med: string[]) => { const o: Record<string, 'high' | 'medium' | 'low'> = {}; for (const id of CATEGORY_IDS) o[id] = high.includes(id) ? 'high' : med.includes(id) ? 'medium' : 'low'; return o; };
  if (/food|beverage|cpg|consumer|grocery/.test(i)) return f(['packaging-labels', 'signage', 'direct-mail'], ['commercial-print', 'fulfillment-kits']);
  if (/financ|bank|insur|fintech/.test(i)) return f(['customer-comms', 'direct-mail'], ['commercial-print', 'fulfillment-kits']);
  if (/health|medical|pharma|hospital/.test(i)) return f(['customer-comms', 'commercial-print'], ['signage', 'direct-mail', 'fulfillment-kits']);
  if (/tech|software|saas/.test(i)) return f(['commercial-print', 'fulfillment-kits'], ['direct-mail', 'signage', 'customer-comms']);
  if (/restaurant|hospitality|hotel/.test(i)) return f(['signage', 'packaging-labels'], ['direct-mail', 'commercial-print', 'fulfillment-kits']);
  return f(['signage', 'packaging-labels', 'direct-mail'], ['commercial-print', 'fulfillment-kits']);
}

function reasonFor(id: string, fit: string, company: string): string {
  if (fit === 'low') return `Likely a lower priority for ${company} — keep as a cross-sell.`;
  const m: Record<string, string> = {
    'packaging-labels': `${company} ships physical product, so consistent labels/packaging matter.`,
    'signage': `${company} has customer-facing spaces that need on-brand signage.`,
    'direct-mail': `${company} can grow with targeted, data-driven mail.`,
    'commercial-print': `${company}'s marketing and sales need polished print collateral.`,
    'fulfillment-kits': `${company} has locations/campaigns that need kitting and fulfillment.`,
    'customer-comms': `${company} sends statements/documents that must be compliant and branded.`,
  };
  return m[id] || `A solid fit for ${company}.`;
}

export function localResearch(prospect: Prospect): Research {
  const company = prospect.company_name || 'this company';
  const fits = fitsForIndustry(prospect.industry);
  const categories: ResearchCategory[] = CATEGORY_IDS.map((id) => ({ id, fit: fits[id], reason: reasonFor(id, fits[id], company) }));
  const products: ResearchProduct[] = CATEGORY_IDS.filter((id) => fits[id] !== 'low').slice(0, 6).map((id) => {
    const s = SEED[id];
    return { category: id, template: s.template, title: s.title(company), subtitle: s.subtitle, setting: s.setting, why: s.why(company), proof: s.proof };
  });
  const base = prospect.notes?.trim() ? prospect.notes.trim() : `${company} is a ${prospect.industry || 'company'} that can use Taylor across print, packaging, signage, and fulfillment.`;
  return { summary: base.slice(0, 240), positioning: `${prospect.industry || 'Business'} • tailored Taylor recommendations`,
