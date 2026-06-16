import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface LogoCandidate {
  url: string;
  source: string; // "logo-img", "header-img", "og-image", "favicon"
  label: string;
}

interface ScrapeResult {
  logo_candidates: LogoCandidate[];
  primary_color: string | null;
  secondary_color: string | null;
  company_name: string | null;
  description: string | null;
}

function resolveUrl(base: string, href: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

function extractFromHtml(html: string, baseUrl: string): ScrapeResult {
  const result: ScrapeResult = {
    logo_candidates: [],
    primary_color: null,
    secondary_color: null,
    company_name: null,
    description: null,
  };

  const seen = new Set<string>();

  const addCandidate = (url: string, source: string, label: string) => {
    const resolved = resolveUrl(baseUrl, url);
    // Deduplicate by resolved URL, skip tiny icons and data URIs
    if (seen.has(resolved) || resolved.startsWith('data:') || resolved.includes('sprite')) return;
    seen.add(resolved);
    result.logo_candidates.push({ url: resolved, source, label });
  };

  // Extract og:site_name or <title>
  const siteNameMatch = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i);
  if (siteNameMatch) result.company_name = siteNameMatch[1].trim();

  if (!result.company_name) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      let title = titleMatch[1].trim();
      title = title.replace(/\s*[|–—-]\s*(Home|Official Site|Welcome|Homepage).*$/i, '').trim();
      if (title.length > 0 && title.length < 80) result.company_name = title;
    }
  }

  // Extract og:description
  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  if (ogDescMatch) result.description = ogDescMatch[1].trim();

  if (!result.description) {
    const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    if (metaDescMatch) result.description = metaDescMatch[1].trim();
  }

  // 1. <img> with "logo" in class, id, src, or alt — highest priority
  const imgTags = html.match(/<img[^>]+>/gi) || [];
  for (const img of imgTags) {
    const srcMatch = img.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) continue;
    const src = srcMatch[1].toLowerCase();
    const altMatch = img.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1].toLowerCase() : '';
    const classMatch = img.match(/class=["']([^"']*)["']/i);
    const cls = classMatch ? classMatch[1].toLowerCase() : '';
    const idMatch = img.match(/id=["']([^"']*)["']/i);
    const id = idMatch ? idMatch[1].toLowerCase() : '';

    if (src.includes('logo') || alt.includes('logo') || cls.includes('logo') || id.includes('logo')) {
      const label = altMatch?.[1] || cls.split(/\s+/).find(c => c.includes('logo')) || 'Logo';
      addCandidate(srcMatch[1], 'logo-img', `Logo: ${label}`);
    }
  }

  // 2. <img> inside <header> or <nav> — likely brand imagery
  const headerMatch = html.match(/<(?:header|nav)[^>]*>[\s\S]{0,3000}<\/(?:header|nav)>/gi) || [];
  for (const header of headerMatch) {
    const headerImgs = header.match(/<img[^>]+>/gi) || [];
    for (const img of headerImgs) {
      const srcMatch = img.match(/src=["']([^"']+)["']/i);
      if (!srcMatch) continue;
      const src = srcMatch[1].toLowerCase();
      if (src.includes('avatar') || src.includes('profile') || src.includes('user') || src.includes('icon-')) continue;
      const altMatch = img.match(/alt=["']([^"']*)["']/i);
      const label = altMatch?.[1] || 'Header Image';
      addCandidate(srcMatch[1], 'header-img', `Header: ${label}`);
    }
  }

  // 3. og:image — social sharing image, often contains logo
  const ogImgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (ogImgMatch) {
    addCandidate(ogImgMatch[1], 'og-image', 'Social Sharing Image');
  }

  // 4. Favicon / apple-touch-icon
  const appleTouchMatch = html.match(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i);
  if (appleTouchMatch) {
    addCandidate(appleTouchMatch[1], 'favicon', 'App Icon');
  }

  const faviconMatch = html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i);
  if (faviconMatch) {
    addCandidate(faviconMatch[1], 'favicon', 'Favicon');
  } else {
    addCandidate('/favicon.ico', 'favicon', 'Favicon');
  }

  // Extract colors from meta theme-color
  const themeColorMatch = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i);
  if (themeColorMatch) result.primary_color = themeColorMatch[1].trim();

  // msapplication-TileColor as secondary
  const tileColorMatch = html.match(/<meta[^>]+name=["']msapplication-TileColor["'][^>]+content=["']([^"']+)["']/i);
  if (tileColorMatch) result.secondary_color = tileColorMatch[1].trim();

  // Extract colors from CSS custom properties
  const cssVarMatches = html.match(/--[a-zA-Z0-9-]*color[a-zA-Z0-9-]*\s*:\s*([^;}{]+)/gi) || [];
  const foundColors: string[] = [];
  for (const m of cssVarMatches) {
    const value = m.split(':')[1].trim();
    if (/^#[0-9a-fA-F]{3,8}$/.test(value) || /^rgb[a]?\(/.test(value)) {
      foundColors.push(value);
    }
  }

  // Extract inline style colors
  const styleColorMatches = html.match(/(?:background-?color|color)\s*:\s*(#[0-9a-fA-F]{3,8}|rgb[a]?\([^)]+\))/gi) || [];
  for (const m of styleColorMatches) {
    const value = m.split(':')[1].trim();
    foundColors.push(value);
  }

  if (!result.primary_color && foundColors.length > 0) {
    result.primary_color = foundColors[0];
  }
  if (!result.secondary_color && foundColors.length > 1) {
    result.secondary_color = foundColors[1];
  }

  // Normalize hex colors to 6-char
  for (const key of ['primary_color', 'secondary_color'] as const) {
    const c = result[key];
    if (c && /^#[0-9a-fA-F]{3}$/.test(c)) {
      result[key] = `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
    }
  }

  // Cap at 6 candidates
  result.logo_candidates = result.logo_candidates.slice(0, 6);

  return result;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'url is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let html: string;
    try {
      const response = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TaylorBot/1.0; +https://taylor.com)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      });
      html = await response.text();
    } catch (fetchErr) {
      clearTimeout(timeout);
      if (!normalizedUrl.includes('www.')) {
        const wwwUrl = normalizedUrl.replace(/^(https?:\/\/)/, '$1www.');
        try {
          const controller2 = new AbortController();
          const timeout2 = setTimeout(() => controller2.abort(), 10000);
          const response2 = await fetch(wwwUrl, {
            signal: controller2.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; TaylorBot/1.0; +https://taylor.com)',
              'Accept': 'text/html,application/xhtml+xml',
            },
            redirect: 'follow',
          });
          html = await response2.text();
          normalizedUrl = wwwUrl;
          clearTimeout(timeout2);
        } catch {
          return new Response(JSON.stringify({ error: 'Could not fetch website', details: String(fetchErr) }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } else {
        return new Response(JSON.stringify({ error: 'Could not fetch website', details: String(fetchErr) }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    clearTimeout(timeout);

    const result = extractFromHtml(html, normalizedUrl);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error', details: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
