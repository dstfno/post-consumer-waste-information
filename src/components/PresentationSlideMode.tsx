import React, { useState, useMemo } from 'react';
import { CountryPCWIDataset } from '../types';
import { exportPresentationToPdf } from '../utils/pdfPresentationExporter';
import {
  renderWasteTypePieChart,
  renderEndApplicationPieChart,
  renderWasteOriginPieChart,
  renderValueChainMassFlowDiagram,
  renderGenerationColumnChart,
  renderCollectionColumnChart,
  renderFacilityGisMap
} from '../utils/pptxChartRenderer';
import { ChevronLeft, ChevronRight, Presentation, FileDown } from 'lucide-react';

interface Props {
  dataset: CountryPCWIDataset;
}

export const PresentationSlideMode: React.FC<Props> = ({ dataset }) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const charts = useMemo(() => {
    return {
      wasteTypePie: renderWasteTypePieChart(dataset),
      endAppPie: renderEndApplicationPieChart(dataset),
      wasteOriginPie: renderWasteOriginPieChart(dataset),
      massFlow: renderValueChainMassFlowDiagram(dataset),
      genCols: renderGenerationColumnChart(dataset),
      colCols: renderCollectionColumnChart(dataset),
      mapCollection: renderFacilityGisMap(
        dataset,
        'Collection',
        `Post-Consumer PVC Waste Collection Facilities in ${dataset.countryName}`
      ),
      mapSorting: renderFacilityGisMap(
        dataset,
        'Sorting & Pretreatment',
        `Sorting and Pretreatment Facilities for Post-Consumer PVC Waste in ${dataset.countryName}`
      ),
      mapConverting: renderFacilityGisMap(
        dataset,
        'Converting (rPVC)',
        `Facilities Converting Post-Consumer PVC Waste into rPVC in ${dataset.countryName}`
      ),
      mapLandfill: renderFacilityGisMap(
        dataset,
        'Landfill Operator',
        `Main Operators of Landfill Sites Handling Post-Consumer PVC Waste in ${dataset.countryName}`
      )
    };
  }, [dataset]);

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportPresentationToPdf(dataset);
    } finally {
      setIsExporting(false);
    }
  };

  const slides = [
    {
      slideNumber: 'Slides 1–4',
      section: 'Socio-Economic & Policy Data',
      title: `${dataset.countryName} — Socio-Economic, Polymer Market & Regulatory Landscape (${dataset.socioEconomic.populationMillions}M pop.)`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-extrabold text-recovinyl-blue uppercase text-xs mb-2">
                Economic & Plastic Production Data (Slide 3)
              </h4>
              <ul className="space-y-1.5 text-slate-800 text-xs">
                <li>
                  • <b>GDP Growth:</b> {dataset.socioEconomic.gdpGrowthPct} | <b>Inflation:</b>{' '}
                  {dataset.socioEconomic.inflationPct} | <b>Unemployment:</b>{' '}
                  {dataset.socioEconomic.unemploymentPct}
                </li>
                <li>
                  • <b>2024 Virgin Plastic Polymers:</b>{' '}
                  {dataset.socioEconomic.virginPolymerKt2024.toLocaleString()} ktons (
                  {dataset.socioEconomic.virginPolymerTrend})
                </li>
                <li>
                  • <b>2024 Recycled Polymers:</b>{' '}
                  {dataset.socioEconomic.recycledPolymerKt2024.toLocaleString()} ktons (
                  {dataset.socioEconomic.recycledPolymerTrend})
                </li>
                <li>
                  • <b>Plastic Recycling Progress:</b>{' '}
                  {dataset.socioEconomic.plasticDomesticRecycledPct}% recycled domestically,{' '}
                  {dataset.socioEconomic.plasticExportedPct}% exported,{' '}
                  {dataset.socioEconomic.plasticIncineratedPct}% incinerated
                </li>
                <li>
                  • <b>2024 PVC Recycled:</b> {dataset.socioEconomic.pvcRecycledKt2024} ktons
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-extrabold text-recovinyl-blue uppercase text-xs mb-2">
                Construction & Polymer Processing Sector (Slide 4)
              </h4>
              <ul className="space-y-1 text-slate-800 text-xs">
                <li>
                  • <b>Construction Sector:</b> {dataset.socioEconomic.constructionGrowth2024Pct} in
                  2024, {dataset.socioEconomic.constructionGrowth2025Pct} in 2025
                </li>
                <li>
                  • <b>H1 2025 Polymer Outlook:</b>{' '}
                  {dataset.socioEconomic.polymerProcessedH1_2025Trend}
                </li>
                <li>
                  • <b>H1 2025 PVC Outlook:</b> {dataset.socioEconomic.pvcProcessedH1_2025Trend}
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-recovinyl-light/70 border border-recovinyl-blue/30">
              <h4 className="font-extrabold text-recovinyl-dark uppercase text-xs mb-2">
                Political, Media & Regulatory Landscape (Slide 4)
              </h4>
              <ul className="space-y-1.5 text-slate-800 text-xs">
                {dataset.socioEconomic.politicalLandscape.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
                <li>
                  • <b>Media & NGO:</b> {dataset.socioEconomic.mediaAndNgoTopic}
                </li>
                <li>
                  • <b>National Policy:</b> {dataset.socioEconomic.nationalPolicyNotes.join(' ')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      slideNumber: 'Slides 5–8',
      section: 'RecoTrace Data & Pie Charts',
      title: `${dataset.countryName} — Recovinyl RecoTrace Data (${dataset.recoTrace.year} Full Year & ${dataset.recoTrace.ytdPeriodLabel})`,
      content: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-4 p-4 rounded-xl bg-recovinyl-light/70 border border-recovinyl-blue/30 space-y-2.5">
              <h4 className="font-extrabold text-recovinyl-dark uppercase">
                Slide 6: RecoTrace {dataset.recoTrace.year} Volumes
              </h4>
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <div>
                  <b>Recycling Input:</b> {dataset.recoTrace.recyclingInputTonnes.toLocaleString()} t
                </div>
                <div>
                  <b>Recycling Output:</b> {dataset.recoTrace.recyclingOutputTonnes.toLocaleString()}{' '}
                  t
                </div>
                <div>
                  <b>Converting Input:</b>{' '}
                  {dataset.recoTrace.convertingInputTonnes.toLocaleString()} t
                </div>
                <div>
                  <b>Converting Output:</b>{' '}
                  {dataset.recoTrace.convertingOutputTonnes.toLocaleString()} t
                </div>
                <div>
                  <b>End Application:</b> {dataset.recoTrace.topEndApplication}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <div>
                  <b>YTD Recycling ({dataset.recoTrace.ytdPeriodLabel}):</b>{' '}
                  {dataset.recoTrace.ytdRecyclingTotalTonnes.toLocaleString()} t
                </div>
                <div>
                  <b>YTD Converting ({dataset.recoTrace.ytdPeriodLabel}):</b>{' '}
                  {dataset.recoTrace.ytdConvertingTotalTonnes.toLocaleString()} t
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <img
                src={charts.wasteTypePie}
                alt="Waste type pie chart"
                className="w-full h-auto rounded-xl border border-slate-200 bg-white shadow-sm"
              />
              <img
                src={charts.endAppPie}
                alt="End application pie chart"
                className="w-full h-auto rounded-xl border border-slate-200 bg-white shadow-sm"
              />
              <img
                src={charts.wasteOriginPie}
                alt="Waste origin pie chart"
                className="w-full h-auto rounded-xl border border-slate-200 bg-white shadow-sm"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      slideNumber: 'Slide 10',
      section: 'Value Chain Mass Flow Diagram',
      title: `${dataset.countryName} — End-to-End Post-Consumer PVC Value Chain Mass Flow Diagram`,
      content: (
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          <img
            src={charts.massFlow}
            alt="Value Chain Mass Flow Diagram"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      )
    },
    {
      slideNumber: 'Slides 11–13',
      section: 'Cards 1 & 2: Generation & Collection Charts + Map',
      title: `${dataset.countryName} — Generation (${dataset.card1.totalGenerated.toLocaleString()} t/a) & Collection (${dataset.card2.totalCollected.toLocaleString()} t/a)`,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <img
              src={charts.genCols}
              alt="Generation Column Chart"
              className="w-full h-auto object-contain"
            />
            <div className="mt-2 text-center font-extrabold text-recovinyl-dark">
              Total - Both: {dataset.card1.totalGenerated.toLocaleString()} t/year
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <img
              src={charts.colCols}
              alt="Collection Column Chart"
              className="w-full h-auto object-contain"
            />
            <div className="mt-2 text-center font-extrabold text-recovinyl-greenDark">
              Total - Both: {dataset.card2.totalCollected.toLocaleString()} t/year
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <img
              src={charts.mapCollection}
              alt="Collection Facilities Map"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )
    },
    {
      slideNumber: 'Slides 14–22',
      section: 'Cards 3 & 4: Sorting, Recycling & Converter GIS Maps',
      title: `${dataset.countryName} — Sorting (${dataset.card3.totalSortedProcessed.toLocaleString()} t), Recycling (${dataset.card4.totalRecycledOutput.toLocaleString()} t) & Uptake (${dataset.card4.totalUptakeTonnes.toLocaleString()} t)`,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-recovinyl-light/70 border border-recovinyl-blue/30 space-y-3">
            <h4 className="font-extrabold text-recovinyl-dark uppercase">
              Slide 15: Sorting & Pretreatment Facilities ({dataset.facilities.filter((f) => f.stage === 'Sorting & Pretreatment').length} Mapped)
            </h4>
            <img
              src={charts.mapSorting}
              alt="Sorting and Pretreatment Facilities Map"
              className="w-full max-h-[240px] object-contain bg-white rounded-lg border border-slate-200 p-2"
            />
          </div>
          <div className="p-4 rounded-xl bg-recovinyl-greenLight/70 border border-recovinyl-green/40 space-y-3">
            <h4 className="font-extrabold text-recovinyl-greenDark uppercase">
              Slide 20: Facilities Converting Post-Consumer PVC into rPVC ({dataset.facilities.filter((f) => f.stage === 'Converting (rPVC)').length} Mapped)
            </h4>
            <img
              src={charts.mapConverting}
              alt="Converting Facilities Map"
              className="w-full max-h-[240px] object-contain bg-white rounded-lg border border-slate-200 p-2"
            />
          </div>
        </div>
      )
    },
    {
      slideNumber: 'Slides 23–31',
      section: 'Cards 5, 6 & 7: Incineration, Landfill GIS Map & 2030 Outlook',
      title: `${dataset.countryName} — Incineration (${dataset.card5.totalIncineratedTonnes.toLocaleString()} t), Landfilling (${dataset.card6.q6_4_totalLandfilledEstimateTonnes.toLocaleString()} t) & 2030 Strategy`,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs items-center">
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <img
              src={charts.mapLandfill}
              alt="Landfill Operators Map"
              className="w-full max-h-[250px] object-contain"
            />
          </div>
          <div className="lg:col-span-7 space-y-3">
            <div className="p-4 rounded-xl bg-recovinyl-light/70 border border-recovinyl-blue/30 space-y-1.5">
              <h4 className="font-extrabold text-recovinyl-dark uppercase">
                Slides 23–24: Incineration ({dataset.card5.totalIncineratedTonnes.toLocaleString()} t/a)
              </h4>
              <p className="text-slate-800">
                •{' '}
                {dataset.card5.q5_5_incineratedStreams
                  .map((inc) => `${inc.wasteType} (${(inc.inputOrOutputTonnes ?? 0).toLocaleString()} t)`)
                  .join('; ')}
                <br />• {dataset.card5.q5_4_technologyNotes}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-recovinyl-greenLight/70 border border-recovinyl-green/40 space-y-1.5">
              <h4 className="font-extrabold text-recovinyl-greenDark uppercase">
                Slides 28–31: Waste Chain Traceability & 2030 Outlook
              </h4>
              <p className="text-slate-800">
                • <b>Traceability (Q7.1):</b>{' '}
                {dataset.card7.q7_1_traceabilityTools.map((t) => t.name).join(' & ')}.
                <br />• <b>2030 Outlook (Q7.7):</b> {dataset.card7.q7_7_outlook2030}
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSlide = slides[slideIdx];

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-lg overflow-hidden">
      {/* Slide Deck Top Bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-recovinyl-dark via-recovinyl-blue to-recovinyl-dark text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Presentation className="w-5 h-5 text-recovinyl-green" />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-recovinyl-green">
              Executive Presentation Deck • {currentSlide.slideNumber} ({currentSlide.section})
            </span>
            <h2 className="text-base font-extrabold">{currentSlide.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-lg bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition disabled:opacity-60"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating 31-Slide PDF...' : 'Export 31-Slide PDF Deck'}</span>
          </button>
          <button
            onClick={() => setSlideIdx((prev) => Math.max(0, prev - 1))}
            disabled={slideIdx === 0}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold px-2">
            {slideIdx + 1} / {slides.length}
          </span>
          <button
            onClick={() => setSlideIdx((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={slideIdx === slides.length - 1}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Canvas with Official Recovinyl / VinylPlus Header Strip */}
      <div className="p-8 min-h-[380px] flex flex-col justify-between bg-gradient-to-br from-white via-white to-recovinyl-light/40">
        <div>
          <div className="flex items-center justify-between border-b-2 border-recovinyl-blue pb-3 mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-recovinyl-blue">
                {dataset.countryName} — Post-Consumer PVC Waste Information Project
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">{currentSlide.title}</h3>
            </div>
            <img
              src="/assets/recovinyl-logo.png"
              alt="Recovinyl Plus Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {currentSlide.content}
        </div>

        {/* Slide Footer & Quick Slide Selector */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  slideIdx === i
                    ? 'bg-recovinyl-blue text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.slideNumber}: {s.section}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Recovinyl / VinylPlus • {dataset.rrrLead}
          </span>
        </div>
      </div>
    </div>
  );
};
