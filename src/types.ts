export type PvcType = 'Rigid PVC' | 'Flexible PVC' | 'Both' | 'Unknown';

export type DataBasis = 'Evidence-based' | 'Educated estimation' | 'Calculated' | 'Survey / RRR Input';

export type TrackStatus = 'Completed' | 'In Progress' | 'Draft Submitted' | 'Pending';

export type ProviderRoleType =
  | 'Regional Representative (RRR)'
  | 'ECVM / National PVC Network'
  | 'Waste Collector / Multi-Utility'
  | 'Sorting & Pretreatment Operator'
  | 'PVC Recycler / Converter';

export interface ProviderAccount {
  id: string;
  contactName: string;
  email: string;
  organization: string;
  roleType: ProviderRoleType;
  countryCode: string;
  countryName: string;
  flag: string;
  createdAt: string;
  lastSavedAt: string;
  cardCompletion: {
    card1: boolean;
    card2: boolean;
    card3: boolean;
    card4: boolean;
    card5: boolean;
    card6: boolean;
    card7: boolean;
  };
  dataset: CountryPCWIDataset;
}

export interface DiscrepancyAlert {
  id: string;
  card: string;
  question: string;
  title: string;
  xlsxValue: string;
  pptxValue: string;
  explanation: string;
  severity: 'high' | 'medium' | 'info';
  resolved: boolean;
}

export interface SocioEconomicData {
  populationMillions: number;
  gdpGrowthPct: string;
  inflationPct: string;
  unemploymentPct: string;
  virginPolymerKt2024: number;
  virginPolymerTrend: string;
  recycledPolymerKt2024: number;
  recycledPolymerTrend: string;
  mainPlasticApplications: string[];
  plasticDomesticRecycledPct: number;
  plasticExportedPct: number;
  plasticIncineratedPct: number;
  mainFlexiblePvcApps: string;
  mainRigidPvcApps: string;
  pvcRecycledKt2024: number;
  constructionGrowth2024Pct: string;
  constructionGrowth2025Pct: string;
  polymerProcessedH1_2025Trend: string;
  pvcProcessedH1_2025Trend: string;
  politicalLandscape: string[];
  mediaAndNgoTopic: string;
  mediaSourceUrl?: string;
  euRegulationNotes: string[];
  nationalPolicyNotes: string[];
}

export interface RecoTraceData {
  year: number;
  recyclingInputTonnes: number;
  recyclingOutputTonnes: number;
  convertingInputTonnes: number;
  convertingOutputTonnes: number;
  topEndApplication: string;
  preConsumerSharePct: number;
  postConsumerSharePct: number;
  wasteOriginBreakdown: { label: string; pct: number; pvcType: PvcType }[];
  endApplicationBreakdown: { label: string; tonnes: number; pct: number }[];
  ytdPeriodLabel: string;
  ytdRecyclingTotalTonnes: number;
  ytdRecyclingForecastTonnes: number;
  ytdRecyclingPreConsumerTonnes: number;
  ytdRecyclingPostConsumerTonnes: number;
  ytdConvertingTotalTonnes: number;
  ytdConvertingForecastTonnes: number;
  ytdExplanation: string;
  sectorOutlooks: { sector: string; outlook: string }[];
}

export interface WasteStreamGeneration {
  id: string;
  wasteType: string;
  pvcType: PvcType;
  quantityTonnes: number;
  pptxDiagramTonnes?: number;
  basis: DataBasis;
  notes?: string;
}

export interface FacilityEntity {
  id: string;
  stage: 'Collection' | 'Sorting & Pretreatment' | 'Converting (rPVC)' | 'Landfill Operator';
  questionRef: '2.5' | '3.8' | '4.8' | '6.6';
  name: string;
  pvcType: PvcType;
  city: string;
  regionOrProvince: string;
  lat: number;
  lng: number;
  sizeRaw: string;
  employees: number | null;
  turnoverEurMillions: number | null;
}

export interface ExportFlowItem {
  id: string;
  questionRef: '2.6' | '3.10' | '4.11';
  wasteType: string;
  processedLocation:
    | 'Processed in the country'
    | 'Processed outside the country'
    | 'Both'
    | 'Uptake/Conversion in the country'
    | 'Uptake/Conversion outside the country';
  destinationCountries: string;
  wasteCodes: string;
  pvcType: PvcType;
  totalQuantityTonnes: number | null;
  recyclingTonnes?: number | null;
  xlsxRawRecyclingTonnes?: number | null;
  incinerationTonnes?: number | null;
  landfillingTonnes?: number | null;
  notes?: string;
}

export interface StakeholderItem {
  id: string;
  questionRef: string;
  name: string;
  affiliation: string;
  website: string;
  city: string;
  contact: string;
}

export interface EconomicCostItem {
  id: string;
  stage: 'Collection' | 'Sorting & Pretreatment' | 'Recycling' | 'Incineration' | 'Landfilling';
  questionRef: '2.8' | '3.12' | '4.13' | '5.8' | '6.8';
  costType: string;
  pvcType: PvcType;
  costDisplay: string;
  minEurPerTon: number;
  maxEurPerTon: number;
  remarks: string;
}

export interface TechnologyProcessItem {
  id: string;
  stage: 'Sorting & Pretreatment' | 'Recycling' | 'Incineration';
  questionRef: '3.7' | '4.6' | '5.5';
  wasteType: string;
  pvcType: PvcType;
  technologyCategory: string;
  automationOrSubTech: string;
  description: string;
  inputOrOutputTonnes: number | null;
  outputForm: string;
  typicalQuality: string;
  mainImpurities: string;
  priceEurPerTon: string;
}

export interface ProductUptakeItem {
  id: string;
  wasteType: string;
  location: string;
  pvcType: PvcType;
  totalQuantityTonnes: number;
  products: { product: string; tonnes: number | string }[];
  unconvertedReasonOrFate: string;
}

export interface LandfillProvinceQuantity {
  id: string;
  wasteType: string;
  pvcType: PvcType;
  provinceOrCity: string;
  quantityTonnes: number;
  lat: number;
  lng: number;
  remarks?: string;
}

export interface TraceabilityTool {
  name: string;
  legislation: string;
  entityInCharge: string;
  mainPurpose: string;
  relevantFeatures: string;
  website: string;
}

export interface RecyclingObstacle {
  rank: number;
  obstacle: string;
  pvcTypeAffected: PvcType;
  mitigation: string;
}

export interface CountryPCWIDataset {
  countryCode: string;
  countryName: string;
  regionGroup: 'Western Europe' | 'Southern Europe' | 'Central & Eastern Europe' | 'Northern Europe';
  flag: string;
  reportingYear: number;
  lastUpdated: string;
  rrrLead: string;
  nationalNetwork: string;
  tracks: {
    trackA: TrackStatus;
    trackB1: TrackStatus;
    trackB2: TrackStatus;
    finalSubmission: TrackStatus;
  };
  socioEconomic: SocioEconomicData;
  recoTrace: RecoTraceData;

  card1: {
    q1_1_mainSources: string[];
    q1_1_availableItems?: { id: string; text: string; selected: boolean }[];
    q1_2_streams: WasteStreamGeneration[];
    totalRigidGenerated: number;
    totalFlexibleGenerated: number;
    totalGenerated: number;
  };

  card2: {
    q2_1_plasticRequirements: string[];
    q2_1_availableItems?: { id: string; text: string; selected: boolean }[];
    q2_2_pvcRequirements: string[];
    q2_2_availableItems?: { id: string; text: string; selected: boolean }[];
    q2_3_incentives: string;
    q2_3_availableItems?: { id: string; text: string; selected: boolean }[];
    q2_4_collectedStreams: { wasteType: string; pvcType: PvcType; quantityTonnes: number }[];
    totalRigidCollected: number;
    totalFlexibleCollected: number;
    totalCollected: number;
    q2_6_exports: ExportFlowItem[];
    q2_7_stakeholders: StakeholderItem[];
    q2_8_costs: EconomicCostItem[];
  };

  card3: {
    q3_1_generalRequirements: string[];
    q3_2_pvcRequirements: string;
    q3_3_incentives: string;
    q3_7_technologies: TechnologyProcessItem[];
    q3_10_massBalance: ExportFlowItem[];
    totalSortedProcessed: number;
    q3_11_stakeholders: string;
    q3_11_stakeholdersList?: StakeholderItem[];
    q3_12_costs: EconomicCostItem[];
  };

  card4: {
    q4_1_generalRequirements: string[];
    q4_2_pvcRequirements: string;
    q4_3_incentives: string;
    q4_4_technologiesSummary: { name: string; description: string }[];
    q4_5_qualityAndPricingByStream: { stream: string; pvcType: PvcType; impurityRule: string; priceRange: string }[];
    q4_6_recyclingByTech: TechnologyProcessItem[];
    totalRigidRecycled: number;
    totalFlexibleRecycled: number;
    totalMixedRecycled: number;
    totalRecycledOutput: number;
    q4_9_exportStatus: string;
    q4_10_exportNotes: string[];
    q4_11_uptake: ProductUptakeItem[];
    totalUptakeTonnes: number;
    q4_12_stakeholders: string;
    q4_12_stakeholdersList?: StakeholderItem[];
    q4_13_costs: EconomicCostItem[];
  };

  card5: {
    q5_1_generalRequirements: string;
    q5_2_pvcRequirements: string[];
    q5_3_disincentives: string;
    q5_4_technologyNotes: string;
    q5_5_incineratedStreams: TechnologyProcessItem[];
    totalIncineratedTonnes: number;
    q5_6_facilitiesNote: string;
    q5_7_stakeholdersNote: string;
    q5_7_stakeholdersList?: StakeholderItem[];
    q5_8_costsNote: string;
    q5_8_costsList?: EconomicCostItem[];
    q5_9_publicConcerns: string;
  };

  card6: {
    q6_1_generalRequirements: string[];
    q6_2_pvcRequirements: string;
    q6_3_disincentives: string;
    q6_4_totalLandfilledEstimateTonnes: number;
    q6_5_provincialQuantities: LandfillProvinceQuantity[];
    q6_7_stakeholdersNote: string;
    q6_7_stakeholdersList?: StakeholderItem[];
    q6_8_costs: EconomicCostItem[];
    q6_9_publicConcerns: string;
  };

  card7: {
    q7_1_traceabilityTools: TraceabilityTool[];
    q7_2_chainOrganizationAndExport: string;
    q7_3_topObstacles: RecyclingObstacle[];
    q7_4_voluntaryInitiatives: string;
    q7_5_generalImprovements: string;
    q7_6_keySourcesContacts: string;
    q7_6_stakeholdersList?: StakeholderItem[];
    q7_7_outlook2030: string;
  };

  multiselectRegistry?: Record<string, { id: string; text: string; selected: boolean }[]>;
  facilities: FacilityEntity[];
  discrepancies: DiscrepancyAlert[];
}
