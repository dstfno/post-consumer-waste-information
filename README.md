# Post-Consumer Waste Information (PCWI)

Vite + React + TypeScript app for Recovinyl / VinylPlus Post-Consumer PVC Waste Information (PCWI Europe).

**Synthetic data notice:** This public demo uses **synthetic / fictionalized data**. Displayed tonnages and polymer kilotonnes were deterministically scrambled (`scripts/randomize-tonnages.mjs`). Facility legal names, headcount/turnover figures, unit economics (€/t), and seed provider contacts were scrubbed or replaced with clearly fictional demo values (`scripts/scrub-sensitive-demo-data.mjs` plus follow-up edits). They are **not** real Recovinyl, VinylPlus, operator, or national reporting statistics. Public brand logos and country geography remain for UI context.

## Local run

```bash
npm install
npm run dev       # http://localhost:5180
npm run build
npm run preview   # http://127.0.0.1:5180 serving dist/
```

### Site password (demo gate)

Visitors see a password screen before the app. Default password is baked in for local/demo use; override at build time with:

```bash
VITE_SITE_PASSWORD=your-shared-secret npm run build
```

**This is a client-side demo gate only.** The expected password is compiled into the JavaScript bundle and can be bypassed by anyone who inspects the built assets. It is soft privacy for a public demo — **not** real authentication or access control.

Unlock persists in `sessionStorage` for the browser tab (refresh stays unlocked; closing the tab requires the password again).

## Deploy on Vercel

1. Import this GitHub repo in [Vercel](https://vercel.com) → **Add New… → Project**.
2. Confirm Vite defaults:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Optional: set Environment Variable `VITE_SITE_PASSWORD` to override the default demo password (rebuild required after changing it).
4. Click **Deploy**.

`vercel.json` rewrites all routes to `/index.html` for SPA routing.
