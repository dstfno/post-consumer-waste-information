import React, { useState } from 'react';
import { CountryPCWIDataset, DataBasis, ProviderAccount, PvcType } from '../types';
import { parseSubmissionFormXlsx, exportCountryToXlsx, ParsedXlsxSummary } from '../utils/xlsxEngine';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash,
  Save,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Clock
} from 'lucide-react';

interface Props {
  account: ProviderAccount;
  activeCard: number;
  setActiveCard: (card: number) => void;
  onUpdateAccountDataset: (
    updatedDataset: CountryPCWIDataset,
    completedCardNumber?: number
  ) => void;
  onOpenAccountModal: () => void;
  onGoToNationalSummary: () => void;
}

const QUESTION_CARD_TABS = [
  {
    id: 1,
    key: 'card1' as const,
    track: 'Track A',
    title: 'Card 1: Generation',
    questions: 'Q 1.1 – 1.2',
    questionList: [
      { id: '1.1', label: 'Q 1.1 • Main Sources of PVC Waste' },
      { id: '1.2', label: 'Q 1.2 • Waste Types & Quantities (t/a)' }
    ]
  },
  {
    id: 2,
    key: 'card2' as const,
    track: 'Track A',
    title: 'Card 2: Collection',
    questions: 'Q 2.1 – 2.8',
    questionList: [
      { id: '2.1', label: 'Q 2.1 • Plastic Collection EPR' },
      { id: '2.2', label: 'Q 2.2 • PVC Collection Rules' },
      { id: '2.3', label: 'Q 2.3 • Collection Incentives' },
      { id: '2.4', label: 'Q 2.4 • Collected Streams (t/a)' },
      { id: '2.5', label: 'Q 2.5 • Collector Facilities' },
      { id: '2.6', label: 'Q 2.6 • Domestic vs Export' },
      { id: '2.7', label: 'Q 2.7 • Stakeholders' },
      { id: '2.8', label: 'Q 2.8 • Collection Costs (€)' }
    ]
  },
  {
    id: 3,
    key: 'card3' as const,
    track: 'Track B.1',
    title: 'Card 3: Sorting & Pretreatment',
    questions: 'Q 3.1 – 3.12',
    questionList: [
      { id: '3.1', label: 'Q 3.1 • General Sorting Legal Rules' },
      { id: '3.2', label: 'Q 3.2 • PVC Sorting Requirements' },
      { id: '3.3', label: 'Q 3.3 • Sorting Incentives' },
      { id: '3.4', label: 'Q 3.4 • Sorting Techniques & Tech' },
      { id: '3.5', label: 'Q 3.5 • Quality, Impurities & Price' },
      { id: '3.6', label: 'Q 3.6 • Input Quantity Sorted (t/a)' },
      { id: '3.7', label: 'Q 3.7 • Output Quantity Sorted (t/a)' },
      { id: '3.8', label: 'Q 3.8 • Sorting Facilities' },
      { id: '3.9', label: 'Q 3.9 • Domestic vs Export & LoW' },
      { id: '3.10', label: 'Q 3.10 • Sorted Fate Mass-Balance' },
      { id: '3.11', label: 'Q 3.11 • Sorting Stakeholders' },
      { id: '3.12', label: 'Q 3.12 • Sorting Economic Costs (€)' }
    ]
  },
  {
    id: 4,
    key: 'card4' as const,
    track: 'Track A',
    title: 'Card 4: Recycling & Uptake',
    questions: 'Q 4.1 – 4.13',
    questionList: [
      { id: '4.1', label: 'Q 4.1 • General Recycling Rules' },
      { id: '4.2', label: 'Q 4.2 • PVC Recycling Rules' },
      { id: '4.3', label: 'Q 4.3 • Recycling Incentives' },
      { id: '4.4', label: 'Q 4.4 • Recycling Technologies' },
      { id: '4.5', label: 'Q 4.5 • Quality, Impurities & Price' },
      { id: '4.6', label: 'Q 4.6 • Input Recycled (t/a)' },
      { id: '4.7', label: 'Q 4.7 • rPVC Output Produced (t/a)' },
      { id: '4.8', label: 'Q 4.8 • Converting Facilities' },
      { id: '4.9', label: 'Q 4.9 • Domestic vs Export Converting' },
      { id: '4.10', label: 'Q 4.10 • Waste vs EoW / REACH Export' },
      { id: '4.11', label: 'Q 4.11 • Product Uptake & Fate (t/a)' },
      { id: '4.12', label: 'Q 4.12 • Recycling Stakeholders' },
      { id: '4.13', label: 'Q 4.13 • Recycling Costs (€)' }
    ]
  },
  {
    id: 5,
    key: 'card5' as const,
    track: 'Track A',
    title: 'Card 5: Incineration',
    questions: 'Q 5.1 – 5.9',
    questionList: [
      { id: '5.1', label: 'Q 5.1 • General Incineration Rules' },
      { id: '5.2', label: 'Q 5.2 • PVC Emission & Abatement' },
      { id: '5.3', label: 'Q 5.3 • Disincentives to Incinerate' },
      { id: '5.4', label: 'Q 5.4 • WTE Tech, Acid Gas & Ashes' },
      { id: '5.5', label: 'Q 5.5 • Quantity Incinerated (t/a)' },
      { id: '5.6', label: 'Q 5.6 • Incineration Facilities' },
      { id: '5.7', label: 'Q 5.7 • Incineration Stakeholders' },
      { id: '5.8', label: 'Q 5.8 • Incineration Costs (€)' },
      { id: '5.9', label: 'Q 5.9 • Media & Operational Concerns' }
    ]
  },
  {
    id: 6,
    key: 'card6' as const,
    track: 'Track A',
    title: 'Card 6: Landfilling',
    questions: 'Q 6.1 – 6.9',
    questionList: [
      { id: '6.1', label: 'Q 6.1 • General Landfill Rules' },
      { id: '6.2', label: 'Q 6.2 • PVC Calorific Rules (LHV)' },
      { id: '6.3', label: 'Q 6.3 • Landfill Disincentives' },
      { id: '6.4', label: 'Q 6.4 • Total PVC Landfilled (t/a)' },
      { id: '6.5', label: 'Q 6.5 • Where Landfilling Occurs' },
      { id: '6.6', label: 'Q 6.6 • Landfill Facilities & Size' },
      { id: '6.7', label: 'Q 6.7 • Landfill Stakeholders' },
      { id: '6.8', label: 'Q 6.8 • Landfill Costs (€)' },
      { id: '6.9', label: 'Q 6.9 • Media & Public Concerns' }
    ]
  },
  {
    id: 7,
    key: 'card7' as const,
    track: 'Track B.2',
    title: 'Card 7: Overall Chain & 2030',
    questions: 'Q 7.1 – 7.7',
    questionList: [
      { id: '7.1', label: 'Q 7.1 • Digital Traceability Tools' },
      { id: '7.2', label: 'Q 7.2 • Geographic Spread & Export' },
      { id: '7.3', label: 'Q 7.3 • Top 5 Recycling Obstacles' },
      { id: '7.4', label: 'Q 7.4 • Voluntary Initiatives' },
      { id: '7.5', label: 'Q 7.5 • General Chain Improvements' },
      { id: '7.6', label: 'Q 7.6 • Key Sources & Contacts' },
      { id: '7.7', label: 'Q 7.7 • 2030 Circularity Outlook' }
    ]
  }
];

const DEFAULT_Q1_1_CATALOGUE = [
  '1) Large urban waste (Ingombranti) collected in each town/city in designated areas by local waste managers',
  '2) Non-sorted urban waste (RSU) collected by municipalities (residual fraction excluding green, compostable, metal, or packaging)',
  '3) Plastic packaging collected separately by municipalities',
  '4) RAEE (WEEE — electrical and electronic equipment)',
  '5) Private waste collector and sorting companies',
  '6) ELV (End-of-Life Vehicle automotive waste collectors)',
  '7) Industrial waste collector in specific sectors (e.g. wood for furnitures, agricultural films, marketing/advertising companies)',
  '8) Building & Construction (B&C) demolition and renovation sites (windows, profiles, pipes, flooring, shutters)',
  '9) Medical & healthcare facilities (hospital PVC waste: IV bags, medical tubing, blister packs)',
  '10) Household DIY & municipal civic amenity / recycling centres'
];

const DEFAULT_Q2_1_CATALOGUE = [
  '1) CONAI (sub-consortia COREPLA / CORIPET / PARI) national EPR covering all plastic packaging including PVC',
  '2) RAEE (WEEE scheme) covering electrical & electronic waste where PVC appears in the cable fraction',
  '3) COBAT for batteries and accumulators (casings primarily PP/PE)',
  '4) Expired medicines take-back schemes (blisters, medical packaging)',
  '5) PFU and FVU schemes for end-of-life tires and vehicles (ELV)',
  '6) B&C (Construction & Demolition): Non-specific 70% recycling target under Directive 2008/98/EC (dedicated EPR under discussion)',
  '7) Mandatory municipal separate collection targets for household & commercial plastic waste',
  '8) National agricultural plastics collection & recovery scheme'
];

const DEFAULT_Q2_2_CATALOGUE = [
  '1) ACCORDO ANCI-CONAI: Municipal agreement covering collection and recycling of both rigid and flexible PVC packaging',
  '2) RAEE: Dedicated cable collection and separation within WEEE take-back streams (no exclusive scheme for other PVC items)',
  '3) Voluntary industry take-back scheme for rigid PVC windows, profiles, and pipes (e.g. WREP / Rewindo / VinylPlus)',
  '4) Voluntary take-back or collection scheme for flexible PVC flooring, roofing membranes, or coated fabrics',
  '5) Hospital / medical non-infectious PVC separate collection protocol (IV bags, medical tubing)',
  '6) No statutory distinction between rigid and flexible PVC collection requirements outside packaging & WEEE cables'
];

const DEFAULT_Q2_3_CATALOGUE = [
  '1) Packaging EPR (CONAI/COREPLA) producer fees cover the full chain from collection to granulate',
  '2) RAEE collects WEEE cables free of charge, though no separate financial bonus is earmarked for PVC',
  '3) No dedicated state financial subsidy earmarked specifically for other rigid or flexible PVC items',
  '4) Recovinyl / VinylPlus certified volume incentives and regional collection support (e.g. WREP pilot)',
  '5) High regional landfill / incineration gate fees acting as an economic driver for separate B&C PVC collection',
  '6) Green Public Procurement (GPP / CAM Edilizia) minimum recycled content rules pulling collected PVC volumes'
];

interface SubQuestionItem {
  marker?: string;
  badge?: string;
  text: string;
  children?: { marker?: string; badge?: string; text: string }[];
  subItems?: { marker?: string; badge?: string; text: string }[];
}

const MultiLevelQuestionTitle: React.FC<{
  main: string;
  subItems?: SubQuestionItem[];
  items?: SubQuestionItem[];
}> = ({ main, subItems, items }) => {
  const list = subItems ?? items ?? [];
  return (
    <div className="space-y-2 mt-1">
      <div className="text-sm font-extrabold text-slate-900 leading-snug">{main}</div>
      <div className="pl-3.5 border-l-2 border-recovinyl-blue/40 space-y-1.5">
        {list.map((sub, idx) => {
          const nested = sub.children ?? sub.subItems ?? [];
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-start gap-2 text-xs font-bold text-slate-800 leading-relaxed">
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-recovinyl-light border border-recovinyl-blue/30 text-recovinyl-dark font-mono text-[11px] font-extrabold shrink-0 mt-0.5">
                  {sub.marker ?? sub.badge}
                </span>
                <span>{sub.text}</span>
              </div>
              {nested.length > 0 && (
                <div className="pl-6 space-y-1 pt-0.5">
                  {nested.map((child, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-start gap-2 text-xs font-semibold text-slate-700 leading-relaxed"
                    >
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-recovinyl-greenLight border border-recovinyl-green/40 text-recovinyl-greenDark font-mono text-[10px] font-extrabold shrink-0">
                        {child.marker ?? child.badge}
                      </span>
                      <span>{child.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


interface MultiselectQuestionBlockProps {
  questionCode: string;
  questionTitle: React.ReactNode;
  accentColor?: 'blue' | 'amber' | 'purple' | 'emerald' | 'rose' | 'indigo';
  items: { id: string; text: string; selected: boolean }[];
  onChangeItems: (updated: { id: string; text: string; selected: boolean }[]) => void;
  addPlaceholder?: string;
}

const MultiselectQuestionBlock: React.FC<MultiselectQuestionBlockProps> = ({
  questionCode,
  questionTitle,
  items,
  onChangeItems,
  addPlaceholder = 'Add another item line (press Enter or click Add & Select Line)...'
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lastClickedIdx, setLastClickedIdx] = useState<number | null>(null);

  const selectedCount = items.filter((it) => it.selected).length;

  const toggleSelection = (idx: number, shiftKey: boolean) => {
    if (shiftKey && lastClickedIdx !== null && lastClickedIdx !== idx) {
      const start = Math.min(lastClickedIdx, idx);
      const end = Math.max(lastClickedIdx, idx);
      const targetState = !items[idx].selected;
      const updated = items.map((it, i) => (i >= start && i <= end ? { ...it, selected: targetState } : it));
      setLastClickedIdx(idx);
      onChangeItems(updated);
      return;
    }
    const updated = items.map((it, i) => (i === idx ? { ...it, selected: !it.selected } : it));
    setLastClickedIdx(idx);
    onChangeItems(updated);
  };

  const selectAll = (val: boolean) => {
    onChangeItems(items.map((it) => ({ ...it, selected: val })));
  };

  const updateText = (id: string, text: string) => {
    onChangeItems(items.map((it) => (it.id === id ? { ...it, text } : it)));
  };

  const addItem = () => {
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    const nextNum = items.length + 1;
    const formatted = /^\d+[\)\.]/.test(trimmed) ? trimmed : `${nextNum}) ${trimmed}`;
    onChangeItems([
      ...items,
      {
        id: `${questionCode}-custom-${Date.now()}`,
        text: formatted,
        selected: true
      }
    ]);
    setNewItemText('');
  };

  const deleteItem = (id: string) => {
    onChangeItems(items.filter((it) => it.id !== id));
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[280px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-recovinyl-blue text-white">
              {questionCode} • Multiselect Enabled
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-greenLight border border-recovinyl-green/40 text-recovinyl-greenDark text-[11px] font-extrabold">
              {selectedCount} of {items.length} item lines selected
            </span>
            <span className="text-[11px] text-slate-500">
              (Click any line to toggle • Shift+Click to select a range)
            </span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-2">{questionTitle}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => selectAll(true)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-recovinyl-light text-recovinyl-blue border border-recovinyl-blue/40 text-xs font-bold transition"
          >
            Select All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => selectAll(false)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Dynamic list of selectable item lines (adjusts height to exact number of items) */}
      <div className="space-y-1.5 h-auto">
        {items.map((item, idx) => {
          const isEditing = editingId === item.id;
          return (
            <div
              key={item.id}
              onClick={(e) => {
                if (!isEditing) {
                  toggleSelection(idx, e.shiftKey);
                }
              }}
              className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-xs transition-all select-none cursor-pointer ${
                item.selected
                  ? 'bg-recovinyl-light/75 border-recovinyl-blue text-slate-900 shadow-sm ring-1 ring-recovinyl-blue/25'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => {}}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(idx, e.shiftKey);
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-recovinyl-blue focus:ring-recovinyl-blue cursor-pointer shrink-0"
                />
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                    item.selected ? 'bg-recovinyl-blue text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </span>

                {isEditing ? (
                  <input
                    type="text"
                    value={item.text}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateText(item.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') {
                        setEditingId(null);
                      }
                    }}
                    onBlur={() => setEditingId(null)}
                    className="flex-1 px-2.5 py-1 rounded-lg border border-recovinyl-blue bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-recovinyl-blue"
                  />
                ) : (
                  <span
                    className={`flex-1 leading-snug ${
                      item.selected ? 'font-bold text-slate-900' : 'font-medium text-slate-600'
                    }`}
                  >
                    {item.text}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    item.selected
                      ? 'bg-recovinyl-greenLight border border-recovinyl-green/40 text-recovinyl-greenDark'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.selected ? 'Selected' : 'Not Selected'}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingId(isEditing ? null : item.id)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-500 hover:text-recovinyl-blue hover:bg-white border border-transparent hover:border-slate-200 transition"
                  title="Edit item line text"
                >
                  {isEditing ? 'Done' : 'Edit'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                  title="Remove item line"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add a custom item line */}
      <div className="pt-2 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={addPlaceholder}
          className="flex-1 min-w-[240px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-recovinyl-blue"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3.5 py-2 rounded-xl bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add & Select Line</span>
        </button>
      </div>
    </div>
  );
};

function buildSelectableItems(
  savedItems: { id: string; text: string; selected: boolean }[] | undefined,
  selectedLines: string[],
  defaultCatalogue: string[],
  prefixKey: string
): { id: string; text: string; selected: boolean }[] {
  if (savedItems && savedItems.length > 0) {
    return savedItems;
  }
  const cleanSelected = selectedLines.map((s) => s.trim()).filter(Boolean);
  const items: { id: string; text: string; selected: boolean }[] = cleanSelected.map((text, idx) => ({
    id: `${prefixKey}-sel-${idx}`,
    text,
    selected: true
  }));

  defaultCatalogue.forEach((catText, idx) => {
    const numPrefix = catText.slice(0, 3);
    const already = items.some(
      (it) =>
        it.text.toLowerCase() === catText.toLowerCase() ||
        it.text.startsWith(numPrefix) ||
        catText.toLowerCase().includes(it.text.slice(0, 22).toLowerCase())
    );
    if (!already) {
      items.push({
        id: `${prefixKey}-cat-${idx}`,
        text: catText,
        selected: false
      });
    }
  });

  return items;
}

export const QuestionCardsPortal: React.FC<Props> = ({
  account,
  activeCard,
  setActiveCard,
  onUpdateAccountDataset,
  onOpenAccountModal,
  onGoToNationalSummary
}) => {
  const dataset = account.dataset;
  const [importSummary, setImportSummary] = useState<ParsedXlsxSummary | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [q25Search, setQ25Search] = useState('');

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 4000);
  };

  const handleSaveCardToAccount = (cardNum: number) => {
    onUpdateAccountDataset(dataset, cardNum);
    showToast(
      `Saved Question Card ${cardNum} answers to ${account.contactName}'s account (${account.organization})! National Summary updated.`
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const summary = await parseSubmissionFormXlsx(file, dataset);
      setImportSummary(summary);
      onUpdateAccountDataset({
        ...dataset,
        ...summary.updatedDataset
      });
      showToast(`Imported "${file.name}" into ${account.contactName}'s account!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  };

  // ================= CARD 1 (Q 1.1 MULTISELECT & Q 1.2) HANDLERS =================
  const getQ1_1Items = () =>
    buildSelectableItems(
      dataset.card1.q1_1_availableItems,
      dataset.card1.q1_1_mainSources,
      DEFAULT_Q1_1_CATALOGUE,
      'q11'
    );

  const syncQ1_1Items = (updatedItems: { id: string; text: string; selected: boolean }[]) => {
    const selectedTexts = updatedItems.filter((it) => it.selected).map((it) => it.text);
    onUpdateAccountDataset({
      ...dataset,
      card1: {
        ...dataset.card1,
        q1_1_availableItems: updatedItems,
        q1_1_mainSources: selectedTexts
      }
    });
  };

  const updateQ1_2Row = (id: string, field: 'wasteType' | 'pvcType' | 'quantityTonnes' | 'basis' | 'notes', value: any) => {
    const updatedStreams = dataset.card1.q1_2_streams.map((s) =>
      s.id === id ? { ...s, [field]: field === 'quantityTonnes' ? Math.max(0, Number(value)) : value } : s
    );
    const totalRigidGenerated = updatedStreams
      .filter((s) => s.pvcType === 'Rigid PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    const totalFlexibleGenerated = updatedStreams
      .filter((s) => s.pvcType === 'Flexible PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    onUpdateAccountDataset({
      ...dataset,
      card1: {
        ...dataset.card1,
        q1_2_streams: updatedStreams,
        totalRigidGenerated,
        totalFlexibleGenerated,
        totalGenerated: totalRigidGenerated + totalFlexibleGenerated
      }
    });
  };

  const addQ1_2Row = () => {
    const updatedStreams = [
      ...dataset.card1.q1_2_streams,
      {
        id: `g-${Date.now()}`,
        wasteType: 'NEW WASTE STREAM',
        pvcType: 'Rigid PVC' as PvcType,
        quantityTonnes: 1000,
        basis: 'Survey / RRR Input' as DataBasis,
        notes: ''
      }
    ];
    const totalRigidGenerated = updatedStreams
      .filter((s) => s.pvcType === 'Rigid PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    const totalFlexibleGenerated = updatedStreams
      .filter((s) => s.pvcType === 'Flexible PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    onUpdateAccountDataset({
      ...dataset,
      card1: {
        ...dataset.card1,
        q1_2_streams: updatedStreams,
        totalRigidGenerated,
        totalFlexibleGenerated,
        totalGenerated: totalRigidGenerated + totalFlexibleGenerated
      }
    });
  };

  const deleteQ1_2Row = (id: string) => {
    const updatedStreams = dataset.card1.q1_2_streams.filter((s) => s.id !== id);
    const totalRigidGenerated = updatedStreams
      .filter((s) => s.pvcType === 'Rigid PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    const totalFlexibleGenerated = updatedStreams
      .filter((s) => s.pvcType === 'Flexible PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    onUpdateAccountDataset({
      ...dataset,
      card1: {
        ...dataset.card1,
        q1_2_streams: updatedStreams,
        totalRigidGenerated,
        totalFlexibleGenerated,
        totalGenerated: totalRigidGenerated + totalFlexibleGenerated
      }
    });
  };

  // ================= CARD 2 (Q 2.1 – Q 2.8) HANDLERS =================
  const getQ2_1Items = () =>
    buildSelectableItems(
      dataset.card2.q2_1_availableItems,
      dataset.card2.q2_1_plasticRequirements,
      DEFAULT_Q2_1_CATALOGUE,
      'q21'
    );

  const syncQ2_1Items = (updatedItems: { id: string; text: string; selected: boolean }[]) => {
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_1_availableItems: updatedItems,
        q2_1_plasticRequirements: updatedItems.filter((it) => it.selected).map((it) => it.text)
      }
    });
  };

  const getQ2_2Items = () =>
    buildSelectableItems(
      dataset.card2.q2_2_availableItems,
      dataset.card2.q2_2_pvcRequirements,
      DEFAULT_Q2_2_CATALOGUE,
      'q22'
    );

  const syncQ2_2Items = (updatedItems: { id: string; text: string; selected: boolean }[]) => {
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_2_availableItems: updatedItems,
        q2_2_pvcRequirements: updatedItems.filter((it) => it.selected).map((it) => it.text)
      }
    });
  };

  const getQ2_3Items = () => {
    const rawLines = dataset.card2.q2_3_incentives
      ? dataset.card2.q2_3_incentives
          .split(/\r?\n|(?=\d+\))/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    return buildSelectableItems(dataset.card2.q2_3_availableItems, rawLines, DEFAULT_Q2_3_CATALOGUE, 'q23');
  };

  const syncQ2_3Items = (updatedItems: { id: string; text: string; selected: boolean }[]) => {
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_3_availableItems: updatedItems,
        q2_3_incentives: updatedItems
          .filter((it) => it.selected)
          .map((it) => it.text)
          .join('\n')
      }
    });
  };

  const updateQ2_4Row = (idx: number, field: 'wasteType' | 'pvcType' | 'quantityTonnes', value: any) => {
    const updated = dataset.card2.q2_4_collectedStreams.map((s, i) =>
      i === idx ? { ...s, [field]: field === 'quantityTonnes' ? Math.max(0, Number(value)) : value } : s
    );
    const totalRigidCollected = updated
      .filter((s) => s.pvcType === 'Rigid PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    const totalFlexibleCollected = updated
      .filter((s) => s.pvcType === 'Flexible PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_4_collectedStreams: updated,
        totalRigidCollected,
        totalFlexibleCollected,
        totalCollected: totalRigidCollected + totalFlexibleCollected
      }
    });
  };

  const addQ2_4Row = () => {
    const updated = [
      ...dataset.card2.q2_4_collectedStreams,
      { wasteType: 'NEW COLLECTED STREAM', pvcType: 'Rigid PVC' as PvcType, quantityTonnes: 500 }
    ];
    const totalRigidCollected = updated
      .filter((s) => s.pvcType === 'Rigid PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    const totalFlexibleCollected = updated
      .filter((s) => s.pvcType === 'Flexible PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_4_collectedStreams: updated,
        totalRigidCollected,
        totalFlexibleCollected,
        totalCollected: totalRigidCollected + totalFlexibleCollected
      }
    });
  };

  const deleteQ2_4Row = (idx: number) => {
    const updated = dataset.card2.q2_4_collectedStreams.filter((_, i) => i !== idx);
    const totalRigidCollected = updated
      .filter((s) => s.pvcType === 'Rigid PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    const totalFlexibleCollected = updated
      .filter((s) => s.pvcType === 'Flexible PVC')
      .reduce((acc, s) => acc + s.quantityTonnes, 0);
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_4_collectedStreams: updated,
        totalRigidCollected,
        totalFlexibleCollected,
        totalCollected: totalRigidCollected + totalFlexibleCollected
      }
    });
  };

  // Q 2.5 Collector Facilities handlers
  const updateQ2_5Facility = (id: string, field: 'name' | 'pvcType' | 'city' | 'regionOrProvince' | 'sizeRaw', value: any) => {
    const updatedFacilities = dataset.facilities.map((f) =>
      f.id === id ? { ...f, [field]: value } : f
    );
    onUpdateAccountDataset({
      ...dataset,
      facilities: updatedFacilities
    });
  };

  const addQ2_5Facility = () => {
    const newFacility = {
      id: `c-${Date.now()}`,
      stage: 'Collection' as const,
      questionRef: '2.5' as const,
      name: 'NEW COLLECTION ENTITY',
      pvcType: 'Both' as PvcType,
      city: 'City (Province)',
      regionOrProvince: 'Region',
      lat: 43.77,
      lng: 11.25,
      sizeRaw: '25 empl - 5,0M€',
      employees: 25,
      turnoverEurMillions: 5.0
    };
    onUpdateAccountDataset({
      ...dataset,
      facilities: [newFacility, ...dataset.facilities]
    });
  };

  const deleteQ2_5Facility = (id: string) => {
    onUpdateAccountDataset({
      ...dataset,
      facilities: dataset.facilities.filter((f) => f.id !== id)
    });
  };

  // Q 2.6 Domestic vs Export Processing handlers
  const updateQ2_6Row = (
    id: string,
    field: 'wasteType' | 'processedLocation' | 'destinationCountries' | 'wasteCodes' | 'pvcType' | 'totalQuantityTonnes',
    value: any
  ) => {
    const updated = dataset.card2.q2_6_exports.map((ex) =>
      ex.id === id
        ? {
            ...ex,
            [field]:
              field === 'totalQuantityTonnes'
                ? value === '' || value === null
                  ? null
                  : Math.max(0, Number(value))
                : value
          }
        : ex
    );
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_6_exports: updated
      }
    });
  };

  const addQ2_6Row = () => {
    const updated = [
      ...dataset.card2.q2_6_exports,
      {
        id: `ex26-${Date.now()}`,
        questionRef: '2.6' as const,
        wasteType: 'NEW WASTE STREAM',
        processedLocation: 'Processed in the country' as const,
        destinationCountries: 'Domestic',
        wasteCodes: '17 02 03',
        pvcType: 'Rigid PVC' as PvcType,
        totalQuantityTonnes: 0
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_6_exports: updated
      }
    });
  };

  const deleteQ2_6Row = (id: string) => {
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_6_exports: dataset.card2.q2_6_exports.filter((ex) => ex.id !== id)
      }
    });
  };

  // Q 2.7 Stakeholders handlers
  const updateQ2_7Row = (
    id: string,
    field: 'name' | 'affiliation' | 'website' | 'city' | 'contact',
    value: string
  ) => {
    const updated = dataset.card2.q2_7_stakeholders.map((st) =>
      st.id === id ? { ...st, [field]: value } : st
    );
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_7_stakeholders: updated
      }
    });
  };

  const addQ2_7Row = () => {
    const updated = [
      ...dataset.card2.q2_7_stakeholders,
      {
        id: `st27-${Date.now()}`,
        questionRef: '2.7',
        name: 'New Collection Stakeholder',
        affiliation: 'Industry Consortium / Association',
        website: 'https://',
        city: 'City',
        contact: 'contact@organization.eu'
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_7_stakeholders: updated
      }
    });
  };

  const deleteQ2_7Row = (id: string) => {
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_7_stakeholders: dataset.card2.q2_7_stakeholders.filter((st) => st.id !== id)
      }
    });
  };

  // Q 2.8 Economic Costs handlers
  const updateQ2_8Row = (
    id: string,
    field: 'costType' | 'pvcType' | 'costDisplay' | 'remarks',
    value: any
  ) => {
    const updated = dataset.card2.q2_8_costs.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_8_costs: updated
      }
    });
  };

  const addQ2_8Row = () => {
    const updated = [
      ...dataset.card2.q2_8_costs,
      {
        id: `cost28-${Date.now()}`,
        stage: 'Collection' as const,
        questionRef: '2.8' as const,
        costType: 'NEW COLLECTION OPERATION',
        pvcType: 'Rigid PVC' as PvcType,
        costDisplay: '45 €/ton',
        minEurPerTon: 45,
        maxEurPerTon: 45,
        remarks: ''
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_8_costs: updated
      }
    });
  };

  const deleteQ2_8Row = (id: string) => {
    onUpdateAccountDataset({
      ...dataset,
      card2: {
        ...dataset.card2,
        q2_8_costs: dataset.card2.q2_8_costs.filter((c) => c.id !== id)
      }
    });
  };

  // ================= GENERIC MULTISELECT REGISTRY FOR CARDS 3 – 7 =================
  const getRegistryItems = (
    questionKey: string,
    rawExisting: string | string[],
    defaultCatalogue: string[]
  ): { id: string; text: string; selected: boolean }[] => {
    const registryKey = `v3_${questionKey}`;
    const saved = dataset.multiselectRegistry?.[registryKey];
    if (saved && saved.length > 0) {
      return saved;
    }
    const existingLines = Array.isArray(rawExisting)
      ? rawExisting.map((s) => s.trim()).filter(Boolean)
      : rawExisting
      ? rawExisting.split(/\r?\n|(?=\d+\))/).map((s) => s.trim()).filter(Boolean)
      : [];
    const sourceLines = existingLines.length > 0 ? existingLines : defaultCatalogue;
    return sourceLines.map((text, idx) => ({
      id: `${questionKey}-${idx + 1}`,
      text,
      selected: true
    }));
  };

  const syncRegistryItems = (
    questionKey: string,
    updatedItems: { id: string; text: string; selected: boolean }[],
    applySelectedToDataset: (selectedLines: string[], base: CountryPCWIDataset) => CountryPCWIDataset
  ) => {
    const registryKey = `v3_${questionKey}`;
    const selectedLines = updatedItems.filter((it) => it.selected).map((it) => it.text);
    const nextDataset = applySelectedToDataset(selectedLines, {
      ...dataset,
      multiselectRegistry: {
        ...(dataset.multiselectRegistry || {}),
        [registryKey]: updatedItems
      }
    });
    onUpdateAccountDataset(nextDataset);
  };

  // ================= CARD 3 HANDLERS (Q 3.4 – 3.12) =================
  const updateQ3_7TechRow = (
    id: string,
    field:
      | 'wasteType'
      | 'pvcType'
      | 'technologyCategory'
      | 'automationOrSubTech'
      | 'description'
      | 'inputOrOutputTonnes'
      | 'typicalQuality'
      | 'mainImpurities'
      | 'priceEurPerTon',
    value: any
  ) => {
    const updated = dataset.card3.q3_7_technologies.map((t) =>
      t.id === id
        ? {
            ...t,
            [field]:
              field === 'inputOrOutputTonnes'
                ? value === '' || value === null
                  ? null
                  : Math.max(0, Number(value))
                : value
          }
        : t
    );
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_7_technologies: updated
      }
    });
  };

  const addQ3_7TechRow = () => {
    const updated = [
      ...dataset.card3.q3_7_technologies,
      {
        id: `t3-${Date.now()}`,
        stage: 'Sorting & Pretreatment' as const,
        questionRef: '3.7' as const,
        wasteType: 'NEW SORTED PVC STREAM',
        pvcType: 'Rigid PVC' as PvcType,
        technologyCategory: 'OPTICAL / NIR',
        automationOrSubTech: 'Fully automated',
        description: 'Automated optical polymer sorting',
        inputOrOutputTonnes: 1500,
        outputForm: 'Sorted flake / fraction',
        typicalQuality: '< 2% impurity',
        mainImpurities: 'Other plastics / rubber',
        priceEurPerTon: '40-60 €/ton'
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_7_technologies: updated
      }
    });
  };

  const deleteQ3_7TechRow = (id: string) => {
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_7_technologies: dataset.card3.q3_7_technologies.filter((t) => t.id !== id)
      }
    });
  };

  const addQ3_8Facility = () => {
    const newFac = {
      id: `s-${Date.now()}`,
      stage: 'Sorting & Pretreatment' as const,
      questionRef: '3.8' as const,
      name: 'NEW SORTING & PRETREATMENT FACILITY',
      pvcType: 'Rigid PVC' as PvcType,
      city: 'City',
      regionOrProvince: 'Region',
      lat: 44.49,
      lng: 11.34,
      sizeRaw: '120 empl - € 25.000.000',
      employees: 120,
      turnoverEurMillions: 25.0
    };
    onUpdateAccountDataset({
      ...dataset,
      facilities: [newFac, ...dataset.facilities]
    });
  };

  const updateQ3_10Row = (
    id: string,
    field:
      | 'wasteType'
      | 'processedLocation'
      | 'destinationCountries'
      | 'wasteCodes'
      | 'pvcType'
      | 'totalQuantityTonnes'
      | 'recyclingTonnes'
      | 'incinerationTonnes'
      | 'landfillingTonnes'
      | 'notes',
    value: any
  ) => {
    const numericFields = ['totalQuantityTonnes', 'recyclingTonnes', 'incinerationTonnes', 'landfillingTonnes'];
    const updated = dataset.card3.q3_10_massBalance.map((m) =>
      m.id === id
        ? {
            ...m,
            [field]: numericFields.includes(field) ? Math.max(0, Number(value)) : value
          }
        : m
    );
    const totalSortedProcessed = updated.reduce((acc, r) => acc + (r.totalQuantityTonnes ?? 0), 0);
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_10_massBalance: updated,
        totalSortedProcessed
      }
    });
  };

  const addQ3_10Row = () => {
    const updated = [
      ...dataset.card3.q3_10_massBalance,
      {
        id: `m310-${Date.now()}`,
        questionRef: '3.10' as const,
        wasteType: 'NEW SORTED STREAM',
        processedLocation: 'Processed in the country' as const,
        destinationCountries: 'Domestic',
        wasteCodes: '19 12 04',
        pvcType: 'Rigid PVC' as PvcType,
        totalQuantityTonnes: 1000,
        recyclingTonnes: 800,
        incinerationTonnes: 0,
        landfillingTonnes: 200,
        notes: 'Balanced'
      }
    ];
    const totalSortedProcessed = updated.reduce((acc, r) => acc + (r.totalQuantityTonnes ?? 0), 0);
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_10_massBalance: updated,
        totalSortedProcessed
      }
    });
  };

  const deleteQ3_10Row = (id: string) => {
    const updated = dataset.card3.q3_10_massBalance.filter((m) => m.id !== id);
    const totalSortedProcessed = updated.reduce((acc, r) => acc + (r.totalQuantityTonnes ?? 0), 0);
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_10_massBalance: updated,
        totalSortedProcessed
      }
    });
  };

  const getQ3_11Stakeholders = (): { id: string; questionRef: string; name: string; affiliation: string; website: string; city: string; contact: string }[] => {
    if (dataset.card3.q3_11_stakeholdersList && dataset.card3.q3_11_stakeholdersList.length > 0) {
      return dataset.card3.q3_11_stakeholdersList;
    }
    return [
      {
        id: 'st311-1',
        questionRef: '3.11',
        name: dataset.card3.q3_11_stakeholders || 'No stakeholders involved',
        affiliation: '',
        website: '',
        city: '',
        contact: ''
      }
    ];
  };

  const syncQ3_11Stakeholders = (list: { id: string; questionRef: string; name: string; affiliation: string; website: string; city: string; contact: string }[]) => {
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_11_stakeholdersList: list,
        q3_11_stakeholders: list.map((s) => `${s.name} (${s.affiliation})`).join('; ')
      }
    });
  };

  const updateQ3_12Row = (id: string, field: 'costType' | 'pvcType' | 'costDisplay' | 'remarks', value: any) => {
    const updated = dataset.card3.q3_12_costs.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_12_costs: updated
      }
    });
  };

  const addQ3_12Row = () => {
    const updated = [
      ...dataset.card3.q3_12_costs,
      {
        id: `cost312-${Date.now()}`,
        stage: 'Sorting & Pretreatment' as const,
        questionRef: '3.12' as const,
        costType: 'NEW SORTING / PRETREATMENT COST',
        pvcType: 'Rigid PVC' as PvcType,
        costDisplay: '40 €/ton',
        minEurPerTon: 40,
        maxEurPerTon: 40,
        remarks: ''
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_12_costs: updated
      }
    });
  };

  const deleteQ3_12Row = (id: string) => {
    onUpdateAccountDataset({
      ...dataset,
      card3: {
        ...dataset.card3,
        q3_12_costs: dataset.card3.q3_12_costs.filter((c) => c.id !== id)
      }
    });
  };

  // ================= CARD 4 HANDLERS (Q 4.6 – 4.13) =================

  const updateQ4_6Row = (
    id: string,
    field:
      | 'wasteType'
      | 'pvcType'
      | 'technologyCategory'
      | 'automationOrSubTech'
      | 'inputOrOutputTonnes'
      | 'outputForm'
      | 'typicalQuality'
      | 'mainImpurities'
      | 'priceEurPerTon',
    value: any
  ) => {
    const updated = dataset.card4.q4_6_recyclingByTech.map((r) =>
      r.id === id
        ? {
            ...r,
            [field]: field === 'inputOrOutputTonnes' ? Math.max(0, Number(value)) : value
          }
        : r
    );
    const totalRecycledOutput = updated.reduce((acc, item) => acc + (item.inputOrOutputTonnes ?? 0), 0);
    onUpdateAccountDataset({
      ...dataset,
      card4: {
        ...dataset.card4,
        q4_6_recyclingByTech: updated,
        totalRecycledOutput
      }
    });
  };

  const addQ4_6Row = () => {
    const updated = [
      ...dataset.card4.q4_6_recyclingByTech,
      {
        id: `rec46-${Date.now()}`,
        stage: 'Recycling' as const,
        questionRef: '4.6' as const,
        wasteType: 'NEW RECYCLED PVC STREAM',
        pvcType: 'Rigid PVC' as PvcType,
        technologyCategory: 'Mechanical recycling',
        automationOrSubTech: 'EXTRUSION / FILTRATION',
        description: 'Mechanical recycling',
        inputOrOutputTonnes: 500,
        outputForm: 'Granule',
        typicalQuality: '< 1% impurities',
        mainImpurities: 'Other plastics',
        priceEurPerTon: '250 €/ton'
      }
    ];
    const totalRecycledOutput = updated.reduce((acc, item) => acc + (item.inputOrOutputTonnes ?? 0), 0);
    onUpdateAccountDataset({
      ...dataset,
      card4: {
        ...dataset.card4,
        q4_6_recyclingByTech: updated,
        totalRecycledOutput
      }
    });
  };

  const deleteQ4_6Row = (id: string) => {
    const updated = dataset.card4.q4_6_recyclingByTech.filter((r) => r.id !== id);
    const totalRecycledOutput = updated.reduce((acc, item) => acc + (item.inputOrOutputTonnes ?? 0), 0);
    onUpdateAccountDataset({
      ...dataset,
      card4: {
        ...dataset.card4,
        q4_6_recyclingByTech: updated,
        totalRecycledOutput
      }
    });
  };

  const addQ4_8Facility = () => {
    const newFac = {
      id: `r-${Date.now()}`,
      stage: 'Converting (rPVC)' as const,
      questionRef: '4.8' as const,
      name: 'NEW rPVC CONVERTER FACILITY',
      pvcType: 'Flexible PVC' as PvcType,
      city: 'City (Province)',
      regionOrProvince: 'Region',
      lat: 45.46,
      lng: 9.19,
      sizeRaw: '15 empl - 3,50M€',
      employees: 15,
      turnoverEurMillions: 3.5
    };
    onUpdateAccountDataset({
      ...dataset,
      facilities: [newFac, ...dataset.facilities]
    });
  };

  const updateQ4_11Row = (
    id: string,
    field: 'wasteType' | 'location' | 'pvcType' | 'totalQuantityTonnes' | 'unconvertedReasonOrFate' | 'productsText',
    value: any
  ) => {
    const updated = dataset.card4.q4_11_uptake.map((u) => {
      if (u.id !== id) return u;
      if (field === 'productsText') {
        const parsedProducts = String(value)
          .split(';')
          .map((part) => part.trim())
          .filter(Boolean)
          .map((part) => {
            const [prod, qty] = part.split(':').map((s) => s.trim());
            const num = Number(qty?.replace(/[^\d.]/g, ''));
            return {
              product: prod || 'Application',
              tonnes: !isNaN(num) && qty ? num : qty || 0
            };
          });
        return { ...u, products: parsedProducts };
      }
      return {
        ...u,
        [field]: field === 'totalQuantityTonnes' ? Math.max(0, Number(value)) : value
      };
    });
    const totalUptakeTonnes = updated.reduce((acc, item) => acc + item.totalQuantityTonnes, 0);
    onUpdateAccountDataset({
      ...dataset,
      card4: {
        ...dataset.card4,
        q4_11_uptake: updated,
        totalUptakeTonnes
      }
    });
  };

  const addQ4_11Row = () => {
    const updated = [
      ...dataset.card4.q4_11_uptake,
      {
        id: `up411-${Date.now()}`,
        wasteType: 'NEW CONVERTED STREAM',
        location: 'Uptake/Conversion in the country',
        pvcType: 'Rigid PVC' as PvcType,
        totalQuantityTonnes: 1000,
        products: [{ product: 'Profiles / Pipes', tonnes: 1000 }],
        unconvertedReasonOrFate: 'All converted domestically'
      }
    ];
    const totalUptakeTonnes = updated.reduce((acc, item) => acc + item.totalQuantityTonnes, 0);
    onUpdateAccountDataset({
      ...dataset,
      card4: {
        ...dataset.card4,
        q4_11_uptake: updated,
        totalUptakeTonnes
      }
    });
  };

  const deleteQ4_11Row = (id: string) => {
    const updated = dataset.card4.q4_11_uptake.filter((u) => u.id !== id);
    const totalUptakeTonnes = updated.reduce((acc, item) => acc + item.totalQuantityTonnes, 0);
    onUpdateAccountDataset({
      ...dataset,
      card4: {
        ...dataset.card4,
        q4_11_uptake: updated,
        totalUptakeTonnes
      }
    });
  };

  const getQ4_12Stakeholders = (): { id: string; questionRef: string; name: string; affiliation: string; website: string; city: string; contact: string }[] => {
    if (dataset.card4.q4_12_stakeholdersList && dataset.card4.q4_12_stakeholdersList.length > 0) {
      return dataset.card4.q4_12_stakeholdersList;
    }
    return [
      {
        id: 'st412-1',
        questionRef: '4.12',
        name: dataset.card4.q4_12_stakeholders || 'No stakeholders involved',
        affiliation: '',
        website: '',
        city: '',
        contact: ''
      }
    ];
  };

  const syncQ4_12Stakeholders = (list: { id: string; questionRef: string; name: string; affiliation: string; website: string; city: string; contact: string }[]) => {
    onUpdateAccountDataset({
      ...dataset,
      card4: {
        ...dataset.card4,
        q4_12_stakeholdersList: list,
        q4_12_stakeholders: list.map((s) => `${s.name} (${s.affiliation})`).join('; ')
      }
    });
  };

  const updateQ4_13Row = (id: string, field: 'costType' | 'pvcType' | 'costDisplay' | 'remarks', value: any) => {
    const updated = dataset.card4.q4_13_costs.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    onUpdateAccountDataset({
      ...dataset,
      card4: { ...dataset.card4, q4_13_costs: updated }
    });
  };

  const addQ4_13Row = () => {
    const updated = [
      ...dataset.card4.q4_13_costs,
      {
        id: `cost413-${Date.now()}`,
        stage: 'Recycling' as const,
        questionRef: '4.13' as const,
        costType: 'NEW RECYCLING PROCESS COST',
        pvcType: 'Both' as PvcType,
        costDisplay: '120 €/ton',
        minEurPerTon: 120,
        maxEurPerTon: 120,
        remarks: ''
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card4: { ...dataset.card4, q4_13_costs: updated }
    });
  };

  const deleteQ4_13Row = (id: string) => {
    onUpdateAccountDataset({
      ...dataset,
      card4: {
        ...dataset.card4,
        q4_13_costs: dataset.card4.q4_13_costs.filter((c) => c.id !== id)
      }
    });
  };

  // ================= CARD 5 HANDLERS (Q 5.5 – 5.8) =================
  const updateQ5_5Row = (
    id: string,
    field: 'wasteType' | 'pvcType' | 'technologyCategory' | 'description' | 'inputOrOutputTonnes' | 'outputForm' | 'typicalQuality',
    value: any
  ) => {
    const updated = dataset.card5.q5_5_incineratedStreams.map((s) =>
      s.id === id
        ? {
            ...s,
            [field]: field === 'inputOrOutputTonnes' ? Math.max(0, Number(value)) : value
          }
        : s
    );
    const totalIncineratedTonnes = updated.reduce((acc, s) => acc + (s.inputOrOutputTonnes ?? 0), 0);
    onUpdateAccountDataset({
      ...dataset,
      card5: {
        ...dataset.card5,
        q5_5_incineratedStreams: updated,
        totalIncineratedTonnes
      }
    });
  };

  const addQ5_5Row = () => {
    const updated = [
      ...dataset.card5.q5_5_incineratedStreams,
      {
        id: `inc55-${Date.now()}`,
        stage: 'Incineration' as const,
        questionRef: '5.5' as const,
        wasteType: 'NEW INCINERATED PVC STREAM',
        pvcType: 'Both' as PvcType,
        technologyCategory: 'water heating / energy recovery',
        automationOrSubTech: 'WTE R1',
        description: 'NaHCO3, activated charcoal powder, NaOH (soda)',
        inputOrOutputTonnes: 500,
        outputForm: 'ash',
        typicalQuality: 'special landfill or recovery if SolvAir',
        mainImpurities: 'Flue gas salts',
        priceEurPerTon: 'N/A'
      }
    ];
    const totalIncineratedTonnes = updated.reduce((acc, s) => acc + (s.inputOrOutputTonnes ?? 0), 0);
    onUpdateAccountDataset({
      ...dataset,
      card5: {
        ...dataset.card5,
        q5_5_incineratedStreams: updated,
        totalIncineratedTonnes
      }
    });
  };

  const deleteQ5_5Row = (id: string) => {
    const updated = dataset.card5.q5_5_incineratedStreams.filter((s) => s.id !== id);
    const totalIncineratedTonnes = updated.reduce((acc, s) => acc + (s.inputOrOutputTonnes ?? 0), 0);
    onUpdateAccountDataset({
      ...dataset,
      card5: {
        ...dataset.card5,
        q5_5_incineratedStreams: updated,
        totalIncineratedTonnes
      }
    });
  };

  // ================= CARD 6 HANDLERS (Q 6.5 – 6.8) =================
  const updateQ6_5Row = (
    id: string,
    field: 'wasteType' | 'pvcType' | 'quantityTonnes' | 'provinceOrCity' | 'remarks',
    value: any
  ) => {
    const updated = dataset.card6.q6_5_provincialQuantities.map((p) =>
      p.id === id ? { ...p, [field]: field === 'quantityTonnes' ? Math.max(0, Number(value)) : value } : p
    );
    onUpdateAccountDataset({
      ...dataset,
      card6: {
        ...dataset.card6,
        q6_5_provincialQuantities: updated
      }
    });
  };

  const addQ6_5Row = () => {
    const updated = [
      ...dataset.card6.q6_5_provincialQuantities,
      {
        id: `lf65-${Date.now()}`,
        wasteType: 'MIXED',
        pvcType: 'Both' as PvcType,
        provinceOrCity: 'NEW PROVINCE / SITE',
        quantityTonnes: 1000,
        lat: 43.0,
        lng: 12.0,
        remarks: 'Estimated regional landfill share'
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card6: {
        ...dataset.card6,
        q6_5_provincialQuantities: updated
      }
    });
  };

  const deleteQ6_5Row = (id: string) => {
    onUpdateAccountDataset({
      ...dataset,
      card6: {
        ...dataset.card6,
        q6_5_provincialQuantities: dataset.card6.q6_5_provincialQuantities.filter((p) => p.id !== id)
      }
    });
  };

  const addQ6_6Facility = () => {
    const newFac = {
      id: `l-${Date.now()}`,
      stage: 'Landfill Operator' as const,
      questionRef: '6.6' as const,
      name: 'NEW LANDFILL OPERATOR',
      pvcType: 'Both' as PvcType,
      city: 'City (Province)',
      regionOrProvince: 'Region',
      lat: 44.5,
      lng: 11.0,
      sizeRaw: '45 empl - 12,0M€',
      employees: 45,
      turnoverEurMillions: 12.0
    };
    onUpdateAccountDataset({
      ...dataset,
      facilities: [newFac, ...dataset.facilities]
    });
  };

  const updateQ6_8Row = (id: string, field: 'costType' | 'pvcType' | 'costDisplay' | 'remarks', value: any) => {
    const updated = dataset.card6.q6_8_costs.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    onUpdateAccountDataset({
      ...dataset,
      card6: {
        ...dataset.card6,
        q6_8_costs: updated
      }
    });
  };

  const addQ6_8Row = () => {
    const updated = [
      ...dataset.card6.q6_8_costs,
      {
        id: `cost68-${Date.now()}`,
        stage: 'Landfilling' as const,
        questionRef: '6.8' as const,
        costType: 'NEW LANDFILL FEE / TAX',
        pvcType: 'Both' as PvcType,
        costDisplay: '110 €/t',
        minEurPerTon: 110,
        maxEurPerTon: 110,
        remarks: 'Regional landfill operator charge'
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card6: {
        ...dataset.card6,
        q6_8_costs: updated
      }
    });
  };

  const deleteQ6_8Row = (id: string) => {
    onUpdateAccountDataset({
      ...dataset,
      card6: {
        ...dataset.card6,
        q6_8_costs: dataset.card6.q6_8_costs.filter((c) => c.id !== id)
      }
    });
  };

  // ================= CARD 7 HANDLERS (Q 7.1, Q 7.3) =================
  const updateQ7_1Tool = (
    idx: number,
    field: 'name' | 'legislation' | 'entityInCharge' | 'mainPurpose' | 'relevantFeatures' | 'website',
    value: string
  ) => {
    const updated = dataset.card7.q7_1_traceabilityTools.map((t, i) =>
      i === idx ? { ...t, [field]: value } : t
    );
    onUpdateAccountDataset({
      ...dataset,
      card7: {
        ...dataset.card7,
        q7_1_traceabilityTools: updated
      }
    });
  };

  const addQ7_1Tool = () => {
    const updated = [
      ...dataset.card7.q7_1_traceabilityTools,
      {
        name: 'NEW TRACEABILITY SYSTEM',
        legislation: 'National Waste Decree',
        entityInCharge: 'Ministry of Environment',
        mainPurpose: 'Digital waste tracking from producer to recovery',
        relevantFeatures: 'Electronic consignment notes & annual reporting',
        website: 'https://'
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card7: {
        ...dataset.card7,
        q7_1_traceabilityTools: updated
      }
    });
  };

  const deleteQ7_1Tool = (idx: number) => {
    onUpdateAccountDataset({
      ...dataset,
      card7: {
        ...dataset.card7,
        q7_1_traceabilityTools: dataset.card7.q7_1_traceabilityTools.filter((_, i) => i !== idx)
      }
    });
  };

  const updateQ7_3Obstacle = (
    idx: number,
    field: 'rank' | 'obstacle' | 'pvcTypeAffected' | 'mitigation',
    value: any
  ) => {
    const updated = dataset.card7.q7_3_topObstacles.map((o, i) =>
      i === idx ? { ...o, [field]: field === 'rank' ? Number(value) : value } : o
    );
    onUpdateAccountDataset({
      ...dataset,
      card7: {
        ...dataset.card7,
        q7_3_topObstacles: updated
      }
    });
  };

  const addQ7_3Obstacle = () => {
    const nextRank = dataset.card7.q7_3_topObstacles.length + 1;
    const updated = [
      ...dataset.card7.q7_3_topObstacles,
      {
        rank: nextRank,
        obstacle: 'New recycling obstacle',
        pvcTypeAffected: 'Both' as PvcType,
        mitigation: 'Proposed regulatory, technical, or financial remediation'
      }
    ];
    onUpdateAccountDataset({
      ...dataset,
      card7: {
        ...dataset.card7,
        q7_3_topObstacles: updated
      }
    });
  };

  const deleteQ7_3Obstacle = (idx: number) => {
    const updated = dataset.card7.q7_3_topObstacles
      .filter((_, i) => i !== idx)
      .map((o, idx2) => ({ ...o, rank: idx2 + 1 }));
    onUpdateAccountDataset({
      ...dataset,
      card7: {
        ...dataset.card7,
        q7_3_topObstacles: updated
      }
    });
  };

  const completedCount = Object.values(account.cardCompletion).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Provider Account Banner & Questionnaire Header */}
      <div className="bg-white rounded-2xl border-2 border-recovinyl-blue/30 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-recovinyl-light border border-recovinyl-blue/30 flex items-center justify-center text-2xl shrink-0">
              {account.flag}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-blue text-white text-[11px] font-extrabold uppercase">
                  Fold 1 • Provider Questionnaire Account
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-greenLight border border-recovinyl-green/40 text-recovinyl-greenDark text-[11px] font-bold">
                  {completedCount} of 7 Question Cards Saved
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Last saved: <b>{account.lastSavedAt}</b>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                {account.contactName} — <span className="text-recovinyl-blue">{account.organization}</span> ({account.countryName})
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Account Email: <b>{account.email}</b> • Role: <b>{account.roleType}</b> — Answer the 7 Question Cards below; all data is stored in your account and drives the National Summary Report.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAccountModal}
              className="px-3.5 py-2 rounded-xl bg-recovinyl-dark hover:bg-recovinyl-blue text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <UserCheck className="w-4 h-4 text-recovinyl-green" />
              <span>Switch / New Provider Account</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition">
              <Upload className="w-4 h-4" />
              <span>Import into Account</span>
              <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={onGoToNationalSummary}
              className="px-3.5 py-2 rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
            >
              <span>View National Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {savedToast && (
          <div className="mt-4 p-3 rounded-xl bg-recovinyl-greenLight border border-recovinyl-green text-recovinyl-greenDark text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-recovinyl-greenDark shrink-0" />
            <span>{savedToast}</span>
          </div>
        )}
      </div>

      {/* 7 Question Cards Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {QUESTION_CARD_TABS.map((tab) => {
          const isActive = activeCard === tab.id;
          const isCompleted = account.cardCompletion[tab.key];
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCard(tab.id);
                setSelectedQuestionIds([]);
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-recovinyl-blue text-white border-recovinyl-dark shadow-md ring-2 ring-recovinyl-green/60'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-recovinyl-light/50 hover:border-recovinyl-blue/40'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {tab.track} • {tab.questionList.length} {tab.questionList.length === 1 ? 'Question' : 'Questions'}
                </span>
                {isCompleted && (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-recovinyl-green' : 'text-recovinyl-greenDark'
                    }`}
                  />
                )}
              </div>
              <div className="text-xs font-extrabold mt-1 leading-snug">{tab.title}</div>
              <div className="text-[10px] opacity-75 mt-0.5">{tab.questions}</div>
            </button>
          );
        })}
      </div>

      {/* Active Question Card Interactive Questionnaire (Dynamic Window Height) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-auto transition-all">
        {/* Dynamic Available Questions Bar for Active Card */}
        {(() => {
          const currentTab = QUESTION_CARD_TABS.find((t) => t.id === activeCard);
          if (!currentTab) return null;
          const isShowingAll =
            selectedQuestionIds.length === 0 ||
            selectedQuestionIds.length === currentTab.questionList.length;

          const toggleQuestionFilter = (qId: string) => {
            setSelectedQuestionIds((prev) => {
              if (prev.includes(qId)) {
                return prev.filter((id) => id !== qId);
              }
              return [...prev, qId];
            });
          };

          return (
            <div className="mb-5 p-3 rounded-xl bg-recovinyl-light/40 border border-recovinyl-blue/25 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-recovinyl-dark mr-1">
                  {currentTab.questionList.length} Available Questions in {currentTab.title.split(':')[0]}:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedQuestionIds([])}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    isShowingAll
                      ? 'bg-recovinyl-blue text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-recovinyl-light'
                  }`}
                >
                  Show All ({currentTab.questionList.length})
                </button>
                {currentTab.questionList.map((q) => {
                  const isQSelected = !isShowingAll && selectedQuestionIds.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => toggleQuestionFilter(q.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        isQSelected
                          ? 'bg-recovinyl-dark text-white shadow-sm ring-2 ring-recovinyl-green'
                          : isShowingAll
                          ? 'bg-recovinyl-light text-recovinyl-dark border border-recovinyl-blue/30 hover:bg-recovinyl-blue/15'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-recovinyl-light/60'
                      }`}
                      title="Click to select/multiselect which question windows are displayed"
                    >
                      <span>{q.label}</span>
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] text-recovinyl-dark font-medium">
                Window adjusts dynamically ({isShowingAll ? `All ${currentTab.questionList.length} shown` : `${selectedQuestionIds.length} of ${currentTab.questionList.length} shown`})
              </span>
            </div>
          );
        })()}

        {/* ================= QUESTION CARD 1: GENERATION ================= */}
        {activeCard === 1 && (
          <div className="space-y-6 h-auto">
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
                  QUESTION CARD 1 • Track A (2 Questions Available: Q 1.1 & Q 1.2)
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Generation of Rigid and Flexible Post-Consumer PVC Waste
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-light border border-recovinyl-blue/30 font-bold text-recovinyl-dark">
                  Rigid: {dataset.card1.totalRigidGenerated.toLocaleString()} t/a
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-greenLight border border-recovinyl-green/40 font-bold text-recovinyl-greenDark">
                  Flexible: {dataset.card1.totalFlexibleGenerated.toLocaleString()} t/a
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-blue text-white font-extrabold">
                  Total Generated: {dataset.card1.totalGenerated.toLocaleString()} t/a
                </span>
                <button
                  onClick={() => handleSaveCardToAccount(1)}
                  className="px-4 py-1.5 rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 font-extrabold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Card 1 to Account</span>
                </button>
              </div>
            </div>

            {/* Q 1.1 — Every item line selectable with multiselect + dynamic height */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('1.1')) && (
              <MultiselectQuestionBlock
                questionCode="Q 1.1"
                questionTitle="1.1. What are the main sources of post-consumer PVC waste in the country (e.g., household, municipal, construction, medical, etc.)?"
                items={getQ1_1Items()}
                onChangeItems={syncQ1_1Items}
                addPlaceholder="Add another post-consumer PVC waste source line (press Enter or click Add & Select Line)..."
              />
            )}

            {/* Q 1.2 */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('1.2')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 1.2 • Post-Consumer PVC Waste Types & Quantities Generated (t/a)
                    </span>
                    <div className="mt-2">
                      <MultiLevelQuestionTitle
                        main="1.2. What are the types of post-consumer PVC waste which typically occur (i.e. PVC products expected to reach end of life status) in the country?"
                        subItems={[
                          {
                            marker: '(i)',
                            text: 'Which types correspond to rigid PVC and which ones to flexible PVC?'
                          },
                          {
                            marker: '(ii)',
                            text: 'What is the quantity (in tonnes per year) of each type of post-consumer PVC waste generated in the country?'
                          }
                        ]}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addQ1_2Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Waste Stream Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-[11px] uppercase border-b border-slate-200">
                        <th className="py-2.5 px-3 font-bold">Post-Consumer PVC Waste Type</th>
                        <th className="py-2.5 px-3 font-bold">Type of PVC (Rolling Menu)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Quantity (t/a)</th>
                        <th className="py-2.5 px-3 font-bold">Evidence vs. Estimation</th>
                        <th className="py-2.5 px-3 font-bold">Context / Reference Notes</th>
                        <th className="py-2.5 px-2 text-center">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card1.q1_2_streams.map((stream) => (
                        <tr key={stream.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={stream.wasteType}
                              onChange={(e) => updateQ1_2Row(stream.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200 focus:border-recovinyl-blue"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={stream.pvcType}
                              onChange={(e) => updateQ1_2Row(stream.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={stream.quantityTonnes}
                              onChange={(e) => updateQ1_2Row(stream.id, 'quantityTonnes', e.target.value)}
                              className="w-28 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={stream.basis}
                              onChange={(e) => updateQ1_2Row(stream.id, 'basis', e.target.value as DataBasis)}
                              className="px-2 py-1 rounded border border-slate-200 bg-slate-50 text-[11px]"
                            >
                              <option value="Evidence-based">Evidence-based</option>
                              <option value="Educated estimation">Educated estimation</option>
                              <option value="Calculated">Calculated</option>
                              <option value="Survey / RRR Input">Survey / RRR Input</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={stream.notes ?? ''}
                              placeholder="Add source or estimation context..."
                              onChange={(e) => updateQ1_2Row(stream.id, 'notes', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200 text-[11px]"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              onClick={() => deleteQ1_2Row(stream.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Delete row"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= QUESTION CARD 2: COLLECTION ================= */}
        {activeCard === 2 && (
          <div className="space-y-6 h-auto">
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
                  QUESTION CARD 2 • Track A (8 Questions Available: Q 2.1 – Q 2.8)
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Collection of Rigid and Flexible Post-Consumer PVC Waste
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-light border border-recovinyl-blue/30 font-bold text-recovinyl-dark">
                  Rigid: {dataset.card2.totalRigidCollected.toLocaleString()} t/a
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-greenLight border border-recovinyl-green/40 font-bold text-recovinyl-greenDark">
                  Flexible: {dataset.card2.totalFlexibleCollected.toLocaleString()} t/a
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-blue text-white font-extrabold">
                  Total Collected Separately: {dataset.card2.totalCollected.toLocaleString()} t/a
                </span>
                <button
                  onClick={() => handleSaveCardToAccount(2)}
                  className="px-4 py-1.5 rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 font-extrabold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Card 2 to Account</span>
                </button>
              </div>
            </div>

            {/* Q 2.1 — Multiselect selectable item lines + dynamic window */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('2.1')) && (
              <MultiselectQuestionBlock
                questionCode="Q 2.1"
                questionTitle="2.1. What general (legal) requirements or schemes (e.g., EPR) apply to the collection of post-consumer plastic waste in the country?"
                items={getQ2_1Items()}
                onChangeItems={syncQ2_1Items}
                addPlaceholder="Add another general plastic waste collection / EPR scheme line..."
              />
            )}

            {/* Q 2.2 — Multiselect selectable item lines + dynamic window */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('2.2')) && (
              <MultiselectQuestionBlock
                questionCode="Q 2.2"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="2.2. What (legal) requirements or schemes (e.g., EPR) apply more specifically to the collection of post-consumer PVC waste in the country?"
                    subItems={[
                      {
                        marker: '(i)',
                        text: 'Are there different requirements applicable to rigid and flexible PVC wastes?'
                      }
                    ]}
                  />
                }
                items={getQ2_2Items()}
                onChangeItems={syncQ2_2Items}
                addPlaceholder="Add another PVC-specific collection requirement or scheme line..."
              />
            )}

            {/* Q 2.3 — Multiselect selectable item lines + dynamic window */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('2.3')) && (
              <MultiselectQuestionBlock
                questionCode="Q 2.3"
                questionTitle="2.3. What economic and other types of incentives exist to stimulate and support the collection of post-consumer PVC waste in the country?"
                items={getQ2_3Items()}
                onChangeItems={syncQ2_3Items}
                addPlaceholder="Add another economic or regulatory collection incentive line..."
              />
            )}

            {/* Q 2.4 — Collected Quantities (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('2.4')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 2.4 • Separately Collected Tonnages
                    </span>
                    <div className="mt-2">
                      <MultiLevelQuestionTitle
                        main="2.4. What quantity (in tonnes/year) of post-consumer PVC waste is collected separately in the country?"
                        subItems={[
                          {
                            marker: '(i)',
                            text: 'Please specify these per application and for rigid versus flexible PVC.'
                          }
                        ]}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addQ2_4Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Collected Stream</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Post-Consumer PVC Waste Type</th>
                        <th className="py-2.5 px-3 font-bold">Type of PVC (Rolling Menu)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Quantity Collected (t/a)</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card2.q2_4_collectedStreams.map((s, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={s.wasteType}
                              onChange={(e) => updateQ2_4Row(i, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200 focus:border-recovinyl-blue"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={s.pvcType}
                              onChange={(e) => updateQ2_4Row(i, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={s.quantityTonnes}
                              onChange={(e) => updateQ2_4Row(i, 'quantityTonnes', e.target.value)}
                              className="w-32 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ2_4Row(i)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Delete row"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 2.5 — Collector Facilities & Entities (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('2.5')) && (() => {
              const allCollectors = dataset.facilities.filter((f) => f.questionRef === '2.5');
              const filteredCollectors = q25Search.trim()
                ? allCollectors.filter(
                    (f) =>
                      f.name.toLowerCase().includes(q25Search.toLowerCase()) ||
                      f.city.toLowerCase().includes(q25Search.toLowerCase()) ||
                      f.regionOrProvince.toLowerCase().includes(q25Search.toLowerCase())
                  )
                : allCollectors;

              return (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-[280px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                          Q 2.5 • Collector Facilities & Entities
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-greenLight border border-recovinyl-green/40 text-recovinyl-greenDark text-[11px] font-extrabold">
                          {allCollectors.length} collection entities in {dataset.countryName}
                        </span>
                      </div>
                      <div className="mt-2">
                        <MultiLevelQuestionTitle
                          main="2.5. How many facilities or entities collecting post-consumer PVC waste are established in the country?"
                          subItems={[
                            {
                              marker: '(i)',
                              text: 'What is their typical size (number of employees, turnover, etc.)?'
                            }
                          ]}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <input
                        type="text"
                        value={q25Search}
                        onChange={(e) => setQ25Search(e.target.value)}
                        placeholder="Filter by company or city..."
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-recovinyl-blue"
                      />
                      <button
                        type="button"
                        onClick={addQ2_5Facility}
                        className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Collector Entity</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 font-bold">#</th>
                          <th className="py-2.5 px-3 font-bold">Name of Facility or Entity</th>
                          <th className="py-2.5 px-3 font-bold">Type of PVC (Rolling Menu)</th>
                          <th className="py-2.5 px-3 font-bold">City (Province)</th>
                          <th className="py-2.5 px-3 font-bold">Region</th>
                          <th className="py-2.5 px-3 font-bold">Size Information (Employees & Turnover)</th>
                          <th className="py-2.5 px-2 text-center font-bold">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredCollectors.map((fac, idx) => (
                          <tr key={fac.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono text-[11px] text-slate-400">{idx + 1}</td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={fac.name}
                                onChange={(e) => updateQ2_5Facility(fac.id, 'name', e.target.value)}
                                className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200 focus:border-recovinyl-blue"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={fac.pvcType}
                                onChange={(e) => updateQ2_5Facility(fac.id, 'pvcType', e.target.value as PvcType)}
                                className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                              >
                                <option value="Rigid PVC">Rigid PVC</option>
                                <option value="Flexible PVC">Flexible PVC</option>
                                <option value="Both">Both</option>
                                <option value="Unknown">Unknown</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={fac.city}
                                onChange={(e) => updateQ2_5Facility(fac.id, 'city', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={fac.regionOrProvince}
                                onChange={(e) => updateQ2_5Facility(fac.id, 'regionOrProvince', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200 text-slate-600"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={fac.sizeRaw}
                                onChange={(e) => updateQ2_5Facility(fac.id, 'sizeRaw', e.target.value)}
                                placeholder="e.g. 105 empl - 38,60M€"
                                className="w-full font-mono px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => deleteQ2_5Facility(fac.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                                title="Delete collector entity"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Q 2.6 — Domestic vs. Export Processing & European List of Waste Codes (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('2.6')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 2.6 • Domestic vs. Export Processing & LoW Codes
                    </span>
                    <div className="mt-2">
                      <MultiLevelQuestionTitle
                        main="2.6. Is further processing of collected rigid or flexible post-consumer PVC waste taking place in the country or are these wastes exported for further processing to another country? If the collected waste is exported:"
                        subItems={[
                          {
                            marker: '(i)',
                            text: 'Which waste code(s) (European List of Waste) is(are) used for the export, and'
                          },
                          {
                            marker: '(ii)',
                            text: 'To which country(ies) in and outside of Europe do exports take place?'
                          }
                        ]}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addQ2_6Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Export / Processing Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Post-Consumer PVC Waste Type</th>
                        <th className="py-2.5 px-3 font-bold">Processed in Country or Outside?</th>
                        <th className="py-2.5 px-3 font-bold">If Outside: Which Country(ies)?</th>
                        <th className="py-2.5 px-3 font-bold">If Outside: Waste Code(s) (LoW)</th>
                        <th className="py-2.5 px-3 font-bold">Type of PVC</th>
                        <th className="py-2.5 px-3 font-bold text-right">Quantity Exported (t/a)</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card2.q2_6_exports.map((ex) => (
                        <tr key={ex.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={ex.wasteType}
                              onChange={(e) => updateQ2_6Row(ex.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200 focus:border-recovinyl-blue"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={ex.processedLocation}
                              onChange={(e) => updateQ2_6Row(ex.id, 'processedLocation', e.target.value)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Processed in the country">Processed in the country</option>
                              <option value="Processed outside the country">Processed outside the country</option>
                              <option value="Both">Both</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={ex.destinationCountries}
                              placeholder="e.g. FRANCE, MOROCCO, UK..."
                              onChange={(e) => updateQ2_6Row(ex.id, 'destinationCountries', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={ex.wasteCodes}
                              placeholder="e.g. 17 02 03, 08 01 11..."
                              onChange={(e) => updateQ2_6Row(ex.id, 'wasteCodes', e.target.value)}
                              className="w-full font-mono px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={ex.pvcType}
                              onChange={(e) => updateQ2_6Row(ex.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={ex.totalQuantityTonnes ?? ''}
                              placeholder="0"
                              onChange={(e) => updateQ2_6Row(ex.id, 'totalQuantityTonnes', e.target.value)}
                              className="w-28 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ2_6Row(ex.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Delete row"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 2.7 — Main Stakeholders Involved in Collection (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('2.7')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 2.7 • Main Collection Stakeholders
                    </span>
                    <div className="mt-2">
                      <MultiLevelQuestionTitle
                        main="2.7. Who are the main stakeholders involved in the collection of rigid and flexible post-consumer PVC waste in the country?"
                        subItems={[
                          {
                            marker: '(i)',
                            text: 'Please provide names, affiliations, websites and contact details as much as possible.'
                          }
                        ]}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addQ2_7Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stakeholder Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Stakeholder Name</th>
                        <th className="py-2.5 px-3 font-bold">Affiliation</th>
                        <th className="py-2.5 px-3 font-bold">Website</th>
                        <th className="py-2.5 px-3 font-bold">City</th>
                        <th className="py-2.5 px-3 font-bold">Contact Details</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card2.q2_7_stakeholders.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={st.name}
                              onChange={(e) => updateQ2_7Row(st.id, 'name', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200 focus:border-recovinyl-blue"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={st.affiliation}
                              onChange={(e) => updateQ2_7Row(st.id, 'affiliation', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={st.website}
                              onChange={(e) => updateQ2_7Row(st.id, 'website', e.target.value)}
                              className="w-full font-mono text-recovinyl-blue px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={st.city}
                              onChange={(e) => updateQ2_7Row(st.id, 'city', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={st.contact}
                              onChange={(e) => updateQ2_7Row(st.id, 'contact', e.target.value)}
                              className="w-full font-mono px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ2_7Row(st.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Delete stakeholder"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 2.8 — Economic Costs Associated with Collection (Editable Table — Same Style as Q 2.6) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('2.8')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 2.8 • Economic Costs of Collection (€/ton)
                    </span>
                    <div className="mt-2">
                      <MultiLevelQuestionTitle
                        main="2.8. What types of (economic) costs (e.g., operational, gateway, etc., and in euros) are associated with the collection of rigid and flexible post-consumer PVC waste in the country?"
                        subItems={[
                          {
                            marker: '(i)',
                            text: 'Please quantify such costs (in euros) where possible.'
                          }
                        ]}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addQ2_8Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Collection Cost Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Type of (Economic) Cost</th>
                        <th className="py-2.5 px-3 font-bold">Type of PVC (Rolling Menu)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Cost (EUR)</th>
                        <th className="py-2.5 px-3 font-bold">Remarks / Distance & Conditions</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card2.q2_8_costs.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.costType}
                              onChange={(e) => updateQ2_8Row(c.id, 'costType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200 focus:border-recovinyl-blue"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={c.pvcType}
                              onChange={(e) => updateQ2_8Row(c.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="text"
                              value={c.costDisplay}
                              onChange={(e) => updateQ2_8Row(c.id, 'costDisplay', e.target.value)}
                              placeholder="e.g. 39 €/ton"
                              className="w-32 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.remarks}
                              onChange={(e) => updateQ2_8Row(c.id, 'remarks', e.target.value)}
                              placeholder="Add cost calculation or regional note..."
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ2_8Row(c.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Delete cost row"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= QUESTION CARD 3: SORTING & PRETREATMENT ================= */}
        {activeCard === 3 && (
          <div className="space-y-6 h-auto">
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
                  QUESTION CARD 3 • Track B.1 (Deadline: 15 Jul 2025 • Q 3.1 – 3.12)
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Sorting and Pretreatment of Post-Consumer PVC Waste for Recovery
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-blue text-white text-xs font-extrabold">
                  Total Sorted & Pretreated: {dataset.card3.totalSortedProcessed.toLocaleString()} t/a
                </span>
                <button
                  onClick={() => handleSaveCardToAccount(3)}
                  className="px-4 py-1.5 rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Card 3 to Account</span>
                </button>
              </div>
            </div>

            {/* Q 3.1 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.1')) && (
              <MultiselectQuestionBlock
                questionCode="Q 3.1"
                questionTitle="3.1. What general (legal) requirements apply to the sorting and pretreatment for recovery of post-consumer plastic waste in the country?"
                items={getRegistryItems('q3_1', dataset.card3.q3_1_generalRequirements, [
                  '1) Legislative Decree No. 152/2006 (Environmental Code) — Part IV on waste sorting, pretreatment, and recovery authorization regimes (Art. 208 single permit & Art. 214–216 simplified procedures)',
                  '2) Ministerial Decree 5 February 1998 — Technical rules for simplified recovery of non-hazardous plastic waste (shredding, washing, granulation, density separation)',
                  '3) EU Waste Framework Directive (2008/98/EC) & Circular Economy Package transposition requiring pre-sorting prior to recovery or disposal',
                  '4) National End-of-Waste (EoW) criteria & UNI EN 15343 / UNI 10667 standards for sorted and pretreated plastic secondary raw materials'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q3_1', items, (lines, base) => ({
                    ...base,
                    card3: { ...base.card3, q3_1_generalRequirements: lines }
                  }))
                }
                addPlaceholder="Add another general legal requirement or scheme for sorting & pretreatment..."
              />
            )}

            {/* Q 3.2 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.2')) && (
              <MultiselectQuestionBlock
                questionCode="Q 3.2"
                questionTitle="3.2. What (legal) requirements or schemes apply more specifically to the sorting and pretreatment for recovery of rigid and flexible post-consumer PVC waste in the country?"
                items={getRegistryItems('q3_2', dataset.card3.q3_2_pvcRequirements, [
                  '1) No PVC-specific sorting legislation exists; general plastic waste sorting and pretreatment rules (D.Lgs. 152/2006 & DM 05/02/1998) apply to both rigid and flexible PVC',
                  '2) UNI 10667-14 & Recovinyl sorting specifications define impurity tolerances for rigid PVC (profiles, pipes) vs. flexible PVC (cables, membranes, flooring)',
                  '3) REACH & POP Regulation (EU 2019/1021) compliance checks during sorting/pretreatment to segregate legacy lead-stabilized or DEHP-plasticized PVC fractions',
                  '4) WEEE & ELV treatment regulations require selective stripping and copper/aluminium separation from PVC cable insulation'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q3_2', items, (lines, base) => ({
                    ...base,
                    card3: { ...base.card3, q3_2_pvcRequirements: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another PVC-specific sorting or pretreatment requirement..."
              />
            )}

            {/* Q 3.3 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.3')) && (
              <MultiselectQuestionBlock
                questionCode="Q 3.3"
                questionTitle="3.3. What incentives exist to stimulate and support the sorting and pretreatment for recovery of rigid and flexible post-consumer PVC waste in the country?"
                items={getRegistryItems('q3_3', dataset.card3.q3_3_incentives, [
                  '1) PNRR (National Recovery and Resilience Plan) Mission 2 Component 1 Measure 1.1 & 1.2 grants for modernizing optical/NIR sorting & plastic pretreatment plants',
                  '2) Tax credits (Credito d’Imposta Transizione 4.0 / 5.0) for automated optical sorting, AI robotics, and micronization equipment',
                  '3) Recovinyl financial incentives & certified volume registration supporting sorters and pre-processors supplying clean post-consumer PVC fractions',
                  '4) Regional circular economy calls (Bandi Regionali Economia Circolare) co-financing C&D and industrial plastic sorting lines'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q3_3', items, (lines, base) => ({
                    ...base,
                    card3: { ...base.card3, q3_3_incentives: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another economic or policy incentive for PVC sorting & pretreatment..."
              />
            )}

            {/* Q 3.4 — Separate Question: Sorting Techniques & Automation Levels */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.4')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 3.4 • Sorting Techniques & Pretreatment Technologies
                    </span>
                    <label className="block text-sm font-extrabold text-slate-900 mt-1.5">
                      3.4. What sorting techniques and pretreatment technologies are used to sort and pretreat rigid and flexible post-consumer PVC waste in the country (e.g., manual, semi-automated or fully automated; when (semi-)automated, please provide a description of the technology employed)?
                    </label>
                  </div>
                  <button
                    onClick={addQ3_7TechRow}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sorting Technique Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Post-Consumer PVC Waste Stream</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type (Rolling Menu)</th>
                        <th className="py-2.5 px-3 font-bold">Sorting / Pretreatment Technique</th>
                        <th className="py-2.5 px-3 font-bold">Automation Level</th>
                        <th className="py-2.5 px-3 font-bold">Process Description</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card3.q3_7_technologies.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.wasteType}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={t.pvcType}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.technologyCategory}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'technologyCategory', e.target.value)}
                              className="w-full font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.automationOrSubTech}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'automationOrSubTech', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.description}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'description', e.target.value)}
                              className="w-full text-slate-700 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ3_7TechRow(t.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 3.5 — Separate Question: Quality, Impurity Concentration & Market Price of Sorted PVC Waste */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.5')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 3.5 • Sorted Quality, Impurity Levels & Pricing (€/t)
                    </span>
                    <div className="mt-2">
                      <MultiLevelQuestionTitle
                        main="3.5. Regarding the quality of the sorted and pretreated rigid and flexible PVC waste:"
                        subItems={[
                          {
                            marker: '(i)',
                            text: 'What is the typical quality/chemical composition (concentration of PVC) of this waste in the country? What are the main undesirable/legacy impurities and their respective concentrations in this sorted and pretreated PVC waste? Where possible, please report these qualities against the PVC waste source they initially relate to.'
                          },
                          {
                            marker: '(ii)',
                            text: 'What is the price of each quality level for such waste in the country?'
                          }
                        ]}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addQ3_7TechRow}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Quality & Price Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">PVC Waste Stream</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type</th>
                        <th className="py-2.5 px-3 font-bold">Typical Quality / Impurity %</th>
                        <th className="py-2.5 px-3 font-bold">Main Impurities</th>
                        <th className="py-2.5 px-3 font-bold text-right">Market Price (€/t)</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card3.q3_7_technologies.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.wasteType}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={t.pvcType}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.typicalQuality}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'typicalQuality', e.target.value)}
                              className="w-full font-semibold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.mainImpurities}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'mainImpurities', e.target.value)}
                              className="w-full text-slate-700 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="text"
                              value={t.priceEurPerTon}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'priceEurPerTon', e.target.value)}
                              className="w-36 text-right font-mono font-bold text-recovinyl-greenDark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ3_7TechRow(t.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 3.6 — Separate Question: Input Quantities Entering Sorting (t/a) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.6')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 3.6 • Input into Sorting and Pretreatment (t/a)
                    </span>
                    <label className="block text-sm font-extrabold text-slate-900 mt-1.5">
                      3.6. What quantity (in tonnes per year) of rigid and flexible post-consumer PVC waste is sorted and pretreated in the country per sorting techniques and pretreatment technology (input into sorting and pretreatment)?
                    </label>
                  </div>
                  <button
                    onClick={addQ3_10Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sorting Input Stream</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Post-Consumer PVC Waste Stream</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type (Rolling Menu)</th>
                        <th className="py-2.5 px-3 font-bold">Waste Codes (LoW)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Input Quantity to Sorting (t/a)</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card3.q3_10_massBalance.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={m.wasteType}
                              onChange={(e) => updateQ3_10Row(m.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={m.pvcType}
                              onChange={(e) => updateQ3_10Row(m.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={m.wasteCodes}
                              onChange={(e) => updateQ3_10Row(m.id, 'wasteCodes', e.target.value)}
                              className="w-full font-mono text-slate-700 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={m.totalQuantityTonnes ?? 0}
                              onChange={(e) => updateQ3_10Row(m.id, 'totalQuantityTonnes', e.target.value)}
                              className="w-32 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ3_10Row(m.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 3.7 — Separate Question: Pretreatment Technologies, Output Quantities & Quality */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.7')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 3.7 • Output of Sorting and Pretreatment (t/a)
                    </span>
                    <label className="block text-sm font-extrabold text-slate-900 mt-1.5">
                      3.7. What quantity (in tonnes per year) of sorted and pretreated rigid and flexible PVC waste is generated in the country per sorting technique and pretreatment technology, and resulting quality/chemical composition (output of sorting and pretreatment)?
                    </label>
                  </div>
                  <button
                    onClick={addQ3_7TechRow}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pretreatment Technology</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">PVC Waste Stream</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type</th>
                        <th className="py-2.5 px-3 font-bold">Pretreatment Tech</th>
                        <th className="py-2.5 px-3 font-bold">Sub-Tech / Automation</th>
                        <th className="py-2.5 px-3 font-bold text-right">Volume (t/a)</th>
                        <th className="py-2.5 px-3 font-bold">Typical Quality</th>
                        <th className="py-2.5 px-3 font-bold text-right">Price (€/t)</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card3.q3_7_technologies.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.wasteType}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={t.pvcType}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.technologyCategory}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'technologyCategory', e.target.value)}
                              className="w-full font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.automationOrSubTech}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'automationOrSubTech', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              placeholder="N/A"
                              value={t.inputOrOutputTonnes ?? ''}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'inputOrOutputTonnes', e.target.value)}
                              className="w-24 text-right font-mono font-bold px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={t.typicalQuality}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'typicalQuality', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="text"
                              value={t.priceEurPerTon}
                              onChange={(e) => updateQ3_7TechRow(t.id, 'priceEurPerTon', e.target.value)}
                              className="w-28 text-right font-mono font-bold text-recovinyl-greenDark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ3_7TechRow(t.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 3.8 — Sorting & Pretreatment Facilities (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.8')) && (() => {
              const sortingFacilities = dataset.facilities.filter((f) => f.questionRef === '3.8');
              return (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1 min-w-[280px]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                          Q 3.8 • Sorting & Pretreatment Facilities
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-greenLight border border-recovinyl-green/40 text-recovinyl-greenDark text-[11px] font-extrabold">
                          {sortingFacilities.length} facilities in {dataset.countryName}
                        </span>
                      </div>
                      <div className="mt-2">
                        <MultiLevelQuestionTitle
                          main="3.8. How many facilities or entities sorting and pre-treating post-consumer PVC waste are established in the country?"
                          subItems={[
                            {
                              marker: '(i)',
                              text: 'What is their typical size (number of employees, turnover, etc.)?'
                            }
                          ]}
                        />
                      </div>
                    </div>
                    <button
                      onClick={addQ3_8Facility}
                      className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Sorting Facility</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-96 overflow-y-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 bg-slate-100 z-10">
                        <tr className="text-slate-700 border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 font-bold">Facility / Company Name</th>
                          <th className="py-2.5 px-3 font-bold">PVC Type (Rolling Menu)</th>
                          <th className="py-2.5 px-3 font-bold">City / Location</th>
                          <th className="py-2.5 px-3 font-bold">Region / Province</th>
                          <th className="py-2.5 px-3 font-bold">Size (Employees & Turnover)</th>
                          <th className="py-2.5 px-2 text-center font-bold">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {sortingFacilities.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.name}
                                onChange={(e) => updateQ2_5Facility(f.id, 'name', e.target.value)}
                                className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={f.pvcType}
                                onChange={(e) => updateQ2_5Facility(f.id, 'pvcType', e.target.value as PvcType)}
                                className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                              >
                                <option value="Flexible PVC">Flexible PVC</option>
                                <option value="Rigid PVC">Rigid PVC</option>
                                <option value="Both">Both</option>
                                <option value="Unknown">Unknown</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.city}
                                onChange={(e) => updateQ2_5Facility(f.id, 'city', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.regionOrProvince}
                                onChange={(e) => updateQ2_5Facility(f.id, 'regionOrProvince', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.sizeRaw}
                                onChange={(e) => updateQ2_5Facility(f.id, 'sizeRaw', e.target.value)}
                                className="w-full font-mono px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => deleteQ2_5Facility(f.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Q 3.9 — Multiselect selectable item lines: Domestic vs Export of Sorted PVC Waste */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.9')) && (
              <MultiselectQuestionBlock
                questionCode="Q 3.9"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="3.9. Is further processing of sorted and pretreated rigid and flexible post-consumer PVC waste taking place in the country or are these wastes exported for further processing to another country? If the sorted and pretreated waste is exported:"
                    subItems={[
                      {
                        marker: '(i)',
                        text: 'Which waste code(s) (European List of Waste) is(are) used for the export, and'
                      },
                      {
                        marker: '(ii)',
                        text: 'To which country(ies) in and outside of Europe do exports take place?'
                      }
                    ]}
                  />
                }
                items={getRegistryItems(
                  'q3_9',
                  dataset.card3.q3_10_massBalance.map(
                    (m) => `${m.wasteType}: ${m.processedLocation} (${m.destinationCountries}) — LoW: ${m.wasteCodes}`
                  ),
                  [
                    '1) Sorted rigid & flexible PVC streams (Cables, Profiles, Pipes, Rigid film, Flooring) are predominantly processed in the country (Italy) under LoW codes 19 12 04, 17 02 03, 17 04 11, and 15 01 02',
                    '2) Selected rigid window profile & pipe recyclates are traded cross-border within EU Member States (Germany, Austria, France) under Green-Listed waste code B3010 / EU191204',
                    '3) Mixed unsorted plastic reject fractions (19 12 12) not meeting mechanical recycling purity are sent domestically to cement kilns (CSS) or energy recovery (WTE)'
                  ]
                )}
                onChangeItems={(items) =>
                  syncRegistryItems('q3_9', items, (_lines, base) => base)
                }
                addPlaceholder="Add another domestic processing or cross-border export line for Q3.9..."
              />
            )}

            {/* Q 3.10 — Mass Balance of Sorted & Pretreated PVC Waste (Full Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.10')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 3.10 • Sorted PVC Waste Mass Balance (t/a)
                    </span>
                    <label className="block text-sm font-extrabold text-slate-900 mt-1.5">
                      3.10. Whether inside or outside the country in which the rigid and flexible post-consumer waste is sorted and pre-treated, what proportion or quantity (in tonnes per year) of the sorted and pretreated PVC waste is directed to recycling (including waste to energy), incineration, landfilling or other recovery operations, respectively?
                    </label>
                  </div>
                  <button
                    onClick={addQ3_10Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Mass Balance Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Waste Stream</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type</th>
                        <th className="py-2.5 px-3 font-bold">LoW Codes</th>
                        <th className="py-2.5 px-3 font-bold text-right">Total Processed (t/a)</th>
                        <th className="py-2.5 px-3 font-bold text-right">→ To Recycling (t/a)</th>
                        <th className="py-2.5 px-3 font-bold text-right">→ To Incineration (t/a)</th>
                        <th className="py-2.5 px-3 font-bold text-right">→ To Landfilling (t/a)</th>
                        <th className="py-2.5 px-3 font-bold">Notes</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card3.q3_10_massBalance.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={m.wasteType}
                              onChange={(e) => updateQ3_10Row(m.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={m.pvcType}
                              onChange={(e) => updateQ3_10Row(m.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={m.wasteCodes}
                              onChange={(e) => updateQ3_10Row(m.id, 'wasteCodes', e.target.value)}
                              className="w-24 font-mono px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={m.totalQuantityTonnes ?? 0}
                              onChange={(e) => updateQ3_10Row(m.id, 'totalQuantityTonnes', e.target.value)}
                              className="w-24 text-right font-mono font-bold px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={m.recyclingTonnes ?? 0}
                              onChange={(e) => updateQ3_10Row(m.id, 'recyclingTonnes', e.target.value)}
                              className="w-24 text-right font-mono font-bold text-recovinyl-greenDark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={m.incinerationTonnes ?? 0}
                              onChange={(e) => updateQ3_10Row(m.id, 'incinerationTonnes', e.target.value)}
                              className="w-20 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={m.landfillingTonnes ?? 0}
                              onChange={(e) => updateQ3_10Row(m.id, 'landfillingTonnes', e.target.value)}
                              className="w-24 text-right font-mono font-bold text-slate-700 px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={m.notes ?? ''}
                              onChange={(e) => updateQ3_10Row(m.id, 'notes', e.target.value)}
                              className="w-full text-[11px] text-slate-600 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ3_10Row(m.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 3.11 — Sorting & Pretreatment Stakeholders (Previously Missing — Now Full Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.11')) && (() => {
              const stakeholders = getQ3_11Stakeholders();
              return (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1 min-w-[280px]">
                      <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                        Q 3.11 • Sorting & Pretreatment Stakeholders
                      </span>
                      <div className="mt-2">
                        <MultiLevelQuestionTitle
                          main="3.11. Who are the main stakeholders involved in the sorting and pretreatment of rigid and flexible post-consumer PVC waste in the country?"
                          subItems={[
                            {
                              marker: '(i)',
                              text: 'Please provide names, affiliations, websites and contact details as much as possible.'
                            }
                          ]}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        syncQ3_11Stakeholders([
                          ...stakeholders,
                          {
                            id: `st311-${Date.now()}`,
                            questionRef: '3.11',
                            name: 'NEW SORTING STAKEHOLDER',
                            affiliation: 'Association / Consortium',
                            website: 'www.',
                            city: 'City',
                            contact: 'info@'
                          }
                        ])
                      }
                      className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stakeholder (Q3.11)</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 font-bold">Stakeholder / Organization</th>
                          <th className="py-2.5 px-3 font-bold">Affiliation / Role</th>
                          <th className="py-2.5 px-3 font-bold">Website</th>
                          <th className="py-2.5 px-3 font-bold">City / Location</th>
                          <th className="py-2.5 px-3 font-bold">Contact Details</th>
                          <th className="py-2.5 px-2 text-center font-bold">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {stakeholders.map((st) => (
                          <tr key={st.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.name}
                                onChange={(e) =>
                                  syncQ3_11Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, name: e.target.value } : s))
                                  )
                                }
                                className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.affiliation}
                                onChange={(e) =>
                                  syncQ3_11Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, affiliation: e.target.value } : s))
                                  )
                                }
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.website}
                                onChange={(e) =>
                                  syncQ3_11Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, website: e.target.value } : s))
                                  )
                                }
                                className="w-full text-recovinyl-blue font-semibold px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.city}
                                onChange={(e) =>
                                  syncQ3_11Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, city: e.target.value } : s))
                                  )
                                }
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.contact}
                                onChange={(e) =>
                                  syncQ3_11Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, contact: e.target.value } : s))
                                  )
                                }
                                className="w-full font-mono px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => syncQ3_11Stakeholders(stakeholders.filter((s) => s.id !== st.id))}
                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Q 3.12 — Economic Costs Associated with Sorting & Pretreatment (Previously Missing — Now Full Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('3.12')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-[280px]">
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 3.12 • Economic Costs of Sorting & Pretreatment (€/t)
                    </span>
                    <div className="mt-2">
                      <MultiLevelQuestionTitle
                        main="3.12. What types of (economic) costs (e.g., operational, gateway, etc., and in euros) are associated with the sorting and pretreatment of rigid and flexible post-consumer PVC waste in the country?"
                        subItems={[
                          {
                            marker: '(i)',
                            text: 'Please quantify such costs (in euros) where possible.'
                          }
                        ]}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addQ3_12Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Cost Row (Q3.12)</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Cost Category / Waste Stream</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type (Rolling Menu)</th>
                        <th className="py-2.5 px-3 font-bold">Cost Range / Value (€/t)</th>
                        <th className="py-2.5 px-3 font-bold">Remarks</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card3.q3_12_costs.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.costType}
                              onChange={(e) => updateQ3_12Row(c.id, 'costType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={c.pvcType}
                              onChange={(e) => updateQ3_12Row(c.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.costDisplay}
                              onChange={(e) => updateQ3_12Row(c.id, 'costDisplay', e.target.value)}
                              className="w-40 font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.remarks ?? ''}
                              onChange={(e) => updateQ3_12Row(c.id, 'remarks', e.target.value)}
                              className="w-full text-slate-600 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ3_12Row(c.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= QUESTION CARD 4: RECYCLING & UPTAKE ================= */}
        {activeCard === 4 && (
          <div className="space-y-6 h-auto">
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
                  QUESTION CARD 4 • Track A (Deadline: 15 Jul 2025 • Q 4.1 – 4.13)
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Recycling of rigid and flexible post-consumer PVC waste
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-blue text-white font-extrabold">
                  Recycled Input/Output (Q4.6/4.7): {dataset.card4.totalRecycledOutput.toLocaleString()} t/a
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-greenLight border border-recovinyl-green/40 text-recovinyl-greenDark font-extrabold">
                  Converter Uptake (Q4.11): {dataset.card4.totalUptakeTonnes.toLocaleString()} t/a
                </span>
                <button
                  onClick={() => handleSaveCardToAccount(4)}
                  className="px-4 py-1.5 rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 font-extrabold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Card 4 to Account</span>
                </button>
              </div>
            </div>

            {/* Q 4.1 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.1')) && (
              <MultiselectQuestionBlock
                questionCode="Q 4.1"
                questionTitle="4.1. What general (legal) requirements apply to the recycling of post-consumer plastic waste in the country?"
                items={getRegistryItems('q4_1', dataset.card4.q4_1_generalRequirements, [
                  '1) Registration in the National Register of Environmental Managers',
                  '2) Authorization to operate the recovery plant',
                  '3) Loading and unloading register + MUD (annual declaration of flows)',
                  '4) Traceability via FIR (Waste Identification Form) / RENTRI'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q4_1', items, (lines, base) => ({
                    ...base,
                    card4: { ...base.card4, q4_1_generalRequirements: lines }
                  }))
                }
                addPlaceholder="Add another general plastic recycling legal requirement..."
              />
            )}

            {/* Q 4.2 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.2')) && (
              <MultiselectQuestionBlock
                questionCode="Q 4.2"
                questionTitle="4.2. What (legal) requirements or schemes apply more specifically to the recycling of rigid and flexible post-consumer PVC waste in the country?"
                items={getRegistryItems('q4_2', dataset.card4.q4_2_pvcRequirements, [
                  'No specific requirments for PVC'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q4_2', items, (lines, base) => ({
                    ...base,
                    card4: { ...base.card4, q4_2_pvcRequirements: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another PVC-specific recycling legal requirement or scheme..."
              />
            )}

            {/* Q 4.3 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.3')) && (
              <MultiselectQuestionBlock
                questionCode="Q 4.3"
                questionTitle="4.3. What incentives exist to stimulate and support the recycling of rigid and flexible post-consumer PVC waste in the country?"
                items={getRegistryItems('q4_3', dataset.card4.q4_3_incentives, [
                  'No incentives'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q4_3', items, (lines, base) => ({
                    ...base,
                    card4: { ...base.card4, q4_3_incentives: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another recycling incentive..."
              />
            )}

            {/* Q 4.4 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.4')) && (
              <MultiselectQuestionBlock
                questionCode="Q 4.4"
                questionTitle="4.4. What recycling technology(ies) are used to recycle rigid and flexible post-consumer PVC waste in the country (e.g., mechanical recycling, dissolution, chemical recycling, etc.; please provide a description of the technology(ies) employed)?"
                items={getRegistryItems(
                  'q4_4',
                  dataset.card4.q4_4_technologiesSummary.map((t) =>
                    t.description ? `${t.name}: ${t.description}` : t.name
                  ),
                  [
                    '1) MECHANICAL RECYCLING: after manual sorting, classical extrusion using filters to heavly purify PVC',
                    '2) MICRONIZATION: reducing particle size to less than 10 microns using nitrogen and working on the physic of collisions to sort in a cyclonic screen',
                    '3) MINERY TECHNOLOGY: pushing water on a particulary shaped surfacs is possible to sort metals, PVC and rubber. Used in cables only',
                    '4) ELECTROSTATIC: using hamos tables it\'s possible to charge PVC and rubber differently to separate with anodes or cathodes',
                    '5) NIR: optical readers read the polymer light reflection to identity PVC ad sort from other materials'
                  ]
                )}
                onChangeItems={(items) =>
                  syncRegistryItems('q4_4', items, (lines, base) => ({
                    ...base,
                    card4: {
                      ...base.card4,
                      q4_4_technologiesSummary: lines.map((line) => {
                        const colonIdx = line.indexOf(':');
                        if (colonIdx !== -1) {
                          return {
                            name: line.slice(0, colonIdx).trim(),
                            description: line.slice(colonIdx + 1).trim()
                          };
                        }
                        return { name: line.trim(), description: '' };
                      })
                    }
                  }))
                }
                addPlaceholder="Add another recycling technology description for Q4.4..."
              />
            )}

            {/* Q 4.5 — Quality, Impurities & Price per Stream (Multiselect matching R11-R12) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.5')) && (
              <MultiselectQuestionBlock
                questionCode="Q 4.5"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="4.5. Regarding the quality of the recycled PVC waste or PVC recyclate:"
                    items={[
                      {
                        badge: '(i)',
                        text: 'What is the typical quality/chemical composition of this waste in the country? What are the main undesirable/legacy impurities and their respective concentrations in this sorted and pretreated PVC waste? Where possible, please report these qualities against the PVC waste source they initially relate to.'
                      },
                      {
                        badge: '(ii)',
                        text: 'What is the price of each quality level for such waste in the country?'
                      }
                    ]}
                  />
                }
                items={getRegistryItems(
                  'q4_5',
                  dataset.card4.q4_5_qualityAndPricingByStream.map(
                    (s) => `${s.stream}: ${s.impurityRule} | market ${s.priceRange}`
                  ),
                  dataset.card4.q4_5_qualityAndPricingByStream.map(
                    (s) => `${s.stream}: ${s.impurityRule} | market ${s.priceRange}`
                  )
                )}
                onChangeItems={(items) =>
                  syncRegistryItems('q4_5', items, (_lines, base) => base)
                }
                addPlaceholder="Add another quality/impurity & price line for Q4.5..."
              />
            )}

            {/* Q 4.6 — Input into Recycling per Recycling Technology (R13–R19 of Source Sheet) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.6')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 4.6 • Input into Recycling per Technology (t/a)
                    </span>
                    <label className="block text-sm font-extrabold text-slate-900 mt-1">
                      4.6. What quantity (in tonnes per year) of each type of post-consumer PVC waste is recycled in the country per recycling technology (input into recycling)?
                    </label>
                  </div>
                  <button
                    onClick={addQ4_6Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Recycling Input Row (Q4.6)</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Post-consumer PVC waste type</th>
                        <th className="py-2.5 px-3 font-bold">Type of PVC</th>
                        <th className="py-2.5 px-3 font-bold">Recycling technique or technology</th>
                        <th className="py-2.5 px-3 font-bold">Description of technique or technology</th>
                        <th className="py-2.5 px-3 font-bold text-right">Quantity recycled per technique (t/a)</th>
                        <th className="py-2.5 px-3 font-bold">Output of recycling technique</th>
                        <th className="py-2.5 px-3 font-bold">Typical quality / chemical composition</th>
                        <th className="py-2.5 px-3 font-bold">Main undesirable/legacy impurities & concentrations</th>
                        <th className="py-2.5 px-3 font-bold text-right">Price of recycled material (EUR/t)</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card4.q4_6_recyclingByTech.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={r.wasteType}
                              onChange={(e) => updateQ4_6Row(r.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={r.pvcType}
                              onChange={(e) => updateQ4_6Row(r.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={r.technologyCategory}
                              onChange={(e) => updateQ4_6Row(r.id, 'technologyCategory', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={r.automationOrSubTech}
                              onChange={(e) => updateQ4_6Row(r.id, 'automationOrSubTech', e.target.value)}
                              className="w-full font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={r.inputOrOutputTonnes ?? 0}
                              onChange={(e) => updateQ4_6Row(r.id, 'inputOrOutputTonnes', e.target.value)}
                              className="w-24 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={r.outputForm}
                              onChange={(e) => updateQ4_6Row(r.id, 'outputForm', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={r.typicalQuality}
                              onChange={(e) => updateQ4_6Row(r.id, 'typicalQuality', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={r.mainImpurities}
                              onChange={(e) => updateQ4_6Row(r.id, 'mainImpurities', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="text"
                              value={r.priceEurPerTon}
                              onChange={(e) => updateQ4_6Row(r.id, 'priceEurPerTon', e.target.value)}
                              className="w-32 text-right font-mono font-bold text-recovinyl-greenDark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ4_6Row(r.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 4.7 — Output of Recycling: PVC Recyclate Produced (R20–R26 of Source Sheet) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.7')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 4.7 • PVC Recyclate Produced — Output of Recycling (t/a)
                    </span>
                    <label className="block text-sm font-extrabold text-slate-900 mt-1">
                      4.7. What quantity (in tonnes per year) of PVC Recyclate is produced in the country per type of PVC waste, recycling technology and resulting quality/chemical composition (output of recycling)?
                    </label>
                  </div>
                  <button
                    onClick={addQ4_6Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add PVC Recyclate Output Row (Q4.7)</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Post-consumer PVC waste type</th>
                        <th className="py-2.5 px-3 font-bold text-right">Quantity PVC Recyclate per technique or technology (t/a)</th>
                        <th className="py-2.5 px-3 font-bold">Type of PVC</th>
                        <th className="py-2.5 px-3 font-bold">Recycling technique or technology</th>
                        <th className="py-2.5 px-3 font-bold">Typical quality / chemical composition</th>
                        <th className="py-2.5 px-3 font-bold text-right">Price of PVC Recyclate (EUR/t)</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card4.q4_6_recyclingByTech.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={r.wasteType}
                              onChange={(e) => updateQ4_6Row(r.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={r.inputOrOutputTonnes ?? 0}
                              onChange={(e) => updateQ4_6Row(r.id, 'inputOrOutputTonnes', e.target.value)}
                              className="w-28 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={r.pvcType}
                              onChange={(e) => updateQ4_6Row(r.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={r.automationOrSubTech}
                              onChange={(e) => updateQ4_6Row(r.id, 'automationOrSubTech', e.target.value)}
                              className="w-full font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={r.typicalQuality}
                              onChange={(e) => updateQ4_6Row(r.id, 'typicalQuality', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="text"
                              value={r.priceEurPerTon}
                              onChange={(e) => updateQ4_6Row(r.id, 'priceEurPerTon', e.target.value)}
                              className="w-32 text-right font-mono font-bold text-recovinyl-greenDark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ4_6Row(r.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 4.8 — Facilities or Entities Converting PVC Recyclate (R27–R36 of Source Sheet) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.8')) && (() => {
              const convertingFacilities = dataset.facilities.filter((f) => f.questionRef === '4.8');
              return (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                          Q 4.8 • Facilities or Entities Converting PVC Recyclate
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-greenLight border border-recovinyl-green/40 text-recovinyl-greenDark text-[11px] font-extrabold">
                          {convertingFacilities.length} facilities in {dataset.countryName}
                        </span>
                      </div>
                      <MultiLevelQuestionTitle
                        main="4.8. Facilities or entities converting PVC recyclate in the country:"
                        items={[
                          {
                            badge: '(i)',
                            text: 'How many facilities or entities converting PVC recyclate are established in the country?'
                          },
                          {
                            badge: '(ii)',
                            text: 'What is their typical size (number of employees, turnover, etc.)?'
                          }
                        ]}
                      />
                    </div>
                    <button
                      onClick={addQ4_8Facility}
                      className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Facility or Entity (Q4.8)</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-96 overflow-y-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 bg-slate-100 z-10">
                        <tr className="text-slate-700 border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 font-bold">Name of facility or entity</th>
                          <th className="py-2.5 px-3 font-bold">Type of PVC</th>
                          <th className="py-2.5 px-3 font-bold">City</th>
                          <th className="py-2.5 px-3 font-bold">Region</th>
                          <th className="py-2.5 px-3 font-bold">Size information</th>
                          <th className="py-2.5 px-2 text-center font-bold">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {convertingFacilities.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.name}
                                onChange={(e) => updateQ2_5Facility(f.id, 'name', e.target.value)}
                                className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={f.pvcType}
                                onChange={(e) => updateQ2_5Facility(f.id, 'pvcType', e.target.value as PvcType)}
                                className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                              >
                                <option value="Flexible PVC">Flexible PVC</option>
                                <option value="Rigid PVC">Rigid PVC</option>
                                <option value="Both">Both</option>
                                <option value="Unknown">Unknown</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.city}
                                onChange={(e) => updateQ2_5Facility(f.id, 'city', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.regionOrProvince}
                                onChange={(e) => updateQ2_5Facility(f.id, 'regionOrProvince', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.sizeRaw}
                                onChange={(e) => updateQ2_5Facility(f.id, 'sizeRaw', e.target.value)}
                                className="w-full font-mono px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => deleteQ2_5Facility(f.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Q 4.9 — Multiselect selectable item lines: Domestic Converting vs Export (R37 of Source Sheet) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.9')) && (
              <MultiselectQuestionBlock
                questionCode="Q 4.9"
                questionTitle="4.9. Is further converting of PVC recyclate taking place in the country or are the PVC recyclates exported for converting to another country?"
                items={getRegistryItems('q4_9', dataset.card4.q4_9_exportStatus, [
                  'Uptake/Conversion in the country'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q4_9', items, (lines, base) => ({
                    ...base,
                    card4: { ...base.card4, q4_9_exportStatus: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another domestic conversion or export status line for Q4.9..."
              />
            )}

            {/* Q 4.10 — Exported as Waste vs End of Waste / Product (R38–R48 of Source Sheet) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.10')) && (
              <MultiselectQuestionBlock
                questionCode="Q 4.10"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="4.10. If the PVC recyclate is exported, is it exported as a waste, or an end of waste or product?"
                    items={[
                      {
                        badge: '(i)',
                        text: 'If it is exported as a waste:',
                        subItems: [
                          {
                            badge: 'a.',
                            text: 'Which waste code(s) (European List of Waste or Basel Convention) is used for the export, and'
                          },
                          {
                            badge: 'b.',
                            text: 'To which country(ies) within and outside of Europe do exports take place?'
                          }
                        ]
                      },
                      {
                        badge: '(ii)',
                        text: 'If it is exported as an end of waste or product:',
                        subItems: [
                          {
                            badge: 'a.',
                            text: 'What end of waste criteria apply,'
                          },
                          {
                            badge: 'b.',
                            text: 'Does the PVC recyclate require a REACH registration or other similar requirement, and'
                          },
                          {
                            badge: 'c.',
                            text: 'To which country(ies) in and outside of Europe do exports take place?'
                          }
                        ]
                      }
                    ]}
                  />
                }
                items={getRegistryItems('q4_10', dataset.card4.q4_10_exportNotes, [
                  'Demo note: most recyclate uptake is modelled as domestic conversion in this sample.',
                  'Demo note: detailed downstream customer lists are not included in the public demo dataset.'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q4_10', items, (lines, base) => ({
                    ...base,
                    card4: { ...base.card4, q4_10_exportNotes: lines }
                  }))
                }
                addPlaceholder="Add another export waste code / End-of-Waste / REACH note for Q4.10..."
              />
            )}

            {/* Q 4.11 — Uptake for Converting vs Not Taken Up (R49–R56 of Source Sheet) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.11')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 4.11 • PVC Recyclate Uptake for Converting & Unconverted Fate (t/a)
                    </span>
                    <MultiLevelQuestionTitle
                      main="4.11. Whether in the country or in the country where the PVC recyclate is exported:"
                      items={[
                        {
                          badge: '(i)',
                          text: 'What quantity (in tonnes per year) of the PVC recyclate is taken up for converting and for which applications?'
                        },
                        {
                          badge: '(ii)',
                          text: 'What quantity (in tonnes per year) is not taken up for converting, for what reason, and what is its fate (e.g., stock, incineration, landfilling, other)?'
                        }
                      ]}
                    />
                  </div>
                  <button
                    onClick={addQ4_11Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Uptake Application Stream (Q4.11)</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Post-consumer PVC waste type</th>
                        <th className="py-2.5 px-3 font-bold">Uptake/Conversion in the country or outside?</th>
                        <th className="py-2.5 px-3 font-bold">Type of PVC</th>
                        <th className="py-2.5 px-3 font-bold text-right">Total quantity (t/a)</th>
                        <th className="py-2.5 px-3 font-bold">i. Product PVC recyclate is taken up/converted into & Quantity (t/a)</th>
                        <th className="py-2.5 px-3 font-bold">ii. If not taken up/converted into any product describe reason and/or fate</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card4.q4_11_uptake.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={u.wasteType}
                              onChange={(e) => updateQ4_11Row(u.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={u.location}
                              onChange={(e) => updateQ4_11Row(u.id, 'location', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={u.pvcType}
                              onChange={(e) => updateQ4_11Row(u.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={u.totalQuantityTonnes}
                              onChange={(e) => updateQ4_11Row(u.id, 'totalQuantityTonnes', e.target.value)}
                              className="w-28 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={u.products.map((p) => `${p.product}: ${p.tonnes}`).join('; ')}
                              onChange={(e) => updateQ4_11Row(u.id, 'productsText', e.target.value)}
                              className="w-full font-mono text-[11px] px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={u.unconvertedReasonOrFate}
                              onChange={(e) => updateQ4_11Row(u.id, 'unconvertedReasonOrFate', e.target.value)}
                              className="w-full text-slate-600 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ4_11Row(u.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 4.12 — Main Stakeholders Involved in Recycling (R57–R59 of Source Sheet) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.12')) && (() => {
              const stakeholders = getQ4_12Stakeholders();
              return (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                        Q 4.12 • Stakeholders Involved in PVC Recycling
                      </span>
                      <MultiLevelQuestionTitle
                        main="4.12. Main stakeholders involved in the recycling of rigid and flexible post-consumer PVC waste in the country:"
                        items={[
                          {
                            badge: '(i)',
                            text: 'Who are the main stakeholders involved in the recycling of rigid and flexible post-consumer PVC waste in the country?'
                          },
                          {
                            badge: '(ii)',
                            text: 'Please provide names, affiliations, websites and contact details as much as possible.'
                          }
                        ]}
                      />
                    </div>
                    <button
                      onClick={() =>
                        syncQ4_12Stakeholders([
                          ...stakeholders,
                          {
                            id: `st412-${Date.now()}`,
                            questionRef: '4.12',
                            name: 'NEW RECYCLING STAKEHOLDER',
                            affiliation: 'Industry Association / Certifier',
                            website: 'www.',
                            city: 'Milano / Roma',
                            contact: 'info@'
                          }
                        ])
                      }
                      className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stakeholder (Q4.12)</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 font-bold">Stakeholder name</th>
                          <th className="py-2.5 px-3 font-bold">Affiliation</th>
                          <th className="py-2.5 px-3 font-bold">Website</th>
                          <th className="py-2.5 px-3 font-bold">City</th>
                          <th className="py-2.5 px-3 font-bold">Contact details</th>
                          <th className="py-2.5 px-2 text-center font-bold">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {stakeholders.map((st) => (
                          <tr key={st.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.name}
                                onChange={(e) =>
                                  syncQ4_12Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, name: e.target.value } : s))
                                  )
                                }
                                className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.affiliation}
                                onChange={(e) =>
                                  syncQ4_12Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, affiliation: e.target.value } : s))
                                  )
                                }
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.website}
                                onChange={(e) =>
                                  syncQ4_12Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, website: e.target.value } : s))
                                  )
                                }
                                className="w-full text-recovinyl-blue font-semibold px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.city}
                                onChange={(e) =>
                                  syncQ4_12Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, city: e.target.value } : s))
                                  )
                                }
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={st.contact}
                                onChange={(e) =>
                                  syncQ4_12Stakeholders(
                                    stakeholders.map((s) => (s.id === st.id ? { ...s, contact: e.target.value } : s))
                                  )
                                }
                                className="w-full font-mono px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => syncQ4_12Stakeholders(stakeholders.filter((s) => s.id !== st.id))}
                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Q 4.13 — Economic Costs Associated with PVC Recycling (R60–R73 of Source Sheet) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('4.13')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 4.13 • Economic Costs of PVC Recycling (EUR)
                    </span>
                    <MultiLevelQuestionTitle
                      main="4.13. Types of (economic) costs associated with the recycling of rigid and flexible post-consumer PVC waste:"
                      items={[
                        {
                          badge: '(i)',
                          text: 'What types of (economic) costs (e.g., operational, gateway, etc., and in euros) are associated with the recycling of rigid and flexible post-consumer PVC waste in the country?'
                        },
                        {
                          badge: '(ii)',
                          text: 'Please quantify such costs (in euros) where possible.'
                        }
                      ]}
                    />
                  </div>
                  <button
                    onClick={addQ4_13Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Recycling Cost Row (Q4.13)</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Type of (economic) cost</th>
                        <th className="py-2.5 px-3 font-bold">Type of PVC</th>
                        <th className="py-2.5 px-3 font-bold">Cost (EUR)</th>
                        <th className="py-2.5 px-3 font-bold">Remarks</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card4.q4_13_costs.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.costType}
                              onChange={(e) => updateQ4_13Row(c.id, 'costType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={c.pvcType}
                              onChange={(e) => updateQ4_13Row(c.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.costDisplay}
                              onChange={(e) => updateQ4_13Row(c.id, 'costDisplay', e.target.value)}
                              className="w-40 font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.remarks ?? ''}
                              onChange={(e) => updateQ4_13Row(c.id, 'remarks', e.target.value)}
                              className="w-full text-slate-600 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ4_13Row(c.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= QUESTION CARD 5: INCINERATION ================= */}
        {activeCard === 5 && (
          <div className="space-y-6 h-auto">
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
                  QUESTION CARD 5 • Track A (Deadline: 15 Jul 2025 • Q 5.1 – 5.9)
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Incineration of Rigid and Flexible Post-Consumer PVC Waste
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-blue text-white text-xs font-extrabold">
                  Total Incinerated: {dataset.card5.totalIncineratedTonnes.toLocaleString()} t/a
                </span>
                <button
                  onClick={() => handleSaveCardToAccount(5)}
                  className="px-4 py-1.5 rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Card 5 to Account</span>
                </button>
              </div>
            </div>

            {/* Q 5.1 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('5.1')) && (
              <MultiselectQuestionBlock
                questionCode="Q 5.1"
                questionTitle="5.1. What general (legal) requirements apply to the incineration of post-consumer plastic waste in the country?"
                items={getRegistryItems('q5_1', dataset.card5.q5_1_generalRequirements, [
                  '1) Legislative Decree No. 152/2006 (Title III-bis Part IV) & Legislative Decree No. 46/2014 transposing EU Industrial Emissions Directive (2010/75/EU — IED) on waste incineration and co-incineration',
                  '2) Best Available Techniques (BAT Conclusions — Commission Implementing Decision EU 2019/2010) mandatory for all Italian Waste-to-Energy (R1) plants',
                  '3) Ministerial Decree 14 February 2013 No. 22 regulating Solid Recovered Fuel (CSS / CSS-Combustibile) co-incineration in cement kilns and power plants'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q5_1', items, (lines, base) => ({
                    ...base,
                    card5: { ...base.card5, q5_1_generalRequirements: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another general plastic incineration legal requirement..."
              />
            )}

            {/* Q 5.2 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('5.2')) && (
              <MultiselectQuestionBlock
                questionCode="Q 5.2"
                questionTitle="5.2. What (legal) requirements or schemes apply more specifically to the incineration of rigid and flexible post-consumer PVC waste in the country?"
                items={getRegistryItems('q5_2', dataset.card5.q5_2_pvcRequirements, [
                  '1) Strict continuous emission limit values (ELVs) for HCl (daily average ≤ 6–8 mg/Nm³ under BAT-AELs), HF, SO2, and PCDD/F (dioxins/furans ≤ 0.06–0.08 ng I-TEQ/Nm³)',
                  '2) Mandatory minimum combustion chamber temperature ≥ 1,100 °C for at least 2 seconds whenever halogenated organic waste contains > 1% chlorine (such as concentrated PVC)',
                  '3) UNI EN ISO 21640 limits on total chlorine content (< 0.5% – 1.0% Cl) in high-grade CSS (Solid Recovered Fuel) for cement kilns, requiring pre-sorting of PVC out of RDF/CSS streams'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q5_2', items, (lines, base) => ({
                    ...base,
                    card5: { ...base.card5, q5_2_pvcRequirements: lines }
                  }))
                }
                addPlaceholder="Add another PVC-specific incineration or chlorine limit requirement..."
              />
            )}

            {/* Q 5.3 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('5.3')) && (
              <MultiselectQuestionBlock
                questionCode="Q 5.3"
                questionTitle="5.3. What incentives exist to discourage the incineration of rigid and flexible post-consumer PVC waste in the country?"
                items={getRegistryItems('q5_3', dataset.card5.q5_3_disincentives, [
                  '1) No incentives exist to promote PVC incineration; waste hierarchy policies prioritize mechanical recycling over thermal treatment',
                  '2) High flue-gas neutralization reagent costs (sodium bicarbonate / lime consumption per tonne of chlorine) act as a direct operational disincentive for WTE operators accepting PVC-rich loads',
                  '3) Cement kilns apply strict chlorine penalties or rejection thresholds on RDF/CSS deliveries exceeding 0.8%–1.0% Cl'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q5_3', items, (lines, base) => ({
                    ...base,
                    card5: { ...base.card5, q5_3_disincentives: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another incineration incentive or disincentive line..."
              />
            )}

            {/* Q 5.4 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('5.4')) && (
              <MultiselectQuestionBlock
                questionCode="Q 5.4"
                questionTitle="5.4. What technology(ies) are used to incinerate rigid and flexible post-consumer PVC waste in the country (e.g., incineration with energy recovery, incineration without energy recovery, etc.; please provide a description of the technology(ies) employed, its emission control and abatement techniques, and the use/fate of resulting ashes, etc.)?"
                items={getRegistryItems('q5_4', dataset.card5.q5_4_technologyNotes, [
                  '1) Moving-grate Waste-to-Energy (WTE R1) boilers with combined heat and power (CHP) recovery and dry/semi-dry sodium bicarbonate (NaHCO3) + activated carbon acid gas scrubbing',
                  '2) Solvay Neutrec® / SolvAir® sodium bicarbonate flue-gas neutralization enabling recovery of residual sodium chloride salts instead of hazardous salt cake disposal',
                  '3) Optical NIR sorting in CSS/RDF preparation plants actively removes PVC to keep chlorine below cement kiln specifications'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q5_4', items, (lines, base) => ({
                    ...base,
                    card5: { ...base.card5, q5_4_technologyNotes: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another incineration technology or flue-gas treatment line..."
              />
            )}

            {/* Q 5.5 — Incinerated PVC Waste Streams & Residues (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('5.5')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 5.5 • Incinerated PVC Quantities & Residues (t/a)
                    </span>
                    <label className="block text-sm font-extrabold text-slate-900 mt-1">
                      5.5. What quantity (in tonnes per year) of each type of rigid and flexible post-consumer PVC waste is incinerated in the country per incineration technology?
                    </label>
                  </div>
                  <button
                    onClick={addQ5_5Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Incinerated Stream</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">PVC Waste Stream</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type</th>
                        <th className="py-2.5 px-3 font-bold">Energy Recovery Type</th>
                        <th className="py-2.5 px-3 font-bold">Flue Gas Reagents</th>
                        <th className="py-2.5 px-3 font-bold text-right">Incinerated (t/a)</th>
                        <th className="py-2.5 px-3 font-bold">Residue Fate</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card5.q5_5_incineratedStreams.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={s.wasteType}
                              onChange={(e) => updateQ5_5Row(s.id, 'wasteType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={s.pvcType}
                              onChange={(e) => updateQ5_5Row(s.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={s.technologyCategory}
                              onChange={(e) => updateQ5_5Row(s.id, 'technologyCategory', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={s.description}
                              onChange={(e) => updateQ5_5Row(s.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={s.inputOrOutputTonnes ?? 0}
                              onChange={(e) => updateQ5_5Row(s.id, 'inputOrOutputTonnes', e.target.value)}
                              className="w-24 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={s.typicalQuality}
                              onChange={(e) => updateQ5_5Row(s.id, 'typicalQuality', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ5_5Row(s.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 5.6 — Multiselect selectable item lines: WTE Facilities */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('5.6')) && (
              <MultiselectQuestionBlock
                questionCode="Q 5.6"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="5.6. Facilities or entities incinerating post-consumer PVC waste in the country:"
                    items={[
                      {
                        badge: '(i)',
                        text: 'How many facilities or entities incinerating post-consumer PVC waste are established in the country?'
                      },
                      {
                        badge: '(ii)',
                        text: 'Please distinguish those incinerating post-consumer PVC waste with and without energy recovery and provide their typical size (number of employees, turnover, etc.)?'
                      }
                    ]}
                  />
                }
                items={getRegistryItems('q5_6', dataset.card5.q5_6_facilitiesNote, [
                  'No facilities voluntarily incinerate separated PVC in Italy. Approximately 55 incinerators process mixed/medical waste containing trace PVC.'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q5_6', items, (lines, base) => ({
                    ...base,
                    card5: { ...base.card5, q5_6_facilitiesNote: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another WTE facility or geographic distribution line for Q5.6..."
              />
            )}

            {/* Q 5.7 — Multiselect selectable item lines: Incineration Stakeholders */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('5.7')) && (
              <MultiselectQuestionBlock
                questionCode="Q 5.7"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="5.7. Main stakeholders involved in the incineration of rigid and flexible post-consumer PVC waste in the country:"
                    items={[
                      {
                        badge: '(i)',
                        text: 'Who are the main stakeholders involved in the incineration of rigid and flexible post-consumer PVC waste in the country?'
                      },
                      {
                        badge: '(ii)',
                        text: 'Please provide names, affiliations, websites and contact details as much as possible.'
                      }
                    ]}
                  />
                }
                items={getRegistryItems('q5_7', dataset.card5.q5_7_stakeholdersNote, [
                  'No stakeholders involved since PVC is not voluntarily incinerated.'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q5_7', items, (lines, base) => ({
                    ...base,
                    card5: { ...base.card5, q5_7_stakeholdersNote: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another incineration / WTE stakeholder line for Q5.7..."
              />
            )}

            {/* Q 5.8 — Multiselect selectable item lines: Economic Costs of Incineration */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('5.8')) && (
              <MultiselectQuestionBlock
                questionCode="Q 5.8"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="5.8. Types of (economic) costs associated with the incineration of rigid and flexible post-consumer PVC waste:"
                    items={[
                      {
                        badge: '(i)',
                        text: 'What types of (economic) costs (e.g., operational, gateway, etc., and in euros) are associated with the incineration of rigid and flexible post-consumer PVC waste in the country?'
                      },
                      {
                        badge: '(ii)',
                        text: 'Please quantify such costs (in euros) where possible.'
                      }
                    ]}
                  />
                }
                items={getRegistryItems('q5_8', dataset.card5.q5_8_costsNote, [
                  '1) Standard municipal/special waste WTE gate fee in Italy ranges from 110 to 165 €/tonne depending on region and calorific value',
                  '2) Additional chemical neutralization & salt residue disposal cost for high-chlorine PVC fractions (approx. +40 to +80 €/tonne of PVC due to stoichiometric NaHCO3 reagent demand and hazardous FGT residue disposal)',
                  '3) Many WTE operators impose contractual caps on PVC content in industrial waste deliveries to avoid boiler tube HCl corrosion'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q5_8', items, (lines, base) => ({
                    ...base,
                    card5: { ...base.card5, q5_8_costsNote: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another incineration gate fee or cost item for Q5.8..."
              />
            )}

            {/* Q 5.9 — Multiselect selectable item lines: Public Concerns & Operational Challenges */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('5.9')) && (
              <MultiselectQuestionBlock
                questionCode="Q 5.9"
                questionTitle="5.9. Has the incineration of plastic or rigid and flexible post-consumer PVC waste in the country been subject to controversial or negative mediatic attention in the last 5 years and what was the concern?"
                items={getRegistryItems('q5_9', dataset.card5.q5_9_publicConcerns, [
                  '1) High local public sensitivity toward new Waste-to-Energy plant permitting (NIMBY debates around dioxin/furan emissions, e.g., Roma Santa Palomba WTE project)',
                  '2) Technical concern from WTE operators regarding HCl high-temperature corrosion of superheater boiler tubes when chlorine load spikes',
                  '3) Strict continuous emissions monitoring (SME / CEMS) published online by operators (A2A, Hera, Iren) demonstrates compliance well below EU BAT-AEL dioxin and HCl limits'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q5_9', items, (lines, base) => ({
                    ...base,
                    card5: { ...base.card5, q5_9_publicConcerns: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another public, media, or operational concern for Q5.9..."
              />
            )}
          </div>
        )}

        {/* ================= QUESTION CARD 6: LANDFILLING ================= */}
        {activeCard === 6 && (
          <div className="space-y-6 h-auto">
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
                  QUESTION CARD 6 • Track A (Deadline: 15 Jul 2025 • Q 6.1 – 6.9)
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Landfilling of Rigid and Flexible Post-Consumer PVC Waste
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-recovinyl-blue text-white text-xs font-extrabold">
                  National Landfilled Estimate (Q6.4): {dataset.card6.q6_4_totalLandfilledEstimateTonnes.toLocaleString()} t/a
                </span>
                <button
                  onClick={() => handleSaveCardToAccount(6)}
                  className="px-4 py-1.5 rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Card 6 to Account</span>
                </button>
              </div>
            </div>

            {/* Q 6.1 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('6.1')) && (
              <MultiselectQuestionBlock
                questionCode="Q 6.1"
                questionTitle="6.1. What general (legal) requirements apply to the landfilling of post-consumer plastic waste in the country?"
                items={getRegistryItems('q6_1', dataset.card6.q6_1_generalRequirements, [
                  '1) Legislative Decree No. 36/2003 (updated by Legislative Decree No. 121/2020 transposing EU Directive 2018/850) — National Landfill Directive framework',
                  '2) Prohibition on landfilling untreated waste and waste with Lower Heating Value (LHV / PCI) > 13,000 kJ/kg unless pre-treated / stabilized via mechanical-biological treatment (MBT)',
                  '3) EU target binding on Member States to reduce municipal waste landfilled to ≤ 10% by weight by 2035',
                  '4) Mandatory waste characterization and leaching tests (UNI EN 12457) prior to acceptance in non-hazardous waste landfills'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q6_1', items, (lines, base) => ({
                    ...base,
                    card6: { ...base.card6, q6_1_generalRequirements: lines }
                  }))
                }
                addPlaceholder="Add another general plastic landfilling legal requirement..."
              />
            )}

            {/* Q 6.2 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('6.2')) && (
              <MultiselectQuestionBlock
                questionCode="Q 6.2"
                questionTitle="6.2. What (legal) requirements or schemes apply more specifically to the landfilling of rigid and flexible post-consumer PVC waste in the country?"
                items={getRegistryItems('q6_2', dataset.card6.q6_2_pvcRequirements, [
                  '1) No specific standalone ban on PVC landfilling exists in Italy; however, pure sorted plastic/PVC has a calorific value > 13,000 kJ/kg and therefore cannot be landfilled directly without prior sorting/treatment',
                  '2) Post-consumer PVC enters non-hazardous landfills primarily as part of mixed C&D demolition debris (17 09 04), bulky waste shredding residues (19 12 12), or MBT rejects',
                  '3) Non-hazardous PVC waste is classified as inert/stable polymer in landfill bodies, though legacy plasticizer leaching and landfill fire prevention rules apply'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q6_2', items, (lines, base) => ({
                    ...base,
                    card6: { ...base.card6, q6_2_pvcRequirements: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another PVC-specific landfilling requirement..."
              />
            )}

            {/* Q 6.3 — Multiselect selectable item lines */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('6.3')) && (
              <MultiselectQuestionBlock
                questionCode="Q 6.3"
                questionTitle="6.3. What incentives exist to discourage the landfilling of rigid and flexible post-consumer PVC waste in the country?"
                items={getRegistryItems('q6_3', dataset.card6.q6_3_disincentives, [
                  '1) Regional Landfill Tax (Ecotassa — Law No. 549/1995 Art. 3) levied per tonne of waste disposed in landfills, ranging from ~5.17 €/t to 25.82 €/t depending on regional separate collection performance',
                  '2) Progressive regional surcharges (+20% penalty on Ecotassa) for municipalities failing statutory separate waste collection targets',
                  '3) Rising landfill gate fees (90 – 190 €/t across Italian regions due to shrinking authorized landfill capacity) increasingly make sorting and mechanical recycling competitive for clean C&D and industrial PVC streams'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q6_3', items, (lines, base) => ({
                    ...base,
                    card6: { ...base.card6, q6_3_disincentives: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another landfill tax or economic disincentive line..."
              />
            )}

            {/* Q 6.4 — National Landfilled Post-Consumer PVC Waste Estimate (t/a) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('6.4')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 6.4 • Total National Landfilled PVC Estimate (t/a)
                    </span>
                    <label className="block text-sm font-extrabold text-slate-900 mt-1">
                      6.4. What quantity (in tonnes per year) of each type of rigid and flexible post-consumer PVC waste is landfilled in the country?
                    </label>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-recovinyl-blue/40 px-4 py-2 rounded-xl shadow-sm">
                    <span className="text-xs font-extrabold text-recovinyl-dark">National Landfilled PVC (t/a):</span>
                    <input
                      type="number"
                      value={dataset.card6.q6_4_totalLandfilledEstimateTonnes}
                      onChange={(e) =>
                        onUpdateAccountDataset({
                          ...dataset,
                          card6: {
                            ...dataset.card6,
                            q6_4_totalLandfilledEstimateTonnes: Math.max(0, Number(e.target.value))
                          }
                        })
                      }
                      className="w-32 text-right font-mono font-black text-sm text-recovinyl-dark px-2 py-1 rounded border border-recovinyl-blue/40"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Q 6.5 — Provincial / Regional Landfilled Quantities Breakdown (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('6.5')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 6.5 • Provincial / Regional Landfilled PVC Quantities (t/a)
                    </span>
                    <label className="block text-sm font-extrabold text-slate-900 mt-1">
                      6.5. Where in the country does landfilling of rigid and flexible post-consumer PVC waste take place?
                    </label>
                  </div>
                  <button
                    onClick={addQ6_5Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Provincial Landfill Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto max-h-96 overflow-y-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-slate-100 z-10">
                      <tr className="border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Province / City / Site</th>
                        <th className="py-2.5 px-3 font-bold">Waste Stream</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type (Rolling Menu)</th>
                        <th className="py-2.5 px-3 font-bold text-right">Landfilled Quantity (t/a)</th>
                        <th className="py-2.5 px-3 font-bold">Remarks</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card6.q6_5_provincialQuantities.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.provinceOrCity}
                              onChange={(e) => updateQ6_5Row(p.id, 'provinceOrCity', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.wasteType}
                              onChange={(e) => updateQ6_5Row(p.id, 'wasteType', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={p.pvcType}
                              onChange={(e) => updateQ6_5Row(p.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={p.quantityTonnes}
                              onChange={(e) => updateQ6_5Row(p.id, 'quantityTonnes', e.target.value)}
                              className="w-28 text-right font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={p.remarks ?? ''}
                              onChange={(e) => updateQ6_5Row(p.id, 'remarks', e.target.value)}
                              className="w-full text-slate-600 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ6_5Row(p.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 6.6 — Landfill Operators & Facilities (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('6.6')) && (() => {
              const landfillFacilities = dataset.facilities.filter((f) => f.questionRef === '6.6');
              return (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                          Q 6.6 • Landfill Operators & Sites
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-greenLight border border-recovinyl-green/40 text-recovinyl-greenDark text-[11px] font-extrabold">
                          {landfillFacilities.length} landfill operators in {dataset.countryName}
                        </span>
                      </div>
                      <MultiLevelQuestionTitle
                        main="6.6. Facilities or entities landfilling post-consumer PVC waste in the country:"
                        items={[
                          {
                            badge: '(i)',
                            text: 'How many facilities or entities landfilling post-consumer PVC waste are established in the country?'
                          },
                          {
                            badge: '(ii)',
                            text: 'Where are these landfills located?'
                          },
                          {
                            badge: '(iii)',
                            text: 'What is their typical size (number of employees, turnover, etc.)?'
                          }
                        ]}
                      />
                    </div>
                    <button
                      onClick={addQ6_6Facility}
                      className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Landfill Operator</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-96 overflow-y-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 bg-slate-100 z-10">
                        <tr className="text-slate-700 border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 font-bold">Landfill Operator / Company</th>
                          <th className="py-2.5 px-3 font-bold">PVC Type (Rolling Menu)</th>
                          <th className="py-2.5 px-3 font-bold">City / Province</th>
                          <th className="py-2.5 px-3 font-bold">Region</th>
                          <th className="py-2.5 px-3 font-bold">Size (Employees & Turnover)</th>
                          <th className="py-2.5 px-2 text-center font-bold">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {landfillFacilities.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.name}
                                onChange={(e) => updateQ2_5Facility(f.id, 'name', e.target.value)}
                                className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={f.pvcType}
                                onChange={(e) => updateQ2_5Facility(f.id, 'pvcType', e.target.value as PvcType)}
                                className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                              >
                                <option value="Flexible PVC">Flexible PVC</option>
                                <option value="Rigid PVC">Rigid PVC</option>
                                <option value="Both">Both</option>
                                <option value="Unknown">Unknown</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.city}
                                onChange={(e) => updateQ2_5Facility(f.id, 'city', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.regionOrProvince}
                                onChange={(e) => updateQ2_5Facility(f.id, 'regionOrProvince', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={f.sizeRaw}
                                onChange={(e) => updateQ2_5Facility(f.id, 'sizeRaw', e.target.value)}
                                className="w-full font-mono px-2 py-1 rounded border border-slate-200"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => deleteQ2_5Facility(f.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* Q 6.7 — Multiselect selectable item lines: Landfill Stakeholders */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('6.7')) && (
              <MultiselectQuestionBlock
                questionCode="Q 6.7"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="6.7. Main stakeholders involved in the landfilling of rigid and flexible post-consumer PVC waste in the country:"
                    items={[
                      {
                        badge: '(i)',
                        text: 'Who are the main stakeholders involved in the landfilling of rigid and flexible post-consumer PVC waste in the country?'
                      },
                      {
                        badge: '(ii)',
                        text: 'Please provide names, affiliations, websites and contact details as much as possible.'
                      }
                    ]}
                  />
                }
                items={getRegistryItems('q6_7', dataset.card6.q6_7_stakeholdersNote, [
                  'No stakeholders specifically advocating or managing PVC landfilling.'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q6_7', items, (lines, base) => ({
                    ...base,
                    card6: { ...base.card6, q6_7_stakeholdersNote: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another landfill stakeholder or authority line for Q6.7..."
              />
            )}

            {/* Q 6.8 — Economic Costs Associated with Landfilling (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('6.8')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 6.8 • Economic Costs of Landfilling (€/t)
                    </span>
                    <MultiLevelQuestionTitle
                      main="6.8. Types of (economic) costs associated with the landfilling of rigid and flexible post-consumer PVC waste:"
                      items={[
                        {
                          badge: '(i)',
                          text: 'What types of (economic) costs (e.g., operational, gateway, etc., and in euros) are associated with the landfilling of rigid and flexible post-consumer PVC waste in the country?'
                        },
                        {
                          badge: '(ii)',
                          text: 'Please quantify such costs (in euros) where possible.'
                        }
                      ]}
                    />
                  </div>
                  <button
                    onClick={addQ6_8Row}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Landfill Cost Row (Q6.8)</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Cost Category / Fee Type</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type (Rolling Menu)</th>
                        <th className="py-2.5 px-3 font-bold">Cost Range / Value (€/t)</th>
                        <th className="py-2.5 px-3 font-bold">Remarks</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card6.q6_8_costs.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.costType}
                              onChange={(e) => updateQ6_8Row(c.id, 'costType', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={c.pvcType}
                              onChange={(e) => updateQ6_8Row(c.id, 'pvcType', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.costDisplay}
                              onChange={(e) => updateQ6_8Row(c.id, 'costDisplay', e.target.value)}
                              className="w-40 font-mono font-bold text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={c.remarks ?? ''}
                              onChange={(e) => updateQ6_8Row(c.id, 'remarks', e.target.value)}
                              className="w-full text-slate-600 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ6_8Row(c.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 6.9 — Multiselect selectable item lines: Public Concerns & Illegal Dumping / Landfill Fires */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('6.9')) && (
              <MultiselectQuestionBlock
                questionCode="Q 6.9"
                questionTitle="6.9. Has the landfilling of plastic or rigid and flexible post-consumer PVC waste in the country been subject to controversial or negative mediatic attention in the last 5 years and what was the concern?"
                items={getRegistryItems('q6_9', dataset.card6.q6_9_publicConcerns, [
                  'No media controversy targeting PVC landfilling specifically; PVC has been affected alongside all other plastics by general anti-plastic public and private campaigns.'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q6_9', items, (lines, base) => ({
                    ...base,
                    card6: { ...base.card6, q6_9_publicConcerns: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another landfill public concern or enforcement note for Q6.9..."
              />
            )}
          </div>
        )}

        {/* ================= QUESTION CARD 7: OVERALL WASTE CHAIN & 2030 OUTLOOK ================= */}
        {activeCard === 7 && (
          <div className="space-y-6 h-auto">
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
                  QUESTION CARD 7 • Track B.2 (Deadline: 15 Sep 2025 • Q 7.1 – 7.7)
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Overall PVC Waste Management Chain, Digital Traceability & 2030 Outlook
                </h3>
              </div>
              <button
                onClick={() => handleSaveCardToAccount(7)}
                className="px-4 py-1.5 rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Card 7 to Account</span>
              </button>
            </div>

            {/* Q 7.1 — Digital Waste Traceability & Registration Tools (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('7.1')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 7.1 • Digital Waste Traceability & Registration Tools
                    </span>
                    <MultiLevelQuestionTitle
                      main="7.1. Waste traceability or tracking registration tools in the country:"
                      items={[
                        {
                          badge: '(i)',
                          text: 'Which types of waste traceability or tracking registration tools exist in the country (e.g., RENTRI, Trackdéchets, eANV, UK Waste Tracking System, and e-SIR)?'
                        },
                        {
                          badge: '(ii)',
                          text: 'Please describe its legislative context, ownership, purpose and main features.'
                        }
                      ]}
                    />
                  </div>
                  <button
                    onClick={addQ7_1Tool}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Traceability Tool</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold">Tool / System Name</th>
                        <th className="py-2.5 px-3 font-bold">Legislation</th>
                        <th className="py-2.5 px-3 font-bold">Entity in Charge</th>
                        <th className="py-2.5 px-3 font-bold">Main Purpose</th>
                        <th className="py-2.5 px-3 font-bold">Relevant Features</th>
                        <th className="py-2.5 px-3 font-bold">Website</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card7.q7_1_traceabilityTools.map((tool, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={tool.name}
                              onChange={(e) => updateQ7_1Tool(idx, 'name', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={tool.legislation}
                              onChange={(e) => updateQ7_1Tool(idx, 'legislation', e.target.value)}
                              className="w-full font-semibold text-recovinyl-dark px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={tool.entityInCharge}
                              onChange={(e) => updateQ7_1Tool(idx, 'entityInCharge', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={tool.mainPurpose}
                              onChange={(e) => updateQ7_1Tool(idx, 'mainPurpose', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={tool.relevantFeatures}
                              onChange={(e) => updateQ7_1Tool(idx, 'relevantFeatures', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={tool.website ?? ''}
                              onChange={(e) => updateQ7_1Tool(idx, 'website', e.target.value)}
                              className="w-full text-recovinyl-blue font-mono px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ7_1Tool(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 7.2 — Multiselect selectable item lines: Geographic Centralization & Export Overview */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('7.2')) && (
              <MultiselectQuestionBlock
                questionCode="Q 7.2"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="7.2. Geographic organization of the PVC waste management chain and exports:"
                    items={[
                      {
                        badge: '(i)',
                        text: 'Is the PVC waste management “chain” centralized or decentralized in the country?'
                      },
                      {
                        badge: '(ii)',
                        text: 'Please describe the general geographic spread of PVC waste management in the country and European or non-European countries rigid and flexible PVC wastes are exported to.'
                      }
                    ]}
                  />
                }
                items={getRegistryItems('q7_2', dataset.card7.q7_2_chainOrganizationAndExport, [
                  'Geographically, rigid PVC recyclers are concentrated in Northern Italy (Lombardia and Veneto), with only one converter/recycler near Rome. Cable recyclers are distributed homogeneously across Central and Northern Italy. Southern Italy has virtually no rigid or flexible PVC recycling plants (only collection/landfill). Exports are intermittent and mainly directed toward North Africa (Morocco, Algeria) plus UK, Turkey, and France in limited quantities.'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q7_2', items, (lines, base) => ({
                    ...base,
                    card7: { ...base.card7, q7_2_chainOrganizationAndExport: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another chain organization or import/export observation for Q7.2..."
              />
            )}

            {/* Q 7.3 — Top 5 Recycling Obstacles & Mitigations (Editable Table) */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('7.3')) && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 h-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-recovinyl-blue text-white text-[11px] font-extrabold">
                      Q 7.3 • Top 5 Obstacles to Post-Consumer PVC Recycling & Mitigations
                    </span>
                    <MultiLevelQuestionTitle
                      main="7.3. Top 5 obstacles preventing or making the recycling of rigid and flexible post-consumer PVC waste difficult:"
                      items={[
                        {
                          badge: '(i)',
                          text: 'What is the top 5 of the obstacles which prevent or make the recycling of rigid and flexible post-consumer PVC waste difficult?'
                        },
                        {
                          badge: '(ii)',
                          text: 'Please provide them in order of importance and suggest possible consumer/social, regulatory, technological and/or financial solutions to address these.'
                        }
                      ]}
                    />
                  </div>
                  <button
                    onClick={addQ7_3Obstacle}
                    className="px-3 py-1.5 rounded-lg bg-recovinyl-blue hover:bg-recovinyl-dark text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Obstacle Row</span>
                  </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase">
                        <th className="py-2.5 px-3 font-bold w-16">Rank</th>
                        <th className="py-2.5 px-3 font-bold">Main Obstacle Description</th>
                        <th className="py-2.5 px-3 font-bold">PVC Type Affected</th>
                        <th className="py-2.5 px-3 font-bold">Proposed Mitigation / Action</th>
                        <th className="py-2.5 px-2 text-center font-bold">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dataset.card7.q7_3_topObstacles.map((o, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={o.rank}
                              onChange={(e) => updateQ7_3Obstacle(idx, 'rank', e.target.value)}
                              className="w-14 text-center font-mono font-black text-recovinyl-dark px-2 py-1 rounded border border-slate-300"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={o.obstacle}
                              onChange={(e) => updateQ7_3Obstacle(idx, 'obstacle', e.target.value)}
                              className="w-full font-bold text-slate-900 px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={o.pvcTypeAffected}
                              onChange={(e) => updateQ7_3Obstacle(idx, 'pvcTypeAffected', e.target.value as PvcType)}
                              className="px-2 py-1 rounded border border-slate-300 bg-white font-semibold"
                            >
                              <option value="Flexible PVC">Flexible PVC</option>
                              <option value="Rigid PVC">Rigid PVC</option>
                              <option value="Both">Both</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={o.mitigation}
                              onChange={(e) => updateQ7_3Obstacle(idx, 'mitigation', e.target.value)}
                              className="w-full text-recovinyl-greenDark px-2 py-1 rounded border border-slate-200"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => deleteQ7_3Obstacle(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Q 7.4 — Multiselect selectable item lines: Voluntary Initiatives */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('7.4')) && (
              <MultiselectQuestionBlock
                questionCode="Q 7.4"
                questionTitle="7.4. What PVC waste management voluntary initiatives and projects exist in the country and what role could Recovinyl and VinylPlus possibly play to support and reinforce these?"
                items={getRegistryItems('q7_4', dataset.card7.q7_4_voluntaryInitiatives, [
                  'No standalone voluntary initiatives outside WREP (Waste Recycling Project by PVC Forum Italia / VinylPlus Italia with Veritas & Etra). Recovinyl and VinylPlus can expand regional municipal utility partnerships modeled on WREP.'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q7_4', items, (lines, base) => ({
                    ...base,
                    card7: { ...base.card7, q7_4_voluntaryInitiatives: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another voluntary initiative or support measure for Q7.4..."
              />
            )}

            {/* Q 7.5 — Multiselect selectable item lines: General Chain Improvements */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('7.5')) && (
              <MultiselectQuestionBlock
                questionCode="Q 7.5"
                questionTitle="7.5. What general improvements could be brought to the PVC waste management in the country and Europe more generally?"
                items={getRegistryItems('q7_5', dataset.card7.q7_5_generalImprovements, [
                  'Demo suggestion: strengthen EU secondary markets for sorted PVC and recyclate, and train collection/sorting staff on the value of separating PVC versus landfilling (illustrative landfill burden ranges are synthetic in this demo).'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q7_5', items, (lines, base) => ({
                    ...base,
                    card7: { ...base.card7, q7_5_generalImprovements: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another general chain improvement for Q7.5..."
              />
            )}

            {/* Q 7.6 — Multiselect selectable item lines: Key Sources & Contacts */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('7.6')) && (
              <MultiselectQuestionBlock
                questionCode="Q 7.6"
                questionTitle={
                  <MultiLevelQuestionTitle
                    main="7.6. Key sources and contacts to help increase PVC waste collection, sorting and pre-treatment, and recycling:"
                    items={[
                      {
                        badge: '(i)',
                        text: 'Who are the key sources and contacts that could inform or help increase PVC waste collection, sorting and pre-treatment, and recycling in the country?'
                      },
                      {
                        badge: '(ii)',
                        text: 'Please provide names, affiliations, websites and contact details as much as possible.'
                      }
                    ]}
                  />
                }
                items={getRegistryItems('q7_6', dataset.card7.q7_6_keySourcesContacts, [
                  'Demo sources: fictional municipal and multi-utility collectors listed in Question Cards 2–3, coordinated via the Demo National PVC Network — Italy (rrr.it@pcwi-demo.example).'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q7_6', items, (lines, base) => ({
                    ...base,
                    card7: { ...base.card7, q7_6_keySourcesContacts: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another information source or contact for Q7.6..."
              />
            )}

            {/* Q 7.7 — Multiselect selectable item lines: Future Trends & 2030 Circularity Outlook */}
            {(selectedQuestionIds.length === 0 || selectedQuestionIds.includes('7.7')) && (
              <MultiselectQuestionBlock
                questionCode="Q 7.7"
                questionTitle="7.7. What are the trends or future outlook by 2030 regarding PVC recycling and PVC circularity in the country?"
                items={getRegistryItems('q7_7', dataset.card7.q7_7_outlook2030, [
                  'Before 2030, mandatory Extended Producer Responsibility (EPR) for Building & Construction will be introduced in Italy. Collected PVC quantities are expected to DOUBLE compared to current levels, though sorting quality challenges will intensify. Simultaneously, Italy’s PNRR (National Recovery & Resilience Plan) and green building transition are accelerating replacement of obsolete wood windows with PVC profiles, expanding future circularity feedstock.'
                ])}
                onChangeItems={(items) =>
                  syncRegistryItems('q7_7', items, (lines, base) => ({
                    ...base,
                    card7: { ...base.card7, q7_7_outlook2030: lines.join('\n') }
                  }))
                }
                addPlaceholder="Add another 2030 outlook or future trend line for Q7.7..."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

