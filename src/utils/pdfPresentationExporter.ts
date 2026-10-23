import { jsPDF } from 'jspdf';
import { CountryPCWIDataset } from '../types';
import {
  renderWasteTypePieChart,
  renderEndApplicationPieChart,
  renderWasteOriginPieChart,
  renderValueChainMassFlowDiagram,
  renderGenerationColumnChart,
  renderCollectionColumnChart,
  renderFacilityGisMap
} from './pptxChartRenderer';

// Widescreen 16:9 presentation dimensions in mm (338.67mm x 190.5mm)
const W = 338.67;
const H = 190.5;

const COLORS = {
  blue: [0, 110, 182] as [number, number, number],
  dark: [0, 75, 124] as [number, number, number],
  light: [230, 243, 251] as [number, number, number],
  green: [132, 189, 58] as [number, number, number],
  greenDark: [99, 147, 36] as [number, number, number],
  greenLight: [242, 249, 233] as [number, number, number],
  slate900: [15, 23, 42] as [number, number, number],
  slate700: [51, 65, 85] as [number, number, number],
  slate500: [100, 116, 139] as [number, number, number],
  slate200: [226, 232, 240] as [number, number, number],
  slate50: [248, 250, 252] as [number, number, number],
  white: [255, 255, 255] as [number, number, number]
};

function fmt(val: number | undefined | null): string {
  if (val === undefined || val === null || Number.isNaN(val)) return '0';
  return Math.round(val).toLocaleString('en-US');
}

function fmtSpace(val: number | undefined | null): string {
  if (val === undefined || val === null || Number.isNaN(val)) return '0';
  return Math.round(val)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function cleanText(input: string | undefined | null): string {
  if (!input) return '';
  return String(input)
    .replace(/•/g, '-')
    .replace(/→/g, '->')
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    .replace(/’/g, "'")
    .replace(/‘/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/€/g, 'EUR ')
    .replace(/\u202f/g, ' ')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '');
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const resp = await fetch('/assets/recovinyl-logo.png');
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportPresentationToPdf(
  dataset: CountryPCWIDataset,
  accountSubtitle?: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [W, H],
    compress: true
  });

  const logoDataUrl = await loadLogoDataUrl();
  const isEuropean = dataset.countryCode === 'EU';
  const scopeLabel = isEuropean
    ? 'European Aggregated Summary (12 Countries)'
    : `${dataset.countryName} National Summary`;

  // Pre-render the PowerPoint-matched graphs & GIS maps at high resolution
  const chartWasteTypePie = renderWasteTypePieChart(dataset);
  const chartEndAppPie = renderEndApplicationPieChart(dataset);
  const chartWasteOriginPie = renderWasteOriginPieChart(dataset);
  const chartMassFlowDiagram = renderValueChainMassFlowDiagram(dataset);
  const chartGenerationCols = renderGenerationColumnChart(dataset);
  const chartCollectionCols = renderCollectionColumnChart(dataset);

  const mapCollection = renderFacilityGisMap(
    dataset,
    'Collection',
    `Post-Consumer PVC Waste Collection Facilities in ${dataset.countryName}`
  );
  const mapSorting = renderFacilityGisMap(
    dataset,
    'Sorting & Pretreatment',
    `Sorting and Pretreatment Facilities for Post-Consumer PVC Waste in ${dataset.countryName}`
  );
  const mapConverting = renderFacilityGisMap(
    dataset,
    'Converting (rPVC)',
    `Facilities Converting Post-Consumer PVC Waste into rPVC in ${dataset.countryName}`
  );
  const mapLandfill = renderFacilityGisMap(
    dataset,
    'Landfill Operator',
    `Main Operators of Landfill Sites Handling Post-Consumer PVC Waste in ${dataset.countryName}`
  );

  const drawHeader = (slideNum: number, section: string, title: string, subtitle?: string) => {
    doc.setFillColor(...COLORS.white);
    doc.rect(0, 0, W, H, 'F');

    // Top accent bar
    doc.setFillColor(...COLORS.dark);
    doc.rect(0, 0, W, 3.2, 'F');
    doc.setFillColor(...COLORS.green);
    doc.rect(W * 0.68, 0, W * 0.32, 3.2, 'F');

    // Section badge
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(14, 7.5, 96, 6, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.blue);
    doc.text(cleanText(section.toUpperCase()), 17, 11.5);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15.5);
    doc.setTextColor(...COLORS.slate900);
    doc.text(cleanText(title), 14, 20.5);

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.slate500);
      doc.text(cleanText(subtitle), 14, 25.8);
    }

    // Top-right Recovinyl logo
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', W - 52, 6.5, 38, 12.5);
      } catch {
        // ignore logo error
      }
    }

    // Header divider line
    doc.setDrawColor(...COLORS.slate200);
    doc.setLineWidth(0.35);
    doc.line(14, 28.5, W - 14, 28.5);

    // Bottom footer bar
    doc.setDrawColor(...COLORS.slate200);
    doc.line(14, H - 10.5, W - 14, H - 10.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.dark);
    doc.text(
      cleanText(`Recovinyl / VinylPlus Europe - ${scopeLabel} (${dataset.reportingYear})`),
      14,
      H - 5.5
    );
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.blue);
    doc.text(`Slide ${slideNum} / 31`, W - 14, H - 5.5, { align: 'right' });
  };

  const drawSectionDivider = (slideNum: number, badge: string, title: string, subtitle: string) => {
    doc.setFillColor(...COLORS.dark);
    doc.rect(0, 0, W, H, 'F');

    doc.setFillColor(...COLORS.blue);
    doc.rect(0, 0, W * 0.56, H, 'F');

    doc.setFillColor(...COLORS.green);
    doc.rect(0, H - 7, W, 7, 'F');

    if (logoDataUrl) {
      try {
        doc.setFillColor(...COLORS.white);
        doc.roundedRect(22, 18, 54, 18, 3, 3, 'F');
        doc.addImage(logoDataUrl, 'PNG', 26, 20.5, 46, 13);
      } catch {
        // ignore
      }
    }

    doc.setFillColor(...COLORS.green);
    doc.roundedRect(22, 62, 82, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.slate900);
    doc.text(cleanText(badge.toUpperCase()), 26, 67.3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(...COLORS.white);
    const lines = doc.splitTextToSize(cleanText(title), W - 48);
    doc.text(lines, 22, 86);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(220, 238, 250);
    const subLines = doc.splitTextToSize(cleanText(subtitle), W - 56);
    doc.text(subLines, 22, 114);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.white);
    doc.text(`Slide ${slideNum} / 31`, W - 16, H - 12, { align: 'right' });
  };

  const drawCard = (
    x: number,
    y: number,
    w: number,
    h: number,
    heading: string,
    bodyLines: string[],
    variant: 'blue' | 'green' | 'slate' = 'slate'
  ) => {
    const bg =
      variant === 'blue'
        ? COLORS.light
        : variant === 'green'
        ? COLORS.greenLight
        : COLORS.slate50;
    const border =
      variant === 'blue'
        ? COLORS.blue
        : variant === 'green'
        ? COLORS.green
        : COLORS.slate200;
    const headColor =
      variant === 'blue'
        ? COLORS.dark
        : variant === 'green'
        ? COLORS.greenDark
        : COLORS.slate900;

    doc.setFillColor(...bg);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.35);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...headColor);
    const headWrapped = doc.splitTextToSize(cleanText(heading), w - 8);
    doc.text(headWrapped, x + 4, y + 6.5);

    let curY = y + 6.5 + headWrapped.length * 4.5 + 1.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.3);
    doc.setTextColor(...COLORS.slate700);

    for (const line of bodyLines) {
      const wrapped = doc.splitTextToSize(cleanText(line), w - 8);
      for (const wl of wrapped) {
        if (curY > y + h - 3) break;
        doc.text(wl, x + 4, curY);
        curY += 4.1;
      }
      curY += 1.2;
    }
  };

  const drawTable = (
    x: number,
    y: number,
    w: number,
    headers: string[],
    colFractions: number[],
    rows: string[][],
    maxBottomY = H - 15
  ): number => {
    const colWidths = colFractions.map((f) => f * w);
    const headerH = 7.5;
    doc.setFillColor(...COLORS.dark);
    doc.rect(x, y, w, headerH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.white);

    let cx = x;
    headers.forEach((hText, idx) => {
      const wrapped = doc.splitTextToSize(cleanText(hText), colWidths[idx] - 3);
      doc.text(wrapped[0] || '', cx + 2, y + 4.8);
      cx += colWidths[idx];
    });

    let curY = y + headerH;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    rows.forEach((row, rIdx) => {
      const cellLines = row.map((cell, cIdx) =>
        doc.splitTextToSize(cleanText(cell || '-'), colWidths[cIdx] - 3.5)
      );
      const maxLines = Math.min(3, Math.max(...cellLines.map((cl) => cl.length), 1));
      const rowH = Math.max(6.2, maxLines * 3.6 + 2.4);
      if (curY + rowH > maxBottomY) return;

      doc.setFillColor(...(rIdx % 2 === 0 ? COLORS.white : COLORS.slate50));
      doc.setDrawColor(...COLORS.slate200);
      doc.setLineWidth(0.2);
      doc.rect(x, curY, w, rowH, 'FD');

      let cellX = x;
      cellLines.forEach((cl, cIdx) => {
        doc.setTextColor(...(cIdx === 0 ? COLORS.slate900 : COLORS.slate700));
        doc.setFont('helvetica', cIdx === 0 ? 'bold' : 'normal');
        cl.slice(0, 3).forEach((ln: string, lIdx: number) => {
          doc.text(ln, cellX + 2, curY + 4 + lIdx * 3.5);
        });
        cellX += colWidths[cIdx];
      });
      curY += rowH;
    });

    return curY;
  };

  // =========================================================================
  // SLIDE 1: Cover Slide
  // =========================================================================
  drawSectionDivider(
    1,
    isEuropean ? 'Recovinyl European Executive Summary' : 'Recovinyl National Executive Summary',
    `${dataset.countryName} — Post-Consumer PVC Waste Project`,
    `${accountSubtitle ? `Account / Scope: ${accountSubtitle} | ` : ''}Reporting Year: ${dataset.reportingYear} | Generated: ${fmt(dataset.card1.totalGenerated)} t | Collected: ${fmt(dataset.card2.totalCollected)} t | Recycled: ${fmt(dataset.card4.totalRecycledOutput)} t | Converter rPVC Uptake: ${fmt(dataset.card4.totalUptakeTonnes)} t`
  );

  // =========================================================================
  // SLIDE 2: Section Divider - Socio-Economic Data
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawSectionDivider(
    2,
    'Section 1 - Country Context',
    `Socio-Economic & Polymer Market Data — ${dataset.countryName}`,
    'Macro-economic indicators, virgin plastics & PVC demand, and regulatory framework'
  );

  // =========================================================================
  // SLIDE 3: Socio-Economic Data & Polymer Market
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    3,
    `${dataset.countryName} - Socio-Economic Data`,
    `${dataset.countryName} - Socio-Economic Data - ${dataset.socioEconomic.populationMillions} Million Population`,
    'Macro-economic indicators and plastics/PVC market overview'
  );
  drawCard(
    14,
    33,
    100,
    142,
    'Economic Data',
    [
      `Population: ${dataset.socioEconomic.populationMillions} million`,
      `GDP Growth: ${dataset.socioEconomic.gdpGrowthPct}`,
      `Inflation: ${dataset.socioEconomic.inflationPct}`,
      `Unemployment: ${dataset.socioEconomic.unemploymentPct}`,
      `Construction Sector Growth: ${dataset.socioEconomic.constructionGrowth2024Pct} (2024), ${dataset.socioEconomic.constructionGrowth2025Pct} (2025)`,
      `Facility Directory Mapped: ${dataset.facilities.length} operational sites`
    ],
    'blue'
  );
  drawCard(
    119,
    33,
    102,
    142,
    'Plastic Development & Recycling Progress',
    [
      `2024 Converted Virgin Plastic Polymers: ${dataset.socioEconomic.virginPolymerKt2024} ktons (${dataset.socioEconomic.virginPolymerTrend})`,
      `2024 Recycled Polymers Volume: ${dataset.socioEconomic.recycledPolymerKt2024} ktons (${dataset.socioEconomic.recycledPolymerTrend})`,
      `Domestic Plastic Recycling Rate: ${dataset.socioEconomic.plasticDomesticRecycledPct}%`,
      `Plastic Waste Exported: ${dataset.socioEconomic.plasticExportedPct}%`,
      `Plastic Waste Incinerated: ${dataset.socioEconomic.plasticIncineratedPct}%`,
      `Main Applications: ${dataset.socioEconomic.mainPlasticApplications.join('; ')}`
    ],
    'green'
  );
  drawCard(
    226,
    33,
    98,
    142,
    'Main PVC Applications & PVC Recycling',
    [
      `2024 Certified PVC Recycled: ${dataset.socioEconomic.pvcRecycledKt2024} ktons`,
      `Flexible PVC: ${dataset.socioEconomic.mainFlexiblePvcApps}`,
      `Rigid PVC: ${dataset.socioEconomic.mainRigidPvcApps}`,
      `Post-Consumer PVC Generated: ${fmt(dataset.card1.totalGenerated)} t/a`,
      `Post-Consumer PVC Collected: ${fmt(dataset.card2.totalCollected)} t/a`,
      `Post-Consumer PVC Recycled: ${fmt(dataset.card4.totalRecycledOutput)} t/a`
    ],
    'slate'
  );

  // =========================================================================
  // SLIDE 4: Political, Media & Regulatory Landscape
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    4,
    `${dataset.countryName} - Socio-Economic Data`,
    `${dataset.countryName} - Political, Media & Regulatory Landscape`,
    'Plastics & PVC policy developments, EU & national regulation, and construction sector outlook'
  );
  drawCard(
    14,
    33,
    152,
    68,
    'Political Landscape & Media Discourse',
    [
      ...dataset.socioEconomic.politicalLandscape,
      `Media & Public Discourse: ${dataset.socioEconomic.mediaAndNgoTopic}`
    ],
    'blue'
  );
  drawCard(
    172,
    33,
    152,
    68,
    'Regulatory Landscape & National Policy',
    [
      ...dataset.socioEconomic.euRegulationNotes,
      ...dataset.socioEconomic.nationalPolicyNotes
    ],
    'green'
  );
  drawCard(
    14,
    106,
    310,
    68,
    'Economic & Construction Sector Outlook',
    [
      `Construction Sector: ${dataset.socioEconomic.constructionGrowth2024Pct} in 2024 | ${dataset.socioEconomic.constructionGrowth2025Pct} in 2025`,
      `H1 2025 All Polymer Outlook: ${dataset.socioEconomic.polymerProcessedH1_2025Trend}`,
      `H1 2025 PVC Outlook: ${dataset.socioEconomic.pvcProcessedH1_2025Trend}`
    ],
    'slate'
  );

  // =========================================================================
  // SLIDE 5: Section Divider - RecoTrace Data
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawSectionDivider(
    5,
    'Section 2 - RecoTrace Data',
    `RecoTrace Data — ${dataset.countryName}`,
    'Certified Recovinyl recycling and converting volumes, waste types, end applications, and origins'
  );

  // =========================================================================
  // SLIDE 6: RecoTrace Data + All 3 PowerPoint Pie Charts (image11, image12, image13)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    6,
    `${dataset.countryName} - Recovinyl`,
    `RecoTrace data ${dataset.recoTrace.year} — ${dataset.countryName}`,
    'Certified Recycling & Converting Input/Output, Waste Type (Pre-C vs Post-C), End Application, and Waste Origin'
  );

  drawCard(
    14,
    32,
    92,
    56,
    `Recotrace data ${dataset.recoTrace.year}`,
    [
      'Recycling:',
      `  Input: ${fmtSpace(dataset.recoTrace.recyclingInputTonnes)} t`,
      `  Output: ${fmtSpace(dataset.recoTrace.recyclingOutputTonnes)} t`,
      'Converting:',
      `  Input: ${fmtSpace(dataset.recoTrace.convertingInputTonnes)} t`,
      `  Output: ${fmtSpace(dataset.recoTrace.convertingOutputTonnes)} t`,
      `End application: ${dataset.recoTrace.topEndApplication || 'Pipes'}`
    ],
    'blue'
  );

  // Embed the 3 PowerPoint-matched Pie Charts on Slide 6
  doc.addImage(chartWasteTypePie, 'PNG', 12, 92, 102, 74);
  doc.addImage(chartEndAppPie, 'PNG', 214, 30, 112, 75);
  doc.addImage(chartWasteOriginPie, 'PNG', 112, 80, 146, 95);

  // =========================================================================
  // SLIDE 7: Recovinyl | Recycling YTD & Outlook (Matches PowerPoint Slide 7)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    7,
    `${dataset.countryName} - Recovinyl | Recycling`,
    `${dataset.countryName} – Recovinyl | Recycling`,
    `Total Volume Recycled YTD (${dataset.recoTrace.ytdPeriodLabel}), Forecast vs. Actual, Pre-/Post-Consumer Breakdown & Outlook`
  );
  drawCard(
    14,
    34,
    150,
    140,
    `Total Volume Recycled YTD (${dataset.recoTrace.ytdPeriodLabel}) & Forecast`,
    [
      `Total Volume Recycled YTD (${dataset.recoTrace.ytdPeriodLabel}): ${fmtSpace(dataset.recoTrace.ytdRecyclingTotalTonnes)} tonnes`,
      `Forecast vs. Actual: ${fmtSpace(dataset.recoTrace.ytdRecyclingForecastTonnes)} tonnes (- 7,5% - the target will be reached)`,
      'Pre-/Post-Consumer Breakdown (YTD):',
      `  - Pre-consumer: ${fmtSpace(dataset.recoTrace.ytdRecyclingPreConsumerTonnes)} tonnes`,
      `  - Post-consumer: ${fmtSpace(dataset.recoTrace.ytdRecyclingPostConsumerTonnes)} tonnes`
    ],
    'blue'
  );
  drawCard(
    170,
    34,
    154,
    140,
    'Explanation of Performance & Outlook for Remainder of Year',
    [
      `Explanation of performance: ${dataset.recoTrace.ytdExplanation}`,
      'Outlook for the remainder of the year:',
      ...dataset.recoTrace.sectorOutlooks.map((s) => `  - ${s.sector}: ${s.outlook}`)
    ],
    'green'
  );

  // =========================================================================
  // SLIDE 8: Recovinyl | Converting YTD & Outlook (Matches PowerPoint Slide 8)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    8,
    `${dataset.countryName} - Recovinyl | Converting`,
    `${dataset.countryName} – Recovinyl | Converting`,
    `Total Volume Used YTD (${dataset.recoTrace.ytdPeriodLabel}), Comparison with Forecast & Sectoral Outlook`
  );
  drawCard(
    14,
    34,
    145,
    140,
    'Converting YTD Performance & Forecast',
    [
      `Total volume used YTD: ${fmtSpace(dataset.recoTrace.ytdConvertingTotalTonnes)} tonnes`,
      `Comparison with forecast: ${fmtSpace(dataset.recoTrace.ytdConvertingForecastTonnes)} tonnes, - 0,1%, Same expectations`,
      'Pre-Postconsumer based breakdown (YTD):',
      `  - Pre-consumer: ${fmtSpace(dataset.recoTrace.ytdRecyclingPreConsumerTonnes)} tonnes`,
      `  - Post-consumer: ${fmtSpace(dataset.recoTrace.ytdRecyclingPostConsumerTonnes)} tonnes`,
      `Explanation of performance: ${dataset.recoTrace.ytdExplanation}`
    ],
    'blue'
  );
  drawCard(
    165,
    34,
    159,
    140,
    'Outlook for the Remainder of the Year by Application',
    dataset.recoTrace.sectorOutlooks.map((s) => `${s.sector}: ${s.outlook}`),
    'green'
  );

  // =========================================================================
  // SLIDE 9: Section Divider - Waste Information Project
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawSectionDivider(
    9,
    'Section 3 - Waste Information Project',
    `Post-Consumer PVC Waste Information Project — ${dataset.countryName}`,
    'Comprehensive mass flow balance and Question Cards 1 to 7 analysis'
  );

  // =========================================================================
  // SLIDE 10: Value Chain Mass Flow Diagram (Matches PowerPoint Slide 10 / image14.png)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    10,
    `${dataset.countryName} - Mass Flow Overview`,
    `${dataset.countryName} — End-to-End Post-Consumer PVC Value Chain Mass Flow (t/year)`,
    'Complete mass balance across Generation, Collection, Sorting/Processing, Recycling, Exports, Incineration, Landfilling, and Converter Uptake'
  );
  doc.addImage(chartMassFlowDiagram, 'PNG', 10, 30, W - 20, 146);

  // =========================================================================
  // SLIDE 11: Generation & Collection + Vertical Column Chart (Matches Slide 11 / image15.png)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    11,
    `${dataset.countryName} - Generation and Collection`,
    `Generation & Collection of Rigid and Flexible Post-Consumer PVC Waste (Q 1.1 – Q 2.2)`,
    `Total Generated: ${fmtSpace(dataset.card1.totalGenerated)} t/year (Rigid: ${fmtSpace(dataset.card1.totalRigidGenerated)} t | Flexible: ${fmtSpace(dataset.card1.totalFlexibleGenerated)} t)`
  );

  drawCard(
    14,
    31,
    148,
    46,
    'Generation of Post-Consumer PVC Waste (Q 1.1 & Q 1.2)',
    [
      `Q 1.1.: Main sources of PVC PC-waste: ${dataset.card1.q1_1_mainSources.join('; ')}`,
      `Q 1.2.: Types of PVC PC-waste: Rigid ${fmtSpace(dataset.card1.totalRigidGenerated)} t/a + Flexible ${fmtSpace(dataset.card1.totalFlexibleGenerated)} t/a`
    ],
    'blue'
  );
  drawCard(
    166,
    31,
    158,
    46,
    'Collection Requirements or Schemes (Q 2.1 & Q 2.2)',
    [
      `Q 2.1.: Plastic - Requirements or schemes: ${dataset.card2.q2_1_plasticRequirements.join(' ')}`,
      `Q 2.2.: PVC - Requirements or schemes: ${dataset.card2.q2_2_pvcRequirements.join(' ')}`
    ],
    'green'
  );

  doc.addImage(chartGenerationCols, 'PNG', 14, 79, 212, 98);

  drawCard(
    232,
    92,
    92,
    72,
    `Total - Both: ${fmtSpace(dataset.card1.totalGenerated)} t/year`,
    [
      `Total Rigid PVC: ${fmtSpace(dataset.card1.totalRigidGenerated)} t/year`,
      `Total Flexible PVC: ${fmtSpace(dataset.card1.totalFlexibleGenerated)} t/year`,
      `Number of Waste Streams: ${dataset.card1.q1_2_streams.length}`
    ],
    'blue'
  );

  // =========================================================================
  // SLIDE 12: Collection Column Chart + Collector GIS Map (Matches Slide 12 / image16.png + image17.jpeg)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  const collectorsCount = dataset.facilities.filter((f) => f.stage === 'Collection').length;
  drawHeader(
    12,
    `${dataset.countryName} - Collection`,
    `Collection of Rigid and Flexible Post-Consumer PVC Waste (Q 2.3 – Q 2.5)`,
    `Total Collected: ${fmtSpace(dataset.card2.totalCollected)} t/year (Rigid: ${fmtSpace(dataset.card2.totalRigidCollected)} t | Flexible: ${fmtSpace(dataset.card2.totalFlexibleCollected)} t)`
  );

  drawCard(
    14,
    31,
    156,
    46,
    'Q 2.3. Incentives to Stimulate Collection & Q 2.4 / Q 2.5',
    [
      `Q 2.3.: Incentives to stimulate collection: ${dataset.card2.q2_3_incentives}`,
      `Q 2.4.: Quantities of PVC PC waste collected: Total - Both: ${fmtSpace(dataset.card2.totalCollected)} t/year`,
      `Q 2.5.: Facilities/entities collecting PVC PC waste: ${collectorsCount} mapped entities`
    ],
    'blue'
  );

  doc.addImage(chartCollectionCols, 'PNG', 14, 79, 156, 97);
  doc.addImage(mapCollection, 'PNG', 176, 33, 148, 108);

  drawCard(
    176,
    143,
    148,
    32,
    `Total - Both: ${fmtSpace(dataset.card2.totalCollected)} t/year`,
    [
      `Rigid PVC Collected: ${fmtSpace(dataset.card2.totalRigidCollected)} t/a | Flexible PVC Collected: ${fmtSpace(dataset.card2.totalFlexibleCollected)} t/a`
    ],
    'green'
  );

  // =========================================================================
  // SLIDE 13: Collection Processing / Exports, Stakeholders & Costs (Q2.6 – Q2.8)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    13,
    `${dataset.countryName} - Collection`,
    `Collection: Further Processing / Exports, Stakeholders & Costs (Q 2.6 – Q 2.8)`,
    'Collected PVC waste processed domestically vs. exported, main stakeholders, and economic costs'
  );
  const yAfterQ26 = drawTable(
    14,
    33,
    310,
    [
      'Post-Consumer PVC Waste Type',
      'Processed in or outside country?',
      'If outside: Which country(ies)?',
      'If outside: Waste code(s)?',
      'Type of PVC',
      'Quantity (t/a)'
    ],
    [0.22, 0.22, 0.22, 0.1, 0.12, 0.12],
    dataset.card2.q2_6_exports.map((e) => [
      e.wasteType,
      e.processedLocation,
      e.destinationCountries || '-',
      e.wasteCodes || '-',
      e.pvcType,
      e.totalQuantityTonnes ? fmt(e.totalQuantityTonnes) : '-'
    ]),
    92
  );

  const yAfterQ27 = drawTable(
    14,
    yAfterQ26 + 4,
    310,
    ['Stakeholder Name', 'Affiliation', 'Website', 'City', 'Contact Details'],
    [0.24, 0.28, 0.16, 0.16, 0.16],
    dataset.card2.q2_7_stakeholders.map((s) => [
      s.name,
      s.affiliation,
      s.website,
      s.city,
      s.contact
    ]),
    118
  );

  drawTable(
    14,
    yAfterQ27 + 4,
    310,
    ['Q 2.8. Type of (Economic) Cost', 'Type of PVC', 'Cost (EUR)', 'Remarks'],
    [0.26, 0.16, 0.18, 0.4],
    dataset.card2.q2_8_costs.map((c) => [c.costType, c.pvcType, c.costDisplay, c.remarks])
  );

  // =========================================================================
  // SLIDE 14: Sorting & Pretreatment Requirements & Technologies (Q3.1 – Q3.7)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    14,
    `${dataset.countryName} - Sorting and Pretreatment`,
    `Sorting and Pretreatment of Rigid & Flexible Post-Consumer PVC Waste (Q 3.1 – Q 3.7)`,
    `Total Processed in Sorting & Pretreatment: ${fmt(dataset.card3.totalSortedProcessed)} t/year`
  );
  drawCard(
    14,
    33,
    152,
    46,
    'Q 3.1 – Q 3.2. General & PVC-Specific Requirements',
    [
      `Q 3.1. General: ${dataset.card3.q3_1_generalRequirements.join('; ')}`,
      `Q 3.2. PVC-Specific: ${dataset.card3.q3_2_pvcRequirements}`
    ],
    'blue'
  );
  drawCard(
    172,
    33,
    152,
    46,
    'Q 3.3. Incentives to Support Sorting and Pretreatment',
    [dataset.card3.q3_3_incentives],
    'green'
  );

  drawTable(
    14,
    83,
    310,
    [
      'Post-Consumer PVC Waste Type',
      'Type of PVC',
      'Technique / Technology',
      'Automation Level',
      'Description',
      'Typical Quality & Impurities',
      'Price (EUR/t)'
    ],
    [0.2, 0.1, 0.14, 0.12, 0.14, 0.18, 0.12],
    dataset.card3.q3_7_technologies.map((t) => [
      t.wasteType,
      t.pvcType,
      t.technologyCategory,
      t.automationOrSubTech,
      t.description,
      `${t.typicalQuality} (${t.mainImpurities})`,
      t.priceEurPerTon
    ])
  );

  // =========================================================================
  // SLIDE 15: Sorting & Pretreatment Facilities + GIS Map (Matches Slide 15 / image18.jpeg)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  const sorters = dataset.facilities.filter((f) => f.stage === 'Sorting & Pretreatment');
  drawHeader(
    15,
    `${dataset.countryName} - Sorting and Pretreatment`,
    `Q 3.8. Facilities or Entities Sorting and Pretreating Post-Consumer PVC Waste`,
    `${sorters.length} Sorting & Pretreatment Entities Mapped in ${dataset.countryName}`
  );

  drawTable(
    14,
    33,
    162,
    ['Name of Facility or Entity', 'Type of PVC', 'City', 'Size Information'],
    [0.36, 0.16, 0.2, 0.28],
    (sorters.length > 0 ? sorters : dataset.facilities)
      .slice(0, 16)
      .map((f) => [f.name, f.pvcType, f.city, f.sizeRaw || '-'])
  );

  doc.addImage(mapSorting, 'PNG', 180, 33, 144, 108);

  // =========================================================================
  // SLIDE 16: Sorting Mass Balance Split & Costs (Q3.9 – Q3.12)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    16,
    `${dataset.countryName} - Sorting and Pretreatment`,
    `Sorting Mass Balance Split & Economic Costs (Q 3.9 – Q 3.12)`,
    `Total Processed: ${fmt(dataset.card3.totalSortedProcessed)} t/a | Stakeholders: ${dataset.card3.q3_11_stakeholders}`
  );
  const yAfterQ310 = drawTable(
    14,
    33,
    310,
    [
      'Post-Consumer PVC Waste Type',
      'Processed Where?',
      'Type of PVC',
      'Total Quantity (t/a)',
      'To Recycling (t/a)',
      'To Incineration (t/a)',
      'To Landfilling (t/a)'
    ],
    [0.24, 0.18, 0.12, 0.12, 0.12, 0.11, 0.11],
    dataset.card3.q3_10_massBalance.map((m) => [
      m.wasteType,
      m.processedLocation,
      m.pvcType,
      fmt(m.totalQuantityTonnes),
      fmt(m.recyclingTonnes),
      fmt(m.incinerationTonnes),
      fmt(m.landfillingTonnes)
    ]),
    102
  );

  drawTable(
    14,
    yAfterQ310 + 6,
    310,
    ['Q 3.12. Type of (Economic) Cost', 'Type of PVC', 'Cost (EUR)', 'Remarks'],
    [0.25, 0.15, 0.18, 0.42],
    dataset.card3.q3_12_costs.map((c) => [c.costType, c.pvcType, c.costDisplay, c.remarks])
  );

  // =========================================================================
  // SLIDE 17: Recycling Requirements & Technologies Overview (Q4.1 – Q4.4)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    17,
    `${dataset.countryName} - Recycling`,
    `Recycling of Rigid and Flexible Post-Consumer PVC Waste (Q 4.1 – Q 4.4)`,
    'General requirements, PVC-specific rules, incentives, and recycling technologies deployed'
  );
  drawCard(
    14,
    33,
    148,
    142,
    'Q 4.1 – Q 4.3. Requirements, Schemes & Incentives',
    [
      `Q 4.1. General Requirements / Schemes:\n${dataset.card4.q4_1_generalRequirements.join('; ')}`,
      `Q 4.2. PVC Specific Requirements / Schemes:\n${dataset.card4.q4_2_pvcRequirements}`,
      `Q 4.3. Incentives to Support Recycling:\n${dataset.card4.q4_3_incentives}`
    ],
    'blue'
  );
  drawCard(
    168,
    33,
    156,
    142,
    'Q 4.4. Recycling Technologies Deployed',
    dataset.card4.q4_4_technologiesSummary.map((t) => `${t.name}: ${t.description}`),
    'green'
  );

  // =========================================================================
  // SLIDE 18: Quality of Post-Consumer PVC Waste & Impurity Thresholds (Q4.5)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    18,
    `${dataset.countryName} - Recycling`,
    `Q 4.5. Quality of Post-Consumer PVC Waste & Impurity Thresholds`,
    'Impurity limits, technical acceptance criteria, and price impact per waste stream'
  );
  drawTable(
    14,
    33,
    310,
    ['Waste Stream', 'Type of PVC', 'Impurity Threshold / Rule', 'Price Range (EUR/t)'],
    [0.22, 0.14, 0.44, 0.2],
    dataset.card4.q4_5_qualityAndPricingByStream.map((r) => [
      r.stream,
      r.pvcType,
      r.impurityRule,
      r.priceRange
    ])
  );

  // =========================================================================
  // SLIDE 19: Quantities Recycled & Recyclate Outputs (Q4.6 & Q4.7)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    19,
    `${dataset.countryName} - Recycling`,
    `Q 4.6. Quantities & Recycling Technique | Q 4.7. Quantity Output Recycling`,
    `Total Recycled Output: ${fmt(dataset.card4.totalRecycledOutput)} t/a (Rigid: ${fmt(dataset.card4.totalRigidRecycled)} t | Flexible: ${fmt(dataset.card4.totalFlexibleRecycled)} t | Both: ${fmt(dataset.card4.totalMixedRecycled)} t)`
  );
  const yAfterQ46 = drawTable(
    14,
    33,
    310,
    [
      'Q 4.6. Waste Type',
      'Type of PVC',
      'Recycling Technique',
      'Description',
      'Quantity (t/a)',
      'Output Form',
      'Quality / Impurities',
      'Price (EUR/t)'
    ],
    [0.18, 0.1, 0.14, 0.14, 0.1, 0.1, 0.14, 0.1],
    dataset.card4.q4_6_recyclingByTech.map((t) => [
      t.wasteType,
      t.pvcType,
      t.technologyCategory,
      t.description,
      fmt(t.inputOrOutputTonnes),
      t.outputForm,
      t.typicalQuality,
      t.priceEurPerTon || '-'
    ]),
    102
  );

  drawTable(
    14,
    yAfterQ46 + 5,
    310,
    [
      'Q 4.7. Post-Consumer PVC Waste Type',
      'Type of PVC',
      'Recycling Technique',
      'Recyclate Quantity (t/a)',
      'Typical Quality / Composition',
      'Recyclate Price (EUR/t)'
    ],
    [0.24, 0.12, 0.18, 0.14, 0.18, 0.14],
    dataset.card4.q4_6_recyclingByTech.map((o) => [
      o.wasteType,
      o.pvcType,
      o.description || o.technologyCategory,
      fmt(o.inputOrOutputTonnes),
      o.typicalQuality || '-',
      o.priceEurPerTon || '-'
    ])
  );

  // =========================================================================
  // SLIDE 20: Facilities Converting rPVC + GIS Map (Matches Slide 20 / image19.jpeg)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  const recyclers = dataset.facilities.filter((f) => f.stage === 'Converting (rPVC)');
  drawHeader(
    20,
    `${dataset.countryName} - Recycling`,
    `Q 4.8. Facilities or Entities Converting rPVC & Q 4.9 / Q 4.10 Export Rules`,
    `${recyclers.length} Recycling & Converting Entities Mapped in ${dataset.countryName}`
  );
  const yAfterRecTable = drawTable(
    14,
    33,
    162,
    ['Name of Facility or Entity', 'Type of PVC', 'City', 'Size Information'],
    [0.38, 0.18, 0.22, 0.22],
    (recyclers.length > 0 ? recyclers : dataset.facilities)
      .slice(0, 12)
      .map((f) => [f.name, f.pvcType, f.city, f.sizeRaw || '-']),
    125
  );

  drawCard(
    14,
    yAfterRecTable + 4,
    162,
    H - yAfterRecTable - 18,
    'Q 4.9. Further Processing & Q 4.10. PVC Recyclate Exported As',
    [
      `Q 4.9. Further processing in the country/exported: ${dataset.card4.q4_9_exportStatus}`,
      `Q 4.10. PVC recyclate exported as: ${dataset.card4.q4_10_exportNotes.join('; ')}`
    ],
    'blue'
  );

  doc.addImage(mapConverting, 'PNG', 180, 33, 144, 108);

  // =========================================================================
  // SLIDE 21: Converter Uptake in Country / Export (Q4.11 & Q4.12)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    21,
    `${dataset.countryName} - Recycling`,
    `Q 4.11. Converter rPVC Uptake in the Country / Export & Non-Converted Fate`,
    `Total Converter Uptake: ${fmt(dataset.card4.totalUptakeTonnes)} t/a`
  );
  const yAfterQ411 = drawTable(
    14,
    33,
    310,
    [
      'Post-Consumer PVC Waste Type',
      'Uptake Where?',
      'Type of PVC',
      'Total Quantity (t/a)',
      '(i) Products Converted Into',
      '(i) Breakdown per Product (t/a)',
      '(ii) If Not Converted: Reason & Fate'
    ],
    [0.16, 0.14, 0.1, 0.1, 0.16, 0.16, 0.18],
    dataset.card4.q4_11_uptake.map((u) => [
      u.wasteType,
      u.location,
      u.pvcType,
      fmt(u.totalQuantityTonnes),
      u.products.map((p) => p.product).join(', '),
      u.products.map((p) => `${p.product}: ${p.tonnes}`).join('; '),
      u.unconvertedReasonOrFate || '-'
    ]),
    130
  );

  drawCard(
    14,
    yAfterQ411 + 5,
    310,
    24,
    'Q 4.12. Main Recycling & Converting Stakeholders',
    [dataset.card4.q4_12_stakeholders],
    'blue'
  );

  // =========================================================================
  // SLIDE 22: Costs Associated with Recycling & rPVC Market Prices (Q4.13)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    22,
    `${dataset.countryName} - Recycling`,
    `Q 4.13. Economic Costs Associated with Recycling & Recyclate Market Prices`,
    'Processing costs per recycling technology and market prices of PVC recyclate'
  );
  drawTable(
    14,
    33,
    310,
    ['Type of (Economic) Cost / Recyclate Price', 'Type of PVC', 'Cost / Price (EUR)', 'Remarks'],
    [0.28, 0.14, 0.18, 0.4],
    dataset.card4.q4_13_costs.map((c) => [c.costType, c.pvcType, c.costDisplay, c.remarks])
  );

  // =========================================================================
  // SLIDE 23: Incineration Requirements, Technologies & Volumes (Q5.1 – Q5.5)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    23,
    `${dataset.countryName} - Incineration`,
    `Incineration of Rigid and Flexible Post-Consumer PVC Waste (Q 5.1 – Q 5.5)`,
    `Total Incinerated: ${fmt(dataset.card5.totalIncineratedTonnes)} t/year`
  );
  drawCard(
    14,
    33,
    152,
    56,
    'Q 5.1 – Q 5.3. General Requirements, PVC Rules & Disincentives',
    [
      `Q 5.1. General: ${dataset.card5.q5_1_generalRequirements}`,
      `Q 5.2. PVC Specific: ${dataset.card5.q5_2_pvcRequirements.join('; ')}`,
      `Q 5.3. Fees / Taxes: ${dataset.card5.q5_3_disincentives}`
    ],
    'blue'
  );
  drawCard(
    172,
    33,
    152,
    56,
    'Q 5.4. Incineration Technologies & Acid Gas Neutralization',
    [dataset.card5.q5_4_technologyNotes],
    'green'
  );

  drawTable(
    14,
    94,
    310,
    [
      'Q 5.5. Post-Consumer PVC Waste Type',
      'Type of PVC',
      'Incineration Technique',
      'Description / Reagent',
      'Quantity Incinerated (t/a)',
      'Output Material & Fate'
    ],
    [0.2, 0.12, 0.18, 0.2, 0.14, 0.16],
    dataset.card5.q5_5_incineratedStreams.map((s) => [
      s.wasteType,
      s.pvcType,
      s.technologyCategory,
      s.description,
      fmt(s.inputOrOutputTonnes),
      `${s.outputForm} -> ${s.typicalQuality}`
    ])
  );

  // =========================================================================
  // SLIDE 24: Incineration Facilities, Stakeholders, Costs & Public Concerns (Q5.6 – Q5.9)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    24,
    `${dataset.countryName} - Incineration`,
    `Incineration: Facilities, Stakeholders, Costs & Public Concerns (Q 5.6 – Q 5.9)`,
    'Operational constraints, HCl corrosion risks, and public perception of Waste-to-Energy'
  );
  drawCard(
    14,
    33,
    152,
    64,
    'Q 5.6. Facilities & Q 5.7. Main Stakeholders',
    [
      `Q 5.6. Facilities: ${dataset.card5.q5_6_facilitiesNote}`,
      `Q 5.7. Main Stakeholders: ${dataset.card5.q5_7_stakeholdersNote}`
    ],
    'blue'
  );
  drawCard(
    172,
    33,
    152,
    64,
    'Q 5.8. Costs Associated with Incineration',
    [dataset.card5.q5_8_costsNote],
    'green'
  );
  drawCard(
    14,
    103,
    310,
    70,
    'Q 5.9. Public Concerns & Plant Operator Resistance',
    [dataset.card5.q5_9_publicConcerns],
    'slate'
  );

  // =========================================================================
  // SLIDE 25: Landfilling Requirements, Regional Breakdown & Quantities (Q6.1 – Q6.5)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    25,
    `${dataset.countryName} - Landfilling`,
    `Landfilling of Rigid and Flexible Post-Consumer PVC Waste (Q 6.1 – Q 6.5)`,
    `Total Landfilled: ${fmt(dataset.card6.q6_4_totalLandfilledEstimateTonnes)} t/year`
  );
  drawCard(
    14,
    33,
    310,
    46,
    'Q 6.1 – Q 6.3. Landfill Requirements, PVC Restrictions & Taxes',
    [
      `Q 6.1. General: ${dataset.card6.q6_1_generalRequirements.join('; ')}`,
      `Q 6.2. PVC Specific: ${dataset.card6.q6_2_pvcRequirements} | Q 6.3. Taxes / Bans: ${dataset.card6.q6_3_disincentives}`
    ],
    'blue'
  );

  drawTable(
    14,
    84,
    310,
    [
      'Q 6.5. Post-Consumer PVC Waste Type',
      'Type of PVC',
      'Quantity Landfilled (t/a)',
      'Landfilling Facility or City / Region',
      'Additional Information'
    ],
    [0.2, 0.12, 0.16, 0.24, 0.28],
    dataset.card6.q6_5_provincialQuantities
      .slice(0, 12)
      .map((r) => [
        r.wasteType,
        r.pvcType,
        fmt(r.quantityTonnes),
        r.provinceOrCity,
        r.remarks || '-'
      ])
  );

  // =========================================================================
  // SLIDE 26: Landfill Operators Directory & GIS Map (Matches Slide 26 / image20.jpeg)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  const landfills = dataset.facilities.filter((f) => f.stage === 'Landfill Operator');
  drawHeader(
    26,
    `${dataset.countryName} - Landfilling`,
    `Q 6.5. / 6.6. Main Operators of Landfill Sites Handling Post-Consumer PVC Waste`,
    `${landfills.length} Landfill Operators Mapped in ${dataset.countryName}`
  );

  doc.addImage(mapLandfill, 'PNG', 14, 33, 144, 108);

  drawTable(
    162,
    33,
    162,
    ['Name of Facility or Entity - Main Operators', 'Type of PVC', 'City', 'Size Information'],
    [0.38, 0.14, 0.22, 0.26],
    (landfills.length > 0 ? landfills : dataset.facilities)
      .slice(0, 16)
      .map((f) => [f.name, f.pvcType, f.city, f.sizeRaw || '-'])
  );

  // =========================================================================
  // SLIDE 27: Landfilling Stakeholders, Costs & Public Concerns (Q6.7 – Q6.9)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    27,
    `${dataset.countryName} - Landfilling`,
    `Landfilling: Main Stakeholders, Economic Costs & Public Concerns (Q 6.7 – Q 6.9)`,
    'Transport, pre-treatment, landfill gate fees, ecotaxes, and environmental concerns'
  );
  const yAfterQ68 = drawTable(
    14,
    33,
    310,
    ['Q 6.8. Type of (Economic) Cost', 'Type of PVC', 'Cost (EUR)', 'Remarks'],
    [0.24, 0.14, 0.18, 0.44],
    dataset.card6.q6_8_costs.map((c) => [c.costType, c.pvcType, c.costDisplay, c.remarks]),
    105
  );

  drawCard(
    14,
    yAfterQ68 + 6,
    148,
    58,
    'Q 6.7. Main Landfilling Stakeholders',
    [dataset.card6.q6_7_stakeholdersNote],
    'blue'
  );
  drawCard(
    168,
    yAfterQ68 + 6,
    156,
    58,
    'Q 6.9. Public Concerns Around PVC Landfilling',
    [dataset.card6.q6_9_publicConcerns],
    'green'
  );

  // =========================================================================
  // SLIDE 28: Waste Management Chain & Traceability Registration Tools (Q7.1 & Q7.2)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    28,
    `${dataset.countryName} - Waste Management "Chain"`,
    `PVC Waste Management "Chain" More Generally (Q 7.1 & Q 7.2)`,
    'Waste traceability registration tools and organization of the PVC waste management chain'
  );
  drawCard(
    14,
    33,
    152,
    142,
    'Q 7.1. Waste Traceability Registration Tools',
    dataset.card7.q7_1_traceabilityTools.map(
      (t) => `${t.name} (${t.legislation} — ${t.entityInCharge}): ${t.mainPurpose}. ${t.relevantFeatures}`
    ),
    'blue'
  );
  drawCard(
    172,
    33,
    152,
    142,
    'Q 7.2. PVC Waste Chain: Organization & Export Overview',
    [dataset.card7.q7_2_chainOrganizationAndExport],
    'green'
  );

  // =========================================================================
  // SLIDE 29: Obstacles Preventing or Complicating PVC Recycling (Q7.3)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    29,
    `${dataset.countryName} - Waste Management "Chain"`,
    `Q 7.3. Top 5 Obstacles Preventing or Complicating Recycling of PVC Waste`,
    'Structural, regulatory, technical, and economic barriers across the post-consumer value chain'
  );
  dataset.card7.q7_3_topObstacles.slice(0, 5).forEach((obs, idx) => {
    const col = idx < 3 ? 0 : 1;
    const row = idx < 3 ? idx : idx - 3;
    const x = col === 0 ? 14 : 172;
    const y = 33 + row * 47;
    drawCard(
      x,
      y,
      152,
      43,
      `Obstacle #${obs.rank} (${obs.pvcTypeAffected}): ${obs.obstacle}`,
      [obs.mitigation],
      idx % 2 === 0 ? 'blue' : 'green'
    );
  });

  // =========================================================================
  // SLIDE 30: Voluntary Initiatives & Possible Improvements (Q7.4 & Q7.5)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    30,
    `${dataset.countryName} - Waste Management "Chain"`,
    `Existing Voluntary Initiatives & Possible Value Chain Improvements (Q 7.4 & Q 7.5)`,
    'Industry-led collection pilots, Recovinyl partnerships, and recommended policy/technical actions'
  );
  drawCard(
    14,
    33,
    152,
    142,
    'Q 7.4. Existing Voluntary Initiatives and Projects',
    [dataset.card7.q7_4_voluntaryInitiatives],
    'blue'
  );
  drawCard(
    172,
    33,
    152,
    142,
    'Q 7.5. Possible Improvements Across the Value Chain',
    [dataset.card7.q7_5_generalImprovements],
    'green'
  );

  // =========================================================================
  // SLIDE 31: Key Sources / Contacts & Trends / Outlook by 2030 (Q7.6 & Q7.7)
  // =========================================================================
  doc.addPage([W, H], 'landscape');
  drawHeader(
    31,
    `${dataset.countryName} - Waste Management "Chain"`,
    `Key Sources / Contacts & Trends or Outlook by 2030 (Q 7.6 & Q 7.7)`,
    'Strategic 2030 circularity roadmap and collection/recycling growth projections'
  );
  drawCard(
    14,
    33,
    152,
    142,
    'Q 7.6. Key Sources & Contacts to Increase PVC Waste Collection',
    [dataset.card7.q7_6_keySourcesContacts],
    'blue'
  );
  drawCard(
    172,
    33,
    152,
    142,
    'Q 7.7. Trends and Strategic Outlook by 2030',
    [dataset.card7.q7_7_outlook2030],
    'green'
  );

  const safeCountry = dataset.countryName.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Recovinyl_${safeCountry}_Post_Consumer_PVC_Waste_Report_${dataset.reportingYear}.pdf`);
}
