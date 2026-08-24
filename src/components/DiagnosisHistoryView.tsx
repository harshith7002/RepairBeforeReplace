'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_ITEMS } from '../data/mockData';
import { DiagnosticItem } from '../types';
import { History, Calendar, ShieldCheck, ArrowRight, Eye, CheckCircle2, PiggyBank } from 'lucide-react';

export const DiagnosisHistoryView: React.FC = () => {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<DiagnosticItem | null>(null);

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 sm:p-8 shadow-workstation space-y-3">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-industrial-orange" />
          <span className="font-mono text-xs text-graphite-muted uppercase tracking-widest">
            Hardware Diagnostic Audit Trail
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Diagnosis History
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Chronological telemetry log of all physical object inspections, diagnostic results, repairability scores, and financial savings recorded on this workstation.
        </p>
      </div>

      {/* History Timeline List */}
      <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 shadow-workstation space-y-6">
        <div className="flex items-center justify-between border-b border-graphite-border pb-4">
          <span className="font-mono text-xs text-slate-300 font-bold uppercase tracking-wider">
            Chronological Telemetry Entries ({MOCK_ITEMS.length})
          </span>
          <span className="font-mono text-[11px] text-emerald-400 font-semibold">
            Total Estimated Savings: ₹109,000+
          </span>
        </div>

        <div className="space-y-4">
          {MOCK_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="bg-charcoal-900 border border-graphite-border/80 hover:border-slate-400 rounded-lg p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border border-graphite-border flex-shrink-0"
                />
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-white group-hover:text-industrial-orange transition-colors">
                      {item.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-charcoal-800 border border-graphite-border font-mono text-[10px] text-slate-300">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-orange-400 font-medium">
                    Diagnosed Issue: {item.primaryIssue.name} ({item.primaryIssue.confidence}% confidence)
                  </p>

                  <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{item.diagnosedDate}</span>
                    </span>
                    <span>·</span>
                    <span className="text-emerald-400 font-bold">
                      Saved {item.potentialSavings}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Score & Action Buttons */}
              <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-graphite-border/70 pt-3 md:pt-0 md:pl-6 justify-between md:justify-end">
                <div className="text-right">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-mono font-bold text-emerald-400">
                      {item.repairability.totalScore}
                    </span>
                    <span className="text-xs font-mono text-slate-500">/ 100</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                    {item.repairability.verdict}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedHistoryItem(item)}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded bg-charcoal-800 hover:bg-industrial-orange border border-graphite-border text-xs font-mono text-slate-200 hover:text-white transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Audit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Detail Modal */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal-800 border border-graphite-border rounded-lg max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-graphite-border pb-4">
              <div>
                <span className="font-mono text-xs text-industrial-orange uppercase font-bold">
                  Diagnostic Telemetry Record
                </span>
                <h2 className="text-xl font-bold text-white">{selectedHistoryItem.name}</h2>
              </div>
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-charcoal-900 p-4 rounded border border-graphite-border">
                <h4 className="font-mono text-xs uppercase text-slate-400 font-bold mb-1">
                  Primary Issue Diagnosis
                </h4>
                <p className="text-sm text-white font-bold">{selectedHistoryItem.primaryIssue.name}</p>
                <p className="text-xs text-slate-300 mt-1">{selectedHistoryItem.primaryIssue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-charcoal-900 p-3 rounded border border-graphite-border">
                  <span className="text-slate-400 uppercase text-[10px] block">Repairability Score</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {selectedHistoryItem.repairability.totalScore} / 100
                  </span>
                </div>
                <div className="bg-charcoal-900 p-3 rounded border border-graphite-border">
                  <span className="text-slate-400 uppercase text-[10px] block">Potential Savings</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {selectedHistoryItem.potentialSavings}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-graphite-border flex justify-end space-x-3">
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="px-4 py-2 rounded bg-charcoal-900 text-slate-300 font-mono text-xs hover:text-white"
              >
                Done
              </button>
              <Link
                href="/repair"
                className="px-4 py-2 rounded bg-industrial-orange hover:bg-orange-600 text-white font-mono text-xs font-bold"
              >
                Open Repair Manual →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
