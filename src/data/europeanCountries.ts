import { CountryPCWIDataset, TrackStatus } from '../types';
import { ITALY_2025_DATASET } from './italy2025';

export interface EuropeanCountrySummary {
  code: string;
  name: string;
  flag: string;
  regionGroup: 'Western Europe' | 'Southern Europe' | 'Central & Eastern Europe' | 'Northern Europe';
  rrrLead: string;
  traceabilityTool: string;
  trackA: TrackStatus;
  trackB1: TrackStatus;
  trackB2: TrackStatus;
  finalSubmission: TrackStatus;
  generatedTonnes: number;
  collectedTonnes: number;
  recycledTonnes: number;
  incineratedTonnes: number;
  landfilledTonnes: number;
  recoTrace2024OutputTonnes: number;
  hasFullDataset: boolean;
}

export const GERMANY_2025_DATASET: CountryPCWIDataset = {
  ...ITALY_2025_DATASET,
  countryCode: 'DE',
  countryName: 'Germany',
  regionGroup: 'Western Europe',
  flag: '🇩🇪',
  reportingYear: 2025,
  lastUpdated: '2025-07-14',
  rrrLead: 'VinylPlus Deutschland / AGPU / Rewindo (RRR)',
  nationalNetwork: 'VinylPlus Deutschland & Rewindo Window Profile Recycling',
  tracks: {
    trackA: 'Completed',
    trackB1: 'Completed',
    trackB2: 'In Progress',
    finalSubmission: 'In Progress'
  },
  socioEconomic: {
    ...ITALY_2025_DATASET.socioEconomic,
    populationMillions: 84.4,
    gdpGrowthPct: '+0.3% (2025)',
    inflationPct: '2.1%',
    unemploymentPct: '5.9%',
    virginPolymerKt2024: 9366,
    recycledPolymerKt2024: 2040,
    plasticDomesticRecycledPct: 38,
    plasticExportedPct: 12,
    plasticIncineratedPct: 49,
    pvcRecycledKt2024: 283,
    constructionGrowth2024Pct: '-3.1%',
    constructionGrowth2025Pct: '+0.8%',
    politicalLandscape: [
      'Strict landfill ban on untreated municipal and high-calorific waste (TASi / DepV since 2005).',
      'Strong established voluntary take-back schemes for B&C PVC profiles (Rewindo) and flooring (AgPR).',
      'Active debate on chemical recycling recognition and legacy additive thresholds in circular construction.'
    ],
    euRegulationNotes: [
      'Alignment of national KrWG (Circular Economy Act) with EU Packaging & Construction Products Regulations.'
    ],
    nationalPolicyNotes: [
      'Zero untreated plastic landfilling; high competition between mechanical recycling and Waste-to-Energy (MVA) plants.'
    ]
  },
  recoTrace: {
    ...ITALY_2025_DATASET.recoTrace,
    recyclingInputTonnes: 243529,
    recyclingOutputTonnes: 258769,
    convertingInputTonnes: 112314,
    convertingOutputTonnes: 126841,
    topEndApplication: 'Windows & Profiles / Pipes',
    preConsumerSharePct: 42,
    postConsumerSharePct: 58,
    ytdRecyclingTotalTonnes: 100839,
    ytdRecyclingForecastTonnes: 273226,
    ytdRecyclingPreConsumerTonnes: 34237,
    ytdRecyclingPostConsumerTonnes: 49296,
    ytdConvertingTotalTonnes: 65481,
    ytdConvertingForecastTonnes: 134928,
    ytdExplanation: 'Strong post-consumer window profile and pipe collection via Rewindo and KRV despite softer new-build construction activity.'
  },
  card1: {
    ...ITALY_2025_DATASET.card1,
    totalRigidGenerated: 240252,
    totalFlexibleGenerated: 179393,
    totalGenerated: 460510,
    q1_2_streams: [
      { id: 'de-g1', wasteType: 'B&C (Windows, Profiles, Pipes)', pvcType: 'Rigid PVC', quantityTonnes: 211380, basis: 'Evidence-based', notes: 'Tracked via Conversio / Rewindo mass-flow study' },
      { id: 'de-g2', wasteType: 'WEEE / Cables (ElektroG)', pvcType: 'Flexible PVC', quantityTonnes: 107528, basis: 'Evidence-based' },
      { id: 'de-g3', wasteType: 'Flooring & Membranes', pvcType: 'Flexible PVC', quantityTonnes: 41867, basis: 'Evidence-based' },
      { id: 'de-g4', wasteType: 'Commercial & Bulky Rigid Waste', pvcType: 'Rigid PVC', quantityTonnes: 46822, basis: 'Educated estimation' },
      { id: 'de-g5', wasteType: 'Packaging, Medical & Other Flex', pvcType: 'Flexible PVC', quantityTonnes: 32128, basis: 'Educated estimation' }
    ]
  },
  card2: {
    ...ITALY_2025_DATASET.card2,
    totalRigidCollected: 130595,
    totalFlexibleCollected: 61729,
    totalCollected: 158285,
    q2_4_collectedStreams: [
      { wasteType: 'B&C (Windows, Profiles, Roller Shutters, Pipes)', pvcType: 'Rigid PVC', quantityTonnes: 140725 },
      { wasteType: 'CABLES (ElektroG & C&D)', pvcType: 'Flexible PVC', quantityTonnes: 45994 },
      { wasteType: 'FLOORING & ROOFING MEMBRANES', pvcType: 'Flexible PVC', quantityTonnes: 15373 },
      { wasteType: 'LARGE URBAN / COMMERCIAL RIGID', pvcType: 'Rigid PVC', quantityTonnes: 4862 }
    ]
  },
  card3: {
    ...ITALY_2025_DATASET.card3,
    totalSortedProcessed: 218958
  },
  card4: {
    ...ITALY_2025_DATASET.card4,
    totalRigidRecycled: 89320,
    totalFlexibleRecycled: 32495,
    totalMixedRecycled: 7949,
    totalRecycledOutput: 137239,
    totalUptakeTonnes: 126841
  },
  card5: {
    ...ITALY_2025_DATASET.card5,
    totalIncineratedTonnes: 292477
  },
  card6: {
    ...ITALY_2025_DATASET.card6,
    q6_4_totalLandfilledEstimateTonnes: 9269
  },
  card7: {
    ...ITALY_2025_DATASET.card7,
    q7_1_traceabilityTools: [
      {
        name: 'eANV (Elektronisches Abfallnachweisverfahren)',
        legislation: 'NachwV / KrWG (Circular Economy Act)',
        entityInCharge: 'ZKS-Abfall / Federal & State Environmental Ministries',
        mainPurpose: 'Mandatory electronic waste consignment & signature tracking for hazardous and regulated waste streams',
        relevantFeatures: 'Qualified electronic signatures, federal central coordination (ZKS-Abfall)',
        website: 'https://www.zks-abfall.de'
      }
    ]
  },
  discrepancies: []
};

export const FRANCE_2025_DATASET: CountryPCWIDataset = {
  ...ITALY_2025_DATASET,
  countryCode: 'FR',
  countryName: 'France',
  regionGroup: 'Western Europe',
  flag: '🇫🇷',
  reportingYear: 2025,
  lastUpdated: '2025-07-08',
  rrrLead: 'Recovinyl France / SNEP (RRR)',
  nationalNetwork: 'SNEP & Eco-organismes REP PMCB (Valobat, Ecomaison, Valdelia)',
  tracks: {
    trackA: 'Completed',
    trackB1: 'Completed',
    trackB2: 'Draft Submitted',
    finalSubmission: 'In Progress'
  },
  socioEconomic: {
    ...ITALY_2025_DATASET.socioEconomic,
    populationMillions: 68.2,
    gdpGrowthPct: '+0.8% (2025)',
    inflationPct: '1.9%',
    unemploymentPct: '7.3%',
    virginPolymerKt2024: 4925,
    recycledPolymerKt2024: 741,
    plasticDomesticRecycledPct: 25,
    plasticExportedPct: 18,
    plasticIncineratedPct: 42,
    pvcRecycledKt2024: 130.8,
    politicalLandscape: [
      'Mandatory Building & Construction EPR (REP PMCB under AGEC Law) operational since 2023 via Valobat, Ecomaison, and Valdelia.',
      'Free take-back of sorted rigid PVC construction waste (pipes, windows, profiles) at certified collection points.',
      'Progressive landfill reduction targets (TGAP tax increases) and Trackdéchets digital traceability.'
    ]
  },
  recoTrace: {
    ...ITALY_2025_DATASET.recoTrace,
    recyclingInputTonnes: 139961,
    recyclingOutputTonnes: 152640,
    convertingInputTonnes: 107133,
    convertingOutputTonnes: 78897,
    topEndApplication: 'Pipes & Window Profiles',
    preConsumerSharePct: 46,
    postConsumerSharePct: 54,
    ytdRecyclingTotalTonnes: 57315,
    ytdRecyclingForecastTonnes: 113095,
    ytdRecyclingPreConsumerTonnes: 23565,
    ytdRecyclingPostConsumerTonnes: 30742,
    ytdConvertingTotalTonnes: 40961,
    ytdConvertingForecastTonnes: 99453
  },
  card1: {
    ...ITALY_2025_DATASET.card1,
    totalRigidGenerated: 225534,
    totalFlexibleGenerated: 141509,
    totalGenerated: 371894
  },
  card2: {
    ...ITALY_2025_DATASET.card2,
    totalRigidCollected: 62345,
    totalFlexibleCollected: 37299,
    totalCollected: 110889
  },
  card3: {
    ...ITALY_2025_DATASET.card3,
    totalSortedProcessed: 114314
  },
  card4: {
    ...ITALY_2025_DATASET.card4,
    totalRigidRecycled: 61161,
    totalFlexibleRecycled: 16344,
    totalMixedRecycled: 3167,
    totalRecycledOutput: 59717,
    totalUptakeTonnes: 78897
  },
  card5: {
    ...ITALY_2025_DATASET.card5,
    totalIncineratedTonnes: 120783
  },
  card6: {
    ...ITALY_2025_DATASET.card6,
    q6_4_totalLandfilledEstimateTonnes: 112086
  },
  card7: {
    ...ITALY_2025_DATASET.card7,
    q7_1_traceabilityTools: [
      {
        name: 'Trackdéchets',
        legislation: 'Code de l’Environnement / Loi AGEC',
        entityInCharge: 'Ministère de la Transition Écologique',
        mainPurpose: 'National digital platform dematerializing waste tracking slips (BSD) across France',
        relevantFeatures: 'Real-time API integration, mandatory for hazardous/POPs and expanding across B&C EPR chains',
        website: 'https://trackdechets.beta.gouv.fr'
      }
    ]
  },
  discrepancies: []
};

export const FULL_COUNTRY_DATASETS: Record<string, CountryPCWIDataset> = {
  IT: ITALY_2025_DATASET,
  DE: GERMANY_2025_DATASET,
  FR: FRANCE_2025_DATASET
};

export const EUROPEAN_COUNTRIES_SUMMARY: EuropeanCountrySummary[] = [
  {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    regionGroup: 'Southern Europe',
    rrrLead: 'VinylPlus Italia / PVC Forum Italia',
    traceabilityTool: 'RENTRI & MUD',
    trackA: 'Completed',
    trackB1: 'Completed',
    trackB2: 'Completed',
    finalSubmission: 'Completed',
    generatedTonnes: 256970,
    collectedTonnes: 35304,
    recycledTonnes: 20641,
    incineratedTonnes: 26058,
    landfilledTonnes: 178843,
    recoTrace2024OutputTonnes: 74057,
    hasFullDataset: true
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    regionGroup: 'Western Europe',
    rrrLead: 'VinylPlus Deutschland / Rewindo',
    traceabilityTool: 'eANV (ZKS-Abfall)',
    trackA: 'Completed',
    trackB1: 'Completed',
    trackB2: 'In Progress',
    finalSubmission: 'In Progress',
    generatedTonnes: 460510,
    collectedTonnes: 158285,
    recycledTonnes: 137239,
    incineratedTonnes: 292477,
    landfilledTonnes: 9269,
    recoTrace2024OutputTonnes: 258769,
    hasFullDataset: true
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    regionGroup: 'Western Europe',
    rrrLead: 'Recovinyl France / SNEP',
    traceabilityTool: 'Trackdéchets',
    trackA: 'Completed',
    trackB1: 'Completed',
    trackB2: 'Draft Submitted',
    finalSubmission: 'In Progress',
    generatedTonnes: 371894,
    collectedTonnes: 110889,
    recycledTonnes: 59717,
    incineratedTonnes: 120783,
    landfilledTonnes: 112086,
    recoTrace2024OutputTonnes: 152640,
    hasFullDataset: true
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    regionGroup: 'Northern Europe',
    rrrLead: 'Recovinyl UK / BPF Pipes & Windows',
    traceabilityTool: 'UK Digital Waste Tracking System',
    trackA: 'Completed',
    trackB1: 'Draft Submitted',
    trackB2: 'In Progress',
    finalSubmission: 'Pending',
    generatedTonnes: 240252,
    collectedTonnes: 99453,
    recycledTonnes: 52052,
    incineratedTonnes: 126085,
    landfilledTonnes: 97401,
    recoTrace2024OutputTonnes: 119042,
    hasFullDataset: false
  },
  {
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    regionGroup: 'Southern Europe',
    rrrLead: 'Recovinyl España / ANAIP',
    traceabilityTool: 'e-SIR (Sistema de Información de Residuos)',
    trackA: 'Completed',
    trackB1: 'Draft Submitted',
    trackB2: 'In Progress',
    finalSubmission: 'Pending',
    generatedTonnes: 200108,
    collectedTonnes: 49909,
    recycledTonnes: 31510,
    incineratedTonnes: 31265,
    landfilledTonnes: 158484,
    recoTrace2024OutputTonnes: 50902,
    hasFullDataset: false
  },
  {
    code: 'PL',
    name: 'Poland',
    flag: '🇵🇱',
    regionGroup: 'Central & Eastern Europe',
    rrrLead: 'Recovinyl Polska / PRK',
    traceabilityTool: 'BDO (Baza danych o produktach i odpadach)',
    trackA: 'Completed',
    trackB1: 'In Progress',
    trackB2: 'Pending',
    finalSubmission: 'Pending',
    generatedTonnes: 198532,
    collectedTonnes: 51873,
    recycledTonnes: 32297,
    incineratedTonnes: 37546,
    landfilledTonnes: 97420,
    recoTrace2024OutputTonnes: 54301,
    hasFullDataset: false
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    regionGroup: 'Western Europe',
    rrrLead: 'Recovinyl Benelux / BureauLeiding / SRK',
    traceabilityTool: 'LMA (Landelijk Meldpunt Afvalstoffen)',
    trackA: 'Completed',
    trackB1: 'Completed',
    trackB2: 'Draft Submitted',
    finalSubmission: 'In Progress',
    generatedTonnes: 126085,
    collectedTonnes: 54165,
    recycledTonnes: 39471,
    incineratedTonnes: 60724,
    landfilledTonnes: 2007,
    recoTrace2024OutputTonnes: 62023,
    hasFullDataset: false
  },
  {
    code: 'BE',
    name: 'Belgium',
    flag: '🇧🇪',
    regionGroup: 'Western Europe',
    rrrLead: 'Recovinyl Benelux / Essenscia PolyMatters',
    traceabilityTool: 'OVAM / Wallonie / Brussels Digital Registers',
    trackA: 'Completed',
    trackB1: 'Completed',
    trackB2: 'Draft Submitted',
    finalSubmission: 'In Progress',
    generatedTonnes: 80705,
    collectedTonnes: 47310,
    recycledTonnes: 34421,
    incineratedTonnes: 37299,
    landfilledTonnes: 1777,
    recoTrace2024OutputTonnes: 38195,
    hasFullDataset: false
  },
  {
    code: 'AT',
    name: 'Austria',
    flag: '🇦🇹',
    regionGroup: 'Western Europe',
    rrrLead: 'API PVC- und Umweltberatung',
    traceabilityTool: 'EDM (Elektronisches Datenmanagement Umwelt)',
    trackA: 'Draft Submitted',
    trackB1: 'In Progress',
    trackB2: 'Pending',
    finalSubmission: 'Pending',
    generatedTonnes: 60724,
    collectedTonnes: 26782,
    recycledTonnes: 13864,
    incineratedTonnes: 31265,
    landfilledTonnes: 1370,
    recoTrace2024OutputTonnes: 27586,
    hasFullDataset: false
  },
  {
    code: 'CZ',
    name: 'Czechia',
    flag: '🇨🇿',
    regionGroup: 'Central & Eastern Europe',
    rrrLead: 'Recovinyl Central Europe',
    traceabilityTool: 'ISPOP / SEPNO',
    trackA: 'Draft Submitted',
    trackB1: 'In Progress',
    trackB2: 'Pending',
    finalSubmission: 'Pending',
    generatedTonnes: 60187,
    collectedTonnes: 14671,
    recycledTonnes: 13792,
    incineratedTonnes: 11670,
    landfilledTonnes: 31265,
    recoTrace2024OutputTonnes: 24646,
    hasFullDataset: false
  },
  {
    code: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    regionGroup: 'Northern Europe',
    rrrLead: 'Nordic PVC Forum / IKEM',
    traceabilityTool: 'Naturvårdsverket Avfallsregister',
    trackA: 'Draft Submitted',
    trackB1: 'In Progress',
    trackB2: 'Pending',
    finalSubmission: 'Pending',
    generatedTonnes: 45994,
    collectedTonnes: 16142,
    recycledTonnes: 13506,
    incineratedTonnes: 36056,
    landfilledTonnes: 1037,
    recoTrace2024OutputTonnes: 13272,
    hasFullDataset: false
  },
  {
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    regionGroup: 'Western Europe',
    rrrLead: 'PVCH (Arbeitsgemeinschaft Schweizerische PVC-Industrie)',
    traceabilityTool: 'veva-online.admin.ch',
    trackA: 'Completed',
    trackB1: 'In Progress',
    trackB2: 'Pending',
    finalSubmission: 'Pending',
    generatedTonnes: 41599,
    collectedTonnes: 25561,
    recycledTonnes: 16237,
    incineratedTonnes: 25415,
    landfilledTonnes: 332,
    recoTrace2024OutputTonnes: 16142,
    hasFullDataset: false
  }
];

export function getLiveEuropeanCountriesSummary(
  accounts: { countryCode: string; dataset: CountryPCWIDataset }[]
): EuropeanCountrySummary[] {
  return EUROPEAN_COUNTRIES_SUMMARY.map((c) => {
    const matchingAcc = accounts.find((a) => a.countryCode === c.code);
    if (!matchingAcc) return c;
    const ds = matchingAcc.dataset;
    return {
      ...c,
      generatedTonnes: ds.card1.totalGenerated,
      collectedTonnes: ds.card2.totalCollected,
      recycledTonnes: ds.card4.totalRecycledOutput,
      incineratedTonnes: ds.card5.totalIncineratedTonnes,
      landfilledTonnes: ds.card6.q6_4_totalLandfilledEstimateTonnes,
      recoTrace2024OutputTonnes: ds.recoTrace.recyclingOutputTonnes,
      hasFullDataset: true
    };
  });
}

export function buildEuropeanAggregatedDataset(
  accounts: { countryCode: string; dataset: CountryPCWIDataset }[]
): CountryPCWIDataset {
  const liveCountries = getLiveEuropeanCountriesSummary(accounts);

  const totalGenerated = liveCountries.reduce((sum, c) => sum + c.generatedTonnes, 0);
  const totalCollected = liveCountries.reduce((sum, c) => sum + c.collectedTonnes, 0);
  const totalRecycledOutput = liveCountries.reduce((sum, c) => sum + c.recycledTonnes, 0);
  const totalIncineratedTonnes = liveCountries.reduce((sum, c) => sum + c.incineratedTonnes, 0);
  const totalLandfilledTonnes = liveCountries.reduce((sum, c) => sum + c.landfilledTonnes, 0);
  const totalRecoTraceOutput = liveCountries.reduce((sum, c) => sum + c.recoTrace2024OutputTonnes, 0);

  // Reference Italy dataset (live if edited in accounts)
  const itDataset = accounts.find((a) => a.countryCode === 'IT')?.dataset || ITALY_2025_DATASET;
  const deDataset = accounts.find((a) => a.countryCode === 'DE')?.dataset || GERMANY_2025_DATASET;
  const frDataset = accounts.find((a) => a.countryCode === 'FR')?.dataset || FRANCE_2025_DATASET;

  // Scale factor relative to Italy's baseline for stream-level distributions
  const genScale = itDataset.card1.totalGenerated > 0 ? totalGenerated / itDataset.card1.totalGenerated: 7.1;
  const colScale = itDataset.card2.totalCollected > 0 ? totalCollected / itDataset.card2.totalCollected: 16;
  const recScale = itDataset.card4.totalRecycledOutput > 0 ? totalRecycledOutput / itDataset.card4.totalRecycledOutput: 25.4;

  // Scale Q1.2 streams so they sum to totalGenerated
  const scaledQ12Streams = itDataset.card1.q1_2_streams.map((s) => ({
    ...s,
    id: `eu-${s.id}`,
    quantityTonnes: Math.round(s.quantityTonnes * genScale)
  }));
  const q12Diff = totalGenerated - scaledQ12Streams.reduce((s, x) => s + x.quantityTonnes, 0);
  if (scaledQ12Streams.length > 0) {
    scaledQ12Streams[0].quantityTonnes += q12Diff;
  }

  const totalRigidGenerated = scaledQ12Streams
    .filter((s) => s.pvcType === 'Rigid PVC')
    .reduce((s, x) => s + x.quantityTonnes, 0);
  const totalFlexibleGenerated = scaledQ12Streams
    .filter((s) => s.pvcType === 'Flexible PVC')
    .reduce((s, x) => s + x.quantityTonnes, 0);

  // Scale Q2.4 collected streams so they sum to totalCollected
  const baseQ24 = [
    { wasteType: 'B&C (Rigid profiles, windows, pipes)', pvcType: 'Rigid PVC' as const, quantityTonnes: Math.round(totalCollected * 0.58) },
    { wasteType: 'CABLES (WEEE / RAEE & Construction)', pvcType: 'Flexible PVC' as const, quantityTonnes: Math.round(totalCollected * 0.31) },
    { wasteType: 'FLOORING, MEMBRANES & ADVERTISING FLEX', pvcType: 'Flexible PVC' as const, quantityTonnes: Math.round(totalCollected * 0.07) },
    { wasteType: 'LARGE URBAN & COMMERCIAL RIGID PVC', pvcType: 'Rigid PVC' as const, quantityTonnes: 0 }
  ];
  baseQ24[3].quantityTonnes = Math.max(
    0,
    totalCollected - (baseQ24[0].quantityTonnes + baseQ24[1].quantityTonnes + baseQ24[2].quantityTonnes)
  );

  const totalRigidCollected = baseQ24
    .filter((s) => s.pvcType === 'Rigid PVC')
    .reduce((s, x) => s + x.quantityTonnes, 0);
  const totalFlexibleCollected = baseQ24
    .filter((s) => s.pvcType === 'Flexible PVC')
    .reduce((s, x) => s + x.quantityTonnes, 0);

  // Card 3 Sorted / Processed across Europe
  const totalSortedProcessed = Math.round(totalCollected * 0.94);
  const procRigidBnc = Math.round(totalSortedProcessed * 0.48);
  const procRigidUtil = Math.round(totalSortedProcessed * 0.14);
  const procFlexCables = Math.round(totalSortedProcessed * 0.34);
  const procOther = Math.max(0, totalSortedProcessed - (procRigidBnc + procRigidUtil + procFlexCables));

  // Card 4 Recycled breakdown
  const totalRigidRecycled = Math.round(totalRecycledOutput * 0.59);
  const totalFlexibleRecycled = Math.round(totalRecycledOutput * 0.31);
  const totalMixedRecycled = Math.max(0, totalRecycledOutput - (totalRigidRecycled + totalFlexibleRecycled));

  const totalUptakeTonnes = Math.round(totalRecoTraceOutput * 0.68);
  const uptakeRigidTonnes = Math.round(totalUptakeTonnes * 0.56);
  const uptakeFlexCables = Math.round(totalUptakeTonnes * 0.35);
  const uptakeFlexAgri = Math.round(totalUptakeTonnes * 0.05);
  const uptakeFlexOther = Math.max(0, totalUptakeTonnes - (uptakeRigidTonnes + uptakeFlexCables + uptakeFlexAgri));

  // RecoTrace European totals
  const recyclingInputTonnes = Math.round(totalRecoTraceOutput * 1.045);
  const convertingInputTonnes = Math.round(totalUptakeTonnes * 1.025);
  const convertingOutputTonnes = totalUptakeTonnes;

  // Map country-level landfill volumes into Q6.5 breakdown for the European view
  const countryCoords: Record<string, { lat: number; lng: number }> = {
    IT: { lat: 42.8, lng: 12.5 },
    DE: { lat: 46.8, lng: 10.4 },
    FR: { lat: 45.2, lng: 7.2 },
    UK: { lat: 46.5, lng: 7.8 },
    ES: { lat: 40.4, lng: 8.5 },
    PL: { lat: 46.2, lng: 16.5 },
    NL: { lat: 46.9, lng: 8.9 },
    BE: { lat: 46.4, lng: 8.4 },
    AT: { lat: 46.6, lng: 13.8 },
    CZ: { lat: 46.5, lng: 14.8 },
    SE: { lat: 47.0, lng: 15.2 },
    CH: { lat: 46.2, lng: 8.8 }
  };

  const euLandfillByCountry = liveCountries
    .slice()
    .sort((a, b) => b.landfilledTonnes - a.landfilledTonnes)
    .map((c, idx) => ({
      id: `eu-lf-${c.code}`,
      wasteType: 'Pre-treated mixed C&D & municipal PVC waste',
      pvcType: 'Both' as const,
      provinceOrCity: `${c.flag} ${c.name}`,
      quantityTonnes: c.landfilledTonnes,
      lat: countryCoords[c.code]?.lat ?? 43.0 + (idx % 4),
      lng: countryCoords[c.code]?.lng ?? 10.0 + (idx % 5),
      remarks: `${c.regionGroup} (${c.rrrLead})`
    }));

  // Combine facilities from IT + representative European facilities
  const extraEuFacilities = [
    {
      id: 'eu-fac-de-1',
      stage: 'Sorting & Pretreatment' as const,
      questionRef: '3.8' as const,
      name: 'REWINDO / VEKA UMWELTTECHNIK GMBH (DE)',
      pvcType: 'Rigid PVC' as const,
      city: 'Behringen (Thuringia)',
      regionOrProvince: 'Germany',
      lat: 51.02,
      lng: 10.51,
      sizeRaw: '165 empl - 58,0M€',
      employees: 165,
      turnoverEurMillions: 58.0
    },
    {
      id: 'eu-fac-de-2',
      stage: 'Converting (rPVC)' as const,
      questionRef: '4.8' as const,
      name: 'PROFINE / KÖMMERLING RECYCLING (DE)',
      pvcType: 'Rigid PVC' as const,
      city: 'Pirmasens',
      regionOrProvince: 'Germany',
      lat: 49.2,
      lng: 7.6,
      sizeRaw: '310 empl - 112,0M€',
      employees: 310,
      turnoverEurMillions: 112.0
    },
    {
      id: 'eu-fac-fr-1',
      stage: 'Collection' as const,
      questionRef: '2.5' as const,
      name: 'VALOBAT / SUEZ B&C EPR HUB (FR)',
      pvcType: 'Both' as const,
      city: 'Lyon',
      regionOrProvince: 'France',
      lat: 45.76,
      lng: 4.83,
      sizeRaw: '240 empl - 85,0M€',
      employees: 240,
      turnoverEurMillions: 85.0
    },
    {
      id: 'eu-fac-fr-2',
      stage: 'Converting (rPVC)' as const,
      questionRef: '4.8' as const,
      name: 'TARKETT / GERFLOR FLOORING RECYCLING (FR)',
      pvcType: 'Flexible PVC' as const,
      city: 'Sedan / Saint-Paul',
      regionOrProvince: 'France',
      lat: 49.7,
      lng: 4.94,
      sizeRaw: '190 empl - 74,0M€',
      employees: 190,
      turnoverEurMillions: 74.0
    },
    {
      id: 'eu-fac-nl-1',
      stage: 'Converting (rPVC)' as const,
      questionRef: '4.8' as const,
      name: 'WAVIN / BUREAULEIDING PIPE RECYCLING (NL)',
      pvcType: 'Rigid PVC' as const,
      city: 'Hardenberg',
      regionOrProvince: 'Netherlands',
      lat: 52.57,
      lng: 6.62,
      sizeRaw: '220 empl - 92,0M€',
      employees: 220,
      turnoverEurMillions: 92.0
    }
  ];

  return {
    ...itDataset,
    countryCode: 'EU',
    countryName: 'Europe (12 Countries Aggregated)',
    regionGroup: 'Western Europe',
    flag: '🇪🇺',
    reportingYear: 2025,
    lastUpdated: '2025-07-15',
    rrrLead: 'Recovinyl / VinylPlus Europe & ECVM National RRR Network (12 Countries)',
    nationalNetwork: 'EU27 + UK, NO, CH National PVC Associations & RRRs',
    tracks: {
      trackA: 'Completed',
      trackB1: 'In Progress',
      trackB2: 'In Progress',
      finalSubmission: 'In Progress'
    },
    socioEconomic: {
      ...itDataset.socioEconomic,
      populationMillions: 541.8,
      gdpGrowthPct: '+0.9% (EU Avg 2025)',
      inflationPct: '2.2%',
      unemploymentPct: '6.0%',
      virginPolymerKt2024: 40969,
      virginPolymerTrend: '-1.4% YoY across European converters',
      recycledPolymerKt2024: 7977,
      recycledPolymerTrend: '+4.8% YoY growth in circular polymer uptake',
      plasticDomesticRecycledPct: 31,
      plasticExportedPct: 14,
      plasticIncineratedPct: 44,
      pvcRecycledKt2024: Number((totalRecoTraceOutput / 1000).toFixed(1)),
      constructionGrowth2024Pct: '-1.8%',
      constructionGrowth2025Pct: '+0.6%',
      polymerProcessedH1_2025Trend: 'Gradual recovery across Western & Central Europe (+0.8% YoY)',
      pvcProcessedH1_2025Trend: 'Resilient renovation & infrastructure pipe demand (+1.2% YoY)',
      politicalLandscape: [
        'Pan-European rollout of Building & Construction EPR schemes (operational in France REP PMCB, voluntary Rewindo/B&C schemes in DE/NL/BE/UK, upcoming in IT/ES/PL).',
        'Divergent landfill regimes: strict landfill bans in DE, NL, BE, AT, SE, CH vs. high landfill diversion potential in IT (169 kt), ES (138 kt), PL (109 kt), FR (108 kt), and UK (94 kt).',
        'Harmonization of digital waste traceability across borders (RENTRI in IT, eANV in DE, Trackdéchets in FR, e-SIR in ES, BDO in PL).'
      ],
      nationalPolicyNotes: [
        'VinylPlus Product Label & RecoTrace certification recognized across European green public procurement and circular construction benchmarks.'
      ]
    },
    recoTrace: {
      ...itDataset.recoTrace,
      recyclingInputTonnes,
      recyclingOutputTonnes: totalRecoTraceOutput,
      convertingInputTonnes,
      convertingOutputTonnes,
      preConsumerSharePct: 54,
      postConsumerSharePct: 46,
      ytdRecyclingTotalTonnes: Math.round(totalRecoTraceOutput * 0.38),
      ytdRecyclingForecastTonnes: Math.round(totalRecoTraceOutput * 1.03),
      ytdRecyclingPreConsumerTonnes: Math.round(totalRecoTraceOutput * 0.38 * 0.54),
      ytdRecyclingPostConsumerTonnes: Math.round(totalRecoTraceOutput * 0.38 * 0.46),
      ytdConvertingTotalTonnes: Math.round(convertingOutputTonnes * 0.41),
      ytdConvertingForecastTonnes: Math.round(convertingOutputTonnes * 1.04),
      ytdExplanation:
        'Aggregated European RecoTrace volumes across 12 reporting countries. Semester reporters submit H1 volumes after June close.',
      endApplicationBreakdown: [
        { label: 'Windows & Profiles', tonnes: Math.round(convertingOutputTonnes * 0.34), pct: 34 },
        { label: 'Pipes & Fittings', tonnes: Math.round(convertingOutputTonnes * 0.28), pct: 28 },
        { label: 'Building & Construction Other', tonnes: Math.round(convertingOutputTonnes * 0.22), pct: 22 },
        { label: 'Traffic Management & Industrial', tonnes: Math.round(convertingOutputTonnes * 0.11), pct: 11 },
        { label: 'Flooring & Flexible Applications', tonnes: Math.round(convertingOutputTonnes * 0.05), pct: 5 }
      ]
    },
    card1: {
      ...itDataset.card1,
      q1_2_streams: scaledQ12Streams,
      totalRigidGenerated,
      totalFlexibleGenerated,
      totalGenerated
    },
    card2: {
      ...itDataset.card2,
      q2_4_collectedStreams: baseQ24,
      totalRigidCollected,
      totalFlexibleCollected,
      totalCollected,
      q2_6_exports: [
        {
          id: 'eu-ex-1',
          questionRef: '2.6',
          wasteType: 'B&C RIGID PROFILES & BANNERS',
          processedLocation: 'Processed in the country',
          destinationCountries: 'Intra-EU Cross-Border Recycling Hubs (DE, NL, BE, FR)',
          wasteCodes: '17 02 03 / 08 01 11',
          pvcType: 'Rigid PVC',
          totalQuantityTonnes: Math.round(44200 * (colScale / 17))
        },
        {
          id: 'eu-ex-2',
          questionRef: '2.6',
          wasteType: 'CABLES & FLEXIBLE WEEE',
          processedLocation: 'Both',
          destinationCountries: 'Intra-EU & OECD / Extra-EU (UK, TR, MA)',
          wasteCodes: '17 04 11 / 16 02 16',
          pvcType: 'Flexible PVC',
          totalQuantityTonnes: Math.round(98500 * (colScale / 17))
        }
      ]
    },
    card3: {
      ...itDataset.card3,
      totalSortedProcessed,
      q3_10_massBalance: [
        {
          id: 'eu-mb-1',
          questionRef: '3.10',
          wasteType: 'B&C (Rigid profiles, windows, pipes)',
          processedLocation: 'Processed in the country',
          destinationCountries: 'EU27 + UK, NO, CH',
          wasteCodes: '17 02 03 / 19 12 04',
          pvcType: 'Rigid PVC',
          totalQuantityTonnes: procRigidBnc,
          recyclingTonnes: Math.round(procRigidBnc * 0.88),
          incinerationTonnes: Math.round(procRigidBnc * 0.07),
          landfillingTonnes: Math.round(procRigidBnc * 0.05),
          notes: 'Aggregated European B&C sorting output'
        },
        {
          id: 'eu-mb-2',
          questionRef: '3.10',
          wasteType: 'CABLES (WEEE / Construction)',
          processedLocation: 'Both',
          destinationCountries: 'EU27 + OECD',
          wasteCodes: '17 04 11 / 19 12 04',
          pvcType: 'Flexible PVC',
          totalQuantityTonnes: procFlexCables,
          recyclingTonnes: Math.round(procFlexCables * 0.62),
          incinerationTonnes: Math.round(procFlexCables * 0.18),
          landfillingTonnes: Math.round(procFlexCables * 0.2),
          notes: 'Aggregated European cable granulation & sorting'
        },
        {
          id: 'eu-mb-3',
          questionRef: '3.10',
          wasteType: 'RIGID FROM MULTI-UTILITIES & COMMERCIAL',
          processedLocation: 'Processed in the country',
          destinationCountries: 'EU27 + UK, NO, CH',
          wasteCodes: '19 12 04 / 20 01 39',
          pvcType: 'Rigid PVC',
          totalQuantityTonnes: procRigidUtil,
          recyclingTonnes: Math.round(procRigidUtil * 0.82),
          incinerationTonnes: Math.round(procRigidUtil * 0.12),
          landfillingTonnes: Math.round(procRigidUtil * 0.06),
          notes: 'Aggregated municipal & commercial rigid sorting'
        },
        {
          id: 'eu-mb-4',
          questionRef: '3.10',
          wasteType: 'OTHER (Mixed Rigid & Flexible Residue)',
          processedLocation: 'Processed in the country',
          destinationCountries: 'Domestic WtE / Landfill',
          wasteCodes: '19 12 12',
          pvcType: 'Both',
          totalQuantityTonnes: procOther,
          recyclingTonnes: 0,
          incinerationTonnes: Math.round(procOther * 0.45),
          landfillingTonnes: Math.round(procOther * 0.55),
          notes: 'Sorting rejects directed to WtE or landfill'
        }
      ]
    },
    card4: {
      ...itDataset.card4,
      totalRigidRecycled,
      totalFlexibleRecycled,
      totalMixedRecycled,
      totalRecycledOutput,
      totalUptakeTonnes,
      q4_6_recyclingByTech: [
        {
          id: 'eu-r1',
          stage: 'Recycling',
          questionRef: '4.6',
          wasteType: 'B&C Windows, Profiles & Pipes',
          pvcType: 'Rigid PVC',
          technologyCategory: 'Mechanical Shredding & Co-Extrusion',
          automationOrSubTech: 'Optical NIR & Melt Filtration',
          description: 'Closed-loop window profile and pipe mechanical recycling across Europe',
          inputOrOutputTonnes: Math.round(totalRigidRecycled * 0.72),
          outputForm: 'Granules / Micronized Powder',
          typicalQuality: 'High purity (<0.5% impurity)',
          mainImpurities: 'Rubber gaskets, residual metal, non-PVC polymers',
          priceEurPerTon: '120–240 €/t'
        },
        {
          id: 'eu-r2',
          stage: 'Recycling',
          questionRef: '4.6',
          wasteType: 'Mixed Rigid Post-Consumer PVC',
          pvcType: 'Rigid PVC',
          technologyCategory: 'NIR Optical & Density Separation',
          automationOrSubTech: 'Automated Sensor-Based Sorting',
          description: 'Separation of rigid PVC from mixed C&D and municipal plastics',
          inputOrOutputTonnes: Math.round(totalRigidRecycled * 0.28),
          outputForm: 'Regrind / Granules',
          typicalQuality: 'Medium-High (<1.5% impurity)',
          mainImpurities: 'PE/PP/PS/ABS co-polymers',
          priceEurPerTon: '80–160 €/t'
        },
        {
          id: 'eu-r3',
          stage: 'Recycling',
          questionRef: '4.6',
          wasteType: 'Cables (WEEE / Construction)',
          pvcType: 'Flexible PVC',
          technologyCategory: 'Dry Granulation, Flotation / Minery & Micronization',
          automationOrSubTech: 'Density / Wet & Dry Gravity Separation',
          description: 'Recovery of flexible PVC insulation and sheathing from copper/aluminium cables',
          inputOrOutputTonnes: totalFlexibleRecycled,
          outputForm: 'Flexible rPVC Granules',
          typicalQuality: 'Copper <1% (Standard) to <0.1% (Premium)',
          mainImpurities: 'Copper/Al traces, XLPE/rubber',
          priceEurPerTon: '60–150 €/t'
        },
        {
          id: 'eu-r4',
          stage: 'Recycling',
          questionRef: '4.6',
          wasteType: 'Mixed Rigid & Flexible Fractions',
          pvcType: 'Both',
          technologyCategory: 'Electrostatic Separation (Hamos)',
          automationOrSubTech: 'Triboelectric Charging & High-Purity Separation',
          description: 'Separation of mixed rigid and flexible PVC from rubber and polyolefins',
          inputOrOutputTonnes: totalMixedRecycled,
          outputForm: 'Purified Regrind / Compound',
          typicalQuality: '>98.5% PVC purity',
          mainImpurities: 'Trace rubber / elastomers',
          priceEurPerTon: '90–180 €/t'
        }
      ],
      q4_11_uptake: [
        {
          id: 'eu-u1',
          wasteType: 'RIGID B&C (Profiles, Pipes & Mixed Rigid)',
          location: 'Uptake/Conversion in Europe',
          pvcType: 'Rigid PVC',
          totalQuantityTonnes: uptakeRigidTonnes,
          products: [
            { product: 'Window Profiles & Building Profiles', tonnes: Math.round(uptakeRigidTonnes * 0.48) },
            { product: 'Multi-layer & Foam-core Pipes', tonnes: Math.round(uptakeRigidTonnes * 0.38) },
            { product: 'Agricultural & Industrial Profiles', tonnes: Math.round(uptakeRigidTonnes * 0.14) }
          ],
          unconvertedReasonOrFate: 'Full converter uptake across European pipe & window profile manufacturers'
        },
        {
          id: 'eu-u2',
          wasteType: 'CABLES (Flexible rPVC)',
          location: 'Uptake/Conversion in Europe',
          pvcType: 'Flexible PVC',
          totalQuantityTonnes: uptakeFlexCables,
          products: [
            { product: 'Cable Insulation & Bedding', tonnes: Math.round(uptakeFlexCables * 0.55) },
            { product: 'Traffic Management (Cones, Bases)', tonnes: Math.round(uptakeFlexCables * 0.22) },
            { product: 'Flooring, Mats & Industrial Footwear', tonnes: Math.round(uptakeFlexCables * 0.23) }
          ],
          unconvertedReasonOrFate: 'High-impurity residue (~4%) directed to WtE / landfill'
        },
        {
          id: 'eu-u3',
          wasteType: 'AGRICULTURE & ROOFING MEMBRANES',
          location: 'Uptake/Conversion in Europe',
          pvcType: 'Flexible PVC',
          totalQuantityTonnes: uptakeFlexAgri,
          products: [{ product: 'Technical Membranes & Films', tonnes: uptakeFlexAgri }],
          unconvertedReasonOrFate: 'Taken up by specialized membrane converters'
        },
        {
          id: 'eu-u4',
          wasteType: 'OTHER FLEXIBLE PVC',
          location: 'Uptake/Conversion in Europe',
          pvcType: 'Flexible PVC',
          totalQuantityTonnes: uptakeFlexOther,
          products: [{ product: 'General Flexible Applications', tonnes: uptakeFlexOther }],
          unconvertedReasonOrFate: 'Taken up domestically and intra-EU'
        }
      ]
    },
    card5: {
      ...itDataset.card5,
      totalIncineratedTonnes,
      q5_5_incineratedStreams: [
        {
          id: 'eu-inc-1',
          stage: 'Incineration',
          questionRef: '5.5',
          wasteType: 'Non-sorted municipal & bulky residual waste (WtE)',
          pvcType: 'Both',
          technologyCategory: 'Grate Incineration with Energy Recovery (R1)',
          automationOrSubTech: 'Dry/Wet Flue Gas Acid Scrubbing',
          description: 'Incinerated with energy recovery in European MVA / WtE plants',
          inputOrOutputTonnes: Math.round(totalIncineratedTonnes * 0.82),
          outputForm: 'Heat & Electricity + Neutralized Salt Residue',
          typicalQuality: 'MSW mixed fraction',
          mainImpurities: 'Chlorine neutralized via lime/bicarbonate scrubbing',
          priceEurPerTon: '95–180 €/t gate fee'
        },
        {
          id: 'eu-inc-2',
          stage: 'Incineration',
          questionRef: '5.5',
          wasteType: 'Sorting & C&D high-calorific residues',
          pvcType: 'Rigid PVC',
          technologyCategory: 'Industrial Co-Incineration / WtE',
          automationOrSubTech: 'Flue Gas HCl Recovery / Neutralization',
          description: 'Thermal recovery in countries with strict landfill bans (DE, NL, BE, AT, SE, CH)',
          inputOrOutputTonnes: Math.round(totalIncineratedTonnes * 0.16),
          outputForm: 'Process Steam & Power',
          typicalQuality: 'High-calorific sorting rejects',
          mainImpurities: 'Mixed plastics, wood, coatings',
          priceEurPerTon: '110–210 €/t gate fee'
        },
        {
          id: 'eu-inc-3',
          stage: 'Incineration',
          questionRef: '5.5',
          wasteType: 'Regulated medical & hospital PVC waste',
          pvcType: 'Flexible PVC',
          technologyCategory: 'Hazardous / Clinical Waste Incineration',
          automationOrSubTech: 'High-Temperature Rotary Kiln (>1,100°C)',
          description: 'Mandatory clinical waste incineration',
          inputOrOutputTonnes: Math.max(
            0,
            totalIncineratedTonnes -
              Math.round(totalIncineratedTonnes * 0.82) -
              Math.round(totalIncineratedTonnes * 0.16)
          ),
          outputForm: 'Thermal Destruction',
          typicalQuality: 'Clinical infectious waste',
          mainImpurities: 'Bio-hazard materials',
          priceEurPerTon: '250–450 €/t'
        }
      ]
    },
    card6: {
      ...itDataset.card6,
      q6_4_totalLandfilledEstimateTonnes: totalLandfilledTonnes,
      q6_5_provincialQuantities: euLandfillByCountry
    },
    facilities: [...extraEuFacilities, ...itDataset.facilities]
  };
}

