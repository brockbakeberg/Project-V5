import type { CSSProperties } from 'react';
import type { BrandProps } from './types';

function anim(delay: string, animated: boolean): CSSProperties {
  return animated ? { animationDelay: delay, opacity: 0, animation: `fadeInUp 0.7s ease-out ${delay} forwards` } : {};
}

export function BrochureMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1200px) rotateY(-5deg) rotateX(2deg)' }}>
      <div className="flex rounded-xl overflow-hidden shadow-xl" style={{ width: '480px', height: '240px' }}>
        <div className="w-[160px] flex flex-col relative overflow-hidden" style={{ background: primaryColor }}>
          <div className="absolute inset-0 w-full h-full opacity-15" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
          <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(circle at 30% 70%, ${secondaryColor}, transparent 60%)` }} />
          <div className="flex-1 flex flex-col items-center justify-between p-4 relative z-10">
            <div style={anim('0.2s', animated)}>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-9 max-w-[130px] object-contain brightness-0 invert" />
              ) : (
                <div className="text-white font-bold text-base">{companyName}</div>
              )}
            </div>
            <div className="text-center" style={anim('0.4s', animated)}>
              <div className="text-white font-bold text-xl leading-tight mb-2">
                Your Brand.<br />Our Print.
              </div>
              <div className="text-white/70 text-[10px]">Tri-Fold Brochure</div>
            </div>
            <div className="py-2 px-4 rounded text-white text-xs font-bold text-center w-full" style={{ ...anim('0.6s', animated), background: secondaryColor }}>
              Contact Us
            </div>
          </div>
        </div>

        <div className="w-[160px] p-4 border-r border-gray-100 flex flex-col justify-between bg-white" style={anim('0.15s', animated)}>
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: primaryColor }}>Why {companyName}?</div>
            {['Industry-leading quality', 'On-brand every time', 'Fast turnaround', 'One vendor, everything'].map((item) => (
              <div key={item} className="flex items-start gap-1.5 text-[10px] text-gray-600 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: secondaryColor }} />
                {item}
              </div>
            ))}
          </div>
          <div className="text-[8px] text-gray-400">Produced by Taylor Corporation</div>
        </div>

        <div className="w-[160px] p-4 bg-white flex flex-col justify-between" style={anim('0.3s', animated)}>
          <div>
            <div className="text-xs font-bold mb-2 text-gray-800">Our Solutions</div>
            {[
              { label: 'Print Programs', pct: 90 },
              { label: 'Packaging', pct: 85 },
              { label: 'Fulfillment', pct: 80 },
            ].map((item) => (
              <div key={item.label} className="mb-2">
                <div className="text-[10px] text-gray-600 mb-0.5">{item.label}</div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: primaryColor }} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-[9px] text-gray-400">taylor corporation.com</div>
            <div className="text-[8px] text-gray-300">1-800-TAYLOR-1</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SellSheetMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1000px) rotateY(-4deg) rotateX(2deg)' }}>
      <div className="w-[320px] bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="h-[130px] relative overflow-hidden flex flex-col justify-between p-5" style={{ background: primaryColor }}>
          <div className="absolute inset-0 w-full h-full opacity-15" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 70% 30%, ${secondaryColor}, transparent 50%)` }} />
          <div className="relative z-10" style={anim('0.1s', animated)}>
            {logoDataUrl ? (
              <img src={logoDataUrl} alt={companyName} className="h-9 max-w-[140px] object-contain brightness-0 invert" />
            ) : (
              <div className="text-white font-bold text-lg">{companyName}</div>
            )}
          </div>
          <div className="relative z-10" style={anim('0.3s', animated)}>
            <div className="text-white font-bold text-xl">The Complete<br />Brand Solution</div>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 gap-3 mb-4" style={anim('0.3s', animated)}>
            {[
              { n: '40+', l: 'Production Sites' },
              { n: '99.3%', l: 'Order Accuracy' },
              { n: '5.3M', l: 'Annual Orders' },
              { n: '27M', l: 'Kits Per Year' },
            ].map((s) => (
              <div key={s.n} className="text-center p-2 rounded-lg" style={{ background: `${primaryColor}10` }}>
                <div className="font-bold text-lg" style={{ color: primaryColor }}>{s.n}</div>
                <div className="text-[9px] text-gray-500">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 mb-4" style={anim('0.4s', animated)}>
            {['Print & Print Management', 'Packaging & Labeling', 'Warehousing & Fulfillment', 'Customer Communications'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-3 h-3 rounded flex items-center justify-center flex-shrink-0" style={{ background: secondaryColor }}>
                  <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>

          <div className="flex gap-2" style={anim('0.5s', animated)}>
            <div className="flex-1 py-2 rounded-lg text-white text-xs font-bold text-center" style={{ background: primaryColor }}>
              Request Sample
            </div>
            <div className="flex-1 py-2 rounded-lg text-xs font-bold text-center border" style={{ borderColor: primaryColor, color: primaryColor }}>
              Learn More
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="flex items-start mockup-shadow" style={{ transform: 'perspective(1000px) rotateY(-10deg) rotateX(4deg)', transformStyle: 'preserve-3d' }}>
      <div className="relative">
        <div className="w-[220px] h-[290px] rounded-r-xl overflow-hidden shadow-2xl" style={{ background: primaryColor }}>
          <div className="absolute inset-0 w-full h-full opacity-15" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
          <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(circle at 80% 20%, ${secondaryColor}, transparent 50%)` }} />
          <div className="h-full flex flex-col items-center justify-between p-6 relative z-10">
            <div style={anim('0.1s', animated)}>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-10 max-w-[160px] object-contain brightness-0 invert mx-auto" />
              ) : (
                <div className="text-white font-bold text-xl text-center">{companyName}</div>
              )}
            </div>
            <div className="text-center" style={anim('0.3s', animated)}>
              <div className="text-white/60 text-xs uppercase tracking-widest mb-2">2025 Product Catalog</div>
              <div className="text-white font-bold text-3xl leading-tight">
                The Full<br />Lineup
              </div>
            </div>
            <div style={anim('0.5s', animated)}>
              <div className="px-5 py-2 rounded-full text-white text-sm font-bold" style={{ background: secondaryColor }}>
                Browse Catalog
              </div>
              <div className="text-white/40 text-[9px] text-center mt-2">Vol. 12 | taylorcorp.com</div>
            </div>
          </div>
        </div>

        <div
          className="absolute top-2 bottom-2 -left-[12px] w-[14px] rounded-l"
          style={{
            background: `${primaryColor}77`,
            boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </div>
  );
}
