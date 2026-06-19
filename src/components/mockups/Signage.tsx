import type { CSSProperties } from 'react';
import type { BrandProps } from './types';

function anim(delay: string, animated: boolean): CSSProperties {
  return animated ? { animationDelay: delay, opacity: 0, animation: `fadeInUp 0.7s ease-out ${delay} forwards` } : {};
}

export function InStoreMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, tagline, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)' }}>
      <div className="w-[380px] rounded-xl overflow-hidden shadow-2xl" style={{ background: primaryColor }}>
        <div className="h-full flex flex-col">
          <div className="relative overflow-hidden" style={{ height: '200px', background: `linear-gradient(160deg, ${primaryColor}, ${primaryColor}cc)` }}>
            <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(circle at 80% 20%, ${secondaryColor}, transparent 55%)` }} />
            <div className="absolute inset-0 w-full h-full opacity-15" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
              <div style={anim('0.1s', animated)}>
                {logoDataUrl ? (
                  <img src={logoDataUrl} alt={companyName} className="h-12 max-w-[180px] object-contain brightness-0 invert mx-auto mb-3" />
                ) : (
                  <div className="text-white font-bold text-2xl mb-3">{companyName}</div>
                )}
              </div>
              <div style={anim('0.3s', animated)}>
                <div className="text-white font-bold text-3xl leading-tight mb-2">Now Open</div>
                <div className="text-white/80 text-sm">Your trusted partner for quality</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4" style={anim('0.4s', animated)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-800 font-bold text-base">{companyName}</div>
                <div className="text-gray-500 text-sm">Visit us in store today</div>
              </div>
              <div className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ background: secondaryColor }}>
                Learn More
              </div>
            </div>
          </div>

          <div className="px-4 py-2 text-[9px] text-white/40 text-right" style={{ background: primaryColor }}>
            Produced by Taylor Corporation
          </div>
        </div>
      </div>
    </div>
  );
}

export function TradeBannerMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, tagline, animated }: BrandProps) {
  return (
    <div className="flex items-start justify-center mockup-shadow" style={{ transform: 'perspective(900px) rotateY(-4deg)' }}>
      <div className="relative">
        <div className="w-[200px] rounded-xl overflow-hidden shadow-2xl" style={{ background: primaryColor }}>
          <div className="p-5 flex flex-col items-center gap-4" style={{ minHeight: '480px' }}>
            <div className="text-center" style={anim('0.1s', animated)}>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-12 max-w-[160px] object-contain brightness-0 invert mx-auto" />
              ) : (
                <div className="text-white font-bold text-xl">{companyName}</div>
              )}
            </div>

            <div className="w-full h-px opacity-20" style={{ background: secondaryColor }} />

            <div className="text-center" style={anim('0.25s', animated)}>
              <div className="text-white/70 text-[10px] uppercase tracking-widest mb-1">Introducing</div>
              <div className="text-white font-bold text-2xl leading-tight">
                {companyName}
              </div>
            </div>

            <div
              className="w-full rounded-xl overflow-hidden"
              style={{ height: '140px', background: `${secondaryColor}33` }}
            >
              <div className="w-full h-full opacity-50" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
            </div>

            <div className="text-center space-y-2 w-full" style={anim('0.4s', animated)}>
              {['Print Programs', 'Packaging & Labels', 'Fulfillment Kits'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: secondaryColor }} />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-auto w-full" style={anim('0.55s', animated)}>
              <div className="text-center py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: secondaryColor }}>
                Visit Our Booth
              </div>
              <div className="text-white/40 text-[9px] text-center mt-2">
                taylorcorporation.com
              </div>
            </div>
          </div>
        </div>

        <div className="w-1 bg-gray-400 mx-auto" style={{ height: '40px' }} />
        <div className="w-[160px] h-3 bg-gray-400 rounded-full mx-auto" />
      </div>
    </div>
  );
}

export function WindowClingMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, tagline, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1000px) rotateY(-6deg) rotateX(3deg)' }}>
      <div
        className="w-[340px] h-[240px] rounded-xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #e8f0fe, #c7d7f7)' }}
      >
        <div className="absolute inset-0 w-full h-full opacity-20" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />

        <div
          className="absolute inset-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-between p-4"
          style={{ borderColor: `${primaryColor}60`, background: `${primaryColor}15`, backdropFilter: 'blur(4px)' }}
        >
          <div style={anim('0.1s', animated)}>
            {logoDataUrl ? (
              <img src={logoDataUrl} alt={companyName} className="h-10 max-w-[140px] object-contain mx-auto" style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.2))` }} />
            ) : (
              <div className="font-bold text-xl text-center" style={{ color: primaryColor }}>{companyName}</div>
            )}
          </div>

          <div className="text-center" style={anim('0.3s', animated)}>
            <div className="font-bold text-2xl leading-tight" style={{ color: primaryColor }}>
              Now Open
            </div>
            <div className="text-gray-600 text-sm mt-1">Visit us inside</div>
          </div>

          <div style={anim('0.5s', animated)}>
            <div className="px-5 py-2 rounded-full text-white text-sm font-bold" style={{ background: secondaryColor }}>
              Welcome In →
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 text-[8px] text-gray-400/70">
          Taylor Corporation Large Format
        </div>
      </div>
    </div>
  );
}
