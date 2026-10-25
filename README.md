# Post-Consumer Waste Information (PCWI)

Vite + React + TypeScript app for Recovinyl / VinylPlus Post-Consumer PVC Waste Information (PCWI Europe).

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
