'use client';

import React from 'react';
import { ImpactMetrics } from '../types';
import { Leaf, Scale, CloudRain, Trash2, ShieldAlert } from 'lucide-react';

interface ImpactCalculatorProps {
  impact: ImpactMetrics;
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ impact }) => {
  return (
    <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 sm:p-8 shadow-workstation space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-graphite-border pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Sustainability Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Every repair is one less replacement.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Estimated environmental savings by extending physical product lifespan.
          </p>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs">
          Lifespan Extension: +3–5 Years
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-charcoal-900 p-5 rounded-lg border border-graphite-border relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-mono text-xs uppercase">Raw Material Avoided</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-mono font-bold text-white">
              {impact.materialSavedKg}
            </span>
            <span className="text-sm font-mono text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Includes steel drum, copper wiring, and molded plastic casing.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-charcoal-900 p-5 rounded-lg border border-graphite-border relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-mono text-xs uppercase">CO₂ Footprint Reduced</span>
            <CloudRain className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-mono font-bold text-white">
              {impact.co2SavedKg}
            </span>
            <span className="text-sm font-mono text-slate-400">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Avoided manufacturing logistics & ocean freight carbon emissions.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-charcoal-900 p-5 rounded-lg border border-graphite-border relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="font-mono text-xs uppercase">E-Waste Diverted</span>
            <Trash2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-mono font-bold text-emerald-400">
              {impact.eWasteDivertedPercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            100% diversion from local municipal landfill disposal.
          </p>
        </div>

      </div>

      <div className="bg-charcoal-900/60 p-3 rounded border border-graphite-border/70 flex items-center justify-between text-xs text-slate-400">
        <span>* Environmental metrics calculated using Lifecycle Assessment (LCA) manufacturing proxy data.</span>
        <span className="font-mono text-emerald-400 font-bold">Goal: Extend Product Lifespan</span>
      </div>

    </div>
  );
};
