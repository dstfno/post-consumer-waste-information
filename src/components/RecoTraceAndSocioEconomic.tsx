import React from 'react';
import { CountryPCWIDataset } from '../types';
import {
  Activity,
  Award,
  BarChart3,
  Building,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Globe2,
  Newspaper,
  PieChart,
  Scale,
  TrendingUp
} from 'lucide-react';

interface Props {
  dataset: CountryPCWIDataset;
}

export const RecoTraceAndSocioEconomic: React.FC<Props> = ({ dataset }) => {
  const { socioEconomic: se, recoTrace: rt } = dataset;
  const recoTraceEstimatedPostConsumer2024 = Math.round(
    (rt.recyclingOutputTonnes * rt.postConsumerSharePct) / 100
  );

  return (
    <div className="space-y-6">
      {/* Top Bridge Card: How RecoTrace Connects to Post-Consumer Waste Information (PCWI) */}
      <div className="bg-gradient-to-r from-recovinyl-dark via-recovinyl-blue to-recovinyl-dark rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/15">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-green text-slate-950 text-xs font-extrabold uppercase">
              Slides 5–8 vs. Slides 9–31 • System Bridge
            </span>
            <h2 className="text-xl font-extrabold mt-1">
              {dataset.flag} {dataset.countryName} — RecoTrace Certified rPVC vs. PCWI Total Waste Chain Reconciliation
            </h2>
            <p className="text-xs text-recovinyl-light mt-0.5">
              RecoTrace tracks certified pre- and post-consumer PVC recycling at registered recyclers/converters. PCWI maps the entire post-consumer iceberg to capture the {(dataset.card6.q6_4_totalLandfilledEstimateTonnes + dataset.card5.totalIncineratedTonnes).toLocaleString()} t currently lost to landfill & incineration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/15">
            <div className="text-[11px] font-bold uppercase text-recovinyl-light">RecoTrace 2024 Output</div>
            <div className="text-2xl font-black mt-1">{rt.recyclingOutputTonnes.toLocaleString()} t</div>
            <div className="text-xs text-recovinyl-light mt-1">
              Includes <b>{rt.preConsumerSharePct}% Pre-Consumer</b> + <b>{rt.postConsumerSharePct}% Post-Consumer</b> (~{recoTraceEstimatedPostConsumer2024.toLocaleString()} t PC)
            </div>
          </div>

          <div className="bg-recovinyl-green/20 rounded-xl p-4 border border-recovinyl-green/40">
            <div className="text-[11px] font-bold uppercase text-recovinyl-greenLight">PCWI Post-Consumer Recycled</div>
            <div className="text-2xl font-black text-recovinyl-green mt-1">
              {dataset.card4.totalRecycledOutput.toLocaleString()} t
            </div>
            <div className="text-xs text-recovinyl-light mt-1">
              Domestic PC recycling output across 5 technologies (Q4.6/4.7)
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/15">
            <div className="text-[11px] font-bold uppercase text-recovinyl-light">PCWI Converter rPVC Uptake</div>
            <div className="text-2xl font-black text-white mt-1">
              {dataset.card4.totalUptakeTonnes.toLocaleString()} t
            </div>
            <div className="text-xs text-recovinyl-light mt-1">
              Matches RecoTrace Converting Output (<b>{rt.convertingOutputTonnes.toLocaleString()} t</b> in 2024)
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/25">
            <div className="text-[11px] font-bold uppercase text-recovinyl-light">Uncaptured PCWI Opportunity</div>
            <div className="text-2xl font-black text-white mt-1">
              {(dataset.card6.q6_4_totalLandfilledEstimateTonnes + dataset.card5.totalIncineratedTonnes).toLocaleString()} t
            </div>
            <div className="text-xs text-recovinyl-light mt-1">
              {dataset.card6.q6_4_totalLandfilledEstimateTonnes.toLocaleString()} t Landfilled + {dataset.card5.totalIncineratedTonnes.toLocaleString()} t Incinerated
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: RecoTrace 2024 & May 2025 YTD Performance (Slides 6, 7, 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RecoTrace 2024 Volumes & Breakdowns (Slide 6) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
                Slide 6 • RecoTrace Full-Year Benchmark ({rt.year})
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                RecoTrace Recycling & Converting Volumes, Waste Origin & End Applications
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-recovinyl-light border border-recovinyl-blue/30 text-xs font-bold text-recovinyl-dark">
              Pre-C {rt.preConsumerSharePct}% / Post-C {rt.postConsumerSharePct}%
            </span>
          </div>

          {/* 4 Metric Cards from Slide 6 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500">Recycling Input</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {rt.recyclingInputTonnes.toLocaleString()} t
              </div>
            </div>
            <div className="p-3 rounded-xl bg-recovinyl-greenLight border border-recovinyl-green/40">
              <div className="text-[11px] font-semibold text-recovinyl-greenDark">Recycling Output</div>
              <div className="text-lg font-black text-recovinyl-greenDark mt-0.5">
                {rt.recyclingOutputTonnes.toLocaleString()} t
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500">Converting Input</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {rt.convertingInputTonnes.toLocaleString()} t
              </div>
            </div>
            <div className="p-3 rounded-xl bg-recovinyl-light border border-recovinyl-blue/30">
              <div className="text-[11px] font-semibold text-recovinyl-blue">Converting Output</div>
              <div className="text-lg font-black text-recovinyl-dark mt-0.5">
                {rt.convertingOutputTonnes.toLocaleString()} t
              </div>
            </div>
          </div>

          {/* Two Column Breakdowns: End Application & Waste Origin (Slide 6 Charts) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* End Application Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
                Converter End Applications (Slide 6 Chart)
              </h4>
              <div className="space-y-2.5">
                {rt.endApplicationBreakdown.map((app) => (
                  <div key={app.label}>
                    <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                      <span>{app.label}</span>
                      <span>
                        {app.tonnes.toLocaleString()} t ({app.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-recovinyl-blue rounded-full"
                        style={{ width: `${app.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waste Origin Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
                Recycled PVC Waste Origin (Slide 6 Chart)
              </h4>
              <div className="space-y-2 max-h-[210px] overflow-y-auto pr-1">
                {rt.wasteOriginBreakdown.map((orig) => (
                  <div key={orig.label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 truncate pr-2">{orig.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            orig.pvcType === 'Flexible PVC' ? 'bg-recovinyl-green' : 'bg-recovinyl-blue'
                          }`}
                          style={{ width: `${Math.min(100, orig.pct * 3)}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900 w-9 text-right">
                        {orig.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slides 7 & 8: YTD May 2025 Performance vs Forecast & Sector Outlooks */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-greenDark">
              Slides 7 & 8 • {rt.ytdPeriodLabel} Follow-Up
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              2025 YTD Volume vs. Annual Target & Sector Outlook
            </h3>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold uppercase text-slate-500">
                  Recycling ({rt.ytdPeriodLabel})
                </div>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {rt.ytdRecyclingTotalTonnes.toLocaleString()} t
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Target: <b>{rt.ytdRecyclingForecastTonnes.toLocaleString()} t</b> (7.5% YTD)
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Pre-C: {rt.ytdRecyclingPreConsumerTonnes.toLocaleString()} t | Post-C: {rt.ytdRecyclingPostConsumerTonnes.toLocaleString()} t
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold uppercase text-slate-500">
                  Converting ({rt.ytdPeriodLabel})
                </div>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {rt.ytdConvertingTotalTonnes.toLocaleString()} t
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Target: <b>{rt.ytdConvertingForecastTonnes.toLocaleString()} t</b>
                </div>
                <div className="text-[10px] text-recovinyl-greenDark font-semibold mt-1">
                  Target expected to be reached (95% achieved last year)
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-recovinyl-light/70 border border-recovinyl-blue/30 text-xs text-recovinyl-dark">
              <b>Semester Reporting Rule Note:</b> {rt.ytdExplanation}
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                2025 Sector-by-Sector Outlook (Slide 8)
              </h4>
              <div className="space-y-2">
                {rt.sectorOutlooks.map((s) => (
                  <div
                    key={s.sector}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-start gap-2"
                  >
                    <span className="font-bold text-slate-900 min-w-[110px] shrink-0">{s.sector}:</span>
                    <span className="text-slate-700">{s.outlook}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Socio-Economic, Polymer Market & Political/Regulatory Context (Slides 3 & 4) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="border-b border-slate-200 pb-3 mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
              Slides 3 & 4 • National Socio-Economic & Regulatory Context
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              {dataset.countryName} Macroeconomic Indicators, Plastics Market & Policy Landscape ({se.populationMillions}M pop.)
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-recovinyl-greenLight border border-recovinyl-green/40 text-xs font-bold text-recovinyl-greenDark">
            VinylPlus Product Label → CAM Public Procurement Bonus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Macro & Construction */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-recovinyl-blue" />
              Macroeconomics & Construction Sector
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">GDP Growth</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{se.gdpGrowthPct}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Inflation</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{se.inflationPct}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Unemployment</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{se.unemploymentPct}</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-900">Construction & Polymer Processing Outlook:</div>
              <div className="flex justify-between text-slate-700">
                <span>Construction Sector 2024:</span>
                <b className="text-recovinyl-greenDark">{se.constructionGrowth2024Pct}</b>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Construction Sector 2025:</span>
                <b className="text-recovinyl-dark">{se.constructionGrowth2025Pct}</b>
              </div>
              <div className="pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                • All polymers processed: <b>{se.polymerProcessedH1_2025Trend}</b>
                <br />• PVC processed: <b>{se.pvcProcessedH1_2025Trend}</b>
              </div>
            </div>
          </div>

          {/* Column 2: Plastics & PVC Market Development (Slide 3) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-recovinyl-blue" />
              Plastics & PVC Market (Slide 3)
            </h4>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div>
                <span className="text-slate-500 block text-[11px]">Converted Virgin Plastic Polymers (2024):</span>
                <span className="text-sm font-black text-slate-900">{se.virginPolymerKt2024.toLocaleString()} ktons</span>
                <span className="text-[11px] text-slate-500 block">{se.virginPolymerTrend}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100">
                <span className="text-slate-500 block text-[11px]">Recycled Polymers (2024):</span>
                <span className="text-sm font-black text-recovinyl-greenDark">{se.recycledPolymerKt2024.toLocaleString()} ktons</span>
                <span className="text-[11px] text-slate-500 block">{se.recycledPolymerTrend}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100">
                <span className="text-slate-500 block text-[11px]">Overall Plastic Waste Fate:</span>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold">
                  <span className="px-2 py-0.5 rounded bg-recovinyl-greenLight text-recovinyl-greenDark">
                    {se.plasticDomesticRecycledPct}% Recycled
                  </span>
                  <span className="px-2 py-0.5 rounded bg-recovinyl-light text-recovinyl-dark">
                    {se.plasticExportedPct}% Exported
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    {se.plasticIncineratedPct}% Incinerated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Political, Media & Regulatory Landscape (Slide 4) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-recovinyl-blue" />
              Policy, Media & Regulatory Radar (Slide 4)
            </h4>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-2">
              <div>
                <div className="font-bold text-slate-900">Political & EPR Developments:</div>
                <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 mt-0.5">
                  {se.politicalLandscape.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-1.5 border-t border-slate-100">
                <div className="font-bold text-slate-900">Media & NGO Discourse:</div>
                <p className="text-[11px] text-slate-700 mt-0.5">{se.mediaAndNgoTopic}</p>
                {se.mediaSourceUrl && (
                  <a
                    href={se.mediaSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-recovinyl-blue hover:underline mt-1"
                  >
                    <span>View Lancet eBioMedicine Study (2025)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="pt-1.5 border-t border-slate-100">
                <div className="font-bold text-slate-900">National Policy Advantage:</div>
                <p className="text-[11px] text-recovinyl-greenDark font-medium mt-0.5">
                  {se.nationalPolicyNotes.join(' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
