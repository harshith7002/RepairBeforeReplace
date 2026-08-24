'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiagnosticItem } from '../types';
import { Search, Wrench, ArrowRight, BookOpen, Loader2, AlertTriangle } from 'lucide-react';

export const RepairLibraryView: React.FC = () => {
  const [items, setItems] = useState<DiagnosticItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Appliances', 'Electronics', 'Bicycles', 'Tools', 'Mechanical', 'Furniture'];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch('/api/diagnostics', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load the repair library.');
        const data = await res.json();
        if (!cancelled) setItems(data.items ?? []);
      } catch (err) {
        if (!cancelled) setErrorMessage(err instanceof Error ? err.message : 'Failed to load the repair library.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.primaryIssue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Page Header */}
      <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 sm:p-8 shadow-workstation space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-industrial-orange" />
          <span className="font-mono text-xs text-graphite-muted uppercase tracking-widest">
            Hardware Knowledgebase
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Explore Repair Library
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Search indexed hardware diagnostic guides, repairability scores, component symptoms, and step-by-step repair manuals — pulled live from every diagnosis run on this workstation.
        </p>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-graphite-border">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search appliances, electronics, tools, symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-charcoal-900 border border-graphite-border rounded pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-industrial-orange"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                  selectedCategory === cat
                    ? 'bg-industrial-orange text-white font-semibold shadow-sm'
                    : 'bg-charcoal-900 text-slate-300 hover:text-white border border-graphite-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-orange-950/50 border border-orange-500/50 rounded-lg p-4 flex items-start space-x-3 text-sm text-orange-200">
          <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-12">
          {items.length === 0
            ? <>No diagnoses yet — run one from the <Link href="/diagnose" className="text-industrial-orange hover:underline">Diagnostic Workstation</Link> to populate the library.</>
            : 'No entries match your search or filter.'}
        </p>
      ) : (
        /* Hardware Repair Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-charcoal-800 border border-graphite-border rounded-lg overflow-hidden shadow-workstation hover:border-slate-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-charcoal-900">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-3 left-3 bg-charcoal-900/90 border border-graphite-border px-2.5 py-1 rounded text-[10px] font-mono text-slate-300">
                    {item.category}
                  </div>

                  <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded text-[11px] font-mono font-bold text-emerald-400">
                    Score: {item.repairability.totalScore}/100
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-base text-white group-hover:text-industrial-orange transition-colors">
                    {item.name}
                  </h3>

                  <div className="bg-charcoal-900 p-2.5 rounded border border-graphite-border/70 space-y-1">
                    <span className="font-mono text-[10px] text-industrial-orange uppercase tracking-wider block font-bold">
                      Primary Symptom / Issue
                    </span>
                    <p className="text-xs text-slate-200 font-semibold">{item.primaryIssue.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-1">
                    <div>
                      <span>Repair Cost:</span>
                      <span className="font-bold text-emerald-400 block">{item.repairCostRange}</span>
                    </div>
                    <div>
                      <span>Est. Time:</span>
                      <span className="font-bold text-white block">{item.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-graphite-border/50 flex gap-2">
                <Link
                  href={`/diagnose?id=${item.id}`}
                  className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded bg-charcoal-900 hover:bg-industrial-orange border border-graphite-border hover:border-industrial-orange text-slate-200 hover:text-white font-mono text-xs font-bold transition-all"
                >
                  <span>View Diagnosis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/repair?id=${item.id}`}
                  className="inline-flex items-center justify-center px-3 py-2.5 rounded bg-charcoal-900 hover:bg-charcoal-700 border border-graphite-border text-slate-300 hover:text-white transition-all"
                  title="Open repair manual"
                >
                  <Wrench className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
