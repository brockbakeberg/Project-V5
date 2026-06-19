import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Building2, Palette, User, FileText, X, CheckCircle, Globe, Loader2, Sparkles, AlertCircle, ImageIcon, ArrowRight, Search } from 'lucide-react';
import type { Prospect } from '../types';

interface Props {
  initial: Prospect;
  onComplete: (prospect: Prospect) => void;
}

const INDUSTRIES = [
  'Retail', 'Food & Beverage', 'Financial Services', 'Healthcare',
  'Manufacturing', 'Automotive', 'Restaurant', 'Hospitality', 'Education', 'Other',
];

const PRESET_PALETTES = [
  { name: 'Navy', primary: '#1e3a8a', secondary: '#3b82f6' },
  { name: 'Forest', primary: '#14532d', secondary: '#22c55e' },
  { name: 'Crimson', primary: '#7f1d1d', secondary: '#ef4444' },
  { name: 'Amber', primary: '#78350f', secondary: '#f59e0b' },
  { name: 'Slate', primary: '#1e293b', secondary: '#64748b' },
  { name: 'Teal', primary: '#134e4a', secondary: '#14b8a6' },
];

interface LogoCandidate {
  url: string;
  source: string;
  label: string;
}

interface ScrapeResult {
  logo_candidates: LogoCandidate[];
  primary_color: string | null;
  secondary_color: string | null;
  company_name: string | null;
  description: string | null;
}

interface ResolvedLogo extends LogoCandidate {
  dataUrl: string | null;
  loading: boolean;
  failed: boolean;
}

// Pull the dominant brand colors straight out of the logo image (runs in-browser).
function extractBrandColors(dataUrl: string): Promise<{ primary: string; secondary: string } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const N = 64;
        const canvas = document.createElement('canvas');
        canvas.width = N; canvas.height = N;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0, N, N);
        const { data } = ctx.getImageData(0, 0, N, N);
        const buckets: Record<string, { count: number; r: number; g: number; b: number; sat: number }> = {};
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue;
          const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
          if (mx > 242 && mn > 242) continue; // near-white background
          const sat = mx === 0 ? 0 : (mx - mn) / mx;
          const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
          const bkt = buckets[key] || (buckets[key] = { count: 0, r: 0, g: 0, b: 0, sat: 0 });
          bkt.count++; bkt.r += r; bkt.g += g; bkt.b += b; bkt.sat = sat;
        }
        const arr = Object.values(buckets).map((b) => ({
          r: Math.round(b.r / b.count), g: Math.round(b.g / b.count), b: Math.round(b.b / b.count),
          count: b.count, sat: b.sat,
        }));
        if (!arr.length) { resolve(null); return; }
        // Favor vivid, frequent colors as the primary brand color.
        arr.sort((x, y) => (y.count * (0.4 + y.sat)) - (x.count * (0.4 + x.sat)));
        const toHex = (c: { r: number; g: number; b: number }) =>
          '#' + [c.r, c.g, c.b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
        const primary = arr[0];
        const different = arr.find((c) => Math.abs(c.r - primary.r) + Math.abs(c.g - primary.g) + Math.abs(c.b - primary.b) > 90);
        resolve({ primary: toHex(primary), secondary: toHex(different || arr[1] || primary) });
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

export default function ProspectSetup({ initial, onComplete }: Props) {
  const [form, setForm] = useState<Prospect>(initial);
  const [dragOver, setDragOver] = useState(false);
  const [logoChosen, setLogoChosen] = useState(!!initial.logo_data_url);
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [logoCandidates, setLogoCandidates] = useState<ResolvedLogo[]>([]);
  const [selectedCandidateIdx, setSelectedCandidateIdx] = useState<number | null>(null);
  const [scrapedOnce, setScrapedOnce] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const set = useCallback(<K extends keyof Prospect>(k: K, v: Prospect[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  }, []);

  // Auto-fill brand colors from a chosen logo.
  const applyLogoColors = useCallback((dataUrl: string) => {
    extractBrandColors(dataUrl).then((c) => {
      if (c) { set('primary_color', c.primary); set('secondary_color', c.secondary); }
    });
  }, [set]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      set('logo_data_url', dataUrl);
      setLogoChosen(true);
      setLogoCandidates([]);
      setSelectedCandidateIdx(null);
      applyLogoColors(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [set, applyLogoColors]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const fetchLogoAsDataUrl = useCallback(async (url: string): Promise<string | null> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors',
      });
      clearTimeout(timeout);
      if (!response.ok) return null;
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) return null;
      if (blob.size > 400000) return null;
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || null);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }, []);

  const resolveCandidates = useCallback(async (candidates: LogoCandidate[]) => {
    const resolved: ResolvedLogo[] = candidates.map((c) => ({
      ...c,
      dataUrl: null,
      loading: true,
      failed: false,
    }));
    setLogoCandidates(resolved);

    // Resolve top candidates in parallel (up to 4)
    const toResolve = resolved.slice(0, 4);
    const results = await Promise.all(
      toResolve.map(async (c) => {
        const dataUrl = await fetchLogoAsDataUrl(c.url);
        return { url: c.url, dataUrl, failed: !dataUrl };
      })
    );

    setLogoCandidates((prev) =>
      prev.map((c) => {
        const result = results.find((r) => r.url === c.url);
        if (result) {
          return { ...c, dataUrl: result.dataUrl, loading: false, failed: result.failed };
        }
        return { ...c, loading: false, failed: true };
      })
    );

    // Auto-select the first successful candidate
    const firstSuccessIdx = results.findIndex((r) => r.dataUrl);
    if (firstSuccessIdx >= 0) {
      const dataUrl = results[firstSuccessIdx].dataUrl!;
      set('logo_data_url', dataUrl);
      setLogoChosen(true);
      setSelectedCandidateIdx(firstSuccessIdx);
      applyLogoColors(dataUrl);
    }
  }, [fetchLogoAsDataUrl, set, applyLogoColors]);

  const doScrape = useCallback(async (url: string) => {
    if (!url.trim()) return;
    setScraping(true);
    setScrapeError(null);
    setLogoCandidates([]);
    setSelectedCandidateIdx(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/scrape-company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const data: ScrapeResult = await response.json();

      if (data.company_name && !form.company_name) {
        set('company_name', data.company_name);
      }
      if (data.description && !form.notes) {
        set('notes', data.description);
      }
      if (data.primary_color) {
        set('primary_color', data.primary_color);
      }
      if (data.secondary_color) {
        set('secondary_color', data.secondary_color);
      }

      if (data.logo_candidates.length > 0) {
        await resolveCandidates(data.logo_candidates);
      }

      setScrapedOnce(true);
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : 'Failed to research website');
    } finally {
      setScraping(false);
    }
  }, [form.company_name, form.notes, set, resolveCandidates]);

  // Auto-scrape when URL is entered (debounced)
  useEffect(() => {
    const url = form.website_url.trim();
    if (!url || url.length < 4) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doScrape(url);
    }, 1200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [form.website_url, doScrape]);

  const handleSelectCandidate = useCallback((idx: number) => {
    const candidate = logoCandidates[idx];
    if (!candidate?.dataUrl) return;
    setSelectedCandidateIdx(idx);
    set('logo_data_url', candidate.dataUrl);
    setLogoChosen(true);
    applyLogoColors(candidate.dataUrl);
  }, [logoCandidates, set, applyLogoColors]);

  const handleRemoveLogo = useCallback(() => {
    set('logo_data_url', '');
    setLogoChosen(false);
    setSelectedCandidateIdx(null);
  }, [set]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name.trim() || !logoChosen) return;
    onComplete(form);
  };

  const selectableCandidates = logoCandidates.filter((c) => c.dataUrl && !c.failed);
  const hasCandidates = logoCandidates.length > 0;
  const anyLoading = logoCandidates.some((c) => c.loading);
  const canGenerate = form.company_name.trim() && logoChosen;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Prospect Details</h2>
        <p className="text-gray-500">Enter a website URL to auto-fetch brand info, then pick a logo to generate mockups.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Website URL */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" /> Company Website
          </h3>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={form.website_url}
              onChange={(e) => { set('website_url', e.target.value); setScrapeError(null); }}
              placeholder="company.com — logos and brand info will auto-load"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-taylor-500/20 focus:border-taylor-400"
            />
            {scraping && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-taylor-600 animate-spin" />
            )}
          </div>

          {scrapeError && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{scrapeError}</div>
            </div>
          )}

          {scrapedOnce && !scraping && !scrapeError && selectableCandidates.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <div>Found {selectableCandidates.length} logo{selectableCandidates.length !== 1 ? 's' : ''} from {form.website_url}. Pick one below!</div>
            </div>
          )}
        </div>

        {/* LOGO SELECTOR — the hero section, blocking until chosen */}
        <div className={`rounded-2xl border-2 p-6 space-y-5 transition-all ${
          logoChosen
            ? 'border-green-200 bg-green-50/30'
            : hasCandidates || form.website_url.trim()
              ? 'border-taylor-300 bg-taylor-50/30 shadow-lg shadow-taylor-700/5'
              : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
              style={{ color: logoChosen ? '#16a34a' : hasCandidates || form.website_url.trim() ? '#1e3a8a' : '#6b7280' }}>
              {logoChosen ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
              {logoChosen ? 'Logo Selected' : 'Choose a Logo'}
            </h3>
            {!logoChosen && (hasCandidates || form.website_url.trim()) && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-taylor-700 text-white animate-pulse">
                Required
              </span>
            )}
          </div>

          {!logoChosen && !hasCandidates && !scraping && (
            <p className="text-sm text-gray-500">
              {form.website_url.trim()
                ? 'Enter a website above and we\'ll find logos automatically.'
                : 'Enter a website URL above or upload a logo manually — you must pick a logo before generating mockups.'}
            </p>
          )}

          {/* Candidate Cards — large, prominent */}
          {hasCandidates && (
            <div className="space-y-3">
              <div className="text-xs text-gray-500">
                We found these images on their website. Click to select the best logo:
              </div>
              <div className="grid grid-cols-2 gap-4">
                {logoCandidates.map((candidate, idx) => {
                  const isSelected = idx === selectedCandidateIdx;
                  const isSelectable = candidate.dataUrl && !candidate.loading && !candidate.failed;
                  return (
                    <button
                      key={candidate.url}
                      type="button"
                      onClick={() => isSelectable && handleSelectCandidate(idx)}
                      disabled={!isSelectable}
                      className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-500/30 scale-[1.02]'
                          : isSelectable
                            ? 'border-gray-200 bg-white hover:border-taylor-400 hover:shadow-lg hover:scale-[1.01] cursor-pointer'
                            : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="h-28 flex items-center justify-center rounded-lg bg-white overflow-hidden mb-3 border border-gray-100">
                        {candidate.loading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-taylor-600 animate-spin" />
                            <span className="text-xs text-gray-400">Fetching...</span>
                          </div>
                        ) : candidate.dataUrl ? (
                          <img
                            src={candidate.dataUrl}
                            alt={candidate.label}
                            className="max-h-full max-w-full object-contain p-2"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-gray-700 truncate">{candidate.label}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{candidate.source}</div>
                        </div>
                        {isSelected && (
                          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scanning indicator */}
          {scraping && !hasCandidates && (
            <div className="flex items-center justify-center py-8 gap-3 text-taylor-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-medium">Scanning website for logos...</span>
            </div>
          )}

          {/* Selected logo preview */}
          {logoChosen && form.logo_data_url && (
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-green-200">
              <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                <img src={form.logo_data_url} alt="Selected logo" className="max-h-full max-w-full object-contain p-1.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Logo selected for all mockups
                </div>
                <div className="text-xs text-gray-500 mt-0.5">This logo will appear on every mockup. Click to change or remove.</div>
              </div>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Manual upload — always available */}
          {!logoChosen && !hasCandidates && !scraping && (
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-taylor-400 bg-taylor-50'
                  : 'border-gray-300 hover:border-taylor-300 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-600">Or drop a logo here to upload</div>
              <div className="text-xs text-gray-400 mt-1">PNG with transparency works best</div>
            </div>
          )}

          {/* Change logo link when one is chosen */}
          {logoChosen && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs text-taylor-600 hover:text-taylor-800 font-medium transition-colors"
              >
                Upload a different logo
              </button>
              {hasCandidates && selectableCandidates.length > 1 && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-xs text-taylor-600 hover:text-taylor-800 font-medium transition-colors"
                >
                  Choose a different candidate
                </button>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Company Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.company_name}
                onChange={(e) => set('company_name', e.target.value)}
                placeholder="Acme Corporation"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-taylor-500/20 focus:border-taylor-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Name</label>
              <input
                type="text"
                value={form.contact_name}
                onChange={(e) => set('contact_name', e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-taylor-500/20 focus:border-taylor-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
              <select
                value={form.industry}
                onChange={(e) => set('industry', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-taylor-500/20 focus:border-taylor-400 bg-white"
              >
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <FileText className="inline w-4 h-4 mr-1" /> Notes
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Context for this prospect..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-taylor-500/20 focus:border-taylor-400"
              />
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4" /> Brand Colors
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => set('primary_color', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                />
                <input
                  type="text"
                  value={form.primary_color}
                  onChange={(e) => set('primary_color', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-taylor-500/20 focus:border-taylor-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.secondary_color}
                  onChange={(e) => set('secondary_color', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                />
                <input
                  type="text"
                  value={form.secondary_color}
                  onChange={(e) => set('secondary_color', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-taylor-500/20 focus:border-taylor-400"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">Quick Palettes</div>
            <div className="flex flex-wrap gap-2">
              {PRESET_PALETTES.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => { set('primary_color', p.primary); set('secondary_color', p.secondary); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:border-gray-400 transition-colors"
                >
                  <span className="w-3 h-3 rounded-full" style={{ background: p.primary }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: p.secondary }} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">Preview — these colors apply to all mockups</div>
            <div
              className="h-16 rounded-xl flex items-center justify-center gap-6 px-6 relative overflow-hidden"
              style={{ background: form.primary_color }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle at 80% 50%, ${form.secondary_color}, transparent 60%)`,
                }}
              />
              {form.logo_data_url ? (
                <img src={form.logo_data_url} alt="preview" className="h-8 max-w-[120px] object-contain relative z-10 brightness-0 invert" />
              ) : (
                <span className="relative z-10 text-white font-bold text-lg tracking-wide">
                  {form.company_name || 'Company Name'}
                </span>
              )}
              <div
                className="relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                style={{ background: form.secondary_color }}
              >
                Sample CTA
              </div>
            </div>
          </div>
        </div>

        {/* Generate button — blocked until logo chosen */}
        <button
          type="submit"
          disabled={!canGenerate}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            canGenerate
              ? 'bg-taylor-700 text-white hover:bg-taylor-800 shadow-lg shadow-taylor-700/20 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {logoChosen ? (
            <>
              Generate Mockups <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5" /> Choose a logo to continue
            </>
          )}
        </button>
      </form>
    </div>
  );
}
