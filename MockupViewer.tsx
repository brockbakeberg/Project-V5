import type { CSSProperties } from 'react';
import type { BrandProps } from './types';

function anim(delay: string, animated: boolean): CSSProperties {
  return animated ? { animationDelay: delay, opacity: 0, animation: `fadeInUp 0.7s ease-out ${delay} forwards` } : {};
}

export function LabelMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="flex items-center justify-center mockup-shadow" style={{ transform: 'perspective(900px) rotateY(-8deg) rotateX(4deg)' }}>
      <div
        className="w-[200px] h-[300px] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative"
        style={{ background: `linear-gradient(175deg, ${primaryColor}, ${primaryColor}ee)` }}
      >
        <img
          src="https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=300"
          alt="product label background"
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
        />
        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 20% 20%, white, transparent 50%)` }} />
        <div className="h-2 w-full" style={{ background: secondaryColor }} />
        <div className="flex-1 p-5 flex flex-col items-center justify-between relative z-10">
          <div className="text-center" style={anim('0.1s', animated)}>
            {logoDataUrl ? (
              <img src={logoDataUrl} alt={companyName} className="h-12 max-w-[150px] object-contain brightness-0 invert mx-auto mb-2" />
            ) : (
              <div className="text-white font-bold text-lg tracking-wide mb-2">{companyName}</div>
            )}
            <div className="w-full h-px opacity-20" style={{ background: 'white' }} />
          </div>

          <div className="text-center" style={anim('0.3s', animated)}>
            <div className="text-white/70 text-[10px] uppercase tracking-widest mb-1">Premium Series</div>
            <div className="text-white font-bold text-2xl leading-tight mb-1">Product<br />Label</div>
            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold text-white" style={{ background: `${secondaryColor}88` }}>
              {companyName.slice(0, 8)} Edition
            </div>
          </div>

          <div className="w-full" style={anim('0.5s', animated)}>
            <div className="flex justify-between items-end mb-2">
              <div className="text-white/50 text-[8px] uppercase">Net Wt.</div>
              <div className="text-white text-xs font-bold">16 oz / 454g</div>
            </div>
            <div className="w-full h-[32px] bg-white rounded-lg flex items-center justify-center gap-0.5 px-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="rounded-sm" style={{
                  width: i % 3 === 0 ? '3px' : '1.5px',
                  height: i % 5 === 0 ? '28px' : '20px',
                  background: primaryColor,
                  opacity: 0.9
                }} />
              ))}
            </div>
            <div className="text-center text-white/40 text-[8px] mt-1">TC-{companyName.toUpperCase().slice(0, 4)}-001</div>
          </div>
        </div>
        <div className="h-2 w-full" style={{ background: secondaryColor }} />
      </div>
    </div>
  );
}

export function ShrinkSleeveMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="flex items-center justify-center mockup-shadow" style={{ transform: 'perspective(900px) rotateY(-5deg) rotateX(3deg)' }}>
      <div className="relative">
        <div className="w-[160px] h-[340px] relative" style={{
          background: `linear-gradient(to right, ${primaryColor}aa, ${primaryColor}, ${primaryColor}cc, ${primaryColor}, ${primaryColor}aa)`,
          borderRadius: '50% / 8px',
          boxShadow: `inset -20px 0 30px rgba(0,0,0,0.25), inset 20px 0 30px rgba(0,0,0,0.1)`,
        }}>
          <img
            src="https://images.pexels.com/photos/1003914/pexels-photo-1003914.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="bottle sleeve background"
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
            style={{ borderRadius: 'inherit' }}
          />
          <div className="absolute inset-0 opacity-15" style={{
            background: `radial-gradient(ellipse at 30% 20%, white, transparent 50%)`,
            borderRadius: 'inherit',
          }} />

          <div className="absolute inset-0 flex flex-col items-center justify-between py-6 px-4 z-10">
            <div style={anim('0.1s', animated)}>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-10 max-w-[110px] object-contain brightness-0 invert" />
              ) : (
                <div className="text-white font-bold text-base text-center">{companyName}</div>
              )}
            </div>

            <div className="text-center" style={anim('0.3s', animated)}>
              <div className="text-white/60 text-[9px] uppercase tracking-widest mb-1">Premium</div>
              <div className="text-white font-bold text-xl leading-tight text-center">
                360°<br />Brand<br />Wrap
              </div>
              <div className="mt-2 w-full h-px opacity-30" style={{ background: secondaryColor }} />
              <div className="mt-2 text-white/70 text-[10px] text-center">
                12 fl oz | 355ml
              </div>
            </div>

            <div style={anim('0.5s', animated)}>
              <div
                className="px-3 py-1.5 rounded-full text-white text-[10px] font-bold text-center"
                style={{ background: secondaryColor }}
              >
                Recycled Material
              </div>
              <div className="text-white/40 text-[8px] text-center mt-2">
                Taylor Corporation<br />Printed in USA
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[130px] h-4 rounded-full opacity-30"
          style={{ background: primaryColor, filter: 'blur(8px)' }} />
      </div>
    </div>
  );
}

export function CartonMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="flex items-center justify-center mockup-shadow">
      <div className="relative" style={{ transform: 'perspective(900px) rotateY(-18deg) rotateX(8deg)', transformStyle: 'preserve-3d' }}>
        <div className="w-[200px] h-[240px] relative" style={{ background: primaryColor, borderRadius: '8px 8px 4px 4px' }}>
          <img
            src="https://images.pexels.com/photos/3641056/pexels-photo-3641056.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="carton packaging background"
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
            style={{ borderRadius: 'inherit' }}
          />
          <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 80% 20%, white, transparent 50%)` }} />
          <div className="absolute inset-0 flex flex-col items-center justify-between py-5 px-4 z-10">
            <div style={anim('0.1s', animated)}>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-10 max-w-[160px] object-contain brightness-0 invert" />
              ) : (
                <div className="text-white font-bold text-lg">{companyName}</div>
              )}
            </div>
            <div className="text-center" style={anim('0.3s', animated)}>
              <div className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Folding Carton</div>
              <div className="text-white font-bold text-2xl mb-1">Product<br />Name</div>
              <div className="inline-block px-3 py-1 rounded text-[10px] font-bold" style={{ background: secondaryColor, color: '#fff' }}>
                NEW LOOK
              </div>
            </div>
            <div className="text-center" style={anim('0.5s', animated)}>
              <div className="text-white/50 text-[9px]">Made by {companyName}</div>
              <div className="text-white/30 text-[8px]">Taylor Corporation | taylorcorp.com</div>
            </div>
          </div>
        </div>

        <div
          className="absolute top-0 bottom-0 -right-[60px] w-[65px] rounded-r"
          style={{
            background: `${primaryColor}bb`,
            transform: 'rotateY(90deg)',
            transformOrigin: 'left center',
          }}
        >
          <div className="h-full flex items-center justify-center opacity-60">
            <div className="text-white text-[9px] font-bold tracking-wider" style={{ writingMode: 'vertical-rl' }}>
              {companyName.toUpperCase()}
            </div>
          </div>
        </div>

        <div
          className="absolute -top-[30px] left-0 right-0 h-[35px] rounded-t"
          style={{ background: `${primaryColor}dd`, borderBottom: `2px solid ${secondaryColor}` }}
        >
          <div className="h-full flex items-center justify-center">
            <div className="text-white/50 text-[9px]">Open here ▼</div>
          </div>
        </div>
      </div>
    </div>
  );
}
