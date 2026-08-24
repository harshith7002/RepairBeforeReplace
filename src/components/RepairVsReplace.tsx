'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wrench, ShoppingBag, PiggyBank, Clock, ShieldCheck } from 'lucide-react';

interface RepairVsReplaceProps {
  repairCost: string;
  replaceCost: string;
  replaceText?: string;
  replacementDisposalNote?: string;
  issueName?: string;
  potentialSavings: string;
  estimatedTime: string;
  difficulty: string;
  onGuideClick?: () => void;
}

export const RepairVsReplace: React.FC<RepairVsReplaceProps> = ({
  repairCost,
  replaceCost,
  replaceText,
  replacementDisposalNote,
  issueName,
  potentialSavings,
  estimatedTime,
  difficulty,
  onGuideClick,
}) => {
  return (
    <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 sm:p-8 shadow-workstation space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-graphite-border pb-4 gap-4">
        <div>
          <span className="font-mono text-xs text-industrial-orange uppercase tracking-widest block font-bold">
            Economic Analysis
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Don't replace it yet.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare expected repair outlay versus immediate full unit replacement.
          </p>
        </div>

        {/* Savings Highlight Badge */}
        <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-lg p-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-900/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase text-emerald-300 font-bold tracking-wider block">
              Estimated Net Savings
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400">
              {potentialSavings}
            </span>
          </div>
        </div>
      </div>

      {/* Direct Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* REPAIR CARD (Recommended) */}
        <div className="bg-charcoal-900 rounded-lg border-2 border-emerald-500/60 p-6 relative overflow-hidden shadow-hud flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase px-3 py-1 rounded-bl">
            Recommended Action
          </div>

          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-3">
              <Wrench className="w-5 h-5" />
              <h3 className="font-bold text-lg text-white">DIY / Guided Repair</h3>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Estimated Repair Cost
                </span>
                <span className="text-3xl font-mono font-bold text-emerald-400">
                  {repairCost}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Includes component adjustment, alignment & minor consumables
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-graphite-border/70 text-xs">
                <div>
                  <span className="font-mono text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Time Req:</span>
                  </span>
                  <span className="font-mono text-white font-bold">{estimatedTime}</span>
                </div>
                <div>
                  <span className="font-mono text-slate-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Difficulty:</span>
                  </span>
                  <span className="font-mono text-amber-400 font-bold">{difficulty}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-graphite-border/60">
            {onGuideClick ? (
              <button
                onClick={onGuideClick}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded bg-industrial-orange hover:bg-orange-600 text-white font-medium text-sm transition-all shadow-sm active:scale-98"
              >
                <span>Show me how to repair it</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/repair"
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded bg-industrial-orange hover:bg-orange-600 text-white font-medium text-sm transition-all shadow-sm active:scale-98"
              >
                <span>Show me how to repair it</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* REPLACE CARD */}
        <div className="bg-charcoal-900 rounded-lg border border-graphite-border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-400 mb-3">
              <ShoppingBag className="w-5 h-5" />
              <h3 className="font-bold text-lg text-slate-200">Full Replacement</h3>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Estimated New Unit Cost
                </span>
                <span className="text-3xl font-mono font-bold text-slate-300">
                  {replaceCost}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {replaceText || 'Includes replacement item purchase, delivery and setup.'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-graphite-border/70">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span>Requires waiting for delivery / retail sourcing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span>{replacementDisposalNote || 'Creates unnecessary component scrap and disposal waste'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-graphite-border/60 text-center">
            <span className="font-mono text-xs text-slate-500">
              Not recommended for a minor {issueName ? `"${issueName}"` : 'component'} adjustment.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
