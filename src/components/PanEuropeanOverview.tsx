import React, { useState } from 'react';
import { getLiveEuropeanCountriesSummary, EuropeanCountrySummary } from '../data/europeanCountries';
import { ACRONYMS_AND_DEFINITIONS, PROJECT_TIMELINE_MILESTONES } from '../data/italy2025';
import { ProviderAccount } from '../types';
import {
  Globe,
  Calendar,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Search
} from 'lucide-react';

interface Props {
  selectedCountryCode: string;
  onSelectCountry: (code: string) => void;
  accounts?: ProviderAccount[];
}

export const PanEuropeanOverview: React.FC<Props> = ({ selectedCountryCode, onSelectCountry, accounts }) => {
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  const liveCountries = getLiveEuropeanCountriesSummary(accounts || []);
  const filteredCountries = liveCountries.filter((c) =>
    regionFilter === 'ALL' ? true : c.regionGroup === regionFilter
  );

  const euTotals = filteredCountries.reduce(
    (acc, c) => ({
      generated: acc.generated + c.generatedTonnes,
      collected: acc.collected + c.collectedTonnes,
      recycled: acc.recycled + c.recycledTonnes,
      incinerated: acc.incinerated + c.incineratedTonnes,
      landfilled: acc.landfilled + c.landfilledTonnes,
      recoTrace: acc.recoTrace + c.recoTrace2024OutputTonnes
    }),
    { generated: 0, collected: 0, recycled: 0, incinerated: 0, landfilled: 0, recoTrace: 0 }
  );

  const getTrackBadge = (status: EuropeanCountrySummary['trackA']) => {
    if (status === 'Completed')
      return 'bg-recovinyl-greenLight text-recovinyl-greenDark border-recovinyl-green/40';
    if (status === 'Draft Submitted')
      return 'bg-recovinyl-light text-recovinyl-dark border-recovinyl-blue/30';
    if (status === 'In Progress')
      return 'bg-recovinyl-blue/10 text-recovinyl-blue border-recovinyl-blue/25';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const filteredGlossary = ACRONYMS_AND_DEFINITIONS.filter(
    (item) =>
      !glossarySearch.trim() ||
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* European Executive Rollup Banner */}
      <div className="bg-gradient-to-r from-recovinyl-dark via-recovinyl-blue to-recovinyl-dark rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/15">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-recovinyl-green text-slate-950 text-xs font-extrabold uppercase">
              EU27 + UK, NO, CH • Pan-European Follow-Up
            </span>
            <h2 className="text-xl font-extrabold mt-1">
              European Post-Consumer PVC Waste Information (PCWI) Campaign Matrix
            </h2>
            <p className="text-xs text-recovinyl-light mt-0.5">
              Aggregating national submissions from Recovinyl Regional Representatives (RRRs) & the ECVM PVC Network across Track A, Track B.1, and Track B.2.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['ALL', 'Western Europe', 'Southern Europe', 'Central & Eastern Europe', 'Northern Europe'] as const).map(
              (reg) => (
                <button
                  key={reg}
                  onClick={() => setRegionFilter(reg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    regionFilter === reg
                      ? 'bg-white text-recovinyl-dark shadow'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  {reg === 'ALL' ? 'All Europe (12 Countries)' : reg}
                </button>
              )
            )}
          </div>
        </div>

        {/* Aggregated European KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4">
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
            <div className="text-[10px] font-bold uppercase text-recovinyl-light">PC Generated (Q1.2)</div>
            <div className="text-xl font-black mt-0.5">{euTotals.generated.toLocaleString()} t</div>
            <div className="text-[11px] text-recovinyl-light">Across {filteredCountries.length} countries</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
            <div className="text-[10px] font-bold uppercase text-recovinyl-light">PC Collected (Q2.4)</div>
            <div className="text-xl font-black text-white mt-0.5">{euTotals.collected.toLocaleString()} t</div>
            <div className="text-[11px] text-recovinyl-light">
              {((euTotals.collected / euTotals.generated) * 100).toFixed(1)}% capture rate
            </div>
          </div>
          <div className="bg-recovinyl-green/20 rounded-xl p-3.5 border border-recovinyl-green/40">
            <div className="text-[10px] font-bold uppercase text-recovinyl-greenLight">PC Recycled (Q4.6)</div>
            <div className="text-xl font-black text-recovinyl-green mt-0.5">{euTotals.recycled.toLocaleString()} t</div>
            <div className="text-[11px] text-recovinyl-light">
              {((euTotals.recycled / euTotals.generated) * 100).toFixed(1)}% of generated
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
            <div className="text-[10px] font-bold uppercase text-recovinyl-light">PC Incinerated (Q5.5)</div>
            <div className="text-xl font-black text-white mt-0.5">{euTotals.incinerated.toLocaleString()} t</div>
            <div className="text-[11px] text-recovinyl-light">
              {((euTotals.incinerated / euTotals.generated) * 100).toFixed(1)}% WtE share
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/25">
            <div className="text-[10px] font-bold uppercase text-recovinyl-light">PC Landfilled (Q6.4)</div>
            <div className="text-xl font-black text-white mt-0.5">{euTotals.landfilled.toLocaleString()} t</div>
            <div className="text-[11px] text-recovinyl-light">
              {((euTotals.landfilled / euTotals.generated) * 100).toFixed(1)}% landfill diversion target
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/15">
            <div className="text-[10px] font-bold uppercase text-recovinyl-light">RecoTrace Output</div>
            <div className="text-xl font-black text-recovinyl-green mt-0.5">{euTotals.recoTrace.toLocaleString()} t</div>
            <div className="text-[11px] text-recovinyl-light">Pre- + Post-consumer rPVC</div>
          </div>
        </div>
      </div>

      {/* Country-by-Country Track Status & Mass Balance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
              RRR Submission Tracker & Cross-Country Benchmark
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              European Countries — Track A / B.1 / B.2 Status, Traceability Systems & Tonnages (t/a)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click <b>Italy</b>, <b>Germany</b>, or <b>France</b> to load their full interactive country model
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase text-slate-700">
                <th className="py-2.5 px-3 font-bold">Country & RRR Lead</th>
                <th className="py-2.5 px-3 font-bold">National Traceability (Q7.1)</th>
                <th className="py-2.5 px-3 font-bold">Track A (Cards 1,2,4,5,6)</th>
                <th className="py-2.5 px-3 font-bold">Track B.1 (Card 3)</th>
                <th className="py-2.5 px-3 font-bold">Track B.2 (Card 7)</th>
                <th className="py-2.5 px-3 font-bold text-right">Generated (t)</th>
                <th className="py-2.5 px-3 font-bold text-right">Collected (t)</th>
                <th className="py-2.5 px-3 font-bold text-right">Recycled (t)</th>
                <th className="py-2.5 px-3 font-bold text-right">Landfilled (t)</th>
                <th className="py-2.5 px-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountryCode;
                return (
                  <tr
                    key={c.code}
                    className={`transition ${
                      isSelected ? 'bg-recovinyl-light/80' : 'hover:bg-slate-50'
                    }`}
                  >
                    <th scope="row" className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.flag}</span>
                        <div>
                          <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>{c.name}</span>
                            {c.code === 'IT' && (
                              <span className="px-1.5 py-0.2 rounded bg-recovinyl-green text-slate-950 text-[10px] font-black">
                                FLAGSHIP
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal">{c.rrrLead}</div>
                        </div>
                      </div>
                    </th>
                    <td className="py-3 px-3 font-medium text-slate-700">{c.traceabilityTool}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${getTrackBadge(c.trackA)}`}>
                        {c.trackA}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${getTrackBadge(c.trackB1)}`}>
                        {c.trackB1}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${getTrackBadge(c.trackB2)}`}>
                        {c.trackB2}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {c.generatedTonnes.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-recovinyl-blue font-semibold">
                      {c.collectedTonnes.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-recovinyl-greenDark font-bold">
                      {c.recycledTonnes.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-recovinyl-dark font-bold">
                      {c.landfilledTonnes.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {c.hasFullDataset ? (
                        <button
                          onClick={() => onSelectCountry(c.code)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition ${
                            isSelected
                              ? 'bg-recovinyl-dark text-white'
                              : 'bg-recovinyl-blue text-white hover:bg-recovinyl-dark'
                          }`}
                        >
                          <span>{isSelected ? 'Active' : 'Inspect'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Summary Only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Split: Official Project Timeline (Sheet 2) & Acronyms/Definitions Glossary (Sheet 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline & Checkpoint Schedule */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
                Campaign Governance • Project Schedule
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                Official 2025 Project Timeline & Checkpoint Call Schedule
              </h3>
            </div>
            <Calendar className="w-5 h-5 text-recovinyl-blue" />
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {PROJECT_TIMELINE_MILESTONES.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-recovinyl-dark text-white font-mono font-bold text-[11px] shrink-0 min-w-[92px] text-center">
                    {m.date}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{m.milestone}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Responsible: <b>{m.owner}</b> • {m.track}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-recovinyl-greenLight text-recovinyl-greenDark text-[10px] font-bold shrink-0">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Acronyms & Definitions Glossary */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-greenDark">
                Standardized Methodology & Terminology
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                Official Recovinyl / VinylPlus Acronyms & Definitions
              </h3>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="Filter definitions..."
                className="pl-8 pr-3 py-1 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-recovinyl-blue"
              />
            </div>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredGlossary.map((item) => (
              <div key={item.term} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-slate-900">{item.term}</span>
                  <span className="px-2 py-0.5 rounded bg-recovinyl-light text-recovinyl-dark text-[10px] font-bold">
                    {item.category}
                  </span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
