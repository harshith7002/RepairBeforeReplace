'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, ShieldAlert, Leaf, Compass, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 border-t border-graphite-border text-slate-400 py-12 text-sm">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-graphite-border/60">
          
          {/* Col 1: Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-charcoal-700 border border-graphite-border flex items-center justify-center text-industrial-orange">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-mono font-bold text-white tracking-tight text-base">
                RepairBeforeReplace
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The AI-powered visual hardware diagnostic workstation. Empowering people to diagnose, repair, and extend the lifespan of physical objects before buying replacements.
            </p>
            <p className="font-mono text-[11px] text-slate-500">
              “We built AI that tells you when NOT to buy something.”
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-mono text-xs text-white uppercase tracking-wider mb-4">
              Workstation Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/diagnose" className="hover:text-industrial-orange transition-colors">
                  Visual Diagnostic Engine
                </Link>
              </li>
              <li>
                <Link href="/repair" className="hover:text-industrial-orange transition-colors">
                  Interactive Step-by-Step Guide
                </Link>
              </li>
              <li>
                <Link href="/repairs" className="hover:text-industrial-orange transition-colors">
                  Hardware Repair Index
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-industrial-orange transition-colors">
                  Diagnosis History Log
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-industrial-orange transition-colors flex items-center space-x-1 text-amber-400">
                  <span>90s Judge Demo Tour</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Principles & Safety */}
          <div>
            <h4 className="font-mono text-xs text-white uppercase tracking-wider mb-4">
              Safety & Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-industrial-amber flex-shrink-0" />
                <span>Electrical Isolation First</span>
              </li>
              <li className="flex items-center space-x-2">
                <Leaf className="w-3.5 h-3.5 text-industrial-green flex-shrink-0" />
                <span>E-waste Reduction Metric</span>
              </li>
              <li className="flex items-center space-x-2">
                <Compass className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Transparent Score Engine</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Disclaimer & Prototype Note */}
          <div className="bg-charcoal-800/80 p-4 rounded border border-graphite-border/70 space-y-2">
            <span className="inline-block px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-400 font-mono text-[10px] uppercase font-bold">
              Hackathon Prototype Disclaimer
            </span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              RepairBeforeReplace provides computer vision telemetry estimates for informational purposes. Always disconnect high-voltage equipment from main power and verify recommendations against manufacturer documentation before servicing.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} RepairBeforeReplace. Production Hackathon Build.
          </div>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span>Hardware Telemetry Framework v2.4</span>
            <span>·</span>
            <span>Next.js 14 & React 18</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
