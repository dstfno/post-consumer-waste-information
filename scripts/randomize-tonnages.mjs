#!/usr/bin/env node
/**
 * One-time deterministic tonnage obfuscation for the public demo repo.
 * Seeded scramble — stable across builds; does not use Math.random() at runtime.
 *
 * Usage: node scripts/randomize-tonnages.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SEED = 0x50435749; // 'PCWI'

const FIELD_RE =
  /\b(quantityTonnes|pptxDiagramTonnes|totalQuantityTonnes|recyclingTonnes|incinerationTonnes|landfillingTonnes|inputOrOutputTonnes|xlsxRawRecyclingTonnes|recyclingInputTonnes|recyclingOutputTonnes|convertingInputTonnes|convertingOutputTonnes|ytdRecyclingTotalTonnes|ytdRecyclingForecastTonnes|ytdRecyclingPreConsumerTonnes|ytdRecyclingPostConsumerTonnes|ytdConvertingTotalTonnes|ytdConvertingForecastTonnes|totalRigidGenerated|totalFlexibleGenerated|totalGenerated|totalRigidCollected|totalFlexibleCollected|totalCollected|totalSortedProcessed|totalRigidRecycled|totalFlexibleRecycled|totalMixedRecycled|totalRecycledOutput|totalUptakeTonnes|totalIncineratedTonnes|q6_4_totalLandfilledEstimateTonnes|generatedTonnes|collectedTonnes|recycledTonnes|incineratedTonnes|landfilledTonnes|recoTrace2024OutputTonnes|virginPolymerKt2024|recycledPolymerKt2024|pvcRecycledKt2024|tonnes)\s*:\s*(-?\d+(?:\.\d+)?)/g;

function mix32(h) {
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Deterministic unit float in [0,1) from seed + numeric value. */
function unitFromValue(n) {
  const bits = `${SEED}|${n}`;
  let h = SEED >>> 0;
  for (let i = 0; i < bits.length; i++) {
    h = Math.imul(h ^ bits.charCodeAt(i), 16777619);
  }
  return mix32(h) / 4294967296;
}

/**
 * Plausible synthetic value: same order of magnitude, factor ~0.78–1.22.
 * Zero stays zero. Integers stay integers; one-decimal kt values keep one decimal.
 */
function scramble(n) {
  if (n === 0) return 0;
  const u = unitFromValue(n);
  const factor = 0.78 + u * 0.44;
  const signed = n < 0;
  const abs = Math.abs(n);
  const isDecimal = !Number.isInteger(abs);
  let out;
  if (isDecimal) {
    out = Math.round(abs * factor * 10) / 10;
    if (out === abs) out = Math.round(abs * (factor > 1 ? 1.08 : 0.92) * 10) / 10;
  } else if (abs < 20) {
    out = Math.max(1, Math.round(abs * factor));
    if (out === abs) out = Math.max(1, abs + (u > 0.5 ? 1 : -1));
  } else {
    out = Math.max(1, Math.round(abs * factor));
    if (out === abs) out = Math.max(1, Math.round(abs * (factor > 1 ? 1.07 : 0.93)));
  }
  return signed ? -out : out;
}

function transformSource(src) {
  const mapping = new Map();
  const out = src.replace(FIELD_RE, (full, field, numStr) => {
    const n = Number(numStr);
    if (!Number.isFinite(n)) return full;
    const next = scramble(n);
    mapping.set(numStr, String(next));
    return `${field}: ${next}`;
  });
  return { out, mapping };
}

const targets = [
  'src/data/italy2025.ts',
  'src/data/europeanCountries.ts',
].map((p) => path.join(ROOT, p));

const examples = [];
for (const file of targets) {
  const before = fs.readFileSync(file, 'utf8');
  const { out, mapping } = transformSource(before);
  fs.writeFileSync(file, out);
  console.log(`Updated ${path.relative(ROOT, file)} (${mapping.size} distinct numeric literals touched via field matches)`);
  if (examples.length < 6) {
    for (const [k, v] of mapping) {
      if (examples.length >= 6) break;
      if (k !== v) examples.push(`${k} → ${v}`);
    }
  }
}

console.log('Examples:', examples.join(', '));
console.log('Done. Seed=', SEED);
