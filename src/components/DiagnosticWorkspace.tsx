'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DiagnosticItem, ComponentMarker } from '../types';
import { MOCK_ITEMS } from '../data/mockData';
import { DetectionOverlay } from './DetectionOverlay';
import { RepairabilityScore } from './RepairabilityScore';
import { RepairVsReplace } from './RepairVsReplace';
import { SafetyNotice } from './SafetyNotice';
import { ImpactCalculator } from './ImpactCalculator';
import {
  UploadCloud, Camera,
  AlertTriangle, Cpu, RotateCcw, RefreshCw, Loader2, Bot, Database,
} from 'lucide-react';

const CATEGORIES = ['Appliances', 'Electronics', 'Bicycles', 'Tools', 'Mechanical', 'Furniture'] as const;

export const DiagnosticWorkspace: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetIdParam = searchParams.get('id');

  // State management
  const [presets, setPresets] = useState<DiagnosticItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DiagnosticItem | null>(null);
  const [activeMarker, setActiveMarker] = useState<ComponentMarker | undefined>(undefined);

  const [isLoadingPresets, setIsLoadingPresets] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [customUploadName, setCustomUploadName] = useState<string | null>(null);
  const [categoryHint, setCategoryHint] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const lastUploadedFileRef = useRef<File | null>(null);

  // Load the diagnostic history to populate the "Quick Sample Presets" panel, and
  // pre-select an item if we arrived here from the library / history with ?id=...
  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      setIsLoadingPresets(true);
      try {
        const res = await fetch('/api/diagnostics?limit=8');
        if (!res.ok) throw new Error('Failed to load diagnostic history');
        const data = await res.json();
        const items: DiagnosticItem[] = data.items ?? [];
        if (cancelled) return;
        if (items.length > 0) {
          setPresets(items);
          if (presetIdParam) {
            const match = items.find((i) => i.id === presetIdParam);
            if (match) {
              setSelectedItem(match);
              setActiveMarker(match.markers[0]);
            } else {
              const res2 = await fetch(`/api/diagnostics/${presetIdParam}`);
              if (res2.ok) {
                const item: DiagnosticItem = await res2.json();
                if (!cancelled) {
                  setSelectedItem(item);
                  setActiveMarker(item.markers[0]);
                }
              }
            }
          } else {
            setSelectedItem(items[0]);
            setActiveMarker(items[0].markers[0]);
          }
        } else {
          setPresets(MOCK_ITEMS);
          setSelectedItem(MOCK_ITEMS[0]);
          setActiveMarker(MOCK_ITEMS[0].markers[0]);
        }
      } catch (err) {
        if (!cancelled) {
          setPresets(MOCK_ITEMS);
          setSelectedItem(MOCK_ITEMS[0]);
          setActiveMarker(MOCK_ITEMS[0].markers[0]);
        }
      } finally {
        if (!cancelled) setIsLoadingPresets(false);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAnalysisAnimation = (onDone: () => void) => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    const t1 = setTimeout(() => setAnalysisStep(2), 500);
    const t2 = setTimeout(() => setAnalysisStep(3), 1000);
    const t3 = setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisStep(0);
      onDone();
    }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  };

  // Selecting a preset from the sidebar — data is already fully diagnosed and stored,
  // so we just swap it in (with a short animation for continuity with the upload flow).
  const handleSelectObject = (item: DiagnosticItem) => {
    setErrorMessage(null);
    lastUploadedFileRef.current = null;
    setCustomUploadName(null);
    runAnalysisAnimation(() => {
      setSelectedItem(item);
      setActiveMarker(item.markers[0]);
    });
  };

  // Real upload -> POST /api/diagnose -> AI (if configured) or heuristic diagnosis.
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setErrorMessage(null);
    setCustomUploadName(file.name);
    lastUploadedFileRef.current = file;
    setIsAnalyzing(true);
    setAnalysisStep(1);

    const progressTimer1 = setTimeout(() => setAnalysisStep(2), 800);

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (categoryHint) formData.append('category', categoryHint);
      if (notes.trim()) formData.append('notes', notes.trim());

      setAnalysisStep(2);
      const res = await fetch('/api/diagnose', { method: 'POST', body: formData });
      setAnalysisStep(3);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Diagnosis failed (HTTP ${res.status})`);
      }

      const item: DiagnosticItem = await res.json();
      setSelectedItem(item);
      setActiveMarker(item.markers[0]);
      setPresets((prev) => [item, ...prev].slice(0, 8));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Diagnosis failed unexpectedly.');
    } finally {
      clearTimeout(progressTimer1);
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // Re-run inspection: re-submits the last uploaded photo to the backend (a real new
  // diagnosis call), or — if the current item is a preset — re-fetches it from the API.
  const handleRerun = async () => {
    if (!selectedItem) return;
    setErrorMessage(null);

    if (lastUploadedFileRef.current) {
      const fakeEvent = { target: { files: [lastUploadedFileRef.current], value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleFileUpload(fakeEvent);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(1);
    try {
      setAnalysisStep(2);
      const res = await fetch(`/api/diagnostics/${selectedItem.id}`, { cache: 'no-store' });
      setAnalysisStep(3);
      if (res.ok) {
        const item: DiagnosticItem = await res.json();
        setSelectedItem(item);
        setActiveMarker(item.markers[0]);
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Top Workstation Status Bar */}
      <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between shadow-workstation gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-industrial-orange" />
            <span className="font-mono text-xs text-graphite-muted uppercase tracking-widest">
              Diagnostic Workstation // Live View
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Visual Object Inspection & Diagnosis
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRerun}
            disabled={!selectedItem || isAnalyzing}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-charcoal-900 border border-graphite-border hover:border-slate-400 text-xs font-mono text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-industrial-orange' : ''}`} />
            <span>Re-run Inspection</span>
          </button>

          <span className="px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold">
            Status: Active Telemetry
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-orange-950/50 border border-orange-500/50 rounded-lg p-4 flex items-start space-x-3 text-sm text-orange-200">
          <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-xs uppercase font-bold text-orange-400 block mb-1">Diagnosis Error</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Split Workstation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT PANEL: Upload & Preset Selector (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Upload Object Dropzone */}
          <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 shadow-workstation space-y-4">
            <div className="flex items-center justify-between border-b border-graphite-border pb-3">
              <h3 className="font-mono text-xs uppercase font-bold text-slate-300 tracking-wider">
                01. Upload Hardware Object
              </h3>
              <span className="text-[11px] font-mono text-graphite-muted">
                JPG · PNG · WEBP
              </span>
            </div>

            {/* Drag & Drop Box */}
            <div className="relative border-2 border-dashed border-graphite-border hover:border-industrial-orange rounded-lg p-6 text-center transition-all bg-charcoal-900/60 group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />

              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-charcoal-800 border border-graphite-border flex items-center justify-center mx-auto text-industrial-orange group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {customUploadName ? customUploadName : 'Drag a photo here'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    or click to browse files from your computer
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 pt-2">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-charcoal-800 border border-graphite-border text-[11px] font-mono text-slate-300">
                    <Camera className="w-3 h-3 text-slate-400" />
                    <span>Upload Image</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Optional category hint + notes to steer the diagnosis engine */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-graphite-muted uppercase tracking-wider block mb-1">
                  Category (optional)
                </label>
                <select
                  value={categoryHint}
                  onChange={(e) => setCategoryHint(e.target.value)}
                  className="w-full bg-charcoal-900 border border-graphite-border rounded px-2.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-industrial-orange"
                >
                  <option value="">Auto-detect</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono text-graphite-muted uppercase tracking-wider block mb-1">
                  Describe the problem (optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. grinding noise on spin"
                  className="w-full bg-charcoal-900 border border-graphite-border rounded px-2.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-industrial-orange"
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1">
              <span>Supported Hardware Categories:</span>
              <span className="text-slate-300 font-bold">Appliances · Electronics · Tools · Bikes</span>
            </div>
          </div>

          {/* Quick Demo Presets Picker */}
          <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 shadow-workstation space-y-4">
            <div className="flex items-center justify-between border-b border-graphite-border pb-3">
              <h3 className="font-mono text-xs uppercase font-bold text-slate-300 tracking-wider">
                02. Diagnosis History
              </h3>
              <span className="text-[11px] font-mono text-amber-400">
                {isLoadingPresets ? 'Loading…' : `${presets.length} record${presets.length === 1 ? '' : 's'}`}
              </span>
            </div>

            {isLoadingPresets ? (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : presets.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No diagnoses yet — upload a photo above to create the first one.
              </p>
            ) : (
              <div className="space-y-2.5">
                {presets.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectObject(item)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-charcoal-900 border-industrial-orange shadow-md'
                          : 'bg-charcoal-900/60 border-graphite-border/70 hover:border-slate-400 hover:bg-charcoal-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded border border-graphite-border flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-white line-clamp-1">{item.name}</h4>
                          <span className="font-mono text-[10px] text-graphite-muted block">
                            {item.category} · {item.modelNumber}
                          </span>
                          <span className="text-[11px] text-orange-400 font-medium line-clamp-1">
                            {item.primaryIssue.name}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="font-mono font-bold text-xs text-emerald-400 block">
                          {item.repairability.totalScore}/100
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Score</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Current Object Identified Overview */}
          {selectedItem && (
            <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 shadow-workstation space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-graphite-muted uppercase">Object Identified</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] flex items-center space-x-1">
                  {selectedItem.sourceType === 'ai' ? <Bot className="w-3 h-3" /> : <Database className="w-3 h-3" />}
                  <span>
                    {selectedItem.sourceType === 'ai'
                      ? 'AI Vision Diagnosis'
                      : selectedItem.sourceType === 'heuristic'
                      ? 'Knowledge-Base Match'
                      : 'Sample Diagnosis'}
                  </span>
                </span>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                {selectedItem.name}
              </h2>
              <p className="font-mono text-xs text-slate-400">
                Model Spec: {selectedItem.modelNumber}
              </p>

              <div className="pt-2 border-t border-graphite-border">
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block mb-2">
                  Visible Symptoms & Telemetry:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedItem.symptoms.map((symptom, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-industrial-orange flex-shrink-0 mt-1.5" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT PANEL: Visual Detection Canvas & Diagnostic Results (7 Cols on LG) */}
        <div className="lg:col-span-7 space-y-6">

          {/* AI Analysis Loading Screen (real request lifecycle when uploading) */}
          {isAnalyzing ? (
            <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-12 text-center shadow-workstation space-y-6 aspect-[16/10] flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-industrial-orange/20 border-t-industrial-orange animate-spin mx-auto" />
                <Cpu className="w-8 h-8 text-industrial-orange absolute inset-0 m-auto animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs uppercase text-industrial-orange tracking-widest font-bold">
                  Stage 0{analysisStep} / 03: Feature Extraction
                </span>
                <h3 className="text-xl font-bold text-white">
                  {analysisStep === 1 && "Ingesting Hardware Image..."}
                  {analysisStep === 2 && "Running Diagnostic Engine..."}
                  {analysisStep === 3 && "Correlating Failure Knowledgebase & Scoring..."}
                </h3>
                <p className="font-mono text-xs text-slate-400">
                  Contacting the diagnostic backend
                </p>
              </div>

              <div className="w-64 mx-auto bg-charcoal-900 h-1.5 rounded-full overflow-hidden border border-graphite-border">
                <div
                  className="h-full bg-industrial-orange transition-all duration-500"
                  style={{ width: `${(analysisStep / 3) * 100}%` }}
                />
              </div>
            </div>
          ) : !selectedItem ? (
            <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-12 text-center shadow-workstation aspect-[16/10] flex flex-col items-center justify-center space-y-3">
              {isLoadingPresets ? (
                <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
              ) : (
                <>
                  <RotateCcw className="w-8 h-8 text-slate-500" />
                  <p className="text-sm text-slate-400">Upload a photo to run your first diagnosis.</p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Visual Detection Overlay Canvas */}
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Interactive Computer-Vision Layer</span>
                  <span>Click markers to highlight details</span>
                </div>
                <DetectionOverlay
                  imageUrl={selectedItem.fullImageUrl}
                  markers={selectedItem.markers}
                  activeMarkerId={activeMarker?.id}
                  onSelectMarker={(marker) => setActiveMarker(marker)}
                />
              </div>

              {/* Primary Diagnostic Results Card */}
              <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 shadow-workstation space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-graphite-border pb-4 gap-4">
                  <div>
                    <span className="font-mono text-xs text-industrial-orange font-bold uppercase tracking-widest">
                      Preliminary Diagnosis
                    </span>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">
                      {selectedItem.primaryIssue.name}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-charcoal-900 px-3 py-1.5 rounded border border-graphite-border text-right">
                      <span className="font-mono text-[10px] text-graphite-muted uppercase block">
                        AI Confidence
                      </span>
                      <span className="font-mono font-bold text-lg text-emerald-400">
                        {selectedItem.primaryIssue.confidence}%
                      </span>
                    </div>

                    <div className="bg-emerald-950/80 px-3 py-1.5 rounded border border-emerald-500/40 text-right">
                      <span className="font-mono text-[10px] text-emerald-300 uppercase block">
                        Repairability Score
                      </span>
                      <span className="font-mono font-bold text-lg text-emerald-400">
                        {selectedItem.repairability.totalScore} / 100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Issue Description & Root Cause */}
                <div className="space-y-3 bg-charcoal-900 p-4 rounded-lg border border-graphite-border">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {selectedItem.primaryIssue.description}
                  </p>
                  <div className="pt-2 border-t border-graphite-border flex items-center space-x-2 text-xs font-mono text-amber-400">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Suspected Root Cause: {selectedItem.primaryIssue.rootCause}</span>
                  </div>
                </div>

                {/* Secondary Possibilities Ranking */}
                {selectedItem.secondaryPossibilities.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Other Potential Possibilities (Ranked)
                    </h4>

                    <div className="space-y-2">
                      {selectedItem.secondaryPossibilities.map((sec, i) => (
                        <div key={i} className="bg-charcoal-900/70 p-3 rounded border border-graphite-border/70 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-slate-500">{i + 1}.</span>
                              <span className="font-semibold text-slate-200">{sec.name}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{sec.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <span className="font-mono font-bold text-amber-400 block">{sec.confidence}%</span>
                            <span className="font-mono text-[10px] text-slate-400">{sec.estimatedCost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Economic Comparison: Repair vs Replace */}
              <RepairVsReplace
                repairCost={selectedItem.repairCostRange}
                replaceCost={selectedItem.replaceCost}
                potentialSavings={selectedItem.potentialSavings}
                estimatedTime={selectedItem.estimatedTime}
                difficulty={selectedItem.difficulty}
                onGuideClick={() => router.push(`/repair?id=${selectedItem.id}`)}
              />

              {/* Repairability Methodology Breakdown */}
              <RepairabilityScore score={selectedItem.repairability} />

              {/* Mandatory Safety Prerequisites */}
              <SafetyNotice warnings={selectedItem.safetyWarnings} />

              {/* Environmental Impact Telemetry */}
              <ImpactCalculator impact={selectedItem.impact} />

            </>
          )}

        </div>

      </div>

    </div>
  );
};
