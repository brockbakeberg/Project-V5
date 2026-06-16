import { Mail, Package, Image, BookOpen, Box, FileText, ArrowRight } from 'lucide-react';
import type { ProductCategory } from '../types';

interface Props {
  onSelect: (cat: ProductCategory) => void;
  companyName: string;
}

const TAYLOR_IMG = {
  print: 'https://www.taylor.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/1.%20Solutions/Desktop/Feature%20Images%20-%20Updates%206.14.24/print-document-management.webp',
  marketing: 'https://www.taylor.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/1.%20Solutions/Desktop/Feature%20Images%20-%20Updates%206.14.24/marketing-solutions.webp',
  packaging: 'https://www.taylor.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/1.%20Solutions/Desktop/Feature%20Images%20-%20Updates%206.14.24/Packaging%20%26%20Labeling.webp',
  fulfillment: 'https://www.taylor.com/hubfs/__Taylor.com%20-%20All%20files%20connected%20to%20main%20site%20and%20blogs/00%20Global/New%20Navigation/1.%20Solutions/Desktop/Feature%20Images%20-%20Updates%206.14.24/Warehousing%20%26%20Fulfillment.webp',
};

const CATEGORIES = [
  {
    id: 'direct-mail' as ProductCategory,
    icon: <Mail className="w-7 h-7" />,
    label: 'Direct Mail',
    description: 'Data-driven direct mail and omnichannel campaigns that build brand awareness, increase sales, and maximize ROI.',
    templates: ['Postcard', 'Self-Mailer', 'Personalized Letter'],
    color: '#2459ee',
    bg: '#eff6ff',
    pain: 'Low response rates & campaign delays',
    image: TAYLOR_IMG.marketing,
    stat: 'Higher ROI than digital alone',
  },
  {
    id: 'packaging-labels' as ProductCategory,
    icon: <Package className="w-7 h-7" />,
    label: 'Packaging & Labels',
    description: 'Pressure-sensitive labels, shrink sleeves, folding cartons, flexible packaging, and durable labels — built for your products and environment.',
    templates: ['Product Label', 'Shrink Sleeve', 'Folding Carton'],
    color: '#16a34a',
    bg: '#f0fdf4',
    pain: 'Inconsistent brand across SKUs & line-down risks',
    image: TAYLOR_IMG.packaging,
    stat: '6 label types, all substrates',
  },
  {
    id: 'signage' as ProductCategory,
    icon: <Image className="w-7 h-7" />,
    label: 'Signage & Graphics',
    description: 'In-store signage, retail displays, trade show graphics, window clings, and large-format printing for every environment.',
    templates: ['In-Store Sign', 'Trade Show Banner', 'Window Cling'],
    color: '#dc2626',
    bg: '#fff1f2',
    pain: 'Store rollout chaos & brand inconsistency',
    image: TAYLOR_IMG.print,
    stat: 'Nationwide installation support',
  },
  {
    id: 'commercial-print' as ProductCategory,
    icon: <BookOpen className="w-7 h-7" />,
    label: 'Commercial Print',
    description: 'Catalogs, brochures, sell sheets, posters, booklets, and book printing — high-impact print for marketing and publishing.',
    templates: ['Tri-Fold Brochure', 'Sell Sheet', 'Product Catalog'],
    color: '#7c3aed',
    bg: '#faf5ff',
    pain: 'Slow creative-to-production cycle',
    image: TAYLOR_IMG.print,
    stat: 'Offset & digital under one roof',
  },
  {
    id: 'fulfillment-kits' as ProductCategory,
    icon: <Box className="w-7 h-7" />,
    label: 'Fulfillment & Kitting',
    description: 'New location kits, rebrand rollout packages, campaign launch kits, warehousing, and print-on-demand — 27M kits assembled yearly, 99.3% accuracy.',
    templates: ['New Location Kit', 'Rebrand Kit', 'Campaign Launch Pack'],
    color: '#ea580c',
    bg: '#fff7ed',
    pain: 'Store kits arriving late or wrong',
    image: TAYLOR_IMG.fulfillment,
    stat: '27M kits/year, 99.3% accuracy',
  },
  {
    id: 'customer-comms' as ProductCategory,
    icon: <FileText className="w-7 h-7" />,
    label: 'Customer Communications',
    description: 'Statements, tax forms, paychecks, and regulated documents — HIPAA, PCI, SOC 2 compliant print and digital delivery through a single platform.',
    templates: ['Statement', 'Employee Comms', 'Tax Document'],
    color: '#0891b2',
    bg: '#ecfeff',
    pain: 'Compliance gaps & manual workflows',
    image: TAYLOR_IMG.marketing,
    stat: 'HIPAA, PCI, SOC 2 certified',
  },
];

export default function ProductSelector({ onSelect, companyName }: Props) {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Product Category</h2>
        <p className="text-gray-500">
          Select which Taylor solution to mockup with{' '}
          <span className="font-semibold text-gray-700">{companyName}</span>'s brand.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="group text-left bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div
                className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm"
                style={{ background: `${cat.color}cc`, color: '#fff' }}
              >
                {cat.icon}
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold" style={{ color: cat.color }}>
                {cat.stat}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-taylor-700 transition-colors">
                {cat.label}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{cat.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cat.templates.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400 italic">Solves: {cat.pain}</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-taylor-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
