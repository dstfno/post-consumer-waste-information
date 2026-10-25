# Post-Consumer Waste Information (PCWI)

Vite + React + TypeScript app for Recovinyl / VinylPlus Post-Consumer PVC Waste Information (PCWI Europe).

**Synthetic data notice:** All displayed tonnages, polymer kilotonnes, and related volume figures in this public repo are **synthetic / randomized for demo purposes**. They are not real Recovinyl, VinylPlus, or national reporting statistics. Structure, labels, countries, and facility names are preserved for UI realism; numeric volumes were deterministically scrambled (seeded one-time transform in `scripts/randomize-tonnages.mjs`) so builds stay stable without `Math.random()` at runtime.

## Local run

```bash
npm install
npm run dev       # http://localhost:5180
npm run build
npm run preview   # http://127.0.0.1:5180 serving dist/
```

No environment variables are required for the default static build.

## Deploy on Vercel

1. Import this GitHub repo in [Vercel](https://vercel.com) → **Add New… → Project**.
2. Confirm Vite defaults:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Leave Environment Variables empty (none required).
4. Click **Deploy**.

`vercel.json` rewrites all routes to `/index.html` for SPA routing.
