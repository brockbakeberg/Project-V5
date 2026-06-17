import { supabase } from './supabase';

export interface GenerateImageArgs {
  company: string;
  product: string; // the product/template name, e.g. "Product Label"
  setting: 'shelf' | 'storefront' | 'salesfloor' | 'mailbox' | 'desk' | 'warehouse';
  primaryColor?: string;
  secondaryColor?: string;
  brandNotes?: string;
  size?: '1024x1024' | '1536x1024' | '1024x1536';
}

// Calls the generate-mockup-image edge function and returns a data URL.
export async function generateMockupImage(args: GenerateImageArgs): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const res = await fetch(`${supabaseUrl}/functions/v1/generate-mockup-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(error || `HTTP ${res.status}`);
  }

  const { image } = await res.json();
  return image as string; // data:image/png;base64,...
}

// Overlays the prospect's REAL logo onto a generated scene (image models won't
// reproduce an exact uploaded logo). Returns a new data URL. Falls back to the
// original scene if no logo or if the canvas step fails.
export async function overlayLogo(sceneDataUrl: string, logoDataUrl: string): Promise<string> {
  if (!logoDataUrl) return sceneDataUrl;
  try {
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const [scene, logo] = await Promise.all([load(sceneDataUrl), load(logoDataUrl)]);
    const canvas = document.createElement('canvas');
    canvas.width = scene.width;
    canvas.height = scene.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return sceneDataUrl;
    ctx.drawImage(scene, 0, 0);

    const logoW = scene.width * 0.22;
    const logoH = (logo.height / logo.width) * logoW;
    const pad = scene.width * 0.04;
    ctx.drawImage(logo, scene.width - logoW - pad, scene.height - logoH - pad, logoW, logoH);
    return canvas.toDataURL('image/png');
  } catch {
    return sceneDataUrl;
  }
}
