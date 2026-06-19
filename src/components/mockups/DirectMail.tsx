import type { CSSProperties } from 'react';
import type { BrandProps } from './types';

function anim(delay: string, animated: boolean): CSSProperties {
  return animated
    ? { animationDelay: delay, opacity: 0, animation: `fadeInUp 0.7s ease-out ${delay} forwards` }
    : {};
}

export function PostcardMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div
      className="relative mockup-shadow"
      style={{ transform: 'perspective(1200px) rotateY(-6deg) rotateX(3deg)', transformStyle: 'preserve-3d' }}
    >
      <div
        className="w-[420px] h-[270px] rounded-xl overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
      >
        <div className="absolute inset-0 w-full h-full opacity-20" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
        <div className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(circle at 70% 30%, ${secondaryColor}, transparent 55%)` }} />

        <div className="relative z-10 h-full flex">
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div style={anim('0.1s', animated)}>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-10 max-w-[130px] object-contain brightness-0 invert" />
              ) : (
                <div className="text-white font-bold text-lg tracking-wide">{companyName}</div>
              )}
            </div>
            <div style={anim('0.3s', animated)}>
              <div className="text-white/60 text-xs mb-1 uppercase tracking-widest">Exclusive Offer</div>
              <div className="text-white font-bold text-2xl leading-tight mb-2">
                See What We Can<br />Do For Your Brand
              </div>
              <div className="text-white/80 text-sm">Personalized solutions for {companyName}</div>
            </div>
            <div style={anim('0.5s', animated)}>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white"
                style={{ background: secondaryColor }}
              >
                See How It Works →
              </div>
            </div>
          </div>

          <div className="w-[130px] flex flex-col border-l border-white/10">
            <div className="flex-1 flex items-center justify-center p-3" style={{ background: `${secondaryColor}33` }}>
              <div className="w-16 h-16 bg-white rounded-lg flex flex-col items-center justify-center gap-0.5 p-2">
                {[4, 7, 5, 8, 4, 6].map((w, i) => (
                  <div key={i} className="flex gap-0.5">
                    {Array.from({ length: w }).map((_, j) => (
                      <div key={j} className="w-1 h-1 rounded-sm" style={{ background: primaryColor }} />
                    ))}
                  </div>
                ))}
                <div className="text-[6px] mt-1" style={{ color: primaryColor }}>SCAN ME</div>
              </div>
            </div>
            <div className="p-3 text-white/60 text-[9px] leading-relaxed">
              <div>Respond by</div>
              <div className="text-white font-bold text-sm">Dec 31</div>
              <div className="mt-1">Offer code:</div>
              <div className="font-mono text-white text-xs">TC-2025</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1 left-2 right-2 h-2 rounded-b-xl opacity-30" style={{ background: primaryColor }} />
      <div className="absolute -bottom-2 left-4 right-4 h-2 rounded-b-xl opacity-15" style={{ background: primaryColor }} />
    </div>
  );
}

export function SelfMailerMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1200px) rotateY(-4deg) rotateX(2deg)' }}>
      <div className="flex rounded-xl overflow-hidden w-[510px] h-[220px] shadow-2xl">
        <div className="w-[170px] h-full border-r border-gray-200 p-4 flex flex-col justify-between relative" style={{ background: '#f9fafb' }}>
          <div>
            <div className="text-gray-400 text-[9px] font-medium uppercase tracking-wider mb-1">RETURN ADDRESS</div>
            <div className="text-gray-700 text-xs font-bold">Taylor Corporation</div>
            <div className="text-gray-500 text-[10px]">1725 Roe Crest Drive<br />North Mankato, MN</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-gray-400 text-[9px] uppercase tracking-wider">DELIVER TO:</div>
            <div className="text-gray-700 text-xs font-bold">Jane Smith</div>
            <div className="text-gray-600 text-[10px]">123 Main Street<br />Anytown, MN 56001</div>
            <div className="mt-2 px-2 py-1 border border-gray-300 rounded text-[9px] text-center text-gray-500">PRESORTED FIRST CLASS</div>
          </div>
          <div className="absolute top-2 right-2 w-12 h-14 flex items-center justify-center rounded text-[8px] font-bold border" style={{ borderColor: primaryColor, color: primaryColor }}>STAMP</div>
        </div>

        <div className="w-[170px] h-full p-5 flex flex-col justify-between" style={{ background: `${primaryColor}15` }}>
          <div style={anim('0.1s', animated)}>
            {logoDataUrl ? (
              <img src={logoDataUrl} alt={companyName} className="h-8 max-w-[120px] object-contain" />
            ) : (
              <div className="font-bold text-base" style={{ color: primaryColor }}>{companyName}</div>
            )}
          </div>
          <div style={anim('0.3s', animated)}>
            <div className="text-gray-500 text-[10px] mb-2 uppercase tracking-wide">Inside this mailer</div>
            {['Personalized solutions', 'Industry case study', 'Exclusive offer'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-[11px] text-gray-700 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: secondaryColor }} />
                {item}
              </div>
            ))}
          </div>
          <div style={anim('0.5s', animated)}>
            <div className="text-center text-[11px] font-bold py-1.5 rounded-lg text-white" style={{ background: primaryColor }}>
              Open for details →
            </div>
          </div>
        </div>

        <div className="w-[170px] h-full p-5 flex flex-col justify-between relative overflow-hidden" style={{ background: primaryColor }}>
          <div className="absolute inset-0">
            <div className="w-full h-full opacity-15" style={{ background: `linear-gradient(135deg, ${primaryColor}14, ${secondaryColor}10)` }} />
          </div>
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 30% 70%, ${secondaryColor}, transparent 60%)` }} />
          <div className="relative z-10" style={anim('0.2s', animated)}>
            {logoDataUrl ? (
              <img src={logoDataUrl} alt={companyName} className="h-9 max-w-[130px] object-contain brightness-0 invert" />
            ) : (
              <div className="text-white font-bold text-lg">{companyName}</div>
            )}
          </div>
          <div className="relative z-10" style={anim('0.4s', animated)}>
            <div className="text-white font-bold text-xl leading-tight mb-1">Built For<br />Brands Like<br />Yours</div>
            <div className="text-white/70 text-xs">Powered by Taylor Corporation</div>
          </div>
          <div className="relative z-10 text-center py-2 rounded-lg text-sm font-bold text-white" style={{ ...anim('0.6s', animated), background: secondaryColor }}>
            Get Started
          </div>
        </div>
      </div>
    </div>
  );
}

export function LetterMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1200px) rotateY(-3deg) rotateX(2deg)' }}>
      <div className="w-[360px] bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="h-2 w-full" style={{ background: primaryColor }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-5" style={anim('0.1s', animated)}>
            <div>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-9 max-w-[130px] object-contain" />
              ) : (
                <div className="font-bold text-xl" style={{ color: primaryColor }}>{companyName}</div>
              )}
              <div className="text-gray-400 text-[9px] mt-1">1 Company Drive | Minneapolis, MN</div>
            </div>
            <div className="text-right text-[10px] text-gray-400">
              <div>June 11, 2025</div>
              <div>Ref: TC-{companyName.slice(0, 3).toUpperCase()}-001</div>
            </div>
          </div>
          <div style={anim('0.2s', animated)}>
            <div className="text-gray-700 text-xs mb-3">Dear Jane,</div>
            <div className="text-gray-600 text-xs leading-relaxed mb-3">
              We've put together a personalized overview of how Taylor Corporation can help{' '}
              <span className="font-semibold" style={{ color: primaryColor }}>{companyName}</span>{' '}
              streamline print, packaging, and fulfillment operations.
            </div>
          </div>
          <div className="space-y-2 mb-4" style={anim('0.3s', animated)}>
            {['Consolidate vendors into one program', 'Consistent brand across all locations', 'Real-time inventory visibility'].map((item) => (
              <div key={item} className="flex items-start gap-2 text-[11px] text-gray-600">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: primaryColor }}>
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
          <div style={anim('0.4s', animated)}>
            <div className="inline-block px-4 py-2 rounded-lg text-xs font-bold text-white mb-4" style={{ background: secondaryColor }}>
              View Full Proposal →
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 text-[9px] text-gray-400 flex items-center gap-1.5" style={anim('0.5s', animated)}>
            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: primaryColor }}>
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            Taylor Corporation — Print | Packaging | Fulfillment | CCM
          </div>
        </div>
      </div>
    </div>
  );
}
