import React, { useState } from 'react';
import { ProviderAccount, ProviderRoleType } from '../types';
import { EUROPEAN_COUNTRIES_SUMMARY } from '../data/europeanCountries';
import { createNewProviderAccount } from '../data/providerAccounts';
import {
  UserCheck,
  UserPlus,
  Building2,
  Mail,
  Globe,
  CheckCircle2,
  X,
  Clock,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accounts: ProviderAccount[];
  activeAccountId: string;
  onSelectAccount: (accountId: string) => void;
  onCreateAccount: (newAccount: ProviderAccount) => void;
}

export const ProviderAccountModal: React.FC<Props> = ({
  isOpen,
  onClose,
  accounts,
  activeAccountId,
  onSelectAccount,
  onCreateAccount
}) => {
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [roleType, setRoleType] = useState<ProviderRoleType>('Regional Representative (RRR)');
  const [countryCode, setCountryCode] = useState('IT');
  const [startMode, setStartMode] = useState<'blank' | 'template'>('blank');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !email.trim() || !organization.trim()) return;
    const newAcc = createNewProviderAccount({
      contactName: contactName.trim(),
      email: email.trim(),
      organization: organization.trim(),
      roleType,
      countryCode,
      startMode
    });
    onCreateAccount(newAcc);
    setContactName('');
    setEmail('');
    setOrganization('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-recovinyl-dark to-recovinyl-blue text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-recovinyl-green">
              Fold 1 • Contributor & Provider Accounts
            </span>
            <h2 className="text-lg font-extrabold mt-0.5">
              Switch Provider Account or Register a New Contributor Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Existing Provider Accounts */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-recovinyl-blue" />
              Saved Provider Accounts ({accounts.length})
            </h3>
            <p className="text-xs text-slate-500">
              Each provider stores their own answers to the 7 Question Cards in their personal account. Selecting an account loads their questionnaire and updates the National Summary Report.
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {accounts.map((acc) => {
                const isSelected = acc.id === activeAccountId;
                const completedCount = Object.values(acc.cardCompletion).filter(Boolean).length;
                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      onSelectAccount(acc.id);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-recovinyl-light border-recovinyl-blue shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{acc.flag}</span>
                        <div>
                          <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                            <span>{acc.contactName}</span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-recovinyl-blue text-white text-[10px] font-bold">
                                Active Account
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-slate-700">{acc.organization}</div>
                          <div className="text-[11px] text-slate-500">
                            {acc.email} • {acc.roleType}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            completedCount === 7
                              ? 'bg-recovinyl-greenLight text-recovinyl-greenDark'
                              : 'bg-recovinyl-light text-recovinyl-dark'
                          }`}
                        >
                          {completedCount} / 7 Cards Answered
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Saved: {acc.lastSavedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Create New Provider Account */}
          <div className="md:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-3">
              <UserPlus className="w-4 h-4 text-recovinyl-greenDark" />
              Register New Provider Account
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Provider / Contact Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g., Sofia Rossi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-recovinyl-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., s.rossi@organization.eu"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-recovinyl-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Organization / Company *</label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g., PVC Forum / National Waste Partner"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-recovinyl-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">European Country</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {EUROPEAN_COUNTRIES_SUMMARY.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Provider Role</label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value as ProviderRoleType)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Regional Representative (RRR)">Regional Representative (RRR)</option>
                    <option value="ECVM / National PVC Network">ECVM / National Network</option>
                    <option value="Waste Collector / Multi-Utility">Waste Collector / Utility</option>
                    <option value="Sorting & Pretreatment Operator">Sorting & Pretreatment</option>
                    <option value="PVC Recycler / Converter">PVC Recycler / Converter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Questionnaire Data</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStartMode('blank')}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      startMode === 'blank'
                        ? 'bg-recovinyl-dark text-white border-recovinyl-dark font-bold'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <div className="text-xs">Blank 7-Card Form</div>
                    <div className="text-[10px] opacity-75">Answer from scratch or import data</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStartMode('template')}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      startMode === 'template'
                        ? 'bg-recovinyl-dark text-white border-recovinyl-dark font-bold'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <div className="text-xs">Pre-fill Reference</div>
                    <div className="text-[10px] opacity-75">Clone reference country baseline</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-recovinyl-green hover:bg-recovinyl-greenDark text-slate-950 font-extrabold shadow-sm transition mt-2"
              >
                Create Provider Account & Open Question Cards
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
