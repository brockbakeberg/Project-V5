# AI Image Generator — installed

The photoreal image generator is now wired into the app. Here's what changed and the two commands left to run.

## What was added

- `src/lib/generateImage.ts` — calls the image function and composites the prospect's real logo onto the result.
- `supabase/functions/generate-mockup-image/index.ts` — the edge function that calls the image model (OpenAI `gpt-image-1` by default).
- `src/components/MockupViewer.tsx` — now has an **AI Photo** button next to Animate/Save. Click it and the current product renders as a photorealistic image staged in a real-world setting (packaging on a shelf, signage on the sales floor, direct mail in a mailbox, etc.), then your prospect's logo is overlaid on top. "Show vector" returns to the original mockup; "Regenerate" makes a new one.

No new npm packages are required.

## Two commands to finish

```bash
# 1. Add your OpenAI key as a Supabase secret (server-side only, never in the browser)
supabase secrets set OPENAI_API_KEY=sk-...

# 2. Deploy the new function
npx supabase functions deploy generate-mockup-image
```

That's it — the AI Photo button works as soon as the function is deployed.

## How the scene is chosen

Each category maps to a setting in `CATEGORY_SETTING` inside `MockupViewer.tsx` (packaging → shelf, signage → sales floor, direct mail → mailbox, and so on). Edit that map to change where products are staged. To swap image providers (Google Imagen, Flux, Stability), edit `callImageModel()` in the edge function — notes are at the bottom of that file.

## Worth knowing

Each render costs roughly a few cents and takes several seconds, so it runs on demand (button click), not automatically. Consider caching results in your `mockup_sessions` table or a Storage bucket so you don't pay to regenerate the same image. And before showing these externally, confirm usage rights for any real store environment depicted plus the prospect's logo — fine for internal pitch comps, worth a sign-off for anything public.
