'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WASHING_MACHINE_DEMO } from '../data/mockData';
import { DetectionOverlay } from './DetectionOverlay';
import { RepairabilityScore } from './RepairabilityScore';
import { RepairVsReplace } from './RepairVsReplace';
import { ImpactCalculator } from './ImpactCalculator';
import { SafetyNotice } from './SafetyNotice';
import { 
  Play, ArrowRight, ArrowLeft, Cpu, CheckCircle2, 
  Sparkles, Wrench, ShieldCheck, RefreshCw, Zap 
} from 'lucide-react';

export const DemoFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const item = WASHING_MACHINE_DEMO;
  const totalSteps = 6;

  // Auto-play timer for zero-click 90s presentation mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay && currentStep < totalSteps) {
      timer = setTimeout(() => {
        if (currentStep === 2) {
          setIsScanning(true);
          setTimeout(() => {
            setIsScanning(false);
            setCurrentStep(3);
          }, 1500);
        } else {
          setCurrentStep(c => c + 1);
        }
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, currentStep]);

  const stepTitles = [
    '01. Upload Hardware Object',
    '02. AI Visual Telemetry Scan',
    '03. Repairability Score Engine',
    '04. Repair vs Replace Savings',
    '05. Step-by-Step Guided Repair',
    '06. Sustainability & Waste Impact'
  ];

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hackathon Judge Banner */}
      <div className="bg-gradient-to-r from-amber-950/90 via-charcoal-800 to-charcoal-900 border-2 border-amber-500/60 rounded-lg p-6 shadow-hud flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500 text-charcoal-900 font-mono text-[11px] font-extrabold uppercase tracking-wider">
              Judge Evaluation Mode
            </span>
            <span className="font-mono text-xs text-amber-300">
              Zero Setup · 90-Second Guided Tour
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Repair this machine with us.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Automated walk-through demonstrating the AI visual diagnosis pipeline on a front-loading washing machine.
          </p>
        </div>

        {/* Auto Play & Step Jumps */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded font-mono text-xs font-bold transition-all shadow-sm ${
              autoPlay
                ? 'bg-amber-500 text-charcoal-900 animate-pulse'
                : 'bg-charcoal-900 border border-amber-500/50 text-amber-300 hover:bg-amber-950'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{autoPlay ? 'Auto-Advancing (90s)' : 'Start Auto Tour'}</span>
          </button>
        </div>
      </div>

      {/* STEP PROGRESS INDICATOR (01 / 06) */}
      <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-5 shadow-workstation space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{stepTitles[currentStep - 1]}</span>
          </span>
          <span className="text-white font-extrabold text-base bg-charcoal-900 px-3 py-1 rounded border border-graphite-border">
            0{currentStep} / 0{totalSteps}
          </span>
        </div>

        {/* 6 Step Progress Segments */}
        <div className="grid grid-cols-6 gap-2">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isPassed = stepNum < currentStep;

            return (
              <button
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`h-3 rounded transition-all cursor-pointer ${
                  isActive
                    ? 'bg-industrial-orange ring-2 ring-orange-500/60'
                    : isPassed
                    ? 'bg-emerald-500'
                    : 'bg-charcoal-700 hover:bg-slate-600'
                }`}
                title={title}
              />
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-charcoal-800 border border-graphite-border rounded-lg p-6 sm:p-8 shadow-workstation min-h-[500px] flex flex-col justify-between space-y-8">
        
        {/* STEP 01: Upload */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-graphite-border pb-4">
              <span className="font-mono text-xs text-industrial-orange uppercase font-bold tracking-widest">
                Stage 01
              </span>
              <h2 className="text-2xl font-bold text-white">Upload Hardware Object</h2>
              <p className="text-xs text-slate-400 mt-1">
                Demo image seeded automatically for instant evaluation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[16/10] bg-charcoal-900 rounded-lg overflow-hidden border border-graphite-border shadow-hud">
                <img src={item.fullImageUrl} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-charcoal-900/90 border border-graphite-border px-3 py-1 rounded text-xs font-mono text-white font-bold">
                  Target Object: {item.name}
                </div>
              </div>

              <div className="space-y-4 bg-charcoal-900 p-6 rounded-lg border border-graphite-border">
                <h3 className="font-bold text-lg text-white">Input Telemetry Verified</h3>
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Category: Front-Loading Washing Machine</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Resolution: 1920x1080 · 60fps acoustic stream</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>User Symptom Reported: Grinding noise on drain cycle</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 02: Visual Telemetry Scan */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-graphite-border pb-4 flex justify-between items-center">
              <div>
                <span className="font-mono text-xs text-industrial-orange uppercase font-bold tracking-widest">
                  Stage 02
                </span>
                <h2 className="text-2xl font-bold text-white">AI Visual Telemetry Scan</h2>
              </div>
              <span className="px-3 py-1 rounded bg-orange-950 border border-orange-500/40 text-orange-400 font-mono text-xs font-bold">
                Issue: {item.primaryIssue.name} (87% confidence)
              </span>
            </div>

            <DetectionOverlay
              imageUrl={item.fullImageUrl}
              markers={item.markers}
              activeMarkerId={item.markers[0].id}
            />
          </div>
        )}

        {/* STEP 03: Repairability */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-graphite-border pb-4">
              <span className="font-mono text-xs text-industrial-orange uppercase font-bold tracking-widest">
                Stage 03
              </span>
              <h2 className="text-2xl font-bold text-white">Repairability Score Evaluation</h2>
            </div>

            <RepairabilityScore score={item.repairability} />
          </div>
        )}

        {/* STEP 04: Compare Savings */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-graphite-border pb-4">
              <span className="font-mono text-xs text-industrial-orange uppercase font-bold tracking-widest">
                Stage 04
              </span>
              <h2 className="text-2xl font-bold text-white">Repair vs Replace Cost Comparison</h2>
            </div>

            <RepairVsReplace
              repairCost={item.repairCostRange}
              replaceCost={item.replaceCost}
              potentialSavings={item.potentialSavings}
              estimatedTime={item.estimatedTime}
              difficulty={item.difficulty}
            />
          </div>
        )}

        {/* STEP 05: Repair Guide */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-graphite-border pb-4 flex justify-between items-center">
              <div>
                <span className="font-mono text-xs text-industrial-orange uppercase font-bold tracking-widest">
                  Stage 05
                </span>
                <h2 className="text-2xl font-bold text-white">Step-by-Step Guided Repair</h2>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-bold">
                5 Interactive Steps Available
              </span>
            </div>

            <div className="bg-charcoal-900 border border-graphite-border p-6 rounded-lg space-y-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded bg-industrial-orange text-white font-mono text-xs font-bold">
                  STEP 01
                </span>
                <h3 className="font-bold text-lg text-white">{item.repairSteps[0].title}</h3>
              </div>
              <p className="text-xs text-slate-300">{item.repairSteps[0].description}</p>
              
              <Link
                href="/repair"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-charcoal-800 border border-graphite-border hover:border-industrial-orange text-xs font-mono text-slate-200 hover:text-white"
              >
                <span>Launch Full 5-Step Repair Manual →</span>
              </Link>
            </div>
          </div>
        )}

        {/* STEP 06: Impact */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-graphite-border pb-4">
              <span className="font-mono text-xs text-industrial-orange uppercase font-bold tracking-widest">
                Stage 06
              </span>
              <h2 className="text-2xl font-bold text-white">Sustainability & E-Waste Impact</h2>
            </div>

            <ImpactCalculator impact={item.impact} />

            <div className="bg-emerald-950/60 border border-emerald-500/40 p-6 rounded-lg text-center space-y-3">
              <h3 className="text-xl font-bold text-white">Demo Tour Complete!</h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto">
                You have evaluated the entire RepairBeforeReplace hardware diagnosis lifecycle.
              </p>
              <div className="pt-2 flex justify-center space-x-4">
                <Link
                  href="/diagnose"
                  className="px-6 py-2.5 rounded bg-industrial-orange hover:bg-orange-600 text-white font-mono text-xs font-bold"
                >
                  Try Diagnostic Workstation →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TOUR STEP NAVIGATION FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-graphite-border">
          <button
            onClick={() => setCurrentStep(c => Math.max(1, c - 1))}
            disabled={currentStep === 1}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded font-mono text-xs font-bold transition-all ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed bg-charcoal-900 text-slate-500'
                : 'bg-charcoal-900 border border-graphite-border text-slate-200 hover:border-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Stage</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(c => c + 1)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-industrial-orange hover:bg-orange-600 text-white font-mono text-xs font-bold transition-all shadow-sm"
            >
              <span>Next Stage (0{currentStep + 1}) →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/diagnose"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all"
            >
              <span>Launch Live Workstation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

      </div>

    </div>
  );
};
