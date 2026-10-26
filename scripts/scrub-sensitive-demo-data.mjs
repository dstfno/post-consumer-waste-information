#!/usr/bin/env node
/**
 * Deterministic scrub of high-priority sensitive demo fields (facilities + €/t).
 * Seeded — stable across builds. Run once: node scripts/scrub-sensitive-demo-data.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SEED = 0x53435242; // 'SCRB'

function mix32(h) {
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return h >>> 0;
}

function rng(salt) {
  let h = mix32(SEED ^ mix32(salt >>> 0));
  return () => {
    h = mix32(h + 0x9e3779b9);
    return h / 4294967296;
  };
}

function scrambleNum(n, salt) {
  if (n === 0 || n == null || !Number.isFinite(n)) return n;
  const u = rng(salt | Math.round(Math.abs(n) * 1000))();
  const factor = 0.82 + u * 0.36;
  const abs = Math.abs(n);
  const isDecimal = !Number.isInteger(abs);
  let out;
  if (isDecimal) {
    out = Math.round(abs * factor * 10) / 10;
  } else if (abs < 30) {
    out = Math.max(1, Math.round(abs * factor));
  } else {
    out = Math.max(1, Math.round(abs * factor));
  }
  if (out === abs) out = Math.max(1, Math.round(abs * (factor > 1 ? 1.09 : 0.91)));
  return n < 0 ? -out : out;
}

function fmtCostDisplay(min, max) {
  if (min === max) return `${min} €/ton`;
  return `${min} – ${max} €/ton`;
}

function unitFrom(full) {
  if (/€\/tonne/i.test(full)) return '€/tonne';
  if (/€\/ton/i.test(full)) return '€/ton';
  return '€/t';
}

function scrambleEuroRangeText(text, saltBase) {
  if (!text || typeof text !== 'string') return text;
  let i = 0;
  let out = text;
  // "50€/ton to 200€/ton" / "0 to - 20 €/ton"
  out = out.replace(
    /(-?\d+(?:[.,]\d+)?)\s*€\/t(?:on(?:ne)?)?\s+to\s+(-?\d+(?:[.,]\d+)?)\s*€\/t(?:on(?:ne)?)?/gi,
    (full, a, b) => {
      const min = scrambleNum(Number(String(a).replace(',', '.')), saltBase + i++);
      const max = scrambleNum(Number(String(b).replace(',', '.')), saltBase + i++);
      return `${Math.min(min, max)} – ${Math.max(min, max)} ${unitFrom(full)}`;
    }
  );
  out = out.replace(
    /(-?\d+(?:[.,]\d+)?)\s+to\s+(-?\d+(?:[.,]\d+)?)\s*€\/t(?:on(?:ne)?)?/gi,
    (full, a, b) => {
      const min = scrambleNum(Number(String(a).replace(',', '.')), saltBase + i++);
      const max = scrambleNum(Number(String(b).replace(',', '.')), saltBase + i++);
      return `${Math.min(min, max)} – ${Math.max(min, max)} ${unitFrom(full)}`;
    }
  );
  out = out.replace(
    /(-?\d+(?:[.,]\d+)?)\s*[–-]\s*(-?\d+(?:[.,]\d+)?)\s*€\/t(?:on(?:ne)?)?/gi,
    (full, a, b) => {
      const min = scrambleNum(Number(String(a).replace(',', '.')), saltBase + i++);
      const max = scrambleNum(Number(String(b).replace(',', '.')), saltBase + i++);
      return `${Math.min(min, max)} – ${Math.max(min, max)} ${unitFrom(full)}`;
    }
  );
  out = out.replace(/(-?\d+(?:[.,]\d+)?)\s*€\/t(?:on(?:ne)?)?/gi, (full, a) => {
    const v = scrambleNum(Number(String(a).replace(',', '.')), saltBase + i++);
    return `${v} ${unitFrom(full)}`;
  });
  // Bare "67 €" without /t in remarks
  out = out.replace(/(-?\d+(?:[.,]\d+)?)\s*€(?!\/)/g, (full, a) => {
    const v = scrambleNum(Number(String(a).replace(',', '.')), saltBase + i++);
    return `${v} €`;
  });
  return out;
}

const STAGE_STEMS = {
  Collection: [
    'ALBA CIRCOLARE', 'PO VALLEY RECUPERI', 'TIRRENO FLUSSI', 'ADRIATICO RACCOLTA',
    'APENNINE WASTE HUB', 'LAGO MAGGIORE AMBIENTE', 'VENEZIA COAST SERVICES',
    'PADANA ECO LOGISTICA', 'SUD ITALIA RACCOLTE', 'CENTRO ITALIA FLUSSI',
    'NORD EST SERVIZI AMBIENTALI', 'OCCIDENTALE RICICLI', 'ETRUSCA COLLECTION',
    'LIGURE FLUSSI', 'SARDO AMBIENTE DEMO', 'SICULO RACCOLTA DEMO', 'FOGLIA VERDE SRL DEMO',
    'BLU CORRENTE SERVIZI', 'RUBICONE ECO', 'ARNO RACCOLTE', 'TEVERE FLUSSI',
    'BRENTA SERVIZI', 'MINCIO AMBIENTE', 'OMBRONE RICICLI', 'BASENTO DEMO',
    'OFANTO SERVIZI', 'IRPINIA FLUSSI', 'SALENTO RACCOLTA', 'GARGANO ECO',
    'VALLE AOSTA DEMO', 'MOLISE CIRCOLARE', 'ABRUZZO FLUSSI', 'MARCHE RACCOLTE',
    'UMBRIA SERVIZI DEMO', 'LAZIO FLUSSI DEMO', 'CAMPANIA RACCOLTE DEMO',
    'CALABRIA ECO DEMO', 'FRIULI FLUSSI DEMO'
  ],
  'Sorting & Pretreatment': [
    'ALFA SORTING DEMO', 'BETA PRETREAT HUB', 'GAMMA NIR LINE', 'DELTA FLOAT DEMO',
    'EPSILON MULTIUTILITY SORT', 'ZETA GRANULAZIONE', 'ETA OPTICAL SORT',
    'THETA CABLE PREP', 'IOTA RIGID LINE', 'KAPPA FLEX SORT', 'LAMBDA HUB DEMO',
    'MU SEPARAZIONE', 'NU DENSITY LINE', 'XI BULKY SORT', 'OMICRON PREP DEMO',
    'PI STREAM HUB', 'RHO MUNICIPAL SORT', 'SIGMA MULTI SORT', 'TAU REGION HUB',
    'UPSILON LINE DEMO', 'PHI CABLE HUB', 'CHI MIXED SORT', 'PSI RIGID PREP',
    'OMEGA STREAM DEMO', 'NORD SORTING CO', 'CENTRO SORT DEMO', 'SUD PREP HUB'
  ],
  'Converting (rPVC)': [
    'AURORA RIGID CONVERT', 'BORA FLEX COMPOUND', 'CORONA MICRONIZE', 'DOMUS PIPE REUSE',
    'EOS PROFILE LOOP', 'FLORA CABLE COMPOUND', 'GIANO RIGID DEMO', 'HELIO FLEX DEMO'
  ],
  'Landfill Operator': [
    'ALTOPIANO SMALTIMENTO DEMO', 'BASSA VALLE DISCARICA', 'COLLE VERDE SITE',
    'DOSSO NORD LANDFILL', 'EREMO DEMO SITE', 'FIUME SECCO SITE', 'GOLA EST SITE',
    'HILLTOP DEMO LANDFILL', 'ISOLA VERDE SITE', 'JOLLY SITE DEMO', 'KASTEL SITE',
    'LUNA PARK SITE DEMO', 'MONTE BASSO SITE', 'NOCE SITE DEMO', 'ORIZZONTE SITE',
    'PIANO SITE DEMO', 'QUERCIA SITE', 'ROCCA SITE DEMO', 'SELVA SITE', 'TORRE SITE DEMO',
    'UMBRIA SITE DEMO', 'VALLE SITE DEMO', 'WEST RIDGE SITE', 'XENIA SITE DEMO',
    'YARROW SITE', 'ZEFIRO SITE DEMO', 'ALBA SITE DEMO', 'BOSCO SITE', 'CAMPO SITE DEMO',
    'DUNA SITE', 'ERBA SITE DEMO', 'FALCO SITE', 'GIGLIO SITE DEMO', 'HORIZON SITE',
    'IRIS SITE DEMO', 'JUNO SITE', 'KESTREL SITE DEMO', 'LARK SITE DEMO'
  ]
};

const LEGAL = ['SRL', 'SPA', 'S.R.L.', 'S.P.A.', 'COOP DEMO'];

function fictionalName(stage, index) {
  const list = STAGE_STEMS[stage] || STAGE_STEMS.Collection;
  const stem = list[index % list.length];
  const legal = LEGAL[(index * 3) % LEGAL.length];
  return `${stem} ${legal}`;
}

function coarsenCoord(v, salt) {
  const r = rng(salt)();
  const jitter = (r - 0.5) * 0.16; // ~±0.08°
  return Math.round((v + jitter) * 10) / 10; // 1 decimal ≈ city-level
}

function scrubEmployees(emp, salt) {
  if (emp == null) return null;
  const scrambled = scrambleNum(emp, salt);
  if (scrambled >= 500) return Math.round(scrambled / 50) * 50;
  if (scrambled >= 100) return Math.round(scrambled / 10) * 10;
  if (scrambled >= 20) return Math.round(scrambled / 5) * 5;
  return Math.max(1, Math.round(scrambled));
}

function scrubTurnover(t, salt) {
  if (t == null) return null;
  const scrambled = scrambleNum(t, salt + 17);
  if (scrambled >= 100) return Math.round(scrambled);
  if (scrambled >= 10) return Math.round(scrambled * 10) / 10;
  return Math.round(scrambled * 100) / 100;
}

function sizeRawFrom(emp, turn) {
  if (emp == null && turn == null) return 'N.D. (demo)';
  if (emp == null) return `N.D. empl - ~${turn}M€ (demo)`;
  if (turn == null) return `${emp} empl - N.D. (demo)`;
  return `${emp} empl - ~${turn}M€ (demo)`;
}

function scrubFacilitiesBlock(src) {
  const start = src.indexOf('export const ITALY_FACILITIES');
  const end = src.indexOf('export const ITALY_2025_DATASET');
  if (start < 0 || end < 0) throw new Error('ITALY_FACILITIES block not found');
  const before = src.slice(0, start);
  const block = src.slice(start, end);
  const after = src.slice(end);

  const stageCounters = {};
  const scrubbed = block.replace(
    /\{\s*id:\s*'([^']+)',\s*stage:\s*'([^']+)',\s*questionRef:\s*'([^']+)',\s*name:\s*'([^']*)',\s*pvcType:\s*'([^']+)',\s*city:\s*'([^']*)',\s*regionOrProvince:\s*'([^']*)',\s*lat:\s*(-?[\d.]+),\s*lng:\s*(-?[\d.]+),\s*sizeRaw:\s*'([^']*)',\s*employees:\s*(null|-?[\d.]+),\s*turnoverEurMillions:\s*(null|-?[\d.]+)\s*\}/g,
    (full, id, stage, qref, _name, pvc, city, region, lat, lng, _size, empStr, turnStr) => {
      stageCounters[stage] = (stageCounters[stage] || 0) + 1;
      const idx = stageCounters[stage] - 1;
      const salt = mix32(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
      const emp = empStr === 'null' ? null : scrubEmployees(Number(empStr), salt);
      const turn = turnStr === 'null' ? null : scrubTurnover(Number(turnStr), salt);
      const name = fictionalName(stage, idx);
      const newLat = coarsenCoord(Number(lat), salt);
      const newLng = coarsenCoord(Number(lng), salt + 99);
      const sizeRaw = sizeRawFrom(emp, turn);
      return `{ id: '${id}', stage: '${stage}', questionRef: '${qref}', name: '${name}', pvcType: '${pvc}', city: '${city}', regionOrProvince: '${region}', lat: ${newLat.toFixed(1)}, lng: ${newLng.toFixed(1)}, sizeRaw: '${sizeRaw}', employees: ${emp === null ? 'null' : emp}, turnoverEurMillions: ${turn === null ? 'null' : turn} }`;
    }
  );

  const count = Object.values(stageCounters).reduce((a, b) => a + b, 0);
  console.log(`Scrubbed ${count} Italy facilities`);
  return before + scrubbed + after;
}

function scrubCostObjects(src) {
  let i = 0;
  return src.replace(
    /(\{\s*id:\s*'[^']+',\s*stage:\s*'[^']+',\s*questionRef:\s*'[^']+',\s*costType:\s*'[^']+',\s*pvcType:\s*'[^']+',\s*costDisplay:\s*')([^']*)(',\s*minEurPerTon:\s*)(-?[\d.]+)(,\s*maxEurPerTon:\s*)(-?[\d.]+)(,\s*remarks:\s*')([^']*)('\s*\})/g,
    (full, pre, _disp, mid1, minStr, mid2, maxStr, mid3, remarks, end) => {
      const salt = 1000 + i++;
      const min = scrambleNum(Number(minStr), salt);
      const max = scrambleNum(Number(maxStr), salt + 1);
      const lo = Math.min(min, max);
      const hi = Math.max(min, max);
      const disp = fmtCostDisplay(lo, hi);
      const newRemarks = scrambleEuroRangeText(remarks, salt + 50);
      return `${pre}${disp}${mid1}${lo}${mid2}${hi}${mid3}${newRemarks}${end}`;
    }
  );
}

function scrubPriceFields(src) {
  let i = 0;
  let out = src.replace(
    /(priceEurPerTon:\s*')([^']*)'/g,
    (full, pre, val) => `${pre}${scrambleEuroRangeText(val, 2000 + i++)}'`
  );
  out = out.replace(
    /(priceRange:\s*')([^']*)'/g,
    (full, pre, val) => `${pre}${scrambleEuroRangeText(val, 3000 + i++)}'`
  );
  out = out.replace(
    /(impurityRule:\s*')([^']*)'/g,
    (full, pre, val) => `${pre}${scrambleEuroRangeText(val, 4000 + i++)}'`
  );
  return out;
}

function scrubStandaloneEuroInStrings(src) {
  // Card 7 improvements etc. that embed 205–310 €/ton
  return src.replace(
    /(q7_5_generalImprovements:\s*')([^']*)'/g,
    (full, pre, val) => `${pre}${scrambleEuroRangeText(val, 5000)}'`
  );
}

const italyPath = path.join(ROOT, 'src/data/italy2025.ts');
let italy = fs.readFileSync(italyPath, 'utf8');
italy = scrubFacilitiesBlock(italy);
italy = scrubCostObjects(italy);
italy = scrubPriceFields(italy);
italy = scrubStandaloneEuroInStrings(italy);
fs.writeFileSync(italyPath, italy);
console.log('Updated italy2025.ts');

const euPath = path.join(ROOT, 'src/data/europeanCountries.ts');
let eu = fs.readFileSync(euPath, 'utf8');
eu = scrubPriceFields(eu);
fs.writeFileSync(euPath, eu);
console.log('Updated europeanCountries.ts price strings');
console.log('Done. Seed=', SEED);
