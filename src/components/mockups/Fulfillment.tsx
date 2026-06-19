import type { CSSProperties } from 'react';
import type { BrandProps } from './types';

function anim(delay: string, animated: boolean): CSSProperties {
  return animated ? { animationDelay: delay, opacity: 0, animation: `fadeInUp 0.7s ease-out ${delay} forwards` } : {};
}

export function NewLocationKitMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="flex items-center justify-center mockup-shadow" style={{ transform: 'perspective(900px) rotateY(-8deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}>
      <div className="relative" style={{ width: '360px' }}>
        <div
          className="w-full rounded-xl overflow-visible relative"
          style={{ background: '#c8a96e', minHeight: '240px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
        >
          <div className="absolute inset-0 w-full h-full opacity-10 rounded-xl" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
          <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 20px)' }} />

          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between mb-3">
              <div style={anim('0.1s', animated)}>
                <div className="text-amber-900/70 text-[9px] uppercase font-bold tracking-widest mb-1">Taylor Corporation</div>
                <div className="text-amber-900/50 text-[8px]">New Location Kit</div>
              </div>
              <div className="w-16 h-6 bg-amber-900/10 rounded flex items-center justify-center">
                <div className="text-amber-900/50 text-[7px] font-mono">TC-2025-NLK</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg mb-4" style={{ ...anim('0.2s', animated), background: `${primaryColor}22`, border: `1px solid ${primaryColor}44` }}>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-8 max-w-[100px] object-contain" />
              ) : (
                <div className="font-bold text-lg" style={{ color: primaryColor }}>{companyName}</div>
              )}
              <div>
                <div className="text-gray-800 font-bold text-sm">{companyName}</div>
                <div className="text-gray-500 text-[10px]">Grand Opening Kit</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2" style={anim('0.3s', animated)}>
              {[
                { label: 'Window Signs', count: '4', color: primaryColor },
                { label: 'Brochures', count: '50', color: secondaryColor },
                { label: 'Banners', count: '2', color: primaryColor },
                { label: 'Floor Decals', count: '8', color: secondaryColor },
                { label: 'Menu Boards', count: '3', color: primaryColor },
                { label: 'POS Displays', count: '6', color: secondaryColor },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-lg p-2 text-center shadow-sm">
                  <div className="font-bold text-lg" style={{ color: item.color }}>{item.count}</div>
                  <div className="text-[9px] text-gray-500 leading-tight">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-amber-900/10" style={anim('0.5s', animated)}>
              <div className="text-[9px] text-gray-500">Ships within 5-7 business days</div>
              <div className="px-3 py-1.5 rounded-lg text-white text-[10px] font-bold" style={{ background: primaryColor }}>
                Track Order
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -top-3 left-8 right-8 h-5 rounded-t-xl" style={{ background: '#a07840', zIndex: -1 }} />
      </div>
    </div>
  );
}

export function RebrandKitMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1000px) rotateY(-6deg) rotateX(3deg)' }}>
      <div className="w-[380px] bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="h-[100px] relative overflow-hidden p-5 flex items-end" style={{ background: primaryColor }}>
          <div className="absolute inset-0 w-full h-full opacity-15" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 80% 20%, ${secondaryColor}, transparent 50%)` }} />
          <div className="relative z-10 flex items-center gap-4">
            <div style={anim('0.1s', animated)}>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-9 max-w-[130px] object-contain brightness-0 invert" />
              ) : (
                <div className="text-white font-bold text-xl">{companyName}</div>
              )}
            </div>
            <div style={anim('0.2s', animated)}>
              <div className="text-white font-bold text-base">Rebrand Rollout</div>
              <div className="text-white/60 text-xs">{new Date().getFullYear()} Brand Update</div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3" style={anim('0.2s', animated)}>Kit Contents</div>
          <div className="space-y-2" style={anim('0.3s', animated)}>
            {[
              { item: 'Updated Signage Package', status: 'Ready', qty: '12 locations' },
              { item: 'Branded Stationery Set', status: 'Ready', qty: '500 units' },
              { item: 'Direct Mail Announcement', status: 'Ready', qty: '10,000 pieces' },
              { item: 'POP Display Kit', status: 'Ready', qty: '6 pieces' },
            ].map((row) => (
              <div key={row.item} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div>
                  <div className="text-xs font-medium text-gray-800">{row.item}</div>
                  <div className="text-[10px] text-gray-400">{row.qty}</div>
                </div>
                <div className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: '#22c55e' }}>
                  {row.status}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4" style={anim('0.5s', animated)}>
            <div className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold text-center" style={{ background: primaryColor }}>
              Deploy Now
            </div>
            <div className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center border" style={{ borderColor: primaryColor, color: primaryColor }}>
              View Details
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CampaignPackMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  const items = ['Direct Mail (5,000)', 'Sell Sheets (200)', 'Email Templates', 'Social Assets', 'Banner Ads'];
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)' }}>
      <div className="w-[360px] rounded-xl overflow-hidden shadow-xl relative" style={{ background: primaryColor }}>
        <div className="absolute inset-0 w-full h-full opacity-10" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div style={anim('0.1s', animated)}>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-9 max-w-[130px] object-contain brightness-0 invert" />
              ) : (
                <div className="text-white font-bold text-xl">{companyName}</div>
              )}
              <div className="text-white/60 text-[10px] mt-1">Campaign Launch Pack</div>
            </div>
            <div className="text-right" style={anim('0.2s', animated)}>
              <div className="text-white/60 text-[9px]">Omnichannel</div>
              <div className="text-white font-bold text-sm">Q3 2025</div>
            </div>
          </div>

          <div className="space-y-2" style={anim('0.3s', animated)}>
            {items.map((item, i) => (
              <div key={item} className="flex items-center gap-3 py-2 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: i < 3 ? secondaryColor : 'rgba(255,255,255,0.2)' }}
                >
                  {i + 1}
                </div>
                <div className="text-white text-xs">{item}</div>
                {i < 2 && (
                  <div className="ml-auto">
                    <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10" style={anim('0.5s', animated)}>
            <div className="py-2.5 rounded-xl text-center text-sm font-bold" style={{ background: secondaryColor, color: '#fff' }}>
              Launch Campaign →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
