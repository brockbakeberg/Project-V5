import type { CSSProperties } from 'react';
import type { BrandProps } from './types';

function anim(delay: string, animated: boolean): CSSProperties {
  return animated ? { animationDelay: delay, opacity: 0, animation: `fadeInUp 0.7s ease-out ${delay} forwards` } : {};
}

export function StatementMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1000px) rotateY(-3deg) rotateX(1.5deg)' }}>
      <div className="w-[360px] bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="h-[3px]" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4" style={anim('0.1s', animated)}>
            <div>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-9 max-w-[140px] object-contain" />
              ) : (
                <div className="font-bold text-xl" style={{ color: primaryColor }}>{companyName}</div>
              )}
              <div className="text-gray-400 text-[9px] mt-0.5">Customer Account Statement</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 text-[9px]">Statement Date</div>
              <div className="font-bold text-sm text-gray-800">June 11, 2025</div>
              <div className="text-gray-500 text-[9px] mt-1">Account #8821-TC</div>
            </div>
          </div>

          <div className="rounded-lg p-3 mb-4" style={{ ...anim('0.2s', animated), background: `${primaryColor}0d`, border: `1px solid ${primaryColor}20` }}>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-600">Account Balance</div>
              <div className="font-bold text-xl" style={{ color: primaryColor }}>$1,248.50</div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-[10px] text-gray-400">Due by July 1, 2025</div>
              <div className="text-[10px] text-green-600 font-medium">Current</div>
            </div>
          </div>

          <div style={anim('0.3s', animated)}>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Recent Activity</div>
            <table className="w-full text-[10px]">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left pb-1">Date</th>
                  <th className="text-left pb-1">Description</th>
                  <th className="text-right pb-1">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  { d: '06/01', desc: 'Print Services', amt: '$480.00' },
                  { d: '06/05', desc: 'Label Program', amt: '$320.50' },
                  { d: '06/10', desc: 'Fulfillment Kit', amt: '$448.00' },
                ].map((row) => (
                  <tr key={row.d} className="border-t border-gray-50">
                    <td className="py-1 text-gray-400">{row.d}</td>
                    <td className="py-1">{row.desc}</td>
                    <td className="py-1 text-right font-medium">{row.amt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 mt-4" style={anim('0.4s', animated)}>
            <div className="flex-1 py-2 rounded-lg text-white text-xs font-bold text-center" style={{ background: primaryColor }}>
              Pay Now
            </div>
            <div className="flex-1 py-2 rounded-lg text-xs font-bold text-center border" style={{ borderColor: primaryColor, color: primaryColor }}>
              View History
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 text-[8px] text-gray-300 flex justify-between" style={anim('0.5s', animated)}>
            <div>Secured by Taylor Corporation CCM</div>
            <div>HIPAA | PCI | SOC 2 Compliant</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmployeeCommsMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1000px) rotateY(-4deg) rotateX(2deg)' }}>
      <div className="w-[340px] bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 flex flex-col gap-4 relative" style={{ background: `${primaryColor}` }}>
          <img
            src="https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=300"
            alt="employee comms background"
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
          />
          <div className="flex items-center justify-between relative z-10" style={anim('0.1s', animated)}>
            <div>
              {logoDataUrl ? (
                <img src={logoDataUrl} alt={companyName} className="h-9 max-w-[130px] object-contain brightness-0 invert" />
              ) : (
                <div className="text-white font-bold text-xl">{companyName}</div>
              )}
              <div className="text-white/60 text-[10px]">Employee Communications</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div className="relative z-10" style={anim('0.25s', animated)}>            <div className="text-white font-bold text-xl">Welcome, Jane!</div>
            <div className="text-white/70 text-xs mt-1">Your onboarding packet is ready</div>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-3" style={anim('0.3s', animated)}>
            {[
              { title: 'Employee Handbook', desc: '2025 Edition', done: true },
              { title: 'Benefits Summary', desc: 'Open Enrollment', done: true },
              { title: 'Paycheck Setup', desc: 'Direct Deposit', done: false },
              { title: 'Company Directory', desc: 'All Locations', done: false },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 py-2.5 px-3 rounded-lg border" style={{ borderColor: item.done ? `${primaryColor}30` : '#e5e7eb', background: item.done ? `${primaryColor}08` : 'white' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: item.done ? primaryColor : '#e5e7eb' }}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16" style={{ color: item.done ? '#fff' : '#9ca3af' }}>
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">{item.title}</div>
                  <div className="text-[10px] text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 py-2.5 rounded-xl text-white text-xs font-bold text-center" style={{ ...anim('0.5s', animated), background: secondaryColor }}>
            Complete Onboarding →
          </div>

          <div className="mt-3 text-center text-[8px] text-gray-300" style={anim('0.6s', animated)}>
            Delivered securely by Taylor Corporation CCM
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaxDocMockup({ companyName, logoDataUrl, primaryColor, secondaryColor, animated }: BrandProps) {
  return (
    <div className="mockup-shadow" style={{ transform: 'perspective(1000px) rotateY(-4deg) rotateX(2deg)' }}>
      <div className="w-[360px] bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100" style={anim('0.1s', animated)}>
          {logoDataUrl ? (
            <img src={logoDataUrl} alt={companyName} className="h-8 max-w-[120px] object-contain" />
          ) : (
            <div className="font-bold text-lg" style={{ color: primaryColor }}>{companyName}</div>
          )}
          <div className="ml-auto text-right">
            <div className="font-bold text-sm text-gray-800">W-2 Form</div>
            <div className="text-[10px] text-gray-400">Tax Year 2025</div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4" style={anim('0.2s', animated)}>
            <div className="p-2.5 rounded-lg border border-gray-100">
              <div className="text-[9px] text-gray-400 uppercase">Employer</div>
              <div className="font-semibold text-xs text-gray-800 mt-0.5">{companyName}</div>
              <div className="text-[9px] text-gray-400">EIN: 45-XXXXXXX</div>
            </div>
            <div className="p-2.5 rounded-lg border border-gray-100">
              <div className="text-[9px] text-gray-400 uppercase">Employee</div>
              <div className="font-semibold text-xs text-gray-800 mt-0.5">Jane A. Smith</div>
              <div className="text-[9px] text-gray-400">SSN: XXX-XX-1234</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4" style={anim('0.3s', animated)}>
            {[
              { box: '1', label: 'Wages', value: '$72,500' },
              { box: '2', label: 'Fed W/H', value: '$14,210' },
              { box: '4', label: 'SS Tax', value: '$4,495' },
            ].map((b) => (
              <div key={b.box} className="p-2 border border-gray-200 rounded text-center">
                <div className="text-[8px] text-gray-400">Box {b.box}</div>
                <div className="text-[9px] font-medium text-gray-600 truncate">{b.label}</div>
                <div className="font-bold text-xs" style={{ color: primaryColor }}>{b.value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg" style={{ ...anim('0.4s', animated), background: `${primaryColor}08`, border: `1px solid ${primaryColor}20` }}>
            <div className="text-xs text-gray-600">Document secured & encrypted</div>
            <div className="flex gap-1">
              {['HIPAA', 'PCI'].map((cert) => (
                <div key={cert} className="px-1.5 py-0.5 rounded text-[8px] font-bold text-white" style={{ background: primaryColor }}>
                  {cert}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 text-center text-[8px] text-gray-300" style={anim('0.5s', animated)}>
            Produced by Taylor Corporation Customer Communications Management
          </div>
        </div>
      </div>
    </div>
  );
}
