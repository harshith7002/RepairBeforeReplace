'use client';

import React from 'react';
import { AlertOctagon, CheckSquare, ShieldAlert } from 'lucide-react';

interface SafetyNoticeProps {
  warnings: string[];
  cautionType?: string;
  cautionDesc?: string;
}

export const SafetyNotice: React.FC<SafetyNoticeProps> = ({
  warnings,
  cautionType,
  cautionDesc,
}) => {
  return (
    <div className="bg-amber-950/40 border-2 border-amber-500/50 rounded-lg p-5 shadow-workstation space-y-4">
      <div className="flex items-center space-x-3 border-b border-amber-500/30 pb-3">
        <div className="w-9 h-9 rounded bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400">
          <AlertOctagon className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
            Prerequisite Safety Protocol
          </span>
          <h4 className="font-bold text-base text-white">
            Mandatory Safety Checklist Before Service
          </h4>
        </div>
      </div>

      <div className="space-y-2.5">
        {warnings.map((warning, index) => (
          <div key={index} className="flex items-start space-x-3 text-xs text-amber-200/90 bg-charcoal-900/60 p-2.5 rounded border border-amber-500/20">
            <CheckSquare className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{warning}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2 border-t border-amber-500/20">
        <div className="flex items-center space-x-1 text-amber-300">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>{cautionType || 'Contextual Safety Protocol'}</span>
        </div>
        <span className="text-slate-400">
          {cautionDesc || 'Stop and consult an authorized service professional if damage exceeds basic maintenance skill level.'}
        </span>
      </div>
    </div>
  );
};
