import React, { useState, useMemo } from 'react';
import { CountryPCWIDataset, FacilityEntity, PvcType } from '../types';
import {
  MapPin,
  Search,
  Building2,
  Users,
  Euro,
  Filter,
  ArrowUpDown,
  Layers,
  Trash2
} from 'lucide-react';

interface Props {
  dataset: CountryPCWIDataset;
}

type StageFilter = 'ALL' | 'Collection' | 'Sorting & Pretreatment' | 'Converting (rPVC)' | 'Landfill Operator';

// Projection helper mapping geographic coordinates into a 520x600 SVG canvas
function projectLatLng(lat: number, lng: number, isItaly: boolean): { x: number; y: number } {
  const minLng = isItaly ? 6.4 : -5.5;
  const maxLng = isItaly ? 18.8 : 22.0;
  const minLat = isItaly ? 36.3 : 36.0;
  const maxLat = isItaly ? 47.2 : 56.5;
  const width = 520;
  const height = 600;
  const padX = 45;
  const padY = 35;

  const clampedLng = Math.max(minLng, Math.min(maxLng, lng));
  const clampedLat = Math.max(minLat, Math.min(maxLat, lat));
  const x = padX + ((clampedLng - minLng) / (maxLng - minLng)) * (width - padX * 2);
  const y = height - padY - ((clampedLat - minLat) / (maxLat - minLat)) * (height - padY * 2);
  return { x, y };
}

export const FacilityMapAndDirectory: React.FC<Props> = ({ dataset }) => {
  const isItaly = dataset.countryCode === 'IT';
  const [stageFilter, setStageFilter] = useState<StageFilter>('ALL');
  const [pvcFilter, setPvcFilter] = useState<'ALL' | PvcType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'employees' | 'turnover' | 'city'>('turnover');
  const [selectedFacility, setSelectedFacility] = useState<FacilityEntity | null>(
    dataset.facilities[0] || null
  );
  const [showProvincialLandfillBubbles, setShowProvincialLandfillBubbles] = useState<boolean>(true);

  const filteredFacilities = useMemo(() => {
    return dataset.facilities
      .filter((f) => (stageFilter === 'ALL' ? true : f.stage === stageFilter))
      .filter((f) => (pvcFilter === 'ALL' ? true : f.pvcType === pvcFilter))
      .filter((f) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q) ||
          f.regionOrProvince.toLowerCase().includes(q) ||
          f.stage.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'city') return a.city.localeCompare(b.city);
        if (sortBy === 'employees') return (b.employees ?? -1) - (a.employees ?? -1);
        return (b.turnoverEurMillions ?? -1) - (a.turnoverEurMillions ?? -1);
      });
  }, [dataset.facilities, stageFilter, pvcFilter, searchQuery, sortBy]);

  const totalEmployeesMapped = useMemo(
    () => filteredFacilities.reduce((acc, f) => acc + (f.employees ?? 0), 0),
    [filteredFacilities]
  );

  const totalTurnoverMapped = useMemo(
    () => filteredFacilities.reduce((acc, f) => acc + (f.turnoverEurMillions ?? 0), 0),
    [filteredFacilities]
  );

  const stageCounts = useMemo(() => {
    const counts = {
      ALL: dataset.facilities.length,
      Collection: 0,
      'Sorting & Pretreatment': 0,
      'Converting (rPVC)': 0,
      'Landfill Operator': 0
    };
    dataset.facilities.forEach((f) => {
      counts[f.stage] = (counts[f.stage] || 0) + 1;
    });
    return counts;
  }, [dataset.facilities]);

  const getPinColor = (pvcType: PvcType) => {
    // Unified Recovinyl Palette (Blue = Rigid PVC, Green = Flexible PVC, Dark Blue = Both)
    if (pvcType === 'Rigid PVC') return { fill: '#006eb6', stroke: '#004b7c', label: 'Rigid PVC' };
    if (pvcType === 'Flexible PVC') return { fill: '#84bd3a', stroke: '#639324', label: 'Flexible PVC' };
    return { fill: '#004b7c', stroke: '#0f172a', label: 'Both (Rigid & Flex)' };
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-recovinyl-blue">
              Slides 12, 15, 20 & 26 • Geospatial Facility Intelligence
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {dataset.flag} {dataset.countryName} — PVC Waste Value Chain Facilities & Landfill Operators
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Complete directory of {dataset.facilities.length} operating companies across Collection (Q2.5), Sorting & Pretreatment (Q3.8), rPVC Converting (Q4.8), and Landfilling (Q6.5/Q6.6).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 text-right">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Filtered Entities</div>
              <div className="text-lg font-black text-slate-900">{filteredFacilities.length} Sites</div>
            </div>
            <div className="bg-recovinyl-light rounded-xl px-4 py-2.5 border border-recovinyl-blue/30 text-right">
              <div className="text-[11px] font-semibold uppercase text-recovinyl-blue">Total Employees</div>
              <div className="text-lg font-black text-recovinyl-dark">{totalEmployeesMapped.toLocaleString()}</div>
            </div>
            <div className="bg-recovinyl-greenLight rounded-xl px-4 py-2.5 border border-recovinyl-green/40 text-right">
              <div className="text-[11px] font-semibold uppercase text-recovinyl-greenDark">Combined Turnover</div>
              <div className="text-lg font-black text-recovinyl-greenDark">€{totalTurnoverMapped.toLocaleString(undefined, { maximumFractionDigits: 1 })}M</div>
            </div>
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'ALL', label: `All Stages (${stageCounts.ALL})` },
                { id: 'Collection', label: `Q2.5 Collection (${stageCounts.Collection})` },
                { id: 'Sorting & Pretreatment', label: `Q3.8 Sorting (${stageCounts['Sorting & Pretreatment']})` },
                { id: 'Converting (rPVC)', label: `Q4.8 Converting rPVC (${stageCounts['Converting (rPVC)']})` },
                { id: 'Landfill Operator', label: `Q6.6 Landfill Operators (${stageCounts['Landfill Operator']})` }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStageFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  stageFilter === tab.id
                    ? 'bg-recovinyl-blue text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'Rigid PVC', 'Flexible PVC', 'Both'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setPvcFilter(type)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                  pvcFilter === type
                    ? 'bg-recovinyl-dark text-white border-recovinyl-dark'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {type === 'ALL' ? 'All PVC Types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split View: Interactive GIS Map (Left) + Selected Facility & Directory Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Map Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-recovinyl-dark to-recovinyl-blue text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-recovinyl-green" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {stageFilter === 'ALL' ? 'All Value Chain Facilities Map' : `${stageFilter} Map`}
              </span>
            </div>
            <label className="flex items-center gap-1.5 text-[11px] text-recovinyl-light cursor-pointer">
              <input
                type="checkbox"
                checked={showProvincialLandfillBubbles}
                onChange={(e) => setShowProvincialLandfillBubbles(e.target.checked)}
                className="rounded border-white/40 text-recovinyl-green focus:ring-0"
              />
              <span>Q6.5 Landfill Volume Heatmap</span>
            </label>
          </div>

          <div className="relative bg-slate-50 p-3 flex flex-col items-center">
            <svg
              viewBox="0 0 520 600"
              className="w-full max-w-[460px] h-auto select-none"
              role="img"
              aria-label="Geospatial Map of Post-Consumer PVC Waste Facilities in Italy"
            >
              {/* Latitude / Longitude Grid Lines */}
              {(isItaly ? [38, 40, 42, 44, 46] : [38, 42, 46, 50, 54]).map((lat) => {
                const { y } = projectLatLng(lat, 12, isItaly);
                return (
                  <g key={`lat-${lat}`}>
                    <line x1={40} y1={y} x2={495} y2={y} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
                    <text x={8} y={y + 4} fontSize={10} fill="#64748b" fontWeight={600}>
                      {lat}°N
                    </text>
                  </g>
                );
              })}
              {(isItaly ? [8, 10, 12, 14, 16, 18] : [-2, 4, 10, 16, 20]).map((lng) => {
                const { x } = projectLatLng(44, lng, isItaly);
                return (
                  <g key={`lng-${lng}`}>
                    <line x1={x} y1={20} x2={x} y2={565} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 3" />
                    <text x={x - 10} y={585} fontSize={10} fill="#64748b" fontWeight={600}>
                      {lng >= 0 ? `${lng}°E` : `${Math.abs(lng)}°W`}
                    </text>
                  </g>
                );
              })}

              {/* Simplified Accurate Polygon Silhouette */}
              {isItaly ? (
                <>
                  {/* Mainland Peninsula & Northern Arc */}
                  <path
                    d="M 65 130 L 85 95 L 125 85 L 160 65 L 210 55 L 255 62 L 295 85 L 285 120 L 250 135 L 252 175 L 275 215 L 305 245 L 325 285 L 365 315 L 420 345 L 465 375 L 475 395 L 445 390 L 415 375 L 405 405 L 415 445 L 385 490 L 365 495 L 360 455 L 375 415 L 345 375 L 300 345 L 255 305 L 225 265 L 195 215 L 175 180 L 135 165 L 95 180 L 72 160 Z"
                    fill="#e2e8f0"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                  />
                  {/* Sicily */}
                  <path
                    d="M 275 495 L 355 485 L 345 550 L 295 535 L 265 510 Z"
                    fill="#e2e8f0"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                  />
                  {/* Sardinia */}
                  <path
                    d="M 110 325 L 145 320 L 150 415 L 115 425 L 105 365 Z"
                    fill="#e2e8f0"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                  />
                </>
              ) : (
                <>
                  {/* Simplified Continental Europe & UK Silhouette */}
                  <path
                    d="M 60 470 L 55 390 L 115 380 L 140 315 L 125 265 L 185 235 L 245 190 L 275 110 L 330 95 L 350 165 L 445 185 L 465 295 L 430 385 L 365 430 L 325 490 L 295 485 L 265 405 L 220 390 L 190 435 L 120 480 Z"
                    fill="#e2e8f0"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                  />
                  {/* UK Silhouette */}
                  <path
                    d="M 95 155 L 140 140 L 155 215 L 105 225 Z"
                    fill="#e2e8f0"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                  />
                </>
              )}

              {/* Provincial / National Landfill Volume Heat Circles (Q6.5) */}
              {showProvincialLandfillBubbles &&
                dataset.card6.q6_5_provincialQuantities.map((prov) => {
                  const { x, y } = projectLatLng(prov.lat, prov.lng, isItaly);
                  const radius = Math.max(8, Math.min(34, Math.sqrt(prov.quantityTonnes) / 7));
                  return (
                    <g key={prov.id}>
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill="rgba(0, 110, 182, 0.16)"
                        stroke="rgba(0, 75, 124, 0.45)"
                        strokeWidth={1.2}
                      >
                        <title>
                          {prov.provinceOrCity}: {prov.quantityTonnes.toLocaleString()} t/a PVC Landfilled (Q6.5)
                        </title>
                      </circle>
                    </g>
                  );
                })}

              {/* Facility Pins */}
              {filteredFacilities.map((fac) => {
                const { x, y } = projectLatLng(fac.lat, fac.lng, isItaly);
                const color = getPinColor(fac.pvcType);
                const isSelected = selectedFacility?.id === fac.id;
                return (
                  <g
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    className="cursor-pointer transition-transform"
                  >
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={12}
                        fill="none"
                        stroke="#004b7c"
                        strokeWidth={2.5}
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 7 : 5.2}
                      fill={color.fill}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    >
                      <title>
                        {fac.name} ({fac.stage}) — {fac.city} — {fac.pvcType} ({fac.sizeRaw})
                      </title>
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="w-full bg-white rounded-xl border border-slate-200 p-3 mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700">PVC Type:</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-recovinyl-blue inline-block" />
                  Rigid PVC
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-recovinyl-green inline-block" />
                  Flexible PVC
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-recovinyl-dark inline-block" />
                  Both
                </span>
              </div>
              {showProvincialLandfillBubbles && (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-recovinyl-dark font-medium">
                  <span className="w-3.5 h-3.5 rounded-full bg-recovinyl-blue/20 border border-recovinyl-blue inline-block" />
                  {dataset.countryCode === 'EU' ? 'National' : 'Provincial'} Landfill Tonnage (Q6.5)
                </span>
              )}
            </div>
          </div>

          {/* Selected Facility Inspector Card */}
          {selectedFacility && (
            <div className="p-4 bg-recovinyl-dark text-white border-t border-recovinyl-blue/30">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-recovinyl-green text-slate-950 text-[10px] font-extrabold uppercase">
                    Q{selectedFacility.questionRef} • {selectedFacility.stage}
                  </span>
                  <h4 className="text-sm font-bold mt-1">{selectedFacility.name}</h4>
                  <p className="text-xs text-recovinyl-light">
                    {selectedFacility.city} • {selectedFacility.regionOrProvince}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold">
                  {selectedFacility.pvcType}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/15 text-xs">
                <div>
                  <span className="text-recovinyl-light/70 block text-[10px]">Employees</span>
                  <span className="font-bold">
                    {selectedFacility.employees !== null ? selectedFacility.employees.toLocaleString() : 'N.D.'}
                  </span>
                </div>
                <div>
                  <span className="text-recovinyl-light/70 block text-[10px]">Turnover</span>
                  <span className="font-bold">
                    {selectedFacility.turnoverEurMillions !== null
                      ? `€${selectedFacility.turnoverEurMillions.toLocaleString()}M`
                      : 'N.D.'}
                  </span>
                </div>
                <div>
                  <span className="text-recovinyl-light/70 block text-[10px]">Coordinates</span>
                  <span className="font-mono text-[11px]">
                    {selectedFacility.lat.toFixed(2)}°N, {selectedFacility.lng.toFixed(2)}°E
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Searchable & Sortable Semantic Table + Provincial Landfill Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Search & Sort Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company name, city (e.g. Torino, Firenze, Roma), or stage..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-recovinyl-blue"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                {(
                  [
                    { id: 'turnover', label: 'Turnover (€M)' },
                    { id: 'employees', label: 'Employees' },
                    { id: 'name', label: 'Company Name' },
                    { id: 'city', label: 'City' }
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id)}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                      sortBy === s.id
                        ? 'bg-recovinyl-blue text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Responsive Table with Sticky Headers */}
            <div className="overflow-auto max-h-[430px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 text-[11px] uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">Facility / Operator</th>
                    <th className="py-2.5 px-3 font-bold">Stage (Card)</th>
                    <th className="py-2.5 px-3 font-bold">PVC Type</th>
                    <th className="py-2.5 px-3 font-bold">City / Region</th>
                    <th className="py-2.5 px-3 font-bold text-right">Employees</th>
                    <th className="py-2.5 px-3 font-bold text-right">Turnover</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {filteredFacilities.map((fac) => {
                    const isSelected = selectedFacility?.id === fac.id;
                    return (
                      <tr
                        key={fac.id}
                        onClick={() => setSelectedFacility(fac)}
                        className={`cursor-pointer transition ${
                          isSelected ? 'bg-recovinyl-light font-medium' : 'hover:bg-slate-50'
                        }`}
                      >
                        <th scope="row" className="py-2.5 px-3 font-bold text-slate-900">
                          {fac.name}
                        </th>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700">
                            Q{fac.questionRef} • {fac.stage}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              fac.pvcType === 'Rigid PVC'
                                ? 'bg-recovinyl-light text-recovinyl-dark border border-recovinyl-blue/30'
                                : fac.pvcType === 'Flexible PVC'
                                ? 'bg-recovinyl-greenLight text-recovinyl-greenDark border border-recovinyl-green/40'
                                : 'bg-recovinyl-dark text-white'
                            }`}
                          >
                            {fac.pvcType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{fac.city}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                          {fac.employees !== null ? fac.employees.toLocaleString() : 'N.D.'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {fac.turnoverEurMillions !== null
                            ? `€${fac.turnoverEurMillions.toLocaleString()}M`
                            : 'N.D.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Provincial / National Landfill Quantities Card (Q6.5) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-recovinyl-blue">
                  Question Card 6 • Q6.4 & Q6.5
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {dataset.countryCode === 'EU' ? 'National' : 'Provincial'} Breakdown of Post-Consumer PVC Landfilled in {dataset.countryName} (t/a)
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-recovinyl-dark">
                  {dataset.card6.q6_5_provincialQuantities
                    .reduce((s, p) => s + p.quantityTonnes, 0)
                    .toLocaleString()}{' '}
                  t mapped across {dataset.card6.q6_5_provincialQuantities.length}{' '}
                  {dataset.countryCode === 'EU' ? 'countries' : 'provinces'} /{' '}
                  {dataset.card6.q6_4_totalLandfilledEstimateTonnes.toLocaleString()} t total estimate
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {dataset.card6.q6_5_provincialQuantities.map((p) => {
                const pct = ((p.quantityTonnes / dataset.card6.q6_4_totalLandfilledEstimateTonnes) * 100).toFixed(1);
                return (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-recovinyl-light/50 border border-recovinyl-blue/25 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{p.provinceOrCity}</span>
                      <span className="text-[10px] text-recovinyl-blue">{pct}%</span>
                    </div>
                    <div className="text-base font-black text-recovinyl-dark mt-0.5">
                      {p.quantityTonnes.toLocaleString()} <span className="text-[11px] font-normal">t/a</span>
                    </div>
                    <div className="w-full h-1.5 bg-recovinyl-blue/20 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-recovinyl-blue rounded-full"
                        style={{ width: `${Math.min(100, Number(pct) * 2.5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
