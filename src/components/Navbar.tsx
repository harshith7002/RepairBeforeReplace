'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wrench, ShieldAlert, Cpu, Sparkles, PlayCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'How it works', href: '/#how-it-works' },
    { name: 'Repairability', href: '/#repairability' },
    { name: 'Explore repairs', href: '/repairs' },
    { name: 'Impact', href: '/#impact' },
    { name: 'History', href: '/history' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-charcoal-900/95 backdrop-blur-md border-b border-graphite-border text-white transition-all">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Telemetry Indicator */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-charcoal-700 to-charcoal-800 border border-graphite-border flex items-center justify-center text-industrial-orange group-hover:border-industrial-orange/60 transition-colors shadow-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold tracking-tight text-lg text-white group-hover:text-industrial-orange transition-colors">
                RepairBeforeReplace
              </span>
              <span className="text-[10px] font-mono tracking-widest text-graphite-muted uppercase -mt-1">
                Visual Repair Assistant
              </span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center space-x-2 pl-4 border-l border-graphite-border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-industrial-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-industrial-green"></span>
            </span>
            <span className="font-mono text-[11px] text-emerald-400 tracking-wide uppercase">
              Repair Intelligence Active
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-charcoal-700 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-charcoal-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center space-x-3">
          {/* Judge Demo Quick Button */}
          <Link
            href="/demo"
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-mono font-medium text-amber-300 bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/80 transition-colors"
            title="60-90 second interactive walk-through for judges"
          >
            <PlayCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Judge Demo (90s)</span>
          </Link>

          {/* Primary Action Button */}
          <Link
            href="/diagnose"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-industrial-orange hover:bg-orange-600 text-white font-medium text-sm transition-all shadow-sm hover:shadow-orange-500/20 active:scale-98"
          >
            <Cpu className="w-4 h-4" />
            <span>Try a diagnosis →</span>
          </Link>
        </div>

      </div>
    </header>
  );
};
