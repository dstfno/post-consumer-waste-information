import { CountryPCWIDataset, ProviderAccount, ProviderRoleType } from '../types';
import { ITALY_2025_DATASET } from './italy2025';
import { GERMANY_2025_DATASET, FRANCE_2025_DATASET, EUROPEAN_COUNTRIES_SUMMARY } from './europeanCountries';

export const INITIAL_PROVIDER_ACCOUNTS: ProviderAccount[] = [
  {
    id: 'acc-it-rrr',
    contactName: 'Demo Italia RRR Desk',
    email: 'rrr.it@pcwi-demo.example',
    organization: 'Demo National PVC Network — Italy',
    roleType: 'Regional Representative (RRR)',
    countryCode: 'IT',
    countryName: 'Italy',
    flag: '🇮🇹',
    createdAt: '2025-04-05',
    lastSavedAt: '2025-06-23 14:30',
    cardCompletion: {
      card1: true,
      card2: true,
      card3: true,
      card4: true,
      card5: true,
      card6: true,
      card7: true
    },
    dataset: ITALY_2025_DATASET
  },
  {
    id: 'acc-de-rrr',
    contactName: 'Alex Berg (Demo)',
    email: 'rrr.de@pcwi-demo.example',
    organization: 'Demo National PVC Network — Germany',
    roleType: 'Regional Representative (RRR)',
    countryCode: 'DE',
    countryName: 'Germany',
    flag: '🇩🇪',
    createdAt: '2025-04-10',
    lastSavedAt: '2025-07-14 11:15',
    cardCompletion: {
      card1: true,
      card2: true,
      card3: true,
      card4: true,
      card5: true,
      card6: true,
      card7: false
    },
    dataset: GERMANY_2025_DATASET
  },
  {
    id: 'acc-fr-rrr',
    contactName: 'Camille Dupont (Demo)',
    email: 'rrr.fr@pcwi-demo.example',
    organization: 'Demo National PVC Network — France',
    roleType: 'Regional Representative (RRR)',
    countryCode: 'FR',
    countryName: 'France',
    flag: '🇫🇷',
    createdAt: '2025-04-12',
    lastSavedAt: '2025-07-08 16:40',
    cardCompletion: {
      card1: true,
      card2: true,
      card3: true,
      card4: true,
      card5: true,
      card6: true,
      card7: true
    },
    dataset: FRANCE_2025_DATASET
  }
];

export function createNewProviderAccount(params: {
  contactName: string;
  email: string;
  organization: string;
  roleType: ProviderRoleType;
  countryCode: string;
  startMode: 'blank' | 'template';
}): ProviderAccount {
  const countryMeta = EUROPEAN_COUNTRIES_SUMMARY.find((c) => c.code === params.countryCode) || {
    code: params.countryCode,
    name: params.countryCode,
    flag: '🇪🇺',
    regionGroup: 'Western Europe' as const,
    rrrLead: params.organization,
    traceabilityTool: 'National Digital Waste Register'
  };

  const now = new Date();
  const timestamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;

  if (params.startMode === 'template') {
    const base =
      params.countryCode === 'DE'
        ? GERMANY_2025_DATASET
        : params.countryCode === 'FR'
        ? FRANCE_2025_DATASET
        : ITALY_2025_DATASET;

    return {
      id: `acc-${Date.now()}`,
      contactName: params.contactName,
      email: params.email,
      organization: params.organization,
      roleType: params.roleType,
      countryCode: countryMeta.code,
      countryName: countryMeta.name,
      flag: countryMeta.flag,
      createdAt: now.toISOString().slice(0, 10),
      lastSavedAt: timestamp,
      cardCompletion: {
        card1: true,
        card2: true,
        card3: true,
        card4: true,
        card5: true,
        card6: true,
        card7: true
      },
      dataset: {
        ...JSON.parse(JSON.stringify(base)),
        countryCode: countryMeta.code,
        countryName: countryMeta.name,
        flag: countryMeta.flag,
        rrrLead: `${params.organization} (${params.contactName})`,
        lastUpdated: now.toISOString().slice(0, 10)
      }
    };
  }

  // Blank questionnaire ready for the provider to fill out from scratch
  const blankDataset: CountryPCWIDataset = {
    ...JSON.parse(JSON.stringify(ITALY_2025_DATASET)),
    countryCode: countryMeta.code,
    countryName: countryMeta.name,
    flag: countryMeta.flag,
    regionGroup: countryMeta.regionGroup,
    reportingYear: 2025,
    lastUpdated: now.toISOString().slice(0, 10),
    rrrLead: `${params.organization} (${params.contactName})`,
    nationalNetwork: params.organization,
    tracks: {
      trackA: 'In Progress',
      trackB1: 'Pending',
      trackB2: 'Pending',
      finalSubmission: 'Pending'
    },
    card1: {
      q1_1_mainSources: ['1) Municipal & urban waste collection', '2) Building & Construction (B&C) demolition/renovation', '3) WEEE / Cable waste'],
      q1_2_streams: [
        { id: 'b-1', wasteType: 'B&C (Pipes, Profiles, Windows)', pvcType: 'Rigid PVC', quantityTonnes: 0, basis: 'Survey / RRR Input' },
        { id: 'b-2', wasteType: 'WEEE / CABLES', pvcType: 'Flexible PVC', quantityTonnes: 0, basis: 'Survey / RRR Input' }
      ],
      totalRigidGenerated: 0,
      totalFlexibleGenerated: 0,
      totalGenerated: 0
    },
    card2: {
      q2_1_plasticRequirements: ['Enter general national plastic waste collection & EPR requirements...'],
      q2_2_pvcRequirements: ['Enter PVC-specific collection schemes...'],
      q2_3_incentives: '',
      q2_4_collectedStreams: [
        { wasteType: 'B&C (Rigid profiles, windows)', pvcType: 'Rigid PVC', quantityTonnes: 0 },
        { wasteType: 'CABLES', pvcType: 'Flexible PVC', quantityTonnes: 0 }
      ],
      totalRigidCollected: 0,
      totalFlexibleCollected: 0,
      totalCollected: 0,
      q2_6_exports: [],
      q2_7_stakeholders: [],
      q2_8_costs: []
    },
    card3: {
      q3_1_generalRequirements: ['Enter national sorting & pretreatment authorization requirements...'],
      q3_2_pvcRequirements: '',
      q3_3_incentives: '',
      q3_7_technologies: [],
      q3_10_massBalance: [],
      totalSortedProcessed: 0,
      q3_11_stakeholders: '',
      q3_12_costs: []
    },
    card4: {
      q4_1_generalRequirements: ['Enter national recycling plant authorization & traceability rules...'],
      q4_2_pvcRequirements: '',
      q4_3_incentives: '',
      q4_4_technologiesSummary: [],
      q4_5_qualityAndPricingByStream: [],
      q4_6_recyclingByTech: [],
      totalRigidRecycled: 0,
      totalFlexibleRecycled: 0,
      totalMixedRecycled: 0,
      totalRecycledOutput: 0,
      q4_9_exportStatus: 'Domestic conversion',
      q4_10_exportNotes: [],
      q4_11_uptake: [],
      totalUptakeTonnes: 0,
      q4_12_stakeholders: '',
      q4_13_costs: []
    },
    card5: {
      q5_1_generalRequirements: '',
      q5_2_pvcRequirements: [],
      q5_3_disincentives: '',
      q5_4_technologyNotes: '',
      q5_5_incineratedStreams: [],
      totalIncineratedTonnes: 0,
      q5_6_facilitiesNote: '',
      q5_7_stakeholdersNote: '',
      q5_8_costsNote: '',
      q5_9_publicConcerns: ''
    },
    card6: {
      q6_1_generalRequirements: [],
      q6_2_pvcRequirements: '',
      q6_3_disincentives: '',
      q6_4_totalLandfilledEstimateTonnes: 0,
      q6_5_provincialQuantities: [],
      q6_7_stakeholdersNote: '',
      q6_8_costs: [],
      q6_9_publicConcerns: ''
    },
    card7: {
      q7_1_traceabilityTools: [],
      q7_2_chainOrganizationAndExport: '',
      q7_3_topObstacles: [],
      q7_4_voluntaryInitiatives: '',
      q7_5_generalImprovements: '',
      q7_6_keySourcesContacts: '',
      q7_7_outlook2030: ''
    },
    facilities: [],
    discrepancies: []
  };

  return {
    id: `acc-${Date.now()}`,
    contactName: params.contactName,
    email: params.email,
    organization: params.organization,
    roleType: params.roleType,
    countryCode: countryMeta.code,
    countryName: countryMeta.name,
    flag: countryMeta.flag,
    createdAt: now.toISOString().slice(0, 10),
    lastSavedAt: timestamp,
    cardCompletion: {
      card1: false,
      card2: false,
      card3: false,
      card4: false,
      card5: false,
      card6: false,
      card7: false
    },
    dataset: blankDataset
  };
}
