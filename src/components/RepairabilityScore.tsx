'use client';

import React from 'react';
import { RepairabilityBreakdown } from '../types';
import { ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';

interface RepairabilityScoreProps {
  score: RepairabilityBreakdown;
  compact?: boolean;
}

export const RepairabilityScore: React.FC<RepairabilityScoreProps> = ({
  score,
  compact = false,
}) => {
  const getBarColor = (value: number) => {
    if (value >= 80) return 'bg-emerald-500';
    if (value >= 60) return 'bg-amber-500';
    return 'bg-industrial-orange';
  };

  if (compact) {
    return (
      <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-4 flex items-center justify-between shadow-workstation">
        <div>
          <span className="font-mono text-xs text-graphite-muted uppercase tracking-wider block">
            Repairability Score
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono font-bold text-emerald-400">
              {score.totalScore}
            </span>
            <span className="text-sm font-mono text-slate-400">/ 100</span>
          </div>
          <span className="text-xs text-slate-300 font-medium">{score.verdict}</span>
        </div>

        <div className="w-14 h-14 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-charcoal-900">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 shadow-workstation space-y-6">
      
      {/* Header telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-graphite-border pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-industrial-orange" />
            <span className="font-mono text-xs uppercase tracking-widest text-graphite-muted">
              Diagnostic Index
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Repairability Score Methodology
          </h3>
        </div>

        <div className="flex items-center space-x-3 bg-charcoal-900 px-4 py-2 rounded-lg border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <div className="text-right">
            <div className="flex items-baseline justify-end space-x-1">
              <span className="text-3xl font-mono font-extrabold text-emerald-400">
                {score.totalScore}
              </span>
              <span className="text-xs font-mono text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
              {score.verdict}
            </span>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
        </div>
      </div>

      {/* 4 Factor Telemetry Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Factor 1: Parts */}
        <div className="bg-charcoal-900 p-3.5 rounded border border-graphite-border/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-mono text-slate-300">Availability of Parts</span>
            <span className="font-mono font-bold text-white">{score.partsAvailability}%</span>
          </div>
          <div className="w-full bg-charcoal-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(score.partsAvailability)}`}
              style={{ width: `${score.partsAvailability}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {score.partsNote || 'Standard OEM replacement components readily available via hardware suppliers.'}
          </p>
        </div>

        {/* Factor 2: Complexity */}
        <div className="bg-charcoal-900 p-3.5 rounded border border-graphite-border/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-mono text-slate-300">Repair Complexity</span>
            <span className="font-mono font-bold text-white">{score.repairComplexity}%</span>
          </div>
          <div className="w-full bg-charcoal-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(score.repairComplexity)}`}
              style={{ width: `${score.repairComplexity}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {score.complexityNote || 'Manageable procedure executable using standard household hand tools.'}
          </p>
        </div>

        {/* Factor 3: Cost Ratio */}
        <div className="bg-charcoal-900 p-3.5 rounded border border-graphite-border/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-mono text-slate-300">Estimated Cost Ratio</span>
            <span className="font-mono font-bold text-white">{score.costRatio}%</span>
          </div>
          <div className="w-full bg-charcoal-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(score.costRatio)}`}
              style={{ width: `${score.costRatio}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {score.costRatioNote || 'Repair cost represents a small fraction of full unit replacement price.'}
          </p>
        </div>

        {/* Factor 4: Accessibility */}
        <div className="bg-charcoal-900 p-3.5 rounded border border-graphite-border/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-mono text-slate-300">Product Accessibility</span>
            <span className="font-mono font-bold text-white">{score.productAccessibility}%</span>
          </div>
          <div className="w-full bg-charcoal-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(score.productAccessibility)}`}
              style={{ width: `${score.productAccessibility}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {score.accessibilityNote || 'Component housing allows inspection without complete teardown.'}
          </p>
        </div>

      </div>

      <div className="bg-charcoal-900/60 p-3 rounded border border-graphite-border flex items-start space-x-2 text-xs text-slate-400">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-200">Transparent Evaluation Metric:</strong> Score combines component modularity, fastener standardisation, documentation availability, and economic replacement ratio.
        </p>
      </div>

    </div>
  );
};
