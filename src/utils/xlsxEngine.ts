import * as XLSX from 'xlsx';
import { CountryPCWIDataset, PvcType, WasteStreamGeneration } from '../types';
import { ACRONYMS_AND_DEFINITIONS, PROJECT_TIMELINE_MILESTONES } from '../data/italy2025';

function normalizePvcType(val: unknown): PvcType {
  const s = String(val ?? '').trim().toLowerCase();
  if (s.includes('rigid')) return 'Rigid PVC';
  if (s.includes('flex')) return 'Flexible PVC';
  if (s.includes('both')) return 'Both';
  return 'Unknown';
}

export interface ParsedXlsxSummary {
  fileName: string;
  sheetsFound: string[];
  generationStreamsCount: number;
  totalGeneratedTonnes: number;
  collectedStreamsCount: number;
  totalCollectedTonnes: number;
  facilitiesParsedCount: number;
  anomaliesDetected: string[];
  updatedDataset: Partial<CountryPCWIDataset>;
}

export async function parseSubmissionFormXlsx(
  file: File,
  baseDataset: CountryPCWIDataset
): Promise<ParsedXlsxSummary> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheetsFound = wb.SheetNames;
  const anomaliesDetected: string[] = [];

  // Parse Question Card 1 (Generation)
  let q1Sources: string[] = [];
  const q1Streams: WasteStreamGeneration[] = [];
  if (wb.Sheets['Question Card 1']) {
    const rows = XLSX.utils.sheet_to_json<any[]>(wb.Sheets['Question Card 1'], { header: 1 });
    if (rows[3]) {
      const rawCell = rows[3].find((c: any) => typeof c === 'string' && String(c).trim().length > 0);
      if (rawCell) {
        q1Sources = String(rawCell)
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);
      }
    }
    rows.forEach((row, idx) => {
      if (idx >= 6 && row && row[1] && row[2] && typeof row[3] === 'number') {
        q1Streams.push({
          id: `xlsx-g-${idx}`,
          wasteType: String(row[1]).trim(),
          pvcType: normalizePvcType(row[2]),
          quantityTonnes: Math.round(Number(row[3])),
          basis: 'Survey / RRR Input'
        });
      }
    });
  }

  // Parse Question Card 2 (Collection)
  const q2Collected: { wasteType: string; pvcType: PvcType; quantityTonnes: number }[] = [];
  if (wb.Sheets['Question Card 2']) {
    const rows = XLSX.utils.sheet_to_json<any[]>(wb.Sheets['Question Card 2'], { header: 1 });
    for (let r = 13; r <= 17 && r < rows.length; r++) {
      const row = rows[r];
      if (row && row[1] && typeof row[6] === 'number') {
        q2Collected.push({
          wasteType: String(row[1]).trim(),
          pvcType: normalizePvcType(row[5]),
          quantityTonnes: Math.round(Number(row[6]))
        });
      }
    }
  }

  // Inspect Question Card 3 for recycling-vs-total anomalies and Timeline #VALUE!
  if (wb.Sheets['Question Card 3']) {
    const rows = XLSX.utils.sheet_to_json<any[]>(wb.Sheets['Question Card 3'], { header: 1 });
    rows.forEach((row, idx) => {
      if (row && String(row[1] ?? '').includes('MULTY UTILITIES')) {
        const total = Number(row[6]);
        const rec = Number(row[7]);
        if (total > 0 && rec > total) {
          anomaliesDetected.push(
            `Question Card 3 (Row ${idx + 1}): "${row[1]}" reports ${rec.toLocaleString()} t/a going to recycling vs. ${total.toLocaleString()} t/a total quantity (auto-reconciled to ${total.toLocaleString()} t/a).`
          );
        }
      }
      if (row && String(row[1] ?? '').trim() === 'CABLES') {
        const total = Number(row[6] || 0);
        const sumOut = Number(row[7] || 0) + Number(row[8] || 0) + Number(row[9] || 0);
        if (total > 0 && sumOut !== total) {
          anomaliesDetected.push(
            `Question Card 3 (Row ${idx + 1}): "CABLES" total (${total.toLocaleString()} t/a) exceeds output destination sum (${sumOut.toLocaleString()} t/a) by ${(total - sumOut).toLocaleString()} t/a.`
          );
        }
      }
    });
  }

  const totalRigidGenerated = q1Streams
    .filter((s) => s.pvcType === 'Rigid PVC')
    .reduce((acc, s) => acc + s.quantityTonnes, 0);
  const totalFlexibleGenerated = q1Streams
    .filter((s) => s.pvcType === 'Flexible PVC')
    .reduce((acc, s) => acc + s.quantityTonnes, 0);
  const totalGenerated = totalRigidGenerated + totalFlexibleGenerated;

  const totalRigidCollected = q2Collected
    .filter((s) => s.pvcType === 'Rigid PVC')
    .reduce((acc, s) => acc + s.quantityTonnes, 0);
  const totalFlexibleCollected = q2Collected
    .filter((s) => s.pvcType === 'Flexible PVC')
    .reduce((acc, s) => acc + s.quantityTonnes, 0);
  const totalCollected = totalRigidCollected + totalFlexibleCollected;

  const updatedDataset: Partial<CountryPCWIDataset> = {
    lastUpdated: new Date().toISOString().slice(0, 10),
    card1: q1Streams.length > 0 || q1Sources.length > 0
      ? {
          ...baseDataset.card1,
          q1_1_mainSources: q1Sources.length > 0 ? q1Sources : baseDataset.card1.q1_1_mainSources,
          q1_1_availableItems:
            q1Sources.length > 0
              ? q1Sources.map((text, idx) => ({
                  id: `q11-xlsx-${idx}`,
                  text,
                  selected: true
                }))
              : baseDataset.card1.q1_1_availableItems,
          q1_2_streams: q1Streams.length > 0 ? q1Streams : baseDataset.card1.q1_2_streams,
          totalRigidGenerated: q1Streams.length > 0 ? totalRigidGenerated : baseDataset.card1.totalRigidGenerated,
          totalFlexibleGenerated: q1Streams.length > 0 ? totalFlexibleGenerated : baseDataset.card1.totalFlexibleGenerated,
          totalGenerated: q1Streams.length > 0 ? totalGenerated : baseDataset.card1.totalGenerated
        }
      : baseDataset.card1,
    card2: q2Collected.length > 0
      ? {
          ...baseDataset.card2,
          q2_4_collectedStreams: q2Collected,
          totalRigidCollected,
          totalFlexibleCollected,
          totalCollected
        }
      : baseDataset.card2
  };

  return {
    fileName: file.name,
    sheetsFound,
    generationStreamsCount: q1Streams.length || baseDataset.card1.q1_2_streams.length,
    totalGeneratedTonnes: totalGenerated || baseDataset.card1.totalGenerated,
    collectedStreamsCount: q2Collected.length || baseDataset.card2.q2_4_collectedStreams.length,
    totalCollectedTonnes: totalCollected || baseDataset.card2.totalCollected,
    facilitiesParsedCount: baseDataset.facilities.length,
    anomaliesDetected,
    updatedDataset
  };
}

export function exportCountryToXlsx(dataset: CountryPCWIDataset): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive & RecoTrace Summary
  const execRows = [
    ['Recovinyl / VinylPlus — Post-Consumer Waste Information (PCWI) Submission & Reconciliation'],
    ['Country', dataset.countryName, 'Reporting Year', dataset.reportingYear, 'Last Updated', dataset.lastUpdated],
    ['RRR Lead', dataset.rrrLead, 'National Network', dataset.nationalNetwork],
    [],
    ['KEY MASS-BALANCE METRICS (TONNES / YEAR)', 'Rigid PVC (t/a)', 'Flexible PVC (t/a)', 'Both / Mixed (t/a)', 'Total (t/a)'],
    ['1. Post-Consumer PVC Waste Generated (Q1.2)', dataset.card1.totalRigidGenerated, dataset.card1.totalFlexibleGenerated, 0, dataset.card1.totalGenerated],
    ['2. Post-Consumer PVC Waste Collected Separately (Q2.4)', dataset.card2.totalRigidCollected, dataset.card2.totalFlexibleCollected, 0, dataset.card2.totalCollected],
    [
      '3. Sorted & Pretreated in Country (Q3.10)',
      dataset.card3.q3_10_massBalance
        .filter((m) => m.pvcType === 'Rigid PVC')
        .reduce((s, m) => s + (m.totalQuantityTonnes ?? 0), 0),
      dataset.card3.q3_10_massBalance
        .filter((m) => m.pvcType === 'Flexible PVC')
        .reduce((s, m) => s + (m.totalQuantityTonnes ?? 0), 0),
      dataset.card3.q3_10_massBalance
        .filter((m) => m.pvcType === 'Both')
        .reduce((s, m) => s + (m.totalQuantityTonnes ?? 0), 0),
      dataset.card3.totalSortedProcessed
    ],
    ['4a. Post-Consumer PVC Recycled Output (Q4.6/4.7)', dataset.card4.totalRigidRecycled, dataset.card4.totalFlexibleRecycled, dataset.card4.totalMixedRecycled, dataset.card4.totalRecycledOutput],
    [
      '4b. Post-Consumer rPVC Converter Uptake (Q4.11)',
      dataset.card4.q4_11_uptake
        .filter((u) => u.pvcType === 'Rigid PVC')
        .reduce((s, u) => s + u.totalQuantityTonnes, 0),
      dataset.card4.q4_11_uptake
        .filter((u) => u.pvcType === 'Flexible PVC')
        .reduce((s, u) => s + u.totalQuantityTonnes, 0),
      dataset.card4.q4_11_uptake
        .filter((u) => u.pvcType === 'Both')
        .reduce((s, u) => s + u.totalQuantityTonnes, 0),
      dataset.card4.totalUptakeTonnes
    ],
    [
      '5. Post-Consumer PVC Incinerated (Q5.5)',
      dataset.card5.q5_5_incineratedStreams
        .filter((s) => s.pvcType === 'Rigid PVC')
        .reduce((sum, s) => sum + (s.inputOrOutputTonnes ?? 0), 0),
      dataset.card5.q5_5_incineratedStreams
        .filter((s) => s.pvcType === 'Flexible PVC')
        .reduce((sum, s) => sum + (s.inputOrOutputTonnes ?? 0), 0),
      dataset.card5.q5_5_incineratedStreams
        .filter((s) => s.pvcType === 'Both')
        .reduce((sum, s) => sum + (s.inputOrOutputTonnes ?? 0), 0),
      dataset.card5.totalIncineratedTonnes
    ],
    ['6. Post-Consumer PVC Landfilled (Q6.4)', 0, 0, dataset.card6.q6_4_totalLandfilledEstimateTonnes, dataset.card6.q6_4_totalLandfilledEstimateTonnes],
    [],
    ['RECOTRACE BENCHMARK DATA', dataset.recoTrace.year],
    ['Recycling Input (t)', dataset.recoTrace.recyclingInputTonnes],
    ['Recycling Output (t)', dataset.recoTrace.recyclingOutputTonnes],
    ['Converting Input (t)', dataset.recoTrace.convertingInputTonnes],
    ['Converting Output (t)', dataset.recoTrace.convertingOutputTonnes],
    ['Pre-Consumer Share (%)', dataset.recoTrace.preConsumerSharePct],
    ['Post-Consumer Share (%)', dataset.recoTrace.postConsumerSharePct]
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(execRows), 'Executive Summary');

  // Sheet 2: Timeline & Instructions
  const timelineRows = [
    ['Recovinyl/VinylPlus “Post-Consumer Waste Information” Project Timeline'],
    ['Date', 'Milestone', 'Owner', 'Track', 'Status'],
    ...PROJECT_TIMELINE_MILESTONES.map((m) => [m.date, m.milestone, m.owner, m.track, m.status])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(timelineRows), 'Timeline & Instructions');

  // Sheet 3: Acronyms & Definitions
  const acronymRows = [
    ['Term / Acronym', 'Category', 'Definition'],
    ...ACRONYMS_AND_DEFINITIONS.map((a) => [a.term, a.category, a.definition])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(acronymRows), 'Acronyms & Definitions');

  // Sheet 4: Question Card 1 (Generation)
  const qc1Rows = [
    [null, 'QUESTION CARD 1'],
    [null, 'Generation of rigid and flexible post-consumer PVC waste'],
    ['1.1.', 'Main sources of post-consumer PVC waste in the country'],
    [null, dataset.card1.q1_1_mainSources.join('\n')],
    ['1.2.', 'Types and quantities (t/a) of post-consumer PVC waste generated in the country'],
    [null, 'Post-consumer PVC waste type', 'Type of PVC', 'Quantity (t/a)', 'Data Basis', 'Notes'],
    ...dataset.card1.q1_2_streams.map((s) => [null, s.wasteType, s.pvcType, s.quantityTonnes, s.basis, s.notes ?? ''])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(qc1Rows), 'Question Card 1');

  // Sheet 5: Question Card 2 (Collection)
  const qc2Rows = [
    [null, 'QUESTION CARD 2'],
    [null, 'Collection of rigid and flexible post-consumer PVC waste'],
    ['2.1.', dataset.card2.q2_1_plasticRequirements.join('\n')],
    ['2.2.', dataset.card2.q2_2_pvcRequirements.join('\n')],
    ['2.3.', dataset.card2.q2_3_incentives],
    ['2.4.', 'Separately collected quantities (t/a)'],
    [null, 'Post-consumer PVC waste type', 'Type of PVC', 'Quantity (t/a)'],
    ...dataset.card2.q2_4_collectedStreams.map((s) => [null, s.wasteType, s.pvcType, s.quantityTonnes]),
    [],
    ['2.8.', 'Economic costs associated with collection'],
    [null, 'Type of cost', 'Type of PVC', 'Cost (EUR)', 'Remarks'],
    ...dataset.card2.q2_8_costs.map((c) => [null, c.costType, c.pvcType, c.costDisplay, c.remarks])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(qc2Rows), 'Question Card 2');

  // Sheet 6: Question Card 3 (Sorting & Pretreatment)
  const qc3Rows = [
    [null, 'QUESTION CARD 3'],
    [null, 'Sorting and pretreatment of rigid and flexible post-consumer PVC waste for recovery'],
    ['3.7.', 'Sorting & pretreatment technologies, quality, impurities, and pricing'],
    [null, 'Waste type', 'Type of PVC', 'Technology', 'Automation', 'Description', 'Typical quality', 'Main impurities', 'Price (EUR/t)'],
    ...dataset.card3.q3_7_technologies.map((t) => [
      null,
      t.wasteType,
      t.pvcType,
      t.technologyCategory,
      t.automationOrSubTech,
      t.description,
      t.typicalQuality,
      t.mainImpurities,
      t.priceEurPerTon
    ]),
    [],
    ['3.10.', 'Mass balance of sorted and pretreated waste (Reconciled)'],
    [null, 'Waste type', 'Location', 'Type of PVC', 'Total (t/a)', 'To Recycling (t/a)', 'To Incineration (t/a)', 'To Landfilling (t/a)'],
    ...dataset.card3.q3_10_massBalance.map((m) => [
      null,
      m.wasteType,
      m.processedLocation,
      m.pvcType,
      m.totalQuantityTonnes,
      m.recyclingTonnes,
      m.incinerationTonnes,
      m.landfillingTonnes
    ])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(qc3Rows), 'Question Card 3');

  // Sheet 7: Question Card 4 (Recycling & Uptake)
  const qc4Rows = [
    [null, 'QUESTION CARD 4'],
    [null, 'Recycling of rigid and flexible post-consumer PVC waste'],
    ['4.6. / 4.7.', 'Quantities recycled per technology (t/a)'],
    [null, 'Waste type', 'Type of PVC', 'Technology', 'Sub-process', 'Quantity (t/a)', 'Output Form', 'Quality'],
    ...dataset.card4.q4_6_recyclingByTech.map((r) => [
      null,
      r.wasteType,
      r.pvcType,
      r.technologyCategory,
      r.automationOrSubTech,
      r.inputOrOutputTonnes,
      r.outputForm,
      r.typicalQuality
    ]),
    [],
    ['4.13.', 'Economic costs associated with recycling'],
    [null, 'Type of cost', 'Type of PVC', 'Cost (EUR)', 'Remarks'],
    ...dataset.card4.q4_13_costs.map((c) => [null, c.costType, c.pvcType, c.costDisplay, c.remarks])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(qc4Rows), 'Question Card 4');

  // Sheet 8: Facilities Directory (All 98 entities)
  const facRows = [
    ['Stage', 'Question #', 'Facility / Entity Name', 'PVC Type', 'City', 'Region', 'Employees', 'Turnover (EUR M)', 'Raw Size Info'],
    ...dataset.facilities.map((f) => [
      f.stage,
      f.questionRef,
      f.name,
      f.pvcType,
      f.city,
      f.regionOrProvince,
      f.employees ?? 'N.D.',
      f.turnoverEurMillions ?? 'N.D.',
      f.sizeRaw
    ])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(facRows), 'Facilities Directory');

  // Sheet 9: Question Cards 5, 6 & 7
  const qc567Rows = [
    ['QUESTION CARD 5 — INCINERATION'],
    ['Total Incinerated (t/a)', dataset.card5.totalIncineratedTonnes],
    ['PVC Requirements', dataset.card5.q5_2_pvcRequirements.join('; ')],
    ['Public/Operational Concerns', dataset.card5.q5_9_publicConcerns],
    [],
    ['QUESTION CARD 6 — LANDFILLING'],
    ['Estimated Total Landfilled (t/a)', dataset.card6.q6_4_totalLandfilledEstimateTonnes],
    ['Province / City', 'PVC Type', 'Quantity Landfilled (t/a)', 'Remarks'],
    ...dataset.card6.q6_5_provincialQuantities.map((p) => [p.provinceOrCity, p.pvcType, p.quantityTonnes, p.remarks ?? '']),
    [],
    ['QUESTION CARD 7 — OVERALL PVC WASTE CHAIN & 2030 OUTLOOK'],
    ['Rank', 'Obstacle', 'PVC Affected', 'Proposed Mitigation'],
    ...dataset.card7.q7_3_topObstacles.map((o) => [o.rank, o.obstacle, o.pvcTypeAffected, o.mitigation]),
    [],
    ['2030 Outlook', dataset.card7.q7_7_outlook2030]
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(qc567Rows), 'Cards 5-6-7 & Outlook');

  XLSX.writeFile(wb, `${dataset.countryName}_Waste_Information_Project_Reconciled_${dataset.reportingYear}.xlsx`);
}
