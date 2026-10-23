import React, { useState } from 'react';
import { CountryPCWIDataset } from '../types';
import {
  Euro,
  Cpu,
  AlertOctagon,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Scale,
  Factory,
  ArrowRight
} from 'lucide-react';

interface Props {
  dataset: CountryPCWIDataset;
}

export const EconomicsAndTechMatrix: React.FC<Props> = ({ dataset }) => {
  const maxLandfillTonnes = Math.max(10000, dataset.card6.q6_4_totalLandfilledEstimateTonnes);
  const [divertTonnes, setDivertTonnes] = useState<number>(() =>
    Math.min(maxLandfillTonnes, Math.round(maxLandfillTonnes * 0.25))
  );
  const [selectedTechCost, setSelectedTechCost] = useState<number>(70); // e.g. Electrostatic 70 €/t

  const allCosts = [
    ...dataset.card2.q2_8_costs,
    ...dataset.card3.q3_12_costs,
    ...dataset.card4.q4_13_costs,
    ...dataset.card6.q6_8_costs
  ];

  // Landfill total stack: Transport + Pretreat + Gate + Tax (avg ~258 €/t)
  const avgLandfillStackEur = 258;
  const avoidedLandfillMillions = ((divertTonnes * avgLandfillStackEur) / 1_000_000).toFixed(2);
  const sortingRecyclingCostMillions = ((divertTonnes * (selectedTechCost + 25)) / 1_000_000).toFixed(2);
  const netSystemSavingsMillions = (
    (divertTonnes * (avgLandfillStackEur - (selectedTechCost + 25))) /
    1_000_000
  ).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
            Slides 13, 14, 16, 17, 18, 19, 22, 27 & 29 • Economic & Technical Intelligence
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
            {dataset.flag} {dataset.countryName} — Economics (€/t), Impurity Thresholds & Technologies
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Comparing collection, sorting, and recycling unit costs against mandatory landfill pretreatment, gate fees, and regional eco-taxes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-recovinyl-light border border-recovinyl-blue/30 rounded-xl px-4 py-2.5 text-right">
            <div className="text-[11px] font-bold uppercase text-recovinyl-blue">Full Landfill Burden (Q6.8)</div>
            <div className="text-lg font-black text-recovinyl-dark">205 – 310 €/ton</div>
            <div className="text-[10px] text-recovinyl-blue">Transport + Pretreat + Gate + Tax</div>
          </div>
          <div className="bg-recovinyl-greenLight border border-recovinyl-green/40 rounded-xl px-4 py-2.5 text-right">
            <div className="text-[11px] font-bold uppercase text-recovinyl-greenDark">Sorting + Tech Range (Q3/Q4)</div>
            <div className="text-lg font-black text-recovinyl-greenDark">50 – 150 €/ton</div>
            <div className="text-[10px] text-recovinyl-greenDark">+250–350 €/t if final extrusion</div>
          </div>
        </div>
      </div>

      {/* Interactive Landfill-to-Recycling Economic Simulator */}
      <div className="bg-gradient-to-r from-recovinyl-dark via-recovinyl-blue to-recovinyl-dark rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-green text-slate-950 text-xs font-extrabold uppercase">
              Strategic Simulator
            </span>
            <h3 className="text-lg font-bold mt-1">
              Landfill Diversion & Economic Arbitrage Calculator (Redirecting {dataset.card6.q6_4_totalLandfilledEstimateTonnes.toLocaleString()} t Landfilled PVC)
            </h3>
            <p className="text-xs text-recovinyl-light">
              In {dataset.countryName}, landfilling 1 tonne of pre-treated waste costs <b>205 to 310 €/t</b> (avg ~258 €/t). Simulate diverting tonnage from landfill into targeted sorting & recycling:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-4 bg-white/10 p-4 rounded-xl border border-white/15">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span>Tonnes of Post-Consumer PVC Diverted from Landfill:</span>
                <span className="text-recovinyl-green font-bold">{divertTonnes.toLocaleString()} tonnes/year</span>
              </div>
              <input
                type="range"
                min={5000}
                max={maxLandfillTonnes}
                step={1000}
                value={Math.min(divertTonnes, maxLandfillTonnes)}
                onChange={(e) => setDivertTonnes(Number(e.target.value))}
                className="w-full accent-recovinyl-green cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-recovinyl-light/80 mt-1">
                <span>5,000 t/a</span>
                <span>{Math.round(maxLandfillTonnes * 0.3).toLocaleString()} t/a (~30% of Landfill)</span>
                <span>{maxLandfillTonnes.toLocaleString()} t/a (100% Landfill)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Target Sorting / Separation Technology:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Flotation / Minery', cost: 50 },
                  { label: 'Electrostatic (Hamos)', cost: 70 },
                  { label: 'NIR Optical', cost: 90 },
                  { label: 'Micronization', cost: 150 }
                ].map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setSelectedTechCost(t.cost)}
                    className={`p-2 rounded-lg border text-left transition ${
                      selectedTechCost === t.cost
                        ? 'bg-recovinyl-green text-slate-950 border-recovinyl-green font-bold'
                        : 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-[11px] leading-tight">{t.label}</div>
                    <div className="text-xs font-extrabold mt-0.5">{t.cost} €/t</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-6 grid grid-cols-3 gap-3">
            <div className="bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="text-[11px] font-semibold text-recovinyl-light uppercase">Avoided Landfill Cost</div>
              <div className="text-2xl font-black text-white mt-1">€{avoidedLandfillMillions}M</div>
              <div className="text-[11px] text-recovinyl-light mt-1">At ~258 €/t avg gate + tax + pretreat</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl p-4">
              <div className="text-[11px] font-semibold text-recovinyl-light uppercase">Sorting + Tech Cost</div>
              <div className="text-2xl font-black text-white mt-1">€{sortingRecyclingCostMillions}M</div>
              <div className="text-[11px] text-recovinyl-light mt-1">Manual (25€) + Tech ({selectedTechCost}€/t)</div>
            </div>
            <div className="bg-recovinyl-green/20 border border-recovinyl-green/50 rounded-xl p-4">
              <div className="text-[11px] font-semibold text-recovinyl-greenLight uppercase">Net Chain Advantage</div>
              <div className="text-2xl font-black text-recovinyl-green mt-1">+€{netSystemSavingsMillions}M</div>
              <div className="text-[11px] text-recovinyl-greenLight mt-1">Before rPVC granule sales revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage-by-Stage Economic Cost Breakdown (Q2.8, Q3.12, Q4.13, Q6.8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
            Questions 2.8, 3.12, 4.13 & 6.8
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-0.5 mb-4">
            Unit Economic Costs Across the Post-Consumer PVC Value Chain (€/tonne)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-[11px] uppercase border-b border-slate-200">
                  <th className="py-2.5 px-3 font-bold">Stage (Ref)</th>
                  <th className="py-2.5 px-3 font-bold">Operation / Cost Type</th>
                  <th className="py-2.5 px-3 font-bold">PVC Type</th>
                  <th className="py-2.5 px-3 font-bold text-right">Cost (€/t)</th>
                  <th className="py-2.5 px-3 font-bold">Relative Bar & Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {allCosts.map((c) => {
                  const widthPct = Math.min(100, Math.round((c.maxEurPerTon / 350) * 100));
                  const barColor =
                    c.stage === 'Collection'
                      ? 'bg-recovinyl-blue'
                      : c.stage === 'Sorting & Pretreatment'
                      ? 'bg-recovinyl-dark'
                      : c.stage === 'Recycling'
                      ? 'bg-recovinyl-green'
                      : 'bg-recovinyl-blue/70';
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[11px] text-slate-700">
                          Q{c.questionRef} • {c.stage}
                        </span>
                      </td>
                      <th scope="row" className="py-2.5 px-3 font-bold text-slate-900">
                        {c.costType}
                      </th>
                      <td className="py-2.5 px-3">
                        <span className="text-[11px] font-medium text-slate-600">{c.pvcType}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {c.costDisplay}
                      </td>
                      <td className="py-2.5 px-3 w-56">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${widthPct}%` }} />
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight">{c.remarks}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Impurity & Market Pricing Matrix (Q4.5 & Q3.7) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-greenDark">
              Slide 18 • Question 4.5 & 3.5
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5 mb-2">
              Impurity Concentration Thresholds & Market Pricing (€/t)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              How legacy/undesirable impurities (copper, rubber gaskets, other plastics, UV weathering) dictate recyclability and market value in {dataset.countryName}:
            </p>

            <div className="space-y-3">
              {dataset.card4.q4_5_qualityAndPricingByStream.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-recovinyl-blue/40 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{item.stream}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.pvcType === 'Rigid PVC'
                          ? 'bg-recovinyl-light text-recovinyl-dark border border-recovinyl-blue/30'
                          : 'bg-recovinyl-greenLight text-recovinyl-greenDark border border-recovinyl-green/40'
                      }`}
                    >
                      {item.pvcType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{item.impurityRule}</p>
                  <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Market Price Range:</span>
                    <span className="font-mono font-bold text-recovinyl-greenDark bg-recovinyl-greenLight px-2 py-0.5 rounded border border-recovinyl-green/40">
                      {item.priceRange}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-recovinyl-light/60 border border-recovinyl-blue/30 text-xs text-recovinyl-dark">
            <b>Key Takeaway (Q4.5):</b> For Rigid B&C PVC, keeping impurities <b>&lt; 1%</b> unlocks <b>50–200 €/ton</b> value; exceeding 3% makes sorting cost higher than recyclate value. For Cables, <b>3–5% copper impurity</b> is a technical dead-zone unaccepted by recyclers.
          </div>
        </div>
      </div>

      {/* Top 5 Obstacles to PVC Recycling & Mitigations (Q7.3) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
              Question Card 7 • Q7.3 & Q7.7
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              Top 5 Strategic Obstacles Preventing Post-Consumer PVC Recycling & Proposed Mitigations
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-recovinyl-greenLight text-recovinyl-greenDark text-xs font-bold">
            2030 Target: Double {dataset.countryCode === 'EU' ? 'European' : dataset.countryName} Volumes via Construction EPR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {dataset.card7.q7_3_topObstacles.map((obs) => (
            <div
              key={obs.rank}
              className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-recovinyl-blue text-white text-xs font-black flex items-center justify-center">
                    #{obs.rank}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-recovinyl-light text-recovinyl-dark">
                    {obs.pvcTypeAffected}
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{obs.obstacle}</h4>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase text-recovinyl-greenDark block mb-0.5">
                  Proposed Mitigation:
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed">{obs.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
