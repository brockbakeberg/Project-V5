import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface GenBody {
  company: string;
  product: string;
  category?: string;
  setting: string;
  primaryColor?: string;
  secondaryColor?: string;
  brandNotes?: string;
  size?: string;
}

const SETTING_PHRASE: Record<string, string> = {
  shelf: "sitting on a clean, well-lit retail store shelf among similar products",
  storefront: "displayed in a bright retail storefront window, viewed from the sidewalk",
  salesfloor: "on the sales floor of a modern retail store, shoppers softly blurred behind it",
  mailbox: "as a printed direct-mail piece resting in a residential mailbox in natural daylight",
  desk: "as a printed document on a tidy modern office desk with shallow depth of field",
  warehouse: "as a packaged fulfillment kit in a clean distribution warehouse",
};

function buildPrompt(b: GenBody): string {
  const scene = SETTING_PHRASE[b.setting] ?? SETTING_PHRASE.salesfloor;
  const colors = [b.primaryColor, b.secondaryColor].filter(Boolean).join(" and ");
  return [
    `Professional commercial product photography of a ${b.product} for the brand "${b.company}",`,
    `${scene}.`,
    colors ? `Use the brand colors ${colors} prominently.` : "",
    b.brandNotes ? `Brand context: ${b.brandNotes}.` : "",
    "Photorealistic, sharp focus, realistic materials and lighting, advertising quality.",
    "Leave a clean uncluttered area for a logo. No fake logos, brand marks, or text.",
  ].filter(Boolean).join(" ");
}

// FREE image generation via Pollinations (Flux) — no API key, no billing.
async function callImageModel(prompt: string, size: string): Promise<string> {
  const [w, h] = size.split("x").map((n) => parseInt(n, 10) || 1024);
  const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=${w}&height=${h}&model=flux`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  let res: Response;
  try {
    res = await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`image API ${res.status}: ${detail.slice(0, 200)}`);
  }

  const bytes = new Uint8Array(await res.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  const contentType = res.headers.get("content-type") || "image/jpeg";
  return `data:${contentType};base64,${b64}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  try {
    const body = (await req.json()) as GenBody;
    if (!body?.company || !body?.product) {
      return new Response(JSON.stringify({ error: "company and product are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const size = body.size ?? "1024x1024";
    const prompt = buildPrompt(body);
    const image = await callImageModel(prompt, size);
    return new Response(JSON.stringify({ image, prompt }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
