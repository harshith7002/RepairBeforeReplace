'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DiagnosticItem, ComponentMarker } from '../types';
import { WASHING_MACHINE_DEMO, MOCK_ITEMS } from '../data/mockData';
import { DetectionOverlay } from './DetectionOverlay';
import { RepairabilityScore } from './RepairabilityScore';
import { RepairVsReplace } from './RepairVsReplace';
import { SafetyNotice } from './SafetyNotice';
import { ImpactCalculator } from './ImpactCalculator';
import { 
  UploadCloud, Camera, Video, Sparkles, CheckCircle2, 
  AlertTriangle, Cpu, ArrowRight, RotateCcw, Wrench, RefreshCw, FileText 
} from 'lucide-react';

export const DiagnosticWorkspace: React.FC = () => {
  const router = useRouter();

  // State management
  const [selectedItem, setSelectedItem] = useState<DiagnosticItem>(WASHING_MACHINE_DEMO);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [activeMarker, setActiveMarker] = useState<ComponentMarker | undefined>(
    WASHING_MACHINE_DEMO.markers[0]
  );
  const [customUploadName, setCustomUploadName] = useState<string | null>(null);

  // Trigger simulated analysis routine
  const handleSelectObject = (item: DiagnosticItem) => {
    setSelectedItem(item);
    setActiveMarker(item.markers[0]);
    setIsAnalyzing(true);
    setAnalysisStep(1);

    setTimeout(() => setAnalysisStep(2), 700);
    setTimeout(() => setAnalysisStep(3), 1400);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }, 2100);
  };

  // Mock File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomUploadName(file.name);
      // Run analysis on washing machine demo as proxy for uploaded image
      handleSelectObject(WASHING_MACHINE_DEMO);
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
            onClick={() => handleSelectObject(WASHING_MACHINE_DEMO)}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-charcoal-900 border border-graphite-border hover:border-slate-400 text-xs font-mono text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-industrial-orange' : ''}`} />
            <span>Re-run Inspection</span>
          </button>

          <span className="px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold">
            Status: Active Telemetry
          </span>
        </div>
      </div>

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
                JPG · PNG · MP4
              </span>
            </div>

            {/* Drag & Drop Box */}
            <div className="relative border-2 border-dashed border-graphite-border hover:border-industrial-orange rounded-lg p-6 text-center transition-all bg-charcoal-900/60 group cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-charcoal-800 border border-graphite-border flex items-center justify-center mx-auto text-industrial-orange group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-white">
                    {customUploadName ? customUploadName : 'Drag photo or short video here'}
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
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-charcoal-800 border border-graphite-border text-[11px] font-mono text-slate-300">
                    <Video className="w-3 h-3 text-slate-400" />
                    <span>Upload Video</span>
                  </span>
                </div>
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
                02. Quick Sample Presets
              </h3>
              <span className="text-[11px] font-mono text-amber-400">
                Seeded Diagnostic Samples
              </span>
            </div>

            <div className="space-y-2.5">
              {MOCK_ITEMS.map((item) => {
                const isSelected = selectedItem.id === item.id;
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
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded border border-graphite-border"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-white line-clamp-1">{item.name}</h4>
                        <span className="font-mono text-[10px] text-graphite-muted block">
                          {item.category} · {item.modelNumber}
                        </span>
                        <span className="text-[11px] text-orange-400 font-medium line-clamp-1">
                          {item.primaryIssue.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-xs text-emerald-400 block">
                        {item.repairability.totalScore}/100
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Score</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Object Identified Overview */}
          <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 shadow-workstation space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-graphite-muted uppercase">Object Identified</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-[10px]">
                High Confidence Match
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

        </div>

        {/* RIGHT PANEL: Visual Detection Canvas & Diagnostic Results (7 Cols on LG) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Analysis Simulation Loading Screen */}
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
                  {analysisStep === 1 && "Ingesting Hardware Image & Thermal Maps..."}
                  {analysisStep === 2 && "Segmenting Components & Acoustic Profiling..."}
                  {analysisStep === 3 && "Correlating Failure Knowledgebase & Scoring..."}
                </h3>
                <p className="font-mono text-xs text-slate-400">
                  Running multi-layered visual diagnostic neural net
                </p>
              </div>

              <div className="w-64 mx-auto bg-charcoal-900 h-1.5 rounded-full overflow-hidden border border-graphite-border">
                <div
                  className="h-full bg-industrial-orange transition-all duration-500"
                  style={{ width: `${(analysisStep / 3) * 100}%` }}
                />
              </div>
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

              </div>

              {/* Economic Comparison: Repair vs Replace */}
              <RepairVsReplace
                repairCost={selectedItem.repairCostRange}
                replaceCost={selectedItem.replaceCost}
                potentialSavings={selectedItem.potentialSavings}
                estimatedTime={selectedItem.estimatedTime}
                difficulty={selectedItem.difficulty}
                onGuideClick={() => router.push('/repair')}
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
