// Real Taylor project photos, served from Supabase Storage (public "Portfolio" bucket).
const BASE = 'https://qlgocfoyykcfvmfqjbnv.supabase.co/storage/v1/object/public/Portfolio';

export interface PortfolioItem { src: string; label: string; caption: string; }

export const CLIENT_LOGOS_BANNER = `${BASE}/banner.jpg`;

export const PORTFOLIO: Record<string, PortfolioItem[]> = {
  'signage': [
    { src: `${BASE}/signage-1.jpg`, label: 'Fleet & Vehicle Graphics', caption: 'Full truck wrap, produced and installed' },
    { src: `${BASE}/signage-2.jpg`, label: 'In-Store Retail Display', caption: 'Branded in-store fixtures and wall graphics' },
    { src: `${BASE}/signage-3.jpg`, label: 'Storefront & Window Graphics', caption: 'Large-format storefront graphics' },
    { src: `${BASE}/signage-4.jpg`, label: 'Event & Retail Activation', caption: 'Immersive event environments and signage' },
  ],
  'packaging-labels': [
    { src: `${BASE}/packaging-1.jpg`, label: 'In-Mold & Durable Labels', caption: 'Durable product labels for harsh environments' },
    { src: `${BASE}/packaging-2.jpg`, label: 'Pressure-Sensitive & Stock Labels', caption: 'High-speed stock label production' },
    { src: `${BASE}/packaging-3.jpg`, label: 'Cartons & Flexible Packaging', caption: 'Folding cartons and flexible pouches' },
  ],
  'direct-mail': [
    { src: `${BASE}/directmail-1.jpg`, label: 'Personalized, Data-Driven Mail', caption: 'Targeted, personalized direct mail' },
    { src: `${BASE}/directmail-2.jpg`, label: 'Postcards, Letters & Mailers', caption: 'Full range of direct mail formats' },
  ],
  'commercial-print': [
    { src: `${BASE}/print-1.jpg`, label: 'Magazines & Catalogs', caption: 'High-volume magazine and catalog printing' },
    { src: `${BASE}/print-2.jpg`, label: 'Brochures & Sell Sheets', caption: 'Brochures, sell sheets and campaign materials' },
  ],
  'fulfillment-kits': [
    { src: `${BASE}/fulfillment-1.jpg`, label: 'Packaging & Fulfillment', caption: 'Pick, pack and fulfillment programs' },
    { src: `${BASE}/print-2.jpg`, label: 'Account Opening & Launch Kits', caption: 'Assembled and shipped kits at scale' },
  ],
  'customer-comms': [
    { src: `${BASE}/comms-1.jpg`, label: 'Business Forms & Notebooks', caption: 'Custom business forms and branded notebooks' },
    { src: `${BASE}/comms-2.jpg`, label: 'Gift Cards & Secure Print', caption: 'Gift card programs and secure documents' },
    { src: `${BASE}/comms-3.jpg`, label: 'Secure Packs & Card Carriers', caption: 'Secure gift-card packaging and labels' },
  ],
};
