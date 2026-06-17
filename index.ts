import type { Prospect } from '../types';

export interface ResearchProduct {
  category: string;
  template: string;
  title: string;
  subtitle: string;
  setting: string;
  why: string;
  proof: string;
}

export interface ResearchCategory {
  id: string;
  fit: 'high' | 'medium' | 'low';
  reason: string;
}

export interface Research {
  summary: string;
  positioning?: string;
  categories: ResearchCategory[];
  products: ResearchProduct[];
  error?: boolean;
}

// Calls the analyze-company edge function. Returns null on any failure so the
// app falls back to its normal (non-AI) behavior and never breaks.
export async function analyzeCompany(prospect: Prospect): Promise<Research | null> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/analyze-company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        company_name: prospect.company_name,
        website_url: prospect.website_url,
        industry: prospect.industry,
        notes: prospect.notes,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !Array.isArray(data.categories)) return null;
    return data as Research;
  } catch {
    return null;
  }
}
